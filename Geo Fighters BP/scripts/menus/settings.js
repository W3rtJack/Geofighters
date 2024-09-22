import * as mc from "@minecraft/server";
import { ChestFormData } from "../extensions/forms";
import { mainMenu } from "../menus/main_menu";
import { reset } from "../controllers/commandsController";

// After comment, nearing release and looking back at this. its chaotic.
// Like switching between scoreboards and dynamic properties half way through
// In my defence, they werent a thing when i started the project
// Microsoft amirite chat

export function settings(player) {
	let setting = new ChestFormData()
	setting.title('§l§5Settings')
  if (mc.world.scoreboard.getObjective(`settings.comboDisplay`).getScore(player) == 0){
    setting.button(10, '§l§cCombo Display', ["§7Switch the combo display from the\nactionbar to the side of your screen","§6Actionbar"], "textures/items/gold_sword")
  }else {
    setting.button(10, '§l§aCombo Display', ["§7Switch the combo display from the\nactionbar to the side of your screen","§6Side"], "textures/items/gold_sword")
  }

  
  if (mc.world.scoreboard.getObjective(`settings.actionbar`).getScore(player) == 0){
    setting.button(11, '§l§cActionbar', ["§7Toggle actionbar on/off","§6Off"], "textures/items/paper")
  }else {
    setting.button(11, '§l§aActionbar', ["§7Toggle actionbar on/off","§6On"], "textures/items/paper")
  }

  
  if (player.getDynamicProperty("settings.constantSpeed") != true){
    setting.button(12, '§l§cConstant Speed', ["§7Toggle the speed effect always on/off","§6Off"], "textures/items/sugar")
  }else {
    setting.button(12, '§l§aConstant Speed', ["§7Toggle the speed effect always on/off","§6On"], "textures/items/sugar")
  }

  
  if (player.getDynamicProperty("settings.autoRequeue") != true){
    setting.button(13, '§l§cAuto Requeue', ["§7Automatically requeues at the end of an FFA game on/off","§6Off"], "textures/items/arrow")
  }else {
    setting.button(13, '§l§aAuto Requeue', ["§7Automatically requeues at the end of an FFA game on/off","§6On"], "textures/items/arrow")
  }

  
  if (player.getDynamicProperty("settings.buildMode") != true){
    setting.button(14, '§l§cBuild mode', ["§7Allows the user to interact with interactable blocks on/off","§6Off"], "minecraft:oak_log")
  }else {
    setting.button(14, '§l§aBuild Mode', ["§7Allows the user to interact with interactable blocks on/off","§6On"], "minecraft:oak_log")
  }

  
  if (player.getDynamicProperty("settings.rainbowText") != true){
    setting.button(15, '§l§cRainbow text', ["§7You can turn on and off any rainbow text you will see on screen on/off","§6On"], "textures/items/glowstone_dust")
  }else {
    setting.button(15, '§l§aRainbow text', ["§7You can turn on and off any rainbow text you will see on screen on/off","§6Off"], "textures/items/glowstone_dust")
  }

  
  if (player.getDynamicProperty("settings.spectateMode") != true){
    setting.button(16, '§l§cSpectate mode', ["§7Changed the way they view direction","§6Spectating players direction"], "minecraft:spyglass")
  }else {
    setting.button(16, '§l§aSpectate mode', ["§7Changed the way they view direction","§6Free direction"], "minecraft:spyglass")
  }

  
  setting.button(18, '§l§cDELETE ALL DATA', [], "textures/items/bucket_lava")

  setting.button(26, '§l§cBack', [], "minecraft:barrier")

	setting.show(player).then(response => {
			if (response.canceled) return;
      else { 
        switch(response.selection){
          case 10:
            player.runCommand("scoreboard players add @s settings.comboDisplay 1");
            player.runCommand("scoreboard players set @s[scores={settings.comboDisplay=2}] settings.comboDisplay 0");
            settings(player);
            break;
          case 11:
            player.runCommand("scoreboard players add @s settings.actionbar 1");
            player.runCommand("scoreboard players set @s[scores={settings.actionbar=2}] settings.actionbar 0");
            settings(player);
            break;
          case 12:
            const s = player.getDynamicProperty("settings.constantSpeed")
            if (s) player.setDynamicProperty("settings.constantSpeed",false)
            else player.setDynamicProperty("settings.constantSpeed",true)
            settings(player);
            break;
          case 13:
            const rq = player.getDynamicProperty("settings.autoRequeue")
            if (rq) player.setDynamicProperty("settings.autoRequeue",false)
            else player.setDynamicProperty("settings.autoRequeue",true)
            settings(player);
            break;
          case 14:
            const bm = player.getDynamicProperty("settings.buildMode")
            if (bm) player.setDynamicProperty("settings.buildMode",false)
            else player.setDynamicProperty("settings.buildMode",true)
            settings(player);
            break;
          case 15:
            const rt = player.getDynamicProperty("settings.rainbowText")
            if (rt) player.setDynamicProperty("settings.rainbowText",false)
            else player.setDynamicProperty("settings.rainbowText",true)
            settings(player);
            break;
          case 16:
            const sm = player.getDynamicProperty("settings.spectateMode")
            if (sm) player.setDynamicProperty("settings.spectateMode",false)
            else player.setDynamicProperty("settings.spectateMode",true)
            settings(player);
            break;
          case 18:
            deleteAll(player);
            break;
          case 26: mainMenu(player); break;
        }
      }
		})
};



function deleteAll(player){
	let confirmMenu = new ChestFormData("chest");
	confirmMenu.title('§l§5Settings - FULL RESET');
  confirmMenu.button(11, '§l§cYes', ["§c§lThis will delete all the abilities, achievements","§ccosmetics and stats that you have. There will be", "§cNo way to recover this!"], "minecraft:red_wool");
  confirmMenu.button(15, '§l§aNo', ["§7This will stop the choice and close the menu"], "minecraft:green_wool");
  confirmMenu.button(4,"§l§4Are you sure you want to delete ALL player data",[], "minecraft:spruce_hanging_sign");

  confirmMenu.show(player).then(response => {
    if (response.canceled) return;
    else { 
      switch(response.selection){
        case 11:
          reset(player);
          player.sendMessage("§l§cYour data has been deleted.");
          break;
        case 4:
          deleteAll(player);
          break;
      }
    }
  })
}