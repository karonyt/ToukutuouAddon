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
    new UI.ActionFormData()
    .title(`エジプトの葬儀師が宿ったナイフ`)
    .button(`スピードアップ`)
    .show(source).then(responce => {
        if(responce.selection == 0) source.addEffect(`speed`, 100 );

        //耐久度ダウン
        system.runTimeout( () => 
        source.triggerEvent(`karo:damage`)
        , 1);
        
    })
}