(function(root){
'use strict';
var E=root.DFN.escape,I=root.DFN.icon,service=root.DFNStore.createStore(root.DFNMockData);
var app={service:service,ui:{criteria:{phone:'',vin:'',templateId:'',redemptionCode:''},result:null,feedback:null,busy:false},demoSample:'phone'};
app.route=function(){return location.hash.slice(1)||'void';};
app.clearVoid=function(){service.invalidate();app.ui.criteria={phone:'',vin:'',templateId:'',redemptionCode:''};app.ui.result=null;app.ui.feedback=null;};
app.openDemo=function(value){var panel=document.getElementById('demo-settings');panel.hidden=!value;document.getElementById('demo-toggle').setAttribute('aria-expanded',String(value));};
app.setRole=function(id){if(!service.setRole(id))return false;app.clearVoid();app.render();return true;};
app.setScenario=function(id){var ok=service.setScenario(id);if(ok)app.renderTools();return ok;};
app.fillSample=function(id){if(app.ui.busy)return false;var sample=service.sample(id);if(!sample)return false;app.demoSample=id;app.clearVoid();app.ui.criteria=sample;if(app.route()!=='void')location.hash='void';app.render();root.DFN.toast('虚构示例已填入，请点击“校验并定位”');return true;};
app.reset=function(){service.reset();app.ui.busy=false;app.demoSample='phone';app.clearVoid();var dialog=document.getElementById('void-confirm');if(dialog.open)dialog.close();location.hash='void';app.render();root.DFN.toast('本地虚构数据已重置');};
app.denied=function(message){return '<div class="denied" id="access-denied"><div class="empty-illustration">'+I('lock',34)+'</div><h1>暂无访问权限</h1><p>'+E(message||'当前角色未开通此功能，请联系权限管理员。')+'</p><button class="btn" id="denied-demo">打开演示设置</button></div>';};
app.renderTools=function(){
 var s=service.snapshot(),disabled=app.ui.busy?' disabled':'';
 document.getElementById('header-role').textContent=service.role().name;
 document.getElementById('demo-settings').innerHTML='<div class="demo-title"><strong>'+I('info',16)+' 演示设置</strong><span class="small muted">仅影响当前页面会话</span></div><div class="demo-grid"><div class="demo-field"><label for="current-role">示例身份</label><select id="current-role" class="form-select"'+disabled+'>'+s.roles.map(function(r){return '<option value="'+E(r.id)+'"'+(r.id===s.roleId?' selected':'')+'>'+E(r.name)+'</option>';}).join('')+'</select></div><div class="demo-field"><label for="demo-sample">虚构样例</label><div class="demo-input-group"><select id="demo-sample" class="form-select"'+disabled+'>'+root.DFNMockData.samples.map(function(x){return '<option value="'+x.id+'"'+(x.id===app.demoSample?' selected':'')+'>'+E(x.label)+'</option>';}).join('')+'</select><button class="btn" id="fill-sample"'+disabled+'>填入</button></div></div><div class="demo-field"><label for="demo-scenario">下次提交场景</label><select id="demo-scenario" class="form-select"'+disabled+'>'+root.DFNMockData.scenarios.map(function(x){return '<option value="'+x.id+'"'+(x.id===s.scenario?' selected':'')+'>'+E(x.label)+'</option>';}).join('')+'</select></div></div><div class="demo-description"><span>示例身份不代表正式授权名单；已冻结可解冻或作废，超期解冻后为已过期；手机号与 VIN 填写关系、已核销等状态策略及权限粒度仍待确认。</span><span id="scenario-description">'+E(root.DFNMockData.scenarios.find(function(x){return x.id===s.scenario;}).description)+'</span></div><div class="demo-foot"><span>刷新会清空会话数据。重置仅恢复虚构数据，不是业务撤销。</span><button class="text-button" id="reset-demo"'+disabled+'>重置本地演示</button></div>';
 document.getElementById('current-role').onchange=function(e){app.setRole(e.target.value);};
 document.getElementById('demo-sample').onchange=function(e){app.demoSample=e.target.value;};
 document.getElementById('fill-sample').onclick=function(){app.fillSample(document.getElementById('demo-sample').value);};
 document.getElementById('demo-scenario').onchange=function(e){app.setScenario(e.target.value);};
 document.getElementById('reset-demo').onclick=function(){app.reset();};
};
app.render=function(){
 var records=document.getElementById('operation-records');if(records.open)records.close();records.innerHTML='';
 var route=app.route(),rolesPage=route.indexOf('roles')===0,title=rolesPage?'角色管理':'卡券实例处理';
 app.renderTools();if(app.renderNav)app.renderNav();
 document.getElementById('breadcrumb').innerHTML='<span>工作台</span><span>›</span><span>'+(rolesPage?'系统管理':'卡券中心')+'</span><span>›</span><strong>'+title+'</strong>';
 document.getElementById('footer-page').textContent=title;document.title=title+' · DFN 卡券中心';
 var target=document.getElementById('app');
 if(route==='void'){
  if(!service.canAccess()){target.innerHTML=app.denied(app.ui.feedback&&app.ui.feedback.type==='forbidden'?app.ui.feedback.message:'当前角色未开通卡券实例处理功能，无法查询或执行处理。');}
  else{target.innerHTML=root.DFNPages.void.render(app);root.DFNPages.void.bind(app);}
 }else if(rolesPage&&root.DFNPages.roles){root.DFNPages.roles.show(app,route);}
 else{target.innerHTML='<div class="not-found"><h1>页面不存在</h1><a href="#void">返回卡券实例处理</a></div>';}
 var denied=document.getElementById('denied-demo');if(denied)denied.onclick=function(){app.openDemo(true);};
};
app.init=function(){
 document.getElementById('demo-toggle').onclick=function(){app.openDemo(document.getElementById('demo-settings').hidden);};
 root.addEventListener('hashchange',function(){if(!app.ui.busy){service.invalidate();app.ui.result=null;app.ui.feedback=null;}if(app.toggleMenu)app.toggleMenu(false);app.render();});
 app.render();
};
root.DFNApp=app;
root.DFNPrototype=Object.freeze({snapshot:service.snapshot,sample:service.sample,fillSample:app.fillSample,setRole:app.setRole,setScenario:app.setScenario,reset:app.reset,service:service,getUIState:function(){return root.DFN.clone(app.ui);}});
})(window);
