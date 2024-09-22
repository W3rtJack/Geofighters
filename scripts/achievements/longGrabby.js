import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"


export const longGrabby = new Achievement("longGrabby","§l§eGrabpack",grabLength,longReward,returnLength)

function grabLength(player){
    if (!longGrabby.get(player)){
        if (player.getDynamicProperty(`Grabber.distance`) >= 50){
            longGrabby.complete(player)
        }
    }
}

function returnLength(player){
    if (player.getDynamicProperty(`Grabber.distance`) > 0){
        return `${player.getDynamicProperty(`Grabber.distance`)}/50`
    }else {
        return `0/50`
    }
}

function longReward(player){
    player.setDynamicProperty(`4.death_msg.unlocked`,true)
    return "Positive skill issue death message"
}