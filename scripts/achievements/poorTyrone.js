import * as mc from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { addPlayerVar } from "../abilities"



export const poorTyrone = new Achievement("poorTyrone","§l§eIt's better than black and white",tyroneCheck,tyroneKillReward)

// People may need some context to whom tyrone is
// Tyrone the turret...

// In retrospect should've called this one racist

function tyroneCheck(player){
    if (!poorTyrone.get(player)){
        if (player.getDynamicProperty(`Tyrone.killed`) >= 1){
            poorTyrone.complete(player)
        }
    }
}


mc.world.afterEvents.entityDie.subscribe(a=> {
    const dead = a.deadEntity
    const killer = a.damageSource.damagingEntity

    if (dead.typeId == "minecraft:zombie" && dead.nameTag == "Turret"){
        if (killer != undefined){
            addPlayerVar(killer,"Tyrone.killed",1)
        }
    }
})

function tyroneKillReward(player){
    player.setDynamicProperty("rainbow_skull.passiveAnim.unlocked",true)
    return "Rainbow skull passive animation unlocked"
}