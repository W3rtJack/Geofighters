import * as mc from "@minecraft/server"
import { Queue, passiveAnim } from "../dataTypes";
import { addPlayerVar, passList } from "../abilities";
import { findBlock, tick } from "../main";


export const passiveAnimations = [
    new passiveAnim("default","Default",nothing,"textures/items/stick"),
    new passiveAnim("dirt_head","Dirt Block Head",dirty,"minecraft:dirt"),
    new passiveAnim("rainbow_skull","Rainbow Skull",rgbHead,"minecraft:comparator"),
    new passiveAnim("rainbow_trail","Rainbow Trail",rainbowTrail,"minecraft:red_wool"),
    new passiveAnim("money_trail","Money Trail",moneyTrail,"textures/items/diamond")
]


function nothing(player){}

// Updating animation
const overworld = mc.world.getDimension("overworld")
export function passiveAnimUpdate(player){
    if (player.getDynamicProperty("equipped.passiveAnim") == undefined){
        player.setDynamicProperty("equipped.passiveAnim","default")
        player.setDynamicProperty("default.passiveAnim.unlocked",true)
    }

    
    if (player.getDynamicProperty("equipped.passiveAnim") != "default"){
        passiveAnimations.forEach(anim=> {
            if (anim.id == player.getDynamicProperty("equipped.passiveAnim")){
                anim.animation(player)
            }
        })
    }

    
    const length = 10;
    dequeueTrail(mTrail,length)
    dequeueTrail(rTrail,length)
}

function dirty(player){
    if (tick % 80===0){
        player.runCommand(`particle hog:dirt_block_emitter ^ ^1.4 ^0.4`)
        player.runCommand(`replaceitem entity @s slot.armor.head 0 hog:dirt_helmet 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
        mc.world.playSound(`random.burp`,player.location)
    }
}


var u = 0;
function rgbHead(player){
    if (tick%10===0){
        u++;
        player.runCommand(`replaceitem entity @s slot.armor.head 0 skull 1 ${u%5} {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
    }
}

const rTrail = new Queue(100);
function rainbowTrail(player){
    if (player.getDynamicProperty("ffa.inGame")){
        const blockList = ["minecraft:black_wool","minecraft:blue_wool","minecraft:brown_wool","minecraft:cyan_wool","minecraft:gray_wool","minecraft:green_wool","minecraft:light_blue_wool","minecraft:lime_wool","minecraft:magenta_wool","minecraft:orange_wool","minecraft:pink_wool","minecraft:purple_wool","minecraft:red_wool","minecraft:white_wool","minecraft:yellow_wool"]
        trail(player,blockList,rTrail)

        try { player.dimension.spawnParticle("hog:rainbow_emitter",player.location) }catch {}
    }
}

const mTrail = new Queue(100);
function moneyTrail(player){
    if (player.getDynamicProperty("ffa.inGame")){
        
        const blockList = ["minecraft:diamond_block","minecraft:iron_block","minecraft:gold_block","minecraft:emerald_block","minecraft:netherite_block"]
        trail(player,blockList,mTrail)

        try {
            if (tick % 20 === 0){
                player.dimension.spawnParticle("minecraft:crop_growth_emitter",player.location)
                player.dimension.spawnParticle("minecraft:totem_particle",player.location)
            }
        }catch {}
    }

}



function trail(player,blockList,queue){
    const loc = player.location;
    player.setDynamicProperty("d",Math.pow(Math.pow(Math.floor(loc.x),2)+Math.pow(Math.floor(loc.y),2)+Math.pow(Math.floor(loc.z),2),0.5))

    if (player.getDynamicProperty("d") == player.getDynamicProperty("lastD")){
        const block = findBlock(player,{x:0,y:-1,z:0},0)
        if (block[0] != "minecraft:air" && !blockList.includes(block[0]) && !passList.includes(block[0])){
            const success = queue.enqueue(block);
            if (success) player.runCommand(`setblock ~ ~-1 ~ ${blockList[tick%blockList.length]}`)
        }
    }else {
        player.setDynamicProperty("lastD",player.getDynamicProperty("d"))
    }
}

function dequeueTrail(queue,tLength,finish){
    if (queue.size > tLength || (tick % 10 === 0 && queue.size > 1)) {
        let nb = queue.dequeue()
        if (nb != null){
            if (nb[2][0]){
                overworld.runCommand(`setblock ${nb[1].x} ${nb[1].y} ${nb[1].z} ${nb[0]} [${nb[2][1]}]`)
            }else {
                overworld.runCommand(`setblock ${nb[1].x} ${nb[1].y} ${nb[1].z} ${nb[0]}`)
            }
        }
    }
}