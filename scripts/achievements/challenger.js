import { Achievement } from "../dataTypes"
import { passiveAnimations } from "../cosmetic/passiveAnim";
import { rainbowify } from "../cosmetic/chatRank";


export const challenger = new Achievement("challenger","§l§eThe X-Factor",challengerCheck,challengerReward,challengerReturn)

function challengerCheck(player){
    if (!challenger.get(player)){
        let complete = true;
        for (var i=1;i<6;i++){
            if (!player.getDynamicProperty(`challenge.${i}.complete`)) complete = false;
        }

        if (complete) player.complete(challenger)
    }
}

function challengerReward(player){
    passiveAnimations[3].unlock(player);
    return rainbowify("Rainbow Trail")
}

function challengerReturn(player){

    let complete = 0;
    for (var i=1;i<5;i++){
        if (player.getDynamicProperty(`challenge.${i}.complete`)) complete++;
    }

    return `${complete}/5`
}