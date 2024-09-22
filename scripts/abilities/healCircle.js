import * as mc from "@minecraft/server";
import {tick} from "main.js";

import {healCircle,overworld} from "abilities.js";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack
    const player = t.source
    t.canceled = true
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Heal Circle
        if (item.typeId == healCircle.item){
          if (mc.world.scoreboard.getObjective("healCircle.cooldown").getScore(player) < 0){
            switch (mc.world.scoreboard.getObjective("healCircle.level").getScore(player)){
              case 0:
                const healZone = player.dimension.spawnEntity("hog:armor_stand", player.location);
                healZone.runCommand(`scoreboard players add @s life 1`)
                healZone.addEffect("invisibility",21,{showParticles:false})
                mc.world.playSound("mob.zombie.remedy",player.location)
                healZone.nameTag = "healZone"
                healCircle.cool(player)
                break;
            }
          }
        }
    })
})

export function healCheck(zone){
    const r = 2
    const step = 1
    const acc = 1
    const zoneLife = 10


    const loc = zone.location;
        loc.y += 1


    if (tick % 20===0){
        zone.addEffect("invisibility",100,{showParticles:false})
        zone.addEffect("resistance",100,{amplifier:5,showParticles:false})
        zone.runCommand(`effect @a[r=${r}] regeneration 1 2 true`)
        zone.runCommand(`scoreboard players add @s life 1`)

        try {
            overworld.spawnParticle("minecraft:heart_particle",loc)
            overworld.spawnParticle("minecraft:totem_particle",loc)
        }catch {}
    }


    if (mc.world.scoreboard.getObjective("life").getScore(zone) > zoneLife){
        zone.kill()
    }

    for (var x=-r; x<r+step; x+=step){
        for (var z=-r; z<r+step; z+=step){
            if (Math.round((x*x+z*z)**0.5,acc) == Math.round(r,acc)){
                const newLoc = {x:loc.x+x,y:loc.y,z:loc.z+z}

                try {
                    overworld.spawnParticle("minecraft:villager_happy",newLoc)
                }catch {}
            } 
        }
    }
}