import * as mc from "@minecraft/server"
import { addPlayerVar, tp1, tp2, tp3 } from "../abilities";


mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Teleport
        if (item.typeId == tp1.item){
            if (tp1.getCooldown(player) < 0){
              switch (tp1.getLevel(player)){
                case 0:
                  // Particles and teleporting
                  for (var i=0;i<100;i++){
                    player.dimension.spawnParticle("minecraft:end_chest",player.location)
                  }
                  player.runCommand("tp @s @p[r=25,rm=0.01]");
      
                  // Calculating distance player travels
                  // Used for teleport distance tracking
                  const loc = player.dimension.getEntities({
                    type: "minecraft:player",
                    distance: 25,
                    closest: 1,
                    minDistance: 0.01
                  })[0].location
                  const dist = Math.pow(Math.pow(loc.x-player.location.x,2)+Math.pow(loc.y-player.location.y,2)+Math.pow(loc.z-player.location.z,2),0.5)
                  addPlayerVar(player,"Teleport.distance",dist)
      
                  // Cooldown and sound
                  tp1.cool(player);
                  mc.world.playSound("mob.shulker.teleport",player.location)
                  break;
                case 1:
                  // Particles
                  for (var i=0;i<100;i++){
                    player.dimension.spawnParticle("minecraft:end_chest",player.location)
                  }
                  
                  // Cheating the distance moved for tracking
                  addPlayerVar(player,"Teleport.distance",10)
                  
                  // Cooldown and teleporting and sound
                  tp2.cool(player);
                  player.runCommand("scoreboard players set @s teleport.blocks 10")
                  mc.world.playSound("mob.shulker.teleport",player.location)
                  break;
                case 2:
                  // Particles
                  for (var i=0;i<100;i++){
                    player.dimension.spawnParticle("minecraft:end_chest",player.location)
                  }
      
                  // Checking state
                  if (mc.world.scoreboard.getObjective("teleport.state").getScore(player) == 1){
                    // Calc distance for tracking
                    const loc = player.dimension.getEntities({
                      type: "hog:armor_stand",
                      tags: [player.name],
                      name: "waypoint"
                    })[0].location
                    const dist = Math.pow(Math.pow(loc.x-player.location.x,2)+Math.pow(loc.y-player.location.y,2)+Math.pow(loc.z-player.location.z,2),0.5)
                    addPlayerVar(player,"Teleport.distance",dist)
      
                    // Teleporting to waypoint
                    player.runCommand(`tp @s @e[name=waypoint,tag=${player.name}]`)
                    mc.world.playSound("mob.shulker.teleport",player.location)
                    player.runCommand(`execute as @e[name=waypoint,tag=${player.name}] run tp @s ~ -200 ~`)
                    player.runCommand("scoreboard players set @s teleport.state 0")
                    tp3.cool(player)
                  }
      
                  else {
                    // Creating waypoint
                    tp3.cool(player,20);
      
                    projectileCreate(player,"hog:armor_stand",1,0,0,"waypoint","minecraft:ender_pearl",[player.name],true)
      
                    // Switching state
                    player.runCommand("scoreboard players set @s teleport.state 1")
      
                    mc.world.playSound("respawn_anchor.set_spawn",player.location)
                  }
                  break;
                case 3:
                  for (var i=0;i<100;i++){
                    player.dimension.spawnParticle("minecraft:end_chest",player.location)
                  }
                  tp2.cool(player);
                  player.runCommand("scoreboard players set @s teleport.blocks 10")
                  mc.world.playSound("mob.shulker.teleport",player.location)
              }
            }
          }
    })
})