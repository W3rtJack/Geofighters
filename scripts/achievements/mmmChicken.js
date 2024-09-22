import * as mc from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const mmmChicken = new Achievement("mmmChicken","§l§eWinner Winner Chicken Dinner",winsCheck,winsReward,returnWins)

// Why tf did I name this mmmChicken

function winsCheck(player){
    if (!mmmChicken.get(player)){
        if (mc.world.scoreboard.getObjective("wins").getScore(player) >= 10){
            mmmChicken.complete(player)
        }
    }
}


function returnWins(player){
    return `${mc.world.scoreboard.getObjective("wins").getScore(player)}/10`
}

function winsReward(player){
    player.setDynamicProperty("challenges.unlocked",true)
    return "Challenges Unlocked"
}