import * as mc from "@minecraft/server";
import {tick} from "main.js";

import {thrower3,overworld,customDamage,knockback} from "abilities.js";
import { damageType } from "../damageTypes";
import { addPlayerVar, projectileCreate, thrower, thrower2 } from "../abilities";

mc.world.beforeEvents.itemUse.subscribe(a =>{
    const item = a.itemStack
    const player = a.source
    a.cancel = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // C4
        if (item.typeId == thrower3.item){
          if (mc.world.scoreboard.getObjective("thrower.cooldown").getScore(player) < 0){
            switch (mc.world.scoreboard.getObjective("thrower.level").getScore(player)){
                case 0:
                    thrower.cool(player)
                    player.runCommand("tag @e[type=egg,c=1] add shockwave")
                    mc.world.playSound("mob.witch.throw",player.location)
                    const egg = projectileCreate(player,"minecraft:egg",1,0,2,"egg","egg",[player.name])
                    egg.getComponent("projectile").owner = player;

                    break;
                case 1:
                    player.runCommand("kill @e[type=egg,c=1]")
                    projectileCreate(player,"minecraft:tnt",1,0,1,"tnt","tnt",[player.name])
                    mc.world.playSound("mob.witch.throw",player.location)
                    thrower2.cool(player)
                    break;
                case 2:
                    player.runCommand(`kill @e[type=egg,c=1]`)

                    if (player.isSneaking){
                        // Detonation
                        const C4s = player.dimension.getEntities({
                            type: "minecraft:tnt",
                            tags: [player.name]
                        })

                        var i=4;
                        for (const boom of C4s){
                            boom.addTag("boom")
                            boom.setDynamicProperty("boom.time",i)
                            boom.setDynamicProperty("boom.ctime",0)
                            addPlayerVar(player,"C4.exploded",1)
                            i += 4
                        }
                        player.setDynamicProperty("C4.down",0)
                    }else {
                        // Once again gonna regret name
                        // Placing
                        if (player.getDynamicProperty("C4.down") < 10){
                            const explodie = player.dimension.spawnEntity("minecraft:tnt", player.location);
                            explodie.addTag(player.name)
                            mc.world.playSound("random.fizz",player.location,{volume:0.3,pitch:0.5})

                            addPlayerVar(player,"C4.placed",1)
                            addPlayerVar(player,"C4.down",1)
                            thrower3.cool(player)
                        }else {
                            player.runCommand(`tellraw @s {"rawtext": [{ "text": "§cYou have placed the max amount of C4" }]}`)
                        }
                    }
                    break;
            }
          }else {
            a.cancel = true;
          }
        }
    })
})

export function tntCheck(tnt){
    tnt.runCommand("scoreboard players add @s life 1")
  
    if (tnt.runCommand("execute align xyz unless block ~ ~-0.1 ~ air run testfor @s").successCount > 0 || mc.world.scoreboard.getObjective("life").getScore(tnt) > 200){
      customDamage(7,tnt,tnt.getTags()[0],5,damageType.TNT)
      mc.world.playSound("random.explode",tnt.location, {volume: 5})
      overworld.spawnParticle("minecraft:huge_explosion_lab_misc_emitter",tnt.location)
      knockback(tnt.location,0.5,0.5,5)
      tnt.kill()
    }
}