import * as mc from "@minecraft/server"

// Death messages array uses %d to signify the dead player and %k for the killer
// When unlocking index starts at 0
export const deathMessages = [
  "%d §rwas killed by %k",
  "§e%d §egot d-d-dunked§d on by %k !", // 1
  "§b%d §bis not cracked at fortnite",
  "§c%k §coffered %d's§c blood for the blood god",
  "§a%d §ahas been tested for skill issue. They're positive",
  "%d got §c[REDACTED]!",
]

// Display name for the messages
export const deathMessageNames = [
    "Default",
    "Dunked on!",
    "Cracked at fortnite",
    "Blood for the blood god",
    "Skill issue positive",
    "[REDACTED]",
]

// Messages we may use in the future. here because they were already in the code
const reserveDeathMessages = [
    "%d has oofed themself",
    "Boom boom boom said %k as they destroyed %d"
]