import * as mc from "@minecraft/server"
import { customDamage, jeb, jebRider, overworld, passList, projectileCreate, tripleJeb } from "../abilities";
import { damageType } from "../damageTypes";

mc.world.beforeEvents.itemUse.subscribe(t =>{
    const item = t.itemStack;
    const player = t.source;
    t.canceled = true;
    if (!player.getDynamicProperty("ability.able")) return
    mc.system.run(()=>{
        // Jeb abilitises
        if (item.typeId == jeb.item){
            if (jeb.getCooldown(player) < 0){
              switch (jeb.getLevel(player)){
                case 0:
                  projectileCreate(player,"minecraft:sheep",1,0,1,"jeb_","air",[player.name],false)
                  mc.world.playSound("random.fizz",player.location)
                  jeb.cool(player)
                  break;
                  
                case 1:
                  projectileCreate(player,"minecraft:sheep",3,15,1,"jeb_","air",[player.name],false)
                  mc.world.playSound("random.fizz",player.location)
                  tripleJeb.cool(player)
                  break;
                case 2:
                  player.runCommand("ride @s summon_ride minecart")
                  player.runCommand(`tag @e[type=minecart,c=1] add "${player.name}"`)
                  player.setDynamicProperty("cameraState","jebRider")
                  const jeb_ = overworld.spawnEntity("minecraft:sheep", player.location);
                  jeb_.nameTag = "jeb_"
                  jeb_.addTag(player.name)
                  jeb_.addTag("minecart")
                  player.addTag("jebbing")
                  player.addTag("noArmor")
                  mc.world.playSound("random.fizz",player.location)
                  jebRider.cool(player)
                  break;
              }
            }
          }
    })
})


const jebLife = 8*20


export function minecartCheck(cart){
    cart.runCommand("playanimation @s animation.minecart.scale a 10")
    const minecartSpeed = 0.5;
    cart.runCommand(`scoreboard players add @s life 1`)
    const riders = cart.getComponent("minecraft:rideable").getRiders()
    var yMult = 0.1

    if (mc.world.scoreboard.getObjective("life").getScore(cart) > 5){
      if (riders[0]){
          if (cart.runCommand(`testfor @e[type=sheep,tag="${cart.getTags()[0]}",tag=minecart]`).successCount < 1){
            cart.dimension.getEntities({type:"minecraft:player",closest:1,tags:["jebbing"]})[0].setDynamicProperty("cameraState","default")
            cart.dimension.getEntities({type:"minecraft:player",closest:1,tags:["jebbing"]})[0].runCommand("camera @s set minecraft:first_person")
            cart.runCommand(`tag @p[tag=jebbing] remove noArmor`)
            cart.runCommand(`tag @p[tag=jebbing] remove jebbing`)
            cart.kill()
          }else {
            cart.runCommand(`tp @e[type=sheep,tag=minecart,tag="${cart.getTags()[0]}"] @s`)
            cart.setRotation(riders[0].getRotation())
            riders[0].addEffect("invisibility",5,{showParticles:false})

            if (cart.location.y<-10){
              cart.runCommand(`tp @s ^ ^0.1 ^${minecartSpeed} true`)
              cart.runCommand(`tp @s ^ ^0.1 ^${minecartSpeed} true`)
            }

            if (mc.world.scoreboard.getObjective("life").getScore(cart) > jebLife){
              cart.runCommand(`tag @e[type=sheep,c=1,tag=minecart,tag="${cart.getTags()[0]}"] add explode`)
              cart.dimension.getEntities({type:"minecraft:player",closest:1,tags:["jebbing"]})[0].setDynamicProperty("cameraState","default")
              cart.dimension.getEntities({type:"minecraft:player",closest:1,tags:["jebbing"]})[0].runCommand("camera @s set minecraft:first_person")
              cart.runCommand(`tag @p[tag=jebbing] remove noArmor`)
              cart.runCommand(`tag @p[tag=jebbing] remove jebbing`)
              cart.kill()
            }
          }
      }else {
          cart.runCommand(`tag @e[type=sheep,c=1] add explode`)
          cart.dimension.getEntities({type:"minecraft:player",closest:1,tags:["jebbing"]})[0].setDynamicProperty("cameraState","default")
          cart.dimension.getEntities({type:"minecraft:player",closest:1,tags:["jebbing"]})[0].runCommand("camera @s set minecraft:first_person")
          cart.runCommand(`tag @p[tag=jebbing] remove noArmor`)
          cart.runCommand(`tag @p[tag=jebbing] remove jebbing`)
          cart.kill()
      }
    }
}

export function jebCheck(jeb){
    jeb.clearVelocity()
    jeb.applyImpulse(jeb.getVelocity())
  
    if (jeb.hasTag("minecart")){
      jeb.runCommand(`execute as @s at @s if entity @a[r=5,name=!"${jeb.getTags()[0]}"] run tag @s add explode`)    
    }else {
      jeb.runCommand(`execute as @s at @s if entity @a[r=3,name=!"${jeb.getTags()[0]}"] run tag @s add explode`)
    }
  
    const dist = 1
      // Breaking
      const testLoc = {
          x: jeb.location.x + jeb.getViewDirection().x * dist,
          y: jeb.location.y + jeb.getViewDirection().y * dist,
          z: jeb.location.z + jeb.getViewDirection().z * dist
      }

      if (!passList.includes(jeb.dimension.getBlock(testLoc).typeId)){
          jeb.addTag("explode")
      }

    jeb.runCommand("scoreboard players add @s life 1")
  
    
  
    jeb.dimension.spawnParticle("hog:rainbow_emitter",{x:jeb.location.x-jeb.getViewDirection().x*2,y:jeb.location.y-jeb.getViewDirection().y*2,z:jeb.location.z-jeb.getViewDirection().z*2})
    if (mc.world.scoreboard.getObjective("life").getScore(jeb) > jebLife){
        
        
        jeb.addTag("explode")
    }
  
    
  
    if (jeb.hasTag("explode")){
        const jebLoc = jeb.location;
  
        customDamage(7,jeb,jeb.getTags()[0],6,damageType.Jeb)
        jeb.runCommand("tp @s ~ -200 ~")
        jeb.kill()
        mc.world.playSound("random.totem",jebLoc, {volume: 7,pitch:2})
        jeb.dimension.spawnParticle("minecraft:huge_explosion_emitter",jebLoc)
  
        // Player launch 
        const players2 = overworld.getEntities({
        type: "minecraft:player",
        location: jebLoc,
        maxDistance: 5
        })
  
        for (const player2 of players2){
        player2.applyKnockback(player2.location.x-jebLoc.x,player2.location.z-jebLoc.z,3,(player2.location.y-jebLoc.y+1))
        }
        jeb.dimension.runCommand(`camerashake add @a[r=5,x=${jebLoc.x},y=${jebLoc.y},z=${jebLoc.z}] 0.1 0.5 rotational`)
        
    }
  }