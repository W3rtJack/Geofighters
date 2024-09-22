import * as mc from "@minecraft/server";

import { overworld } from "abilities.js";
import { customDamage, passList, projectileCreate, skully, skully2, skully3 } from "../abilities";
import { damageType } from "../damageTypes";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // skully
        if (item.typeId == skully.item){
          if (skully.getCooldown(player) < 0){
            switch (skully.getLevel(player)){
              case 0:
                projectileCreate(player,"hog:armor_stand",1,0,1,"Skully","air",[player.name])
                skully.cool(player)
                mc.world.playSound("mob.wither.shoot",player.location)
                break;
              case 1:
                projectileCreate(player,"hog:armor_stand",3,10,1,"Skully","air",[player.name])
                skully2.cool(player)
                break;
              case 2:
                projectileCreate(player,"hog:armor_stand",1,0,2,"Skullyrang_1","minecraft:bone",[player.name,"skullyrang"])
                projectileCreate(player,"hog:armor_stand",1,0,1,"Skullyrang_2","minecraft:bone",[player.name,"skullyrang"])
                projectileCreate(player,"hog:armor_stand",1,0,1,"Skullyrang_3","minecraft:bone",[player.name,"skullyrang"])
                mc.world.playSound("item.trident.throw",player.location)
                skully3.cool(player,20*20)
                break;
            }
          }
        }
    })
})




const skullyLife = 2*20

export function skullyCheck(skull){

    skull.runCommand(`replaceitem entity @s slot.armor.head 0 skull`);

    // Movement
    const velocity = skull.getVelocity()
    skull.clearVelocity()
    skull.applyImpulse(velocity)

    // Breaking
    const testLoc = {
        x: skull.location.x + skull.getViewDirection().x,
        y: skull.location.y + skull.getViewDirection().y,
        z: skull.location.z + skull.getViewDirection().z
    }
    try {
        if (!passList.includes(skull.dimension.getBlock(testLoc).typeId)){
            mc.world.playSound("mob.dolphin.hurt",testLoc,{pitch:0.7})

            const loc = skull.location;
            loc.y += 1.5;

            skull.dimension.spawnParticle("minecraft:critical_hit_emitter",loc)
            
            skull.runCommand(`scoreboard players set @s life ${skullyLife+1}`)
        }
    }catch {}
  
    customDamage(5,skull,skull.getTags()[0],2,damageType.Skully)
    skull.runCommand(`execute as @a[r=2,name=!"${skull.getTags()}"] at @s run camera @s fade time 0.2 0.5 0.2 color 255 255 255`)
    skull.runCommand(`execute as @a[r=2,name=!"${skull.getTags()}"] at @s run playsound mob.enderdragon.hit @a ~ ~ ~ 4 0.5`)
    skull.runCommand(`execute as @a[r=2,name=!"${skull.getTags()}"] at @s run particle minecraft:evoker_spell ~ ~1.5 ~`)
    skull.runCommand(`execute as @a[r=2,name=!"${skull.getTags()}"] at @s run particle minecraft:critical_hit_emitter ~ ~1.5 ~`)
    
    var map = new mc.MolangVariableMap()
    map.setFloat("r",0)
    map.setFloat("g",255)
    map.setFloat("b",0)
  
    try {
      var loc = skull.location;
      loc.y += 2
      loc = {x:loc.x-velocity.x,y:loc.y-velocity.y,z:loc.z-velocity.z};
      overworld.spawnParticle("minecraft:falling_dust",loc,map)
    }catch {}
  
    
    skull.runCommand(`execute at @s if entity @a[r=2,name=!"${skull.getTags()}"] run scoreboard players set @s life ${skullyLife+1}`)
  
    skull.runCommand("scoreboard players add @s life 1")
    if (mc.world.scoreboard.getObjective("life").getScore(skull) > skullyLife){
      skull.runCommand("tp @s ~ -200 ~")
    }
}


export function skulrang(skully){
    mc.world.scoreboard.getObjective("life").addScore(skully,1)
    const velocity = skully.getVelocity()
    skully.clearVelocity()
    skully.applyImpulse(velocity)
  
    const rot = skully.getRotation()
    rot.y += 15
    skully.setRotation(rot)
  
    try {
      let rot2 = skully.getViewDirection()
      const loc = {x:skully.location.x+rot2.x,y:skully.location.y+1,z:skully.location.z+rot2.z}
      overworld.spawnParticle("minecraft:endrod",loc)
  
      
      const loc1 = skully.location
      loc1.y++
      overworld.spawnParticle("minecraft:elephant_tooth_paste_vapor_particle",loc1)
    }catch {}
  
    
    // Skullyrang_1
    skully.runCommand(`tp @e[name="Skullyrang_2",tag="${skully.getTags()[0]}"] ^-0.5 ^ ^1.2 facing ^-1 ^ ^-0.2`)
    skully.runCommand(`tp @e[name="Skullyrang_3",tag="${skully.getTags()[0]}"] ^-1 ^ ^0.2 facing ^5 ^ ^`)
  
  
    if (skully.runCommand(`testfor @p[name="${skully.getTags()[0]}",r=30]`).successCount < 1){
      skully.addTag("return")
    }
  
    if (skully.runCommand(`testfor @a[r=3,name=!"${skully.getTags()[0]}"]`).successCount > 0){
      customDamage(6,skully,skully.getTags()[0],3,damageType.Skullyrang)
      skully.runCommand(`execute as @a[r=3,name=!"${skully.getTags()[0]}"] at @s run camera @s fade time 0.2 0.2 0.2 color 255 255 255`)
      skully.runCommand(`execute as @a[r=3,name=!"${skully.getTags()[0]}"] at @s run playsound mob.enderdragon.hit @a ~ ~ ~ 4 0.5`)
      skully.runCommand(`execute as @a[r=3,name=!"${skully.getTags()[0]}"] at @s run particle minecraft:evoker_spell ~ ~1.5 ~`)
      skully.runCommand(`execute as @a[r=3,name=!"${skully.getTags()[0]}"] at @s run particle minecraft:critical_hit_emitter ~ ~1.5 ~`)
      if (skully.runCommand(`fill ~ ~ ~ ~ ~ ~ bone_block [] replace air`).successCount > 0) skully.runCommand("setblock ~ ~ ~ air [] destroy")
      skully.addTag("return")
    }
  
    // Block hit return
    const testLoc = {
      x: skully.location.x + skully.getViewDirection().x,
      y: skully.location.y + skully.getViewDirection().y,
      z: skully.location.z + skully.getViewDirection().z
    }
    try {
        if (!passList.includes(skully.dimension.getBlock(testLoc).typeId)){
          skully.addTag("return");
      }
    }catch {}
  
    if (mc.world.scoreboard.getObjective("life").getScore(skully) > 100){
      skully.addTag("return")
    }
  
    const players = overworld.getEntities({
      type: "minecraft:player",
      name: skully.getTags()[0]
    })
  
    const player = players[0]
  
  
    try {
      if (skully.hasTag("return")){
        const speed = 1.2
  
        var dCoords = {
          x: (player.location.x-skully.location.x),
          y: (player.location.y-skully.location.y),
          z: (player.location.z-skully.location.z)
        }
  
        const velocity = {
          x: dCoords.x > 0 ? speed : dCoords.x < 0 ? -speed : 0,
          y: dCoords.y > 0 ? speed : dCoords.y < 0 ? -speed : 0,
          z: dCoords.z > 0 ? speed : dCoords.z < 0 ? -speed : 0
        }
        
        if (mc.world.scoreboard.getObjective("life").getScore(skully) > 200){
          if (Math.random() > 0.9){
            if (Math.random() > 0.5){
              velocity.x = 5
            }else {
              velocity.x = -5
            }
          }
          if (Math.random() > 0.9){
            if (Math.random() > 0.5){
              velocity.y = 5
            }else {
              velocity.y = -5
            }
          }
          if (Math.random() > 0.9){
            if (Math.random() > 0.5){
              velocity.z = 5
            }else {
              velocity.z = -5
            }
          }
        }
        
        skully.clearVelocity()
        skully.applyImpulse(velocity)
  
  
        if (skully.runCommand(`testfor @p[name="${skully.getTags()[0]}",r=3]`).successCount > 0){
          mc.world.playSound("random.fizz",skully.location,{pitch:1.5})
          skully3.cool(player)
          skully.runCommand(`tp @e[name="Skullyrang_2",tag="${skully.getTags()[0]}"] ~ -200 ~`)
          skully.runCommand(`tp @e[name="Skullyrang_3",tag="${skully.getTags()[0]}"] ~ -200 ~`)
          skully.runCommand(`tp @s ~ -200 ~`)
        }
  
      }
    }catch {}
  
}