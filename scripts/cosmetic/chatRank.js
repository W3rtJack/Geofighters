import * as mc from "@minecraft/server"
import { } from "../dataTypes";


export const chatRank = [
    "",
    "§p[§eR§ea§ai§bn§db§9o§sw§p]",
    "§d[Epic Gamer]",
    "§2[Money$$]",
    "§6[GEO]"
]

export const privateChatRank = []



const rainbowColors = ["c","e","a","b","d","9","s"]
const hoggyWoggyColors = ["2","2","2","2","2","2","c","2","2","2","2","2"]


mc.world.beforeEvents.chatSend.subscribe(a=> {
    a.cancel = true;
    const msg = a.message;
    const player = a.sender;

    if (player.getDynamicProperty("equipped.chat_rank") == 5){
        mc.world.sendMessage(`§2[Freaky] ${freakify(player.name)} : ${freakify(msg)}`)
    }else

    if (player.getDynamicProperty("equipped.chat_rank") != chatRank.indexOf("§p[§eR§ea§ai§bn§db§9o§sw§p]")){
        mc.world.sendMessage(`${player.nameTag} : ${msg}`)
    }else {
        for (const p of mc.world.getPlayers()){
            if (p.getDynamicProperty("settings.rainbowText") != true){
                p.sendMessage(`§c${chatRank[chatRank.indexOf("§p[§eR§ea§ai§bn§db§9o§sw§p]")]}§p ${rainbowify(player.name)} : ${rainbowify(msg)}`)
            }else {
                p.sendMessage(`${player.nameTag} : ${msg}`)
            }
        }
    }
})



export function rainbowify(string){
    var m = "";
    var i = 0;
    string.split("").forEach(letter=> {
        i++;
        m += "§"+rainbowColors[i%rainbowColors.length]+letter
    })
    return m
}


export function freakify(string){
    var m = "";
    var i = 0;
    string.split("").forEach(letter=> {
        i++;
        m += "§"+hoggyWoggyColors[i%hoggyWoggyColors.length]+letter
    })
    return m
}
