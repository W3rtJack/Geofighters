import {} from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const jebRider = new Achievement("jebRider","§l§eJeb Riderrrrrr",riderCheck,riderReward)

function riderCheck(player){
    if (!jebRider.get(player)){
        if (player.hasTag("jebbing")){
            jebRider.complete(player)
        }
    }
}

function riderReward(player){
    player.setDynamicProperty("1.chat_rank.unlocked",true)
    return "§p[§eR§ea§ai§bn§db§9o§sw§p]§r Chat Rank Unlocked"
}