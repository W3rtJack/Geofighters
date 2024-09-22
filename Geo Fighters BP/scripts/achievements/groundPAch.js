import { world } from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes";


export const groundPAch = new Achievement("groundPAch","§l§eGet D-D-Dunked On!",GPKillCheck,GPKillReward)

function GPKillCheck(player){
    if (!groundPAch.get(player)){
        if (player.getDynamicProperty(damageType.HeavyLift+".kills") > 0){
            groundPAch.complete(player)
        }
    }
}

function GPKillReward(player){
    player.setDynamicProperty(`1.death_msg.unlocked`,true)
    return "Dunked on death message"
}