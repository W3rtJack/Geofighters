import * as mc from "@minecraft/server"
import { deathAnim } from "../dataTypes";
import { addPlayerVar } from "../abilities";


export const deathAnimations = [
    new deathAnim("default","Default",nothing,"textures/items/stick"),
    new deathAnim("firework_explode","Firework Explode",firework_explode,"textures/items/fireworks"),
    new deathAnim("blood_body","Blood Body",blood_body,"textures/items/redstone_dust"),
    new deathAnim("ghost","Ghost",ghost,"textures/items/ghast_tear"),
    new deathAnim("confetti","Confetti",confetti,"textures/items/diamond"),
    new deathAnim("flicked","Flicked",flick,"textures/items/emerald")
]


function nothing(player){}

// Updating animation
const overworld = mc.world.getDimension("overworld")
export function animUpdate(){
    const blood = overworld.getEntities({
        type: "hog:armor_stand",
        tags: ["blood_body"]
    })

    blood.forEach(blod => {
        // Particles
        const loc = blod.location;
        loc.y++;
        blod.dimension.spawnParticle("hog:blood_emitter_stay",loc)

        // Movement stuff
        blod.runCommand("tp @s ~ ~ ~ facing ^0.1 ^ ^")

        // Death control
        addPlayerVar(blod,"tick",1)

        if (blod.getDynamicProperty("tick") > 100){
            blod.kill()
        }
    });

    
    const ghost = overworld.getEntities({
        type: "hog:armor_stand",
        tags: ["ghost"]
    })

    ghost.forEach(stand => {
        stand.runCommand("tp @s ~ ~0.1 ~")
        stand.addEffect("invisibility",10,{showParticles:false});

        for (var i=0;i<5;i++){
            const loc = {
                x: stand.location.x+(Math.random()-0.5),
                y: stand.location.y+(Math.random()-0.5),
                z: stand.location.z+(Math.random()-0.5)
            }
            stand.dimension.spawnParticle("minecraft:basic_smoke_particle",loc)
        }

        // Death control
        addPlayerVar(stand,"tick",1)

        if (stand.getDynamicProperty("tick") > 70){
            stand.kill()
        }
    })


    
    const flicked = overworld.getEntities({
        type: "hog:armor_stand",
        tags: ["flicked"]
    })

    flicked.forEach(flicker => {
        flicker.runCommand(`playanimation @s animation.player.riding.legs a 100`);
        var rotation = flicker.getRotation();
        rotation.y += 10;
        flicker.setRotation(rotation);
        flicker.runCommand(`tp @s ~${flicker.getDynamicProperty("dirX")*0.4} ~0.5 ~${flicker.getDynamicProperty("dirZ") * 0.4}`)

        // Death control
        addPlayerVar(flicker,"tick",1)

        const r = 2;
        const loc = flicker.location
        const dim = flicker.dimension
        const acc = 1;
        const step = 1

        try {
            for (var x=-r; x<r+step; x+=step){
                for (var z=-r; z<r+step; z+=step){
                    if (Math.round((x*x+z*z)**0.5,acc) == Math.round(r,acc)){
                        const newLoc = {x:loc.x+x,y:loc.y,z:loc.z+z}
                        dim.spawnParticle("minecraft:basic_smoke_particle",newLoc)
                        dim.spawnParticle("minecraft:elephant_tooth_paste_vapor_particle",newLoc)
                    } 
                }
            }
        }catch {}

        if (flicker.getDynamicProperty("tick") > 50){
            flicker.kill()
        }
    })



    
}


function firework_explode(player){
    const loc = player.location;
    loc.y++;
    player.dimension.spawnParticle("hog:firework_copy",loc)
    
    mc.world.playSound("conduit.attack",loc,{pitch:0.3})
}

function blood_body(player){
    const stand = player.dimension.spawnEntity("hog:armor_stand",player.location)
    stand.runCommand("replaceitem entity @s slot.armor.head 0 skull 1 1")
    stand.runCommand("replaceitem entity @s slot.armor.chest 0 leather_chestplate")
    stand.runCommand("replaceitem entity @s slot.armor.legs 0 leather_leggings 1 1")
    stand.runCommand("replaceitem entity @s slot.armor.feet 0 leather_boots 1 1")
    stand.addEffect("invisibility",100,{showParticles:false})
    stand.addTag("blood_body")
}


function ghost(player){
    const stand = player.dimension.spawnEntity("hog:armor_stand",player.location)
    stand.addTag("ghost");
    stand.addEffect("invisibility",1,{showParticles:false});
    stand.runCommand(`replaceitem entity @s slot.armor.head 0 skull 1 1`)

    const loc = player.location;
    loc.y++;
    stand.dimension.spawnParticle("minecraft:critical_hit_emitter",loc)

    mc.world.playSound("conduit.attack",loc,{pitch:0.3})
}

function confetti(player){
    const loc = player.location;
    loc.y++;
    player.dimension.spawnParticle("hog:confetti_emitter",loc)
    player.dimension.spawnParticle("hog:rainbow_emitter",loc)
    player.dimension.spawnParticle("hog:rainbow_emitter",loc)
    player.dimension.spawnParticle("hog:rainbow_emitter",loc)
    player.dimension.spawnParticle("hog:rainbow_emitter",loc)
    player.dimension.spawnParticle("hog:rainbow_emitter",loc)
    
    mc.world.playSound("raid.horn",loc,{pitch:2})
}


function flick(player){
    const stand = player.dimension.spawnEntity("hog:armor_stand",player.location)
    stand.runCommand("replaceitem entity @s slot.armor.head 0 skull 1 1")
    stand.runCommand("replaceitem entity @s slot.armor.chest 0 leather_chestplate")
    stand.runCommand("replaceitem entity @s slot.armor.legs 0 leather_leggings 1 1")
    stand.runCommand("replaceitem entity @s slot.armor.feet 0 leather_boots 1 1")
    stand.addEffect("invisibility",1000,{showParticles:false})
    stand.addTag("flicked")

    stand.setDynamicProperty("dirX",(Math.ceil(Math.random()*2) == 2 ? 1 : -1))
    stand.setDynamicProperty("dirZ",(Math.ceil(Math.random()*2) == 2 ? 1 : -1))
}