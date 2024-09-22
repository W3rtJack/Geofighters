import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { kt2 } from "../abilities"


export const kt100 = new Achievement("kt100","§l§eIma chef you up, fam",knifeHits,knifeReward,returnHit)

function knifeHits(player){
    if (!kt100.get(player)){
        const knifeHits = player.getDynamicProperty(`${damageType.KnifeThrow}.hits`)
        if (knifeHits >= 100){
            kt100.complete(player)
        }
    }
}

function returnHit(player){
    const knifeHits = player.getDynamicProperty(`${damageType.KnifeThrow}.hits`)
    if (knifeHits > 0){
        return `${knifeHits}/100`
    }else {
        return `0/100`
    }
}

function knifeReward(player){
    kt2.unlock(player);
    return kt2.name
}