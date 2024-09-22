import * as mc from "@minecraft/server";
import { completeArray } from "../abilities"
import { achList } from "../achievements/achievements";
import { theEnd } from "../achievements/theend";
import { saveVersion } from "../config";
import { chatRank } from "../cosmetic/chatRank";
import { deathAnimations } from "../cosmetic/deathAnim";
import { deathMessages } from "../cosmetic/deathMessage";
import { hitAnimations } from "../cosmetic/hitAnim";
import { passiveAnimations } from "../cosmetic/passiveAnim";
import { damageType } from "../damageTypes";
import { getLoadout } from "../menus/loadouts";
import { getProp } from "../menus/stats";


export function save(player){
    const j = {
        id: player.id,
        name: player.nameTag,
        version: saveVersion,
        abilities: getAbilities(player),
        loadouts: getLoadouts(player),
        stats: getStats(player),
        achievements: getAchievements(player),
        cosmetics: getCosmetics(player),
        settings: getSettings(player)
    };

    return JSON.stringify(j)
}

function getAbilities(player){
    let myList = []
    for (const abl of completeArray){
        myList.push(abl.toDict(player))
    }

    return myList    
}

function getLoadouts(player){
    let myList = []

    const l1 = getLoadout(player,1);
    const l2 = getLoadout(player,2);
    const l3 = getLoadout(player,3);
    const loadouts = [l1,l2,l3]

    for (var i1=0;i1<3;i1++){
        const loadout = {
            loadout: i1,
            slots: []
        }
        for (var i2=0;i2<5;i2++){
            loadout.slots.push({
                id: loadouts[i1][0][i2] ? loadouts[i1][0][i2] : 0,
                level: loadouts[i1][1][i2] ? loadouts[i1][1][i2] : 0,
                slot: i2
            })
        }

        myList.push(loadout)
    }

    return myList
}

function getStats(player){
    const myList = {
        kills: getProp(player,"kills"),
        money: getProp(player,"money"),
        wins: mc.world.scoreboard.getObjective("wins").getScore(player),
        deaths: getProp(player,"deaths"),
        abilityUses: getProp(player,"abilityUsed"),
        distanceTraveled: getProp(player,"walkDist"),
        jumpCount:  getProp(player,"jumpCount"),
        ctpPoints:  getProp(player,"allPoints"),
        damageType: getDamageTypeStats(player),
        extraStats: getExtraAbilityStats(player)
    }

    return myList
}

function getDamageTypeStats(player){
    const myList = []

    for (const [key, value] of Object.entries(damageType)){
        myList.push({
            type: value,
            kills: getProp(player,`${value}.kills`),
            deaths: getProp(player,`${value}.deaths`),
            hits: getProp(player,`${value}.hits`)
        })
    }

    return myList
}

function getExtraAbilityStats(player){
    const myList = {
        tpDistance: getProp(player,`Teleport.distance`),
        fireworksShot: getProp(player,"fireworksShot"),
        c4Exploded: getProp(player,"C4.exploded"),
        grabberDistance: getProp(player,"Grabber.distance"),
        chargingTime: getProp(player,"Charging Time"),
        tyronesKilled: getProp(player,"Tyrone.killed"),
        maxScorchingCombo: getProp(player,"Scorching Flame.maxCombo"),
    }

    return myList
}

function getAchievements(player){
    const myList = []

    for (const ach of achList){
        myList.push({
            id: ach.id,
            complete: ach.get(player)
        })
    }

    myList.push({
        id: theEnd.id,
        complete: theEnd.get(player)        
    })

    return myList
}

function getCosmetics(player){
    const myList = {
        hitAnims: getHitAnimations(player),
        deathMessages: getDeathMessages(player),
        deathAnims: getDeathAnimations(player),
        passiveAnims: getPassiveAnimations(player),
        chatRanks: getChatRanks(player),
        equipped: {
            chatRank: getProp(player,"equipped.hitAnimation"),
            deathMessage: getProp(player,"equipped.deathMessage"),
            deathAnim: getProp(player,"equipped.deathAnimation"),
            passiveAnim: getProp(player,"equipped.passiveAnim"),
            chatRank: getProp(player,"equipped.chat_rank")
        }
    }

    return myList
}

function getHitAnimations(player){
    const myList = []

    for (const hitAnim of hitAnimations){
        myList.push({
            id: hitAnim.id,
            unlocked: hitAnim.get(player)
        })        
    }

    return myList
}

function getDeathMessages(player){
    const myList = []

    for (var i=0; i<deathMessages.length; i++){
        myList.push({
            id: i,
            unlocked: player.getDynamicProperty(`${i}.death_msg.unlocked`)
        })        
    }

    return myList
}

function getDeathAnimations(player){
    const myList = []

    for (const deathAnim of deathAnimations){
        myList.push({
            id: deathAnim.id,
            unlocked: deathAnim.get(player)
        })        
    }

    return myList
}

function getPassiveAnimations(player){
    const myList = []

    for (const passiveAnim of passiveAnimations){
        myList.push({
            id: passiveAnim.id,
            unlocked: passiveAnim.get(player)
        })        
    }

    return myList
}

function getChatRanks(player){
    const myList = []

    for (var i=0; i<chatRank.length; i++){
        myList.push({
            id: i,
            unlocked: player.getDynamicProperty(`${i}.chat_rank.unlocked`)
        })        
    }

    return myList
}



function getSettings(player){
    const myList = {
        constantSpeed: getProp(player,"settings.constantSpeed"),
        autoRequeue: getProp(player,"settings.autoRequeue"),
        buildMode: getProp(player,"settings.buildMode"),
        rgbText: getProp(player,"settings.rainbowText")
    }

    return myList
}