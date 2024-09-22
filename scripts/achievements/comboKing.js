import * as mc from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { getProp } from "../menus/stats";


export const comboKing = new Achievement("comboKing","§l§eCombo King",comboCheck,comboReward,returnCombo)

function comboCheck(player){
    if (!comboKing.get(player)){
        if (mc.world.scoreboard.getObjective("combo.count").getScore(player) >= 30){
            comboKing.complete(player)
        }
    }
}

function returnCombo(player){
    return `${player.getDynamicProperty("combo.max")}/30`
}

function comboReward(player){
    player.setDynamicProperty("flicked.deathAnimation.unlocked",true)
    return "Flicked death animations"
}