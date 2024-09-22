import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { fireworksBlaster2 } from "../abilities"


export const fireworks1000 = new Achievement("1000fireworks","§l§e4th of July",fireworkShots,fireworkReward,returnShot)

function fireworkShots(player){
    if (!fireworks1000.get(player)){
        if (player.getDynamicProperty("fireworksShot") >= 1000){
            fireworks1000.complete(player)
        }
    }
}

function returnShot(player){
    if (player.getDynamicProperty("fireworksShot") > 0){
        return `${player.getDynamicProperty("fireworksShot")}/1000`
    }else {
        return `0/1000`
    }
}

function fireworkReward(player){
    fireworksBlaster2.unlock(player);
    return fireworksBlaster2.name
}