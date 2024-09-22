import * as mc from "@minecraft/server"
import { completeArray } from "../abilities"
import { deathAnimations } from "../cosmetic/deathAnim"
import { deathMessages } from "../cosmetic/deathMessage"
import { hitAnimations } from "../cosmetic/hitAnim"
import { passiveAnimations } from "../cosmetic/passiveAnim"
import { chatRank } from "../cosmetic/chatRank"
import { startSpawning } from "../queues/map_spawning"
import { startGame } from "../queues/gameLoad"
import { load } from "../saving/loading"
import { save } from "../saving/saving"


mc.system.afterEvents.scriptEventReceive.subscribe(e => {
    const player = e.sourceEntity
    if (e.id == "hog:reset"){
        reset(player)
    }
    if (e.id == "hog:give_ability"){
        const abl = e.message
        completeArray.forEach(ability=>{
          if (ability.name == abl){
              ability.unlock(player)
            }
        })
    }
    if (e.id == "hog:give_rank"){
        const abl = e.message
        player.setDynamicProperty(`${abl}.chat_rank.unlocked`,true)
        
    }
    if (e.id == "hog:give_hit_anim"){
        const abl = e.message
        hitAnimations.forEach(anim => {
            if (anim.id == abl){
                anim.unlock(player);
            }
        });
    }
    if (e.id == "hog:give_kill_anim"){
        const abl = e.message
        deathAnimations.forEach(anim => {
            if (anim.id == abl){
                anim.unlock(player);
            }
        });
    }
    if (e.id == "hog:give_all"){
        const abl = e.message
        completeArray.forEach(ability=>{
            ability.unlock(player)
        })
    }
    if (e.id == "hog:give_money"){
        player.setDynamicProperty("money",1000000)
    }
    if (e.id == "hog:unlock_all"){
        const abl = e.message
        var p = player
        if (abl != ""){
            var p = player.dimension.getEntities({
                type: "minecraft:player",
                name: abl
            })
        }

        completeArray.forEach(ability=>{
            ability.unlock(p)
        })
        
        deathAnimations.forEach(ability=>{
            ability.unlock(p)
        })
        
        for (var i=0;i<deathMessages.length;i++){
            p.setDynamicProperty(`${i}.death_msg.unlocked`,true)
        }
        
        hitAnimations.forEach(ability=>{
            ability.unlock(p)
        })
        
        passiveAnimations.forEach(ability=>{
            ability.unlock(p)
        })
        
        for (var i=0;i<chatRank.length;i++){
            player.setDynamicProperty(`${i}.chat_rank.unlocked`,true)
        }
    }
    if (e.id == "hog:spawn_map"){
        const abl = e.message
        startSpawning(player,parseInt(abl))
    }
    if (e.id == "hog:startGame"){
        startGame()
    }
    if (e.id == "hog:endGame"){
        mc.world.setDynamicProperty("game.playing",false);
    }
    if (e.id == "hog:spectate"){
        if (player.getDynamicProperty("spectate")){
            player.setDynamicProperty("spectate",false)
            player.setDynamicProperty("cameraState","default")
        }else {
            player.setDynamicProperty("spectate",true)
            player.setDynamicProperty("cameraState","spectate")
        }
        player.runCommand("camera @s clear")
    }
    if (e.id == "hog:fix_camera"){
        player.runCommand("camera @s clear")
    }
    if (e.id == "hog:glow"){
        player.setProperty("hog:glowing",true)
    }
    if (e.id == "hog:unglow"){
        player.setProperty("hog:glowing",false)
    }
    if (e.id == "hog:in_game"){
        player.setDynamicProperty("ffa.inGame",true)
    }
    if (e.id == "hog:ungame"){
        mc.world.setDynamicProperty("game.playing",false);
        player.setDynamicProperty("ffa.inGame",false)
        player.setDynamicProperty("ffa.alive",false)
    }
    if (e.id == "hog:force_queue"){
        player.setDynamicProperty("ffa.queue",true)
    }
    if (e.id == "hog:lock_queue"){
        mc.world.setDynamicProperty("queue.lock",true)
    }
    if (e.id == "hog:unlock_queue"){
        mc.world.setDynamicProperty("queue.lock",false)
    }
    if (e.id == "hog:load_data"){
        load(player,player.dimension.getEntities({type:"minecraft:iron_golem",tags:[player.id]})[0].nameTag)
    }
    if (e.id == "hog:save_data"){
        for (const c of player.dimension.getEntities({type:"minecraft:iron_golem",tags:[player.id]})){
            c.kill()
        }
        const cow = player.dimension.spawnEntity("minecraft:iron_golem",{x:-78,y:-60,z:-240});
        cow.nameTag = save(player);
        cow.addTag(player.id);
    }
    if (e.id == "hog:ability_lock"){
        if (player.getDynamicProperty("ability.able")){
            player.setDynamicProperty("ability.able",false)
        }else {
            player.setDynamicProperty("ability.able",true)
        }
    }
})


export function reset(player){
    player.clearDynamicProperties()
    player.removeTag("joined")
    mc.world.scoreboard.getObjective("money").setScore(player,0)
    mc.world.scoreboard.getObjective("wins").setScore(player,0)
    mc.world.scoreboard.getObjective("kills").setScore(player,0)
    mc.world.scoreboard.getObjective("gamesPlayed").setScore(player,0)
    mc.world.scoreboard.getObjective("equip.slot1").setScore(player,0)
    mc.world.scoreboard.getObjective("equip.slot2").setScore(player,0)
    mc.world.scoreboard.getObjective("equip.slot3").setScore(player,0)
    mc.world.scoreboard.getObjective("equip.slot4").setScore(player,0)
    mc.world.scoreboard.getObjective("equip.slot5").setScore(player,0)
    mc.world.scoreboard.getObjective("cosmetics.deathMsg").setScore(player,0)
    player.runCommand("clear")
}
  