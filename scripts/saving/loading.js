import { completeArray } from "../abilities";
import { achList } from "../achievements/achievements";
import { chatRank } from "../cosmetic/chatRank";
import { deathAnimations } from "../cosmetic/deathAnim";
import { deathMessages } from "../cosmetic/deathMessage";
import { hitAnimations } from "../cosmetic/hitAnim";
import { passiveAnimations } from "../cosmetic/passiveAnim";
import { damageType } from "../damageTypes";



export function load(player,d){
    const data = JSON.parse(d);

    loadAchievements(player,data);
    loadAbilities(player,data);
    
    loadStats(player,data);
    loadCosmetics(player,data);

    loadSettings(player,data);
}


function loadAbilities(player,data){
    const abilities = data.abilities;
    for (const abl of completeArray){
        const ablData = abilities.find((f)=>f.name == abl.name)

        if (ablData == undefined){
            player.setDynamicProperty(`${abl.name}.used`,0)

        }else {
            player.setDynamicProperty(`${abl.name}.used`,ablData.uses)
            if (ablData.unlocked){
                abl.unlock(player);
            }else {
                abl.take(player);
            }
        }
    }
}

function loadStats(player,data){
    const stats = data.stats;

    // Default stats
    player.setDynamicProperty(`kills`,stats.kills)
    player.setDynamicProperty(`money`,stats.money)
    player.setDynamicProperty(`deaths`,stats.deaths)
    player.setDynamicProperty(`abilityUsed`,stats.abilityUses)
    player.setDynamicProperty(`walkDist`,stats.distanceTraveled)
    player.setDynamicProperty(`jumpCount`,stats.jumpCount)
    player.setDynamicProperty(`allPoints`,stats.ctpPoints)
    
    // Damage type stats e.g. deaths, kills and hits
    for (const [key, value] of Object.entries(damageType)){
        const dmgTypeData = stats.damageType.find((f)=>f.type == value)

        player.setDynamicProperty(`${value}.kills`,dmgTypeData.kills)
        player.setDynamicProperty(`${value}.deaths`,dmgTypeData.deaths)
        player.setDynamicProperty(`${value}.hits`,dmgTypeData.hits)
    }

    // Other stats e.g. ability specific
    player.setDynamicProperty(`Teleport.distance`,stats.extraStats.tpDistance)
    player.setDynamicProperty(`fireworksShot`,stats.extraStats.fireworksShot)
    player.setDynamicProperty(`C4.exploded`,stats.extraStats.c4Exploded)
    player.setDynamicProperty(`Grabber.distance`,stats.extraStats.grabberDistance)
    player.setDynamicProperty(`Charging Time`,stats.extraStats.chargingTime)
    player.setDynamicProperty(`Tyrone.killed`,stats.extraStats.tyronesKilled)
    player.setDynamicProperty(`Scorching Flame.maxCombo`,stats.extraStats.maxScorchingCombo)
}


function loadAchievements(player,data){
    const achievements = data.achievements;
    
    for (const ach of achList){
        const achData = achievements.find((f)=>f.id == ach.id);

        if (achData.complete){
            player.setDynamicProperty(achData.id,true)
        }else {
            player.setDynamicProperty(achData.id,false)

        }
    }
}


function loadCosmetics(player,data){
    const cosmetics = data.cosmetics;

    // Reequipping cosmetics
    player.setDynamicProperty("equipped.hitAnimation",cosmetics.equipped.chatRank)
    player.setDynamicProperty("equipped.deathMessage",cosmetics.equipped.deathMessage)
    player.setDynamicProperty("equipped.deathAnimation",cosmetics.equipped.deathAnim)
    player.setDynamicProperty("equipped.passiveAnim",cosmetics.equipped.passiveAnim)
    player.setDynamicProperty("equipped.chat_rank",cosmetics.equipped.chatRank)
    
    // Getting hit animations
    for (const hitAnim of hitAnimations){
        const hitAnimData = cosmetics.hitAnims.find((f)=>f.id == hitAnim.id);

        if (hitAnimData.unlocked){
            hitAnim.unlock(player);
        }else {
            hitAnim.take(player);
        }
    }
    
    // Getting death animations
    for (const deathAnim of deathAnimations){
        const deathAnimData = cosmetics.deathAnims.find((f)=>f.id == deathAnim.id);

        if (deathAnimData.unlocked){
            deathAnim.unlock(player);
        }else {
            deathAnim.take(player);
        }
    }
    
    // Getting passive animations
    for (const passiveAnim of passiveAnimations){
        const passiveAnimData = cosmetics.passiveAnims.find((f)=>f.id == passiveAnim.id);

        if (passiveAnimData.unlocked){
            passiveAnim.unlock(player);
        }else {
            passiveAnim.take(player);
        }
    }
    
    // Getting death messages
    for (var i=0; i<deathMessages.length; i++){
        const deathMessageData = cosmetics.deathMessages.find((f)=>f.id == i);

        if (deathMessageData.unlocked){
            player.setDynamicProperty(`${i}.death_msg.unlocked`,true)
        }else {
            player.setDynamicProperty(`${i}.death_msg.unlocked`,false)
        }
    }
    
    // Getting chat ranks
    for (var i=0; i<chatRank.length; i++){
        const chatRankData = cosmetics.chatRanks.find((f)=>f.id == i);

        if (chatRankData.unlocked){
            player.setDynamicProperty(`${i}.chat_rank.unlocked`,true)
        }else {
            player.setDynamicProperty(`${i}.chat_rank.unlocked`,false)
        }
    }
}

function loadSettings(player,data){
    const settings = data.settings;

    player.setDynamicProperty("settings.constantSpeed",settings.constantSpeed);
    player.setDynamicProperty("settings.autoRequeue",settings.autoRequeue);
    player.setDynamicProperty("settings.buildMode",settings.buildMode);
    player.setDynamicProperty("settings.rainbowText",settings.rgbText);
}