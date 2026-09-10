(function(root){
  'use strict';
  // 全部为本地演示数据，ID 不对应任何 SIT 卡券。
  const rows=[
    ['DEMO-U001','秋季保养抵扣券','user','maintenance',100],
    ['DEMO-V001','车辆养护代金券','vin','maintenance',200],
    ['DEMO-U002','免费车辆检测券','user','maintenance',0],
    ['DEMO-V002','轮胎养护优惠券','vin','maintenance',80],
    ['DEMO-U003','售后工时抵扣券','user','maintenance',50],
    ['DEMO-U004','空调清洁优惠券','user','maintenance',60],
    ['DEMO-U005','保养加赠服务券','user','maintenance',30],
    ['DEMO-V003','底盘检测权益券','vin','maintenance',0],
    ['DEMO-U006','精品周边满减券','user','mall',20],
    ['DEMO-V004','车辆精品优惠券','vin','mall',100],
    ['DEMO-MO001','线上保养抵扣券','user','maintenance',100,'线上核销'],
    ['DEMO-MO002','线上检测服务券','user','maintenance',30,'线上核销'],
    ['DEMO-MO003','线上工时优惠券','user','maintenance',50,'线上核销'],
    ['DEMO-MO004','线上清洁服务券','user','maintenance',60,'线上核销'],
    ['DEMO-MO005','线上养护加赠券','user','maintenance',20,'线上核销'],
    ['DEMO-MM001','多方式保养优惠券','user','maintenance',50,'线上核销+线下核销'],
    ['DEMO-MX001','未配置核销的保养券','user','maintenance',50,''],
    ['DEMO-MV001','线上车辆保养券','vin','maintenance',100,'线上核销'],
    ['DEMO-BO001','BIMC线上专享券','user','bimc',100,'线上核销'],
    ['DEMO-BL001','BIMC线下服务券','user','bimc',100,'线下核销'],
    ['DEMO-BM001','BIMC多方式优惠券','user','bimc',100,'线上核销+线下核销'],
    ['DEMO-BV001','BIMC线上车辆券','vin','bimc',100,'线上核销'],
    ['DEMO-BX001','BIMC未配置核销券','user','bimc',100,'']
  ].map(([id,name,receiveRule,scene,value,method='到店核销'])=>({id,name,receiveRule,scene,value,status:'已启用',product:scene==='mall'?'精品周边':scene==='bimc'?'BIMC':'维修保养',method,description:'本地演示卡券',validity:'2026-09-01 至 2026-12-31',settlementId:'DEMO-R01',settlementName:'演示结算规则',online:'—',offline:'—',limit:1}));
  if(typeof module==='object'&&module.exports)module.exports=rows;else root.DemoCoupons=rows;
})(typeof window==='undefined'?this:window);
