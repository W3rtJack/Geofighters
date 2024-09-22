import * as mc from "@minecraft/server"
import { overworld, flash } from "../abilities";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Flash
        if (item.typeId == flash.item){
            if (flash.getCooldown(player) < 0){
              switch (flash.getLevel(player)){
                case 0:
                  player.addEffect("speed",40,{amplifier:25})
                  overworld.spawnParticle("minecraft:sonic_explosion",{x:player.location.x,y:player.location.y+1,z:player.location.z})
                  player.dimension.spawnParticle("minecraft:knockback_roar_particle",{x:player.location.x,y:player.location.y+1,z:player.location.z})
                  mc.world.playSound("random.drink",player.location)
                  flash.cool(player)
                  break;
              }
            }
          }
    })
})