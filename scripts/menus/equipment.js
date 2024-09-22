import * as mc from "@minecraft/server";
import { ChestFormData } from '../extensions/forms.js';

import { bloomPot, fireworksBlaster, fireworksBlaster2, fireworksBlaster3, flash, grabber, healCircle, heavyGuard, heavyLift, heavyPunch, hlv, hlv2, jailTime, jeb, jebRider, kbPunch, kt1, kt2, kt3, leap, pe, ps, randomizeList, skully, skully2, skully3, smokeLeap, thrower, thrower2, thrower3, tp1, tp2, tp3, tripleJeb, turret } from "../abilities"
import {equipAblInvMenu,ablValue} from "abilities.js";
import { forceSlot } from "../main"
import { mainMenu } from "./main_menu"
import { loadouts } from "./loadouts.js";

export function equipment(player) {
	let equipments = new ChestFormData()
	equipments.title('§l§5Equipment')
    equipmentButton(0, '§l§cLeap', ["§7Leaps the player forward"], "textures/items/feather",equipments,player,[leap.name,smokeLeap.name])
    equipmentButton(1, '§l§cJeb Shooter', ["§7Shoots an explosive jeb that explodes on impact"], "textures/items/nether_star",equipments,player,[jeb.name,tripleJeb.name,jebRider.name])
    equipmentButton(2, '§l§cTeleport', ["§7Teleports"], "textures/items/arrow",equipments,player,[tp1.name,tp2.name,tp3.name])
    equipmentButton(3, '§l§cKnife Throw', ["§7Throws a knife that impales through players"], "textures/items/item_frame",equipments,player,[kt1.name,kt2.name,kt3.name])
    equipmentButton(4, '§l§cHeal Circle', ["§7Creates a temporary heal circle that heals all players within"], "textures/items/emerald",equipments,player,[healCircle.name])
    equipmentButton(5, '§l§cFirework!', ["§7Shoots an explosive firework"], "textures/items/fireworks",equipments,player,[fireworksBlaster.name,fireworksBlaster2.name,fireworksBlaster3.name])
    equipmentButton(6, '§l§cFlash', ["§7Grants really fast speed for a short time"], "textures/items/sugar",equipments,player,[flash.name])
    equipmentButton(7, '§l§cHeavy Punch', ["§7Combos the player"], "minecraft:anvil",equipments,player,[heavyPunch.name,heavyLift.name,heavyGuard.name])
    equipmentButton(8, '§l§cSkully', ["§7Launches forward and flash bangs everyone it hits"], "minecraft:skull",equipments,player,[skully.name,skully2.name,skully3.name])
    equipmentButton(9, '§l§cRotten Launcher', ["§7Shoots an egg that knocks back enemies"], "textures/items/egg",equipments,player,[thrower.name,thrower2.name,thrower3.name])
    equipmentButton(10, '§l§cGrabber', ["§7Can grab and pull enemies toward you!"], "textures/items/lead",equipments,player,[grabber.name])
    equipmentButton(11, '§l§cPowerup Shot', ["§7Charges up to an inevitable high damage laser beam"], "textures/items/amethyst_shard",equipments,player,[ps.name,pe.name])
    equipmentButton(12, '§l§cBloom Pot', ["§7Throws a flower in a pot that bursts into flowers\nbetter hope your not allergic"], "textures/items/flower_pot",equipments,player,[bloomPot.name])
    equipmentButton(13, '§l§cKnockback Punches', ["§7Give out some punches and push\nthe opponents really far away from you!\nAlso deals 3x damage + 3x combo per punch"], "textures/items/dye_powder_yellow",equipments,player,[kbPunch.name])
    equipmentButton(14, '§l§cTurret', ["§7Place a turret that sits there and shoot\n at nearby enemies"], "textures/items/lever",equipments,player,[turret.name])
    equipmentButton(15, '§l§cHasta La Vista', ["§7Shoot a quick barage of arrows at the enemy"], "textures/items/iron_nugget",equipments,player,[hlv.name])
    equipmentButton(16, '§l§cScorching Flame', ["§7Freezes the effect player in time for a couple seconds"], "textures/items/magma_cream",equipments,player,[jailTime.name])
    randomButton(24,equipments,player)
    equipments.button(23, '§l§cLoadouts', [], "minecraft:ender_chest")
    equipments.button(25, '§l§cClear', [], "textures/items/flint_and_steel")
    equipments.button(26, '§l§cBack', [], "minecraft:barrier")


    equipments.show(player).then(response => {
        if (response.canceled) return;
        else {
            switch(response.selection){
            case 0:
                var array = [
                    ["Leap","Launches player in direction facing","feather"],
                    ["Smoke Leap","Launches player in the facing\ndirection and does it secretly","feather"]
                ]
                multiEquip(player,array,"Leap","leap","leap");
                break;
            case 1:
                var array = [
                    ["Jeb Shooter","Shoots an explosive jeb that explodes on impact","nether_star"],
                    ["Triple Jeb Shooter","Launches 3 explosive jebs that each explode on impacty","nether_star"],
                    ["Jeb Rider","Turns you into a jeb to ride into battle\nLike other jebs explodes on contact","nether_star"]
                ]
                multiEquip(player,array,"Jeb Shooter","jeb","jeb");
                break;
            case 2:
                var array = [
                    ["Teleport","Instantly teleports to nearest enemy","feather"],
                    ["Facing Teleport","Teleports player in the direction\n they are facing","feather"],
                    ["Waypoint Teleport","Places a waypoint at the location its placed\nnext time its activated the it teleports the player\nto the waypoint","feather"]
                ]
                multiEquip(player,array,"Teleport","teleport","teleport");
                mc.world.scoreboard.getObjective("teleport.state").setScore(player,0)
                player.runCommand(`kill @e[name=waypoint,tag="${player.name}"]`)
                break;
            case 3:
                var array = [
                    ["Knife Throw","Throws a knife that peirces through players"],
                    ["Triple Knife Throw","Throws 3 knifes in direction your looking"],
                    ["Homing Knife Throw","Throws a homing knife that hunts your enemies"]
                ]
                multiEquip(player,array,"Knife Throw","knifeThrow","knifeThrow");
                break;
            case 4:
                if (player.getDynamicProperty(`${healCircle.name}.Unlocked`)) slot(player,"Heal Circle");
                else equipment(player);
                break;
            case 5:
                var array = [
                    ["Fireworks Blaster","Fires a firework! Kaboom!"],
                    ["Triple Fireworks Blaster","Fires 3 fireworks! Kaboom!x3"],
                [fireworksBlaster3.name,"Fires 90 fireworks! Kaboom!x90"]
                ]
                multiEquip(player,array,fireworksBlaster.name,fireworksBlaster.id);
                break;
            case 6:
                if (player.getDynamicProperty(`${flash.name}.Unlocked`)) slot(player,"Flash");
                else equipment(player);
                break;
            case 7:
                var array = [
                    ["Heavy Punch","Creates a friend to combo the enemy"],
                    ["Heavy Lift","Creates a friend to lift the enemy\nthen slam them into the floor"],
                    ["Heavy Guard","Creates a friend to push back those\npesky people trying to cross your border"]
                ]
                multiEquip(player,array,"Heavy Punch","heavyP");
                break;
            case 8:
                var array = [
                    ["Skully","Fires a spooky skull that flashes the enemy when hit"],
                    ["Triple Skully","Fires 3 spooky skulls that flash the enemy when hit"],
                    ["Skullyrang","Aka Bonerang throws a skeleton boomerang that flashes the enemy when hit"]
                ]
                multiEquip(player,array,"Skully","skully");
                break;
            case 9:
                var array = [
                    ["Rotten Launcher","Fires a shockwave egg that when colliding\nwith the ground creates a shockwave\nknocking away enemies"],
                    ["TNT Launcher","Throws a bit of tnt"],
                    ["C4","Punch to throw down some C4\nInteract to activate it\nYou have a maximum of 5 C4 Placed.\nKaboom!"]
                ]
                multiEquip(player,array,"Rotten Launcher","thrower");
                player.setDynamicProperty("C4.down",0)
                player.runCommand(`kill @e[type=tnt,name=C4,tag="${player.name}"]`)
                break;
            case 10:
                if (player.getDynamicProperty(`${grabber.name}.Unlocked`)) slot(player,"Grabber");
                else equipment(player);
                break;
            case 11:
                var array = [
                    ["Powerup Shot","Charges up to an inevitable high damage laser beam"],
                    ["Powerup Explosion","Charges up to an inevitable high damage explosion"]
                ]
                multiEquip(player,array,"Powerup Shot","ps");
                break;
            case 12:
                if (player.getDynamicProperty(`${bloomPot.name}.Unlocked`)) slot(player,"Bloom Pot");
                else equipment(player);
                break;
            case 13:
                if (player.getDynamicProperty(`${kbPunch.name}.Unlocked`)) slot(player,"Knockback Punches");
                else equipment(player);
                break;
            case 14:
                if (player.getDynamicProperty(`${turret.name}.Unlocked`)) slot(player,"Turret");
                else equipment(player);
                break;
            case 15:
                var array = [
                    ["Hasta La Vista","Fires arrows in rapid succession"],
                    [`${hlv2.name}`,"Fires 3 arrow in rapid succession"]
                ]
                multiEquip(player,array,"Hasta La Vista","hlv");
                break;
            case 16:
                if (player.getDynamicProperty(`${jailTime.name}.Unlocked`)) slot(player,"Scorching Flame");
                else equipment(player);
                break;
            case 24:
                if (player.getDynamicProperty("random_abilities.unlocked")){
                randomizeLoadout(player);
                }
                else equipment(player);
                break;
            case 23: loadouts(player); break;
            case 25: 
                player.runCommand("scoreboard players set @s equip.slot1 0");
                player.runCommand("scoreboard players set @s equip.slot2 0");
                player.runCommand("scoreboard players set @s equip.slot3 0");
                player.runCommand("scoreboard players set @s equip.slot4 0");
                player.runCommand("scoreboard players set @s equip.slot5 0");
                player.runCommand("clear @s");
                break;
            case 26: mainMenu(player); break;
            }
        }
	})
};

function randomizeLoadout(player){
  const temp = [
    [leap, smokeLeap],
    [jeb, tripleJeb, jebRider],
    [tp1, tp2, tp3],
    [kt1, kt2, kt3],
    [healCircle],
    [fireworksBlaster, fireworksBlaster2, fireworksBlaster3],
    [flash],
    [heavyPunch, heavyLift, heavyGuard],
    [skully, skully2, skully3],
    [thrower, thrower2, thrower3],
    [grabber],
    [ps, pe],
    [bloomPot],
    [kbPunch],
    [turret],
    [hlv, hlv2],
    [jailTime]
  ]

  
  player.runCommand("scoreboard players set @s equip.slot1 0");
  player.runCommand("scoreboard players set @s equip.slot2 0");
  player.runCommand("scoreboard players set @s equip.slot3 0");
  player.runCommand("scoreboard players set @s equip.slot4 0");
  player.runCommand("scoreboard players set @s equip.slot5 0");
  player.runCommand("clear @s");

  for (var i=1;i<6;i++){
    const rand = Math.floor(Math.random()*temp.length);
    
    const abilitys = temp[rand];
    temp.splice(rand,1)

    const rand2 = Math.floor(Math.random()*abilitys.length);
    const ability = abilitys[rand2];
    
    player.runCommand(`scoreboard players set @s ${ability.id}.level ${rand2}`)
    equipAbl(player,i,abilitys[0].name,false)
  }

  return
}

function randomButton(slot,form,player){
  const unlocked = player.getDynamicProperty("random_abilities.unlocked")

  if (unlocked){
    form.button(slot, "§l§cRandom Loadout ",[],"textures/items/chorus_fruit")
  }else {
    form.button(slot, "§cLocked", ["§7Get all the abilities first to\nunlock this button"], "minecraft:black_wool")
  }
}

function equipmentButton(slot,name,description,texture,form,player,names){
  var unlocked = false;
  names.forEach(name => {
    if (player.getDynamicProperty(`${name}.Unlocked`)){
      unlocked = true;
    }
  });

  if (unlocked){
    form.button(slot, name,description,texture)
  }else {
    form.button(slot, "§cLocked", ["§7Get one of these abilities to unlock it"], "minecraft:black_wool")
  }
}

function slot(player,equip){
	let slots = new ChestFormData()
	slots.title('§l§5Equipment')
    slots.button(26, '§l§cBack', [], "minecraft:barrier")
    slots.button(11, '§l§cEquip Slot 1', [], `${equipAblInvMenu(player,1)}`)
    slots.button(12, '§l§cEquip Slot 2', [], `${equipAblInvMenu(player,2)}`)
    slots.button(13, '§l§cEquip Slot 3', [], `${equipAblInvMenu(player,3)}`)
    slots.button(14, '§l§cEquip Slot 4', [], `${equipAblInvMenu(player,4)}`)
    slots.button(15, '§l§cEquip Slot 5', [], `${equipAblInvMenu(player,5)}`)

	slots.show(player).then(response => {
		if (response.canceled) return;
        else { 
        switch(response.selection){
          case 11: equipAbl(player,1,equip); break;
          case 12: equipAbl(player,2,equip); break;
          case 13: equipAbl(player,3,equip); break;
          case 14: equipAbl(player,4,equip); break;
          case 15: equipAbl(player,5,equip); break;
          forceSlot(player)
          case 26: equipment(player); break;
        }
      }
	})
}

function equipAbl(player,slot,ability,menu=true){
  var abl = ablValue(ability);
  
  player.runCommand(`scoreboard players set @s[scores={equip.slot1=${abl}}] equip.slot1 0`)
  player.runCommand(`scoreboard players set @s[scores={equip.slot2=${abl}}] equip.slot2 0`)
  player.runCommand(`scoreboard players set @s[scores={equip.slot3=${abl}}] equip.slot3 0`)
  player.runCommand(`scoreboard players set @s[scores={equip.slot4=${abl}}] equip.slot4 0`)
  player.runCommand(`scoreboard players set @s[scores={equip.slot5=${abl}}] equip.slot5 0`)
  player.runCommand(`scoreboard players set @s equip.slot${slot} ${abl}`)
  player.runCommand("playsound note.pling @s")

  if (menu){
    forceSlot(player)
    equipment(player)
  }
}






function multiEquip(player,equipArray,name,scoreboardName){
  var unlocked = false;
  equipArray.forEach(name => {
    if (player.getDynamicProperty(`${name[0]}.Unlocked`)){
      unlocked = true;
    }
  });

  if (!unlocked) equipment(player);
  else {
    let slots = new ChestFormData()
    slots.title('§l§5Equipment')
    slots.button(26, '§l§cBack', [], "minecraft:barrier")

    const stars = [
      ['§s✪',"§sCommon","textures/items/wood_hoe"],
      ['§d✪✪',"§dRare","textures/items/gold_hoe"],
      ['§6✪✪✪',"§6Legendary!","textures/items/diamond_hoe"]
    ]

    let buttonValue = []

    let point = 11
    equipArray.forEach(level=> {
      if (mc.world.scoreboard.getObjective(`${scoreboardName}.level`).getScore(player) == buttonValue.length){
        var texture = "textures/items/dye_powder_red"
      }else {
        var texture = equipAblInvMenu(player,1,ablValue(name))
      }
      var lore = level[1]

      if (!player.getDynamicProperty(`${level[0]}.Unlocked`)){
        var texture = "minecraft:black_wool"
        var lore = "§7Unlock this ability to find out\nmore about it"
      }

      slots.button(point, `§l§c${level[0]}`, [lore], texture);

      const star = stars[Math.ceil((point-11)/2)]
      slots.button(point+9, star[0], [star[1]], star[2]);

      buttonValue[Math.ceil((point-11)/2)] = point

      point += 2;
    })


    slots.show(player).then(response => {
        if (response.canceled) return;
        else {
          let num = 0
          buttonValue.forEach(item=> {
            if (item == response.selection){
              if (!player.getDynamicProperty(`${equipArray[num][0]}.Unlocked`)){
              }else {
                player.runCommand(`scoreboard players set @s ${scoreboardName}.level ${num}`)
                slot(player,name);
              }
            }
            num++
          })

          switch(response.selection){
            case 26: equipment(player); break;
          }
          forceSlot(player)
        }
      })
    }
}