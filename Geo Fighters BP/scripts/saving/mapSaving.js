import * as mc from "@minecraft/server";

// Mislabeled quarters as quaters and I'm forced to live with it
const quaters = 4

// This is a very experimental idea. Realistically would wanna save each part of the map to the structures file
// That would be manual saving.


export function slowStructureLoading(player){
    // Ticking
    player.addVar("strucTick",1);

    if ((player.getDynamicProperty("strucTick") % 5) === 0){

        // For loops
        player.addVar("strucLoad.x",1);
        if (player.getDynamicProperty("strucLoad.x") >= 4*(64/quaters)){
            player.setDynamicProperty("strucLoad.x",0)
            player.addVar("strucLoad.z",1);
        }
        if (player.getDynamicProperty("strucLoad.z") >= 4*(64/quaters)){
            player.removeTag("load")
            player.setDynamicProperty("strucLoad.z",0)
        }

        // Saving
        const start = {
            x: player.getDynamicProperty("strucLoad.x")*(64/quaters),
            y: -60,
            z: player.getDynamicProperty("strucLoad.z")*(64/quaters)
        };

        const end = {
            x: player.getDynamicProperty("strucLoad.x")+(64/quaters),
            y: 0,
            z: player.getDynamicProperty("strucLoad.z")+(64/quaters)
        };
        
        player.runCommand(`tp @s ${start.x+85} -60 ${start.z+-184}`);

        player.runCommand(`structure load "mystructure:map${player.getDynamicProperty("strucLoad.x")}${player.getDynamicProperty("strucLoad.z")}" ~${start.x} ~${start.y} ~${start.z}`)
        //mc.world.structureManager.createFromWorld(`map${x}${z}`,player.dimension,start,end,{includeBlocks:true,includeEntities:true,saveMode:"World"});

    }
}


export function slowStructuresSaving(player){
    // Ticking
    player.addVar("strucTick",1);

    if ((player.getDynamicProperty("strucTick") % 5) === 0){

        // For loops
        player.addVar("struc.x",1);
        if (player.getDynamicProperty("struc.x") >= (4*64)/quaters){
            player.setDynamicProperty("struc.x",0)
            player.addVar("struc.z",1);
        }
        if (player.getDynamicProperty("struc.z") >= (4*64)/quaters){
            player.removeTag("save")
            player.setDynamicProperty("struc.z",0)
        }
        
        // Saving
        const start = {
            x: player.getDynamicProperty("struc.x")*(64/quaters),
            y: -60,
            z: player.getDynamicProperty("struc.z")*(64/quaters)
        };

        const end = {
            x: player.getDynamicProperty("struc.x")+(64/quaters),
            y: 0,
            z: player.getDynamicProperty("struc.z")+(64/quaters)
        };
        
        player.runCommand(`tp @s ${start.x} -60 ${start.z}`);

        player.runCommand(`structure save "map${player.getDynamicProperty("struc.x")}${player.getDynamicProperty("struc.z")}" ${start.x} ${start.y} ${start.z} ${end.x} ${end.y} ${end.z}`)
        //mc.world.structureManager.createFromWorld(`map${x}${z}`,player.dimension,start,end,{includeBlocks:true,includeEntities:true,saveMode:"World"});

    }
}