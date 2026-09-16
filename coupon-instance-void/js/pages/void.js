(function(root){
'use strict';
var E=root.DFN.escape,I=root.DFN.icon;
root.DFNPages=root.DFNPages||{};
var fields=[['phone','phone','手机号','请输入 11 位手机号',false],['vin','vin','VIN 码','请输入 17 位 VIN 码',false],['templateId','templateId','卡券模板 ID','请输入卡券模板 ID',true],['redeemCode','redemptionCode','核销码','请输入完整核销码',true]];
function statusBadge(status){var cls={unused:'blue',voided:'gray',frozen:'orange',expired:'gray',redeemed:'gray'};return '<span class="badge badge-'+(cls[status]||'orange')+'">'+E(root.DFNMockData.statuses[status]||status)+'</span>';}
function details(x,type){var status=(type==='unknown'?'待核验':type==='stale'?'待重新校验':null);return '<dl class="coupon-details">'+[['卡券模板 ID',x.templateId,true],['核销码',x.redemptionCode,true],['当前状态',status?'<span class="badge badge-orange">'+E(status)+'</span>':statusBadge(x.status),'html'],['卡券名称',x.name,false],['手机号',x.phone,true],['VIN 码',x.vin,true]].map(function(v){return '<div class="detail-item"><dt>'+v[0]+'</dt><dd'+(v[2]===true?' class="mono"':'')+'>'+(v[2]==='html'?v[1]:E(v[1]))+'</dd></div>';}).join('')+'</dl>';}
function render(app){return '<div class="page-heading"><div><div class="heading-title"><h1>卡券实例作废</h1><span class="badge badge-blue">单实例</span></div><p class="heading-subtitle">通过卡券模板 ID＋核销码确认实例，并校验手机号/VIN。</p></div></div><div class="page-body"><section class="card"><div class="card-heading"><h2><span class="step-number">1</span>定位卡券实例</h2></div><form id="locate-form" novalidate class="card-body"><div class="locate-grid">'+fields.map(function(f){return '<div class="form-field"><label for="'+f[0]+'">'+(f[4]?'<span class="required">*</span>':'')+f[2]+'</label><div><input class="form-input" id="'+f[0]+'" name="'+f[1]+'" autocomplete="off"'+(f[0]==='phone'?' inputmode="numeric"':'')+' placeholder="'+f[3]+'" value="'+E(app.ui.criteria[f[1]])+'" aria-describedby="error-'+f[0]+'" aria-invalid="false"'+(f[4]?' aria-required="true"':'')+(app.ui.busy?' disabled':'')+'><div class="field-error" id="error-'+f[0]+'"></div></div></div>';}).join('')+'</div><div class="query-footer"><p class="form-help">手机号与 VIN 填写关系待确认。当前演示至少填一项，同时填写须均匹配。</p><div class="button-row"><button type="button" class="btn" id="clear-form"'+(app.ui.busy?' disabled':'')+'>重置</button><button type="submit" class="btn btn-primary" id="locate-button"'+(app.ui.busy?' disabled':'')+'>'+I('search',15)+'校验并定位</button></div></div></form></section><section class="card"><div class="card-heading"><h2><span class="step-number">2</span>核对并作废</h2><span class="small muted">目标卡券实例</span></div><div class="result-region" id="result-region" aria-live="polite"></div></section><section class="card"><div class="card-heading"><div class="audit-header"><h2>本次会话操作记录</h2><span class="record-count">'+app.service.snapshot().audit.length+' 条</span></div><span class="small muted">建议项</span></div><div id="audit-region">'+auditHTML(app)+'</div></section></div>';}
function auditHTML(app){var rows=app.service.snapshot().audit;return '<div class="table-wrapper" tabindex="0" aria-label="本次会话操作记录，可横向滚动"><table class="audit-table"><thead><tr><th>操作时间</th><th>示例角色</th><th>卡券模板 ID</th><th>核销码</th><th>手机号</th><th>VIN 码</th><th>处理结果</th><th>作废原因</th></tr></thead><tbody>'+(rows.length?rows.map(function(x){return '<tr><td>'+E(x.time)+'</td><td>'+E(x.role)+'</td><td class="mono">'+E(x.templateId)+'</td><td class="mono">'+E(x.redemptionCode)+'</td><td class="mono">'+E(x.phone)+'</td><td class="mono">'+E(x.vin)+'</td><td>'+E(x.result)+'</td><td>'+E(x.reason||'—')+'</td></tr>';}).join(''):'<tr><td colspan="8" class="table-empty">暂无操作记录</td></tr>')+'</tbody></table></div>';}
function resultHTML(app){
 var result=app.ui.result,feedback=app.ui.feedback,active=feedback||result;
 if(!active)return '<div class="result-empty"><div class="empty-illustration">'+I('coupon',32)+'</div><h3>等待定位卡券实例</h3><p>填写上方条件并校验。未使用、已冻结、已过期的唯一实例可继续作废。</p></div>';
 var type=active.type,x=(feedback&&feedback.coupon)||(result&&result.coupon);
 var tone=type==='success'?'success':['unknown','rule_pending','ambiguous','already_voided','dirty','stale'].indexOf(type)>=0?'warning':type==='found'?'':'error';
 var title={found:'已定位唯一实例',success:'作废成功',unknown:'处理结果未知',failed:'作废失败',stale:'请重新校验',forbidden:'权限校验未通过',rule_pending:'处理规则待确认',already_voided:'实例已作废',not_found:'未找到匹配实例',ambiguous:'无法唯一定位',invalid:'输入校验未通过',dirty:'条件已变更'}[type]||'处理提示';
 var html='<div class="alert '+(tone?'alert-'+tone:'')+'" data-result-type="'+E(type)+'">'+I(type==='success'?'check':'info')+'<div><h3>'+title+'</h3><p>'+E(active.message)+'</p></div></div>';
 if(x)html+=details(x,type);
 if(type==='found'&&result&&result.ticket){html+='<div class="result-actions"><span class="muted">操作对象为当前实例，同模板其他实例保持不变。</span><div class="button-row"><button class="btn btn-danger" id="void-button"'+(app.ui.busy?' disabled':'')+'>'+(app.ui.busy?'正在处理…':'作废此实例')+'</button></div></div>';}
 else if(['unknown','failed','stale'].indexOf(type)>=0){html+='<div class="result-actions"><span class="muted">重新核验后再决定下一步操作。</span><button class="btn btn-primary" id="recheck-button">重新核验</button></div>';}
 else if(x){html+='<div class="result-actions"><span class="muted">'+(type==='success'?'本次仅作废当前实例。':type==='already_voided'?'不重复执行作废。':'该状态的处理方式待业务确认。')+'</span><button class="btn" disabled>'+(type==='success'||type==='already_voided'?'已作废':'暂不可作废')+'</button></div>';}
 else html+='<div style="height:24px"></div>';
 return html;
}
function drawResult(app){var region=document.getElementById('result-region');if(!region)return;region.innerHTML=resultHTML(app);var v=document.getElementById('void-button'),r=document.getElementById('recheck-button');if(v)v.addEventListener('click',function(){confirm(app);});if(r)r.addEventListener('click',function(){locate(app);});}
function clearErrors(){fields.forEach(function(f){var input=document.getElementById(f[0]),error=document.getElementById('error-'+f[0]);if(input)input.setAttribute('aria-invalid','false');if(error)error.textContent='';});}
function locate(app){
 if(app.ui.busy)return;clearErrors();app.ui.feedback=null;app.ui.result=app.service.locate(app.ui.criteria);
 if(app.ui.result.errors){fields.forEach(function(f){var error=app.ui.result.errors[f[1]];if(error){document.getElementById('error-'+f[0]).textContent=error;document.getElementById(f[0]).setAttribute('aria-invalid','true');}});var first=document.querySelector('[aria-invalid="true"]');if(first)first.focus();}
 drawResult(app);
}
function bind(app){
 fields.forEach(function(f){document.getElementById(f[0]).addEventListener('input',function(e){app.ui.criteria[f[1]]=e.target.value;app.service.invalidate();var had=!!app.ui.result;app.ui.result=null;app.ui.feedback=had||app.ui.feedback?{type:'dirty',message:'原定位结果已失效，请重新校验当前输入。'}:null;clearErrors();drawResult(app);});});
 document.getElementById('locate-form').addEventListener('submit',function(e){e.preventDefault();locate(app);});
 document.getElementById('clear-form').addEventListener('click',function(){app.clearVoid();app.render();document.getElementById('phone').focus();});
 drawResult(app);
}
function confirm(app){
 var result=app.ui.result;if(app.ui.busy||!result||!result.ticket||!app.service.canVoid())return;
 var x=result.coupon,dialog=document.getElementById('void-confirm');
 dialog.innerHTML='<div class="modal-header"><h2 id="confirm-title">确认作废该卡券实例？</h2><button class="icon-button" id="confirm-close" aria-label="关闭确认窗口">'+I('close',18)+'</button></div><div class="modal-body"><p class="modal-intro">请核对以下目标信息。本次操作只作用于这一卡券实例。</p><dl class="modal-target">'+[['卡券模板 ID',x.templateId],['核销码',x.redemptionCode],['卡券名称',x.name],['手机号',x.phone],['VIN 码',x.vin]].map(function(v){return '<dt>'+v[0]+'</dt><dd>'+E(v[1])+'</dd>';}).join('')+'</dl><label for="void-reason" class="reason-label"><span>作废原因 <span class="muted">（选填）</span></span><span class="muted small">最多 300 字</span></label><textarea class="form-textarea" id="void-reason" maxlength="300" placeholder="请输入本次作废原因"></textarea><p class="modal-suggestion">二次确认和原因留痕为评审建议，必填及审批规则待确认。</p></div><div class="modal-footer"><button class="btn" id="confirm-cancel">取消</button><button class="btn btn-danger" id="confirm-submit">确认作废</button></div>';
 function cancel(){if(!app.ui.busy)dialog.close();}
 document.getElementById('confirm-close').addEventListener('click',cancel);document.getElementById('confirm-cancel').addEventListener('click',cancel);
 dialog.oncancel=function(e){if(app.ui.busy)e.preventDefault();};
 document.getElementById('confirm-submit').addEventListener('click',function(){
  if(app.ui.busy)return;var reason=document.getElementById('void-reason').value;app.ui.busy=true;
  ['confirm-submit','confirm-cancel','confirm-close','void-reason'].forEach(function(id){document.getElementById(id).disabled=true;});document.getElementById('confirm-submit').textContent='正在处理…';app.render();
  app.service.execute(result.ticket,app.ui.criteria,reason).then(function(answer){app.ui.busy=false;app.ui.feedback=answer;if(app.ui.result)delete app.ui.result.ticket;dialog.close();app.render();var target=document.getElementById('result-region');if(target)target.scrollIntoView({block:'nearest'});});
 });
 dialog.showModal();document.getElementById('confirm-cancel').focus();
}
root.DFNPages.void={render:render,bind:bind,locate:locate,drawResult:drawResult};
})(window);
