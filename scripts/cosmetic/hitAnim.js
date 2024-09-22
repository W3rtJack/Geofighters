import * as mc from "@minecraft/server"
import { hitAnim } from "../dataTypes";


export const hitAnimations = [
    new hitAnim("default","Default",blank,"textures/items/stick"),
    new hitAnim("big_head","Big Head",bigHead,"minecraft:skull"),
    new hitAnim("warden_roar","Warden Roar",wardenRoar,"minecraft:warden_spawn_egg"),
    new hitAnim("comic_decal","Comic Decal",comicDecal,"minecraft:tnt")
]

function blank(player){}

function bigHead(player){
    player.runCommand(`playanimation @s animation.humanoid.big_head a 0.25`)
}

function wardenRoar(player){
    player.runCommand(`playanimation @s animation.warden.roar a 0.1`)
}

var comicIter = 0
function comicDecal(player){
    const comicList = [
        "WAP",
        "BAP",
        "BOOM",
        "POW",
        "SHAM",
        "BLAM",
        "SLAM"
    ]

    const comicColor = [
        "e", "a", "b", "d", "f"
    ]

    const rand1 = Math.floor(Math.random()*comicList.length)
    const rand2 = Math.random()*100
    comicIter = (comicIter+1)%comicColor.length;

    var word = ""
    const color = comicColor[comicIter]


    if (rand2 > 1){
        word = comicList[rand1]
    }else {
        word = "✦L-BOZO✦"
    }


    
    const loc = player.location;
    loc.y += 1.3;
    loc.x += Math.random()-0.5
    loc.z += Math.random()-0.5
    const text = player.dimension.spawnEntity("hog:floating_text",loc)
    text.nameTag = `§${color}§l${word}!`
}