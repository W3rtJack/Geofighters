import * as mc from "@minecraft/server";
import { ChestFormData } from "../extensions/forms";
import { hitAnimations } from "../cosmetic/hitAnim";
import { mainMenu } from "../menus/main_menu";
import { deathMessageNames, deathMessages } from "../cosmetic/deathMessage";
import { deathAnimations } from "../cosmetic/deathAnim";
import { chatRank } from "../cosmetic/chatRank";
import { passiveAnimations } from "../cosmetic/passiveAnim";

export function chestMenu(player){
    const chest = new ChestFormData();
    chest.title('§l§3Chest');
    chest.button(11,"§l§dHit Animations",["\n§7Animations of when the player hits\nanother player.",`§e${getHitAnimations(player)}/${hitAnimations.length} Unlocked`],"textures/items/diamond_sword",1,true);
    chest.button(12,"§l§dDeath Messages",["\n§7Message that displays when you kill a player.",`§e${getDeathMessages(player)}/${deathMessages.length} Unlocked`],"textures/items/sign",1,true);
    chest.button(13,"§l§dDeath Animations",["\n§7Animation that plays when you kill a player.",`§e${getDeathAnimations(player)}/${deathAnimations.length} Unlocked`],"textures/items/bone",1,true);
    chest.button(14,"§l§dPassive Animation",["\n§7Animation that plays constantly.",`§e${getPassiveAnimations(player)}/${passiveAnimations.length} Unlocked`],"textures/items/flower_pot",1,true);
    chest.button(15,"§l§dChat Ranks",["\n§7Ranks that display on your name and in chat!",`§e${getCharRanks(player)}/${chatRank.length} Unlocked`],"textures/items/book_writable",1,true);
    chest.button(26, '§l§cBack', [], "minecraft:barrier")

    chest.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 11:
                hitAnimationsMenu(player);
                break;
            case 12:
                deathMessagesMenu(player);
                break;
            case 13:
                deathAnimationsMenu(player);
                break;
            case 14:
                passiveAnimationsMenu(player);
                break;
            case 15:
                chatRankMenu(player);
                break;
            case 26:
                mainMenu(player);
                break;
        }
    })
}

function hitAnimationsMenu(player){
    if (!player.getDynamicProperty(`default.hit_anim.unlocked`)){
        player.setDynamicProperty(`default.hit_anim.unlocked`,true)
        player.setDynamicProperty(`equipped.hit_anim`,0)
    }
    const chest = new ChestFormData();
    chest.title(`§l§3Chest`)
    chest.button(26, '§l§cBack', [], "minecraft:barrier")
    var a = []
    var i = 0;
    hitAnimations.forEach(anim=> {
        var item = "minecraft:black_wool"
        var name = "§l§cLocked"
        if (player.getDynamicProperty(`${anim.id}.hit_anim.unlocked`)){
            var item = anim.item
            var name = anim.displayName
        }
        if (player.getDynamicProperty("equipped.hitAnimation") == i){
            var item = "textures/items/dye_powder_lime"
            var name = anim.displayName
        }
        chest.button(i,`§l§e${name}`,[],item)
        a.push(anim)
        i++;
    });

    chest.show(player).then(response => {
		if (response.canceled) return;response.selection
        if (response.selection == 26) chestMenu(player)
        else for (var i=0;i<a.length;i++){
            if (response.selection == i){
                if (player.getDynamicProperty(`${a[i].id}.hit_anim.unlocked`)){
                    player.setDynamicProperty(`equipped.hitAnimation`,i)
                    mc.world.playSound("random.levelup",player.location,{pitch:2.5})
                }
                hitAnimationsMenu(player)
            }
        }
        
    })
}


function deathMessagesMenu(player){
    if (!player.getDynamicProperty(`0.death_msg.unlocked`)){
        player.setDynamicProperty(`0.death_msg.unlocked`,true)
        player.setDynamicProperty(`equipped.deathMessage`,0)
    }
    const chest = new ChestFormData();
    chest.title(`§l§3Chest`)
    chest.button(26, '§l§cBack', [], "minecraft:barrier")
    var i = 0;
    deathMessages.forEach(msg=> {
        var item = "minecraft:black_wool"
        var message = "§cLocked"
        if (player.getDynamicProperty(`${i}.death_msg.unlocked`)){
            var item = "textures/items/sign"
            var message = deathMessageNames[i]
        }
        if (i == 0){
            var item = "textures/items/stick"
        }
        if (player.getDynamicProperty("equipped.deathMessage") == i){
            var item = "textures/items/dye_powder_lime"
        }
        chest.button(i,`§l§e${message}`,[],item)
        i++;
    });

    chest.show(player).then(response => {
		if (response.canceled) return;response.selection
        if (response.selection == 26) chestMenu(player)
        else for (var i=0;i<deathMessages.length;i++){
            if (response.selection == i){
                if (player.getDynamicProperty(`${i}.death_msg.unlocked`)){
                    player.setDynamicProperty(`equipped.deathMessage`,i)
                    mc.world.playSound("random.levelup",player.location,{pitch:2.5})
                }
                deathMessagesMenu(player)
            }
        }
        
    })
}



function deathAnimationsMenu(player){
    if (!player.getDynamicProperty(`default.deathAnimation.unlocked`)){
        player.setDynamicProperty(`default.deathAnimation.unlocked`,true)
        player.setDynamicProperty(`equipped.deathAnimation`,"default")
    }
    const chest = new ChestFormData();
    chest.title(`§l§3Chest`)
    chest.button(26, '§l§cBack', [], "minecraft:barrier")
    var i = 0;
    var a = []
    deathAnimations.forEach(anim=> {
        var item = "minecraft:black_wool"
        var name = "§cLocked"
        if (player.getDynamicProperty(`${anim.id}.deathAnimation.unlocked`)){
            var item = anim.item;
            var name = anim.displayName;
        }
        if (player.getDynamicProperty("equipped.deathAnimation") == anim.id){
            var item = "textures/items/dye_powder_lime"
        }
        chest.button(i,`§l§e${name}`,[],item)
        i++;
        a.push(anim.id)
    });

    chest.show(player).then(response => {
		if (response.canceled) return;response.selection
        if (response.selection == 26) chestMenu(player)
        else for (var i=0;i<a.length;i++){
            if (response.selection == i){
                if (player.getDynamicProperty(`${a[i]}.deathAnimation.unlocked`)){
                    player.setDynamicProperty(`equipped.deathAnimation`,a[i])
                    mc.world.playSound("random.levelup",player.location,{pitch:2.5})
                }
                deathAnimationsMenu(player)
            }
        }
        
    })
}

function chatRankMenu(player){
    if (!player.getDynamicProperty(`0.chat_rank.unlocked`)){
        player.setDynamicProperty(`0.chat_rank.unlocked`,true)
        player.setDynamicProperty(`equipped.chat_rank`,0)
    }
    const chest = new ChestFormData();
    chest.title(`§l§3Chest`)
    chest.button(26, '§l§cBack', [], "minecraft:barrier")
    var i = 0;
    chatRank.forEach(msg=> {
        var item = "minecraft:black_wool"
        var message = "§cLocked"
        if (player.getDynamicProperty(`${i}.chat_rank.unlocked`)){
            var item = "textures/items/sign"
            var message = chatRank[i]
        }
        if (msg == ""){
            var message = "Default"
            var item = "textures/items/stick"
        }
        if (player.getDynamicProperty("equipped.chat_rank") == i){
            var item = "textures/items/dye_powder_lime"
        }
        chest.button(i,`§l§e${message}`,[],item)
        i++;
    });

    chest.show(player).then(response => {
		if (response.canceled) return;response.selection
        if (response.selection == 26) chestMenu(player)
            if (player.getDynamicProperty(`${response.selection}.chat_rank.unlocked`)){
                if (i > 0){
                    player.nameTag = `${chatRank[response.selection]} ${player.name}§r`
                }else {
                    player.nameTag = player.name
                }
                player.setDynamicProperty(`equipped.chat_rank`,response.selection)
                mc.world.playSound("random.levelup",player.location,{pitch:2.5})
            }
            chatRankMenu(player)
        
    })
}



function passiveAnimationsMenu(player){
    const chest = new ChestFormData();
    chest.title(`§l§3Chest`)
    chest.button(26, '§l§cBack', [], "minecraft:barrier")
    var i = 0;
    var a = []
    passiveAnimations.forEach(anim=> {
        var item = "minecraft:black_wool"
        var name = "§cLocked"
        if (player.getDynamicProperty(`${anim.id}.passiveAnim.unlocked`)){
            var item = anim.item;
            var name = anim.displayName;
        }
        if (player.getDynamicProperty("equipped.passiveAnim") == anim.id){
            var item = "textures/items/dye_powder_lime"
        }
        chest.button(i,`§l§e${name}`,[],item)
        i++;
        a.push(anim.id)
    });

    chest.show(player).then(response => {
		if (response.canceled) return;response.selection
        if (response.selection == 26) chestMenu(player)
        else for (var i=0;i<a.length;i++){
            if (response.selection == i){
                if (player.getDynamicProperty(`${a[i]}.passiveAnim.unlocked`)){
                    player.runCommand(`replaceitem entity @s slot.armor.head 0 air`)
                    player.setDynamicProperty(`equipped.passiveAnim`,a[i])
                    mc.world.playSound("random.levelup",player.location,{pitch:2.5})
                }
                passiveAnimationsMenu(player)
            }
        }
        
    })
}


function getHitAnimations(player){
    var unlocked = 0;
    hitAnimations.forEach(anim=> {
        if (player.getDynamicProperty(`${anim.id}.hit_anim.unlocked`)){
            unlocked++;
        }
    })

    return unlocked
}


function getDeathMessages(player){
    var unlocked = 0;
    var i = 0;
    deathMessages.forEach(msg=> {
        if (player.getDynamicProperty(`${i}.death_msg.unlocked`)){
            unlocked++;
        }
        i++
    })

    return unlocked
}


function getDeathAnimations(player){
    var unlocked = 0;
    deathAnimations.forEach(anim=> {
        // WHY IS THIS IN CAMEL CAPS AND EVERYTHING ELSE IS UNDERSCORESSSS!!!!
        if (player.getDynamicProperty(`${anim.id}.deathAnimation.unlocked`)){
            unlocked++;
        }
    })

    return unlocked
}


function getCharRanks(player){
    var unlocked = 0;
    var i = 0;
    chatRank.forEach(msg=> {
        if (player.getDynamicProperty(`${i}.chat_rank.unlocked`)){
            unlocked++;
        }
        i++
    })

    return unlocked
}


function getPassiveAnimations(player){
    var unlocked = 0;
    passiveAnimations.forEach(anim=> {
        // WHY IS THIS IN CAMEL CAPS AND EVERYTHING ELSE IS UNDERSCORESSSS!!!!
        if (player.getDynamicProperty(`${anim.id}.passiveAnim.unlocked`)){
            unlocked++;
        }
    })

    return unlocked
}



