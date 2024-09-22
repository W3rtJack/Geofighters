import {} from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const kill100 = new Achievement("kill100","§l§eRambo 1",killCheck,killReward,returnKills)


function killCheck(player){
    if (!kill100.get(player)){
        if (player.getDynamicProperty("kills") >= 100){
            // Actually a completing function
            kill100.complete(player)
        }
    }
}

function returnKills(player){
    if (player.getDynamicProperty("kills") > 0){
        return `${player.getDynamicProperty("kills")}/100`
    }else {
        return `0/100`
    }
}

function killReward(player){
    player.setDynamicProperty(`3.death_msg.unlocked`,true)
    return "Blood for the blood god death message"
}