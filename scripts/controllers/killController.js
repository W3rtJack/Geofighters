import * as mc from "@minecraft/server";
import { addPlayerVar } from "../abilities";
import { damageType } from "../damageTypes";


export function killControllerUpdate(player){
    if (player.getDynamicProperty("deathCheck") == false){
        player.setDynamicProperty("deathCheck",true)
        
        mc.world.getPlayers().forEach(player2 => {
            if (player2.name == player.getDynamicProperty("lastDeathAttacker")){
                addPlayerVar(player2,`${player.getDynamicProperty("lastDeathCause")}.kills`,1)
                addPlayerVar(player2,`kills`,1)
            }
        });

        addPlayerVar(player,`${player.getDynamicProperty("lastDeathCause")}.deaths`,1)
        addPlayerVar(player,`deaths`,1)
    }
}