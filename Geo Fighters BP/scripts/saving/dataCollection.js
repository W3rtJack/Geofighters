import { completeArray, overworld } from "../abilities";
import { load } from "./loading";





export function getAbilityData(){
    const data = []

    for (const golem of overworld.getEntities({type:"minecraft:iron_golem"})){
        data.push(JSON.parse(golem.nameTag).abilities)
    }

    for (const ability of completeArray){
        let uses = 0;
        for (const d of data){
            const abl = d.find((f)=>f.name == ability.name)
            uses += abl.uses
        }
        overworld.runCommand(`say ${ability.name} : ${uses}`)
    }
}