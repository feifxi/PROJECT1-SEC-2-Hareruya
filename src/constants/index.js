import playerHogwartsImgSrc from "../assets/image/sprites/player-hogwarts.png";
import playerMonkImgSrc from "../assets/image/sprites/player-monk.png";
import playerJesusImgSrc from "../assets/image/sprites/player-jesus.png";
import playerGraduateImgSrc from "../assets/image/sprites/player-graduate.png";
import background1 from "../assets/image/backgrounds/background1.jpg"
import background2 from "../assets/image/backgrounds/background2.gif"
import background3 from "../assets/image/backgrounds/background3.jpg"

export const luckyDrawItems = [
    { name: "Jesus", percentage: 5 },
    { name: "Shotgun", percentage: 25 },
    { name: "ExtraScore", percentage: 30 },
    { name: "Salt Muhaha", percentage: 40 },
]

export const shopSkins = [
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
        label: "Shop and skills",
        description: "When you collect enough coins, you can purchase Skins or Skills from the Shop. Additionally, you can buy random Skins. In terms of Skills, you can acquire the Shotgun skill to use during your runs or the Mugen skill, which blocks everything for you. As for Skins, there are various options available, ranging from Gojo to Jesus.",
    },
    {
        img: "To3.jpg",
        label: "Skills",
        description: "There are two Skills you can use: press Q to activate the Shotgun skill, which breaks the next obstacle, and press E to use the Mugen skill, making you invisible for 5 seconds. Both Skills can be purchased from the Shop Enjoy the game, and keep jumping until you become Jesus!",
    },
];

export const ThemeData = [
     {  
        name:'default' ,
        img: '' ,
     },
     {  
        name:'background-1' ,
        img: background1
     },
     {
        name:'background-2' ,
        img: background2
     },
     {
        name:'background-3' ,
       img: background3
     }

]