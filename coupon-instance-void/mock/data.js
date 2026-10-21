(function(root){
'use strict';
var data={
 currentUser:{name:'演示用户'},
 permission:'coupon.instance.invalidate', unfreezePermission:'coupon.instance.unfreeze', initialRole:'operator',
 roles:[
  {id:'admin',name:'示例权限管理员',code:'DEMO_ADMIN',status:'启用',description:'用于演示角色权限配置',canManageRoles:true,permissions:['coupon.instance.invalidate','coupon.instance.unfreeze']},
  {id:'operator',name:'示例运营角色',code:'DEMO_OPERATOR',status:'启用',description:'用于演示已授权的实例解冻与失效操作',canManageRoles:false,permissions:['coupon.instance.invalidate','coupon.instance.unfreeze']},
  {id:'viewer',name:'示例普通角色',code:'DEMO_VIEWER',status:'启用',description:'用于演示未授权时的访问限制',canManageRoles:false,permissions:[]}
 ],
 statuses:{unused:'未使用',expired:'已过期',redeemed:'已核销',invalidated:'已失效'},
 freezeStatuses:{unfrozen:'未冻结',frozen:'已冻结'},
 coupons:[
  {name:'售后关怀券（虚构）',templateId:'DEMO-TPL-001',phone:'10000000001',vin:'TESTA123456789001',redemptionCode:'DEMO-VC-001',status:'unused',version:1},
  {name:'售后关怀券（虚构）',templateId:'DEMO-TPL-001',phone:'10000000002',vin:'TESTA123456789002',redemptionCode:'DEMO-VC-002',status:'unused',version:1},
  {name:'保养关怀券（虚构）',templateId:'DEMO-TPL-003',phone:'10000000003',vin:'TESTA123456789003',redemptionCode:'DEMO-VC-003',status:'unused',freezeStatus:'frozen',version:1},
  {name:'保养关怀券（虚构）',templateId:'DEMO-TPL-004',phone:'10000000004',vin:'TESTA123456789004',redemptionCode:'DEMO-VC-004',status:'expired',version:1},
  {name:'保养关怀券（虚构）',templateId:'DEMO-TPL-005',phone:'10000000005',vin:'TESTA123456789005',redemptionCode:'DEMO-VC-005',status:'redeemed',version:1},
  {name:'保养关怀券（虚构）',templateId:'DEMO-TPL-006',phone:'10000000006',vin:'TESTA123456789006',redemptionCode:'DEMO-VC-006',status:'invalidated',version:1},
  {name:'过期冻结券（虚构）',templateId:'DEMO-TPL-008',phone:'10000000008',vin:'TESTA123456789008',redemptionCode:'DEMO-VC-008',status:'expired',freezeStatus:'frozen',version:1},
  {name:'重复组合示例券 A（虚构）',templateId:'DEMO-TPL-MULTI',phone:'10000000007',vin:'TESTA123456789007',redemptionCode:'DEMO-VC-MULTI',status:'unused',version:1},
  {name:'重复组合示例券 B（虚构）',templateId:'DEMO-TPL-MULTI',phone:'10000000007',vin:'TESTA123456789007',redemptionCode:'DEMO-VC-MULTI',status:'unused',version:1}
 ],
 samples:[
  {id:'phone',label:'正确组合 · 手机号',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'phone'},
  {id:'vin',label:'正确组合 · VIN',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'vin'},
  {id:'both',label:'正确组合 · 手机号 + VIN',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'both'},
  {id:'wrong-phone',label:'错误组合 · 手机号不匹配',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'phone',override:{phone:'10000000999'}},
  {id:'wrong-vin',label:'错误组合 · 双标识不一致',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'both',override:{vin:'TESTA123456789999'}},
  {id:'wrong-template',label:'错误组合 · 模板 ID 不匹配',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'phone',override:{templateId:'DEMO-TPL-WRONG'}},
  {id:'wrong-code',label:'错误组合 · 核销码不匹配',templateId:'DEMO-TPL-001',redemptionCode:'DEMO-VC-001',identity:'phone',override:{redemptionCode:'DEMO-VC-WRONG'}},
  {id:'multiple',label:'异常组合 · 匹配多个实例',templateId:'DEMO-TPL-MULTI',redemptionCode:'DEMO-VC-MULTI',identity:'both'},
  {id:'frozen',label:'状态示例 · 未使用／已冻结',templateId:'DEMO-TPL-003',redemptionCode:'DEMO-VC-003',identity:'phone'},
  {id:'frozen-expired',label:'状态示例 · 已过期／已冻结',templateId:'DEMO-TPL-008',redemptionCode:'DEMO-VC-008',identity:'phone'},
  {id:'expired',label:'状态示例 · 已过期／未冻结',templateId:'DEMO-TPL-004',redemptionCode:'DEMO-VC-004',identity:'phone'},
  {id:'redeemed',label:'状态示例 · 已核销',templateId:'DEMO-TPL-005',redemptionCode:'DEMO-VC-005',identity:'phone'},
  {id:'invalidated',label:'状态示例 · 已失效／未冻结',templateId:'DEMO-TPL-006',redemptionCode:'DEMO-VC-006',identity:'phone'}
 ],
 scenarios:[
  {id:'success',label:'正常返回',description:'正确组合仅修改目标实例。'},
  {id:'failure',label:'提交失败',description:'模拟明确失败，实例保持原状态。'},
  {id:'unknown',label:'结果未知',description:'模拟本地已处理但响应丢失；不显示成功，需重新核验。'},
  {id:'revoke',label:'提交时权限撤回',description:'模拟权限在提交前被撤回，重新鉴权后阻断。'},
  {id:'stale',label:'提交时状态变化',description:'模拟实例状态或版本变化，阻断本次旧结果提交；重新定位后再选择操作。'}
 ]
};
// 按载入时间生成虚构有效期，保证两种冻结场景可持续演示。
var demoNow=Date.now(),day=86400000;
data.coupons.forEach(function(x){if(!x.freezeStatus)x.freezeStatus='unfrozen';x.validFrom=new Date(demoNow-30*day).toISOString();x.validUntil=new Date(demoNow+(x.status==='expired'||x.templateId==='DEMO-TPL-008'?-1:30)*day).toISOString();});
if(typeof module==='object'&&module.exports) module.exports=data;
root.DFNMockData=data;
})(typeof window==='object'?window:globalThis);
