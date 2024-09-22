import { Achievement } from "../dataTypes"
import { achList } from "./achievements";


export const theEnd = new Achievement("theend","§l§eThe GEO!",geoCheck,geoReward,geoReturn)

function geoCheck(player){
    if (!theEnd.get(player)){
        let done = true;
        achList.forEach(ach => {
            if (!ach.get(player)) done = false;
        });

        if (done) player.complete(theEnd)
    }
}

function geoReward(player){
    player.setDynamicProperty("4.chat_rank.unlocked",true)
    return "§6[GEO]§r Chat Rank Unlocked"
}

function geoReturn(player){
    let complete = 0;
    achList.forEach(ach => {
        if (ach.get(player)) complete++;
    });

    return `${complete}/${achList.length}`

}