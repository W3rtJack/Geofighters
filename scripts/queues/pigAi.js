import { overworld, passList } from "../abilities";
import { tick } from "../main";
import * as mc from "@minecraft/server"
import { borderDetectionPig } from "./borderDetection";


export function pigUpdate(pig){
    // Border detection
    borderDetectionPig(pig);
    
    // Floating
    if ((tick % 20) >= 10){
        pig.runCommand("tp @s ~ ~0.1 ~ true")
    }else {
        const checkLoc = pig.location;
        checkLoc.y -= 2;
        try {
            if (passList.includes(overworld.getBlock(checkLoc).typeId)){
                pig.runCommand("tp @s ~ ~-0.5 ~ true")
            }else {
                pig.runCommand("tp @s ~ ~-0.1 ~ true")
            }
        }catch {}

        if (pig.location.y < -59){
            const cLoc = pig.location;
            cLoc.y++;

            try {
                if (!passList.includes(overworld.getBlock(checkLoc).typeId)){
                    pig.runCommand("tp @s ~ ~0.5 ~")
                }
            }catch {}
        }

        if (pig.location.y < -61){
            pig.runCommand("tp @s ~ ~0.5 ~")
        }
    }

    // Particle control
    try { if (tick % 20 === 0) pig.dimension.spawnParticle("minecraft:totem_particle",pig.location); } catch {}

    // Movement
    const stopTime = pig.getDynamicProperty("stopTime") ? pig.getDynamicProperty("stopTime") : 0
    const stop = pig.getDynamicProperty("isMoving") ? false : true
    const pigSpeed = 0.2;
    const checkDistance = 0.5;
    const maxDistance = 10;

    if (!stop){
        // Check loc for moving
        const checkLoc = {
            x: pig.location.x + pig.getViewDirection().x*checkDistance,
            y: pig.location.y + pig.getViewDirection().y*checkDistance,
            z: pig.location.z + pig.getViewDirection().z*checkDistance
        }

        // Random chance to rotate naturally
        if (Math.random()*100 >= 90){        
            
            pig.runCommand(`tp @s ~ ~ ~ facing ^${Math.random() >= 0.5 ? 10 : -10} ^ ^`)
        }

        // teleporting out of ground
        try {
            if (!passList.includes(overworld.getBlock(pig.location).typeId)){
                pig.runCommand("tp @s ~ ~1 ~")
            }
        }catch {}

        // Default pig movement
        try {
            if (passList.includes(overworld.getBlock(checkLoc).typeId)){
                // Moving forward if block is free
                pig.runCommand(`tp @s ^ ^ ^${pigSpeed}`)
            }else {
                // Rotating when reaching a block
                pig.runCommand(`tp @s ~ ~ ~ facing ^${Math.random() >= 0.5 ? 10 : -10} ^ ^`)
            }
        }catch {}
        if (Math.random()*150 >= 149){
            // Low chance to stop moving and activate teleport timer
            pig.setDynamicProperty("isMoving",false)
            pig.setDynamicProperty("stopTime",Math.ceil(Math.random()*10)*20)
        }
    }else {
        // Pig teleporting code
        pig.addVar("stopTime",-1);
        if (stopTime <= 0){
            pig.setDynamicProperty("isMoving",true)

            let tp = false;
            var attempts = 0;


            while (!tp && attempts < 30){
                // Spread pig
                const newLoc = pig.location;
                newLoc.x += ((Math.random()*2)-1)*maxDistance
                newLoc.y += ((Math.random()*1))*maxDistance
                newLoc.z += ((Math.random()*2)-1)*maxDistance

                attempts++;

                if (newLoc.y >= -58){
                    try {
                        if (passList.includes(overworld.getBlock(newLoc).typeId)){
                            const deltaX = newLoc.x - pig.location.x;
                            const deltaY = newLoc.y - pig.location.y;
                            const deltaZ = newLoc.z - pig.location.z;

                            const yawRadians = Math.atan2(deltaZ, deltaX);
                            const yawDegrees = yawRadians * (180 / Math.PI);

                            const distanceXZ = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

                            const pitchRadians = Math.atan2(deltaY, distanceXZ);
                            const pitchDegrees = pitchRadians * (180 / Math.PI);

                            const yaw = ((yawDegrees + 360) % 360);
                            const pitch = ((pitchDegrees + 360) % 360);


                            const dist = Math.sqrt((newLoc.x-pig.location.x)**2 + (newLoc.y-pig.location.y)**2 + (newLoc.z-pig.location.z)**2)

                            for (let b=0; b < dist*2; b++){
                                pig.runCommand(`execute at @s rotated ${pitch} ${yaw} positioned ^ ^ ^0.5 unless block ~ ~ ~ barrier [] run tp @s ~ ~ ~`)
                            }
                            tp = true;
                        }
                    }catch {}
                }
            }
        }
    }
}