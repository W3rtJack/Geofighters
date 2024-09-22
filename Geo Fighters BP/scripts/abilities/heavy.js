import * as mc from "@minecraft/server"
import { customDamage, custKnockback, overworld, spawnGuy, heavyPunch, heavyLift, heavyGuard, launchBlocks } from "../abilities";
import { damageType } from "../damageTypes";
import { tick } from "../main";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Heavy Abilities
        if (item.typeId == heavyPunch.item){
            if (heavyPunch.getCooldown(player) < 0){
              switch (heavyPunch.getLevel(player)){
                case 0:
                  spawnGuy(player,"Heavy Puncher")
                  heavyPunch.cool(player)
                  break;
                case 1:
                  spawnGuy(player,"Heavy Lifter")
                  heavyLift.cool(player)
                  break;
                case 2:
                  spawnGuy(player,"Heavy Guard")
                  heavyGuard.cool(player)
                  break;
              }
            }
          }
    })
})


export function heavyPunching(guy){
    const guyLife = 35
    guy.runCommand("scoreboard players add @s life 1")
  
    if (mc.world.scoreboard.getObjective("life").getScore(guy) > 5 && mc.world.scoreboard.getObjective("life").getScore(guy) < guyLife){
      guy.runCommand(`tp @s ^ ^0.4 ^0.4 true`)
      if (tick%5===0)
        guy.runCommand(`execute as @s at @s positioned ^ ^ ^1 run tp @p[name=!"${guy.getTags()[0]}",r=5,c=1] ^ ^0.7 ^1 true`)
  
      mc.world.playSound("mob.witch.throw",guy.location,{volume:2})
  
      try {
        overworld.spawnParticle("minecraft:critical_hit_emitter",guy.location)
      }catch {}
  
      if (tick%10===0) customDamage(2,guy,guy.getTags()[0],5,damageType.HeavyPunch)
      
      guy.runCommand(`execute as @s at @s positioned ^ ^ ^1 unless entity @p[name=!"${guy.getTags()[0]}",r=4,c=1] run particle minecraft:egg_destroy_emitter`)
      guy.runCommand(`execute as @s at @s positioned ^ ^ ^1 unless entity @p[name=!"${guy.getTags()[0]}",r=4,c=1] run tp @s ~ -200 ~`)
    }
    else if (mc.world.scoreboard.getObjective("life").getScore(guy) > guyLife){
      for (var i=0;i<10;i++){
        const loc = guy.location
        loc.x += Math.random(0,1)-0.5
        loc.y += Math.random(0,1)-0.5
        loc.z += Math.random(0,1)-0.5
        try {
          overworld.spawnParticle("minecraft:villager_angry",loc);
        }catch {}
      }
  
      try {
        overworld.spawnParticle("minecraft:egg_destroy_emitter",guy.location);
      }catch {}
      guy.runCommand("tp @s ~ -200 ~")
    }
}
  
  
export function heavyLifting(guy){
    guy.runCommand("scoreboard players add @s life 1")

    if (mc.world.scoreboard.getObjective("life").getScore(guy) < 2){
        guy.runCommand(`execute as @s at @s positioned ^ ^ ^1 run tag @a[name=!"${guy.getTags()[0]}",c=1,r=5] add "lift${guy.getTags()[0]}"`)

        mc.world.playSound("mob.witch.throw",guy.location,{volume:2})
        overworld.spawnParticle("minecraft:critical_hit_emitter",guy.location)

    }else if (mc.world.scoreboard.getObjective("life").getScore(guy) == 2){
        guy.runCommand(`execute as @s unless entity @a[tag="lift${guy.getTags()[0]}"] run tp @s ~ -200 ~`)
    }
    else if (mc.world.scoreboard.getObjective("life").getScore(guy) <= 19 && mc.world.scoreboard.getObjective("life").getScore(guy) > 2){
        const players = overworld.getEntities({
        type: "minecraft:player",
        tags: [`lift${guy.getTags()[0]}`]
        })
        for (const player of players){
        player.applyKnockback(0,0,0,1)
        }
    }
    else if (mc.world.scoreboard.getObjective("life").getScore(guy) <= 22 && mc.world.scoreboard.getObjective("life").getScore(guy) > 19){
        guy.runCommand(`execute as @p[tag="lift${guy.getTags()[0]}"] at @s run playsound mob.shulker.teleport @s ~ ~ ~`)
        guy.runCommand(`execute as @p[tag="lift${guy.getTags()[0]}"] at @s run particle minecraft:egg_destroy_emitter ^ ^ ^3`)
    }else if (mc.world.scoreboard.getObjective("life").getScore(guy) <= 48 && mc.world.scoreboard.getObjective("life").getScore(guy) > 22){
        guy.runCommand(`execute as @p[tag="lift${guy.getTags()[0]}"] at @s run tp @s ~ ~ ~`)
        guy.runCommand(`execute as @p[tag="lift${guy.getTags()[0]}"] at @s run tp @e[name="Heavy Lifter",tag="${guy.getTags()[0]}"] ^ ^ ^3 facing @s`)
        guy.runCommand(`execute as @p[tag="lift${guy.getTags()[0]}"] at @s run particle minecraft:critical_hit_emitter ~ ~1 ~`)

    }
    else if (mc.world.scoreboard.getObjective("life").getScore(guy) == 49){
        mc.world.playSound("tile.piston.out",guy.location)
    }
    else if (mc.world.scoreboard.getObjective("life").getScore(guy) <= 58 && mc.world.scoreboard.getObjective("life").getScore(guy) > 49){
        const players = overworld.getEntities({
        type: "minecraft:player",
        tags: [`lift${guy.getTags()[0]}`]
        })
        for (const player of players){
        player.applyKnockback(0,0,0,-1)
        }
    }else {
        const players = overworld.getEntities({
        type: "minecraft:player",
        tags: [`lift${guy.getTags()[0]}`]
        })
        for (const player of players){
        customDamage(7,player,guy.getTags()[0],1,damageType.HeavyLift)
        launchBlocks(player.location,3)
        mc.world.playSound("random.explode",player.location)
        player.removeTag(`lift${guy.getTags()[0]}`)
        }
        try {
        guy.dimension.spawnParticle("minecraft:knockback_roar_particle",guy.location)
        }catch {}
        guy.kill()
    }
}


export function heavyGuarding(guy){
    const heavyGuardLife = 20*10
    guy.runCommand("scoreboard players add @s life 1")

    guy.runCommand(`execute at @p[name="${guy.getTags()[0]}"] facing entity @p[name=!"${guy.getTags()[0]}"] feet run tp @s ^ ^ ^3.5 facing @p[name=!"${guy.getTags()[0]}"] true`)

    customDamage(1,guy,guy.getTags()[0],1.5,damageType.HeavyGuard)

    const players = overworld.getEntities({
        type: "minecraft:player",
        name: `${guy.getTags()[0]}`
    })
    for (const player of players){
        custKnockback(player.location,4,0.25,3.5)
    }

    if (mc.world.scoreboard.getObjective("life").getScore(guy) > heavyGuardLife){
        guy.runCommand("tp @s ~ -200 ~")
    }
}