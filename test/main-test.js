'use strict';

describe('pos', () => {
  let inputs, dateDigitToString;

  beforeEach(() => {
    inputs = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
    dateDigitToString = num => num < 10 ? `0${num}` : num;
  });

  it('should print correct text', () => {

    spyOn(console, 'log');

    printReceipt(inputs);

    const currentDate = new Date(),
      year = dateDigitToString(currentDate.getFullYear()),
      month = dateDigitToString(currentDate.getMonth() + 1),
      date = dateDigitToString(currentDate.getDate()),
      hour = dateDigitToString(currentDate.getHours()),
      minute = dateDigitToString(currentDate.getMinutes()),
      second = dateDigitToString(currentDate.getSeconds()),
      formattedDateString = `${year}年${month}月${date}日 ${hour}:${minute}:${second}`;

    const expectText = `***<没钱赚商店>收据***
打印时间：${formattedDateString}
----------------------
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

describe('unit test',()=>{
  describe('buildItems',()=>{

    const inputs = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
    it('should return correct cartItems',()=>{
      const testItems=buildItems(inputs);
      const expectedItems=[{
        item:{
          barcode: 'ITEM000001',
          name: '雪碧',
          unit: '瓶',
          price: 3.00
        },
        count: 5
      },
        {
          item:{
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00},
          count: 2
        },
        {
          item:{
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.5},
          count: 3
        }];
      expect(expectedItems).toEqual(testItems);
    });
  });
describe('buildReceiptItems',()=>{
  const inputs=[
    {
    item:{
      barcode: 'ITEM000001',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    count: 5
  },
    {
      item:{
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        price: 15.00},
      count: 2
    },
    {
      item:{
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        price: 4.5},
      count: 3
    }];
  it('shoule return correct itemsSubtotal',()=>{
    const testSubtotal=buildReceiptItems(inputs);
    const expextedSubtotal=[
      {
        cartItem:
          {
            item: {
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
            },
            count:5
          },
        subtotal:12.00,
        saved:3.00
      },

      {
        cartItem:
          {
            item:{
              barcode: 'ITEM000003',
              name: '荔枝',
              unit: '斤',
              price: 15.00},
            count:2.00
          },
        subtotal:30.00,
        saved:0.00
      },
      {
        cartItem:
          {
            item:{
              barcode: 'ITEM000005',
              name: '方便面',
              unit: '袋',
              price: 4.50},
            count:3
          },
        subtotal:9.00,
        saved:4.50
      }
    ];
    expect(testSubtotal).toEqual(expextedSubtotal);
  });
});
describe('geTotal',()=>{
  const inputs=[
    {
      cartItem:
        {
          item: {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
          },
          count:5
        },
      subtotal:12.00,
      saved:3.00
    },

    {
      cartItem:
        {
          item:{
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00},
          count:2.00
        },
      subtotal:30.00,
      saved:0.00
    },
    {
      cartItem:
        {
          item:{
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50},
          count:3
        },
      subtotal:9.00,
      saved:4.50
    }
  ];
  it('should return correct receipt',()=>{
    const testReceipt=buildReceipt(inputs);
    const expectedReceipt={
      itemsSubtotal: [
        {
          cartItem: {
            item: {
              barcode: 'ITEM000001',
              name: '雪碧',
              unit: '瓶',
              price: 3.00
            },
            count: 5
          },
          subtotal: 12.00,
          saved: 3.00
        },
        {
          cartItem: {
            item: {
              barcode: 'ITEM000003',
              name: '荔枝',
              unit: '斤',
              price: 15.00
            },
            count: 2
          },
          subtotal: 30,
          saved: 0.00
        },
        {
          cartItem: {
            item: {
              barcode: 'ITEM000005',
              name: '方便面',
              unit: '袋',
              price: 4.50
            },
            count: 3
          },
          subtotal: 9,
          saved: 4.5
        }
      ],
      total: 51.00,
      savedTotal: 7.50
    };
    expect(expectedReceipt).toEqual(testReceipt);
  });
});
});
