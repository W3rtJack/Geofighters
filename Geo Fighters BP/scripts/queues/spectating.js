import * as mc from "@minecraft/server";
import { addPlayerVar } from "../abilities";

export function spectate(player){
    const id = player.getDynamicProperty("spectatePlayerId") ? player.getDynamicProperty("spectatePlayerId") : 0

    const playerArray = [];

    if (player.getDynamicProperty("targeted.player") == undefined){
        for (const p of mc.world.getPlayers()){
            if (p.getDynamicProperty("ffa.queue")){
                if (p.getDynamicProperty("ffa.alive") && p.name != player.name && !p.hasTag("dead")){
                    playerArray.push(p);
                }
            }
        }
    }else {
        for (const p of mc.world.getPlayers()){
            if (p.id == player.getDynamicProperty("targeted.player")){
                if (!p.hasTag("dead")){
                    playerArray.push(p);
                }
            }
        }
    }

    for (var i = 0; i < playerArray.length; i++) {

        // Last i elements are already in place  
        for (var j = 0; j < (playerArray.length - i - 1); j++) {

            // Checking if the item at present iteration 
            // is greater than the next iteration
            if (playerArray[j].id > playerArray[j + 1].id) {

                // If the condition is true
                // then swap them
                var temp = playerArray[j]
                playerArray[j] = playerArray[j + 1]
                playerArray[j + 1] = temp
            }
        }
    }

    if (playerArray.length < 1){
        player.setDynamicProperty("spectate",false)
        player.setDynamicProperty("cameraState","default")
        player.runCommand("clear")
        return
    }

    try {
        const spectatingPlayer = playerArray[id % playerArray.length];
        player.setDynamicProperty("spectatePlayerName",spectatingPlayer.nameTag)
        player.setDynamicProperty("spectatePlayerHealth",spectatingPlayer.getComponent("health").currentValue)
        player.setDynamicProperty("spectatePlayerLives",spectatingPlayer.getDynamicProperty("ffa.lives"))


    // how about, smart spectating?
    // It changes the distance of the camera depending on blocks
    const distBack = 5;

    
    const tempEntity = spectatingPlayer.dimension.spawnEntity("minecraft:armor_stand",spectatingPlayer.location);
    tempEntity.addEffect("invisibility",100,{showParticles:false});

    // Different spectating modes, depending on how much the camera face is used
    if (player.getDynamicProperty("settings.spectateMode") != true){
        tempEntity.setRotation({
            x: spectatingPlayer.getRotation().y+180,
            y: spectatingPlayer.getRotation().x*-1-50
        });
    }else {
        tempEntity.setRotation({
            x: player.getRotation().y+180,
            y: player.getRotation().x*-1-50
        });
    }

    const rot = tempEntity.getRotation();
    const loc = tempEntity.location;
    const viewDir = tempEntity.getViewDirection();

    tempEntity.kill();

    var dist = distBack;

    // This is a pain to code for some reason
    // Best solution is using /execute to test for air blocks
    // Using logic with rotation vectors for some reason always creates slightly different results. Might be because of head positioning

    for (var i=1; i<distBack; i += 0.1){
        const newLoc = {
            x: loc.x + viewDir.y * (i),
            y: loc.y + viewDir.x * (i),
            z: loc.z + viewDir.z * (i)
        }

        if (player.runCommand(`execute as @s at "${spectatingPlayer.name}" rotated ${rot.x} ${rot.y} unless block ^ ^ ^${i} air unless block ^ ^ ^${i} stone_button unless block ^ ^ ^${i} short_grass unless block ^ ^ ^${i} tall_grass unless block ^ ^ ^${i} ladder unless block ^ ^ ^${i} green_carpet unless block ^ ^ ^${i} rail unless block ^ ^ ^${i} spruce_trapdoor unless block ^ ^ ^${i} barrier unless block ^ ^ ^${i} azure_bluet unless block ^ ^ ^${i} waterlily unless block ^ ^ ^${i} wheat unless block ^ ^ ^${i} beetroot unless block ^ ^ ^${i} potatoes unless block ^ ^ ^${i} peony run testfor @s`).successCount > 0){
            break;
        }
    }

    dist = i

    const velDist = Math.sqrt(player.getVelocity().x**2 + player.getVelocity().y ** 2 + player.getVelocity().z ** 2)


    if (dist < 2){ player.runCommand(`execute as @s at "${spectatingPlayer.name}" anchored eyes run camera "${player.name}" set minecraft:free ease 0.3 linear pos ^ ^ ^${1+velDist} facing ^ ^ ^10`)
    }else { player.runCommand(`execute as @s at "${spectatingPlayer.name}" rotated ${rot.x} ${rot.y} run camera "${player.name}" set minecraft:free ease 0.3 linear pos ^ ^ ^${dist} facing "${spectatingPlayer.name}"`) }
    }catch {}
}

// Buttons on hotbar
mc.world.beforeEvents.itemUse.subscribe(a=> {
    const player = a.source
    if (player.getDynamicProperty("spectate")){
        mc.system.run(()=>{
            const slot = player.selectedSlotIndex;
            if (slot == 3){
                if (player.getDynamicProperty("spectatePlayerId") <= 1){
                    addPlayerVar(player,"spectatePlayerId",3)

                }else {
                    addPlayerVar(player,"spectatePlayerId",-1)
                }
            }else if (slot == 4){
                player.setDynamicProperty("spectate",false)
                player.setDynamicProperty("cameraState","default")

                player.runCommand("clear")
            }else if (slot == 5){
                addPlayerVar(player,"spectatePlayerId",1)
            }

        })
    }
})