import * as mc from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { addPlayerVar, kt1 } from "../abilities"


export const gamePlay = new Achievement("gamePlay","§l§eThis hungergames?",gameTest,gameplayReward)

function gameTest(player){
    if (!gamePlay.get(player)){
        if (mc.world.scoreboard.getObjective("gamesPlayed").getScore(player) > 0){
            gamePlay.complete(player)
        }
    }
}

function gameplayReward(player){
    kt1.unlock(player);
    addPlayerVar(player,"crate.spins",1)
    return `${kt1.name} + 1 Free Crate Spin!`
}