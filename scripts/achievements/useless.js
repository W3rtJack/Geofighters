import { world } from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes";


export const useless = new Achievement("useless","§l§eYou found a use for this?!",GPKillCheck,uselessReward)

// I thought the ground pound was useless
// Then there was the Scorching flame, the achievement was impossible without this
// Pretty funny, also does 2 hearts extra damage
// Stronk. Love it

function GPKillCheck(player){
    if (!useless.get(player)){
        if (player.getDynamicProperty("KnockbackPunch.kills") > 0){
            useless.complete(player)
        }
    }
}

function uselessReward(player){
    player.setDynamicProperty("dirt_head.passiveAnim.unlocked",true)
    return "Dirt Block Head passive animation unlocked"
}