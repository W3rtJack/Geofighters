import * as mc from "@minecraft/server"

import {kbPunch,projectileCreate,knockback,customDamage} from "abilities.js"
import { damageType } from "../damageTypes"
import { comboLoseTime} from "../main"
import { addPlayerVar } from "../abilities"

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack
    const player = t.source
    t.canceled = true
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Knockback Punch
        if (item.typeId == kbPunch.item){
            if (kbPunch.getCooldown(player) <= 0){
                switch (kbPunch.getLevel(player)){
                    case 0:
                    kbPunch.cool(player);
                    projectileCreate(player,"hog:armor_stand",1,0,0,"kbPunching","air",[player.name],true)
                }
            }
        }
    })
})

export function knockbackPunch(puncher){
    const life = 200
    mc.world.scoreboard.getObjective("life").addScore(puncher,1);

    puncher.runCommand(`execute at @p[name="${puncher.getTags()[0]}"] run tp @s ~ ~2 ~`)

    const rot = puncher.getRotation()
    rot.y += 8
    puncher.setRotation(rot)

    if (puncher.runCommand("fill ^ ^-1 ^2 ^ ^-1 ^2 yellow_wool [] replace air").successCount > 0) puncher.runCommand("setblock ^ ^-1 ^2 air [] destroy")
    if (puncher.runCommand("fill ^ ^-1 ^-2 ^ ^-1 ^-2 yellow_wool [] replace air").successCount > 0) puncher.runCommand("setblock ^ ^-1 ^-2 air [] destroy")

    puncher.runCommand("particle minecraft:sparkler_emitter ^ ^-1 ^2")
    puncher.runCommand("particle minecraft:sparkler_emitter ^ ^-1 ^-2")
    


    if (mc.world.scoreboard.getObjective("life").getScore(puncher) >= life){
        puncher.runCommand("tp @s ~ -200 ~")
        puncher.kill()
    }
}


mc.world.afterEvents.entityHitEntity.subscribe(a => {
    const player = a.hitEntity;
    const attacker = a.damagingEntity;

    if (player.typeId == attacker.typeId && player.typeId == "minecraft:player"){
        if (attacker.runCommand(`testfor @e[type=hog:armor_stand,name=kbPunching,tag="${attacker.name}"]`).successCount > 0){
            player.applyKnockback(player.location.x-attacker.location.x,player.location.z-attacker.location.z,10,(player.location.y-attacker.location.y+0.2))
            mc.world.playSound("random.anvil_land",player.location)
            player.dimension.spawnParticle("minecraft:knockback_roar_particle",player.location)
            player.dimension.spawnParticle("minecraft:huge_explosion_lab_misc_emitter",player.location)
            customDamage(4,player,attacker.name,1,damageType.KnockbackPunch)
            player.runCommand(`scoreboard players add @p[name="${attacker.name}"] combo.count 1`)
            if (player.hasTag("binded")){
                addPlayerVar(attacker,"Scorching Flame.combo",1)
                attacker.setDynamicProperty("Scorching Flame.timer",comboLoseTime)   
            }
        }
        else {
            customDamage(0,player,attacker.name,1,"Player")
        }
    }
})