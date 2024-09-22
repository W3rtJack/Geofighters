import * as mc from "@minecraft/server";
import { Achievement } from "../dataTypes"
import { getProp } from "../menus/stats";
import { healCircle } from "../abilities";


export const capture250 = new Achievement("capture250","§l§eHog doesn't approve",pointsCheck,pointsReward,returnPoints)

function pointsCheck(player){
    if (!capture250.get(player)){
        if (getProp(player,"allPoints") >= 250){
            capture250.complete(player)
        }
    }
}

function returnPoints(player){
    return `${getProp(player,"allPoints")}/250`
}

function pointsReward(player){
    healCircle.unlock(player);
    return healCircle.name
}