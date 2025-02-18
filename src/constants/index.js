import playerImgSrc from "/src/assets/image/sprites/players/player-default.png";
import playerHogwartsImgSrc from "/src/assets/image/sprites/players/player-hogwarts.png";
import playerMonkImgSrc from "/src/assets/image/sprites/players/player-monk.png";
import playerJesusImgSrc from "/src/assets/image/sprites/players/player-jesus.png";
import playerGraduateImgSrc from "/src/assets/image/sprites/players/player-graduate.png";
import backgroundGrassyTerrain from "/src/assets/image/backgrounds/background1.jpg";
import backgroundEveningHorizon from "/src/assets/image/backgrounds/background2.gif";
import backgroundBeuatifulDusk from "/src/assets/image/backgrounds/background3.jpg";
import shotgunNoAmmo from "/src/assets/image/sprites/skills/skill-shotgun-no-ammo.png";
import shotgun1Ammo from "/src/assets/image/sprites/skills/skill-shotgun-1-ammo.png";
import shotgun2Ammo from "/src/assets/image/sprites/skills/skill-shotgun-2-ammo.png";
import shotgun3Ammo from "/src/assets/image/sprites/skills/skill-shotgun-3-ammo.png";
import mugenActive from "/src/assets/image/sprites/skills/skill-mugen-active.png";
import mugenCooldown from "/src/assets/image/sprites/skills/skill-mugen-cooldown.png";

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
        img: "tutorial-video1.gif",
        label: "About game",
        description: "Press W to jump and S to duck. Hitting an obstacle ends the game. Earn 10 coins every 100 scroe to buy skills and skins."
    },
    {
        img: "tutorial-video2.gif",
        label: "Shop and skins",
        description: "Collect coins to buy Skins or ammo from the Shop. You can random to get limited Skin or buy shotgun ammo for attacks"
    },
    {
        img: "tutorial-video3.gif",
        label: "Skills",
        description: "Press Q for aim Shotgun to break the next obstacle and E for Mugen to be invisible for 5 seconds. Buy shotgun ammo from the Shop. Keep jumping until you become Unemployed!"
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