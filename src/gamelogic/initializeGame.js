import { onEnemieCollision, onScoreCollision } from "./collision";
import treeImgSrc from "../assets/image/tree.png";

export const initializeGame = (canvas, gameData) => {
    // Canvas Setup
    const context = canvas.value.getContext("2d");
    const boardW = 1000;
    const boardH = 450;
    
    canvas.value.width = boardW;
    canvas.value.height = boardH;    

    // Player Model Setup (w,h is for player size x,y is for player position)
    const player = {
        w: 64,
        h: 64,
        x: 50,
        y: boardH - 64,  // start at the ground
        baseY: boardH - 64, // ground postion of player (board height - player height)
        img: new Image()
    };
    player.img.src = gameData.value.skin.equipped;

    // Enemy Model Setup
    const treeModel = {
        w: 70,
        h: 105,
        x: 920,
        y: boardH - 105,  
        img: new Image(),
        speed: -3   // speed to the left side of canvas
    };
    treeModel.img.src = treeImgSrc

    // Physics Setup 
    const physics = {
      velocityY: 0,   // ความแรงในการกระโดด
      gravity: 0.23,
    }

    const enemyArray = [];  // contain all the enemy in the map
    let score = 0   

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
        context.fillStyle = 'red'
        context.fillText('x2', boardW / 2 - 90 , 30);
        context.fillStyle = 'black'
        context.fillText('score : ' + score, boardW / 2 - 60 , 30);
      }
      else {
        context.fillText('score : ' + score, boardW / 2 - 50 , 30);
      }

      // Handle Player Movement
      physics.velocityY += physics.gravity; // Gravity Simulation -> ในแต่ละ frame velocity จะถูกหักกับ gravity จนค่าเป็น 0 และ player ถูกดึงลงพื้นในที่สุด
      player.y = Math.min(player.y + physics.velocityY, player.baseY); // playerY จะถูกอัปเดตโดยอิงจาก ตน.ปัจจุบัน + velocity (และ player ตกลงสู่พื้นเท่านั้น ไม่มุดลงดิน)
      context.drawImage(player.img, player.x, player.y, player.w, player.h);  // draw updated player to the canvas
  
      // Handle Enemy Movement
      for (let i = 0; i < enemyArray.length; i++) {
        const tree = enemyArray[i];
        tree.x += tree.speed;
        context.drawImage(tree.img, tree.x, tree.y, tree.w, tree.h);
  
        // Collision checking
        if (onEnemieCollision(player, tree) && !gameData.value.playerSkills.mugen.active) {
          gameover = true;
          context.font = "normal bold 20px Arial";
          context.fillStyle = 'black'
          context.textAlign = "center";
          context.fillText("Game Over!", boardW / 2, boardH / 2);
          cancelAnimationFrame(animationFrameId);
        // Set new Highscore
          if (gameData.value.highScore < score) {
            context.fillStyle = 'red'
            context.fillText("You Achive New High Score!", boardW / 2, boardH / 2 - 30);
            gameData.value.highScore = score;   
          }
        }
        else if (onScoreCollision(player, tree)) {
            if (gameData.value.playerSkills.extraScore) {
                score += 2
            }
            else {
                score++;
            }
        }
      }
    };
  
    // สร้าง Enemy ทุกๆ 1.5 วิ
    enemyInterval = setInterval(() => {
      if (gameover) return;
  
      const treeEnemy = Object.create(treeModel)
      enemyArray.push(treeEnemy)
  
      if (enemyArray.length > 5) {  // clear enemy 
        enemyArray.shift();
      }
    }, 1500);
  
    // เพิ่มความเร็วของ Enemy ขึ้น 0.5 ทุกๆ 1 วิ
    speedInterval = setInterval(() => {
      if (!gameover) {
        treeModel.speed -= 0.5;
      }
    }, 1000);


    const handleKeydown = (e) => {
        if (gameover) {
          return;
        } else if (e.code === "KeyW" && player.y === player.baseY) {
          physics.velocityY = -10;
        } else if (e.code === "KeyS" && player.y < player.baseY) {
          physics.velocityY = 30;
        } else if (e.code === "KeyQ" && gameData.value.playerSkills.shotgunSkill > 0) { // add more condition Eg. if there is no skill left cant use this (go buy more in shop)
          enemyArray.splice(0, enemyArray.length);
          gameData.value.playerSkills.shotgunSkill -= 1;
        } else if (e.code === "KeyE" && gameData.value.playerSkills.mugen.active <= 0  && gameData.value.playerSkills.mugen.cooldown <= 0) { // add more condition Eg. if in cooldown state cant use this
          // Show countdown for active skill
          gameData.value.playerSkills.mugen.active = 5
          const clearInt1 = setInterval(()=>{
            --gameData.value.playerSkills.mugen.active
            if (gameData.value.playerSkills.mugen.active <= 0) {
                clearInterval(clearInt1)
            }
          }, 1000)
          // Set Cooldown after deactive skill
          setTimeout(()=>{
            gameData.value.playerSkills.mugen.active = 0
            gameData.value.playerSkills.mugen.cooldown = 15
            const clearInt2 = setInterval(() => {
                --gameData.value.playerSkills.mugen.cooldown
                if (gameData.value.playerSkills.mugen.cooldown <= 0) {
                    clearInterval(clearInt2)
                }
            }, 1000)
          }, 5000)
        }
    };
    
    // เมื่อรูป player โหลดเสร็จแล้ว
    player.img.onload = () => {
      animationFrameId = requestAnimationFrame(updateAnimation);
      document.addEventListener("keydown", handleKeydown);
    };
  
    // Return cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(enemyInterval);
      clearInterval(speedInterval);
      document.removeEventListener("keydown", handleKeydown);
    };
  };