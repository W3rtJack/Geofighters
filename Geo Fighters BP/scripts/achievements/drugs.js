import {} from "@minecraft/server"
import { Achievement } from "../dataTypes"


export const drugs = new Achievement("drugs","§l§eIm High",heightCheck,heightReward)

// Definitely regretting my naming principles

// Once again, not sure if minecraft will like this
// Making a bunch of achievements and regretting the debugging later


// Edit: Somehow nothing went wrong!

function heightCheck(player){
    if (!drugs.get(player)){
        if ((player.location.y + player.getVelocity().y) > 20){
            player.complete(drugs);
        }
    }
}


// Name the functions good names
// The files and visible ID's. NOPE
// Im a great developer
function heightReward(player){
    player.setDynamicProperty("ghost.deathAnimation.unlocked",true)
    return "Ghost death animations"
}