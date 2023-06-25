import { system, world } from "@minecraft/server";
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
    itemStack.getComponent(`durability`).damage += 10
    new UI.ActionFormData()
    .title(`エジプトの葬儀師が宿ったナイフ`)
    .body(`耐久力:${durability.maxDurability - durability.damage}`)
    .button(`スピードアップ`)
    .button(`筋力アップ`)
    .show(source).then(responce => {
        if(responce.selection == 0) source.addEffect(`speed`, 100 );
        if(responce.selection == 1) source.addEffect(`strength`, 100 );
        //耐久度ダウン
        system.runTimeout( () => 
        source.getComponent(`inventory`).container.setItem(source.selectedSlot , itemStack)
        , 1);
    })
}