import * as mc from "@minecraft/server"
import {tick} from "main.js"

import {knockbackPunch} from "abilities/knockbackPunch.js";
import {healCheck} from "abilities/healCircle.js";
import {} from "abilities/turret.js";
import {} from "abilities/hastaLaVista.js";
import { heavyPunching, heavyLifting, heavyGuarding } from "./abilities/heavy";
import {flameBindCheck} from "abilities/flameBind.js";
import {grabberCheck} from "abilities/grabber.js";
import {} from "abilities/thrower";
import { damageType } from "./damageTypes";
import { hitAnimations } from "./cosmetic/hitAnim";
import { flowerThrow } from "./abilities/bloomPot";
import { knifeCheck } from "./abilities/knifeThrow";
import { powerexplosionCheck, powershotCheck } from "./abilities/powerupAbilities";
import { skullyCheck, skulrang } from "./abilities/skully";
import {} from "./abilities/leap";
import {} from "./abilities/teleport";
import {} from "./abilities/flash";
import { getProp } from "./menus/stats";



// Variable declaration
export const overworld = mc.world.getDimension("overworld");



export function addPlayerVar(player,name,amt){
  try {
    if (player.getDynamicProperty(name) >= 0){
      player.setDynamicProperty(name,player.getDynamicProperty(name)+amt)
    }else {
      player.setDynamicProperty(name,amt)
    }
  }catch {}
}

export const passList = [
  "minecraft:air",
  "minecraft:tall_grass",
  "minecraft:azure_bluet",
  "minecraft:fern",
  "minecraft:short_grass",
  "minecraft:short_grass",
  "minecraft:short_grass",
  "minecraft:green_carpet",
  "minecraft:stone_button",
  "minecraft:double_plant",
  "minecraft:green_carpet",
  "minecraft:waterlily",
  "minecraft:ladder",
  "minecraft:rail",
  "minecraft:wheat",
  "minecraft:potatoes",
  "minecraft:carrots",
  "minecraft:beetroot",
  "minecraft:allium",
  "minecraft:peony"
]


// Ability declaration
export class Ability{
  constructor(name, id, cooldown, item,weight=0,rarity="Common"){
    this.name = name;
    this.id = id;
    this.cooldown = cooldown;
    this.item = item;
    this.weight = weight;
    this.rarity = rarity;
  }
  cool(player,amt=this.cooldown){
    player.runCommand(`scoreboard players set @s ${this.id}.cooldown ${amt}`)
    addPlayerVar(player,"abilityUsed",1)
    addPlayerVar(player,`${this.name}.used`,1)
  }

  freezeCool(player){
    player.runCommand(`scoreboard players set @s ${this.id}.cooldown 5`)
  }
  
  getCooldown(player){
    return mc.world.scoreboard.getObjective(`${this.id}.cooldown`).getScore(player)/20
  }

  getLevel(player){
    return mc.world.scoreboard.getObjective(`${this.id}.level`).getScore(player)
  }

  getUnlocked(player){
    if (player.getDynamicProperty(`${this.name}.Unlocked`)){
      return true
    }else {
      return false
    }
  }

  unlock(player){
    player.setDynamicProperty(`${this.name}.Unlocked`,true)
  }

  take(player){
    player.setDynamicProperty(`${this.name}.Unlocked`,false)
  }

  toDict(player) {
    return {
      name: this.name,
      unlocked: this.getUnlocked(player),
      uses: getProp(player,`${this.name}.used`),
      gamesPlayed: getProp(player,`${this.name}.played`),
      wins: getProp(player,`${this.name}.wins`)
    };
  }
  
}


// List of
export const leap = new Ability("Leap","leap",3*20,"minecraft:feather",0,"Common")
export const smokeLeap = new Ability("Smoke Leap","leap",6*20,"minecraft:feather",25,"Rare")

export const jeb = new Ability("Jeb Shooter","jeb",50,"minecraft:nether_star",0,"Common")
export const tripleJeb = new Ability("Triple Jeb Shooter","jeb",80,"minecraft:nether_star",0,"Rare")
export const jebRider = new Ability("Jeb Rider","jeb",20*20,"minecraft:nether_star",10,"Legendary")

export const tp1 = new Ability("Teleport","teleport",3*20,"minecraft:arrow",50,"Common")
export const tp2 = new Ability("Facing Teleport","teleport",6.5*20,"minecraft:arrow",0,"Rare")
export const tp3 = new Ability("Waypoint Teleport","teleport",10*20,"minecraft:arrow",6,"Legendary")

export const kt1 = new Ability("Knife Throw","knifeThrow",1,"minecraft:frame",0,"Common")
export const kt2 = new Ability("Triple Knife Throw","knifeThrow",10,"minecraft:frame",0,"Rare")
export const kt3 = new Ability("Homing Knife Throw","knifeThrow",5*20,"minecraft:frame",2,"Legendary")

export const healCircle = new Ability("Heal Circle","healCircle",15*20,"minecraft:emerald",0,"Common")

export const fireworksBlaster = new Ability("Fireworks Blaster","fireworkBlaster",5,"minecraft:firework_rocket",18,"Common")
export const fireworksBlaster2 = new Ability("Triple Fireworks Blaster","fireworkBlaster",20,"minecraft:firework_rocket",0,"Rare")
export const fireworksBlaster3 = new Ability("MEGA Fireworks Blaster","fireworkBlaster",20*12,"minecraft:firework_rocket",0,"Geo-Limited")

export const flash = new Ability("Flash","flash",9*20,"minecraft:sugar",50,"Common")

export const heavyPunch = new Ability("Heavy Punch","heavyP",8*20,"minecraft:anvil",0,"Common")
export const heavyLift = new Ability("Heavy Lift","heavyP",10*20,"minecraft:anvil",20,"Rare")
export const heavyGuard = new Ability("Heavy Guard","heavyP",30*20,"minecraft:anvil",5,"Legendary")

export const skully = new Ability("Skully","skully",15,"minecraft:skull",35,"Common")
export const skully2 = new Ability("Triple Skully","skully",30,"minecraft:skull",0,"Rare")
export const skully3 = new Ability("Skullyrang","skully",20,"minecraft:skull",2,"Legendary")

export const thrower = new Ability("Rotten Launcher","thrower",50,"minecraft:egg",60,"Common")
export const thrower2 = new Ability("TNT Launcher","thrower",50,"minecraft:egg",20,"Rare")
export const thrower3 = new Ability("C4","thrower",0,"minecraft:egg",0,"Legendary")

export const grabber = new Ability("Grabber","grabber",10*20,"minecraft:lead",15,"Rare")

export const ps = new Ability("Powerup Shot","ps",10*20,"minecraft:amethyst_shard",33,"Common")
export const pe = new Ability("Powerup Explosion","ps",15*20,"minecraft:amethyst_shard",15,"Rare")

export const bloomPot = new Ability("Bloom Pot","bloomPot",30,"minecraft:flower_pot",0,"Geo-Limited")

export const kbPunch = new Ability("Knockback Punches","kbP",20*20,"minecraft:yellow_dye",34,"Common")

export const turret = new Ability("Turret","turret",20*20,"minecraft:lever",6,"Legendary")

export const hlv = new Ability("Hasta La Vista","hlv",1,"minecraft:iron_nugget",20,"Common")
export const hlv2 = new Ability("Hasta La Vista 2","hlv",1,"minecraft:iron_nugget",0,"Rare")

export const jailTime = new Ability("Scorching Flame","jt",13*20,"minecraft:magma_cream",4,"Legendary")



export const ablList = [
  leap,
  jeb,
  tp1,
  kt1,
  healCircle,
  fireworksBlaster,
  flash,
  heavyPunch,
  skully,
  thrower,
  grabber,
  ps,
  bloomPot,
  kbPunch,
  turret,
  hlv,
  jailTime
]

// Hopefully dont forget to replace onto this
export const completeArray = [
  leap,
  smokeLeap,
  jeb,
  tripleJeb,
  jebRider,
  tp1,
  tp2,
  tp3,
  kt1,
  kt2,
  kt3,
  healCircle,
  fireworksBlaster,
  fireworksBlaster2,
  fireworksBlaster3,
  flash,
  heavyPunch,
  heavyLift,
  heavyGuard,
  skully,
  skully2,
  skully3,
  thrower,
  thrower2,
  thrower3,
  grabber,
  ps,
  pe,
  bloomPot,
  kbPunch,
  turret,
  hlv,
  hlv2,
  jailTime
]

export const crateItems = [
  smokeLeap,
  jebRider,
  tp1,
  tp3,
  kt3,
  fireworksBlaster,
  flash,
  heavyLift,
  heavyGuard,
  skully,
  skully3,
  thrower,
  thrower2,
  grabber,
  ps,
  pe,
  kbPunch,
  turret,
  hlv,
  jailTime
]

export const randomizeList = [
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


export function convToUpgrade(player,ability){
  var name = ability
  switch (ability){
    case tp1.name:
      if (tp1.getLevel(player) == 0) name= "§3"+tp1.name;
      if (tp1.getLevel(player) == 1) name= "§d"+tp2.name;
      if (tp1.getLevel(player) == 2){
        if (mc.world.scoreboard.getObjective("teleport.state").getScore(player) == 0) name= "§6"+"Waypoint Set";
        if (mc.world.scoreboard.getObjective("teleport.state").getScore(player) == 1) name= "§6"+tp3.name;
      }
      break;
    case leap.name:
      if (leap.getLevel(player) == 0) name= "§3"+leap.name;
      if (leap.getLevel(player) == 1) name= "§d"+smokeLeap.name;
      break;
    case jeb.name:
      if (jeb.getLevel(player) == 0) name= "§3"+jeb.name;
      if (jeb.getLevel(player) == 1) name= "§d"+tripleJeb.name;
      if (jeb.getLevel(player) == 2) name= "§6"+jebRider.name;
      break;
    case kt1.name:
      if (kt1.getLevel(player) == 0) name= "§3"+kt1.name;
      if (kt1.getLevel(player) == 1) name= "§d"+kt2.name;
      if (kt1.getLevel(player) == 2) name= "§6"+kt3.name;
      break;
    case healCircle.name:
      name = "§3"+healCircle.name
      break;
    case fireworksBlaster.name:
      if (fireworksBlaster.getLevel(player) == 0) name= "§3"+fireworksBlaster.name;
      if (fireworksBlaster.getLevel(player) == 1) name= "§d"+fireworksBlaster2.name;
      if (fireworksBlaster.getLevel(player) == 2) name= "§6"+fireworksBlaster3.name;
      break;
    case flash.name:
      name = "§3"+flash.name
      break;
    case heavyPunch.name:
      if (heavyPunch.getLevel(player) == 0) name= "§3"+heavyPunch.name;
      if (heavyPunch.getLevel(player) == 1) name= "§d"+heavyLift.name;
      if (heavyPunch.getLevel(player) == 2) name= "§6"+heavyGuard.name;
      break;
    case skully.name:
      if (skully.getLevel(player) == 0) name= "§3"+skully.name;
      if (skully.getLevel(player) == 1) name= "§d"+skully2.name;
      if (skully.getLevel(player) == 2) name= "§6"+skully3.name;
      break;
    case thrower.name:
      if (thrower.getLevel(player) == 0) name= "§3"+thrower.name;
      if (thrower.getLevel(player) == 1) name= "§d"+thrower2.name;
      if (thrower.getLevel(player) == 2) name= "§6"+thrower3.name;
      break;
    case grabber.name:
      name = "§3"+grabber.name
      break;
    case ps.name:
      if (ps.getLevel(player) == 0) name= "§3"+ps.name;
      if (ps.getLevel(player) == 1) name= "§d"+pe.name;
      break;
    case bloomPot.name:
      name = "§3"+bloomPot.name
      break;
    case kbPunch.name:
      name = "§3"+kbPunch.name
      break;
    case turret.name:
      name = "§3"+turret.name
      break;
    case jailTime.name:
      name = "§3"+jailTime.name
      break;

  }

  return name;
}


// Knockback for players
export function knockback(location,hStr=2,vStr=0.2,radius=5,entity="minecraft:player"){
    // Player launch 
    const players2 = overworld.getEntities({
      type: entity,
      location: location,
      maxDistance: radius
    })

    for (const player2 of players2){
      player2.applyKnockback(player2.location.x-location.x,player2.location.z-location.z,hStr,(player2.location.y-location.y+vStr))
    }
}

// Custom one with critical hit particle
export function custKnockback(location,hStr=2,vStr=0.2,radius=5,entity="minecraft:player"){
  // Player launch 
  const players2 = overworld.getEntities({
    type: entity,
    location: location,
    maxDistance: radius,
    minDistance: 0.01
  })

  for (const player2 of players2){
    const loc = player2.location
    loc.y++
    overworld.spawnParticle("minecraft:critical_hit_emitter",player2.location)
    overworld.spawnParticle("minecraft:egg_destroy_emitter",loc)
    mc.world.playSound("tile.piston.out",player2.location)
    player2.applyKnockback(player2.location.x-location.x,player2.location.z-location.z,hStr,((player2.location.y-location.y)*vStr))
  }
}

// Custom one with critical hit particle
export function custExplosion(damage,entity,attacker,range,cause){
  // Player launch 
  const players2 = overworld.getEntities({
    type: "minecraft:player",
    location: entity.location,
    maxDistance: range,
    excludeNames: [attacker]
  })

  for (const player2 of players2){
    const loc = player2.location
    const dist = Math.sqrt((loc.x-entity.location.x)**2 + (loc.y-entity.location.y)**2 + (loc.z-entity.location.z)**2)
    overworld.spawnParticle("minecraft:critical_hit_emitter",player2.location)
    overworld.spawnParticle("minecraft:egg_destroy_emitter",loc)
    mc.world.playSound("tile.piston.out",player2.location)
    
    customDamage(Math.ceil(damage*(1-(dist/range))),player2,attacker,1,cause)
  }
}

export function standCheck(stand){
  switch (stand.nameTag){
    case "knife":
      knifeCheck(stand);
      break;
    case "Skully":
      skullyCheck(stand)
      break;
    case "Heavy Puncher":
      heavyPunching(stand)
      break;
    case "Heavy Lifter":
      heavyLifting(stand)
      break;
    case "Heavy Guard":
      heavyGuarding(stand)
      break;
    case "healZone":
      healCheck(stand)
      break;
    case "grabber":
      grabberCheck(stand)
      break;
    case "powerShot":
      powershotCheck(stand)
      break;
    case "powerExplosion":
      powerexplosionCheck(stand)
      break;
    case "bloomTop":
      flowerThrow(stand)
      break;
    case "waypoint":
      waypoint(stand)
      break;
    case "Skullyrang_1":
      skulrang(stand)
      break;
    case "kbPunching":
      knockbackPunch(stand)
      break;
    case "fBinder":
      flameBindCheck(stand)
      break;
  }
}

export function customDamage(amt,entity,attacker,range,cause,closest=1){
  // Custom damage, finding nearest player
  const players = overworld.getEntities({
    type: "minecraft:player",
    location: entity.location,
    maxDistance: range,
    closest: closest
  })

  var hit = false;

  // Gets the players

  for (const player of players){
    // Deals the damage from the attacker
    if (player.name != attacker){
      player.runCommand(`damage @s ${amt} entity_attack entity "${attacker}"`)

      // Hit animation
      try {
        const attacker2 = overworld.getEntities({type:"minecraft:player",name:attacker})[0]

        if (!attacker2.hasTag("lobby")){
          if (attacker2.getDynamicProperty("equipped.hitAnimation") > 0){
            const anim = hitAnimations[attacker2.getDynamicProperty("equipped.hitAnimation")].animation
            anim(player)
          }
        }
      }catch {}

      // Setting last hit variables for the damaged
      player.setDynamicProperty("lastHitCause",cause);
      player.setDynamicProperty("lastAttacker",attacker);
      player.setDynamicProperty("hitCheck",false);

      hit = true;
    }
  }

  return hit
}


export function launchBlocks(location,radius,strength=1){
  for (let x=-radius;x<radius;x++){
    for (let y=-radius;y<0;y++){
      for (let z=-radius;z<radius;z++){
        let distance = (x**2+y**2+z**2)**0.5
        if (distance < radius){
          let loc2 = {x:location.x+x,y:location.y+y,z:location.z+z}
          try {
            let block = overworld.getBlock(loc2).typeId;
            if (block != "minecraft:air"){
              loc2.y += 2
              let blockEnt = overworld.spawnEntity("hog:armor_stand", loc2);
              blockEnt.setRotation({x:loc2.x-location.x,y:loc2.y-location.y,z:loc2.z-location.z})
              blockEnt.addEffect("invisibility",120,{showParticles:false})
              blockEnt.nameTag = "Grumm";
              blockEnt.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${block}`)
              blockEnt.applyImpulse({x:x*(1/distance)*strength,y:0.5+Math.random(-0.25,0.25)*strength,z:(1/distance)*z*strength})
            }
          }catch {}
        }
      }
    }
  }
}

mc.world.afterEvents.projectileHitBlock.subscribe(c=> {
  const dimension = c.dimension
  const location = c.location
  const projectile = c.projectile

  if (projectile.typeId == "minecraft:egg"){
    mc.world.playSound("mob.evocation_illager.cast_spell",location)
    overworld.spawnParticle("minecraft:egg_destroy_emitter",location)
    knockback(location,6,1.4,4)
  }
})

mc.world.afterEvents.projectileHitEntity.subscribe(c=> {
  const dimension = c.dimension
  const location = c.location
  const projectile = c.projectile

  if (projectile.typeId == "minecraft:egg"){
    mc.world.playSound("mob.evocation_illager.cast_spell",location)
    overworld.spawnParticle("minecraft:egg_destroy_emitter",location)

    location.y--;
    knockback(location,6,1.4,4)
  }
})






function waypoint(wp){
  wp.clearVelocity()
  
  try {
    overworld.spawnParticle("minecraft:end_chest",wp.location)
    overworld.spawnParticle("minecraft:enchanting_table_particle",{x:wp.location.x+(Math.random()*2-1),y:wp.location.y,z:wp.location.z+(Math.random()*2-1)})

    const loc1 = wp.location
    loc1.y++
    overworld.spawnParticle("minecraft:elephant_tooth_paste_vapor_particle",loc1)

    if (tick%20==0) if (wp.runCommand("fill ~ ~2 ~ ~ ~2 ~ purple_wool [] replace air").successCount > 0) wp.runCommand("setblock ~ ~2 ~ air [] destroy")

    const rot = wp.getRotation()
    rot.y += 5
    wp.setRotation(rot)

    let rot2 = wp.getViewDirection()
    const loc = {x:wp.location.x+rot2.x,y:wp.location.y+1,z:wp.location.z+rot2.z}
    overworld.spawnParticle("minecraft:endrod",loc)
  }catch {}
}





export function getAbilitySlot(player,slot){
  if (slot > 5) return
  var part = mc.world.scoreboard.getObjective(`equip.slot${slot}`).getScore(player)
  if (part < 1){
    return
  }
  else {
    try {
      return ablList[part-1]
    }catch {
      return
    }
  }
}

export function equipAblInv(player,slot){
  if (slot > 5) return
  var part = mc.world.scoreboard.getObjective(`equip.slot${slot}`).getScore(player)
  if (part < 1){
    return "minecraft:air"
  }
  else {
    try {
      return ablList[part-1].item
    }catch {
      return "minecraft:barrier"
    }
  }
}

export function ablValue(ability){
  for (var i=0;i<ablList.length;i++){
    var abl = ablList[i]
    if (abl.name == ability){
      return i+1
    }
  }
  return 0
}


export function ablScore(value){
  if (value < 1){
    return "minecraft:air"
  }else {
    return ablList[value-1].id
  }
}

export function equipAblInvMenu(player,slot,item,ability=undefined){
  var sc = -1

  if (ability != undefined){
    sc = convToScore(ability)
  }else {
    if (item){
      sc = item
    }else {
      sc = mc.world.scoreboard.getObjective(`equip.slot${slot}`).getScore(player)
    }
  }

  
  
  switch (sc){
    case 0:
      return "textures/items/dye_powder_silver"
    case 1:
      return "textures/items/feather"
    case 2:
      return "textures/items/nether_star"
    case 3:
      return "textures/items/arrow"
    case 4:
      return "textures/items/item_frame"
    case 5:
      return "textures/items/emerald"
    case 6:
      return "textures/items/fireworks"
    case 7:
      return "textures/items/sugar"
    case 8:
      return "minecraft:anvil"
    case 9:
      return "minecraft:skull"
    case 10:
      return "textures/items/egg"
    case 11:
      return "textures/items/lead"
    case 12:
      return "textures/items/amethyst_shard"
    case 13:
      return "textures/items/flower_pot"
    case 14:
      return "textures/items/dye_powder_yellow"
    case 15:
      return "textures/items/lever"
    case 16:
      return "textures/items/iron_nugget"
    case 17:
      return "textures/items/magma_cream"
  }

  return "textures/items/stick"
}

export function convToTime(player,item){
  for (var i=0;i<ablList.length;i++){
    var abl = ablList[i]
    if (abl.item == item){
      return abl.getCooldown(player)
    }
  }

  return 0
}

export function convToCooldown(item){
  for (var i=0;i<ablList.length;i++){
    var abl = ablList[i]
    if (abl.item == item){
      return abl.cooldown
    }
  }

  return 0
}

export function getItemCount(player,item){
  return Math.ceil(convToTime(player,item))
}

export function convToLevel(player,item){
  for (var i=0;i<ablList.length;i++){
    var abl = ablList[i]
    if (abl.item == item){
      return abl.getLevel(player)
    }
  }

  return 0
}

export function convToName(player,item){
  for (var i=0;i<ablList.length;i++){
    var abl = ablList[i]
    if (abl.item == item){
      return abl.name
    }
  }

  return "None"
}

export function convToScore(item){
  for (var i=0;i<ablList.length;i++){
    var abl = ablList[i]
    if (abl.item == item){
      return i+1
    }
  }
  return 0
}

export function projectileCreate(player,entity,amount,degrees,speed,name,item,tags="",hide=true){
  // Loop for multiple projectiles
  const round = Math.floor(amount/2)
  
  for (var i=-round;i<round+1;i++){
    // Variable
    var view = player.getViewDirection()

    var rotation = player.getRotation()
    rotation.y += degrees*i;


    
    // Creating entity
    var projectile = overworld.spawnEntity(entity, {x:player.location.x+view.x/4,y:player.location.y+1,z:player.location.z+view.z/4});


    // Hide entity
    if (hide)
      projectile.addEffect("invisibility",10000,{showParticles:false})

    // Creating Item
    projectile.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${item}`)

    // Settings rotation
    projectile.setRotation(rotation)

    // Giving name
    projectile.nameTag = name

    // Setting tags
    try {
      tags.forEach(element => {
        projectile.addTag(element)
      });
    }
    catch {
      if (tags != ""){
        // If not array just add tag
        projectile.addTag(tags)
      }
    }

    // Start movement
    projectile.applyImpulse({x:projectile.getViewDirection().x*speed,y:projectile.getViewDirection().y*speed,z:projectile.getViewDirection().z*speed})
  }

  return projectile
}



export function spawnGuy(player,name){
  var view = player.getViewDirection()
  var guy = overworld.spawnEntity("hog:armor_stand", {x:player.location.x+view.x*2,y:player.location.y+view.y*2+1,z:player.location.z+view.z*2});
  guy.nameTag = name
  guy.runCommand("replaceitem entity @s slot.armor.head 0 skull")
  guy.runCommand("replaceitem entity @s slot.armor.chest 0 iron_chestplate")
  guy.runCommand("replaceitem entity @s slot.armor.legs 0 iron_leggings")
  guy.runCommand("replaceitem entity @s slot.armor.feet 0 iron_boots")
  guy.addTag(player.name)
  guy.setRotation(player.getRotation())
}