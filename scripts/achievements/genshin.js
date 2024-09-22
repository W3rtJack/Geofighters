import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"


export const genshin = new Achievement("genshin","§l§eGacha Addiction",gachaCheck,gachaReward,returnOpened)

function gachaCheck(player){
    if (!genshin.get(player)){
        if (player.getDynamicProperty("crate.opened") >= 10){
            genshin.complete(player);
        }
    }
}


function returnOpened(player){
    return `${player.getDynamicProperty("crate.opened") > 0 ? player.getDynamicProperty("crate.opened") : 0}/10`
}

function gachaReward(player){
    player.setDynamicProperty("3.chat_rank.unlocked",true)
    return "§2[Money$$] Chat Rank"
}