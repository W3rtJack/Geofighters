import { world } from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { damageType } from "../damageTypes"
import { addPlayerVar, bloomPot, tripleJeb } from "../abilities"


export const secret = new Achievement("secret","§l§e???",secretFind,secretReward)

function secretFind(player){
    if (!secret.get(player) && world.getDynamicProperty("mapChose") == 1){
        if (player.runCommand(`testfor @s[x=49.39,y=-59.00,z=85.54,r=1]`).successCount >= 1){
            secret.complete(player)
        }
    }
}

function secretReward(player){
    bloomPot.unlock(player);
    return `${bloomPot.name}`
}