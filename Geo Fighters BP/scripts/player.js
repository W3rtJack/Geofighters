import * as mc from "@minecraft/server";
import { Achievement } from "./dataTypes";
import { Ability } from "./abilities";

mc.Entity.prototype.addVar = function(property=String,amt=Number){
    this.setDynamicProperty(property, this.getDynamicProperty(property) == undefined ? amt : this.getDynamicProperty(property) + amt)
}

mc.Entity.prototype.complete = function(ach=Achievement){
    ach.complete(this);
}

mc.Entity.prototype.shopUnlockAbility = function(ability=Ability){
    ability.unlock(this);
    
    const loc = this.location;
    loc.x -= 0.5;
    loc.z -= 0.5;
    
    this.dimension.spawnParticle("minecraft:trial_spawner_detection",loc);
    this.dimension.spawnParticle("minecraft:trial_spawner_detection_ominous",loc);
}