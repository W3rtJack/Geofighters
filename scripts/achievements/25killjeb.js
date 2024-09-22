import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { addPlayerVar, tripleJeb } from "../abilities"


export const kill25jeb = new Achievement("25killjeb","§l§eIs it pride month?",jebKills,jebReward,returnKilled)

function jebKills(player){
    if (!kill25jeb.get(player)){
        if (player.getDynamicProperty(`${damageType.Jeb}.kills`) >= 10){
            kill25jeb.complete(player)
        }
    }
}

function returnKilled(player){
    if (player.getDynamicProperty(`${damageType.Jeb}.kills`) > 0){
        return `${player.getDynamicProperty(`${damageType.Jeb}.kills`)}/10`
    }else {
        return `0/10`
    }
}

function jebReward(player){
    tripleJeb.unlock(player);
    addPlayerVar(player,"money",169)
    return `${tripleJeb.name} + $169`
}