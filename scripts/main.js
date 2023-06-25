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
    const durability = itemStack.getComponent(`durability`)
    new UI.ActionFormData()
    .title(`エジプトの葬儀師が宿ったナイフ`)
    .body(`耐久力:${durability.maxDurability - durability.damage}\n ${itemStack.getComponent(`tekitou`)}`)
    .button(`スピードアップ`)
    .button(`筋力アップ`)
    .show(source).then(responce => {
        if(responce.canceled) return;
        if(responce.selection == 0) source.addEffect(`speed`, 100 );
        if(responce.selection == 1) source.addEffect(`strength`, 100 );
        //耐久度ダウン
        if(itemStack.getComponent(`durability`).damage < 291) {
            itemStack.getComponent(`durability`).damage += 10
            source.getComponent(`inventory`).container.setItem(source.selectedSlot , itemStack)
        } else {
            source.getComponent(`inventory`).container.setItem(source.selectedSlot)
        }
    })
}