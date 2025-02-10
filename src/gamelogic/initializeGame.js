import { onEnemieCollision, onScoreCollision } from "./collision";
import facebookEnemyImgSrc from "../assets/image/sprites/facebook-enemy.png";
import robloxEnemyImgSrc from "../assets/image/sprites/roblox-enemy.png";
import tiktokEnemyImgSrc from "../assets/image/sprites/tiktok-enemy.png";
import fivemEnemyImgSrc from "../assets/image/sprites/fivem-enemy.png";
import instagramImgSrc from "../assets/image/sprites/instagram-enemy.png";
import shotgunImgSrc from "../assets/image/sprites/shotgun.png";
import mugenImgSrc from "../assets/image/sprites/mugen.png";
import shotgunSound from '../assets/sounds/shotgun.mp4'

export const initializeGame = (canvas, gameData) => {
  // Canvas Setup
  const context = canvas.value.getContext("2d");
  const boardW = 1000;
  const boardH = 450;

  canvas.value.width = boardW;
  canvas.value.height = boardH;

  // Player Model Setup
  // Skin Img
  const defaultPlayerImg = new Image();
  const shotgun = new Image();
  const mugen = new Image();
  defaultPlayerImg.src = gameData.skin.equipped;
  shotgun.src = shotgunImgSrc;
  mugen.src = mugenImgSrc;

  // Default Width, Height & y position
  const defaultWidth = 62;
  const defaultHeight = 76;
  const defaultY = boardH - 76;

  const player = {
    w: defaultWidth,
    h: defaultHeight,
    x: 50,
    y: defaultY, // start at the ground
    baseY: defaultY, // ground postion of player (board height - player height)
    img: defaultPlayerImg,
  };

  // Enemy Model Setup
  // Skin Img
  const tiktokEnemyImg = new Image();
  const facebookEnemyImg = new Image();
  const fivemEnemyImg = new Image();
  const robloxEnemyImg = new Image();
  const instagramImg = new Image();
  tiktokEnemyImg.src = tiktokEnemyImgSrc;
  facebookEnemyImg.src = facebookEnemyImgSrc;
  fivemEnemyImg.src = fivemEnemyImgSrc;
  robloxEnemyImg.src = robloxEnemyImgSrc;
  instagramImg.src = instagramImgSrc;

  const enemySkins = [
    tiktokEnemyImg, 
    facebookEnemyImg,
    fivemEnemyImg, 
    robloxEnemyImg,
    instagramImg
  ];

  const enemyModel = {
    w: 70,
    h: 105,
    x: 920,
    y: boardH - 105,
    img: tiktokEnemyImg,
    speed: -3, // speed to the left side of canvas
  };

  const enemyArray = []; // contain all the enemy in the map  

  // Physics Setup
  const physics = {
    velocityY: 0, // ความแรงในการกระโดด
    gravity: 0.23,
  };


  let score = 0;

  // เพื่อ Clean up หลังการ reset game หรือ component unmounted
  let gameover = false;
  let animationFrameId; // Track animation frame
  let enemyInterval;
  let speedInterval;

  // Animation Handler
  const updateAnimation = () => {
    if (gameover) return;
    animationFrameId = requestAnimationFrame(updateAnimation); // recursive for infinite animation
    context.clearRect(0, 0, boardW, boardH);

    // Handle Score
    context.font = "normal bold 20px Arial";
    if (gameData.playerSkills.extraScore) {
      context.fillStyle = "red";
      context.fillText("x2", boardW / 2 - 90, 30);
      context.fillStyle = "black";
      context.fillText("Score : " + score, boardW / 2 - 60, 30);
    } else {
      context.fillText("Score : " + score, boardW / 2 - 50, 30);
    }

    // Handle Player Movement
    physics.velocityY += physics.gravity; // Gravity Simulation -> ในแต่ละ frame velocity จะถูกหักกับ gravity จนค่าเป็น 0 และ player ถูกดึงลงพื้นในที่สุด
    player.y = Math.min(player.y + physics.velocityY, player.baseY); // playerY จะถูกอัปเดตโดยอิงจาก ตน.ปัจจุบัน + velocity (และ player ตกลงสู่พื้นเท่านั้น ไม่มุดลงดิน)
    context.drawImage(player.img, player.x, player.y, player.w, player.h); // draw updated player to the canvas

    // Handle Enemy Movement
    for (let i = 0; i < enemyArray.length; i++) {
      const tree = enemyArray[i];
      tree.x += tree.speed;
      context.drawImage(tree.img, tree.x, tree.y, tree.w, tree.h);

      // Collision checking
      if (
        onEnemieCollision(player, tree) &&
        gameData.playerSkills.mugen.active <= 0
      ) {
        gameover = true;
        context.font = "normal bold 20px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";

        // convert score to money
        const money = Math.round(score / 100) * 10;
        gameData.money += money;

        context.fillText("Game Over!", boardW / 2, boardH / 2);
        context.fillText(`Money: ${money}`, boardW / 2, boardH / 2 + 30);
        cancelAnimationFrame(animationFrameId);

        // Set new Highscore
        if (gameData.highScore < score) {
          context.fillStyle = "red";
          context.fillText(
            "You Achive New High Score!",
            boardW / 2,
            boardH / 2 - 30
          );
          gameData.highScore = score;
        }
      } else if (onScoreCollision(player, tree)) {
        if (gameData.playerSkills.extraScore) {
          score += 2;
        } else {
          score++;
        }
      }
    }
  };

  // สร้าง Enemy ทุกๆ 1.5 วิ
  enemyInterval = setInterval(() => {
    if (gameover) return;
    
    // Use index to select enemy by theme
    const treeEnemy = Object.create(enemyModel);
    treeEnemy.img = enemySkins[Math.floor(Math.random() * enemyArray.length)]
    // Random fly enemy
    const randomProp = Math.floor(Math.random() * 5)
    if (randomProp === 0) {
      treeEnemy.y = boardH - 210
    }
    enemyArray.push(treeEnemy);

    if (enemyArray.length > 5) {
      // clear enemy
      enemyArray.shift();
    }
  }, 1200);

  // เพิ่มความเร็วของ Enemy ขึ้น 0.5 ทุกๆ 1 วิ
  speedInterval = setInterval(() => {
    if (!gameover && enemyModel.speed >= -20) {
      enemyModel.speed -= 0.5;
    }
  }, 1000);

  const handleKeydown = (e) => {
    if (gameover) {
      return;
    } else if (e.code === "KeyW" && player.y === player.baseY) {
      physics.velocityY = -10;
    } else if (e.code === "KeyS" && player.y < player.baseY) {
      physics.velocityY = 30;
    } else if (
      e.code === "KeyQ" &&
      gameData.playerSkills.shotgunSkill > 0 &&
      gameData.playerSkills.mugen.active <= 0
    ) {
      enemyArray.splice(0, enemyArray.length);
      gameData.playerSkills.shotgunSkill -= 1;

      // change player img skin
      player.img = shotgun;
      player.w = 107;
      setTimeout(() => {
        player.img = defaultPlayerImg;
        player.w = defaultWidth;
      }, 500);

      // Play sound effect
      const sound = new Audio(shotgunSound)
      sound.play()

    } else if (
      e.code === "KeyE" &&
      gameData.playerSkills.mugen.active <= 0 &&
      gameData.playerSkills.mugen.cooldown <= 0
    ) {
      player.img = mugen;
      player.w = 108;
      player.h = 107;
      player.baseY = defaultY - 31;

      // Show countdown for active skill
      gameData.playerSkills.mugen.active = 5;
      const clearInt1 = setInterval(() => {
        --gameData.playerSkills.mugen.active;
        if (gameData.playerSkills.mugen.active <= 0) {
          clearInterval(clearInt1);
          player.img = defaultPlayerImg;
          player.w = defaultWidth;
          player.h = defaultHeight;
          player.baseY = defaultY;
        }
      }, 1000);

      // Set Cooldown after deactive skill
      setTimeout(() => {
        gameData.playerSkills.mugen.active = 0;
        gameData.playerSkills.mugen.cooldown = 15;
        const clearInt2 = setInterval(() => {
          --gameData.playerSkills.mugen.cooldown;
          if (gameData.playerSkills.mugen.cooldown <= 0) {
            clearInterval(clearInt2);
          }
        }, 1000);
      }, 5000);
    }
  };

  // เมื่อรูป player โหลดเสร็จแล้ว
  player.img.onload = () => {
    animationFrameId = requestAnimationFrame(updateAnimation);
    document.addEventListener("keydown", handleKeydown);
  };

  // Return cleanup function
  return () => {
    gameData.playerSkills.mugen.active = 0
    gameData.playerSkills.mugen.cooldown = 0
    cancelAnimationFrame(animationFrameId);
    clearInterval(enemyInterval);
    clearInterval(speedInterval);
    document.removeEventListener("keydown", handleKeydown);
    gameData.playerSkills.extraScore = false;
  };
};
