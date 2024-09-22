import * as mc from "@minecraft/server";

import {grabber,overworld,addPlayerVar} from "abilities.js";
import { projectileCreate } from "../abilities";



mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Jail Time
        if (item.typeId == grabber.item){
          if (grabber.getCooldown(player) < 0){
            switch (grabber.getLevel(player)){
              case 0:
                projectileCreate(player,"hog:armor_stand",1,0,6,"grabber","minecraft:air",[player.name],true)
                mc.world.playSound("mob.witch.throw",player.location)
                grabber.cool(player)
                break;
            }
          }
        }
    })
})


export function grabberCheck(grab){
    grab.runCommand("scoreboard players add @s life 1")
  
  
    grab.runCommand(`particle minecraft:redstone_ore_dust_particle ~ ~ ~`)
    grab.runCommand(`particle hog:blood_emitter ^ ^1.5 ^`)
  
    if (grab.runCommand(`testfor @p[name=!"${grab.getTags()[0]}",r=4]`).successCount > 0){
      grab.runCommand(`execute as @s at @p[name=!"${grab.getTags()[0]}",r=4,c=1] run tp @s ~ ~ ~ facing @p[name="${grab.getTags()[0]}"]`)
      grab.runCommand(`execute as @s as @p[name=!"${grab.getTags()[0]}",r=4,c=1] run tp @p ^ ^ ^1 facing @p[name="${grab.getTags()[0]}"]`)
      grab.runCommand(`execute as @s as @p[name=!"${grab.getTags()[0]}",r=4,c=1] run tag @s add cooldownPause`)
      grab.runCommand(`execute as @s at @p[name=!"${grab.getTags()[0]}",r=4,c=1] if entity @p[name="${grab.getTags()[0]}",r=2,c=1] run scoreboard players set @s life -2`)
      grab.addTag("connected")
    }
    
    if (grab.hasTag("connected")){
      const players = overworld.getEntities({
        type: "minecraft:player",
        name: grab.getTags()[0]
      })
      for (const player of players){
        const dist = Math.round(((player.location.x-grab.location.x)**2+(player.location.y-grab.location.y)**2+(player.location.z-grab.location.z)**2)**0.5)
        for (var i=0;i < dist; i+=0.5){
          const newI = i-2
          const DY = Math.cos(newI/(dist*0.325)*2)
          grab.runCommand(`particle hog:custom_redstone_ore_dust_particle ^ ^${DY} ^${i}`)
        }

        addPlayerVar(player,"Grabber.distance",0)
        if (dist > player.getDynamicProperty("Grabber.distance")){
          player.setDynamicProperty("Grabber.distance",dist)
        }
        
        if (!grab.getDynamicProperty("Grabber.got")){
          addPlayerVar(player,"Grabber.hits",1)
          grab.setDynamicProperty("Grabber.got",true)
        }
      }

      
    }
  
    if (grab.hasTag("connected")){
      grab.runCommand(`execute unless entity @p[name=!"${grab.getTags()[0]}",r=2] run kill`)
    }else {
      grab.runCommand("kill @s[scores={life=100..}]")
      try {
        grab.runCommand("execute align xyz unless block ~ ~-0.1 ~ air run kill")
      }catch {}
    }
    
    try {
      if (mc.world.scoreboard.getObjective("life").getScore(grab) < 0){
        grab.runCommand(`execute as @s as @p[name=!"${grab.getTags()[0]}",r=2,c=1] run inputpermission set @s movement enabled`)
        grab.kill()
      }
    }catch {}
  }