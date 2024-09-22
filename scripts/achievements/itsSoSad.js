import {} from "@minecraft/server";
import { Achievement } from "../dataTypes"


export const itsSoSad = new Achievement("itsSoSad","§l§eGo outside",outsideCheck,sadReward,returnUsed)


// The check to see if these people waste their life on what i spend alot of my time making
// Its a pisstake haha

function outsideCheck(player){
    if (!itsSoSad.get(player)){
        if (player.getDynamicProperty("abilityUsed") >= 10000){
            // Actually a completing function
            itsSoSad.complete(player)
        }
    }
}

// Returning how many times they've used abilities
function returnUsed(player){
    if (player.getDynamicProperty("abilityUsed") > 0){
        return `${player.getDynamicProperty("abilityUsed")}/10000`
    }else {
        return `0/10000`
    }
}

function sadReward(player){
    player.setDynamicProperty("comic_decal.hit_anim.unlocked",true)
    return "Comic Decal hit animation"
}


// Why wont this function work?