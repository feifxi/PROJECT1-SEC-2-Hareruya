<script setup>
import { reactive, ref } from "vue";
import { initializeGame } from "/src/gamelogic/initializeGame";
import {
  luckyDrawItems,
  shopSkins,
  tutorialData,
  themeData,
  shotgunAmmo,
  mugenStatus
} from "/src/constants";
import playerShotgun from "/src/assets/images/sprites/skills/skill-shotgun.png";
import terInHome from "/src/assets/images/sprites/ter-show-home.png";

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
          owned: ["Default"],
        },
        playerSkills: {
          extraScore: false, // have extra score
          shotgunSkill: 0, // number of bullet
        },
        theme: themeData[0]
      }
);

// In-memory only skill
gameData.playerSkills.mugen = {
  active: 0,
  cooldown: 0
};

// Save Game Data before player exit
window.addEventListener("beforeunload", (e) => {
  localStorage.setItem("gameData", JSON.stringify(gameData));
});

const canvas = ref(null); // reference the canvas element
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
let tutorialIndex = 1;
const goRight = () => {
  if (scrollslide.value) {
    scrollslide.value.scrollLeft += 550;
    tutorialIndex++;
  }
  if (scrollslide.value.scrollLeft === 1200 && tutorialIndex > tutorialData.length) {
    scrollslide.value.scrollLeft = 0;
    tutorialIndex = 1;
  }
};

const goLeft = () => {
  if (scrollslide.value !== 0 && tutorialIndex !== 0) {
    scrollslide.value.scrollLeft -= 550;
    tutorialIndex--;
  }
  if (scrollslide.value.scrollLeft === 0 && tutorialIndex <= 0) {
    scrollslide.value.scrollLeft = 1200;
    tutorialIndex = tutorialData.length;
  }
};

// Shop Section
// Lucky draw
const luckyDrawResult = ref("random");
const rewardText = ref("");
const isModalOpen = ref(false);

const random = () => {
  gameData.money -= 150;
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
        rewardText.value = `You received: ${item.name}!`;
        isModalOpen.value = true;
        // console.log("Popup should open:", isModalOpen.value); //test

        if (item.name === "Unemployed") {
          if (!gameData.skin.owned.includes("Unemployed")) {
            gameData.skin.owned.push("Unemployed");
          }
          
          gameData.money += 750;
        } else if (item.name === "Shotgun") {
          if (gameData.playerSkills.shotgunSkill < 10) {
            gameData.playerSkills.shotgunSkill++;
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
  gameData.money -= 50;
  gameData.playerSkills.shotgunSkill++;
};

// Buy Skin
const buySkin = (skin) => {
  if (skin.price <= gameData.money) {
    gameData.skin.owned.push(skin.name);
    gameData.money -= skin.price;
  }
};

const equipSkin = (skin) => {
  gameData.skin.equipped = skin;
};

// Set Background Theme
const setBackground = (theme) => {
  gameData.theme = theme;
};
</script>

<template>
  <div data-theme="dark">
    <!-- Home Page -->
    <section
      v-if="page === 'home'"
      class="z-50 z- bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center"
    >
      <div
        class="w-full max-w-[97%] h-[calc(100vh-3rem)] border border-white gap-10 items-center justify-center p-10 rounded-xl bg-[url(/src/assets/images/backgrounds/home-bg.gif)] bg-no-repeat bg-cover bg-bottom">
        <h1
          class="text-9xl font-extrabold text-center fontHome bg-[linear-gradient(0deg,rgba(255,0,200,1)_0%,rgba(29,253,183,1)_50%,rgba(72,69,252,1)_100%)] p-5"
          :style="{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '2px white',
          }">
          Become <br />
          Unemployed
        </h1>

        <div class="flex justify-around text-white">
          <button
            class="absolute top-[10%] right-[10%] btn btn-circle p-7 text-xl bg-black/80 active:bg-black/50 float-right text-center ring-2 ring-white-300"
            @click="handleOpenTutorial">
            ?
          </button>
          <div class="grid w-full text-center justify-center">
            <button
              class="btn btn-circle w-[200px] h-[100px] bg-black/80 pb-3 text-7xl font-bold active:bg-black ring-2 ring-white-300"
              :style="{ WebkitTextStroke: '0.35px blue' }"
              @click="handleStartGame">
              Play
            </button>
            <button
              class="btn btn-circle py-7 px-15 text-l bg-black/80 active:bg-black/50 ring-2 ring-white-300 mx-auto mt-5"
              @click="handleOpenTheme">
              Background
            </button>
          </div>
          <img :src="terInHome" class="absolute w-50 left-[25%] bottom-[8%]" />
        </div>
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
                  :src="data.img"
                  class="w-full rounded-lg aspect-video object-fit mb-3"
                  id="slide-image"
                />
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
                        v-on:click="goLeft"
                        class="h-8 w-8 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer hover:bg-blue-500 hover:text-white">
                        <
                      </button>
                      <button
                        v-on:click="goRight"
                        class="h-8 w-8 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer hover:bg-blue-500 hover:text-white">
                        >
                      </button>
                    </div>
                    <div class="justify-center align-center flex flex-row">
                      <button
                        @click="handleClosePage"
                        class="h-8 w-18 rounded-full border-1 border-blue-500 text-blue-400 mx-2 my-1 curser-pointer hover:bg-blue-500 hover:text-white">
                        Back
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
      class="z-50 bg-black/90 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
      <div
        class="relative rounded-xl bg-white p-5 pt-10 flex flex-col items-center">
        <button
          @click="handleClosePage"
          class="btn btn-accent absolute right-10 top-3">
          Back
        </button>

        <!-- Themes -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-10 p-5">
          <div
            v-for="(theme, index) in themeData"
            class="text-center"
            :key="index">
            <div
              v-if="theme.img === ''"
              class="bg-blue-100 border-b-[15px] border-b-orange-950 h-[200px]"></div>
            <img
              v-if="theme.img !== ''"
              :src="theme.img"
              class="object-cover w-[400px] h-[200px]" />
            <button
              class="btn btn-primary m-3 mb-0"
              @click="setBackground(theme)"
              :disabled="gameData.theme.name === theme.name">
              Equip
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Shop Page -->
    <section
      v-else-if="page === 'shop'"
      class="z-50 bg-black/90 w-full h-full fixed top-0 left-0 flex items-center justify-center overflow-y-scroll">
      <div
        class="w-[90%] max-h-[90%] object-fit no-scrollbar p-8 bg-base-100 rounded-xl overflow-y-auto">
        <div class="flex flex-col w-full justify-center text-center pb-5">
          <div class="justify-center flex">
            <h1
              class="text-7xl font-extrabold max-w-fit text-center font-mono bg-linear-to-b/increasing from-blue-600 to-sky-300"
              :style="{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '0.75px white',
              }">
              Shop
            </h1>
          </div>
          <div class="w-full flex flex-row justify-between">
            <h1
              class="text-yellow-500 text-3xl font-bold"
              :style="{
                WebkitTextStroke: '0.5px white',
              }">
              Money: {{ gameData.money }}$
            </h1>
            <button
              class="btn bg-red-600 py-2 px-4 text-white rounded active:bg-red-600/50 mr-5"
              @click="handleCloseShop">
              Close
            </button>
          </div>
        </div>
        <div>
          <div class="grid grid-cols-2 gap-5 p-">
            <!-- Lucky draw -->
            <div
              class="py-4 px-8 flex-1 flex flex-col text-center border rounded-2xl">
              <div class="divider">
                <h1
                  class="text-5xl font-extrabold max-w-fit text-center font-mono bg-[linear-gradient(45deg,rgba(140,151,153,1)_0%,rgba(0,0,0,1)_50%,rgba(140,151,153,1)_100%)] mb-4"
                  :style="{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitTextStroke: '0.5px yellow',
                  }">
                  Lucky Draws!
                </h1>
              </div>
              <div class="border p-5 text-center rounded-2xl">
                {{ luckyDrawResult }}
              </div>
              <div class="flex-col justify-items-center my-2">
                <button
                  class="btn bg-red-600 py-1 px-4 border-1 mb-2 border-white text-3xl text-white rounded-2xl w-fit h-fit active:bg-red-600/50 mt-3"
                  @click="random"
                  :disabled="gameData.money < 150"
                >
                  Spin
                </button>
                <p>150$ = 1 spin</p>
              </div>

              <div
                v-if="isModalOpen"
                class="fixed inset-0 bg-black/90 z-60 flex items-center justify-center">
                <div
                  class="bg-white p-8 rounded-xl shadow-xl text-center max-w-md mx-auto">
                  <h1
                    class="text-4xl py-3 font-extrabold max-w-fit text-center font-sans bg-[linear-gradient(45deg,rgba(140,151,153,1)_0%,rgba(0,0,0,1)_50%,rgba(140,151,153,1)_100%)] mb-4"
                    :style="{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      WebkitTextStroke: '0.5px yellow',
                    }">
                    Congratulations!
                  </h1>
                  <div
                    class="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-lg mb-6 py-4">
                    <p class="text-xl font-semibold">🎁 {{ rewardText }}</p>
                  </div>
                  <button
                    @click="isModalOpen = false"
                    class="btn btn-primary mt-4 px-6 py-3 rounded-full text-white font-semibold shadow-lg">
                    Claim Your Prize
                  </button>
                </div>
              </div>
            </div>

            <!-- Item shop -->
            <div
              class="px-4 py-8 flex-1 flex flex-row border rounded-2xl justify-around">
              <div class="flex flex-col text-center w-fit">
                <h2 class="font-serif my-3 text-red-500 text-2xl">
                  Shotgun Shop
                </h2>
                <h2>Shotgun Ammo</h2>
                <p>Amount: {{ gameData.playerSkills.shotgunSkill }}</p>
                <div>
                  <button
                    class="btn bg-red-600 py-1 px-4 border-1 border-white text-3xl text-white rounded-2xl w-fit h-fit active:bg-red-600/50 my-3"
                    @click="buyShotgunSkill"
                    :disabled="
                      gameData.money < 50 ||
                      gameData.playerSkills.shotgunSkill >= 10
                    ">
                    Buy
                  </button>
                  <p>50$ = 1 ammo</p>
                </div>
              </div>
              <div
                class="border-1 border-red-400 w-[30%] bg-white rounded-3xl justfiy-center flex">
                <img
                  :src="playerShotgun"
                  class="object-fit justify-center text-center w-30 h-30 my-auto mx-auto" />
              </div>
            </div>
          </div>

          <!-- Skins shop -->
          <div class="p-4">
            <h2 class="text-4xl font-bold py-4 w-full text-center underline">
              Skins Shop
            </h2>
            <div
              class="flex max-w-7xl items-center justify-around gap-3 py-5 mx-auto">
              <div
                v-for="data in shopSkins"
                :key="data.id"
                class="card bg-base-300 shadow-sm">
                <div
                  class="card-body max-h-80 border-1 border-white-300 rounded-xl">
                  <div class="flex flex-col items-center px-3 min-w-30 h-80">
                    <h2 class="card-title mb-3 text-2xl">{{ data.name }}</h2>
                    <h2 class="" v-if="data.limited">{{ "Limited!!" }}</h2>
                    <figure
                      class="border-2 border-red-400 w-30 h-30 rounded-full bg-white mb-5">
                      <img v-bind:src="data.img" class="object-fit w-20 h-20" />
                    </figure>
                    <button
                      class="btn btn-primary"
                      @click="
                        gameData.skin.owned.includes(data.name)
                          ? equipSkin(data)
                          : buySkin(data)
                      "
                      :disabled="gameData.skin.equipped.img === data.img"
                      v-show="
                        data.name !== 'Unemployed' ||
                        gameData.skin.owned.includes(data.name)
                      ">
                      {{
                        gameData.skin.owned.includes(data.name)
                          ? "Equip"
                          : "Buy now"
                      }}
                    </button>
                  </div>
                  <h2
                    class="text-center text-yellow-400"
                    v-if="
                      data.price != 0 && !gameData.skin.owned.includes(data.name)
                    ">
                    ${{ data.price }}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Game Page -->
    <section class="bg-base-100 max-w-screen-xl mx-auto flex">
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
              backgroundImage: `url(${gameData.theme.img})`,
            }">
          </canvas>

          <!-- Skill Status -->
          <div class="absolute top-5 left-5 flex gap-3">
            <div
              class="rounded-full text-white h-15 w-25 flex items-center justify-center"
              :class="
                gameData.playerSkills.shotgunSkill > 0
                  ? 'bg-orange-500'
                  : 'bg-gray-500'
              ">
              <div v-if="gameData.playerSkills.shotgunSkill > 7">
                <img :src="shotgunAmmo[3]" alt="3 Ammo Shotgun Icon" />
              </div>
              <div v-else-if="gameData.playerSkills.shotgunSkill > 3">
                <img :src="shotgunAmmo[2]" alt="2 Ammo Shotgun Icon" />
              </div>
              <div v-else-if="gameData.playerSkills.shotgunSkill > 0">
                <img :src="shotgunAmmo[1]" alt="1 Ammo Shotgun Icon" />
              </div>
              <div v-else>
                <img :src="shotgunAmmo[0]" alt="Empty Ammo Shotgun Icon" />
              </div>
              <p class="px-2 text-xl font-bold">
                {{ gameData.playerSkills.shotgunSkill }}
              </p>
            </div>
            <div
              class="rounded-full text-white h-15 w-40 flex items-center justify-center"
              :class="
                gameData.playerSkills.mugen.active > 0
                  ? 'bg-blue-600'
                  : gameData.playerSkills.mugen.cooldown
                  ? 'bg-gray-500'
                  : 'bg-orange-500'
              ">
              <img
                v-if="
                  gameData.playerSkills.mugen.active >= 0 ||
                  gameData.playerSkills.mugen.cooldown === 0
                "
                :src="mugenStatus[0]"
                alt="Active Mugen Icon" />
              <img v-else :src="mugenStatus[1]" alt="Cooldown Mugen Icon" />
              <p class="pl-3 text-xl font-bold">
                {{
                  gameData.playerSkills.mugen.active > 0
                    ? gameData.playerSkills.mugen.active
                    : gameData.playerSkills.mugen.cooldown > 0
                    ? gameData.playerSkills.mugen.cooldown
                    : "Mugen"
                }}
              </p>
            </div>
          </div>

          <!-- Tooltip  -->
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
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Atma:wght@300;400;500;600;700&display=swap");

.fontHome {
  font-family: Atma;
}
</style>
