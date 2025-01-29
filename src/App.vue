<script setup>
import { ref } from "vue";
import playerImgSrc from "./assets/image/player.png";
import { initializeGame } from "./gamelogic/initializeGame";

const savedData = localStorage.getItem("gameData"); // retrive data from localstorage if exist
// Game Data State
const gameData = ref(
  savedData
    ? JSON.parse(savedData)
    : {
        highScore: 0,
        money: 0,
        skin: {
          equipped: playerImgSrc,
          owned: [],
        },
        playerSkills: {
          extraScore: false, // have extra score
          shotgunSkill: 0, // number of bullet
        },
      }
);
// In-memory only skill
gameData.value.playerSkills.mugen = {
  active: false,
  cooldown: 0,
};

// Save Game Data before player exit
window.addEventListener("beforeunload", (e) => {
  localStorage.setItem("gameData", JSON.stringify(gameData.value));
});

const page = ref("home");
const canvas = ref(null); // reference t canvas element
let endGame = null; // Function For clean up interval and others when game is ended

const startGame = () => {
  endGame = initializeGame(canvas, gameData);
};

const restartGame = () => {
  endGame();
  startGame();
};

// Page Handler
const handleStartGame = () => {
  page.value = "game";
  startGame();
};

const handleBackHome = () => {
  page.value = "home";
  endGame();
};

const handleOpenShop = () => {
  page.value = "shop";
  endGame();
};

const handleCloseShop = () => {
  page.value = "game";
  startGame();
};

const handleOpenTutorial = () => {
  page.value = "tutorial";
};
const handleCloseTutorial = () => {
  page.value = "home";
};

const scrollslide = ref(null);
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
    id: 1,
    img: "To1.jpg",
    p1: "About game",
    p2: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil",
  },
  {
    id: 2,
    img: "To2.jpg",
    p1: "Skin and skills",
    p2: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil",
  },
  {
    id: 3,
    img: "To3.jpg",
    p1: "Scoreboard",
    p2: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil",
  },
];
// Shop
// Random
const result = ref("");
const reward = [
  { name: "Gojo", percentage: 10 },
  { name: "Jesus", percentage: 20 },
  { name: "Yorch", percentage: 30 },
  { name: "Muhaha", percentage: 40 },
];
const random = () => {
  const randomNumber = Math.random() * 100;
  let cumulative = 0;
  for (const i of reward) {
    cumulative += i.percentage;
    if (randomNumber < cumulative) {
      result.value = i.name;
      console.log("result:" + result.value);
      return;
    }
  }
};

// Shotgun Ammo
const handleShotgunSkill = () => {
  if (gameData.value.playerSkills.shotgunSkill < 3) {
    gameData.value.playerSkills.shotgunSkill++;
  }
};
</script>

<template>
  <!-- Home Page -->
  <section
    v-if="page === 'home'"
    class="z-50 z- bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div
      class="w-full max-w-[97%] h-[calc(100vh-3rem)] border border-white flex flex-col gap-10 items-center p-10 rounded-xl bg-white">
      <h1 class="text-4xl font-bold text-center">Home Page</h1>
      <button
        class="btn mt-4 bg-black/80 py-8 px-16 text-white rounded active:bg-black/50"
        @click="handleStartGame">
        Start
      </button>

      <button
        class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50 float-right mx-5"
        @click="handleOpenTutorial">
        ?
      </button>
    </div>
  </section>

  <!-- Tutorial Page -->
  <section
    v-else-if="page === 'tutorial'"
    class="z-50 bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div
      class="container flex h-full my-auto items-center justify-center"
      id="container">
      <div class="" id="slide-wrapper">
        <ul
          class="max-w-150 h-200 flex my-20 overflow-x-auto aspect-video scrollbar-hidden snap-x scroll-smooth"
          id="slide-list"
          ref="scrollslide">
          <li
            class="list-style-none group min-w-150 my-auto snap-start object-cover"
            id="slide-item1"
            v-for="data in TutorialData"
            :key="data.id">
            <div
              class="w-full rounded-xl bg-white p-5 text-none border-1 hover:border-blue-300 flex flex-col"
              id="slide-link">
              <img
                :src="`/src/assets/image/${data.img}`"
                class="w-full rounded-lg aspect-video object-cover mb-3"
                id="slide-image" />
              <p
                class="text-blue-500 font-medium px-2 py-1 mx-1 mb-4 mt-2 bg-blue-100 rounded-full w-fit border-1 text-xs">
                {{ data.p1 }}
              </p>
              <h2 class="text-lg text-black font-semibold" id="slide-title">
                {{ data.p2 }}
              </h2>
              <div class="flex flex-col">
                <div class="my-3 flex flex-row justify-around">
                  <button
                    v-on:click="goleft"
                    class="h-8 w-8 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white">
                    <
                  </button>
                  <button
                    v-on:click="goright"
                    class="h-8 w-8 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white">
                    >
                  </button>
                </div>
                <div class="justify-center align-center flex flex-row">
                  <button
                    @click="handleCloseTutorial"
                    class="h-8 w-18 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white">
                    back
                  </button>
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
    <div
      class="h-[90%] w-full max-w-4xl border border-white flex flex-col gap-10 items-center p-10 rounded-xl bg-white">
      <h1>Shop</h1>
      <h1 class="font-serif text-red-500 text-2xl">FORTUNE!!!</h1>
      <div>
        อะกูให้:
        <div v-if="result">{{ result }}</div>
      </div>
      <button
        class="btn bg-red-600 py-4 px-8 text-3xl text-white rounded active:bg-red-600/50"
        @click="random">
        จัด
      </button>

      <h4>Shotgun Ammo</h4>
      <p>Amount: {{ gameData.playerSkills.shotgunSkill }}</p>
      <button
        class="btn bg-black py-2 px-4 text-white rounded active:bg-black/50"
        @click="handleShotgunSkill">
        Buy
      </button>
      <button
        class="btn bg-red-600 py-2 px-4 text-white rounded active:bg-red-600/50"
        @click="handleCloseShop">
        Close
      </button>
    </div>
  </section>

  <!-- Game Page -->
  <section class="bg-base-100 max-w-screen-xl mx-auto flex">
    <!-- <button class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded active:bg-black/50 float-right mx-5" @click="handleOpenTutorial">
      ?
    </button> -->
    <div class="mx-auto">
      <div class="flex gap-5 py-5">
        <button
          class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50"
          @click="handleBackHome">
          Back to home
        </button>
        <button
          class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50"
          @click="handleOpenShop">
          Shop
        </button>
        <h1 class="text-3xl ml-auto">High Score: {{ gameData.highScore }}</h1>
      </div>

      <div class="relative border">
        <canvas
          ref="canvas"
          class="bg-blue-100 border-b-[15px] border-b-orange-950 mx-auto"></canvas>

        <div class="absolute top-5 left-5 flex gap-3">
          <div
            class="rounded-full text-white size-15 flex items-center justify-center"
            :class="
              gameData.playerSkills.shotgunSkill > 0
                ? 'bg-orange-500'
                : 'bg-gray-500'
            ">
            {{ gameData.playerSkills.shotgunSkill }}
          </div>
          <div
            class="rounded-full text-white size-15 flex items-center justify-center"
            :class="
              gameData.playerSkills.mugen.active
                ? 'bg-blue-600'
                : gameData.playerSkills.mugen.cooldown
                ? 'bg-gray-500'
                : 'bg-orange-500'
            ">
            {{
              gameData.playerSkills.mugen.active
                ? "Mugen!!"
                : gameData.playerSkills.mugen.cooldown > 0
                ? gameData.playerSkills.mugen.cooldown
                : "Mugen"
            }}
          </div>
        </div>
      </div>

      <div class="flex gap-5 mt-5">
        <button
          class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50"
          @click="restartGame">
          Restart
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
</style>
