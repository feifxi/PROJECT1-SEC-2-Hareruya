<script setup>
import { ref } from 'vue';
import playerImgSrc from "./assets/image/player.png";
import treeImgSrc from "./assets/image/tree.png";

const showHomePage = ref(true);
const canvas = ref(null);
const score = ref(0);

const initializeGame = () => {
  // Canvas Setup
  const context = canvas.value.getContext("2d");
  const boardW = 800;
  const boardH = 300;
  
  canvas.value.width = boardW;
  canvas.value.height = boardH;

  // Player setup
  const playerW = 64;
  const playerH = 64;
  const playerX = 50;
  const playerY = boardH - playerH;
  const playerImg = new Image();
  playerImg.src = playerImgSrc;

  const player = {
    x: playerX,
    y: playerY,
    w: playerW,
    h: playerH,
  };

  // Physics Setup 
  let velocityY = 0;
  const gravity = 0.23;

  // Enemy Setup
  const treeW = 70;
  const treeH = 105;
  let treeX = 750;
  let treeY = boardH - treeH;
  const treeImg = new Image();
  treeImg.src = treeImgSrc;

  const treeArray = [];
  let treeSpeed = -3;

  // เพื่อ Clean up หลังการ reset game หรือ component unmounted
  let gameover = false;
  let animationFrameId; // Track animation frame
  let enemyInterval;
  let speedInterval;

  const update = () => {
    if (gameover) return;
    animationFrameId = requestAnimationFrame(update);
    
    context.clearRect(0, 0, boardW, boardH);

    // Handle Player Object
    velocityY += gravity; // ในแต่ละ frame ความแรงจะถูกหักกับแรงโน้มถ่วงจนเป็น 0 และถูกดึงลงพื้นในที่สุด
    player.y = Math.min(player.y + velocityY, playerY); // player ตกลงสู่พื้นเท่านั้น ไม่มุดลงดิน

    // Handle Enemy Object
    for (let i = 0; i < treeArray.length; i++) {
      const tree = treeArray[i];
      tree.x += treeSpeed;
      context.drawImage(tree.img, tree.x, tree.y, tree.w, tree.h);
      // Collision checking
      if (onEnemieCollision(player, tree)) {
        gameover = true;
        context.font = "normal bold 20px Arial";
        context.textAlign = "center";
        context.fillText("Game Over!", boardW / 2, boardH / 2);
        cancelAnimationFrame(animationFrameId);
      }
      if (onScoreCollision(player, tree)) {
        score.value++;
      }
    }

    context.drawImage(playerImg, player.x, player.y, player.w, player.h);
  };

  // สร้าง Enemy ทุกๆ 1 วิ
  enemyInterval = setInterval(() => {
    if (gameover) return;
    const tree = {
      img: treeImg,
      x: treeX,
      y: treeY,
      w: treeW,
      h: treeH,
    };
    treeArray.push(tree);
    if (treeArray.length > 5) {
      treeArray.shift();
    }
  }, 1000);
  // เพิ่มความเร็วของ Enemy ขึ้น 0.5 ทุกๆ 1 วิ
  speedInterval = setInterval(() => {
    if (!gameover) {
      treeSpeed -= 0.5;
    }
  }, 1000);

  // Collision Checker
  function onEnemieCollision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.w &&
      obj1.x + obj1.w > obj2.x &&
      obj1.y < obj2.y + obj2.h &&
      obj1.y + obj1.h > obj2.y
    );
  }
  function onScoreCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x;
  }

  const handleKeydown = (e) => {
    if (e.code === "Space" && player.y < playerY) {
      resetGame();
    } else if (e.code === "KeyW" && player.y === playerY) {
      velocityY = -10;
    } else if (e.code === "KeyS" && player.y < playerY) {
      velocityY = 50;
    } else if (e.code === "KeyQ") {
      console.log('Active Skill');
      treeArray.splice(0, treeArray.length);
    }
  };

  // เมื่อรูป player โหลดเสร็จแล้ว
  playerImg.onload = () => {
    context.drawImage(playerImg, player.x, player.y, playerW, playerH);
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

const resetGame = () => {
  // Stop any existing game
  gameCleanup();
  
  // นับ score ใหม่ และเซท clecup ฟังก์ชันสำหรับเกมถัดไป
  score.value = 0;
  gameCleanup = initializeGame();
};

// เริ่มเกม
let gameCleanup = null


const handleStartGame = () => {
  showHomePage.value = false
  gameCleanup = initializeGame();
}

const handleBackHome = () => {
  showHomePage.value = true
  resetGame();
}
</script>


<template>
  <!-- Home Page -->
  <section 
    v-if="showHomePage"
    class=" bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center"
  >
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
      <button class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50" @click="resetGame">
        Reset Game
      </button>

      <button class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50" @click="handleBackHome">
        Back to home
      </button>
    </div>
  </section>
</template>


<style scoped>
</style>