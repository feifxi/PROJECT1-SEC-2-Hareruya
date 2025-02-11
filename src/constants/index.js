import playerHogwartsImgSrc from "../assets/image/sprites/player-hogwarts.png";
import playerMonkImgSrc from "../assets/image/sprites/player-monk.png";
import playerJesusImgSrc from "../assets/image/sprites/player-jesus.png";
import playerGraduateImgSrc from "../assets/image/sprites/player-graduate.png";
import playerImgSrc from "../assets/image/sprites/player-default.png";


export const luckyDrawItems = [
    { name: "Jesus", percentage: 5 },
    { name: "Shotgun", percentage: 25 },
    { name: "ExtraScore", percentage: 30 },
    { name: "Salt Muhaha", percentage: 40 },
]

export const shopSkins = [
    {
        name: "Default",
        img: playerImgSrc,
        price: 0,
    },
    {
        name: "Monk",
        img: playerMonkImgSrc,
        price: 500,
    },
    {
        name: "Wizard",
        img: playerHogwartsImgSrc,
        price: 1000,
    },
    {
        name: "Jesus",
        img: playerJesusImgSrc,
        price: 2500,
    },
    {
        name: "Unemployed",
        img: playerGraduateImgSrc,
        price: 0,
        limited: true,
    },
];

export const tutorialData = [
    {
        img: "To1.jpg",
        label: "About game",
        description: "Press the W button to make your character jump over obstacles and S to make it down. If you hit an obstacle, the game will end. As you run and got enough score you will get coin to purchase skills and skin",
    },
    {
        img: "To2.jpg",
        label: "Skin and skills",
        description: "When you collect enough coins, you can purchase Skins or Skills from the Shop. Additionally, you can buy random Skins. In terms of Skills, you can acquire the Shotgun skill to use during your runs or the Mugen skill, which blocks everything for you. As for Skins, there are various options available, ranging from Gojo to Jesus.",
    },
    {
        img: "To3.jpg",
        label: "Scoreboard",
        description: "There are two Skills you can use: press Q to activate the Shotgun skill, which breaks the next obstacle, and press E to use the Mugen skill, making you invisible for 5 seconds. Both Skills can be purchased from the Shop Enjoy the game, and keep jumping until you become Jesus!",
    },
];