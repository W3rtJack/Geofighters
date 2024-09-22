import * as mc from "@minecraft/server";

import { customDamage, fireworksBlaster, fireworksBlaster2, fireworksBlaster3, knockback, overworld, projectileCreate } from "../abilities";
import { damageType } from "../damageTypes";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Fireworks Shooter
        if (item.typeId == fireworksBlaster.item ){
            if (fireworksBlaster.getCooldown(player) <= 0){
              if (!player.getDynamicProperty("fireworksShot") > 0){
                player.setDynamicProperty("fireworksShot",0)
              }
              switch (fireworksBlaster.getLevel(player)){
                case 0:
                  projectileCreate(player,"minecraft:fireworks_rocket",1,0,1,"Firework","air",[player.name],false)
                  player.setDynamicProperty("fireworksShot",player.getDynamicProperty("fireworksShot")+1)
                  fireworksBlaster.cool(player)
                  break;
                case 1:
                  var degreeChange = 10;
                  projectileCreate(player,"minecraft:fireworks_rocket",3,10,1,"Firework","air",[player.name],false)
                  player.setDynamicProperty("fireworksShot",player.getDynamicProperty("fireworksShot")+3)
                  fireworksBlaster2.cool(player)
                  break;
                case 2:
                  projectileCreate(player,"minecraft:fireworks_rocket",45,8,1,"Firework","air",[player.name],false)
                  player.setDynamicProperty("fireworksShot",player.getDynamicProperty("fireworksShot")+45)
                  fireworksBlaster3.cool(player)
                  break;
              }
            }
          }
    })
})









    


export function fireworkCheck(firework){
  const fireworkLife = 20
  firework.runCommand("scoreboard players add @s life 1")

  firework.runCommand(`execute at @s if entity @e[type=player,r=2.5,name=!"${firework.getTags()[0]}"] run tag @s add explode`)

  if (firework.hasTag("explode") || mc.world.scoreboard.getObjective("life").getScore(firework) > fireworkLife){
      customDamage(5,firework,firework.getTags()[0],4,damageType.Firework)
      try { overworld.spawnParticle("hog:firework_copy",firework.location) }catch {}
      mc.world.playSound("firework.large_blast",firework.location, {volume: 10})
      mc.world.playSound("firework.twinkle",firework.location, {volume: 10})
      knockback(firework.location)
      firework.kill()
  }
}