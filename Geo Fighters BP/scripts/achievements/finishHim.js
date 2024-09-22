import * as mc from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { addPlayerVar, tp1, tp2 } from "../abilities";
import { getProp } from "../menus/stats";


export const finishHim = new Achievement("finishHim","§l§eFinish him",comboCheck,comboReward,returnCombo)

function comboCheck(player){
    if (!finishHim.get(player)){
        if (mc.world.scoreboard.getObjective("combo.count").getScore(player) >= 10){
            finishHim.complete(player)
        }
    }

    addPlayerVar(player,"combo.max",0)
    
    if (mc.world.scoreboard.getObjective("combo.count").getScore(player) > player.getDynamicProperty("combo.max")){
        player.setDynamicProperty("combo.max",mc.world.scoreboard.getObjective("combo.count").getScore(player))
    }
}

function returnCombo(player){
    return `${player.getDynamicProperty("combo.max")}/10`
}

function comboReward(player){
    tp2.unlock(player);
    return `${tp2.name}`
}