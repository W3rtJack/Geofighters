import * as mc from "@minecraft/server";
import {tick} from "main.js";

import {hlv,overworld} from "abilities.js";
import { projectileCreate, knockback, customDamage, hlv2 } from "../abilities";
import { damageType } from "../damageTypes";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // hasta la vista
        if (item.typeId == hlv.item){
          if (hlv.getCooldown(player) < 0){
            switch (hlv.getLevel(player)){
              case 0:
                if (mc.world.scoreboard.getObjective("hlv.shots").getScore(player) < 1){
                  mc.world.scoreboard.getObjective("hlv.shots").setScore(player,mc.world.scoreboard.getObjective("hlv.stored").getScore(player))
                  mc.world.scoreboard.getObjective("hlv.stored").setScore(player,0)
                  mc.world.playSound("firework.blast",player.location,{pitch:0.5,volume:2})
                  const loc = player.location;
                  loc.y++;
                  overworld.spawnParticle("minecraft:camera_shoot_explosion",loc)
                  hlv.cool(player)
                }
                break;
              case 1:
                if (mc.world.scoreboard.getObjective("hlv.shots").getScore(player) < 1){
                  if (mc.world.scoreboard.getObjective("hlv.stored").getScore(player) >= 3){
                    mc.world.scoreboard.getObjective("hlv.shots").setScore(player,mc.world.scoreboard.getObjective("hlv.stored").getScore(player))
                    mc.world.scoreboard.getObjective("hlv.stored").setScore(player,0)
                    mc.world.playSound("note.snare",player.location,{pitch:0.2,volume:2})
                    const loc = player.location;
                    loc.y++;
                    overworld.spawnParticle("minecraft:camera_shoot_explosion",loc)
                    hlv2.cool(player)
                  }
                }
                break;
            }
          }
        }
    })
})



// Editing this code, made this system to be organised
// Where tf is hlvShooting called
export function hlvShooting(player,amt){
  mc.world.scoreboard.getObjective("hlv.shots").addScore(player,-amt)

  projectileCreate(player,"minecraft:arrow",amt,5,2,"","air",[player.name],false)
}


mc.world.afterEvents.projectileHitBlock.subscribe(c=> {
    const dimension = c.dimension
    const location = c.location
    const projectile = c.projectile
  
    if (projectile.typeId == "minecraft:arrow"){
        try { overworld.spawnParticle("minecraft:egg_destroy_emitter",location) }catch {}
        try { projectile.kill() }catch {}
    }
})

mc.world.afterEvents.projectileHitEntity.subscribe(c=> {
    const dimension = c.dimension
    const location = c.location
    const projectile = c.projectile
  
    if (projectile.typeId == "minecraft:arrow"){
      if (c.getEntityHit().entity.name != projectile.getTags()[0]){
        mc.world.playSound("mob.evocation_illager.cast_spell",location)
        overworld.spawnParticle("hog:blood_emitter",{x:location.x,y:location.y+1,z:location.z})
        if (Math.random()<0.2){
          projectile.runCommand(`scoreboard players add @a[name="${projectile.getTags()[0]}"] combo.count 1`)
          projectile.runCommand(`scoreboard players set @a[name="${projectile.getTags()[0]}"] combo.timer 100`)
        }
        customDamage(3,projectile,projectile.getTags()[0],2,damageType.HastaLaVista)
        projectile.kill()
      }
    }
  })