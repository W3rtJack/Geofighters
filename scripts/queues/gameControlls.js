import * as mc from "@minecraft/server";
import { gameStartLength, startingPlayerCount } from "../config";
import { overworld } from "../abilities";
import { startGame } from "./gameLoad";



export function startTest(count){
    updateScoreboard();

    if (mc.world.getDynamicProperty("game.playing") != true){
        if (mc.world.getDynamicProperty("game.countdown") != true){
            if (count >= startingPlayerCount){
                mc.world.setDynamicProperty("game.countdown",true)
                mc.world.setDynamicProperty("game.countdown.value",gameStartLength)

                mc.world.sendMessage(`§cFFA Game starting in ${gameStartLength/20}`);
            }
        }else {
            if (count < startingPlayerCount){
                mc.world.setDynamicProperty("game.countdown",false)
                mc.world.setDynamicProperty("game.countdown.value",gameStartLength)
            }else {
                mc.world.setDynamicProperty("game.countdown.value",mc.world.getDynamicProperty("game.countdown.value")-1);

                if (mc.world.getDynamicProperty("game.countdown.value") <= 0){
                    startGame();
                    mc.world.setDynamicProperty("game.countdown",false)
                    mc.world.setDynamicProperty("game.playing",true)
                }
            }
        }
    }

}



function updateScoreboard(){
    try { mc.world.scoreboard.addObjective("gameInfo")}catch {}
    mc.world.scoreboard.removeObjective("gameInfo");
    const info = mc.world.scoreboard.addObjective("gameInfo","Game Info");
    mc.world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{objective:info})
    if (mc.world.getDynamicProperty("game.countdown")){
        info.setScore(`Game Starting: ${Math.floor(mc.world.getDynamicProperty("game.countdown.value")/20)}`,1)
    }

    if (mc.world.getDynamicProperty("game.playing")){
        const t = mc.world.getDynamicProperty("game.tick")
        info.setScore(`Game Time: ${TconvToTime(Math.floor(t/20))}`,200)

        if (mc.world.getDynamicProperty("ffa.mode") == "ctp"){
            for (const player of mc.world.getPlayers()){
                if (player.getDynamicProperty("ffa.inGame")){
                    info.setScore(player,player.getDynamicProperty("points") ? player.getDynamicProperty("points") : 0)
                }
            }
        }
        
    }
}



export function TconvToTime(s){
    const mins = Math.floor(s/60);
    let seconds = s%60
    if (seconds < 10) seconds = `0${seconds}`

    return `${mins}:${seconds}`
}

export function convToTimeHD(s){
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

    return `${days}:${hours}:${mins}:${seconds}`
}