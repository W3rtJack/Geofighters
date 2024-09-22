import { fireworks1000 } from "./1000fireworks";
import { kill25jeb } from "./25killjeb";
import { fireworkhit500 } from "./500fireworkhit";
import { ability_rangler } from "./ability_rangler";
import { americanDream } from "./americanDream";
import { blazingGlory } from "./blazingGlory";
import { blowjob } from "./blowjob";
import { capture250 } from "./capture250";
import { challenger } from "./challenger";
import { chargingTime } from "./chargingTime";
import { collateral } from "./collateral";
import { comboKing } from "./comboKing";
import { die } from "./die";
import { drugs } from "./drugs";
import { finishHim } from "./finishHim";
import { flash50 } from "./flash50";
import { flashBang20 } from "./flashBang20";
import { gamePlay } from "./gamePlay";
import { genshin } from "./genshin";
import { groundPAch } from "./groundPAch";
import { itsSoSad } from "./itsSoSad";
import { jebRider } from "./jebRider";
import { jumper } from "./jumper";
import { kill100 } from "./kill100";
import { kill1000 } from "./kill1000";
import { kt100 } from "./kt100";
import { longGrabby } from "./longGrabby";
import { mmmChicken } from "./mmmChicken";
import { newPlayer } from "./newPlayer";
import { poorTyrone } from "./poorTyrone";
import { secret } from "./secret";
import { theEnd } from "./theend";
import { tutorial } from "./tutorial";
import { useless } from "./useless";
import { walker } from "./walker";
import { win100 } from "./win100";


export const achList = [
    newPlayer,
    gamePlay,
    jumper,
    finishHim,
    comboKing,
    jebRider,
    mmmChicken,
    win100,
    fireworks1000,
    itsSoSad,
    groundPAch,
    useless,
    flash50,
    walker,
    kill100,
    kill1000,
    die,
    fireworkhit500,
    kill25jeb,
    kt100,
    flashBang20,
    americanDream,
    blowjob,
    drugs,
    longGrabby,
    chargingTime,
    poorTyrone,
    blazingGlory,
    tutorial,
    genshin,
    ability_rangler,
    secret,
    capture250,
    challenger,
    collateral
]


export function achTest(player){
    achList.forEach(test=>{
        test.update(player);
    })

    theEnd.update(player);
}