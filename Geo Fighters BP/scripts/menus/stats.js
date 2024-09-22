import * as mc from "@minecraft/server";
import { ChestFormData } from '../extensions/forms.js';
import { damageType } from "../damageTypes.js";
import { mainMenu } from "../menus/main_menu";
import { leaderboards } from "./leaderboard.js";

// Once again just making a simple note, i have no idea why i never made comments
// Still pretty speradic with them

// I honestly really like how this system works
// However some better customisability without having to go to this file would be good
// Would help with saving e.g. using the ability func getDict and reading from that data instead
// And a new field for "extra stats" e.g. teleport distance or highest scorching flame combo
// All things ive coded but are only accessed here or in achievements?


export function stats(player){
    let stat = new ChestFormData()
      stat.title('§l§5Stats')
    stat.button(10, '§l§dTotal Stats', [
      `§r§eKills: ${getProp(player,`kills`)}`,
      `§r§cDeaths: ${getProp(player,`deaths`)}`,
      `§r§nKill/Death Ratio: ${(getProp(player,`kills`)/getProp(player,`deaths`)).toFixed(2)}`,
      `§r§6Total Ability Uses: ${getProp(player,`abilityUsed`)}`,
      `§r§6Total Distance Traveled: ${getProp(player,`walkDist`).toFixed(0)}`,
      `§r§6Total Jumps Jumped: ${getProp(player,`jumpCount`)}`
    ], "minecraft:comparator")
    stat.button(12, '§l§dAbility Stats', ["§r§l§6Click to find out more"], "textures/items/compass_item")
    stat.button(14, '§l§dGame Stats', [
      `§r§aWins: ${mc.world.scoreboard.getObjective("wins").getScore(player)}`,
      `§r§cLosses: ${mc.world.scoreboard.getObjective("gamesPlayed").getScore(player)-mc.world.scoreboard.getObjective("wins").getScore(player)}`,
      `§r§nWin/Lose Ratio: ${(mc.world.scoreboard.getObjective("wins").getScore(player)/(mc.world.scoreboard.getObjective("gamesPlayed").getScore(player)-mc.world.scoreboard.getObjective("wins").getScore(player))).toFixed(2)}`,
      `§r§eGames Played: ${mc.world.scoreboard.getObjective("gamesPlayed").getScore(player)}`,
      `§r§bTotal CTP Points: ${getProp(player,"allPoints")}`
    ], "textures/items/gold_nugget")
    stat.button(16, '§l§dLeaderboards', ["§r§l§3Click to see"], "textures/items/armor_stand")
    stat.button(26, '§l§cBack', [], "minecraft:barrier")
  
  
      stat.show(player).then(response => {
              if (response.canceled) return;
              else if (response.selection === 12) return abilityStats(player);
              else if (response.selection === 16) return leaderboards(player);
              else if (response.selection === 26) return mainMenu(player);
        else { return stats(player) }
          })
  }
  
  function abilityStats(player){
    let stat = new ChestFormData()
      stat.title('§l§5Ability Stats')
    stat.button(26, '§l§cBack', [], "minecraft:barrier")
  
    // Leap Stats
    createAbilityStats(player,stat,0,"textures/items/feather","Leap",[
      `§r§6Smoke Leap Uses: ${getProp(player,`Smoke Leap.used`)}`
    ]);
  
    // Jeb Stats
    createDamageAbility(player,stat,1,"textures/items/nether_star","Jeb Shooter",damageType.Jeb,[
      `§r§6Triple Jeb Uses: ${getProp(player,`Triple Jeb Shooter.used`)}
§r§6Jeb Rider Uses: ${getProp(player,`Jeb Rider.used`)}`
    ]);
  
    // Teleport Stats
    createAbilityStats(player,stat,2,"textures/items/arrow","Teleport",[
    `§r§6Facing Teleport Uses: ${getProp(player,`Facing Teleport.used`)}
§r§6Waypoint Teleport Uses: ${getProp(player,`Waypoint Teleport.used`)}
§r§3Total Teleport Distance: ${getProp(player,`Teleport.distance`).toFixed(0)}`
    ]);
  
    // Knife Throw Stats
    createDamageAbility(player,stat,3,"textures/items/item_frame","Knife Throw",damageType.KnifeThrow,[
      `§r§6Triple Knife Throw Uses: ${getProp(player,`Triple Knife Throw.used`)}
§r§6Homing Knife Throw Uses: ${getProp(player,`Homing Knife Throw.used`)}`
    ]);
  
    // Heal Circle Stats
    createAbilityStats(player,stat,4,"textures/items/emerald","Heal Circle",[]);
  
    // Firework Stats
    createDamageAbility(player,stat,5,"textures/items/fireworks","Fireworks Blaster",damageType.Firework,[
      `§r§6Triple Fireworks Blaster Uses: ${getProp(player,`Triple Fireworks Blaster.used`)}
§r§6MEGA Fireworks Blaster Uses: ${getProp(player,`MEGA Fireworks Blaster.used`)}
§r§3Total fireworks fired: ${getProp(player,"fireworksShot")}`
    ]);
  
    // Flash Stats
    createAbilityStats(player,stat,6,"textures/items/sugar","Flash",[]);
  
    // Heavy Punch Stats
    createDamageAbility(player,stat,7,"minecraft:anvil","Heavy Punch",damageType.HeavyPunch,[]);
  
    // Heavy Lift Stats
    createDamageAbility(player,stat,8,"minecraft:anvil","Heavy Lift",damageType.HeavyLift,[]);
  
    // Heavy Guard Stats
    createDamageAbility(player,stat,9,"minecraft:anvil","Heavy Guard",damageType.HeavyGuard,[]);
  
    // Skully Stats
    createDamageAbility(player,stat,10,"minecraft:skull","Skully",damageType.Skully,[
      `§r§6Triple Skully Uses: ${getProp(player,`Triple Skully.used`)}`
    ]);
  
    // Skullyrang Stats
    createDamageAbility(player,stat,11,"minecraft:skull","Skullyrang",damageType.Skullyrang,[]);
  
    // Rotten Launcher Stats
    createAbilityStats(player,stat,12,"textures/items/egg","Rotten Launcher",[]);
  
    // TNT Launcher Stats
    createDamageAbility(player,stat,13,"minecraft:tnt","TNT Launcher",damageType.TNT,[]);
  
    // C4 Stats
    createDamageAbility(player,stat,14,"minecraft:tnt","TNT Launcher",damageType.C4,[
      `§r§3Total C4 Placed: ${getProp(player,"C4.placed")}
§r§3Total C4 Exploded: ${getProp(player,"C4.exploded")}`
    ]);
  
    // Grabber Stats
    createAbilityStats(player,stat,15,"textures/items/lead","Grabber",[
      `§r§cHits: ${getProp(player,"Grabber.hits")}
§r§3Maximum Grabbed Distance: ${getProp(player,"Grabber.distance")}`
    ]);
  
    // Powerup Shot Stats
    createDamageAbility(player,stat,16,"textures/items/amethyst_shard","Powerup Shot",damageType.PowerShot,[
      `§r§3Time spent charging: ${getProp(player,"Charging Time").toFixed(1)}s`
    ]);
  
    // Powerup Explosion Stats
    createDamageAbility(player,stat,17,"textures/items/amethyst_shard","Powerup Explosion",damageType.PowerExplosion,[
      `§r§3Time spent charging: ${getProp(player,"Charging Time").toFixed(1)}s`
    ]);
  
    // Bloom Pot Stats
    createDamageAbility(player,stat,18,"textures/items/flower_pot","Bloom Pot",damageType.BloomPot,[]);
  
    // Knockback Punches Stats
    createDamageAbility(player,stat,19,"textures/items/dye_powder_yellow","Knockback Punches",damageType.KnockbackPunch,[]);
  
    // Turret Stats
    createDamageAbility(player,stat,20,"textures/items/lever","Turret",damageType.Turret,[
      `§r§3Turrets killed: ${getProp(player,"Tyrone.killed")}`
    ]);
  
    // Hasta La Vista Stats
    createDamageAbility(player,stat,21,"textures/items/iron_nugget","Hasta La Vista",damageType.HastaLaVista,[]);
  
    // Scorching Flame Stats
    createAbilityStats(player,stat,22,"textures/items/magma_cream","Scorching Flame",[
      `§r§cHits: ${getProp(player,"Scorching Flame.hits")}
§r§3Max Scorched Combo: ${getProp(player,"Scorching Flame.maxCombo")}`
    ]);
  
  
      stat.show(player).then(response => {
              if (response.canceled) return;
              else if (response.selection === 26) return stats(player);
        else { return abilityStats(player) }
    })
  }
  
  export function getProp(player,name){
    var prop = player.getDynamicProperty(name)
    if (!(prop >= 0)){
      return 0
    }else {
      return prop
    }
  }
  
  function createDamageAbility(player,form,slot,texture,name,DT,extras=``){
    var used = player.getDynamicProperty(`${name}.used`)
    if (!(used >= 0)) used = 0;
  
    var kills = player.getDynamicProperty(`${DT}.kills`)
    if (!(kills >= 0)) kills = 0;
  
    var deaths = player.getDynamicProperty(`${DT}.deaths`)
    if (!(deaths >= 0)) deaths = 0;
  
    var hits = player.getDynamicProperty(`${DT}.hits`)
    if (!(hits >= 0)) hits = 0;
  
    form.button(slot, name, [
      `§r§eKills: ${kills}`,
      `§r§cDeaths: ${deaths}`,
      `§r§cHits: ${hits}`,
      `§r§6${name} Uses: ${used}`,
      extras
    ],
    texture
    )
  
  }
  
function createAbilityStats(player,form,slot,texture,name,extras=``){
  var used = player.getDynamicProperty(`${name}.used`)
  if (!(used >= 0)) used = 0;

  form.button(slot, name, [
    `§r§6${name} Uses: ${used}`,
    extras
  ],
  texture
  )

}