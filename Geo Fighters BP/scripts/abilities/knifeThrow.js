import * as mc from "@minecraft/server";
import { tick } from "main.js";

import { kt1,kt2,kt3 } from "abilities.js";
import { customDamage, passList, projectileCreate } from "../abilities";
import { damageType } from "../damageTypes";

// Knife throw is surprisingly not (too) OP
const knifeLife = 2*20

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Knife Throw
        if (item.typeId == kt1.item){
          if (mc.world.scoreboard.getObjective("knifeThrow.cooldown").getScore(player) < 0){
            switch (mc.world.scoreboard.getObjective("knifeThrow.level").getScore(player)){
              case 0:
                projectileCreate(player,"hog:armor_stand",1,0,1,"knife","iron_sword",[player.name],true)
                kt1.cool(player);
                mc.world.playSound("armor.equip_iron",player.location)
                break;
              
              case 1:
                projectileCreate(player,"hog:armor_stand",3,15,1,"knife","iron_sword",[player.name])
                kt2.cool(player);
                mc.world.playSound("armor.equip_iron",player.location)
                break;
    
              case 2:
                projectileCreate(player,"hog:armor_stand",1,0,0,"knife","diamond_sword",[player.name,"homing"])
                kt3.cool(player);
                mc.world.playSound("armor.equip_iron",player.location)
                break;
            }
          }
        }
    })
})

export function knifeCheck(knife){
    const speed = 7
    if (knife.hasTag("homing")){
      knife.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 diamond_sword 1 1`);
      for (var d=0;d<=speed;d++){
        knife.runCommand(`tp @s ^ ^ ^0.08 facing @p[name=!"${knife.getTags()[0]}"]`)
      }
  
      knife.runCommand("playanimation @s animation.block.scale a 1000")
  
      if (tick % 4 === 0)
      if (knife.runCommand(`testfor @p[r=2,name=!"${knife.getTags()[0]}"]`).successCount < 1){
        if (knife.runCommand("fill ~ ~ ~ ~ ~ ~ diamond_block [] replace air").successCount > 0){
          knife.runCommand("setblock ~ ~ ~ air [] destroy")
        }
      }
  
    }else {
      knife.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 iron_sword 1 1`);
      const velocity = knife.getVelocity()
      knife.clearVelocity()
      knife.applyImpulse(velocity)
    }
    
    try {
      const testLoc = {
        x: knife.location.x + knife.getViewDirection().x,
        y: knife.location.y + knife.getViewDirection().y,
        z: knife.location.z + knife.getViewDirection().z
      }
      if (!passList.includes(knife.dimension.getBlock(testLoc).typeId)){
        mc.world.playSound("ui.stonecutter.take_result",knife.location);
        const loc = knife.location;
        loc.y += 1.5;
        knife.dimension.spawnParticle("minecraft:critical_hit_emitter",loc)
        knife.runCommand("tp @s ~ -200 ~")
      }
    }catch {}
  
    const hit = customDamage(3,knife,knife.getTags()[0],2,damageType.KnifeThrow)
    if (hit) knife.runCommand(`execute as @a[r=2,name=!"${knife.getTags()[0]}"] at @s run particle hog:blood_emitter ~ ~2 ~`)
  
    knife.runCommand("scoreboard players add @s life 1")
    if (mc.world.scoreboard.getObjective("life").getScore(knife) > knifeLife){
        knife.runCommand("tp @s ~ -200 ~")
    }
  }