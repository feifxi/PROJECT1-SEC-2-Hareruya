<script setup>
import { ref } from 'vue';
import playerImgSrc from "./assets/image/player.png";
import treeImgSrc from "./assets/image/tree.png";

const showHomePage = ref(true);
const canvas = ref(null);
const score = ref(0);
// Function For clean up interval and others when game is ended
let gameCleanup = null

const initializeGame = () => {
  // Canvas Setup
  const context = canvas.value.getContext("2d");
  const boardW = 800;
  const boardH = 300;
  
  canvas.value.width = boardW;
  canvas.value.height = boardH;

  // Player Model Setup (w,h is for player size x,y is for player position)
  const player = {
    w: 64,
    h: 64,
    x: 50, 
    y: boardH - 64,  // start at the ground
    baseY: boardH - 64, // ground postion of player (board height - player height)
    img: new Image(),
    skill: {
      ghostMode: false,
      clearMap: 3,
    }
  };
  player.img.src = playerImgSrc


  // Enemy Model Setup
  const treeModel = {
    w: 70,
    h: 105,
    x: 750,
    y: boardH - 105,  
    img: new Image(),
    speed: -3   // speed to the left side of canvas
  };
  treeModel.img.src = treeImgSrc
  
  const enemyArray = [];  // contain all the enemy in the map


  // Physics Setup 
  const physics = {
    velocityY: 0,   // ความแรงในการกระโดด
    gravity: 0.23,
  }

  // เพื่อ Clean up หลังการ reset game หรือ component unmounted
  let gameover = false;
  let animationFrameId; // Track animation frame
  let enemyInterval;
  let speedInterval;


  // Animation Handler
  const update = () => {
    if (gameover) return;
    animationFrameId = requestAnimationFrame(update); // recursive for infinite animation
    context.clearRect(0, 0, boardW, boardH);

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
      if (onEnemieCollision(player, tree) && !player.skill.ghostMode) {
        gameover = true;
        context.font = "normal bold 20px Arial";
        context.textAlign = "center";
        context.fillText("Game Over!", boardW / 2, boardH / 2);
        cancelAnimationFrame(animationFrameId);
      }
      else if (onScoreCollision(player, tree)) {
        score.value++;
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

  // Collision Checker
  function onEnemieCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x &&   // check width
      obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y    // check height
    );
  }
  function onScoreCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x;  // check width only
  }

  const handleKeydown = (e) => {
    if (e.code === "Space") {
      restartGame();
    } else if ((e.code === "KeyW") && (player.y === player.baseY)) {
      physics.velocityY = -10;
    } else if ((e.code === "KeyS") && (player.y < player.baseY)) {
      physics.velocityY = 30;
    } else if ((e.code === "KeyQ") && (true)) { // add more condition Eg. if there is no skill left cant use this (go buy more in shop)
      if (player.skill.clearMap > 0) {
        enemyArray.splice(0, enemyArray.length);
        player.skill.clearMap-- 
        console.log('Active Skill : Clear Map, Left : ' + player.skill.clearMap);
      }
    } else if ((e.code === "KeyE" && !player.skill.ghostMode && (true))) { // add more condition Eg. if in cooldown state cant use this
      player.skill.ghostMode = true
      setTimeout(()=>{
        player.skill.ghostMode = false
        console.log('Deactive Skill : Ghost Mode after 5 sec');
      }, 5000)
      console.log('Active Skill : Ghost Mode');
    }
  };

  // เมื่อรูป player โหลดเสร็จแล้ว
  player.img.onload = () => {
    context.drawImage(player.img, player.x, player.y, player.w, player.h);
    animationFrameId = requestAnimationFrame(update);
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

const endGame = () => {
  gameCleanup();
  score.value = 0;
}

const restartGame = () => {
  endGame();
  gameCleanup = initializeGame(); // start new game
};

// Page Handler
const handleStartGame = () => {
  showHomePage.value = false
  gameCleanup = initializeGame();
}

const handleBackHome = () => {
  showHomePage.value = true
  endGame();
}
</script>

<template>
  <!-- Home Page -->
  <section 
    v-if="showHomePage"
    class=" bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div class="w-full max-w-xl border border-white flex flex-col gap-10 items-center p-10 rounded-xl bg-white">
      <h1 class="text-4xl font-bold text-center">Home Page</h1>
      <button class="btn mt-4 bg-black/80 py-8 px-16 text-white rounded active:bg-black/50" @click="handleStartGame">
        Start
      </button>
    </div>
  </section>
  
  <!-- Game Page -->
  <section 
    class="bg-base-100 max-w-screen-xl mx-auto py-14">
    <div class="mx-auto flex flex-col items-center">
      <h1 class="text-3xl mb-5">Score: {{ score }}</h1>
      <canvas 
        ref="canvas" 
        class="bg-blue-100 border-b-[15px] border-b-orange-950"
      ></canvas>
      <h2 class="text-3xl mt-3">
        Press "Space" to restart
      </h2>

      <button class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50" @click="handleBackHome">
        Back to home
      </button>
    </div>
  </section>
</template>


<style scoped>
</style>