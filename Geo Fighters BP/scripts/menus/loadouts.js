import { ChestFormData } from '../extensions/forms.js';
import { forceSlot} from "../main.js";
import { equipment } from "./equipment.js"
import {equipAblInv,convToName,ablValue,convToLevel,ablScore,equipAblInvMenu} from "abilities.js";


export function loadouts(player){
	let loadoutMenu = new ChestFormData()
	loadoutMenu.title('§l§5Equipment')
  loadoutMenu.button(11, '§l§cLoadout 1', [], loadoutEmpty(player,1) ? "textures/items/wood_axe" : "textures/items/iron_axe")
  loadoutMenu.button(13, '§l§cLoadout 2', [], loadoutEmpty(player,2) ? "textures/items/wood_axe" : "textures/items/iron_axe")
  loadoutMenu.button(15, '§l§cLoadout 3', [], loadoutEmpty(player,3) ? "textures/items/wood_axe" : "textures/items/iron_axe")
  loadoutMenu.button(25, '§l§cReset Loadouts', [], "minecraft:scute")
  loadoutMenu.button(26, '§l§cBack', [], "minecraft:barrier")


    loadoutMenu.show(player).then(response => {
            if (response.canceled) return;
        else {
        switch(response.selection){
            case 11: loadoutMenu2(player,1); break;
            case 13: loadoutMenu2(player,2); break;
            case 15: loadoutMenu2(player,3); break;
            case 25: resetLoadouts(player); loadouts(player); break;
            case 26: equipment(player); break;
        }
        forceSlot(player)
        }
    })
}

function loadoutMenu2(player,loadout){
    let loadoutMenu = new ChestFormData()
	loadoutMenu.title('§l§5Equipment')
    loadoutMenu.button(4, `§l§cLoadout ${loadout}`, [`Changing loadout ${loadout}`], "minecraft:netherite_ingot")
    loadoutMenu.button(11, '§l§cSave Loadout', ["Saves the current hotbar to this loadout"], "textures/items/dye_powder_lime")
    loadoutMenu.button(15, '§l§cEquip Loadout', ["Loads the current loadout to your hotbar"], "textures/items/dye_powder_red")
    loadoutMenu.button(26, '§l§cBack', [], "minecraft:barrier")


    const LO = getLoadout(player,loadout)
    
    loadoutMenu.button(20, `§l§cLoadout ${loadout} Slot 1`, [], `${equipAblInvMenu(player,1,LO[0][0])}`)
    loadoutMenu.button(21, `§l§cLoadout ${loadout} Slot 2`, [], `${equipAblInvMenu(player,2,LO[0][1])}`)
    loadoutMenu.button(22, `§l§cLoadout ${loadout} Slot 3`, [], `${equipAblInvMenu(player,3,LO[0][2])}`)
    loadoutMenu.button(23, `§l§cLoadout ${loadout} Slot 4`, [], `${equipAblInvMenu(player,4,LO[0][3])}`)
    loadoutMenu.button(24, `§l§cLoadout ${loadout} Slot 5`, [], `${equipAblInvMenu(player,5,LO[0][4])}`)


    loadoutMenu.show(player).then(response => {
        if (response.canceled) return;
        else {
            switch(response.selection){
                case 4: loadoutMenu2(player,loadout); break;
                case 11: convertHotbarToLoadout(player,loadout); equipment(player); break;
                case 15: convertLoadoutToHotbar(player,loadout); break;
                case 26: equipment(player); break;

                case 20: loadoutMenu2(player,loadout); break;
                case 21: loadoutMenu2(player,loadout); break;
                case 22: loadoutMenu2(player,loadout); break;
                case 23: loadoutMenu2(player,loadout); break;
                case 24: loadoutMenu2(player,loadout); break;
            }
            forceSlot(player)
        }
    })
}



function resetLoadouts(player){
    player.setDynamicProperty("eq1:1",0)
    player.setDynamicProperty("eq1:2",0)
    player.setDynamicProperty("eq1:3",0)
    player.setDynamicProperty("eq1:4",0)
    player.setDynamicProperty("eq1:5",0)

    player.setDynamicProperty("eq2:1",0)
    player.setDynamicProperty("eq2:2",0)
    player.setDynamicProperty("eq2:3",0)
    player.setDynamicProperty("eq2:4",0)
    player.setDynamicProperty("eq2:5",0)

    player.setDynamicProperty("eq3:1",0)
    player.setDynamicProperty("eq3:2",0)
    player.setDynamicProperty("eq3:3",0)
    player.setDynamicProperty("eq3:4",0)
    player.setDynamicProperty("eq3:5",0)

    player.setDynamicProperty("eq1:lv1",0)
    player.setDynamicProperty("eq1:lv2",0)
    player.setDynamicProperty("eq1:lv3",0)
    player.setDynamicProperty("eq1:lv4",0)
    player.setDynamicProperty("eq1:lv5",0)

    player.setDynamicProperty("eq2:lv1",0)
    player.setDynamicProperty("eq2:lv2",0)
    player.setDynamicProperty("eq2:lv3",0)
    player.setDynamicProperty("eq2:lv4",0)
    player.setDynamicProperty("eq2:lv5",0)

    player.setDynamicProperty("eq3:lv1",0)
    player.setDynamicProperty("eq3:lv2",0)
    player.setDynamicProperty("eq3:lv3",0)
    player.setDynamicProperty("eq3:lv4",0)
    player.setDynamicProperty("eq3:lv5",0)
}
  
export function getLoadout(player,num){
    var loadout = []
    loadout[0] = player.getDynamicProperty(`eq${num}:1`)
    loadout[1] = player.getDynamicProperty(`eq${num}:2`)
    loadout[2] = player.getDynamicProperty(`eq${num}:3`)
    loadout[3] = player.getDynamicProperty(`eq${num}:4`)
    loadout[4] = player.getDynamicProperty(`eq${num}:5`)

    var levels = []
    levels[0] = player.getDynamicProperty(`eq${num}:lv1`)
    levels[1] = player.getDynamicProperty(`eq${num}:lv2`)
    levels[2] = player.getDynamicProperty(`eq${num}:lv3`)
    levels[3] = player.getDynamicProperty(`eq${num}:lv4`)
    levels[4] = player.getDynamicProperty(`eq${num}:lv5`)

    return [loadout,levels]
}

function loadoutEmpty(player,num){
    var load = getLoadout(player,num)
    for (var a=0;a<5;a++){
        if (load[0][0] != 0){
            return false;
        }
    }
    return true
}

function changeLoadout(player,num,slot,value,level){
    player.setDynamicProperty(`eq${num}:${slot}`,value)
    player.setDynamicProperty(`eq${num}:lv${slot}`,level)
}

function convertHotbarToLoadout(player,loadout){
    var slot1 = equipAblInv(player,1)
    var slot2 = equipAblInv(player,2)
    var slot3 = equipAblInv(player,3)
    var slot4 = equipAblInv(player,4)
    var slot5 = equipAblInv(player,5)

    var slot1Name = convToName(player,slot1)
    var slot2Name = convToName(player,slot2)
    var slot3Name = convToName(player,slot3)
    var slot4Name = convToName(player,slot4)
    var slot5Name = convToName(player,slot5)

    changeLoadout(player,loadout,1,ablValue(slot1Name),convToLevel(player,slot1))
    changeLoadout(player,loadout,2,ablValue(slot2Name),convToLevel(player,slot2))
    changeLoadout(player,loadout,3,ablValue(slot3Name),convToLevel(player,slot3))
    changeLoadout(player,loadout,4,ablValue(slot4Name),convToLevel(player,slot4))
    changeLoadout(player,loadout,5,ablValue(slot5Name),convToLevel(player,slot5))
}

function convertLoadoutToHotbar(player,loadout){
    var loadout = getLoadout(player,loadout);

    for (var i=0;i<5;i++){
        player.runCommand(`scoreboard players set @s equip.slot${i+1} ${loadout[0][i]}`)
        player.runCommand(`scoreboard players set @s ${ablScore(loadout[0][i])}.level ${loadout[1][i]}`)
    }
}
