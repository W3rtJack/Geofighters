import {} from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const flash50 = new Achievement("flash50","§l§eI'm fast asf boi",flashCheck,flashReward,returnFlashes)


function flashCheck(player){
    if (!flash50.get(player)){
        if (player.getDynamicProperty("Flash.used") >= 50){
            // Actually a completing function
            flash50.complete(player)
        }
    }
}

// Returning how many times they've used abilities
function returnFlashes(player){
    if (player.getDynamicProperty("Flash.used") > 0){
        return `${player.getDynamicProperty("Flash.used")}/50`
    }else {
        return `0/50`
    }
}

function flashReward(player){
    player.setDynamicProperty(`2.death_msg.unlocked`,true)
    return "Uncracked fortnite death message"
}