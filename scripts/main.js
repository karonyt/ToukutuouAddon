import {  world } from "@minecraft/server";
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
    const form = new UI.ActionFormData()
    form.title(`エジプトの葬儀師が宿ったナイフ`)
    form.body(`(C級 一般クラス/消耗性遺物)\n使用可能回数:(${durability.maxDurability - durability.damage}/${durability.maxDurability})`)
    form.button(`スピードアップ`)
    form.button(`筋力アップ`)
    for(let i = 0; i > 1; i++){
        form.button(`${i}`)
    }
    form.show(source).then(responce => {
        if(responce.canceled) return;
        if(responce.selection == 0) source.addEffect(`speed`, 100 );
        if(responce.selection == 1) source.addEffect(`strength`, 100 );
        //耐久度ダウン
        if(itemStack.getComponent(`durability`).damage < 96) {
            itemStack.getComponent(`durability`).damage += 5
            source.getComponent(`inventory`).container.setItem(source.selectedSlot , itemStack)
        } else {
            source.getComponent(`inventory`).container.setItem(source.selectedSlot)
        }
    })
}