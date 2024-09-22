import * as mc from "@minecraft/server"
import {equipAblInv,convToTime,convToName,ablList} from "abilities.js";
import {launchBlocks,convToUpgrade,standCheck} from "abilities.js"
import {} from "cosmetic.js"
import { turretCheck } from "./abilities/turret.js";
import { hlvShooting } from "abilities/hastaLaVista.js";

import { Queue } from "./dataTypes.js";
import { achTest } from "./achievements/achievements.js";
import { killControllerUpdate } from "./controllers/killController.js";
import { damageType } from "./damageTypes.js";
import { hitControllerUpdate } from "./controllers/hitController.js";
import { addPlayerVar, customDamage, getItemCount, hlv, knockback } from "./abilities.js";

import {} from "./controllers/commandsController.js";
import { animUpdate } from "./cosmetic/deathAnim.js";
import { passiveAnimUpdate } from "./cosmetic/passiveAnim.js";
import { chatRank } from "./cosmetic/chatRank.js";
import { slowSpawning } from "./queues/map_spawning.js";
import { gameUpdate, win } from "./queues/gameLoad.js";
import { cameraControllerUpdate } from "./controllers/cameraController.js";

import {} from "player.js"
import { pigUpdate } from "./queues/pigAi.js";
import { insideBlacklist, interactBlacklist, saveVersion } from "./config.js";
import { fireworkCheck } from "./abilities/firework.js";
import { jebCheck, minecartCheck } from "./abilities/jeb_launcher.js";
import { tntCheck } from "./abilities/thrower.js";

import { mainMenu } from "./menus/main_menu.js";
import { getAbilityData } from "./saving/dataCollection.js";
import { slowStructureLoading, slowStructuresSaving } from "./saving/mapSaving.js";

const overworld = mc.world.getDimension("overworld");


export var tick = 0;


// Cooldown list needed to update scoreboard times
const cooldownList = [
  "combo.timer",
  "player.sprintCooldown",
  "leap.time"
]

ablList.forEach(ability => {
  cooldownList[cooldownList.length+1] = ability.id+".cooldown"
});


// Not breaking these blocks
let blockBlacklist = [
  "minecraft:air",
  "minecraft:barrier"
]



// The queue of replacing blocks from teleporting
let blockQueue = new Queue(100);



// Setting up the actionbar
function tellraw(player){
  if (!player.getDynamicProperty("spectate")){
    if (mc.world.scoreboard.getObjective(`settings.actionbar`).getScore(player) == 1){
      var djCool = Math.ceil(mc.world.scoreboard.getObjective("dj.cooldown").getScore(player)/20);
      var combo = mc.world.scoreboard.getObjective("combo.count").getScore(player)
      var item = equipAblInv(player,player.selectedSlotIndex+1)
      var cool2 = Math.ceil(convToTime(player,item))
      var cool2Name = convToUpgrade(player,convToName(player,item))



      if (player.selectedSlotIndex+1 <= 5){
        if (mc.world.scoreboard.getObjective(`equip.slot${player.selectedSlotIndex+1}`).getScore(player) == 16){
          cool2Name = `§3${ablList[15].name+" "+mc.world.scoreboard.getObjective("hlv.stored").getScore(player)}`
        }
      }else if (player.selectedSlotIndex == 5){
          cool2Name = "§6Sword"
      }else if (player.selectedSlotIndex == 8){
        cool2Name = "§9Menu"
    }

      
      if (djCool < 0){
        djCool = "§aReady§r"
      }else {
        djCool = "§c"+djCool
      }


      if (cool2 < 0){
        cool2 = "§aReady§r"
      }else {
        cool2 = "§c"+cool2
      }


      if (cool2Name == "§6C4"){
        cool2Name = cool2Name+` : Placed: ${player.getDynamicProperty("C4.down")}/10`
        cool2 = "\n§bInteract to place C4 : §bInteract + Crouch to activate it"
      }

      var comboColor = "2"
      if (combo <= 9){ var comboColor = "2" }
      else if (combo <= 19){ var comboColor = "6" }
      else { var comboColor = "5" }

      let respawnText = ""
      if (player.getDynamicProperty("dead.time") < 100 && player.getDynamicProperty("dead.time") > 0){
        const respawnTime = 5-(Math.floor(player.getDynamicProperty("dead.time")/20));
        respawnText = `\nRespawning in ${respawnTime}`;
      }

      let piggyText = ""
      const pig = overworld.getEntities({type:"minecraft:pig"})[0]
      if (pig){
        const distance = ((player.location.x-pig.location.x)**2 + (player.location.y-pig.location.y)**2 + (player.location.z-pig.location.z)**2)**0.5
        piggyText = `\n§aDistance from pig: ${Math.round(distance,0)}`;
      }

      if (!player.getDynamicProperty("ffa.inGame")) piggyText = ""


      
      if (mc.world.scoreboard.getObjective(`settings.comboDisplay`).getScore(player) == 0){
        player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§7Double Jump : ${djCool}\n§7Ability : ${cool2Name} : ${cool2}\n§7Combo : §r§${comboColor}${combo}${piggyText}${respawnText}" }]}`)
      }else {
        player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§7Double Jump : ${djCool}\n§7Ability : ${cool2Name} : ${cool2}${piggyText}${respawnText}"}]}`)
      }
    }


    // This whole actionbar code is so awful
    // But its nearing the release and i cannot be bothered to improve it
    // And i keep adding to it
    // I'll do something eventually
    // Lol
  }else {
    const p = player.getDynamicProperty("spectatePlayerName") ? player.getDynamicProperty("spectatePlayerName") : "None"
    const pHealth = player.getDynamicProperty("spectatePlayerHealth") ? player.getDynamicProperty("spectatePlayerHealth").toFixed(0) : 20
    const pLives = player.getDynamicProperty("spectatePlayerLives") ? player.getDynamicProperty("spectatePlayerLives") : 1
    const slot = player.selectedSlotIndex

    let endMessage = `\n§r${pHealth} health : ${pLives} lives`
    if (pLives > 5) endMessage = `\n§r${pHealth} health`
    if (pLives == 1) endMessage = `\n§r${pHealth} health : §cFinal life`
    
    if (slot == 3){
      player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§4Previous player\n§aSpectating : §r${p}${endMessage}"}]}`)
    }else if (slot == 4){
      player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§cLeave Spectating\n§aSpectating : §r${p}${endMessage}"}]}`)
    }else if (slot == 5){
      player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§4Next player\n§aSpectating : §r${p}${endMessage}"}]}`)
    }else if (slot == 8){
      player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§9Menu\n§aSpectating : §r${p}${endMessage}"}]}`)
    }else {
      player.runCommand(`titleraw @s actionbar { "rawtext": [{ "text": "§aSpectating : §r${p}${endMessage}"}]}`)
    }
  }
}


// Main
const onTick = () => {
  tick++
  
  // Game update
  gameUpdate()
  
  for (var player of mc.world.getPlayers()){

    if (!player.hasTag("joined") && !player.hasTag("tool")){
      player.addTag("joined")
      player.sendMessage(`§bWelcome §r§d${player.nameTag} §r§bto §lGEO FIGHTERS`)
      player.runCommand("playsound random.levelup @s")
      mc.world.scoreboard.getObjective(`settings.actionbar`).setScore(player,1)
      try { overworld.spawnParticle("hog:firework_copy",player.location) }catch {}
    }
    
    player.addEffect("saturation", 20, {showParticles: false})
    cooldownList.forEach(cooldown=> {
      if (player.hasTag("cooldownPause")){
        if (mc.world.scoreboard.getObjective(cooldown).getScore(player) < 2){
          player.runCommand(`scoreboard players set @s ${cooldown} 2`)
        }
      }else if (player.hasTag("lobby")){
        player.runCommand(`scoreboard players set @s ${cooldown} 0`)
      }else {
        player.runCommand(`scoreboard players remove @s ${cooldown} 1`)
      }
    })
    player.removeTag("cooldownPause")

    // Height limit
    if (player.location.y > 20 && player.dimension == overworld){
      player.applyKnockback(0,0,0,-100)
    }


    addPlayerVar(player,"totalGameTime",1)

    // Ability slots
    if (player.getDynamicProperty("jump.valid")){
      player.runCommand("scoreboard players remove @s dj.cooldown 1")
    }else {
      if (player.isOnGround){
        player.setDynamicProperty("jump.valid",true)
      }
    }
    
    tellraw(player)

    forceSlot(player)

    // Updates the animation controller
    animUpdate();
    passiveAnimUpdate(player);


    // Controller Updates
    killControllerUpdate(player);
    hitControllerUpdate(player);
    cameraControllerUpdate(player);
    achTest(player);

    // Autosave
    if (tick % 2000 === 0){
      //player.sendMessage("§7Autosaving data")
      player.runCommand(`scriptevent hog:save_data`)
    }


    // A function i use to test individual functions (good at not spamming chat with ppl in game)
    if (player.name == "HogWar554"){
      /*
      if (player.hasTag("save")) slowStructuresSaving player);

      if (player.hasTag("load")) slowStructureLoading(player);

      if (tick === 2){
        player.setDynamicProperty("strucLoad.x",0)
        player.setDynamicProperty("strucLoad.z",0)
        player.setDynamicProperty("struc.x",0)
        player.setDynamicProperty("struc.z",0)
        player.addTag("save");
        //win(player);
      }

    */
    }

    // Controller for when player in game
    // Crouch protection / double jump
    if (mc.world.getDynamicProperty("game.playing") && player.getDynamicProperty("ffa.inGame")){
      doubleJump(player,2)
    }

    if (player.isSneaking){
      if (mc.world.getDynamicProperty("game.playing") && player.getDynamicProperty("ffa.inGame")){
        addPlayerVar(player,"crouchTick",3)
        if (player.getDynamicProperty("crouchTick") > 20*3){
          player.runCommand("title @s actionbar §4Stop Crouching!");
          player.setProperty('hog:glowing',true);
          player.setDynamicProperty("crouchTick",20*3)
        }
      }
    }else {
      addPlayerVar(player,"crouchTick",-1)
      if (player.getDynamicProperty("crouchTick") < 1){
        player.setDynamicProperty("crouchTick",0)
        player.setProperty('hog:glowing',false);
      }
    }
    
    if (player.getDynamicProperty("settings.constantSpeed") && !(player.getDynamicProperty("equipped.challenge") == 5)) player.addEffect("speed",30,{showParticles:false,amplifier:4})

    // Sprinting effect
    if (player.isSprinting){
      if (!(player.getDynamicProperty("equipped.challenge") == 5)) player.addEffect("speed",30,{showParticles:false,amplifier:4})
      if (mc.world.scoreboard.getObjective("player.sprint").getScore(player) != 1 && mc.world.scoreboard.getObjective("player.sprintCooldown").getScore(player) <= 0){
        const newLoc = player.location;
        newLoc.y++;
        try { overworld.spawnParticle("minecraft:camera_shoot_explosion",newLoc) }catch {}
      }
    }

      

    // Passlist, allowing players to go through blocks with partial hitbox but teleporting them out when they're stuck in a solid block too long
    try {
        let pass = false;
        insideBlacklist.forEach(name => {
          if (overworld.getBlock(player.location).typeId.includes(name)) pass = true;
        });
        
        if (player.runCommand("execute as @s at @s if block ~ ~ ~ farmland run testfor @s").successCount > 0) pass = false

        if (!pass){
          addPlayerVar(player,"player.stuck",1)
          if (player.getDynamicProperty("player.stuck") > 40){
            player.runCommand("tp @s ~ ~1 ~")
          }
        }else {
          player.setDynamicProperty("player.stuck",0)
        }
    }catch {}

    // Sprint cooldown refers to the particle spawning when sprinting after not for a while
    player.runCommand("scoreboard players set @s player.sprint 0")
    if (player.isSprinting){
      player.runCommand("scoreboard players set @s player.sprint 1")
      player.runCommand("scoreboard players set @s player.sprintCooldown 10")
    }

    // Leap control for smoke leap
    if (mc.world.scoreboard.getObjective("leap.time").getScore(player) == 1){
      // This was done early on, that why it's in the main
      // Should move it, but the codes evolved in weird ways so i might as well leave it
      player.dimension.spawnParticle("minecraft:egg_destroy_emitter",player.location)
      mc.world.playSound("armor.equip_leather",player.location)
      player.removeTag("noArmor")
    }

    // Hasta la vista's force of counter
    if (mc.world.scoreboard.getObjective("hlv.shots").getScore(player) > 0){
      if (hlv.getLevel(player) == 0){
        hlvShooting(player,1);
      }else {
        hlvShooting(player,3);
      }
    }else {
      if (mc.world.scoreboard.getObjective("hlv.stored").getScore(player) < 128){
        if (tick%3===0){
          mc.world.scoreboard.getObjective("hlv.stored").addScore(player,1);
        }
      }
    }

    // Combo timer
    if (mc.world.scoreboard.getObjective("combo.timer").getScore(player) < 0){
      player.runCommand("scoreboard players set @s combo.count 0")
    }
    

    // Name rank control
    if (player.getDynamicProperty(`equipped.chat_rank`) > 0){
        player.nameTag = `${chatRank[player.getDynamicProperty(`equipped.chat_rank`)]} ${player.name}`
    }else {
      player.nameTag = player.name
    }

    // Slowly spawns the map in stages
    if (player.hasTag("mapSpawn")){
      slowSpawning(player,0);
    }

    // Spawn protextion
    if ((player.hasTag("dead") || player.getDynamicProperty("ffa.dead") == true) || (player.getDynamicProperty("ffa.queue") && !player.getDynamicProperty("ffa.alive") || (!player.getDynamicProperty("ffa.alive") && !player.getDynamicProperty("ffa.inGame")))){
      player.addTag("lobby")

      mc.world.scoreboard.getObjective("combo.count").setScore(player,0)
    }else {
      player.removeTag("lobby")
    }



    // Delayed tp after game
    if (player.hasTag("5secondtp")){
      addPlayerVar(player,"tpCount",1)

      if (player.getDynamicProperty("tpCount") > 100){
        player.removeTag("5secondtp");
        player.runCommand("tp @s -93.5 -60.00 -213.5")
      }
    }

    


    // Nearing the end of the initial release and completely pained from the complexity of this file
    // Im surprised minecraft can even run all this :skull:

    // Update, new mc update 1.21. Respawn glitch. makes it unplayable... hurray...
    // Was overloading from death (fixed it tho)


    // Teleport control
    if (mc.world.scoreboard.getObjective("teleport.blocks").getScore(player) > 0){
      player.runCommand("scoreboard players remove @s teleport.blocks 1")


      if (player.location.y >= -60){
        for (var y=0;y<2;y++){
          for (var x=-1;x<1;x++){
            for (var z=-1;z<1;z++){
              let block = findBlock(player,{x:x,y:y,z:z},2)
              if (!blockBlacklist.includes(block[0])){
                let success = blockQueue.enqueue(block);
                launchBlocks(player.location,1.5,1)
                if (success) player.dimension.runCommand(`setblock ${block[1].x} ${block[1].y} ${block[1].z} air`)
              }
            }
          }
        }
        
        player.runCommand("execute unless block ^ ^ ^0.5 barrier run tp @s ^ ^ ^0.5")
        player.runCommand("execute unless block ^ ^ ^0.5 barrier run tp @s ^ ^ ^0.5")
        if (player.runCommand("execute unless block ^ ^ ^0.5 barrier run tp @s ^ ^ ^0.5 false").successCount > 0){
          for (var i=0;i<25;i++){
            player.dimension.spawnParticle("minecraft:end_chest",player.location)
          }
        }
      }
      else {
        player.runCommand("scoreboard players set @s teleport.blocks 0")
      }
    }
  }


  overworld.runCommand("scoreboard players add @e[name=Grumm] life 1")
  overworld.runCommand("kill @e[name=Grumm,scores={life=100..}]")


  // Jeb shooting 
  const jebs = overworld.getEntities({
      type: "minecraft:sheep",
      name: "jeb_"
  })
  for (const jeb of jebs){
    jebCheck(jeb)
  }

  // Firework throwing 
  const fireworks = overworld.getEntities({
    type: "minecraft:fireworks_rocket"
  })

  for (const firework of fireworks){
    fireworkCheck(firework)
  }

  // Firework throwing 
  const blackholes = overworld.getEntities({
    type: "minecraft:armor_stand",
    name: "blackhole"
  })

  for (const blackhole of blackholes){
    if (blackhole.getDynamicProperty("life") == undefined){
      for (var i=0; i<10;i++){
        blackhole.dimension.spawnParticle("hog:black_hole",blackhole.location)
      }
    }
    
    for (var i=0;i<25;i++){
      blackhole.dimension.spawnParticle("hog:black_hole_horizon",blackhole.location)
    }

    addPlayerVar(blackhole,"life",1)
  }

  // Minecart Riding 
  const minecarts = overworld.getEntities({
    type: "minecraft:minecart"
  })
  for (const minecart of minecarts){
    minecartCheck(minecart)
  }
  
  // Tnt Throw 
  const tnts = overworld.getEntities({
    type: "minecraft:tnt"
  })
  for (const tnt of tnts){
    if (tnt.nameTag == "tnt"){
      tntCheck(tnt)
    }else {
      if (tick%20===0) { mc.world.playSound("random.click",tnt.location,{pitch:0.3,volume:0.2}) }
      mc.world.scoreboard.getObjective("life").addScore(tnt,1)
      if (mc.world.scoreboard.getObjective("life").getScore(tnt) >= 1990){
        player = tnt.dimension.getEntities({type:"minecraft:player",name:tnt.getTags()[0]})[0]
        if (!tnt.getDynamicProperty("done")){
          addPlayerVar(player,"C4.down",-1)
          tnt.setDynamicProperty("done",true)
        }
      }

      if (tnt.hasTag("boom")){
        addPlayerVar(tnt,"boom.ctime",1);
        if (tnt.getDynamicProperty("boom.ctime") == tnt.getDynamicProperty("boom.time")){
          customDamage(7,tnt,tnt.getTags()[0],5,damageType.C4)
          mc.world.playSound("random.explode",tnt.location, {volume: 5})
          try { overworld.spawnParticle("minecraft:huge_explosion_lab_misc_emitter",tnt.location) }catch {}
          knockback(tnt.location,0.5,0.5,5)
          tnt.kill()
        }
      }
    }
    
    try {
      const loc = tnt.location;
      loc.y++
      tnt.dimension.spawnParticle("minecraft:basic_smoke_particle",loc)
      tnt.dimension.spawnParticle("minecraft:basic_flame_particle",loc)
    }catch {}
  }
  
  // Tnt Throw 
  const zombies = overworld.getEntities({
    type: "minecraft:zombie",
    name: "Turret"
  })
  for (const zombie of zombies){
    turretCheck(zombie)
  }
  
  // Pig update 
  const pigs = overworld.getEntities({
    type: "minecraft:pig"
  })
  for (const pig of pigs){
    pigUpdate(pig)
  }
  
  // Armor Stands 
  const armor_stands = overworld.getEntities({
    type: "hog:armor_stand"
  })
  for (const armor_stand of armor_stands){
    standCheck(armor_stand);
  }

  // Arrow 
  const arrows = overworld.getEntities({
    type: "minecraft:arrow"
  })
  for (const arrow of arrows){
    arrow.runCommand(`execute as @s run particle minecraft:basic_smoke_particle ~ ~ ~`)
    arrow.runCommand(`execute as @s run particle minecraft:basic_crit_particle ^ ^ ^0.4`)
    arrow.runCommand(`execute as @s run particle minecraft:basic_crit_particle ^ ^ ^-0.4`)
    arrow.runCommand(`execute as @s run particle minecraft:basic_crit_particle ~ ~ ~`)
  }
  
  if (tick%2===0){
    let nb = blockQueue.dequeue()
    if (nb != null){
      if (nb[2][0]){
        overworld.runCommand(`setblock ${nb[1].x} ${nb[1].y} ${nb[1].z} ${nb[0]} [${nb[2][1]}]`)
      }else {
        overworld.runCommand(`setblock ${nb[1].x} ${nb[1].y} ${nb[1].z} ${nb[0]}`)
      }
    }
  }

  if (!mc.world.getDynamicProperty("ftp")){
    mc.world.setDynamicProperty("ffa.extraHealth",0)
    mc.world.setDynamicProperty("ffa.lives",1)
    mc.world.setDynamicProperty("ftp",true)
  }



  mc.system.run(onTick);
}
onTick();

export function findBlock(player,offset,dist){
  try {
    const view = player.getViewDirection()
    const loc = {x:player.location.x+view.x*dist+offset.x,y:player.location.y+view.y*dist+offset.y,z:player.location.z+view.z*dist+offset.z}

    const block = player.dimension.getBlock(loc)

    var state3 = [false]
    let perm = block.permutation;    

    if (perm.hasState("pillar_axis")){
      var state3 = [true,`"pillar_axis":"${perm.getState("pillar_axis")}"`]
    }
    else if (perm.hasState("old_leaf_type")){
      var state3 = [true,`"old_leaf_type":"${perm.getState("old_leaf_type")}"`]
    }
    else if (perm.hasState("flower_type")){
      var state3 = [true,`"flower_type":"${perm.getState("flower_type")}"`]
    }
    else if (perm.hasState("double_plant_type")){
      var state3 = [true,`"double_plant_type":"${perm.getState("double_plant_type")}","upper_block_bit":${perm.getState("upper_block_bit")}`]
    }
    else if (perm.hasState("facing_direction")){
      var state3 = [true,`"facing_direction":${perm.getState("facing_direction")}`]
    }
    else if (perm.hasState("weirdo_direction") && perm.hasState("upside_down_bit")){
      var state3 = [true,`"weirdo_direction":${perm.getState(`weirdo_direction`)},"upside_down_bit":${perm.getState("upside_down_bit")}`]
    }
    else if (perm.hasState("minecraft:vertical_half") && perm.hasState("stone_slab_type")){
      var state3 = [true,`"minecraft:vertical_half":"${perm.getState("minecraft:vertical_half")}","stone_slab_type":"${perm.getState("stone_slab_type")}"`]
    }
    else if (perm.hasState("minecraft:vertical_half") && perm.hasState("stone_slab_type2")){
      var state3 = [true,`"minecraft:vertical_half":"${perm.getState("minecraft:vertical_half")}","stone_slab_type":"${perm.getState("stone_slab_type_2")}"`]
    }
    else if (perm.hasState("minecraft:vertical_half") && perm.hasState("stone_slab_type3")){
      var state3 = [true,`"minecraft:vertical_half":"${perm.getState("minecraft:vertical_half")}","stone_slab_type":"${perm.getState("stone_slab_type_3")}"`]
    }
    else if (perm.hasState("minecraft:vertical_half") && perm.hasState("stone_slab_type4")){
      var state3 = [true,`"minecraft:vertical_half":"${perm.getState("minecraft:vertical_half")}","stone_slab_type":"${perm.getState("stone_slab_type_4")}"`]
    }
    else if (perm.hasState("minecraft:vertical_half")){
      var state3 = [true,`"minecraft:vertical_half":"${perm.getState("minecraft:vertical_half")}"`]
    }
    else if (perm.hasState("dirt_type")){
      var state3 = [true,`"dirt_type":"${perm.getState("dirt_type")}"`]
    }
    else if (perm.hasState("direction")){
      var state3 = [true,`"direction":${perm.getState("direction")},"upside_down_bit":${perm.getState("upside_down_bit")},"open_bit":${perm.getState("open_bit")}`]
    }



    return [block.typeId,block.location,state3]
  }catch {
    return ["minecraft:air"]
  }
}

function valid(val){
  if (val == true){
    return true
  }
  else if (val == false){
    return true
  }else {
    return false
  }
}


export function forceSlot(player){
    if (!player.getDynamicProperty("spectate")){
      const slot1 = equipAblInv(player,1)
      const slot2 = equipAblInv(player,2)
      const slot3 = equipAblInv(player,3)
      const slot4 = equipAblInv(player,4)
      const slot5 = equipAblInv(player,5)

      const inv = player.getComponent("inventory").container
      inv.setItem(5,new mc.ItemStack("minecraft:wooden_sword"))

      if (convToTime(player,slot1)>0) player.runCommand(`replaceitem entity @s slot.hotbar 0 barrier ${getItemCount(player,slot1)} 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
      else if (equipAblInv(player,1) != "minecraft:air") player.runCommand(`replaceitem entity @s slot.hotbar 0 ${equipAblInv(player,1)} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)

      if (convToTime(player,slot2)>0) player.runCommand(`replaceitem entity @s slot.hotbar 1 barrier ${getItemCount(player,slot2)} 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
      else if (equipAblInv(player,2) != "minecraft:air") player.runCommand(`replaceitem entity @s slot.hotbar 1 ${equipAblInv(player,2)} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)

      if (convToTime(player,slot3)>0) player.runCommand(`replaceitem entity @s slot.hotbar 2 barrier ${getItemCount(player,slot3)} 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
      else if (equipAblInv(player,3) != "minecraft:air") player.runCommand(`replaceitem entity @s slot.hotbar 2 ${equipAblInv(player,3)} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)

      if (convToTime(player,slot4)>0) player.runCommand(`replaceitem entity @s slot.hotbar 3 barrier ${getItemCount(player,slot4)} 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
      else if (equipAblInv(player,4) != "minecraft:air") player.runCommand(`replaceitem entity @s slot.hotbar 3 ${equipAblInv(player,4)} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)

      if (convToTime(player,slot5)>0) player.runCommand(`replaceitem entity @s slot.hotbar 4 barrier ${getItemCount(player,slot5)} 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
      else if (equipAblInv(player,5) != "minecraft:air") player.runCommand(`replaceitem entity @s slot.hotbar 4 ${equipAblInv(player,5)} 1 0 {"minecraft:item_lock":{ "mode": "lock_in_slot" }}`)
    }else {
      const inv = player.getComponent("inventory").container
      
      inv.setItem(0,new mc.ItemStack("minecraft:air"))
      inv.setItem(1,new mc.ItemStack("minecraft:air"))
      inv.setItem(2,new mc.ItemStack("minecraft:air"))
      inv.setItem(3,new mc.ItemStack("minecraft:arrow"))
      inv.setItem(5,new mc.ItemStack("minecraft:arrow"))
      inv.setItem(4, new mc.ItemStack("minecraft:barrier"))
    }
}


function doubleJump(player,strength){
  if (player.isJumping){
    if (mc.world.scoreboard.getObjective("jump.bool").getScore(player) == 0){
        if (mc.world.scoreboard.getObjective("jump.count").getScore(player) != 1){
            player.runCommand(`scoreboard players set @s jump.start ${tick}`);
        }
        player.runCommand("scoreboard players add @s jump.count 1");
        
    }
    player.runCommand("scoreboard players set @s jump.bool 1");
  }else{
      player.runCommand("scoreboard players set @s jump.bool 0");
      if (mc.world.scoreboard.getObjective("jump.start").getScore(player)+6<tick){
          player.runCommand("scoreboard players set @s jump.count 0");
          player.runCommand(`scoreboard players set @s jump.start ${1000000}`);
      }
  }
  if (mc.world.scoreboard.getObjective("dj.cooldown").getScore(player) < 1){
      if (mc.world.scoreboard.getObjective("jump.count").getScore(player) > 1){
          player.runCommand("scoreboard players set @s dj.cooldown 20");
          player.setDynamicProperty("jump.valid",false);
          let loc = player.location;
          loc.y -= 0.5;
          launchBlocks(loc,2,0.5)

          player.applyKnockback(0,0,0,strength);
          try { player.dimension.spawnParticle("minecraft:wind_explosion_emitter",player.location) } catch {}
          mc.world.playSound("breeze_wind_charge.burst",player.location)
      }
  }
}



mc.world.beforeEvents.playerInteractWithBlock.subscribe(a=> {
  const block = a.block;
  const player = a.player;

  if (player.getDynamicProperty("settings.buildMode") != true){
    if (interactBlacklist.includes(block.typeId)){
      a.cancel = true;
    }
  }
})


mc.world.afterEvents.playerSpawn.subscribe(a=> {
  const player = a.player;
  const initial = a.initialSpawn;

  if (initial){
      // Losing game
      if (player.getDynamicProperty("ffa.alive") && player.getDynamicProperty("ffa.queue")){
        
        player.setDynamicProperty("round.money",0);
        player.setDynamicProperty("round.kills",0);
      }

      // Resetting game states
      player.runCommand("tp @s -93.5 -60.00 -213.5")
      player.setDynamicProperty("ffa.inGame",false);

      // Huge issue of variable managment here. ffa.alive and ffa.dead. They should always be the same right
      player.setDynamicProperty("ffa.alive",false);
      player.setDynamicProperty("ffa.dead",false);

      // These are very important game states
      player.setDynamicProperty("ability.able",false);
      player.setDynamicProperty("spectate",false);
      player.setDynamicProperty("cameraState","default");
      player.setDynamicProperty("ffa.queue",false);
      player.removeTag("5secondtp")

      // Reloading new data
      for (const saveEntity of player.dimension.getEntities({type:"minecraft:iron_golem",tags:[player.id]})){
        const data = JSON.parse(saveEntity.nameTag);
        if (data.version != saveVersion){
          player.runCommand(`scriptevent hog:load_data`)
        }
      }
  }
})

mc.world.afterEvents.entityHurt.subscribe(f=> {
  const damage = Math.round(f.damage)
  const entity = f.hurtEntity

  if (entity.typeId == "minecraft:player"){
    const text = entity.dimension.spawnEntity("hog:floating_text",{x:entity.location.x,y:entity.location.y+1,z:entity.location.z})
    text.nameTag = `§4${damage*100}`

    try {
      entity.runCommand(`scoreboard players add ${f.damageSource.damagingEntity.name} combo.count 1`)
      entity.runCommand(`scoreboard players set ${f.damageSource.damagingEntity.name} combo.timer ${comboLoseTime}`)
      
      if (mc.world.scoreboard.getObjective("settings.comboDisplay").getScore(f.damageSource.damagingEntity) == 1){
        const combo = mc.world.scoreboard.getObjective("combo.count").getScore(f.damageSource.damagingEntity)
        var comboColor = "2"
        if (combo <= 9){ var comboColor = "2" }
        else if (combo <= 19){ var comboColor = "6" }
        else { var comboColor = "5" }
        entity.runCommand(`titleraw ${f.damageSource.damagingEntity.name} title { "rawtext": [{ "text": "                           §${comboColor}${mc.world.scoreboard.getObjective("combo.count").getScore(f.damageSource.damagingEntity)}" }]}`)

      }


      if (entity.hasTag("binded")){
        addPlayerVar(f.damageSource.damagingEntity,"Scorching Flame.combo",1)
        f.damageSource.damagingEntity.setDynamicProperty("Scorching Flame.timer",comboLoseTime)
      }
    }catch {}
  }
})

export const comboLoseTime = 100;


mc.world.beforeEvents.itemUse.subscribe(a=> {
  if (a.itemStack.typeId == "hog:menu_item"){
    mc.system.run(()=>{
      if (!a.source.getDynamicProperty("ffa.alive") && !(a.source.getDynamicProperty("ffa.queue") && mc.world.getDynamicProperty("game.playing"))){
        mainMenu(a.source)
      }else {
        a.source.sendMessage("§cCan't open this menu in a match")
      }
    })
  }
})