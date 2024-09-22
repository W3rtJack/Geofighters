import * as mc from "@minecraft/server"
import { leap, smokeLeap } from "../abilities";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Leap
        if (item.typeId == leap.item){
            if (leap.getCooldown(player) < 0){
              switch (leap.getLevel(player)){
                case 0:
                  var dir = player.getViewDirection()
                  player.applyKnockback(dir.x,dir.z,5.5,0.6);
                  leap.cool(player);
                  player.dimension.spawnParticle("minecraft:egg_destroy_emitter",player.location)
                  mc.world.playSound("armor.equip_leather",player.location)
                  break;
                case 1:
                  const leapTime = 20;
                  var dir = player.getViewDirection();
                  player.applyKnockback(dir.x,dir.z,5.5,0.6);
                  player.addEffect("invisibility",leapTime,{showParticles:false});
                  player.runCommand(`scoreboard players set @s leap.time ${leapTime+1}`);
                  smokeLeap.cool(player);
                  player.addTag("noArmor")
                  player.dimension.spawnParticle("minecraft:egg_destroy_emitter",player.location)
                  mc.world.playSound("armor.equip_leather",player.location)
                  break;
              }
            }
          }
    })
})