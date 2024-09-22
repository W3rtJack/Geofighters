import {} from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { addPlayerVar } from "../abilities";


export const blazingGlory = new Achievement("blazingGlory","§l§eBlazing Glory",blazingGloryCheck,comboReward,returnComboMax)

// I think the ability is the only one with an actually good form of naming
// Trust me, i know what ive done. i regret it


function blazingGloryCheck(player){
    if (!blazingGlory.get(player)){
        if (player.getDynamicProperty(`Scorching Flame.maxCombo`) >= 10){
            blazingGlory.complete(player)
        }
    }


    addPlayerVar(player,"Scorching Flame.timer",-1)
    if (player.getDynamicProperty("Scorching Flame.timer") < 1){
        player.setDynamicProperty("Scorching Flame.combo",0)
    }

    addPlayerVar(player,"Scorching Flame.maxCombo",0)
    if (player.getDynamicProperty("Scorching Flame.combo") > player.getDynamicProperty("Scorching Flame.maxCombo")){
        player.setDynamicProperty("Scorching Flame.maxCombo",player.getDynamicProperty("Scorching Flame.combo"))
    }
}


function returnComboMax(player){
    if (player.getDynamicProperty("Scorching Flame.maxCombo") > 0){
        return `${player.getDynamicProperty("Scorching Flame.maxCombo")}/10`
    }else {
        return `0/10`
    }
}

// System is a bit weird, for the numeric ID for death msg.
// It works, and is flexible, im taking it
// Big mistake if i want to take one out
function comboReward(player){
    player.setDynamicProperty(`5.death_msg.unlocked`,true)
    return "[Redacted] death message"
}