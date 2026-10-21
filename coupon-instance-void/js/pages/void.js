(function(root){
'use strict';
var E=root.DFN.escape,I=root.DFN.icon;
root.DFNPages=root.DFNPages||{};
var fields=[['phone','phone','手机号','请输入 11 位手机号',false],['vin','vin','VIN 码','请输入 17 位 VIN 码',false],['templateId','templateId','卡券模板 ID','请输入卡券模板 ID',true],['redeemCode','redemptionCode','核销码','请输入完整核销码',true]];
function statusBadge(status){var cls={unused:'blue',invalidated:'gray',expired:'gray',redeemed:'gray'};return '<span class="badge badge-'+(cls[status]||'orange')+'">'+E(root.DFNMockData.statuses[status]||status)+'</span>';}
function freezeBadge(value){return '<span class="badge badge-'+(value==='frozen'?'orange':'gray')+'">'+E(root.DFNMockData.freezeStatuses[value]||'待核对')+'</span>';}
function stateChange(before,after,labels){return E(labels[before]||'待核对')+' → '+E(after===null?'待核验':labels[after]||'待核对');}
function formatDate(value){var d=new Date(value);return value&&Number.isFinite(d.getTime())?d.toLocaleString('zh-CN',{hour12:false,timeZone:'Asia/Shanghai'}):'待核对';}
function details(x,type){var status=(type==='unknown'?'待核验':type==='stale'?'待重新校验':null);return '<dl class="coupon-details">'+[['卡券模板 ID',x.templateId,true],['核销码',x.redemptionCode,true],['卡券名称',x.name,false],['卡券状态',status?'<span class="badge badge-orange">'+E(status)+'</span>':statusBadge(x.status),'html'],['冻结状态',status?'<span class="badge badge-orange">'+E(status)+'</span>':freezeBadge(x.freezeStatus),'html'],['手机号',x.phone,true],['VIN 码',x.vin,true],['有效期起',formatDate(x.validFrom),false],['有效期止',formatDate(x.validUntil),false]].map(function(v){return '<div class="detail-item"><dt>'+v[0]+'</dt><dd'+(v[2]===true?' class="mono"':'')+'>'+(v[2]==='html'?v[1]:E(v[1]))+'</dd></div>';}).join('')+'</dl>';}
function render(app){return '<div class="page-heading void-heading"><div><div class="heading-title"><h1>卡券实例处理</h1><span class="badge badge-blue">单实例</span></div><p class="heading-subtitle">通过卡券模板 ID＋核销码确认实例，并校验手机号/VIN。</p></div><button type="button" class="btn records-entry" id="operation-records-button" aria-haspopup="dialog" aria-controls="operation-records"'+(app.ui.busy?' disabled':'')+'>操作记录'+(app.service.snapshot().audit.length?'（'+app.service.snapshot().audit.length+'）':'')+'</button></div><div class="page-body"><section class="card"><div class="card-heading"><h2><span class="step-number">1</span>定位卡券实例</h2></div><form id="locate-form" novalidate class="card-body"><div class="locate-grid">'+fields.map(function(f){return '<div class="form-field"><label for="'+f[0]+'">'+(f[4]?'<span class="required">*</span>':'')+f[2]+'</label><div><input class="form-input" id="'+f[0]+'" name="'+f[1]+'" autocomplete="off"'+(f[0]==='phone'?' inputmode="numeric"':'')+' placeholder="'+f[3]+'" value="'+E(app.ui.criteria[f[1]])+'" aria-describedby="error-'+f[0]+'" aria-invalid="false"'+(f[4]?' aria-required="true"':'')+(app.ui.busy?' disabled':'')+'><div class="field-error" id="error-'+f[0]+'"></div></div></div>';}).join('')+'</div><div class="query-footer"><p class="form-help">手机号与 VIN 填写关系待确认。当前演示至少填一项，同时填写须均匹配。</p><div class="button-row"><button type="button" class="btn" id="clear-form"'+(app.ui.busy?' disabled':'')+'>重置</button><button type="submit" class="btn btn-primary" id="locate-button"'+(app.ui.busy?' disabled':'')+'>'+I('search',15)+'校验并定位</button></div></div></form></section><section class="card"><div class="card-heading"><h2><span class="step-number">2</span>核对并处理</h2><span class="small muted">目标卡券实例</span></div><div class="result-region" id="result-region" aria-live="polite"></div></section></div>';}
function auditHTML(app){var rows=app.service.snapshot().audit;return '<div class="table-wrapper" tabindex="0" aria-label="本次会话操作记录，可横向滚动"><table class="audit-table"><thead><tr><th>操作时间</th><th>操作人</th><th>示例角色</th><th>操作类型</th><th>卡券模板 ID</th><th>核销码</th><th>手机号</th><th>VIN 码</th><th>卡券状态</th><th>冻结状态</th><th>处理结果</th><th>操作原因</th></tr></thead><tbody>'+(rows.length?rows.map(function(x){var result=x.result+(x.action==='unfreeze'&&x.result==='解冻成功'?' · '+root.DFNMockData.statuses[x.afterStatus]:'');return '<tr><td>'+E(x.time)+'</td><td>'+E(x.operator)+'</td><td>'+E(x.role)+'</td><td>'+E(x.actionLabel)+'</td><td class="mono">'+E(x.templateId)+'</td><td class="mono">'+E(x.redemptionCode)+'</td><td class="mono">'+E(x.phone)+'</td><td class="mono">'+E(x.vin)+'</td><td>'+stateChange(x.beforeStatus,x.afterStatus,root.DFNMockData.statuses)+'</td><td>'+stateChange(x.beforeFreezeStatus,x.afterFreezeStatus,root.DFNMockData.freezeStatuses)+'</td><td>'+E(result)+'</td><td>'+E(x.reason||'—')+'</td></tr>';}).join(''):'<tr><td colspan="12" class="table-empty">暂无操作记录</td></tr>')+'</tbody></table></div>';}
function openRecords(app){
 if(app.ui.busy||app.route()!=='void'||!app.service.canAccess())return;
 var dialog=document.getElementById('operation-records');if(dialog.open)return;
 dialog.innerHTML='<div class="modal-header"><h2 id="records-title">操作记录</h2><button type="button" class="icon-button" id="records-close" aria-label="关闭操作记录">'+I('close',18)+'</button></div><div class="records-body"><p id="records-summary" class="records-summary">本次会话共 '+app.service.snapshot().audit.length+' 条记录，刷新页面后清空。</p><div id="audit-region">'+auditHTML(app)+'</div></div><div class="modal-footer"><button type="button" class="btn" id="records-done">关闭</button></div>';
 function close(){dialog.close();}
 document.getElementById('records-close').onclick=close;document.getElementById('records-done').onclick=close;
 dialog.onkeydown=function(e){if(e.key!=='Tab')return;var first=document.getElementById('records-close'),last=document.getElementById('records-done');if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};
 dialog.onclose=function(){if(dialog.open)return;dialog.innerHTML='';var trigger=document.getElementById('operation-records-button');if(trigger&&!trigger.disabled)trigger.focus();};
 dialog.showModal();document.getElementById('records-done').focus();
}
function resultHTML(app){
 var result=app.ui.result,feedback=app.ui.feedback,active=feedback||result;
 if(!active)return '<div class="result-empty"><div class="empty-illustration">'+I('coupon',32)+'</div><h3>等待定位卡券实例</h3><p>卡券状态为未使用或已过期时可失效；其中已冻结的卡券还可解冻。</p></div>';
 var type=active.type,x=(feedback&&feedback.coupon)||(result&&result.coupon),label=active.action==='unfreeze'?'解冻':'失效';
 var tone=type==='success'?'success':['unknown','rule_pending','ambiguous','already_invalidated','dirty','stale'].indexOf(type)>=0?'warning':type==='found'?'':'error';
 var title={found:'已定位唯一实例',success:label+'成功',unknown:'处理结果未知',failed:label+'失败',stale:'请重新校验',forbidden:'权限校验未通过',rule_pending:'处理规则待确认',already_invalidated:'实例已失效',not_found:'未找到匹配实例',ambiguous:'无法唯一定位',invalid:'输入校验未通过',dirty:'条件已变更'}[type]||'处理提示';
 var html='<div class="alert '+(tone?'alert-'+tone:'')+'" data-result-type="'+E(type)+'">'+I(type==='success'?'check':'info')+'<div><h3>'+title+'</h3><p>'+E(active.message)+'</p></div></div>';
 if(x)html+=details(x,type);
 if(type==='found'&&result&&result.ticket){
  var allowed=result.actions||[],buttons='',note='操作对象为当前实例，同模板其他实例保持不变。';
  if(allowed.indexOf('unfreeze')>=0){buttons+='<button class="btn btn-primary" id="unfreeze-button"'+(app.ui.busy?' disabled':'')+'>解冻此实例</button>';note='解冻后为未冻结，卡券状态按有效期恢复，原有效期不变。';}
  if(allowed.indexOf('invalidate')>=0)buttons+='<button class="btn btn-danger" id="void-button"'+(app.ui.busy?' disabled':'')+'>失效此实例</button>';
  if(x.freezeStatus==='frozen'&&result.restoration&&!result.restoration.ok)note=result.restoration.message;
  else if(!allowed.length)note='当前角色未获该实例可执行操作的权限。';
  html+='<div class="result-actions"><span class="muted">'+E(note)+'</span><div class="button-row">'+buttons+'</div></div>';
 }else if(['unknown','failed','stale'].indexOf(type)>=0||(type==='success'&&active.action==='unfreeze')){
  html+='<div class="result-actions"><span class="muted">'+(type==='success'?'本次仅解冻当前实例，原有效期不变。':'重新核验后再决定下一步操作。')+'</span><button class="btn btn-primary" id="recheck-button">重新核验</button></div>';
 }else if(x){html+='<div class="result-actions"><span class="muted">'+(type==='success'?'本次仅失效当前实例。':type==='already_invalidated'?'不重复执行失效。':type==='forbidden'?'当前角色无此操作权限。':'该状态的处理方式待业务确认。')+'</span><button class="btn" disabled>'+(type==='success'||type==='already_invalidated'?'已失效':'暂不可操作')+'</button></div>';}
 else html+='<div style="height:24px"></div>';
 return html;
}
function drawResult(app){var region=document.getElementById('result-region');if(!region)return;region.innerHTML=resultHTML(app);var v=document.getElementById('void-button'),u=document.getElementById('unfreeze-button'),r=document.getElementById('recheck-button');if(v)v.addEventListener('click',function(){confirm(app,'invalidate');});if(u)u.addEventListener('click',function(){confirm(app,'unfreeze');});if(r)r.addEventListener('click',function(){locate(app);});}
function clearErrors(){fields.forEach(function(f){var input=document.getElementById(f[0]),error=document.getElementById('error-'+f[0]);if(input)input.setAttribute('aria-invalid','false');if(error)error.textContent='';});}
function locate(app){
 if(app.ui.busy)return;clearErrors();app.ui.feedback=null;app.ui.result=app.service.locate(app.ui.criteria);
 if(app.ui.result.errors){fields.forEach(function(f){var error=app.ui.result.errors[f[1]];if(error){document.getElementById('error-'+f[0]).textContent=error;document.getElementById(f[0]).setAttribute('aria-invalid','true');}});var first=document.querySelector('[aria-invalid="true"]');if(first)first.focus();}
 drawResult(app);
}
function bind(app){
 document.getElementById('operation-records-button').addEventListener('click',function(){openRecords(app);});
 fields.forEach(function(f){document.getElementById(f[0]).addEventListener('input',function(e){app.ui.criteria[f[1]]=e.target.value;app.service.invalidate();var had=!!app.ui.result;app.ui.result=null;app.ui.feedback=had||app.ui.feedback?{type:'dirty',message:'原定位结果已失效，请重新校验当前输入。'}:null;clearErrors();drawResult(app);});});
 document.getElementById('locate-form').addEventListener('submit',function(e){e.preventDefault();locate(app);});
 document.getElementById('clear-form').addEventListener('click',function(){app.clearVoid();app.render();document.getElementById('phone').focus();});
 drawResult(app);
}
function confirm(app,action){
 var result=app.ui.result,unfreeze=action==='unfreeze',label=unfreeze?'解冻':'失效';
 if(app.ui.busy||!result||!result.ticket||(unfreeze?!app.service.canUnfreeze():!app.service.canInvalidate())||(result.actions||[]).indexOf(action)<0)return;
 var x=result.coupon,dialog=document.getElementById('void-confirm'),restore=app.service.restoration(x);
 if(unfreeze&&!restore.ok){app.ui.feedback={type:'rule_pending',action:action,message:restore.message};drawResult(app);return;}
 var target=[['卡券模板 ID',x.templateId],['核销码',x.redemptionCode],['卡券名称',x.name],['手机号',x.phone],['VIN 码',x.vin],['卡券状态',root.DFNMockData.statuses[x.status]],['冻结状态',root.DFNMockData.freezeStatuses[x.freezeStatus]]];
 if(unfreeze)target.push(['有效期起',formatDate(x.validFrom)],['有效期止',formatDate(x.validUntil)]);
 dialog.innerHTML='<div class="modal-header"><h2 id="confirm-title">确认'+label+'该卡券实例？</h2><button class="icon-button" id="confirm-close" aria-label="关闭确认窗口">'+I('close',18)+'</button></div><div class="modal-body"><p class="modal-intro">请核对以下目标信息。本次操作只作用于这一卡券实例。</p><dl class="modal-target">'+target.map(function(v){return '<dt>'+v[0]+'</dt><dd>'+E(v[1])+'</dd>';}).join('')+'</dl>'+(unfreeze?'<div class="restore-preview" id="restore-preview"><strong>卡券状态预计恢复为：'+E(root.DFNMockData.statuses[restore.status])+'</strong><p>'+(restore.status==='expired'?'该卡券已超出有效期，解冻后仍不可使用。':'有效期内恢复为未使用。')+'冻结状态将变为未冻结。原有效期不变，提交时重新判断。</p></div>':'')+'<label for="void-reason" class="reason-label"><span>'+label+'原因 <span class="muted">（选填）</span></span><span class="muted small">最多 300 字</span></label><textarea class="form-textarea" id="void-reason" maxlength="300" placeholder="请输入本次'+label+'原因"></textarea><p class="modal-suggestion">二次确认和原因留痕为评审建议，必填及审批规则待确认。</p></div><div class="modal-footer"><button class="btn" id="confirm-cancel">取消</button><button class="btn '+(unfreeze?'btn-primary':'btn-danger')+'" id="confirm-submit">确认'+label+'</button></div>';
 function cancel(){if(!app.ui.busy)dialog.close();}
 document.getElementById('confirm-close').addEventListener('click',cancel);document.getElementById('confirm-cancel').addEventListener('click',cancel);
 dialog.oncancel=function(e){if(app.ui.busy)e.preventDefault();};
 dialog.onkeydown=function(e){if(e.key!=='Tab')return;var first=document.getElementById('confirm-close'),last=document.getElementById('confirm-submit');if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};
 document.getElementById('confirm-submit').addEventListener('click',function(){
  if(app.ui.busy)return;var reason=document.getElementById('void-reason').value;app.ui.busy=true;
  ['confirm-submit','confirm-cancel','confirm-close','void-reason'].forEach(function(id){document.getElementById(id).disabled=true;});document.getElementById('confirm-submit').textContent='正在处理…';app.render();
  var submit=unfreeze?app.service.unfreeze:app.service.execute;
  submit(result.ticket,app.ui.criteria,reason).then(function(answer){app.ui.busy=false;app.ui.feedback=answer;if(app.ui.result)delete app.ui.result.ticket;dialog.close();app.render();var target=document.getElementById('result-region');if(target)target.scrollIntoView({block:'nearest'});});
 });
 dialog.showModal();document.getElementById('confirm-cancel').focus();
}
root.DFNPages.void={render:render,bind:bind,locate:locate,drawResult:drawResult};
})(window);
