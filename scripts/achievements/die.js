import * as mc from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { addPlayerVar } from "../abilities";


export const die = new Achievement("die","§l§eWomp Womp",dieCheck,dieReward)

// Womp womp
// This is the closest I'd agree to having no reward for an achievement
// Raidz... why did you make me do this.

function dieCheck(player){
    if (!die.get(player)){
        if (player.getDynamicProperty("deaths") > 0){
            die.complete(player)
        }
    }
}

function dieReward(player){
    addPlayerVar(player,"money",1)
    return "1 Coin"
}