(function(g){
'use strict';
g.MockData={
 catalog:[{id:'SKU-DEMO-001',name:'演示随行杯',writable:true},{id:'SKU-DEMO-002',name:'演示收纳盒',writable:true},{id:'SKU-DEMO-003',name:'演示遮阳帘',writable:true},{id:'SKU-DEMO-004',name:'演示抱枕',writable:true},{id:'SKU-DEMO-005',name:'演示雨伞',writable:true},{id:'SKU-DEMO-006',name:'模拟写入失败商品',writable:false},{id:'000000000000000007',name:'前导零演示商品',writable:true}],
 mixedCsv:'sku_id\r\nSKU-DEMO-004\r\nSKU-DEMO-005\r\nSKU-DEMO-004\r\nbad value!\r\nSKU-DEMO-999\r\nSKU-DEMO-006\r\n',
 allFailedCsv:'sku_id\r\nSKU-DEMO-999\r\nSKU-DEMO-006\r\nbad value!\r\n',
 templates:[
 {id:'DEMO-TPL-001',name:'秋日出行礼遇券（虚构）',status:'已投放',brand:'日产',source:'卡券中心',scene:'商城营销 / 新商城',type:'代金券',face:'50.00 元',quantity:'1,000 张',limit:'每人 1 张',threshold:'订单金额满 300 元',redemption:'线上核销',receiveTime:'2026-09-01 00:00 至 2026-09-30 23:59',useTime:'2026-09-01 00:00 至 2026-10-31 23:59',settlement:'沿用原结算规则（演示）',sms:'默认',terms:'指定商城商品可用；核销与领券限制沿用原卡券规则。',received:300,issued:500,created:'2026-09-01 10:00',updated:'2026-09-16 09:00',relationType:'SKU',version:1,effectiveVersion:1,sync:'success',saved:['SKU-DEMO-001','SKU-DEMO-002','SKU-DEMO-003'],effective:['SKU-DEMO-001','SKU-DEMO-002','SKU-DEMO-003'],batches:[{id:'DEMO-B001',fileName:'初始虚构成功集合.csv',savedVersion:1,accepted:['SKU-DEMO-001','SKU-DEMO-002','SKU-DEMO-003'],total:3,failed:0}],audit:[]},
 {id:'DEMO-TPL-002',name:'空成功集合演示券（虚构）',status:'已投放',brand:'日产',source:'卡券中心',scene:'商城营销 / 新商城',type:'代金券',face:'20.00 元',quantity:'100 张',limit:'每人 1 张',threshold:'订单金额满 100 元',redemption:'线上核销',receiveTime:'2026-09-01 00:00 至 2026-09-30 23:59',useTime:'2026-09-01 00:00 至 2026-10-31 23:59',settlement:'沿用原结算规则（演示）',sms:'默认',terms:'用于验证空成功集合，不能推断真实系统允许空关系投放。',received:0,issued:0,created:'2026-09-01 10:00',updated:'2026-09-16 09:00',relationType:'SKU',version:1,effectiveVersion:1,sync:'success',saved:[],effective:[],batches:[],audit:[]}
 ]
};
})(typeof window!=='undefined'?window:globalThis);
