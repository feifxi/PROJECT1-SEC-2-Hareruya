import playerImgSrc from "../assets/image/sprites/player-default.png";
import playerHogwartsImgSrc from "../assets/image/sprites/player-hogwarts.png";
import playerMonkImgSrc from "../assets/image/sprites/player-monk.png";
import playerJesusImgSrc from "../assets/image/sprites/player-jesus.png";
import playerGraduateImgSrc from "../assets/image/sprites/player-graduate.png";
import backgroundGrassyTerrain from "../assets/image/backgrounds/background1.jpg";
import backgroundEveningHorizon from "../assets/image/backgrounds/background2.gif";
import backgroundBeuatifulDusk from "../assets/image/backgrounds/background3.jpg";
import shotgunNoAmmo from "../assets/image/sprites/shotgun-no-ammo.png";
import shotgun1Ammo from "../assets/image/sprites/shotgun-1-ammo.png";
import shotgun2Ammo from "../assets/image/sprites/shotgun-2-ammo.png";
import shotgun3Ammo from "../assets/image/sprites/shotgun-3-ammo.png";
import mugenActive from "../assets/image/sprites/mugen-active.png";
import mugenCooldown from "../assets/image/sprites/mugen-cooldown.png";

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
        img: "TutorialVideo1.gif",
        label: "About game",
        description: "Press W to jump and S to duck. Hitting an obstacle ends the game. Earn 10 coins every 100 scroe to buy skills and skins."
    },
    {
        img: "TutorialVideo2.gif",
        label: "Shop and skins",
        description: "Collect coins to buy Skins or ammo from the Shop. You can random to get limited Skin or buy shotgun ammo for attacks"
    },
    {
        img: "TutorialVideo3.gif",
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