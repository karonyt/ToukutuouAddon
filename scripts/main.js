import { world } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe(ev => {
    world.sendMessage('a')
})