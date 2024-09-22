import * as mc from "@minecraft/server";
import { spreadPlayer, spreadPlayers } from "./map_spawning";
import { addPlayerVar, getAbilitySlot, overworld } from "../abilities";
import { TconvToTime, startTest } from "./gameControlls";
import { challengeDependency, thirtyKillTime } from "./challenges";
import { convToMultiplier, giveMoney } from "./money";
import { tick } from "../main";
import { borderDetection } from "./borderDetection";
import { getAbilityData } from "../saving/dataCollection";

const secondTime = 20 // Time that a second lasts in the countdown
let maxPoints = 0; // Starting at 0 for easy setup

export function gameUpdate(){
    const t = mc.world.getDynamicProperty("game.tick")
    let p = ""
    let playerCount = 0;
    let aliveCount = 0;
    mc.world.setDynamicProperty("game.tick",t == undefined ? -1 : t+1)
    for (const player of mc.world.getPlayers()){

        if (player.hasTag("dead")) deadSpectate(player);
        if (player.getDynamicProperty("ffa.queue")){
            if (player.getDynamicProperty("ffa.alive")){
                if (t % secondTime === 0 && t < 5*secondTime && t >= 0){
                    player.runCommand(`title @s title §${convToColor(Math.floor((5*secondTime-t)/secondTime))}${Math.floor((5*secondTime-t)/secondTime)}`)
                    mc.world.playSound("random.click",player.location);
                }else if (t == 5*secondTime){
                    // Start setup
                    player.runCommand(`title @s title §l§aSTART`)
                    challengeDependency(player);
                    player.runCommand(`kill @e[tag="${player.name}"]`);
                    mc.world.scoreboard.getObjective("hlv.stored").setScore(player,0)
                    mc.world.scoreboard.getObjective("teleport.state").setScore(player,0)
                    player.setDynamicProperty("round.money",0);
                    player.setDynamicProperty("round.kills",0);
                    player.setDynamicProperty("round.timeLived",0);
                    player.setDynamicProperty("dead.time",0)
                    player.setDynamicProperty("ability.able",true);
                    player.setDynamicProperty("timeSinceLastKill",0);
                    player.setDynamicProperty("ffa.dead",false);
                    player.setDynamicProperty("ffa.lives",mc.world.getDynamicProperty("ffa.lives"));
                    if (mc.world.getDynamicProperty("ffa.mode") == "ctp"){
                        player.setDynamicProperty("ffa.lives",100)
                        if (overworld.getEntities({type:"minecraft:pig"}).length < 1){
                            const pig = overworld.spawnEntity("minecraft:pig",{x:87,y:-58,z:93});
                            pig.addTag("capture");
                        }
                    }
                    player.getComponent("health").setCurrentValue(mc.world.getDynamicProperty("ffa.extraHealth")+20)

                    player.sendMessage(`§l§dFFA Gamemode has\n§r§b-Addon-\n§a+ EXTRA HEALTH - ${mc.world.getDynamicProperty("ffa.extraHealth")} hearts\n§b-Gamemodes-\n§a+ ${(mc.world.getDynamicProperty("ffa.mode") == "ctp") ? "Capture the pig" : "FFA"}`)

                    mc.world.playSound("note.pling",player.location);

                    player.setDynamicProperty("ffa.inGame",true)
                    
                }

                if (t<5*secondTime && t>= 0){
                    // Pregam stopping + setup
                    player.runCommand(`inputpermission set @s movement disabled`)
                    player.runCommand("camera @s clear")

                    if (mc.world.getDynamicProperty("ffa.extraHealth") > 0){
                        player.addEffect("health_boost",100000,{amplifier:(mc.world.getDynamicProperty("ffa.extraHealth")/2)-1,showParticles:false})
                    }
                    player.getComponent("health").setCurrentValue(mc.world.getDynamicProperty("ffa.extraHealth")*2+20)
                    maxPoints = 0;
                }
                else {
                    // Gameplay loop
                    player.runCommand(`inputpermission set @s movement enabled`)

                    // Challenges
                    if (player.getDynamicProperty("equipped.challenge") == 1){
                        player.getComponent("health").setCurrentValue(1);
                    }

                    if (player.getDynamicProperty("equipped.challenge") == 2) thirtyKillTime(player);

                    addPlayerVar(player,"round.timeLived",1)

                    // Capture the pig points

                    if (mc.world.getDynamicProperty("ffa.mode") == "ctp"){
                        if (tick % 15 === 0){
                            if (player.runCommand("testfor @e[r=4,type=pig]").successCount > 0){
                                addPlayerVar(player,"points",1)
                                addPlayerVar(player,"allPoints",1)
                                addPlayerVar(player,"round.money",2)
                                mc.world.playSound("random.pop",player.location,{pitch:0.5})
                            }
                        }
                        // Top CTP player
                        if (player.getDynamicProperty("points") > maxPoints){
                            maxPoints = player.getDynamicProperty("points")
                            mc.world.setDynamicProperty("ctp.topPlayer",player.name)
                        }
                    }

                    // Border detection
                    if ((!player.hasTag("dead")) && (player.getDynamicProperty("ffa.alive") == true)){
                        borderDetection(player);
                    }

                    if (player.hasTag("dead")){
                        player
                    }
                }

                aliveCount++;
                p = player;
            }
            
            playerCount++
        }
    }

    if (mc.world.getDynamicProperty("game.playing")){
        if (mc.world.getDynamicProperty("ffa.mode") == "ctp"){
            if (maxPoints >= 100){
                overworld.runCommand("tp @e[type=pig] ~ ~-200 ~");
                overworld.runCommand("kill @e[type=pig]")
                for (const player of mc.world.getPlayers()){
                    if (player.getDynamicProperty("ffa.inGame")){
                        if (player.getDynamicProperty("points") >= 100){
                            addPlayerVar(player,"round.money",300)
                            mc.world.sendMessage(`§a§l${player.nameTag}§a Won the game!`)
                            mc.world.scoreboard.getObjective("wins").addScore(player,1)
                            win(player);
                            player.runCommand("title @s title §r§k;1§r §a§lVICTORY §r§k1i")
                            mc.world.playSound("random.totem",player.location);
                            player.sendMessage(`§2Round Won   §lRound stats:\n§9Klls: ${player.getDynamicProperty("round.kills")}\n§aMoney Earned: ${giveMoney(player)}\n§aMoney From Pig Points: ${player.getDynamicProperty("points")}\n§e§lMultiplier: ${convToMultiplier(player)}x\n§bTime spent alive: ${TconvToTime(Math.round(player.getDynamicProperty("round.timeLived")/20,0))}`)
                        }else {
                            if (player.getDynamicProperty("equipped.challenge") == 1) player.setDynamicProperty("ffa.challenge.complete",false)
                            player.sendMessage(`§4Round Lost   §lRound stats:\n§9Kills: ${player.getDynamicProperty("round.kills")}\n§aMoney Earned: ${giveMoney(player)}\n§aMoney From Pig Points: ${player.getDynamicProperty("points")}\n§bTime spent alive: ${TconvToTime(Math.round(player.getDynamicProperty("round.timeLived")/20,0))}`)
                        }
                        maxPoints = 0;
                        mc.world.scoreboard.getObjective("gamesPlayed").addScore(player,1)
                        player.setDynamicProperty("points",0)
                        player.setDynamicProperty("round.money",0);
                        player.setDynamicProperty("round.kills",0);
                        player.setDynamicProperty("ffa.challenge.complete",false);
                        player.runCommand("effect @s clear");
                        player.setDynamicProperty("tpCount",0);
                        player.addTag("5secondtp");
                        player.setDynamicProperty("ffa.alive",false);
                        player.setDynamicProperty("ffa.inGame",false)
                        player.setDynamicProperty("ability.able",false);

                        player.setDynamicProperty("ffa.dead",false);
                        player.runCommand("scriptevent hog:fix_camera")
                        player.removeTag("dead")
                        player.setDynamicProperty("cameraState","default")

                        endGame()
                    }
                }
                
                mc.world.setDynamicProperty("game.playing",false);
            }
            else if (aliveCount < 2){
                for (const player of mc.world.getPlayers()){
                    if (player.getDynamicProperty("ffa.inGame")){
                        player.setDynamicProperty("points",100)
                    }
                }
            }
            

        }else {
            try {
                if (aliveCount <= 1){
                    // Auto requeue
                    if (!p.getDynamicProperty("settings.autoRequeue")) p.setDynamicProperty("ffa.queue",false);

                    // Setting up and sending win message + money reward
                    addPlayerVar(p,"round.money",500)
                    mc.world.scoreboard.getObjective("wins").addScore(p,1)
                    mc.world.scoreboard.getObjective("gamesPlayed").addScore(p,1)
                    mc.world.sendMessage(`§a§l${p.nameTag}§a Won the game!`)
                    p.runCommand("title @s title §r§k;1§r §a§lVICTORY §r§k1i");
                    mc.world.playSound("random.totem",p.location);
                    p.sendMessage(`§2Round Won   §lRound stats:\n§9Kills: ${p.getDynamicProperty("round.kills")}\n§aMoney Earned: ${giveMoney(p)}\n§e§lMultiplier: ${convToMultiplier(p)}x\n§bTime spent alive: ${TconvToTime(Math.round(p.getDynamicProperty("round.timeLived")/20,0))}`)
                    
                    // Resetting all game states (really should make a mindmap there are loads that do similar things that should be merged)
                    p.setDynamicProperty("round.money",0);
                    p.setDynamicProperty("round.kills",0);
                    p.setDynamicProperty("ability.able",false);
                    p.setDynamicProperty("ffa.challenge.complete",false);
                    p.runCommand("effect @s clear");
                    p.setDynamicProperty("tpCount",0);
                    p.addTag("5secondtp");
                    p.setDynamicProperty("ffa.alive",false);
                    mc.world.setDynamicProperty("game.playing",false);
                    p.setDynamicProperty("ffa.inGame",false);


                    endGame()
                }
            }catch {}
        }
    }

    startTest(playerCount)
}

const pigPassList = [
  "minecraft:air",
  "minecraft:tallgrass",
  "minecraft:azure_bluet",
  "minecraft:green_carpet",
  "minecraft:stone_button",
  "minecraft:double_plant",
  "minecraft:green_carpet",
  "minecraft:waterlily",
  "minecraft:ladder",
  "minecraft:rail"
]

function endGame(){
    overworld.runCommand("kill @e[type=!player,type=!npc,type=!iron_golem]")

    for (const player of mc.world.getPlayers()){
        if (player.getDynamicProperty("spectate")){
            player.setDynamicProperty("spectate",false)
            player.runCommand(`scriptevent hog:spectate`)
        }
    }
}

export function win(player){
    for (var slot=1;slot<6;slot++){
        let s = getAbilitySlot(player,slot);
        
        player.addVar(`${s.name}.wins`,1)
    }
}

export function startGame(){
    // Spreading players and any other game settings
    mc.world.setDynamicProperty("game.tick",-1)
    spreadPlayers()
}

function convToColor(value){
    // Converting to color (for timer)
    if (value >= 4){
        return "4"
    }else if (value >= 2){
        return "e"
    }else {
        return "a"
    }
}


export function deadSpectate(player){
    const time = 100; // Time in ticks it spectates before respawning/leaving
    const killer = player.getDynamicProperty("lastDeathAttacker") // The killer that killed the spectating player

    // If on last life / no extra lives
    if (player.getDynamicProperty("ffa.lives") <= 1){
        player.setDynamicProperty("ffa.challenge.complete",false);
        player.setDynamicProperty("ffa.alive",false);
        player.setDynamicProperty("ffa.inGame",false)
        player.setDynamicProperty("ffa.queue",false)
        
        if (player.getDynamicProperty("dead.time") < 2){
            player.setDynamicProperty("spectate",true)
            player.setDynamicProperty("cameraState","spectate")
            player.setDynamicProperty("dead.time",2)
        }

        if (!mc.world.getDynamicProperty("game.playing")){
            addPlayerVar(player,"dead.time",1);
            if (player.getDynamicProperty("dead.time") > time){
                addPlayerVar(player,"ffa.lives",-1);
                player.removeTag("dead")
                mc.world.scoreboard.getObjective("gamesPlayed").addScore(player,1)
                player.runCommand("camera @s clear")
                player.sendMessage(`§4Round Lost   §lRound stats:\n§9Kills: ${player.getDynamicProperty("round.kills")}\n§aMoney Earned: ${giveMoney(player)}\n§bTime spent alive: ${TconvToTime(Math.round(player.getDynamicProperty("round.timeLived")/20,0))}`)
                player.setDynamicProperty("round.money",0);
                player.setDynamicProperty("round.kills",0);

                for (var slot=1;slot<6;slot++){
                    let s = getAbilitySlot(player,slot);
                    
                    player.addVar(`${s.name}.played`,1)
                }

                if (player.getDynamicProperty("settings.autoRequeue")) player.setDynamicProperty("ffa.queue",true);
            }
        }
    // Extra lives
    }else {
        if (!player.getDynamicProperty("ffa.dead")){
            if (mc.world.getDynamicProperty("ffa.mode") != "ctp") player.sendMessage(`§cYou have §l§a${player.getDynamicProperty("ffa.lives")-1} lives §r§cremaining`)
            player.setDynamicProperty("ffa.dead",true);
            player.setDynamicProperty("cameraState","tempSpectate")
            player.setDynamicProperty("dead.time",0)
            player.setDynamicProperty("targeted.player",killer.id)
        }else if (player.getDynamicProperty("dead.time") < time){
            addPlayerVar(player,"dead.time",1);

            if (mc.world.scoreboard.getObjective("settings.actionbar").getScore(player) == 0){
                player.runCommand(`title @s subtitle Respawning in ${5-Math.ceil(player.getDynamicProperty("dead.time")/20)}`)
            }
        }else {
            spreadPlayer(player);
            player.setDynamicProperty("ffa.dead",false);
            addPlayerVar(player,"ffa.lives",-1)
            player.runCommand("scriptevent hog:fix_camera")
            player.removeTag("dead")
            player.setDynamicProperty("cameraState","default")
            player.setDynamicProperty("targeted.player",undefined)

            if (mc.world.getDynamicProperty("ffa.extraHealth") > 1){
                player.addEffect("health_boost",100000,{amplifier:(mc.world.getDynamicProperty("ffa.extraHealth")/2)-1,showParticles:false})
                player.getComponent("health").setCurrentValue(20+mc.world.getDynamicProperty("ffa.extraHealth")*2)
            }

        }
    }
}