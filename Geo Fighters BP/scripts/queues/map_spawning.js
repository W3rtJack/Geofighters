import * as mc from "@minecraft/server"
import { addPlayerVar, overworld } from "../abilities"

// In hindsight should've named this map loading but oh well


// Definitions of all the maps in their individual chunks
const fields = [
    [ "fields_1", "fields_2", "fields_3", "air" ],
    [ "fields_4", "fields_5", "fields_6", "air" ],
    [ "fields_7", "fields_8", "fields_9", "air" ],
    [ "air", "air", "air", "air" ]
]

const village = [
    [ "village_1", "village_4", "village_7", "village_10" ],
    [ "village_2", "village_5", "village_8", "village_11" ],
    [ "village_3", "village_6", "village_9", "village_12" ],
    [ "air", "air", "air", "air" ]
]

const farm = [
    [ "farm_0", "farm_1", "farm_2", "air" ],
    [ "farm_3", "farm_4", "farm_5", "air" ],
    [ "farm_6", "farm_7", "farm_8", "air" ],
    [ "air", "air", "air", "air" ]
]

// Array of spawning locations in vector form
const fieldsSpawns = [
    {x:109,y:-55,z:71},
    {x:89,y:-59,z:65},
    {x:76,y:-59,z:60},
    {x:63,y:-59,z:74},
    {x:49,y:-55,z:73},
    {x:58,y:-59,z:91},
    {x:62,y:-55,z:105},
    {x:69,y:-58,z:127},
    {x:87,y:-59,z:120},
    {x:109,y:-59,z:121},
    {x:119,y:-59,z:98}
]

const villageSpawns = [
    {x:128,y:-46,z:108},
    {x:126,y:-59,z:99},
    {x:105,y:-58,z:121},
    {x:100,y:-52,z:119},
    {x:156,y:-46,z:89},
    {x:80,y:-43,z:114},
    {x:70,y:-59,z:102},
    {x:80,y:-58,z:82},
    {x:101,y:-58,z:86},
    {x:93,y:-59,z:134},
    {x:77,y:-58,z:118},
    {x:94,y:-59,z:74}
]

const farmSpawns = [
    {x:124,y:-38,z:94},
    {x:107,y:-38,z:126},
    {x:77,y:-38,z:139},
    {x:104,y:-38,z:23},
    {x:77,y:-38,z:47},
    {x:109,y:-38,z:56},
    {x:80,y:0,z:88},
    {x:49,y:-38,z:91},
    {x:34,y:-38,z:70},
    {x:46,y:-38,z:47}
]


// Blank definitions ( for empty map )
const air = [
    [ "air", "air", "air", "air" ],
    [ "air", "air", "air", "air" ],
    [ "air", "air", "air", "air" ],
    [ "air", "air", "air", "air" ],
    [ "air", "air", "air", "air" ]
];

const blank = [{x:0,y:0,z:0}];


const map = [air,fields,village,farm]
const mapSpawns = [blank,fieldsSpawns,villageSpawns,farmSpawns]

// Spreads players
export function spreadPlayers(){
    const m = mapSpawns[mc.world.getDynamicProperty("mapChose")];
    const openSpots = Array.from(Array(m.length).keys())

    const players = overworld.getPlayers()

    for (const player of players){
        if (player.getDynamicProperty("ffa.queue")){
            player.setDynamicProperty("ffa.alive",true)
            player.setDynamicProperty("ffa.challenge.complete",true)
            const rand = Math.floor(Math.random()*openSpots.length);
            const spawn = m[openSpots[rand]];
            openSpots.splice(rand,1);
            player.setDynamicProperty("points",0)

            player.runCommand(`tp @s ${spawn.x} ${spawn.y} ${spawn.z}`)
        }
    }
}

export function spreadPlayer(player){
    const m = mapSpawns[mc.world.getDynamicProperty("mapChose")];
    const openSpots = Array.from(Array(m.length).keys())


    const rand = Math.floor(Math.random()*openSpots.length);
    const spawn = m[openSpots[rand]];

    player.runCommand(`tp @s ${spawn.x} ${spawn.y} ${spawn.z}`)
}



function spawnMap(player,m){
    const coord = {
        x: player.getDynamicProperty("map.x"),
        z: player.getDynamicProperty("map.y")
    }

    const name = m[coord.z][coord.x];
    player.runCommand(`tp @s ${coord.x*64+32} -59 ${coord.z*64-32}`)
    player.runCommand(`structure load ${name} ${coord.x*64+1} -60 ${coord.z*64+1}`)

    
}

export function startSpawning(player,a){
    mc.world.setDynamicProperty("map",a);
    player.addTag("mapSpawn")

    player.setDynamicProperty("mapTick",0)
    player.setDynamicProperty("map.x",0)
    player.setDynamicProperty("map.y",0)
    mc.world.setDynamicProperty("mapChose",a)
}


export function slowSpawning(player){
    addPlayerVar(player,"mapTick",1);
    if ((player.getDynamicProperty("mapTick") % 60) === 0){
        for (const p of mc.world.getPlayers()){
            p.setDynamicProperty("ffa.queue",false)
        }
        
        const m = map[mc.world.getDynamicProperty("mapChose")]

        spawnMap(player,m)

        addPlayerVar(player,"map.x",1)
        if (player.getDynamicProperty("map.x") >= m[player.getDynamicProperty("map.y")].length){
            player.setDynamicProperty("map.x",0)
            addPlayerVar(player,"map.y",1)
        }
        if (player.getDynamicProperty("map.y") >= m.length){
            player.removeTag("mapSpawn")
            player.setDynamicProperty("map.y",0)
        }

    }
}