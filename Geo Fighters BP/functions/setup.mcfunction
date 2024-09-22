scoreboard objectives add dj.cooldown dummy
scoreboard objectives add jump.count dummy
scoreboard objectives add jump.bool dummy
scoreboard objectives add jump.start dummy


scoreboard objectives add leap.cooldown dummy
scoreboard objectives add leap.level dummy
scoreboard objectives add leap.time dummy



scoreboard objectives add jeb.unlocked dummy
scoreboard objectives add jeb.cooldown dummy
scoreboard objectives add jeb.level dummy


scoreboard objectives add teleport.cooldown dummy
scoreboard objectives add teleport.level dummy
scoreboard objectives add teleport.blocks dummy
scoreboard objectives add teleport.state dummy

scoreboard objectives add knifeThrow.cooldown dummy
scoreboard objectives add knifeThrow.level dummy

scoreboard objectives add healCircle.cooldown dummy
scoreboard objectives add healCircle.level dummy

scoreboard objectives add fireworkBlaster.cooldown dummy
scoreboard objectives add fireworkBlaster.level dummy
scoreboard objectives add fireworkBlaster.count dummy

scoreboard objectives add minecart.cooldown dummy
scoreboard objectives add minecart.level dummy

scoreboard objectives add flash.cooldown dummy
scoreboard objectives add flash.level dummy

scoreboard objectives add heavyP.cooldown dummy
scoreboard objectives add heavyP.level dummy

scoreboard objectives add skully.cooldown dummy
scoreboard objectives add skully.level dummy

scoreboard objectives add fireball.cooldown dummy
scoreboard objectives add fireball.level dummy

scoreboard objectives add thrower.level dummy
scoreboard objectives add thrower.cooldown dummy

scoreboard objectives add grabber.level dummy
scoreboard objectives add grabber.cooldown dummy

scoreboard objectives add ps.level dummy
scoreboard objectives add ps.cooldown dummy

scoreboard objectives add bloomPot.level dummy
scoreboard objectives add bloomPot.cooldown dummy

scoreboard objectives add kbP.level dummy
scoreboard objectives add kbP.cooldown dummy

scoreboard objectives add turret.level dummy
scoreboard objectives add turret.cooldown dummy
scoreboard objectives add turret.count dummy

scoreboard objectives add hlv.level dummy
scoreboard objectives add hlv.cooldown dummy
scoreboard objectives add hlv.shots dummy
scoreboard objectives add hlv.stored dummy

scoreboard objectives add jt.level dummy
scoreboard objectives add jt.cooldown dummy


scoreboard objectives add combo.count dummy
scoreboard objectives add combo.timer dummy
scoreboard objectives add combo.ability dummy

scoreboard objectives add wins dummy
scoreboard objectives add kills dummy
scoreboard objectives add gamesPlayed dummy



scoreboard objectives add equip.slot1 dummy
scoreboard objectives add equip.slot2 dummy
scoreboard objectives add equip.slot3 dummy
scoreboard objectives add equip.slot4 dummy
scoreboard objectives add equip.slot5 dummy

scoreboard objectives add player.sprint dummy
scoreboard objectives add player.sprintCooldown dummy


scoreboard objectives add cosmetics.deathMsg dummy "Death message ID"


scoreboard objectives add settings.actionbar dummy "Actionbar"
scoreboard objectives add settings.comboDisplay dummy "Combo Display"


scoreboard objectives add kills dummy
scoreboard objectives add money dummy
scoreboard objectives add life dummy

# Forced value
scoreboard players add @a wins 0
scoreboard players add @a kills 0
scoreboard players add @a gamesPlayed 0
scoreboard players add @a combo.ability 0


scoreboard players add @a teleport.level 0
scoreboard players add @a jeb.level 0
scoreboard players add @a knifeThrow.level 0
scoreboard players add @a healCircle.level 0
scoreboard players add @a fireworkBlaster.level 0
scoreboard players add @a minecart.level 0
scoreboard players add @a flash.level 0
scoreboard players add @a heavyP.level 0
scoreboard players add @a leap.level 0
scoreboard players add @a skully.level 0
scoreboard players add @a fireball.level 0
scoreboard players add @a thrower.level 0
scoreboard players add @a grabber.level 0
scoreboard players add @a ps.level 0
scoreboard players add @a bloomPot.level 0
scoreboard players add @a kbP.level 0
scoreboard players add @a turret.level 0
scoreboard players add @a hlv.level 0
scoreboard players add @a jt.level 0



scoreboard players add @a hlv.shots 0
scoreboard players add @a hlv.stored 0

scoreboard players add @a cosmetics.deathMsg 0

scoreboard players add @a equip.slot1 0
scoreboard players add @a equip.slot2 0
scoreboard players add @a equip.slot3 0
scoreboard players add @a equip.slot4 0
scoreboard players add @a equip.slot5 0


scoreboard players add @a settings.actionbar 0
scoreboard players add @a settings.comboDisplay 0

scoreboard players add @e[type=hog:floating_text] life 1



# Gamerule settings
gamerule showTags false
gamerule showdeathmessages false
gamerule keepinventory true


tp @e[type=hog:floating_text,scores={life=10..}]
kill @e[type=hog:floating_text,scores={life=10..}]

kill @e[type=item]


# Forced items
replaceitem entity @a slot.hotbar 8 hog:menu_item 1 0 {"keep_on_death": {},"item_lock": { "mode": "lock_in_slot" } }
replaceitem entity @a[tag=!jebbing] slot.armor.chest 0 minecraft:leather_chestplate 1 0 {"keep_on_death": {},"item_lock": { "mode": "lock_in_slot" } }
replaceitem entity @a[tag=!jebbing] slot.armor.legs 0 minecraft:leather_leggings 1 0 {"keep_on_death": {},"item_lock": { "mode": "lock_in_slot" } }
replaceitem entity @a[tag=!jebbing] slot.armor.feet 8 minecraft:leather_boots 1 0 {"keep_on_death": {},"item_lock": { "mode": "lock_in_slot" } }

replaceitem entity @a[tag=jebbing] slot.armor.chest 0 air 
replaceitem entity @a[tag=jebbing] slot.armor.legs 0 air
replaceitem entity @a[tag=jebbing] slot.armor.feet 0 air


execute as @a[tag=noArmor] run playanimation @s animation.hide.scale a 1


execute as @e[type=hog:armor_stand,name=bloomTop,tag=!bloomed] run playanimation @s animation.armor_stand.salute_pose a 1000
execute as @e[type=hog:armor_stand,tag=skullyrang,tag=!bloomed] run playanimation @s animation.armor_stand.riposte_pose a 1000

execute as @e[type=hog:armor_stand,name=bloomTop,tag=!bloomed] run tag @s add bloomed
execute as @e[type=hog:armor_stand,tag=skullyrang,tag=!bloomed] run tag @s add bloomed





#*Optional Command* for Auto Pose 7
playanimation @e[type= hog:armor_stand, name= "Grumm"] animation.armor_stand.entertain_pose null 0 "0" align_arms

#*Alignment Command* (Mini Block Size)
playanimation @e[type= hog:armor_stand, name= "Grumm"] animation.player.move.arms.zombie null 0 "0" size_mini_block

#*Additional Commands* for Full Block Size
playanimation @e[type= hog:armor_stand, name= "Grumm"] animation.block.scale null 0 "0" size_full_block


execute as @e[type=hog:armor_stand,name="Grumm"] at @s unless block ~ ~-0.1 ~ air run tp ~ -200 ~


execute as @e[type=chicken] at @s run tp @s ~ -200 ~


hud @a hide hunger
hud @a hide item_text
hud @a hide progress_bar
hud @a hide status_effects
hud @a hide armor
hud @a hide hunger


clear @a diamond_sword
clear @a iron_sword