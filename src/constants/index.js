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
        img: "To1.jpg",
        label: "About game",
        description: "Press the W button to make your character jump over obstacles and S to make it down. If you hit an obstacle, the game will end. As you run and got enough score you will get coin to purchase skills and skin"
    },
    {
        img: "To2.jpg",
        label: "Shop and skills",
        description: "When you collect enough coins, you can purchase Skins or Skills from the Shop. Additionally, you can buy random Skins. In terms of Skills, you can acquire the Shotgun skill to use during your runs or the Mugen skill, which blocks everything for you. As for Skins, there are various options available, ranging from Gojo to Jesus."
    },
    {
        img: "To3.jpg",
        label: "Skills",
        description: "There are two Skills you can use: press Q to activate the Shotgun skill, which breaks the next obstacle, and press E to use the Mugen skill, making you invisible for 5 seconds. Both Skills can be purchased from the Shop Enjoy the game, and keep jumping until you become Jesus!"
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