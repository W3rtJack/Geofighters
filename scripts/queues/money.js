import { addPlayerVar } from "../abilities";

export function giveMoney(player){
    var m = player.getDynamicProperty("round.money")
    m += 100;
    if (player.getDynamicProperty("ffa.challenge.complete") == true){
        m = m*convToMultiplier(player);
        player.setDynamicProperty(`challenge.${player.getDynamicProperty("equipped.challenge")}.complete`,true);
    }
    addPlayerVar(player,"money",m);
    return m.toFixed(0)
}


export function convToMultiplier(player){
    if (player.getDynamicProperty("ffa.challenge.complete")){
        switch (player.getDynamicProperty("equipped.challenge")){
            case 5:
                return 1.1;
            case 4:
                return 1.3;
            case 3:
                return 1.5;
            case 2:
                return 2.0;
            case 1:
                return 2.5;
        }
    }
    return 1.0;
}