import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { addPlayerVar } from "../abilities";


export const jumper = new Achievement("jumper","§l§eLebron James",jumpCheck,jumpReward,returnJumps)

function jumpCheck(player){
    if (!jumper.get(player)){
        if (player.getDynamicProperty("jumpCount") > 500){
            jumper.complete(player);
        }
    }

    addPlayerVar(player,"jumpCool",-1)

    if (player.isJumping){
        if (player.getDynamicProperty("isJumping") != true){
            player.setDynamicProperty("isJumping",true)
            addPlayerVar(player,"jumpCount",1)
            player.setDynamicProperty("jumpCool",5)
        }
    }

    if (player.isOnGround && player.getDynamicProperty("jumpCool") < 1){
        player.setDynamicProperty("isJumping",false);
    }
}


function returnJumps(player){
    return `${player.getDynamicProperty("jumpCount") > 0 ? player.getDynamicProperty("jumpCount") : 0}/500`
}

function jumpReward(player){
    player.setDynamicProperty(`big_head.hit_anim.unlocked`,true)
    return "Big Head Hit Animation"
}