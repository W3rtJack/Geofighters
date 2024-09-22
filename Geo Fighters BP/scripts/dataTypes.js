export class Queue{
    constructor(length){
        this.array = Array(length)
        this.start = 0;
        this.end = 0;
        this.size = 0;
        this.maxSize = length;
    }

    enqueue(item){
        if (!this.isFull()){
            this.array[this.end] = item;
            this.end = (this.end+ 1) % this.maxSize
            this.size++;
            return true
        }
        return false
    }

    dequeue(){
        if (!this.isEmpty()){
            let item = this.array[this.start];
            this.start = (this.start + 1) % this.maxSize
            this.size--;
            return item
        }else {
            return null;
        }
    }

    isEmpty(){
        if (this.size == 0){
            return true;
        }else {
            return false
        }
    }

    isFull(){
        if (this.maxSize == this.size+1){
            return true
        }
        else {
            return false
        }
    }
}

// Blank functions
function blank(player){
    return "0/1"
}
function blankreward(player){
    return "None"
}

// Achievement class (very important :) )
export class Achievement {
    constructor (id=String,name=String,func=Function,reward=blank,returnfunc=blank){
        this.id = id
        this.name = name
        this.func = func
        this.return = returnfunc
        this.reward = reward
    }

    update(player){
        this.func(player)
    }

    complete(player){
        player.setDynamicProperty(this.id,true)
        player.runCommand(`tellraw @s { "rawtext": [{ "text": "§bYou completed the achievement §l§e${this.name}!" }]}`)
        player.runCommand(`tellraw @s { "rawtext": [{ "text": "§5Reward: §r§l${this.reward(player)}!" }]}`)
        player.runCommand("playsound random.toast @s ~ ~ ~ 1 2")
        player.runCommand("playsound random.level @s ~ ~ ~ 1 2")
        const loc = player.location;
        loc.y++;
        if (this.id == "theend"){ player.dimension.spawnParticle("hog:gold_sparkle",loc) }
        else { player.dimension.spawnParticle("hog:white_sparkle",loc) }
    }

    get(player){
        if (player.getDynamicProperty(this.id) == true){
            return true
        }else {
            return false
        }
    }
    

}


// Animations
export class hitAnim {
    constructor (id,displayName,animation,item){
        this.id = id;
        this.displayName = displayName;
        this.animation = animation;
        this.item = item;
    }

    unlock(player){
        player.setDynamicProperty(`${this.id}.hit_anim.unlocked`,true)
    }

    take(player){
        player.setDynamicProperty(`${this.id}.hit_anim.unlocked`,false)
    }

    get(player){
        return player.getDynamicProperty(`${this.id}.hit_anim.unlocked`) ? true : false
    }
}

export class deathAnim {
    constructor (id,displayName,animation,item){
        this.id = id;
        this.displayName = displayName;
        this.animation = animation;
        this.item = item;
    }

    unlock(player){
        player.setDynamicProperty(`${this.id}.deathAnimation.unlocked`,true)
    }

    take(player){
        player.setDynamicProperty(`${this.id}.deathAnimation.unlocked`,false)
    }

    get(player){
        return player.getDynamicProperty(`${this.id}.deathAnimation.unlocked`) ? true : false
    }
}

export class passiveAnim {
    constructor (id,displayName,animation,item){
        this.id = id;
        this.displayName = displayName;
        this.animation = animation;
        this.item = item;
    }

    unlock(player){
        player.setDynamicProperty(`${this.id}.passiveAnim.unlocked`,true)
    }

    take(player){
        player.setDynamicProperty(`${this.id}.passiveAnim.unlocked`,false)
    }

    get(player){
        return player.getDynamicProperty(`${this.id}.passiveAnim.unlocked`) ? true : false
    }
}