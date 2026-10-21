(function(root){
'use strict';
function clone(v){return JSON.parse(JSON.stringify(v));}
function normalize(input){input=input||{};return {phone:String(input.phone||'').trim(),vin:String(input.vin||'').trim().toUpperCase(),templateId:String(input.templateId||'').trim(),redemptionCode:String(input.redemptionCode||'').trim()};}
function equal(a,b){return JSON.stringify(normalize(a))===JSON.stringify(normalize(b));}
function isInvalidatableStatus(status){return ['unused','expired'].indexOf(status)>=0;}
function createStore(seed,options){
 var data,roleId,scenario,ticket,pending,serial=0,generation=0,audit; options=options||{};
 function now(){return options.now?new Date(options.now()).getTime():Date.now();}
 function reset(){generation++;data=clone(seed);roleId=seed.initialRole;scenario='success';ticket=null;pending=null;audit=[];}
 function role(){return data.roles.find(function(r){return r.id===roleId;});}
 function permission(action){return action==='unfreeze'?seed.unfreezePermission:seed.permission;}
 function can(action){var r=role();return !!r&&r.status==='启用'&&r.permissions.indexOf(permission(action))>=0;}
 function canInvalidate(){return can('invalidate');}
 function canUnfreeze(){return can('unfreeze');}
 function canAccess(){return canInvalidate()||canUnfreeze();}
 function canManageRoles(){return !!role()&&role().canManageRoles===true;}
 function invalidate(){ticket=null;}
 function setRole(id){if(pending||!data.roles.some(function(r){return r.id===id;}))return false;roleId=id;invalidate();return true;}
 function setScenario(value){if(pending||!seed.scenarios.some(function(s){return s.id===value;}))return false;scenario=value;return true;}
 function validate(input){
  var c=normalize(input),errors={};
  if(!c.phone&&!c.vin){errors.phone='请至少填写手机号或 VIN 码';errors.vin='请至少填写手机号或 VIN 码';}
  if(c.phone&&!/^\d{11}$/.test(c.phone))errors.phone='演示手机号须为 11 位数字';
  if(c.vin&&!/^[A-HJ-NPR-Z0-9]{17}$/.test(c.vin))errors.vin='演示 VIN 须为 17 位英文数字，不含 I、O、Q';
  if(!c.templateId)errors.templateId='请输入卡券模板 ID';
  if(!c.redemptionCode)errors.redemptionCode='请输入核销码';
  return {ok:Object.keys(errors).length===0,criteria:c,errors:errors};
 }
 function matchesKey(c){return data.coupons.filter(function(x){return x.templateId===c.templateId&&x.redemptionCode===c.redemptionCode;});}
 function matches(c){return matchesKey(c).filter(function(x){return (!c.phone||x.phone===c.phone)&&(!c.vin||x.vin===c.vin);});}
 function restoration(item){
  if(!item||item.freezeStatus!=='frozen')return {ok:false,message:'仅冻结状态为已冻结的卡券可以解冻。'};
  if(!isInvalidatableStatus(item.status))return {ok:false,message:'当前卡券状态不支持解冻。'};
  var start=Date.parse(item.validFrom),end=Date.parse(item.validUntil),time=now();
  if(!Number.isFinite(start)||!Number.isFinite(end)||!Number.isFinite(time)||start>end)return {ok:false,message:'有效期信息不完整，暂不能解冻，请核对卡券信息。'};
  if(time<start)return {ok:false,message:'卡券尚未到有效期，解冻处理规则待确认。'};
  return {ok:true,status:time>end?'expired':'unused'};
 }
 function actions(item){var values=[];if(canInvalidate()&&isInvalidatableStatus(item.status))values.push('invalidate');if(canUnfreeze()&&restoration(item).ok)values.push('unfreeze');return values;}
 function locate(input){
  if(pending)return {type:'busy',message:'正在提交，请等待处理结果。'};
  invalidate();
  if(!canAccess())return {type:'forbidden',message:'当前角色未获卡券实例处理权限，无法查询或操作。'};
  var checked=validate(input);
  if(!checked.ok)return {type:'invalid',message:'请修正输入后重新校验。',errors:checked.errors};
  var found=matchesKey(checked.criteria);
  if(!found.length)return {type:'not_found',message:'未找到符合全部条件的卡券实例，请核对后重新查询。'};
  if(found.length!==1)return {type:'ambiguous',count:found.length,message:'卡券模板 ID＋核销码匹配到 '+found.length+' 个实例，无法唯一定位，本次不执行操作。'};
  if(!matches(checked.criteria).length)return {type:'not_found',message:'手机号或 VIN 与目标卡券不匹配，请核对后重新查询。'};
  var item=found[0];
  if(item.status==='invalidated')return {type:'already_invalidated',coupon:clone(item),message:'该实例已失效，无需重复操作。'};
  if(!isInvalidatableStatus(item.status))return {type:'rule_pending',coupon:clone(item),message:'该状态的处理规则待确认，本演示不执行操作。'};
  ticket={id:'DEMO-CHECK-'+(++serial),roleId:roleId,generation:generation,criteria:checked.criteria,version:item.version,status:item.status,freezeStatus:item.freezeStatus};
  return {type:'found',coupon:clone(item),ticket:ticket.id,actions:actions(item),restoration:restoration(item),message:'组合校验通过，已定位唯一卡券实例。'};
 }
 function log(action,result,item,reason,actor,before){audit.unshift({id:'DEMO-LOG-'+(audit.length+1),time:new Date(now()).toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'}),operator:actor.operator,role:actor.name,action:action,actionLabel:action==='unfreeze'?'解冻':'失效',templateId:item.templateId,redemptionCode:item.redemptionCode,phone:item.phone.slice(0,3)+'****'+item.phone.slice(-4),vin:item.vin.slice(0,3)+'**********'+item.vin.slice(-4),beforeStatus:before.status,beforeFreezeStatus:before.freezeStatus,afterFreezeStatus:result.indexOf('未知')>=0?null:item.freezeStatus,afterStatus:result.indexOf('未知')>=0?null:item.status,result:result,reason:String(reason||'').slice(0,300)});}
 function perform(action,ticketId,currentInput,reason){
  var label=action==='unfreeze'?'解冻':'失效';
  if(pending)return Promise.resolve({type:'busy',action:action,message:'请求正在处理中，请勿重复提交。'});
  if(!can(action))return Promise.resolve({type:'forbidden',action:action,message:'当前角色无'+label+'权限，未执行'+label+'。'});
  if(!ticket||ticket.id!==ticketId||!equal(ticket.criteria,currentInput)){invalidate();return Promise.resolve({type:'stale',action:action,message:'输入或定位结果已变化，请重新校验。'});}
  var request=clone(ticket),activeScenario=scenario,actor={name:role().name,operator:data.currentUser.name},run=++serial;pending=run;
  return new Promise(function(resolve){setTimeout(function(){
   if(generation!==request.generation||pending!==run){resolve({type:'reset',action:action,message:'本次演示已重置，请重新校验。'});return;}
   var targets=matchesKey(request.criteria),item=targets.length===1?targets[0]:null;
   if(activeScenario==='revoke')role().permissions=role().permissions.filter(function(p){return p!==permission(action);});
   if(activeScenario==='stale'&&item){item.freezeStatus=item.freezeStatus==='frozen'?'unfrozen':'frozen';item.version++;}
   var answer,restore=restoration(item);
   if(roleId!==request.roleId||!can(action))answer={type:'forbidden',message:'提交校验未通过：'+label+'权限已失效，未执行'+label+'。'};
   else if(!ticket||ticket.id!==request.id||!equal(ticket.criteria,currentInput))answer={type:'stale',message:'提交校验未通过：输入或定位结果已变化，请重新校验。'};
   else if(!item||matches(request.criteria).length!==1||item.version!==request.version||item.status!==request.status||item.freezeStatus!==request.freezeStatus||!isInvalidatableStatus(item.status)||(action==='unfreeze'&&item.freezeStatus!=='frozen'))answer={type:'stale',message:'提交校验未通过：实例状态或定位结果已变化，请重新校验。'};
   else if(action==='unfreeze'&&!restore.ok)answer={type:'rule_pending',coupon:clone(item),message:restore.message};
   else if(activeScenario==='failure'){log(action,label+'失败',item,reason,actor,{status:item.status,freezeStatus:item.freezeStatus});answer={type:'failed',message:label+'失败，实例状态未变更。请重新校验后再尝试。'};}
   else{
    var before={status:item.status,freezeStatus:item.freezeStatus};item.status=action==='unfreeze'?restore.status:'invalidated';if(action==='unfreeze')item.freezeStatus='unfrozen';item.version++;
    if(activeScenario==='unknown'){log(action,'结果未知，待核验',item,reason,actor,before);answer={type:'unknown',message:'暂未取得明确处理结果。请先重新核验实例状态，勿重复提交。'};}
    else{log(action,label+'成功',item,reason,actor,before);answer={type:'success',coupon:clone(item),message:action==='unfreeze'?'卡券解冻成功，冻结状态为未冻结，卡券状态为'+seed.statuses[item.status]+'，原有效期不变。':'卡券实例失效成功。'};}
   }
   answer.action=action;invalidate();pending=null;scenario='success';resolve(answer);
  },options.delay==null?500:options.delay);});
 }
 function execute(ticketId,currentInput,reason){return perform('invalidate',ticketId,currentInput,reason);}
 function unfreeze(ticketId,currentInput,reason){return perform('unfreeze',ticketId,currentInput,reason);}
 function snapshot(){return clone({coupons:data.coupons,roles:data.roles,roleId:roleId,scenario:scenario,ticket:ticket,pending:!!pending,audit:audit});}
 function sample(id){var s=seed.samples.find(function(x){return x.id===id;});if(!s)return null;var x=seed.coupons.find(function(x){return x.templateId===s.templateId&&x.redemptionCode===s.redemptionCode;});return Object.assign({phone:s.identity==='vin'?'':x.phone,vin:s.identity==='phone'?'':x.vin,templateId:x.templateId,redemptionCode:x.redemptionCode},s.override||{});}
 function simulatePermission(id,granted,action){var r=data.roles.find(function(x){return x.id===id;}),key=permission(action);if(!r)return false;r.permissions=r.permissions.filter(function(p){return p!==key;});if(granted)r.permissions.push(key);return true;}
 function simulateStatus(key,value){var found=matchesKey(key||{}),x=found.length===1?found[0]:null;if(!x||!seed.statuses[value])return false;x.status=value;x.version++;return true;}
 function simulateFreezeStatus(key,value){var found=matchesKey(key||{}),x=found.length===1?found[0]:null;if(!x||!seed.freezeStatuses[value])return false;x.freezeStatus=value;x.version++;return true;}
 function configurePermission(id,granted,unfreezeGranted){
  if(!canManageRoles())return {ok:false,type:'forbidden',message:'当前角色无权限配置功能授权。'};
  if(pending)return {ok:false,type:'busy',message:'当前有操作正在处理，请稍后配置。'};
  var target=data.roles.find(function(r){return r.id===id;});
  if(!target)return {ok:false,type:'not_found',message:'未找到该示例角色。'};
  if(target.canManageRoles)return {ok:false,type:'read_only',message:'权限管理员样例仅支持查看。'};
  if(typeof granted!=='boolean'||(unfreezeGranted!==undefined&&typeof unfreezeGranted!=='boolean'))return {ok:false,type:'invalid',message:'功能权限配置无效。'};
  simulatePermission(id,granted,'invalidate');if(unfreezeGranted!==undefined)simulatePermission(id,unfreezeGranted,'unfreeze');
  return {ok:true,type:'saved',role:clone(target),message:'角色功能权限已保存。'};
 }
 reset();
 return {reset:reset,snapshot:snapshot,role:function(){return clone(role());},canInvalidate:canInvalidate,canUnfreeze:canUnfreeze,canAccess:canAccess,canManageRoles:canManageRoles,restoration:restoration,setRole:setRole,setScenario:setScenario,invalidate:invalidate,validate:validate,locate:locate,execute:execute,unfreeze:unfreeze,sample:sample,simulatePermission:simulatePermission,simulateStatus:simulateStatus,simulateFreezeStatus:simulateFreezeStatus,configurePermission:configurePermission};
}
var api={createStore:createStore,normalize:normalize};if(typeof module==='object'&&module.exports)module.exports=api;root.DFNStore=api;
})(typeof window==='object'?window:globalThis);
