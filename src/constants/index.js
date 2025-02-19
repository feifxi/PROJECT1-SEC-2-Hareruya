import playerImgSrc from "/src/assets/images/sprites/players/player-default.png";
import playerHogwartsImgSrc from "/src/assets/images/sprites/players/player-hogwarts.png";
import playerMonkImgSrc from "/src/assets/images/sprites/players/player-monk.png";
import playerJesusImgSrc from "/src/assets/images/sprites/players/player-jesus.png";
import playerGraduateImgSrc from "/src/assets/images/sprites/players/player-graduate.png";
import backgroundGrassyTerrain from "/src/assets/images/backgrounds/background1.jpg";
import backgroundEveningHorizon from "/src/assets/images/backgrounds/background2.gif";
import backgroundBeuatifulDusk from "/src/assets/images/backgrounds/background3.jpg";
import shotgunNoAmmo from "/src/assets/images/sprites/skills/skill-shotgun-no-ammo.png";
import shotgun1Ammo from "/src/assets/images/sprites/skills/skill-shotgun-1-ammo.png";
import shotgun2Ammo from "/src/assets/images/sprites/skills/skill-shotgun-2-ammo.png";
import shotgun3Ammo from "/src/assets/images/sprites/skills/skill-shotgun-3-ammo.png";
import mugenActive from "/src/assets/images/sprites/skills/skill-mugen-active.png";
import mugenCooldown from "/src/assets/images/sprites/skills/skill-mugen-cooldown.png";
import tutorialVideo1 from "/src/assets/images/tutorials/tutorial-video1.gif";
import tutorialVideo2 from "/src/assets/images/tutorials/tutorial-video2.gif";
import tutorialVideo3 from "/src/assets/images/tutorials/tutorial-video3.gif";

export const luckyDrawItems = [
    { name: "Unemployed", percentage: 5},
    { name: "Shotgun", percentage: 25 },
    { name: "ExtraScore", percentage: 30 },
    { name: "Salt Muhaha", percentage: 40 }
]

export const shopSkins = [
    {
        name: "Default",
        img: playerImgSrc,
        price: 0
    },
    {
        name: "Monk",
        img: playerMonkImgSrc,
        price: 500
    },
    {
        name: "Wizard",
        img: playerHogwartsImgSrc,
        price: 1000
    },
    {
        name: "Jesus",
        img: playerJesusImgSrc,
        price: 2500
    },
    {
        name: "Unemployed",
        img: playerGraduateImgSrc,
        price: 0
    }
];

export const tutorialData = [
    {
        img: tutorialVideo1,
        label: "About game",
        description: "Press W to jump and S to duck. Hitting an obstacle ends the game. Earn 10 coins every 100 score to buy skills and skins."
    },
    {
        img: tutorialVideo2,
        label: "Shop and skins",
        description: "Collect coins to buy Skins or Shotgun ammo from the Shop. You can try your luck on \"Lucky Draws!\" to get Limited Skin, a Shotgun ammo and more."
    },
    {
        img: tutorialVideo3,
        label: "Skills",
        description: "Press Q to use Shotgun to destroy the obstacles and E for Mugen to bypass obstacles for 5 seconds. Buy Shotgun ammo from the Shop. Keep jumping until you become \"Unemployed\"!"
    }
];

export const themeData = [
    {
        name: 'default',
        img: ''
    },
    {
        name: 'background-1',
        img: backgroundGrassyTerrain
    },
    {
        name: 'background-2',
        img: backgroundEveningHorizon
    },
    {
        name: 'background-3',
        img: backgroundBeuatifulDusk
    }
];

export const shotgunAmmo = [
    shotgunNoAmmo,
    shotgun1Ammo,
    shotgun2Ammo,
    shotgun3Ammo
];

export const mugenStatus = [
    mugenActive,
    mugenCooldown
];