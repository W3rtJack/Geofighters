import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { jeb, leap } from "../abilities"


export const newPlayer = new Achievement("newPlayer","§l§eNew Day, New World",newPlayerFunc,newPlayerReward)

function newPlayerFunc(player){
    if (player.hasTag("tool")) return;
    if (!newPlayer.get(player)) newPlayer.complete(player)
}

function newPlayerReward(player){
    leap.unlock(player);
    jeb.unlock(player);
    return `${jeb.name},${leap.name}`
}