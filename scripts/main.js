import {  world } from "@minecraft/server";
import * as UI from "@minecraft/server-ui"

world.afterEvents.itemUse.subscribe(ev => {
    const { source , itemStack } = ev;
    switch(itemStack.typeId){
        case 'karo:c1': {
            ibutu(source , itemStack);
            break;
        }
    }
})

/*
ibutu関数について

1行目
name=遺物名
lore=説明文
durability=消費する耐久力

2行目
ボタン一覧

3行目
ボタンに対応するコマンドたち(必ずキー名は0から始まる整数にすること(responce.selectionで整数が出力されるため))
*/
class Data {
    c1 = [
      { name: "エジプトの葬儀師が宿ったナイフ" , "lore": "(C級 一般クラス/消耗性遺物)", "durability": "5"},
      { button1: "スピードアップ", button2: "筋力アップ" },
      { 0: "effect @s speed 5 0", 1: "effect @s strength 5 0" },
    ];
  
    dataArray2 = [
      { name: "データ1", value: "値1" },
      { name: "データ2", value: "値2" },
      { name: "データ3", value: "値3" }
    ];
  }
  
const ibutuData = new Data()

function ibutu(source , itemStack) {
    const durability = itemStack.getComponent(`durability`)
    const form = new UI.ActionFormData()
    form.title(`${ibutuData[itemStack.typeId.split(`:`)[1]][0].name}`)
    form.body(`${ibutuData[itemStack.typeId.split(`:`)[1]][0].lore}\n使用可能回数:(${durability.maxDurability - durability.damage}/${durability.maxDurability})`)
    for(let key in ibutuData[itemStack.typeId.split(`:`)[1]][1]){
        form.button(`${ ibutuData[itemStack.typeId.split(`:`)[1]][1][key]}`)
    }
    form.show(source).then(responce => {
        if(responce.canceled) return;
        source.runCommandAsync(`${ibutuData[itemStack.typeId.split(`:`)[1]][2][responce.selection]}`)
        //耐久度ダウン
        if(itemStack.getComponent(`durability`).damage < durability.maxDurability - Number(ibutuData[itemStack.typeId.split(`:`)[1]][0].durability)) {
            itemStack.getComponent(`durability`).damage += Number(ibutuData[itemStack.typeId.split(`:`)[1]][0].durability)
            source.getComponent(`inventory`).container.setItem(source.selectedSlot , itemStack)
        } else {
            source.getComponent(`inventory`).container.setItem(source.selectedSlot)
        }
    })
}