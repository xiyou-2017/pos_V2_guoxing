'use strict';
let printReceipt = (inputs)=>{
  let cartItems = buildItems(inputs);
  let itemsSubtotal = buildReceiptItems(cartItems);
  let receipt = buildReceipt(itemsSubtotal);
  printCartItemsReceipt(receipt);
}

let buildItems = (inputs)=> {
  let cartItems = [];
  let allItems = Item.all();

  for (let input of inputs) {
    let splitInput = input.split("-");
    let barcode = splitInput[0];
    let count = parseFloat(splitInput[1] || 1);

    let cartItem = cartItems.find((cartItem)=>cartItem.item.barcode === barcode);//cartItem
    if (cartItem) {
      cartItem.count += count;
    }
    else {
      let item = allItems.find((item)=> item.barcode === barcode);
      item={
        barcode:item.barcode,
        name:item.name,
        unit:item.unit,
        price:item.price
      };
      cartItems.push({item, count: count});
    }
  }
  return cartItems;
}

let buildReceiptItems = (cartItems)=>{
  return cartItems.map(cartItem=>{
    let promotionType = getPromotionType(cartItem);
    let {saved,subtotal} = discount(promotionType,cartItem);

    return {cartItem,saved,subtotal};
  })
}

let getPromotionType = (cartItem)=>{
  let promotions = Promotion.all();
  let promotion = promotions.find((promotion)=>promotion.barcodes.includes(cartItem.item.barcode));

  return promotion?promotion.type:' ';
}

let discount = (promotioType,cartItem)=>{
  let freeItemCount = 0;
  if(promotioType === "BUY_TWO_GET_ONE_FREE"){
    freeItemCount = parseInt(cartItem.count/3);
  }

  let saved = cartItem.item.price * freeItemCount;
  let subtotal = cartItem.item.price*(cartItem.count -freeItemCount);

  return {saved,subtotal};
}

let buildReceipt= (itemsSubtotal)=>{
  let total = 0;
  let savedTotal = 0;

  for(let itemSubtotal of itemsSubtotal){
    total+=itemSubtotal.subtotal;
    savedTotal+=itemSubtotal.saved;
  }

  return {itemsSubtotal,savedTotal,total};
}

let dateprocess= time=>time<10 ? `0${time}` : time;

let printCartItemsReceipt= (receipt)=>{

  let myDate = new Date(),
    year =dateprocess(myDate.getFullYear()),
    month = dateprocess(myDate.getMonth() + 1),
    date = dateprocess(myDate.getDate()),
    hour = dateprocess(myDate.getHours()),
    minute = dateprocess(myDate.getMinutes()),
    second = dateprocess(myDate.getSeconds()),
    DateString = `${year}年${month}月${date}日 ${hour}:${minute}:${second}`;
  let receiptString = "***<没钱赚商店>收据***"+'\n打印时间：'+DateString+'\n----------------------';
  let itemsArray = receipt.itemsSubtotal;
  for(let itemArray of itemsArray){
    receiptString+='\n名称：'+itemArray.cartItem.item.name+'，数量：'+itemArray.cartItem.count+itemArray.cartItem.item.unit+'，单价：'+itemArray.cartItem.item.price.toFixed(2)+'(元)，小计：'+itemArray.subtotal.toFixed(2)+'(元)';
  }
  receiptString+='\n----------------------'+'\n总计：'+receipt.total.toFixed(2)+'(元)'+'\n节省：'+receipt.savedTotal.toFixed(2)+'(元)'+'\n**********************';
  console.log(receiptString);
}

