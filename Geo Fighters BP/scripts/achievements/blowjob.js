import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { thrower3 } from "../abilities"


export const blowjob = new Achievement("blowjob","§l§eLet me blow you",tntExplode,tntReward,returnExploded)

// Not sure if or how minecraft will like me using "blowjob"
// Censoring and all that jazz

function tntExplode(player){
    if (!blowjob.get(player)){
        if (player.getDynamicProperty(`TNT Launcher.used`) >= 50){
            blowjob.complete(player)
        }
    }
}

function returnExploded(player){
    if (player.getDynamicProperty(`TNT Launcher.used`) > 0){
        return `${player.getDynamicProperty(`TNT Launcher.used`)}/50`
    }else {
        return `0/50`
    }
}

function tntReward(player){
    thrower3.unlock(player);
    return thrower3.name
}