import { Player, world } from "@minecraft/server";
import * as UI from "@minecraft/server-ui"

world.afterEvents.itemUse.subscribe(ev => {
    const { source , itemStack } = ev;
    switch(itemStack.typeId){
        case 'karo:c-1': {
            C1(source , itemStack);
            break;
        }
    }
})

function C1(source , itemStack) {
    new ActionFormData()
    .title(`エジプトの葬儀師が宿ったナイフ`)
    .button(`スピードアップ`)
    .show(source).then(responce => {
        if(responce.selection == 1) player.addEffect(`minecraft:speed`, 5 );

        //耐久度ダウン
        itemStack.triggerEvent(`karo:damage`)
    })
}