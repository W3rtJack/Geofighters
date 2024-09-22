import * as mc from "@minecraft/server";
import { spectate } from "../queues/spectating";


export function cameraControllerUpdate(player){
    const camState = player.getDynamicProperty("cameraState")

    switch (camState){
        case "spectate":
            spectate(player);
            break;

        case "tempSpectate":
            spectate(player);
            break;
        
        case "jebRider":
            player.runCommand("camera @s set minecraft:third_person")
            break;
        
        default:
            player.runCommand("camera @s clear")
            break;
    }
}