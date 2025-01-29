<script setup>
import { ref  } from 'vue';
import playerImgSrc from "./assets/image/player.png";
import treeImgSrc from "./assets/image/tree.png";


const savedData = localStorage.getItem('gameData')  // retrive data from localstorage if exist 
// Game Data State
const gameData = ref(
  savedData ? JSON.parse(savedData) : 
  {
    highScore: 0,
    money: 0,
    skin: {
      equipped: playerImgSrc,
      owned: [],
    },
    playerSkills: {
      extraScore: false,  // have extra score
      shotgunSkill: 0,  // number of bullet
      mugen: false,   // is on mugen mode or not
    }
  }
)
// Example of using gameData state 
console.log('Highscore :', gameData.value.highScore)
// Save Game Data before player exit
window.addEventListener('beforeunload',(e) => {
  localStorage.setItem('gameData',JSON.stringify(gameData.value))
})

const page = ref('home');

const canvas = ref(null);
const score = ref(0);
// Function For clean up interval and others when game is ended
let gameCleanup = null

const initializeGame = () => {
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
      if (onEnemieCollision(player, tree) && !gameData.value.playerSkills.mugen) {
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
    } else if (gameover) {
      return;
    } else if ((e.code === "KeyW") && (player.y === player.baseY)) {
      physics.velocityY = -10;
    } else if ((e.code === "KeyS") && (player.y < player.baseY)) {
      physics.velocityY = 30;
    } else if ((e.code === "KeyQ") && ((gameData.value.playerSkills.shotgunSkill > 0) && (gameData.value.playerSkills.shotgunSkill <= 3))) { // add more condition Eg. if there is no skill left cant use this (go buy more in shop)
      enemyArray.splice(0, enemyArray.length);
      gameData.value.playerSkills.shotgunSkill -= 1;
    } else if ((e.code === "KeyE" && !gameData.value.playerSkills.mugen && (true))) { // add more condition Eg. if in cooldown state cant use this
      gameData.value.playerSkills.mugen = true
      setTimeout(()=>{
        gameData.value.playerSkills.mugen = false
        console.log('Deactive Skill : Ghost Mode after 5 sec'); // Debug Ghost Skill
      }, 5000)
      console.log('Active Skill : Ghost Mode'); // Debug Ghost Skill
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
  page.value = 'game'
  gameCleanup = initializeGame();
}

const handleBackHome = () => {
  page.value = 'home'
  endGame();
}

const handleOpenShop = () => {
  page.value = 'shop'
  endGame();
}

const handleCloseShop = () => {
  page.value = 'game'
  gameCleanup = initializeGame();
}

const handleOpenTutorial = () => {
  page.value = 'tutorial'
  endGame()
}
const handleCloseTutorial = () => {
  page.value = 'home'
}

const scrollslide = ref(null)
const goright = () => {
  if (scrollslide.value) {
    scrollslide.value.scrollLeft += 550;
  }
};
const goleft = () => {
  if (scrollslide.value) {
    scrollslide.value.scrollLeft -= 550;
  }
};

const TutorialData = [
  {
    id :1 ,
    img : "To1.jpg",
    p1 : "About game",
    p2 : "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil"

  },
  {
    id :2 ,
    img : "To2.jpg",
    p1 : "Skin and skills",
    p2 : "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil"

  },
  {
    id :3 ,
    img : "To3.jpg",
    p1 : "Scoreboard",
    p2 : "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil"

  }
]
// Shop
// Shotgun Ammo
const handleShotgunSkill = () => {
  if (gameData.value.playerSkills.shotgunSkill < 3) {
    gameData.value.playerSkills.shotgunSkill++;
  }
}

</script>

<template>
  <!-- Home Page -->
  <section 
    v-if="page === 'home'"
    class=" z-50  z- bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div class="w-full max-w-[97%] h-[calc(100vh-3rem)] border border-white flex flex-col gap-10 items-center p-10 rounded-xl bg-white">
      <h1 class="text-4xl font-bold text-center">Home Page</h1>
      <button class="btn mt-4 bg-black/80 py-8 px-16 text-white rounded active:bg-black/50" @click="handleStartGame">
        Start
      </button>

      <button class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50 float-right mx-5" @click="handleOpenTutorial">
      ?
    </button>
    </div>
  </section>

  <!-- Tutorial Page -->
  <section v-else-if="page === 'tutorial'" 
    class="z-50 bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
  <div class="container flex h-full my-auto items-center justify-center" id="container">
    <div class="" id="slide-wrapper">
      <ul class="max-w-150 h-200 flex my-20 overflow-x-auto aspect-video scrollbar-hidden snap-x scroll-smooth" id="slide-list" ref="scrollslide">
        <li class="list-style-none group min-w-150  my-auto  snap-start object-cover" id="slide-item1" v-for="data in TutorialData" :key="data.id" >
          <div class="w-full rounded-xl bg-white p-5 text-none border-1 hover:border-blue-300 flex flex-col" id="slide-link"> 
            <img :src="`/src/assets/image/${data.img}`" class="w-full rounded-lg aspect-video object-cover mb-3" id="slide-image" >
            <p class=" text-blue-500 font-medium px-2 py-1 mx-1  mb-4 mt-2 bg-blue-100 rounded-full w-fit border-1 text-xs">
              {{ data.p1 }}
            </p>
            <h2 class="text-lg text-black font-semibold" id="slide-title">{{ data.p2 }}</h2>
            <div class="flex flex-col">
              <div class="my-3 flex flex-row justify-around">
                <button v-on:click="goleft" class="h-8 w-8 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white"><</button>
                <button v-on:click="goright" class="h-8 w-8 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white">></button>
              </div>
              <div class="justify-center align-center flex flex-row">
                <button @click="handleCloseTutorial" class="h-8 w-18 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white ">back</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
   </section>

  <!-- Shop Page -->
  <section
    v-else-if="page === 'shop'"
    class="z-50 bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div class="w-full max-w-xl border border-white flex flex-col gap-10 items-center p-10 rounded-xl bg-white">
      <button
        class="btn bg-red-600 py-2 px-4 text-white rounded active:bg-red-600/50"
        @click="handleCloseShop">
        Close
      </button>
      <h1>Shop</h1>
      <h4>Shotgun Ammo</h4>
      <p>Amount: {{ gameData.playerSkills.shotgunSkill }}</p>
      <button
        class="btn bg-black py-2 px-4 text-white rounded active:bg-black/50"
        @click="handleShotgunSkill">
        Buy
      </button>
    </div>
  </section>

  
  
  <!-- Game Page -->
  <section 
    class="bg-base-100 max-w-screen-xl mx-auto flex">
    <!-- <button class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50 float-right mx-5" @click="handleOpenTutorial">
      ?
    </button> -->
    <div class="mx-auto">

      <div class="flex gap-5 py-5">
        <button class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50" @click="handleBackHome">
          Back to home
        </button>
        <button class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50" @click="handleOpenShop">
          Shop
        </button>

        <h1 class="text-3xl ml-auto">Score: {{ score }}</h1>
      </div>

      

      <div class="relative border">
        <canvas 
        ref="canvas" 
        class="bg-blue-100 border-b-[15px] border-b-orange-950 mx-auto"
        > </canvas>

        <div class="absolute top-5 left-5 flex gap-3">
          <div class="bg-orange-500 rounded-full text-white size-15 flex items-center justify-center">
            {{ gameData.playerSkills.shotgunSkill }}
          </div>
          <div class="bg-orange-500 rounded-full text-white size-15 flex items-center justify-center">
            {{ gameData.playerSkills.mugen ? 'mugen!!' : 'not mugen' }}
          </div>
        </div>
      </div>
      
      <h2 class="text-3xl mt-3">
        Press "Space" to restart
      </h2>

      
      <!-- Debug highscore -->
      <!-- <button class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50" @click="gameData = null">
        Emergency Reset
      </button> -->
    </div>
  </section>
</template>


<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>