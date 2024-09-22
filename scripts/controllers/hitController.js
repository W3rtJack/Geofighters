import * as mc from "@minecraft/server";
import { addPlayerVar } from "../abilities";
import { damageType } from "../damageTypes";


export function hitControllerUpdate(player){
    if (player.getDynamicProperty("hitCheck") == false){
        player.setDynamicProperty("hitCheck",true)
        
        mc.world.getPlayers().forEach(player2 => {
            if (player2.name == player.getDynamicProperty("lastAttacker")){
                addPlayerVar(player2,`${player.getDynamicProperty("lastHitCause")}.hits`,1)
            }
        });
    }
}