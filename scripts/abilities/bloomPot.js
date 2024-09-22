import * as mc from "@minecraft/server";
import {} from "main.js";

import {bloomPot,overworld} from "abilities.js";
import { addPlayerVar, customDamage, passList, projectileCreate } from "../abilities";
import { damageType } from "../damageTypes";

// Poison pot, better than fire on the screen >:(

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Bloom pot
        if (item.typeId == bloomPot.item){
            if (mc.world.scoreboard.getObjective("bloomPot.cooldown").getScore(player) < 0){
              switch (mc.world.scoreboard.getObjective("bloomPot.level").getScore(player)){
                case 0:
                  bloomPot.cool(player)
                  projectileCreate(player,"hog:armor_stand",1,0,2,"bloomTop","minecraft:dandelion",[player.name],true)
                  mc.world.playSound("place.azalea",player.location)
                  break;
              }
            }
        }
    })
})


export function flowerThrow(pot){
    pot.runCommand("scoreboard players add @s life 1")
  
    const velocity = pot.getVelocity()
    pot.clearVelocity()
    pot.applyImpulse(velocity)
  
    try {
      var loc = pot.location;
      loc = {x:loc.x-velocity.x,y:loc.y-velocity.y,z:loc.z-velocity.z};
      overworld.spawnParticle("hog:flower_trail",loc)
    }catch {}
  
    try {
      const checkLoc = {
        x: pot.location.x + pot.getViewDirection().x,
        y: pot.location.y + pot.getViewDirection().y,
        z: pot.location.z + pot.getViewDirection().z
      }
      if (!passList.includes(pot.dimension.getBlock(checkLoc).typeId)){
        pot.addTag("explode")
      }
    }catch {}
    
    pot.runCommand(`execute align xyz if entity @a[name=!"${pot.getTags()[0]}",r=2] run tag @s add explode`)
  
    if (pot.runCommand(`fill ~ ~ ~ ~ ~ ~ leaves [] replace air`).successCount > 0) pot.runCommand("setblock ~ ~ ~ air [] destroy")
  
    if (mc.world.scoreboard.getObjective("life").getScore(pot) > 60) pot.runCommand("tag @s add explode")
  
    if (pot.hasTag("explode")){
      pot.runCommand(`damage @a[r=2,name=!"${pot.getTags()[0]}"] 3 entity_attack entity "${pot.getTags()[0]}"`)
      customDamage(3,pot,pot.getTags()[0],2,damageType.BloomPot)
      pot.runCommand(`effect @a[r=3,name=!"${pot.getTags()[0]}"] poison 4 1 true`)
  
      try {
        overworld.spawnParticle("hog:flower_explode",pot.location)
        mc.world.playSound("random.splash",pot.location,{pitch:5})
      }catch {}
  
      pot.runCommand("tp @s ~ -200 ~")
      pot.kill()
    }
}