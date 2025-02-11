<script setup>
import { reactive, ref } from "vue";
import playerImgSrc from "./assets/image/sprites/player-default.png";
import { initializeGame } from "./gamelogic/initializeGame";
import { luckyDrawItems, shopSkins, tutorialData , ThemeData } from "./constants";


const savedData = localStorage.getItem("gameData"); // retrive data from localstorage if exist
// Game Data State
const gameData = reactive(
  savedData
    ? JSON.parse(savedData)
    : {
        highScore: 0,
        money: 0,
        skin: {
          equipped: shopSkins[0],
          owned: ['Default'],
        },
        playerSkills: {
          extraScore: false, // have extra score
          shotgunSkill: 0, // number of bullet
        },
        theme: ThemeData[0]
      }
);
// In-memory only skill
gameData.playerSkills.mugen = {
  active: 0,
  cooldown: 0,
};

// Save Game Data before player exit
// window.addEventListener("beforeunload", (e) => {
//   localStorage.setItem("gameData", JSON.stringify(gameData));
// });

const canvas = ref(null); // reference t canvas element
let endGame = null; // Function For clean up interval and others when game is ended

const startGame = () => {
  endGame = initializeGame(canvas, gameData);
};

// Add Restart game event at 'space key'
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && page.value === "game") {
    endGame();
    startGame();
  }
});

// Page Handler
const page = ref("home");

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
  luckyDrawResult.value;
};

const handleCloseShop = () => {
  page.value = "game";
  startGame();
  luckyDrawResult.value = "random";
};

const handleOpenTheme = () => {
  page.value = "theme";
};

const handleOpenTutorial = () => {
  page.value = "tutorial";
};
const handleClosePage = () => {
  page.value = "home";
};

// Tutorial Section
const scrollslide = ref(null);

const goright = () => {
  if(scrollslide.value) {
    scrollslide.value.scrollLeft += 550
  }if(scrollslide.value.scrollLeft > 1000) {
    scrollslide.value.scrollLeft = 0 ;
  }
};
const goleft = () => {
  if (scrollslide.value) {
    scrollslide.value.scrollLeft -= 550;
  }
};

// Shop Section
// Lucky draw
const luckyDrawResult = ref("random");

const random = () => {
  const randomNumber = Math.random() * 100;
  let cumulative = 0;
  for (const item of luckyDrawItems) {
    cumulative += item.percentage;
    if (randomNumber < cumulative) {
      // Display random animation
      let i = 0;
      const clearInt = setInterval(() => {
        if (i < luckyDrawItems.length) {
          luckyDrawResult.value = luckyDrawItems[i++].name;
        } else i = 0;
      }, 100);

      setTimeout(() => {
        clearInterval(clearInt);
        // display the result item
        luckyDrawResult.value = item.name;
        // Store the items
        if (item.name === "Jesus" && !gameData.skin.owned.includes("Jesus")) {
          gameData.skin.owned.push("Jesus");
        } else if (item.name === "Shotgun") {
          if (gameData.playerSkills.shotgunSkill < 10) {
            gameData.playerSkills.shotgunSkill = 10;
          } else {
            gameData.money += 40;
          }
        } else if (item.name === "ExtraScore") {
          gameData.playerSkills.extraScore = true; // ExtraScore on
        } else if (item.name === "Salt Muhaha") {
          gameData.money += 50;
        }
      }, 3000); // 3 sec

      return;
    }
  }
};

// ฺBuy Shotgun
const buyShotgunSkill = () => {
  if (gameData.playerSkills.shotgunSkill < 10 && gameData.money >= 50) {
    gameData.money -= 50;
    gameData.playerSkills.shotgunSkill++;
  }
};


// Buy Skin
const buySkin = (skin) => {
  if (skin.price <= gameData.money) {
    gameData.skin.owned.push(skin.name);
    gameData.money -= skin.price;
    console.log(gameData.skin.owned)
  }
};


// Set Background Theme
const setBackground = (theme) => {
  gameData.theme = theme
};


</script>

<template>
  <!-- Home Page -->
  <section
    v-if="page === 'home'"
    class="z-50 z- bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div
      class="w-full max-w-[97%] h-[calc(100vh-3rem)] border border-white flex flex-col gap-10 items-center justify-center p-10 rounded-xl bg-[url(src/assets/image/backgrounds/Home-bg.gif)] bg-no-repeat bg-cover bg-bottom">
      <h1
        class="text-9xl font-extrabold text-center font-mono bg-linear-to-r/increasing from-indigo-500 to-teal-400 py-15"
        :style="{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '2px white',
        }">
        Become Jesus
      </h1>
      <button
        class="btn mt-4 bg-black/80 py-5 px-10 text-white text-xl font-bold active:bg-black/40 ring-2 ring-white-300 rounded-full"
        :style="{ WebkitTextStroke: '0.35px blue' }"
        @click="handleStartGame">
        Start
      </button>

      <button
        class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded-full active:bg-black/50 float-right mx-5 w-10 h-10 text-center ring-2 ring-white-300"
        @click="handleOpenTutorial">
        ?
      </button>

      <button
        class="btn mt-4 bg-black/80 py-3 px-4 text-white rounded-full active:bg-black/50 float-right mx-5 w-15 h-10 text-center ring-2 ring-white-300"
        @click="handleOpenTheme">
        theme
      </button>
    </div>
  </section>

  <!-- Tutorial Page -->
  <section
    v-else-if="page === 'tutorial'"
    class="z-50 bg-black w-full h-screen fixed top-0 left-0 flex items-center justify-center">
    <div
      class="container flex h-full my-auto items-center justify-center"
      id="container">
      <div id="slide-wrapper">
        <ul
          class="max-w-150 no-scrollbar h-180 flex my-20 overflow-x-auto aspect-video snap-x scroll-smooth"
          id="slide-list"
          ref="scrollslide">
          <li
            class="list-style-none group min-w-150 my-auto snap-start object-cover h-full"
            id="slide-item1"
            v-for="(data, index) in tutorialData"
            :key="index">
            <div
              class="w-full rounded-xl bg-white p-5 text-none border-1 hover:border-blue-300 h-full flex flex-col min-h-175"
              id="slide-link">
              <img
                :src="`/src/assets/image/backgrounds/${data.img}`"
                class="w-full rounded-lg aspect-video object-cover mb-3"
                id="slide-image" />
              <p
                class="text-blue-500 font-medium px-2 py-1 mx-1 mb-4 mt-2 bg-blue-100 rounded-full w-fit border-1 text-xs">
                {{ data.label }}
              </p>
              <div class="flex flex-col justify-between h-full">
                <h2 class="text-lg text-black font-semibold" id="slide-title">
                  {{ data.description }}
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
                      @click="handleClosePage"
                      class="h-8 w-18 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer group-hover:bg-blue-500 group-hover:text-white">
                      back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Theme Page -->
  <section
    v-else-if="page === 'theme'"
    class="z-50 bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center"
  >
    <div class="relative rounded-xl bg-white p-5 pt-10 flex flex-col items-center">
      <button
        @click="handleClosePage"
        class="btn btn-accent absolute right-10 top-3"
      >
        Back 
      </button>

      <!-- Themes -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-10 p-5">
        <div v-for="(theme , index) in ThemeData" class="text-center" :key="index">
          <div v-if="theme.img === ''" class=" bg-blue-100 border-b-[15px] border-b-orange-950 h-[200px]"></div>  
          <img 
            v-if="theme.img !== ''" 
            :src="theme.img" 
            class="object-cover w-[400px] h-[200px]"
          />
          <button class="btn btn-primary m-3 mb-0" @click="setBackground(theme)" :disabled="gameData.theme.name === theme.name">Equip</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Shop Page -->
  <section
    v-else-if="page === 'shop'"
    class="z-50 bg-black/90 w-full h-full fixed top-0 left-0 flex items-center justify-center overflow-y-scroll">
    <div class="w-[95%] p-5 bg-base-100 rounded-xl">
      <div class="flex justify-between pb-5">
        <h1 class="text-5xl font-bold">Shop</h1>
        <h1 class="text-blue-500 text-3xl font-bold">
          Money: {{ gameData.money }}$
        </h1>
        <button
          class="btn bg-red-600 py-2 px-4 text-white rounded active:bg-red-600/50"
          @click="handleCloseShop">
          Close
        </button>
      </div>
      <div class="grid">
        <div class="flex w-full">
          <!-- Lucky draw -->
          <div class="p-4 flex-1 border">
            <h2 class="font-serif text-red-500 text-2xl">Lucky Draw</h2>
            <div class="border p-5 text-center">
              {{ luckyDrawResult }}
            </div>
            <div class="flex-col justify-items-center">
              <button
                class="btn bg-red-600 py-3 px-6 text-3xl text-white rounded active:bg-red-600/50 mt-3"
                @click="random">
                Spin
              </button>
              <p>150$ = 1 spin</p>
            </div>
          </div>

          <!-- Items shop -->
          <div class="p-4 flex-1 border">
            <h2>Items Shop</h2>
            <h2>Shotgun Ammo</h2>
            <p>Amount: {{ gameData.playerSkills.shotgunSkill }}</p>
            <button
              class="btn bg-black py-2 px-4 text-white rounded active:bg-black/50"
              @click="buyShotgunSkill"
            >
              Buy
            </button>
          </div>
        </div>

        <!-- Skins shop -->
        <div class="p-4">
          <h2 class="text-2xl font-bold py-4">Skins Shop</h2>
          <!-- skin list -->
          <div class="flex items-center justify-start gap-5">
            <div
              v-for="data in shopSkins"
              :key="data.id"
              class="card bg-base-300 shadow-sm">
              <div class="card-body">
                <div class="flex justify-between items-center">
                  <h2 class="card-title">{{ data.name }}</h2>
                  <h2 class="" v-if="!data.limited">{{ data.price }}</h2>
                  <h2 class="" v-if="data.limited">{{ "Limited!!" }}</h2>
                  <button
                    class="btn btn-primary"
                    @click="gameData.skin.owned.includes(data.name) ? equipSkin(data) : buySkin(data)"
                    :disabled="gameData.skin.equipped.img === data.img"
                  >
                    {{ gameData.skin.owned.includes(data.name) ? 'Equip' : 'Buy now' }}
                  </button>
                </div>
                <p>{{ data.word }}</p>
              </div>
              <figure>
                <img v-bind:src="data.img" alt="Shoes" class="object-cover" />
              </figure>
            </div>
          </div>
        </div>

        <!-- add more... -->
      </div>
    </div>
  </section>

  <!-- Game Page -->
  <section class="bg-base-100 max-w-screen-xl mx-auto flex">
    <div class="mx-auto">
      <div class="flex gap-5 py-5">
        <button
          class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50"
          @click="handleBackHome"
        >

          Back to home
        </button>
        <button
          class="btn bg-black/80 py-3 px-4 text-white rounded active:bg-black/50"
          @click="handleOpenShop">
          Shop
        </button>

        <div class="flex-col ml-auto">
          <h1 class="text-3xl text-amber-200">
            High Score: <span class="text-white">{{ gameData.highScore }}</span>
          </h1>
          <h1 class="text-3xl text-green-400">
            Money: <span class="text-white">{{ gameData.money }}$</span>
          </h1>
        </div>
      </div>
      <!-- Canvas Section  -->
      <div class="relative">
        <canvas
          ref="canvas"
          class="bg-blue-100 border-b-[15px] border-b-orange-950 mx-auto bg-no-repeat bg-cover center"
          :style="{ 
            backgroundImage: `url(${gameData.theme.img})` }"
        >
        </canvas>

        <!-- Skill Status -->
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
              gameData.playerSkills.mugen.active > 0
                ? 'bg-blue-600'
                : gameData.playerSkills.mugen.cooldown
                ? 'bg-gray-500'
                : 'bg-orange-500'
            ">
            {{
              gameData.playerSkills.mugen.active > 0
                ? gameData.playerSkills.mugen.active
                : gameData.playerSkills.mugen.cooldown > 0
                ? gameData.playerSkills.mugen.cooldown
                : "Mugen"
            }}
          </div>
        </div>

        <!-- Tooltip   -->
        <div
          class="absolute right-5 top-5 group cursor-pointer inline-block text-black font-bold transition duration-500">
          <div
            class="group-hover:hidden flex justify-center items-center border-black border-2 size-8 rounded-full">
            ?
          </div>
          <div
            class="hidden group-hover:flex flex-col border border-black rounded p-5 bg-white">
            <p>W : jump</p>
            <p>S : down</p>
            <p>Q : shotgun</p>
            <p>E : Mugen</p>
          </div>
        </div>
      </div>

      <div class="">
        <h2 class="text-3xl py-5 text-center">Press "Space" to restart</h2>
      </div>
    </div>
  </section>
</template>

<style></style>
