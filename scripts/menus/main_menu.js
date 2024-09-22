import * as mc from "@minecraft/server";
import { ChestFormData } from '../extensions/forms.js';
import { getProp, stats } from "./stats.js";
import { equipment } from "./equipment.js";
import { shop } from "./shop.js";
import { deeds } from "./deeds.js";
import { chestMenu } from "./chest.js";
import { ffaMenu } from "./queue.js";
import { settings } from "./settings.js";

export function mainMenu(player) {
	new ChestFormData()
		.title('§l§aMain Menu')
		.button(4, `§l§d${player.nameTag}'s Stats`, ['',
      `§r§aWins: ${mc.world.scoreboard.getObjective("wins").getScore(player)}`,
      `§r§cLosses: ${mc.world.scoreboard.getObjective("gamesPlayed").getScore(player)-mc.world.scoreboard.getObjective("wins").getScore(player)}`,
      `§r§eGames Played: ${mc.world.scoreboard.getObjective("gamesPlayed").getScore(player)}`,
      `§r§nWin/Lose Ratio: ${(mc.world.scoreboard.getObjective("wins").getScore(player)/(mc.world.scoreboard.getObjective("gamesPlayed").getScore(player)-mc.world.scoreboard.getObjective("wins").getScore(player))).toFixed(2)}`,
      `§r§2Money: ${getProp(player,"money")}`,
      `§r§eKills: ${getProp(player,"kills")}`,
      `§r§cDeaths: ${getProp(player,"deaths")}`,
      `§r§nKill/Death Ratio: ${(getProp(player,`kills`)/getProp(player,`deaths`)).toFixed(2)}`,
      `§r§6§lClick for more information`
    ], 'textures/items/iron_sword')
		.button(11, '§l§dAchievements', ['', '§r§7Find out the quests\nyou currently have active'], "textures/items/book_normal")
		.button(12, '§l§dShop', ['', '§r§7Buy items and abilities in this menu'], "textures/items/gold_ingot")
		.button(13, '§l§dEquipment', ['', '§r§7Equip different abilities and\nsets here.'], "textures/items/diamond_chestplate")
		.button(14, '§l§dChest', ['', '§r§7Equip different cosmetic effects here'], "minecraft:chest")
		.button(15, '§l§dQueues', ['', '§r§7Find out and look at your\ncurrent queues in games'], "textures/items/compass_item")
		.button(18, '§l§dTime spent', ['', '§r§7Your time spent on the GEO fighters world',`${convToTimeHD(player.getDynamicProperty("totalGameTime"))}`], "textures/items/clock_item")
		.button(22, '§l§dSettings', ['', '§r§7Idk isnt this self explanatory?'], "textures/items/arrow")
		.button(26, '§l§cBack', [], "minecraft:barrier")
		.show(player).then(response => {
			if (response.canceled) return;response.selection
      switch(response.selection){
        case 4: stats(player); break;
        case 11: deeds(player,1); break;
        case 12: shop(player); break;
        case 13: equipment(player); break;
        case 14: chestMenu(player); break;
        case 15: ffaMenu(player); break;
        case 18: mainMenu(player); break;
        case 22: settings(player); break;
        case 26: break;
      }
		})
};


// Converting to realtime hours + days
function convToTimeHD(s){
  let seconds = (s/20);
  let mins = Math.floor(seconds/60);
  let hours = Math.floor(mins/60);
  const days = Math.floor(hours/24);
  seconds = Math.floor(seconds%60)
  mins = Math.floor(mins%60)
  hours = Math.floor(hours%24)
  if (seconds < 10) seconds = `0${seconds}`
  if (mins < 10) mins = `0${mins}`
  if (hours < 10) hours = `0${hours}`

  return `${days}d : ${hours}h : ${mins}m : ${seconds}s`
}