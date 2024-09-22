import {} from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const kill1000 = new Achievement("kill1000","§l§eRambo 2",killCheck,rewardKills,returnKills)


function killCheck(player){
    if (!kill1000.get(player)){
        if (player.getDynamicProperty("kills") >= 250){
            // Actually a completing function
            kill1000.complete(player)
        }
    }
}

function returnKills(player){
    if (player.getDynamicProperty("kills") > 0){
        return `${player.getDynamicProperty("kills")}/250`
    }else {
        return `0/250`
    }
}

function rewardKills(player){
    player.setDynamicProperty(`blood_body.deathAnimation.unlocked`,true)
    return "Blood body death animation"
}