import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"
import { completeArray, fireworksBlaster3 } from "../abilities"


export const ability_rangler = new Achievement("ability_rangler","§l§eAbility Wrangler",abiltiycounting,abilityReward,returnAbilities)

function abiltiycounting(player){
    if (!ability_rangler.get(player)){
        var amount = 0;
        completeArray.forEach(c=> {
            if (c.getUnlocked(player)){
                amount++;
            }
        })

        if (player.getDynamicProperty("ability.count") == undefined) player.setDynamicProperty("ability.count",0)
        if (amount > player.getDynamicProperty("ability.count")){
            player.setDynamicProperty("ability.count",amount)
        }

        if (amount >= completeArray.length-1){
            ability_rangler.complete(player)
        }
    }
}

function returnAbilities(player){
    return `${player.getDynamicProperty(`ability.count`)}/${completeArray.length-1}`
}

function abilityReward(player){
    fireworksBlaster3.unlock(player);
    player.setDynamicProperty("random_abilities.unlocked",true);
    return `${fireworksBlaster3.name} + Random Abilities button`
}