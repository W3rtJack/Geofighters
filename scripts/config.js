import {system} from "@minecraft/server";

// Save version MUST be changed every update to make sure data transfers over otherwise will delete player data
// EXTREMELY IMPORTANT
export const saveVersion = 1.0




// A file to change all the config options
// This may be a huge file, I added this. Near the end... lol
const gTick = 20; // The tick speed of the game

// Game Settings
export const startingPlayerCount = 2; // Starting player count (to start a match)
export const gameStartLength = 35*20; // The time it lets players join the queue before a game starts


// Not breaking these blocks
export let insideBlacklist = [
    "minecraft:air",
    "water",
    "carpet",
    "slab",
    "stairs",
    "skull",
    "short_grass",
    "tall_grass",
    "fern",
    "flower",
    "button",
    "plant",
    "wall",
    "trapdoor",
    "fence",
    "rail",
    "banner",
    "azure_bluet",
    "chest",
    "door",
    "ladder",
    "wheat",
    "potatoes",
    "carrots",
    "beetroot",
    "mushroom",
    "composter",
    "grindstone",
    "grindstone",
    "coral",
    "pane",
    "soul_sand",
    "fungus",
    "allium",
    "peony",
    "campfire",
    "core",
    "brewing_stand",
    "banner",
    "cake",
    "farmland",
    "web"
]

export const interactBlacklist = [
    "minecraft:barrel",
    "minecraft:chest",
    "minecraft:spruce_trapdoor",
    "minecraft:trapdoor",
    "minecraft:dark_oak_trapdoor",
    "minecraft:anvil",
    "minecraft:smoker",
    "minecraft:decorated_pot",
    "minecraft:flower_pot",
    "minecraft:crafter",
    "minecraft:lectern",
    "minecraft:dragon_egg",
    "minecraft:chiseled_bookshelf",
    "minecraft:furnace",
    "minecraft:crafting_table",
    "minecraft:brewing_stand",
    "minecraft:trapped_chest",
    "minecraft:composter",
    "minecraft:cartography_table",
    "minecraft:smithing_table",
    "minecraft:grindstone"
]

// Vik is hot