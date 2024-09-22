import { ChestFormData } from '../extensions/forms.js';
import { achList } from "../achievements/achievements"
import { mainMenu } from "./main_menu"
import { theEnd } from '../achievements/theend.js';

const achievements = [
    ["§l§eNew Day, New World","§7Join the world of Geo Fighters\n","§aJeb Shooter + Leap","newPlayer"],
    ["§l§eThis hungergames?","§7Play your first game\n","§aKnife Throw + Free loot crate","gamePlay"],
    ["§l§eLebron James","§7Jump 500 times\n","§aBig head hit animation","jumper"],
    ["§l§eI love walking...","§7Travel 50000 blocks\n","§aWarden Roar hit animation","walker"],
    ["§l§eFinish Him","§7Get a combo of 10\n","§aFollow Direction Teleport","finishHim"],
    ["§l§eCombo King","§7Get a combo of 30\n","§aFlicked death Animation","comboKing"],
    ["§l§eGet D-D-Dunked On!","§7Get a kill using a heavy lift\n","§aDunked on Kill Message","groundPAch"],
    ["§l§eJeb Riderrrrrr","§7Ride a jeb sheep!\n","§aWorthyness From the Jeb God\n(Rainbow Chat Rank)","jebRider"],
    ["§l§eWinner Winner Chicken Dinner","§7Win 10 games","§aChallenges","mmmChicken"],
    ["§l§eFight Club","§7Rule 1. Don't talk about fight club\nRule 2. Win 50 Games","§aConfetti Death Animation","win100"],
    ["§l§eRambo 1","§7Get 100 kills","§aBlood god death message","kill100"],
    ["§l§eRambo 2","§7Get 250 kills","§aBlood body death animation","kill1000"],
    ["§l§e4th of July","§7Fire 1000 Fireworks","§aTriple Firework","1000fireworks"],
    ["§l§eKaty Perry's Dream","§7Hit players 500 times with firework abilities","§aFirework Death Animation","500fireworkhit"],
    ["§l§eIs it pride month?","§7Get 10 kills with jeb","§aTriple Jeb + $169","25killjeb"],
    ["§l§eIma chef you up, fam","§7Hit 100 players with knife throw","§aTriple Knife Throw","kt100"],
    ["§l§eAre you a flash bang?","§eBecause you stun me <3!\n§7Flashbang 20 people using a\nskully ability","§aTriple Skully","flashBang20"],
    ["§l§eHog doesn't approve","§7Gain 250 points from capturing the pig","§aHeal Circle","capture250"],
    ["§l§eGo outside.","§7Use abilities 10000 times","Comic Decal hit animation","itsSoSad"],
    ["§l§eYou found a use for this?","§7Get a kill with knockback punches","§aDirt block head","useless"],
    ["§l§eI'm fast asf boi","§7Use flash 50 times","§aNot cracked at fortnite death message","flash50"],
    ["§l§eGrabpack","§7Grab enemies with over 50 blocks","§aSkill issue death message","longGrabby"],
    ["§l§eSuper Sayian","§7Take 2 minutes of total time\nwhile charging in powerup abilities","§a[Epic Gamer] Chat Rank","chargingTime"],
    ["§l§eIt's better than black and white","§7Kill Tyrone","§aRainbow skull","poorTyrone"],
    ["§l§eAmerican Dream","§7Get 10 kills using Hasta La Vista","§aHasta La Vista 2","americanDream"]
]

const achievements2 = [
    ["§l§eLet me blow you","§7Blow up 50 tnt","§aC4","blowjob"],
    ["§l§eBlazing Glory","§7Get a combo of 10\nwhilst the enemy is in scorching flame","§aGot Redacted death message","blazingGlory"],
    ["§l§eCollateral","§7Two or more kills at once using C4","§aMoney Walk Trail","collateral"],
    ["§l§eStart of a Gacha Addiction","§7Open a loot crate","§aHeavy Punch","tutorial"],
    ["§l§eWomp Womp","§7Take your first death","§a1 Coin... (Sorry not sorry)","die"],
    ["§l§eGacha Addiction","§7Open your 10th loot crate","§a[MONEY$$] Chat Rank","genshin"],
    ["§l§eI'm High","§7Reach the height barrier","§aGhost death animation","drugs"],
    ["§l§eThe X-Factor","§7Completing all the challenges","§aRainbow Walk Trail","challenger"],
    ["§l§e???","§7This is a secret, find it to unlock the reward","§aBloom Pot","secret"],
    ["§l§eAbility Rangler","§7Have every ability unlocked","§aMega Firework + Random Ability Button","ability_rangler"],
    ["§l§eThe GEO","§7Get every achievement","§aGEO Rank","theend"]
]


export function deeds(player,page) {
    let quest = new ChestFormData()
    quest.title('§l§5Achievements')
    quest.button(26, '§l§cBack', [], "minecraft:barrier")
    var a = achievements

    if (page == 1){
        quest.button(25, '§l§cNext page', [], "textures/items/arrow")
        a = achievements
    }else {
        quest.button(25, '§l§cBack a page', [], "textures/items/arrow")
        a = achievements2
    }


    for (let i=0;i<a.length;i++){
        var ret = ""
        const achID = a[i][3]
        if (player.getDynamicProperty(achID)){
        var item = "textures/items/dye_powder_lime"
        var reward = a[i][2]
        var ret = "§aComplete"
        }else {
        var item = "textures/items/dye_powder_black_new"
        var reward = "§7???"
        for (var b=0;b<achList.length;b++){
            var ach = achList[b]
            if (ach.id == achID){
            var ret = ach.return(player)
            }
            if (achID == "theend"){
            var ret = theEnd.return(player)
            }
        }

        
        }
        quest.button(i, a[i][0], ['',a[i][1],`${ret}`,`§eReward: ${reward}`], item)
    }
	quest.show(player).then(response => {
			if (response.canceled) return;
			else if (response.selection === 25){
        if (page == 1) {
          deeds(player,2)
        }else {
          deeds(player,1)
        }
      }
			else if (response.selection === 26) return mainMenu(player);
      else { return deeds(player,page) }
	})
};