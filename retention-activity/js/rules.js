(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ActivityRules=factory();})(typeof window==='undefined'?this:window,function(){
  'use strict';
  const all=['person','car','both'];
  const onlineScenes={bimc:'BIMC（新）',maintenance:'维修保养（新）'};
  function onlineScene(scene){return Object.hasOwn(onlineScenes,scene);}
  function isMall(f){return f.subjects.some(x=>x==='mallAfter'||x==='mallNearby');}
  // 展示范围沿用本次 SIT 观察；只影响当前新建表单，不修改历史数据。
  function admissionVisible(f){return f.trigger==='active';}
  function effectiveLevel(f){return admissionVisible(f)?f.level:'';}
  function optional(f){return f.trigger==='behavior'||isMall(f);}
  function allowed(f){
    if(effectiveLevel(f)==='number')return ['person'];
    if(f.subjects.includes('mallNearby'))return ['person'];
    return all.slice();
  }
  function identifiers(attribute){return attribute==='person'?['oneid']:attribute==='car'?['VIN']:attribute==='both'?['oneid','VIN']:[];}
  function normalize(f,applyTypeDefault){
    const next={...f,subjects:f.subjects.slice(),checkpoints:f.checkpoints.slice()};
    if(applyTypeDefault){
      if(next.subjects.includes('mallNearby'))next.attribute='person';
      else if(next.trigger==='active')next.attribute='car';
    }
    const choices=allowed(next);
    if(next.attribute&&!choices.includes(next.attribute))next.attribute='person';
    if(!next.attribute&&!optional(next)&&effectiveLevel(next)==='number')next.attribute='person';
    return next;
  }
  function couponIssue(f,c){
    if(!c)return '卡券信息不可用，请重新选择';
    if(effectiveLevel(f)!=='number')return '';
    const reasons=[];
    if(c.receiveRule!=='user')reasons.push('领取规则需为“用户”');
    if(onlineScene(c.scene)&&c.method!=='线上核销')reasons.push(onlineScenes[c.scene]+'仅允许“线上核销”（当前：'+(c.method||'未配置')+'）');
    return reasons.join('；');
  }
  function couponAllowed(f,c){return !!c&&!couponIssue(f,c);}
  function conflicts(f,coupons){return (f.couponConfigs||[]).filter(x=>x.couponId).flatMap(x=>{
    const c=coupons.find(c=>c.id===x.couponId);
    return couponAllowed(f,c)?[]:[{key:x.key,id:x.couponId,name:c?c.name:x.couponId,reason:couponIssue(f,c)}];
  });}
  function validate(f,coupons){
    const errors=[];
    if(f.attribute&&!allowed(f).includes(f.attribute))errors.push('当前准入等级或活动类型不支持所选活动属性');
    if(!optional(f)&&!f.attribute)errors.push('请选择活动属性');
    const bad=conflicts(f,coupons);
    if(bad.length)errors.push(...bad.map(c=>c.name+'：'+c.reason+'。请返回 step2 重新选择'));
    return errors;
  }
  function queryCoupons(coupons,request){
    // 活动中心后端的本地查询替身：读取卡券数据并过滤，再统计总数和分页。未接入真实接口。
    const size=Math.max(1,Number(request.pageSize)||4), page=Math.max(1,Number(request.page)||1);
    if(!request.scene)return {items:[],total:0,page,pageSize:size};
    const filtered=coupons.filter(c=>c.scene===request.scene)
      .filter(c=>request.receiveRule!=='user'||c.receiveRule==='user')
      .filter(c=>request.method!=='线上核销'||c.method==='线上核销')
      .filter(c=>!request.id||c.id.toLowerCase().includes(request.id.trim().toLowerCase()))
      .filter(c=>!request.name||c.name.toLowerCase().includes(request.name.trim().toLowerCase()));
    return {items:filtered.slice((page-1)*size,page*size),total:filtered.length,page,pageSize:size};
  }
  function queryFor(f,filters){const number=effectiveLevel(f)==='number';return {...filters,receiveRule:number?'user':null,method:number&&onlineScene(filters.scene)?'线上核销':null};}
  return {isMall,admissionVisible,effectiveLevel,optional,allowed,identifiers,normalize,onlineScene,couponIssue,couponAllowed,conflicts,validate,queryCoupons,queryFor};
});
