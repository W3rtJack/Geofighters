import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";
import { ChestFormData } from "../extensions/forms";
import { bblSort } from "../content";
import { overworld } from "../abilities";
import { getProp, stats } from "./stats";


export function leaderboards(player){
    const l = new ChestFormData("large")
    l.title("§d§lLeaderboards")
  

    // Getting data
    const golems = overworld.getEntities({type:"minecraft:iron_golem"})

    const winsData = [];
    const killsData = [];
    const moneyData = [];

    for (const golem of golems){
        const data = JSON.parse(golem.nameTag);

        winsData.push([data.name,data.stats.wins])
        killsData.push([data.name,data.stats.kills])
        moneyData.push([data.name,data.stats.money])
    }

    const wins = bblSort(winsData);
    const kills = bblSort(killsData);
    const money  = bblSort(moneyData);

    
    // Most wins
    l.button(1,"§l§bMost Wins First Place",[],"minecraft:diamond_block",1)
    l.button(10,"§l§6Most Wins Second Place",[],"minecraft:gold_block",2)
    l.button(19,"§l§fMost Wins Third Place",[],"minecraft:iron_block",3)
  
    l.button(2,`§l§b${get(wins,0,0)}`,[`§7Wins: ${get(wins,0,1)}`],"textures/items/diamond",1)
    l.button(11,`§l§6${get(wins,1,0)}`,[`§7Wins: ${get(wins,1,1)}`],"textures/items/gold_ingot",2)
    l.button(20,`§l§f${get(wins,2,0)}`,[`§7Wins: ${get(wins,2,1)}`],"textures/items/iron_ingot",3)


    l.button(12,`§l§3Your Wins`,[`§7Wins: ${mc.world.scoreboard.getObjective("wins").getScore(player) > 0 ? mc.world.scoreboard.getObjective("wins").getScore(player) : 0}`,`§7Position: ${indexPlayer(player,wins)+1}`],"textures/items/dye_powder_lime",indexPlayer(player,wins)+1 <= 64 ? indexPlayer(player,wins)+1 : 64)
  
  
    // Most kills
    l.button(5,"§l§bMost Kills First Place",[],"minecraft:diamond_block",1)
    l.button(14,"§l§6Most Kills Second Place",[],"minecraft:gold_block",2)
    l.button(23,"§l§fMost Kills Third Place",[],"minecraft:iron_block",3)
  
    l.button(6,`§l§b${get(kills,0,0)}`,[`§7Kills: ${get(kills,0,1)}`],"textures/items/diamond",1)
    l.button(15,`§l§6${get(kills,1,0)}`,[`§7Kills: ${get(kills,1,1)}`],"textures/items/gold_ingot",2)
    l.button(24,`§l§f${get(kills,2,0)}`,[`§7Kills: ${get(kills,2,1)}`],"textures/items/iron_ingot",3)
    
    l.button(16,`§l§3Your Kills`,[`§7Kills: ${getProp(player,"kills")}`,`§7Position: ${indexPlayer(player,kills)+1}`],"textures/items/dye_powder_lime",indexPlayer(player,wins)+1 <= 64 ? indexPlayer(player,kills)+1 : 64)
  
  
    // Most money
    l.button(30,"§l§bMost Money First Place",[],"minecraft:diamond_block",1)
    l.button(39,"§l§6Most Money Second Place",[],"minecraft:gold_block",2)
    l.button(48,"§l§fMost Money Third Place",[],"minecraft:iron_block",3)
  
    l.button(31,`§l§b${get(money,0,0)}`,[`§7Money: ${get(money,0,1)}`],"textures/items/diamond",1)
    l.button(40,`§l§6${get(money,1,0)}`,[`§7Money: ${get(money,1,1)}`],"textures/items/gold_ingot",2)
    l.button(49,`§l§f${get(money,2,0)}`,[`§7Money: ${get(money,2,1)}`],"textures/items/iron_ingot",3)
    
    l.button(41,`§l§3Your Money`,[`§7Money: ${getProp(player,"money")}`,`§7Position: ${indexPlayer(player,money)+1}`],"textures/items/dye_powder_lime",indexPlayer(player,money)+1 <= 64 ? indexPlayer(player,money)+1 : 64)
  
    
    l.button(53, '§l§cBack', [], "minecraft:barrier")
  
  
    l.show(player).then(response => {
      if (response.canceled) return;
      else if (response.selection === 53) return stats(player);
      else { return leaderboards(player) }
    })
}


function indexPlayer(player,array){
    var i = 0;
    var index = -1;
    array.forEach(name => {
      if (player.nameTag == name[0]){
        index = i
      }
      i++
    });
  
    return index
}



function get(array,first,second){
  if (array[first] != undefined){
    return array[first][second]
  }else if (second == 0){
    return "None"
  }else {
    return "N/A"
  }
}