import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { hlv2 } from "../abilities"


export const americanDream = new Achievement("americanDream","§l§eAmerican Dream",hastaKill,killReward,returnKill)

// Ngl my favourite name
// its just funny the name, because, americans. and guns. and. american. dream... yk...

function hastaKill(player){
    if (!americanDream.get(player)){
        if (player.getDynamicProperty(`${damageType.HastaLaVista}.kills`) >= 10){
            americanDream.complete(player)
        }
    }
}

function returnKill(player){
    if (player.getDynamicProperty(`${damageType.HastaLaVista}.kills`) > 0){
        return `${player.getDynamicProperty(`${damageType.HastaLaVista}.kills`)}/10`
    }else {
        return `0/10`
    }
}

function killReward(player){
    hlv2.unlock(player)
    return `${hlv2.name}`
}