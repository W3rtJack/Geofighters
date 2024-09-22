import * as mc from "@minecraft/server";

import { jailTime } from "abilities.js";
import { addPlayerVar, projectileCreate } from "../abilities";

// This name went through 3 iterations, sorry for the confusing naming in the code
// Happy with how it turned out, kinda.

// To make things worse, it was a clock too

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Jail Time
        if (item.typeId == jailTime.item){
          if (jailTime.getCooldown(player) < 0){
            switch (jailTime.getLevel(player)){
              case 0:
                mc.world.playSound("respawn_anchor.deplete",player.location,{pitch:0.3,volume:2})
                const loc = player.location;
                loc.y++;
                projectileCreate(player,"hog:armor_stand",1,0,4,"fBinder","air",[player.name],true)
                jailTime.cool(player)
                break;
            }
          }
        }
    })
})


export function flameBindCheck(bind){
  bind.runCommand(`tag @a remove binded`)
  bind.runCommand("scoreboard players add @s life 1")

  if (bind.runCommand(`testfor @p[name=!"${bind.getTags()[0]}",r=3]`).successCount > 0){
    if (!bind.hasTag("connected")){
      mc.world.playSound("dig.nether_brick",bind.location,{pitch:0.3})
      mc.world.playSound("random.explode",bind.location,{pitch:0.5})
      bind.runCommand(`execute as @s at @p[name=!"${bind.getTags()[0]}",r=3,c=1] if entity @p[name="${bind.getTags()[0]}",r=2,c=1] run scoreboard players set @s life -2`)
      
      addPlayerVar(bind.dimension.getEntities({name:bind.getTags()[0],type:"minecraft:player"})[0],"Scorching Flame.hits",1)
    }

    bind.addTag("connected")

    bind.runCommand(`execute as @s at @p[name=!"${bind.getTags()[0]}",r=3,c=1] run tp @s ~ ~ ~`)
    bind.runCommand(`execute as @s as @p[name=!"${bind.getTags()[0]}",r=3,c=1] run tp @p ~ ~ ~`)
    bind.runCommand(`execute as @s as @p[name=!"${bind.getTags()[0]}",r=3,c=1] run tag @s add binded`)
    bind.runCommand(`execute as @s as @p[name=!"${bind.getTags()[0]}",r=3,c=1] run tag @s add cooldownPause`)
    bind.clearVelocity()

    
    const rot = bind.getRotation()
    rot.y += 8
    bind.setRotation(rot)

    bind.runCommand("particle minecraft:basic_flame_particle ^ ^2 ^1")
    bind.runCommand("particle minecraft:elephant_tooth_paste_vapor_particle ^ ^2 ^")
    bind.runCommand("particle minecraft:basic_flame_particle ^ ^1 ^1")
    bind.runCommand("particle minecraft:basic_flame_particle ^ ^ ^1")
    bind.runCommand(`particle minecraft:mobflame_single ^ ^1 ^2`)
    bind.runCommand(`particle minecraft:lava_particle ^ ^1 ^2`)

  }else {
    bind.runCommand(`particle minecraft:basic_flame_particle ~ ~ ~`)
    bind.runCommand(`particle minecraft:mobflame_single ^ ^1.5 ^`)
    bind.runCommand("particle minecraft:stalactite_lava_drip_particle ^ ^1 ^1")
  }
  

  if (bind.hasTag("connected")){
    bind.runCommand(`execute unless entity @p[name=!"${bind.getTags()[0]}",r=2] run kill`)
  }else {
      bind.runCommand("execute align xyz unless block ~ ~-0.1 ~ air run kill")
  }
  
  try {
    if (mc.world.scoreboard.getObjective("life").getScore(bind) > 50){
      bind.kill()
    }
  }catch {}
}