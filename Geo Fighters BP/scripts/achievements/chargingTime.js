import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"


export const chargingTime = new Achievement("chargingTime","§l§eSuper Sayian",chargeCheck,chargedReward,returnCharged)

// Expecting this one to be easy-ish

function chargeCheck(player){
    if (!chargingTime.get(player)){
        if (player.getDynamicProperty(`Charging Time`) >= 120){
            chargingTime.complete(player)
        }
    }
}

function returnCharged(player){
    if (player.getDynamicProperty(`Charging Time`) > 0){
        return `${player.getDynamicProperty(`Charging Time`).toFixed(1)}s/120s`
    }else {
        return `0s/120s`
    }
}

function chargedReward(player){
    player.setDynamicProperty("2.chat_rank.unlocked",true)
    return "§d[Epic Gamer] §rChat Rank unlocked!"
}