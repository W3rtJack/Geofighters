import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { skully2 } from "../abilities";


export const flashBang20 = new Achievement("flashBang20","§l§eAre you a flash bang?",skullyHits,skullyReward,returnHit)

function skullyHits(player){
    if (!flashBang20.get(player)){
        var skullyHits = 0;
        if (player.getDynamicProperty(`${damageType.Skully}.hits`) > 0) skullyHits += player.getDynamicProperty(`${damageType.Skully}.hits`)
        if (player.getDynamicProperty(`${damageType.Skullyrang}.hits`) > 0) skullyHits += player.getDynamicProperty(`${damageType.Skullyrang}.hits`)
        if (skullyHits >= 20){
            flashBang20.complete(player)
        }
    }
}

function returnHit(player){
    var skullyHits = 0;
    if (player.getDynamicProperty(`${damageType.Skully}.hits`) > 0) skullyHits += player.getDynamicProperty(`${damageType.Skully}.hits`)
    if (player.getDynamicProperty(`${damageType.Skullyrang}.hits`) > 0) skullyHits += player.getDynamicProperty(`${damageType.Skullyrang}.hits`)
    if (skullyHits > 0){
        return `${skullyHits}/20`
    }else {
        return `0/20`
    }
}

function skullyReward(player){
    skully2.unlock(player)
    return skully2.name
}