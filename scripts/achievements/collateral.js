import {world} from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes";


export const collateral = new Achievement("collateral","§l§eCollateral",collateralCheck,collateralReward)

// Collateral, multiple kills with one C4
// I am so confused on how to code all this


function collateralCheck(player){
    if (!collateral.get(player)){
        for (const p of world.getPlayers()){
            if (p.hasTag("dead")){
                if (p.getDynamicProperty("lastDeathAttacker") == player.name && p.getDynamicProperty("lastDeathCause") == damageType.C4){
                    player.setDynamicProperty("c4.kill.time",100);
                    player.addVar("c4.temp.kills",1)

                    if (player.getDynamicProperty("c4.temp.kills") > 2){
                        player.complete(collateral);
                    }
                }
            }
        }

        if (player.getDynamicProperty("c4.kill.time") < 0){
            player.setDynamicProperty("c4.temp.kills",0)
        }
    }
}




function collateralReward(player){
    player.setDynamicProperty("money_trail.passiveAnim.unlocked",true)
    return "Money trail passive animation unlocked"
}