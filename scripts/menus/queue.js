import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";
import { ChestFormData } from "../extensions/forms";
import { mainMenu } from "../menus/main_menu";

export function queueMenu(player){
    const queueMain = new ChestFormData();
    queueMain.title('§l§3Queues');
    queueMain.button(12, '§l§a1v1 Queue Up', ["§7Click here to either queue up for a 1v1\nor bet on the battle to gamble your life savings away!"], "textures/items/wood_sword")
    queueMain.button(14, '§l§aFFA Queue Up', ["§7Click here to access the menu to queue up for a FFA!"], "textures/items/diamond_sword")
    queueMain.button(26, '§l§cBack', [], "minecraft:barrier")

    queueMain.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 12:
                duelMenu(player);
                break;
            case 14:
                ffaMenu(player);
                break;
            case 26:
                mainMenu(player);
                break;
        }
    })
}



export function ffaMenu(player){
    const ffaMenu = new ChestFormData();
    ffaMenu.title('§l§3Queues - FFA');
    ffaMenu.button(4, '§l§bINFORMATION', ["§7Here you can queue up for a FFA\nA FFA is where there is up to 8 players all\nin one arena fighting. The last alive wins!\nGood luck"], "textures/items/spruce_hanging_sign")

    if (player.getDynamicProperty("challenges.unlocked") == true){
        ffaMenu.button(8, '§l§bChallenges', ["§7Here you can choose special challenges\nwhich make your game harder\nin turn for a coins multiplier"], "minecraft:gold_block")
    }else {
        ffaMenu.button(8, '§l§cLocked', ["§7Unlock a specific achievement to unlock\nthis section"], "minecraft:black_wool")
    }

    let inQueue = "§7"
    for (const player of mc.world.getPlayers()){
        if (player.getDynamicProperty("ffa.queue")){
            inQueue += `§r • ${player.nameTag}\n`
        }
    }
    
    ffaMenu.button(10, '§l§bIn queue', [inQueue], "textures/items/nether_star")
    
    ffaMenu.button(12, '§l§6Join Queue', ["§7Joins the existing queue"], "textures/items/dye_powder_lime")

    const status = player.getDynamicProperty("ffa.queue") ? "§r§l§aIn Queue" : "§r§l§cNot in Queue"
    const item = player.getDynamicProperty("ffa.queue") ? "minecraft:green_wool" : "minecraft:black_wool"
    ffaMenu.button(13, '§l§6Queue Status', [`§7You are : ${status}`], item)
    ffaMenu.button(14, '§l§6Leave Queue', ["§7Leaves the existing queue"], "textures/items/dye_powder_red")

    if (mc.world.getDynamicProperty("ffa.mode") == "ffa"){
        ffaMenu.button(16,"§aFree For All",["§7Everybody fights everyone, a battle against all\nThe last alive wins"],"minecraft:grass_block")
    }else {
        ffaMenu.button(16,"§aCapture The Pig",["§7Approach the pig and gain points. First to 100 points wins"],"textures/items/egg_pig")
    }

    if (mc.world.getDynamicProperty("ffa.mode") == "ffa"){
        ffaMenu.button(16,"§aFree For All",["§7Everybody fights everyone, a battle against all\nThe last alive wins"],"minecraft:grass_block")
    }else {
        ffaMenu.button(16,"§aCapture The Pig",["§7Approach the pig and gain points. First to 100 points wins"],"textures/items/egg_pig")
    }

    if (player.hasTag("admin")){
        ffaMenu.button(18,"§l§bAdmin menu",["§7A menu only admins have access to\nto change modes and addons of the FFA"],"textures/items/comparator")
    }

    if (mc.world.getDynamicProperty("game.playing")){
        ffaMenu.button(22,"§l§bSpectate Game",["§7Spectate the current active game"],"textures/items/ender_eye")
    }

    ffaMenu.button(26, '§l§cBack', [], "minecraft:barrier")

    ffaMenu.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 4:
                ffaMenu(player);
                break;
            case 8:
                if (player.getDynamicProperty("challenges.unlocked") == true){
                    challengesMenu(player);
                }else {
                    ffaMenu(player);
                }
                break;
            case 12:
                if (mc.world.getDynamicProperty("game.playing")){
                    player.sendMessage("§cYou cannot join the queue when a game is in progress!")
                }else {
                    if (!mc.world.getDynamicProperty("queue.lock")){
                        if (player.getDynamicProperty("ffa.queue")){
                            player.sendMessage("§cYou are already in the queue!")
                        }
                        else {
                            player.sendMessage("§aYou have been added to the queue!")
                        }
                        player.setDynamicProperty("ffa.queue",true)
                    }else {
                        player.sendMessage(`§cQueue is currently locked`)
                    }
                }
                break;
            case 13:
                ffaMenu(player);
                break;
            case 14:
                if (player.getDynamicProperty("ffa.queue") != true){
                    player.sendMessage("§cYou already are not in the queue!")
                }else {

                    if (mc.world.setDynamicProperty("game.playing")){
                        player.sendMessage("§cYou cannot leave the queue whilst in a game.")
                    }else {
                        player.setDynamicProperty("ffa.queue",false)
                        player.sendMessage("§aYou have been removed from the queue.")
                    }
                }
                break;
            case 16:
                ffaMenu(player);
                break;
            case 18:
                adminMenu(player);
                break;
            case 22:
                player.runCommand("scriptevent hog:spectate")
                break;
            case 26:
                mainMenu(player);
                break;
        }
    })

}


// Left the old menu here as it may be used in future
// Was planned for release but realised my take too much time with too little of a playerbase
// After a few months this mode is sounding hella cool

var duelQueue = []
function duelMenu(player){
    const dMenu = new ChestFormData();
    dMenu.title('§l§3Queues - Duels');
    dMenu.button(26, '§l§cBack', [], "minecraft:barrier")

    dMenu.button(4, '§l§bINFORMATION', ["§7Here you can queue up for a Duel\nA duel is a 1v1 and people can bet on who wins\nWinning the bet will mean more money!"], "textures/items/spruce_hanging_sign")

    dMenu.button(12, '§l§6Join Duel', ["§7Press to join the duel"], "textures/items/dye_powder_lime")
    dMenu.button(14, '§l§6Leave Duel', ["§7Press to leave the duel"], "textures/items/dye_powder_red")

    dMenu.button(11, `§l§b${duelQueue[0] != undefined ? duelQueue[0].nameTag : "None"}`, ["§7Player 1 of the duel"], "textures/items/armor_stand")
    dMenu.button(15, `§l§b${duelQueue[1] != undefined ? duelQueue[1].nameTag : "None"}`, ["§7Player 2 of the duel"], "textures/items/armor_stand")

    dMenu.button(20, '§l§bVote P1', ["§7Press to bet on this person\nto win the duel"], "minecraft:emerald",1,player.getDynamicProperty("p1.vote") == true ? true : false)
    dMenu.button(24, '§l§bVote P2', ["§7Press to bet on this person\nto win the duel"], "minecraft:emerald",1,player.getDynamicProperty("p2.vote") == true ? true : false)

    const status = player.getDynamicProperty("duel.queue") ? "§r§l§aIn Duel" : "§r§l§cNot in Duel"
    const item = player.getDynamicProperty("duel.queue") ? "minecraft:lime_wool" : "minecraft:black_wool"
    dMenu.button(13, '§l§6Duel Status', [`§7You are : ${status}`], item)

    dMenu.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 4:
                duelMenu(player);
                break;
            case 12:
                if (duelQueue.length <= 1){
                    let includes = false;
                    duelQueue.forEach(p=> {
                        if (p.name == player.name){
                            includes = true
                        }
                    })

                    if (includes){
                        player.sendMessage("§cYou are already in the duel!")
                    }
                    else {
                        player.setDynamicProperty("duel.queue",true)
                        duelQueue.push(player)
                        player.sendMessage("§aYou have been added to the duel!")
                    }
                }else {
                    player.sendMessage("§cThe duel is currently full")
                }
                break;
            case 14:
                let icl = false;
                var i = 0;
                duelQueue.forEach(p=> {
                    if (p.icl == player.name){
                        includes = true
                        duelQueue.splice(i,1)
                    }
                    i++;
                })

                if (icl){
                    player.sendMessage("§aYou have been removed from the duel!")
                    player.setDynamicProperty("duel.queue",false)
                }
                else {
                    player.sendMessage("§cYou're aleady not in the duel!")
                }
                break;
            case 20:
                player.setDynamicProperty("p1.vote",true)
                player.setDynamicProperty("p2.vote",false)
                duelMenu(player);
                break;
            case 24:
                player.setDynamicProperty("p1.vote",false)
                player.setDynamicProperty("p2.vote",true)
                duelMenu(player);
                break;
            case 26:
                ffaMenu(player);
                break;
        }
    })
    
}

function adminMenu(player){
    const adMenu = new ChestFormData();
    adMenu.title('§l§3Queues - Admin');
    adMenu.button(26, '§l§cBack', [], "minecraft:barrier")

    
    adMenu.button(12, '§l§bAddons', ["§7A menu to change what addons and"], "minecraft:bone_meal")
    adMenu.button(13, '§l§bModes', ["§7A menu to change the mode on the FFA"], "minecraft:skull")
    adMenu.button(14, '§l§bMaps', ["§7A menu to change what map the FFA uses"], "minecraft:oak_fence")

    adMenu.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 12:
                addonsMenu(player);
                break;
            case 13:
                modesMenu(player);
                break;
            case 14:
                mapsMenu(player);
                break;
            case 26:
                ffaMenu(player);
                break;
        }
    })
    
}


function addonsMenu(player){
    const modalForm = new mcui.ModalFormData().title('FFA Modifiers');

    if (mc.world.getDynamicProperty("ffa.lives") == undefined) mc.world.setDynamicProperty("ffa.lives",1);
    if (mc.world.getDynamicProperty("ffa.extraHealth") == undefined) mc.world.setDynamicProperty("ffa.extraHealth",0);


    modalForm.slider('Amount of lives', 1, 5, 1,mc.world.getDynamicProperty("ffa.lives"));
    modalForm.slider('Amount of extra hearts', 0, 10, 2,mc.world.getDynamicProperty("ffa.extraHealth"));

    modalForm
        .show(player)
        .then(formData => {
            const results = formData.formValues;

            mc.world.setDynamicProperty("ffa.lives",results[0])
            mc.world.setDynamicProperty("ffa.extraHealth",results[1])
        })
}

function mapsMenu(player){
    const m = new ChestFormData();
    m.title('§l§3Queues - Admin - Maps');
    m.button(26, '§l§cBack', [], "minecraft:barrier")

    const equipped = mc.world.getDynamicProperty("ffa.map") >= 0 ? mc.world.getDynamicProperty("ffa.map") : 0
    m.button(10, '§l§bThe Village', [], "minecraft:spruce_log", 1, equipped == 1 ? true : false)
    m.button(12, '§l§bPlain Lands', [], "minecraft:hay_block", 1, equipped == 2 ? true : false)
    m.button(14, '§l§bFarmland', [], "minecraft:farmland", 1, equipped == 3 ? true : false)
    m.button(16, '§l§bRandom', [], "minecraft:fishing_rod", 1, equipped == 0 ? true : false)

    m.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 10:
                mc.world.setDynamicProperty("ffa.map",1)
                player.runCommand(`scriptevent hog:spawn_map 2`)
                break;
            case 12:
                mc.world.setDynamicProperty("ffa.map",2)
                player.runCommand(`scriptevent hog:spawn_map 1`)
                break;
            case 14:
                mc.world.setDynamicProperty("ffa.map",3)
                player.runCommand(`scriptevent hog:spawn_map 3`)
                break;
            case 16:
                mc.world.setDynamicProperty("ffa.map",0)
                break;
            case 26:
                adminMenu(player);
                break;
        }
    })
    
}

function modesMenu(player){
    const m = new ChestFormData();
    m.title('§l§3Queues - Admin - Mode');
    m.button(26, '§l§cBack', [], "minecraft:barrier")

    const equipped = mc.world.getDynamicProperty("ffa.mode") ? mc.world.getDynamicProperty("ffa.mode") : "random"
    m.button(11, '§l§bDefault FFA', [], "textures/items/iron_sword", 1, equipped == "ffa" ? true : false)
    m.button(13, '§l§bCapture the Pig', [], "textures/items/egg_pig", 1, equipped == "ctp" ? true : false)
    m.button(15, '§l§bRandom', [], "minecraft:fishing_rod", 1, equipped == "random" ? true : false)

    m.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 11:
                mc.world.setDynamicProperty("ffa.mode","ffa")
                modesMenu(player);
                break;
            case 13:
                mc.world.setDynamicProperty("ffa.mode","ctp")
                modesMenu(player);
                break;
            case 15:
                mc.world.setDynamicProperty("ffa.mode","random")
                modesMenu(player);
                break;
            case 26:
                adminMenu(player);
                break;
        }
    })
    
}


function challengesMenu(player){
    const challengeMenu = new ChestFormData();
    challengeMenu.title('§l§3Queues - Challenges');
    challengeMenu.button(11, '§91 Heart Challenge', ["§7You're trapped on 1 heart, for a whole round!","§62.5x Multiplier",`${player.getDynamicProperty(`challenge.1.complete`) ? "§aCompleted ✓" : "§cIncomplete"}`], player.getDynamicProperty("equipped.challenge") == 1 ? "textures/items/dye_powder_lime" : "minecraft:gold_block")
    challengeMenu.button(12, '§915 Second Killer', ["§7You must get a kill every 15 seconds otherwise you\nwill be failed the challenge!","§62.0x Multiplier",`${player.getDynamicProperty(`challenge.2.complete`) ? "§aCompleted ✓" : "§cIncomplete"}`], player.getDynamicProperty("equipped.challenge") == 2 ? "textures/items/dye_powder_lime" : "textures/items/gold_ingot")
    challengeMenu.button(13, '§9Sword Only', ["§7You have no abilities!\nYou're stuck to only using your sword.","§61.5x Multiplier",`${player.getDynamicProperty(`challenge.3.complete`) ? "§aCompleted ✓" : "§cIncomplete"}`], player.getDynamicProperty("equipped.challenge") == 3 ? "textures/items/dye_powder_lime" : "textures/items/raw_gold")
    challengeMenu.button(14, '§9No movement', ["§7Movement abilities are disabled for you\ngood luck with your trusty sprint!","§61.3x Multiplier",`${player.getDynamicProperty(`challenge.4.complete`) ? "§aCompleted ✓" : "§cIncomplete"}`], player.getDynamicProperty("equipped.challenge") == 4 ? "textures/items/dye_powder_lime" : "textures/items/gold_nugget")
    challengeMenu.button(15, '§9Snail', ["§7You wont get speed 6 when you sprint\n while this is active. :(","§61.1x Multiplier",`${player.getDynamicProperty(`challenge.5.complete`) ? "§aCompleted ✓" : "§cIncomplete"}`], player.getDynamicProperty("equipped.challenge") == 5 ? "textures/items/dye_powder_lime" : "textures/items/dye_powder_yellow")
    challengeMenu.button(16, '§9None', ["§7No changes to your gameplay.","§6No Multiplier"], !(player.getDynamicProperty("equipped.challenge") > 0) ? "textures/items/dye_powder_lime" : "textures/items/stick")
    challengeMenu.button(26, '§l§cBack', [], "minecraft:barrier")

    challengeMenu.show(player).then(response => {
		if (response.canceled) return;response.selection
        switch(response.selection){
            case 11:
                player.setDynamicProperty("equipped.challenge",1)
                challengesMenu(player);
                break;
            case 12:
                player.setDynamicProperty("equipped.challenge",2)
                challengesMenu(player);
                break;
            case 13:
                player.setDynamicProperty("equipped.challenge",3)
                challengesMenu(player);
                break;
            case 14:
                player.setDynamicProperty("equipped.challenge",4)
                challengesMenu(player);
                break;
            case 15:
                player.setDynamicProperty("equipped.challenge",5)
                challengesMenu(player);
                break;
            case 16:
                player.setDynamicProperty("equipped.challenge",0)
                challengesMenu(player);
                break;
            case 26:
                ffaMenu(player);
                break;
        }
    })
    
}