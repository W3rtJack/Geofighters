import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"


export const fireworkhit500 = new Achievement("500fireworkhit","§l§eKaty Perrys Dream",fireworkHits,hitReward,returnHit)

function fireworkHits(player){
    if (!fireworkhit500.get(player)){
        if (player.getDynamicProperty(`${damageType.Firework}.hits`) >= 500){
            fireworkhit500.complete(player)
        }
    }
}

function returnHit(player){
    if (player.getDynamicProperty(`${damageType.Firework}.hits`) > 0){
        return `${player.getDynamicProperty(`${damageType.Firework}.hits`)}/500`
    }else {
        return `0/500`
    }
}

function hitReward(player){
    player.setDynamicProperty(`firework_explode.deathAnimation.unlocked`,true)
    return "Firework Explode kill animation"
}