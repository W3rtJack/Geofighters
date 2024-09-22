import * as mc from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const win100 = new Achievement("win100","§l§eFight Club",winsCheck,winReward,returnWins)

// Changed after playing to 50 wins
// Easier for all and saves alot of time
// Managed to get every other achievement whilst casually playing + coding and bug fixing
function winsCheck(player){
    if (!win100.get(player)){
        if (mc.world.scoreboard.getObjective("wins").getScore(player) >= 50){
            win100.complete(player)
        }
    }
}


function returnWins(player){
    return `${mc.world.scoreboard.getObjective("wins").getScore(player)}/50`
}


function winReward(player){
    player.setDynamicProperty(`confetti.deathAnimation.unlocked`,true)
    return "Confetti death animation"
}