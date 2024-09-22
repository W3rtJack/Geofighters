import * as mc from "@minecraft/server";

import { ps, pe, overworld } from "abilities.js";
import { addPlayerVar, custExplosion, customDamage, knockback, projectileCreate } from "../abilities";
import { damageType } from "../damageTypes";

// This name went through 3 iterations, sorry for the confusing naming in the code
// Happy with how it turned out, kinda.

// To make things worse, it was a clock too

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Powerup Shot
        if (item.typeId == ps.item){
          if (ps.getCooldown(player) < 0){
            switch (ps.getLevel(player)){
                case 0:
                  ps.cool(player)
                  projectileCreate(player,"hog:armor_stand",1,0,0,"powerShot","minecraft:air",[player.name],true)
                  mc.world.playSound("random.explode",player.location)
                  break;
                case 1:
                  pe.cool(player)
                  projectileCreate(player,"hog:armor_stand",1,0,0,"powerExplosion","minecraft:air",[player.name],true)
                  mc.world.playSound("crossbow.quick_charge.middle",player.location,{volume:2,pitch:0.4})
                  break;
            }
          }
        }
    })
})


export function powerexplosionCheck(ps){
  try {
      mc.world.scoreboard.getObjective("life").addScore(ps,1)
      
      ps.runCommand(`execute as @p[name="${ps.getTags()[0]}"] at @s run tp @s ~ ~ ~`)
  
      const players = overworld.getEntities({
        type: "minecraft:player",
        name: ps.getTags()[0]
      })
  
      const player = players[0]
      
      const score = mc.world.scoreboard.getObjective("life").getScore(ps)
      
      
      if (score < 20){
        mc.world.playSound("block.beehive.exit",ps.location,{pitch:0.5,volume:0.2})
  
        try {
          addPlayerVar(player,"Charging Time",1/20)
        }catch {}
  
        if (player.runCommand(`fill ~2 ~ ~ ~2 ~ ~ purple_wool [] replace air`).successCount > 0) player.runCommand(`setblock ~2 ~ ~ air [] destroy`)
        if (player.runCommand(`fill ~ ~ ~2 ~ ~ ~2 purple_wool [] replace air`).successCount > 0) player.runCommand(`setblock ~ ~ ~2 air [] destroy`)
        if (player.runCommand(`fill ~-2 ~ ~ ~-2 ~ ~ purple_wool [] replace air`).successCount > 0) player.runCommand(`setblock ~-2 ~ ~ air [] destroy`)
        if (player.runCommand(`fill ~ ~ ~-2 ~ ~ ~-2 purple_wool [] replace air`).successCount > 0) player.runCommand(`setblock ~ ~ ~-2 air [] destroy`)
  
        for (var i=0;i<20;i++){
          overworld.spawnParticle("hog:explode_charge",player.location)
        }
      }else {
        custExplosion(15,ps,player.name,6.5,damageType.PowerExplosion,10)
        overworld.spawnParticle("minecraft:huge_explosion_lab_misc_emitter",player.location)
        mc.world.playSound("random.explode",player.location)
        
        knockback(player.location,2,0.4,6.5)
        ps.kill()
      }
  }catch {}
}


export function powershotCheck(ps){
  try {
    mc.world.scoreboard.getObjective("life").addScore(ps,1)

    ps.runCommand(`execute as @p[name="${ps.getTags()[0]}"] at @s run tp @s ~ ~ ~`)

    const players = overworld.getEntities({
        type: "minecraft:player",
        name: ps.getTags()[0]
    })

    const player = players[0]


    try {
        ps.setRotation(player.getRotation())
    }catch {}

    const score = mc.world.scoreboard.getObjective("life").getScore(ps)
    if (score < 10){
        addPlayerVar(player,"Charging Time",1/20)
        ps.runCommand(`tp @s @p[name="${ps.getTags()[0]}"]`)
        const loc = player.location;
        loc.y++;

        
        mc.world.playSound("block.beehive.exit",ps.location,{pitch:0.5,volume:0.2})
        
        if (ps.runCommand(`fill ^ ^ ^1 ^ ^ ^1 purple_wool [] replace air`).successCount > 0){
        ps.runCommand(`setblock ^ ^ ^1 air [] destroy`)
        }
        

        for (var i=0;i<20;i++){
        overworld.spawnParticle("minecraft:end_chest",player.location)
        }
    }
    else {
        ps.clearVelocity()
        const view = ps.getViewDirection()
        const speedFactor = 5
        ps.applyImpulse({x:view.x*speedFactor,y:view.y*speedFactor,z:view.z*speedFactor})


        const molang = new mc.MolangVariableMap();
        molang.setVector3("variable.acceleration",{x:0,y:0,z:0})

        for (var i=0;i<speedFactor;i++){
        try {
            overworld.spawnParticle("minecraft:eyeofender_death_explode_particle",{x:ps.location.x+view.x*i,y:ps.location.y+view.y*i,z:ps.location.z+view.z*i},molang)
        }catch {}
        
        if (ps.runCommand(`fill ^ ^ ^${i} ^ ^ ^${i} purple_wool [] replace air`).successCount > 0){
            ps.runCommand(`setblock ^ ^ ^${i} air [] destroy`)
        }
        }
        
        customDamage(12,ps,ps.getTags()[0],2.5,damageType.PowerShot)
    }
    if (score > 30){
        ps.kill()
    }
  }catch {}
}