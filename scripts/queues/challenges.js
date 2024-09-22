import { addPlayerVar, completeArray, convToName, convToUpgrade, equipAblInv, flash, jebRider, leap, overworld, smokeLeap, thrower, tp1, tp2, tp3 } from "../abilities.js";

try {
}catch {
}

export function challengeDependency(player){
    const movementAbilities = [
        leap,
        smokeLeap,
        jebRider,
        tp1,
        tp2,
        tp3,
        flash,
        thrower
    ]
    switch (player.getDynamicProperty("equipped.challenge")){
        case 4:
            var anyStopped = false;
            for (var slot=1;slot<6;slot++){
                let s = equipAblInv(player,slot);
                s = convToName(player,s);
                s = convToUpgrade(player,s);
                
                let cancel = false;

                movementAbilities.forEach(ability=> {
                    if (s.includes(ability.name)){
                        cancel = true
                    }
                })

                if (cancel){
                    anyStopped = true;
                    player.runCommand(`scoreboard players set @s equip.slot${slot} 0`)
                }
            };
            player.runCommand("clear @s")
            if (anyStopped) player.sendMessage(`§cSome abilities were taken off your loadout because you have the §9No Movement §cchallenge active`)
            break;
        case 3:
            var anyStopped = false;
            for (var slot=1;slot<6;slot++){
                let s = equipAblInv(player,slot);
                s = convToName(player,s);
                s = convToUpgrade(player,s);
                
                let cancel = false;

                
                completeArray.forEach(ability=> {
                    if (s.includes(ability.name)){
                        cancel = true
                    }
                })

                if (cancel){
                    anyStopped = true;
                    player.runCommand(`scoreboard players set @s equip.slot${slot} 0`)
                    player.runCommand("clear @s")
                }
            };
            if (anyStopped) player.sendMessage(`§cSome abilities were taken off your loadout because you have the §9Sword Only §cchallenge active`)
            break;
    }
}

const killTime = 30*20;

export function thirtyKillTime(player){
    if (player.getDynamicProperty("ffa.challenge.complete")){
        addPlayerVar(player,"timeSinceLastKill",1);
        const lastTime = player.getDynamicProperty("timeSinceLastKill");
        if (lastTime >= killTime){
            player.setDynamicProperty("ffa.challenge.complete",false);
            player.sendMessage(`§cLost challenge §930 second killer`)
        }
    }
}