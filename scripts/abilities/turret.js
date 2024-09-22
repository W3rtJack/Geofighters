import * as mc from "@minecraft/server"
import {tick} from "main.js";
import {turret,projectileCreate} from "abilities.js"
import { addPlayerVar, customDamage } from "../abilities";
import { damageType } from "../damageTypes";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack
    const player = t.source
    t.canceled = true
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Turret
        if (item.typeId == turret.item){
            if (turret.getCooldown(player) <= 0){
                switch (turret.getLevel(player)){
                    case 0:
                        player.runCommand(`kill @e[name=Turret,tag="${player.name}"]`)
                        turret.cool(player);
                        const turretEntity = projectileCreate(player,"minecraft:zombie",1,0,0,turret.name,"air",[player.name],false)
                        turretEntity.runCommand("replaceitem entity @s slot.armor.head 0 skull 1 1")
                        turretEntity.runCommand("replaceitem entity @s slot.armor.chest 0 leather_chestplate")
                        turretEntity.runCommand("replaceitem entity @s slot.armor.legs 0 leather_leggings")
                        turretEntity.runCommand("replaceitem entity @s slot.armor.feet 0 leather_boots")
                }
            }
        }
    })
})


const tyroneRange = 10;
const tyroneLife = 30*20;

export function turretCheck(tyrone){
    mc.world.scoreboard.getObjective("life").addScore(tyrone,1)

    tyrone.clearVelocity()

    tyrone.runCommand(`tp @s ~ ~ ~ facing @p[r=${tyroneRange},name=!"${tyrone.getTags()[0]}"]`)


    if (tick%30===0){
        mc.world.playSound("extinguish.candle",tyrone.location,{pitch:0.2,volume:3})

        try {
            tyrone.dimension.spawnParticle("hog:evoker_spell",tyrone.location)
            tyrone.dimension.spawnParticle("minecraft:knockback_roar_particle",tyrone.location)
        }catch {}
        
        if (tyrone.runCommand(`testfor @p[name=!"${tyrone.getTags()[0]}",r=${tyroneRange}]`).successCount > 0){
            mc.world.playSound("mob.wither.shoot",tyrone.location,{pitch:0.7})
            const beam = projectileCreate(tyrone,"hog:armor_stand",1,0,2,"beam","air",tyrone.getTags(),true)
            beam.runCommand("replaceitem entity @s slot.armor.head 0 skull 1 1")
        }
    }

    const beams = tyrone.dimension.getEntities({
        type: "hog:armor_stand",
        maxDistance: tyroneRange,
        location: tyrone.location,
        name: "beam",
        tags: tyrone.getTags()
    })

    for (const beam of beams){
        if (customDamage(3,beam,beam.getTags()[0],2,damageType.Turret)){
            beam.kill()
        }
    }

    tyrone.runCommand(`execute as @e[name=beam,tag="${tyrone.getTags()[0]}"] at @s unless entity @e[type=zombie,name=Turret,r=${tyroneRange}] run kill`)
    tyrone.runCommand(`execute as @e[name=beam,tag="${tyrone.getTags()[0]}"] run scoreboard players add @s life 1`)
    tyrone.runCommand(`execute as @e[name=beam,tag="${tyrone.getTags()[0]}"] if score @s life matches 10.. run tp @s ~ -200 ~`)
    tyrone.runCommand(`execute as @e[name=beam,tag="${tyrone.getTags()[0]}"] at @s run particle minecraft:basic_smoke_particle`)
    tyrone.runCommand(`execute as @e[name=beam,tag="${tyrone.getTags()[0]}"] at @s run particle hog:custom_redstone_ore_dust_particle`)




    if (mc.world.scoreboard.getObjective("life").getScore(tyrone) > tyroneLife){
        tyrone.runCommand(`tp @e[name=beam,tag="${tyrone.getTags()[0]}"] ~ -200 ~`)
        tyrone.runCommand("tp @s ~ -200 ~")
        tyrone.kill()
    }
}