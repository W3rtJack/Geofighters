import * as mc from "@minecraft/server";
import { ChestFormData } from "../extensions/forms";
import { addPlayerVar, crateItems, equipAblInvMenu } from "../abilities";
import { mainMenu } from "../menus/main_menu";
import { getProp } from "./stats";

const cratePrice = 1200
const weightPowerMultiplier = 2.6

export function shop(player){
    const chances = getRarityChance(player)
    const price = chances.chance.common > 0 ? cratePrice : chances.chance.rare > 0 ? cratePrice*1.25 : cratePrice*2.5
    const shop = new ChestFormData("small")
    shop.title("§l§eShop")
    const color = player.getDynamicProperty("money") >= price ? "a" : "c"
    shop.button(13,"Roll",['',"§7Roll to get a new ability!",`§${color}£${price}`,`§7(${getProp(player,"crate.spins")} Free Spins)`],"minecraft:gold_block")
    shop.button(21,"§3Common Chance",['',`§7${chances.chance.common}%`,`§7${chances.amount.common} Commons Left`],"textures/items/dye_powder_cyan")
    shop.button(22,"§dRare Chance",['',`§7${chances.chance.rare}%`,`§7${chances.amount.rare} Rares Left`],"textures/items/dye_powder_magenta")
    shop.button(23,"§6Legendary Chance",['',`§7${chances.chance.legendary}%`,`§7${chances.amount.legendary} Legendaries Left`],"textures/items/dye_powder_yellow")
    shop.button(26, '§l§cBack', [], "minecraft:barrier")

    shop.show(player).then(response => {
        if (response.canceled) return response.selection;
        switch(response.selection){
            case 13: startRoll(player); break;
            case 26: mainMenu(player); break;
        }
    })
}

function getRarityChance(player){
    const abilities = getLocked(player);

    var totalWeight = 0;
    var totalCommonWeight = 0;
    var totalRareWeight = 0;
    var totalLegendaryWeight = 0;

    var commonAmt = 0;
    var rareAmt = 0;
    var legendaryAmt = 0;

    abilities.forEach(abl=> {
        switch (abl.rarity){
            case "Common":
                totalCommonWeight += abl.weight ** weightPowerMultiplier;
                commonAmt++;
                break;
            case "Rare":
                totalRareWeight += abl.weight ** weightPowerMultiplier;
                rareAmt++;
                break;
            case "Legendary":
                totalLegendaryWeight += abl.weight ** weightPowerMultiplier;
                legendaryAmt++;
                break;
        }
    })
    totalWeight = totalCommonWeight + totalRareWeight + totalLegendaryWeight


    const commonPercent = totalCommonWeight > 0 ? ((totalCommonWeight/totalWeight)*100).toFixed(2) : 0;
    const rarePercent = totalRareWeight > 0 ? ((totalRareWeight/totalWeight)*100).toFixed(2) : 0;
    const legendaryPercent = totalLegendaryWeight > 0 ? ((totalLegendaryWeight/totalWeight)*100).toFixed(2) : 0;

    return {chance:{common:commonPercent,rare:rarePercent,legendary:legendaryPercent},amount:{common:commonAmt,rare:rareAmt,legendary:legendaryAmt}}
}

function startRoll(player){
    const chances = getRarityChance(player);
    if (!checkComplete(player)){
        const price = chances.chance.common > 0 ? cratePrice : chances.chance.rare > 0 ? cratePrice*1.25 : cratePrice*2.5
        if (player.getDynamicProperty("money") >= price){
            rolling(player);
            addPlayerVar(player,"money",-price)
        }else if (player.getDynamicProperty(`crate.spins`) >= 1){
            rolling(player);
            addPlayerVar(player,"crate.spins",-1)
        }else {
            player.runCommand(`tellraw @s { "rawtext": [{ "text": "§cYou don't have enough money to afford a crate!" }]}`)
        }
    }else {
        player.runCommand(`tellraw @s { "rawtext": [{ "text": "§cYou already have every ability you can get from these crates!!!" }]}`)
    }
}
// crateItems

function checkComplete(player){
    var got = 0;
    crateItems.forEach(item=> {
        if (item.getUnlocked(player)){
            got++;
        }
    })

    if (got >= crateItems.length){
        return true
    }else {
        return false
    }
}

function rolling(player){
    const abilities = getLocked(player);
    const rAbilities = randList(abilities);

    const theOne = getRandomFromWeight(rAbilities)


    let color = "3";

    switch (theOne.rarity){
        case "Common":
            color = "3";
            break;
        case "Rare":
            color = "d";
            break;
        case "Legendary":
            color = "6";
            break;
    }

    let block = "minecraft:iron_block";

    switch (theOne.rarity){
        case "Common":
            block = "minecraft:diamond_block";
            break;
        case "Rare":
            block = "minecraft:amethyst_block";
            break;
        case "Legendary":
            block = "minecraft:gold_block";
            break;
    };

    switch (theOne.rarity){
        case "Common":
            mc.world.playSound("hit.amethyst_block",player.location,{pitch:0.5});
            break;
        case "Rare":
            mc.world.playSound("hit.amethyst_block",player.location,{pitch:1});
            break;
        case "Legendary":
            mc.world.playSound("hit.amethyst_block",player.location,{pitch:1.5});
            break;
    };
    


    // Displaying the rewarded ability
    const abilityReturn = new ChestFormData("small");
    abilityReturn.title(`§l§eShop - §${color}${theOne.name}`);
    
    abilityReturn.button(2,'',[],block)
    abilityReturn.button(11,'',[],block)
    abilityReturn.button(20,'',[],block)
    abilityReturn.button(6,'',[],block)
    abilityReturn.button(15,'',[],block)
    abilityReturn.button(24,'',[],block)

    abilityReturn.button(22,`§l§cBack`,[],"minecraft:barrier")
    abilityReturn.button(13,`${theOne.name}`,['',`§${color}${theOne.rarity}`],equipAblInvMenu(player,1,undefined,theOne.item))

    abilityReturn.show(player).then(response => {
        if (response.canceled) return;
        shop(player);
    })


    player.shopUnlockAbility(theOne);

    addPlayerVar(player,"crate.opened",1)

    
}


function getRandomFromWeight(array){
    var totalWeight = 0
    array.forEach(abl=> {
        totalWeight += abl.weight ** weightPowerMultiplier
    })

    const rand = Math.floor(Math.random() * totalWeight )
    var cumulativeWeight = 0
    var i = -1;

    while (rand > cumulativeWeight){
        i++
        cumulativeWeight += array[i].weight ** weightPowerMultiplier
    }

    return array[i]

}

function getLocked(player){
    const returnArray = [];
    crateItems.forEach(a=> {
        if (!a.getUnlocked(player)){
            returnArray.push(a);
        }
    })

    return returnArray
}



function randList(a){
    const newArray = []
    const itemsLeft = []

    for (var i=0;i<a.length;i++){
        itemsLeft.push(i);
    }


    a.forEach(item => {
        const num = Math.floor(Math.random()*itemsLeft.length)
        newArray[itemsLeft[num]] = item
        itemsLeft.splice(num,1)
    });

    return newArray
}