import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { addPlayerVar } from "../abilities";


export const walker = new Achievement("walker","§l§eI love walking...",walkCheck,walkReward,returnBlocks)

function walkCheck(player){
    const vel = player.getVelocity()
    const dist = Math.pow((Math.pow(vel.x,2)+Math.pow(vel.y,2)+Math.pow(vel.z,2)),0.5)
    addPlayerVar(player,"walkDist",dist)
    if (!walker.get(player)){
        if (player.getDynamicProperty("walkDist") >= 50000){
            walker.complete(player);
        }
    }
}


function returnBlocks(player){
    return `${Math.round(player.getDynamicProperty("walkDist"))}/50000`
}

function walkReward(player){
    player.setDynamicProperty(`warden_roar.hit_anim.unlocked`,true)
    return "Warden Roar Hit Animation"
}