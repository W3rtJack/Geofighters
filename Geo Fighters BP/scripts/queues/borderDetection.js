import * as mc from "@minecraft/server";

const borders = [
    [0,0,0,0],
    [32,51,97,89],
    [55,59,102,84],
    [2,2,143,143],
]

const centers = [
    {x:0,y:0,z:0},
    {x:86,y:-59,z:99},
    {x:86,y:-59,z:99},
    {x:71,y:-49,z:64}
]


export function borderDetection(player){
    const border = borders[mc.world.getDynamicProperty("mapChose")];
    const center = centers[mc.world.getDynamicProperty("mapChose")];

    if (player.runCommand(`testfor @s[x=${border[0]},z=${border[1]},dx=${border[2]},dz=${border[3]}]`).successCount < 1){
        player.runCommand(`execute as @s at @s facing ${center.x} ${center.y} ${center.z} run tp @s ^ ^ ^3 `)
    }
}

export function borderDetectionPig(player){
    const border = borders[mc.world.getDynamicProperty("mapChose")];
    const center = centers[mc.world.getDynamicProperty("mapChose")];

    if (player.runCommand(`testfor @s[x=${border[0]},z=${border[1]},dx=${border[2]},dz=${border[3]}]`).successCount < 1){
        player.runCommand(`execute as @s at @s facing ${center.x} ${center.y} ${center.z} run tp @s ^ ^ ^3 `)
    }
}