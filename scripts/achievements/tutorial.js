import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { heavyPunch } from "../abilities"


export const tutorial = new Achievement("tutorial","§l§eStart of a gacha addiction",gachaCheck,gachaReward)

// Love genshin impact
// Not the worst
// But there is no literal gacha
// Just statistics show you won't go forever without getting your first legendary!

function gachaCheck(player){
    if (!tutorial.get(player)){
        if (player.getDynamicProperty("crate.opened") >= 1){
            tutorial.complete(player);
        }
    }
}


function gachaReward(player){
    heavyPunch.unlock(player);
    return `${heavyPunch.name}`
}