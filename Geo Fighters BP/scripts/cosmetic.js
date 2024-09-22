import * as mc from "@minecraft/server";
import {} from "./cosmetic/hitAnim";
import { deathMessages } from "./cosmetic/deathMessage";
import { deathAnimations } from "./cosmetic/deathAnim";
import { addPlayerVar } from "./abilities";



const deathMsgArray = deathMessages;


mc.world.afterEvents.entityDie.subscribe(f=> {
  const player = f.deadEntity;
  const source = f.damageSource.damagingEntity;
  if (player.typeId == "minecraft:player" && source.typeId == "minecraft:player"){
    // Resetting
    player.runCommand("inputpermission set @s movement enabled")

    // Death message interpreter
    message = "%d was killed by %k"
    try {
      var message = deathMsgArray[source.getDynamicProperty("equipped.deathMessage") >= 0 ? source.getDynamicProperty("equipped.deathMessage") : 0]
    }catch {}
    var newMsg = ""
    message = message.split(" ");
    for (var char=0;char<message.length;char++){
      if (message[char].includes("%d")){
        newMsg = newMsg+" "+player.nameTag+message[char].split("%d")[1]
      }
      else if (message[char].includes("%k")){
        newMsg = newMsg+" "+source.nameTag+message[char].split("%k")[1]
      }else {
        newMsg = newMsg+" "+message[char]
      }
    }
    // Displaying death message
    player.runCommand(`tellraw @a {"rawtext": [{ "text": "${newMsg}" }]}`)

    player.runCommand(`tellraw @s {"rawtext":[{ "text": "§cYour killer had ${Math.round(source.getComponent("minecraft:health").currentValue,0)} health" }]}`)

    // Death animation
    if (source.getDynamicProperty("equipped.deathAnimation") != undefined){
      const anim = source.getDynamicProperty("equipped.deathAnimation")
      if (anim != "default"){
        deathAnimations.forEach(a=> {
          if (a.id == anim){
            a.animation(player);
          }
        })
      }
    }
  }

  if (player.typeId == "minecraft:player"){
    player.setDynamicProperty("lastDeathCause",player.getDynamicProperty("lastHitCause"))
    player.setDynamicProperty("lastDeathAttacker",player.getDynamicProperty("lastAttacker"))
    player.setDynamicProperty("deathCheck",false)
    player.setDynamicProperty("lastHitCause","");
    player.setDynamicProperty("lastAttacker","");
    
    player.runCommand(`kill @e[tag="${player.name}"]`)
    mc.world.scoreboard.getObjective("teleport.state").setScore(player,0)
    mc.world.scoreboard.getObjective("skully.cooldown").setScore(player,0)

    if (mc.world.getDynamicProperty("ffa.mode") != "ctp"){ addPlayerVar(source,"round.money",50) }
    else { addPlayerVar(source,"round.money",25) }
    
    addPlayerVar(source,"round.kills",1)
    source.setDynamicProperty("timeSinceLastKill",0)

    player.setDynamicProperty("dead.time",0);
    player.addTag("dead")

    
  }

})