import { onEnemieCollision, onScoreCollision } from "./collision";
import facebookEnemyImgSrc from "../assets/image/facebook-enemy.png";
import robloxEnemyImgSrc from "../assets/image/roblox-enemy.png";
import tiktokEnemyImgSrc from "../assets/image/tiktok-enemy.png";
import shotgunImgSrc from "../assets/image/shotgun.png";
import mugenImgSrc from "../assets/image/mugen.png";
import shotgunSound from '../assets/sounds/shotgun.mp4'

export const initializeGame = (canvas, gameData) => {
  // Canvas Setup
  const context = canvas.value.getContext("2d");
  const boardW = 1000;
  const boardH = 450;

  canvas.value.width = boardW;
  canvas.value.height = boardH;

  // Player Model Setup
  // Img
  const defaultPlayerImg = new Image();
  const shotgun = new Image();
  const mugen = new Image();
  defaultPlayerImg.src = gameData.value.skin.equipped;
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
  const groundEnemyModel = {
    w: 70,
    h: 105,
    x: 920,
    y: boardH - 105,
    img: new Image(),
    speed: -3, // speed to the left side of canvas
  };
  groundEnemyModel.img.src = facebookEnemyImgSrc;

  // Airenemy Model Setup
  

  // Physics Setup
  const physics = {
    velocityY: 0, // ความแรงในการกระโดด
    gravity: 0.23,
  };

  const enemyArray = []; // contain all the enemy in the map
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
    if (gameData.value.playerSkills.extraScore) {
      context.fillStyle = "red";
      context.fillText("x2", boardW / 2 - 90, 30);
      context.fillStyle = "black";
      context.fillText("score : " + score, boardW / 2 - 60, 30);
    } else {
      context.fillText("score : " + score, boardW / 2 - 50, 30);
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
        gameData.value.playerSkills.mugen.active <= 0
      ) {
        gameover = true;
        context.font = "normal bold 20px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";

        // convert score to money
        const money = Math.round(score / 100) * 10;
        gameData.value.money += money;

        context.fillText("Game Over!", boardW / 2, boardH / 2);
        context.fillText(`Money: ${money}`, boardW / 2, boardH / 2 + 30);
        cancelAnimationFrame(animationFrameId);

        // Set new Highscore
        if (gameData.value.highScore < score) {
          context.fillStyle = "red";
          context.fillText(
            "You Achive New High Score!",
            boardW / 2,
            boardH / 2 - 30
          );
          gameData.value.highScore = score;
        }
      } else if (onScoreCollision(player, tree)) {
        if (gameData.value.playerSkills.extraScore) {
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

    const treeEnemy = Object.create(groundEnemyModel);
    enemyArray.push(treeEnemy);

    if (enemyArray.length > 5) {
      // clear enemy
      enemyArray.shift();
    }
  }, 1200);

  // เพิ่มความเร็วของ Enemy ขึ้น 0.5 ทุกๆ 1 วิ
  speedInterval = setInterval(() => {
    if (!gameover && groundEnemyModel.speed >= -20) {
      groundEnemyModel.speed -= 0.5;
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
      gameData.value.playerSkills.shotgunSkill > 0 &&
      gameData.value.playerSkills.mugen.active <= 0
    ) {
      enemyArray.splice(0, enemyArray.length);
      gameData.value.playerSkills.shotgunSkill -= 1;

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
      gameData.value.playerSkills.mugen.active <= 0 &&
      gameData.value.playerSkills.mugen.cooldown <= 0
    ) {
      player.img = mugen;
      player.w = 108;
      player.h = 107;
      player.y = defaultY - 31;
      player.baseY = defaultY - 31;

      // Show countdown for active skill
      gameData.value.playerSkills.mugen.active = 5;
      const clearInt1 = setInterval(() => {
        --gameData.value.playerSkills.mugen.active;
        if (gameData.value.playerSkills.mugen.active <= 0) {
          clearInterval(clearInt1);
          player.img = defaultPlayerImg;
          player.w = defaultWidth;
          player.h = defaultHeight;
          player.baseY = defaultY;
        }
      }, 1000);

      // Set Cooldown after deactive skill
      setTimeout(() => {
        gameData.value.playerSkills.mugen.active = 0;
        gameData.value.playerSkills.mugen.cooldown = 15;
        const clearInt2 = setInterval(() => {
          --gameData.value.playerSkills.mugen.cooldown;
          if (gameData.value.playerSkills.mugen.cooldown <= 0) {
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
    gameData.value.playerSkills.mugen.active = 0
    gameData.value.playerSkills.mugen.cooldown = 0
    cancelAnimationFrame(animationFrameId);
    clearInterval(enemyInterval);
    clearInterval(speedInterval);
    document.removeEventListener("keydown", handleKeydown);
    gameData.value.playerSkills.extraScore = false;
  };
};
