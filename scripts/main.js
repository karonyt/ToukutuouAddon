import {  world } from "@minecraft/server";
import * as UI from "@minecraft/server-ui"

world.afterEvents.itemUse.subscribe(ev => {
    //遺物以外の追加アイテムでないkaroという名前空間の追加アイテム(=遺物)を右クリしたときフォームを出すためのibutuという関数を実行
    const { source , itemStack } = ev;
    if(itemStack.typeId.startsWith(`karo:`) && itemStack.typeId !== `karo:repair`) ibutu(source , itemStack);
})

/*
Dataクラスについて
このクラスは遺物の設定である

1行目
name=遺物名
lore=説明文
durability=消費する耐久力

2行目
ボタン一覧

3行目以降
ボタンに対応するコマンドたち(ボタン一つにつき1行)
*/


class Data {
    //cクラス
    c1 = [
      { name: "エジプトの葬儀師が宿ったナイフ" , lore: "(C級 一般クラス/消耗性遺物)", durability: "5"},
      { button1: "スピードアップ", button2: "筋力アップ" },
      { 1: "effect @s speed 5 0"}, 
      { 2: "effect @s strength 5 0"}
    ];
  

    //sクラス
    s1 = [
        { name: "ジョン・ミルトン、盲目の詩人の本" , lore: "(S級 英雄伝説クラス/帰属性遺物)", durability: "15"},
        { button1: "使用する", button2: "効果終了" },
        { 1: "effect @s blindness 10000 30", 2: "effect @s regeneration 10000 10" },
        { 1: "effect @s blindness 0 31", 2: "effect @s regeneration 0 11" }
      ];

    s2 = [
        { name: "	ヒポクラテスのミアスマ伝説" , lore: "(S級 英雄伝説クラス/消耗性遺物)", durability: "5"},
        { button1: "自分に使用する", button2: "周りに使用する" },
        { 1: "effect @s poison 100 1", 2: "effect @s wither 10 2" },
        { 1: "effect @a[r=15] blindness 30 10", 2: "effect @e[rm=1,r=20] wither 20 5" }
    ];

    s3 = [
        { name: "寂しい神の招待状" , lore: "(SS級 神クラス/消耗性遺物)", durability: "1"},
        { button1: "自分に使用する", button2: "周りの人に使用する", button3: "一番近くの人に使用する" },
        { 1: "spreadplayers ~ ~ 500 1000 @s" },
        { 1: `execute as @s unless entity @a[rm=1,r=10] run tellraw @s {"rawtext":[{"text":"§c対象がいません"}]}` , 2:"spreadplayers ~ ~ 500 1000 @a[r=10,rm=1]" },
        { 1: `execute as @s unless entity @p[rm=1,r=10] run tellraw @s {"rawtext":[{"text":"§c対象がいません"}]}` , 2:"spreadplayers ~ ~ 500 1000 @p[r=10,rm=1]" },
    ];

  }
  
//DataクラスをibutuDataとする
const ibutuData = new Data()



function ibutu(source , itemStack) {
    //耐久値のコンポーネント取得
    const durability = itemStack.getComponent(`durability`)
    //フォーム作成
    const form = new UI.ActionFormData()
    //フォームのタイトル名にアイテム名代入
    form.title(`${ibutuData[itemStack.typeId.split(`:`)[1]][0].name}`)
    //遺物の説明＆耐久値
    form.body(`${ibutuData[itemStack.typeId.split(`:`)[1]][0].lore}\n使用可能回数:(${durability.maxDurability - durability.damage}/${durability.maxDurability})`)
    //Dataクラスのボタンのプロパティ数によってボタンを作成
    for(let key in ibutuData[itemStack.typeId.split(`:`)[1]][1]){
        form.button(`${ ibutuData[itemStack.typeId.split(`:`)[1]][1][key]}`)
    }
    //フォームをプレイヤーに表示
    form.show(source).then(responce => {
        //キャンセルされたら終了
        if(responce.canceled) return;
        //押されたボタンによってコマンドを変える
        for( const command in ibutuData[itemStack.typeId.split(`:`)[1]][responce.selection + 2] ){
            source.runCommandAsync(`${ibutuData[itemStack.typeId.split(`:`)[1]][responce.selection + 2][command]}`)
        }
        //耐久度ダウンさせる 耐久値がまだある場合
        if(itemStack.getComponent(`durability`).damage < durability.maxDurability - Number(ibutuData[itemStack.typeId.split(`:`)[1]][0].durability)) {
            //現在の耐久値をマイナス(負傷値を上げる) このときの数値はDataクラスから取る
            itemStack.getComponent(`durability`).damage += Number(ibutuData[itemStack.typeId.split(`:`)[1]][0].durability)
            //アイテムの更新
            source.getComponent(`inventory`).container.setItem(source.selectedSlot , itemStack)
        } else {
            //耐久のないアイテムを消す
            source.getComponent(`inventory`).container.setItem(source.selectedSlot)
        }
    })
}