(function(root){
'use strict';
var E=root.DFN.escape,I=root.DFN.icon;
var reviewNote='<p class="role-note">仅演示本次新增权限；现有角色字段与完整权限树待核对，正式接入需保留。</p>';
function hasPermission(role,action){return role.permissions.indexOf(action==='unfreeze'?root.DFNMockData.unfreezePermission:root.DFNMockData.permission)>=0;}
function list(app){
 var rows=app.service.snapshot().roles;
 return '<div class="page-heading"><div><h1>角色管理</h1><p class="heading-subtitle">查看角色信息，配置卡券实例失效、解冻功能权限。</p></div></div>'+reviewNote+'<div class="page-body"><section class="card"><div class="card-heading"><h2>角色列表 <span class="record-count">共 '+rows.length+' 个示例角色</span></h2></div><div class="table-wrapper" tabindex="0" aria-label="角色列表，可横向滚动"><table class="role-table"><thead><tr><th>序号</th><th>角色名称</th><th>角色编码</th><th>状态</th><th>卡券实例失效</th><th>卡券实例解冻</th><th>操作</th></tr></thead><tbody>'+rows.map(function(r,index){return '<tr data-role-id="'+E(r.id)+'"><td>'+(index+1)+'</td><td>'+E(r.name)+'</td><td class="mono">'+E(r.code)+'</td><td><span class="badge badge-green">'+E(r.status)+'</span></td><td><span class="badge '+(hasPermission(r)?'badge-blue':'badge-gray')+'">'+(hasPermission(r)?'已授权':'未授权')+'</span></td><td><span class="badge '+(hasPermission(r,'unfreeze')?'badge-blue':'badge-gray')+'">'+(hasPermission(r,'unfreeze')?'已授权':'未授权')+'</span></td><td><div class="button-row" style="justify-content:flex-start"><a href="#roles/view/'+E(r.id)+'" data-role-action="view">查看</a>'+(!r.canManageRoles?'<a href="#roles/edit/'+E(r.id)+'" data-role-action="edit">配置</a>':'<span class="small muted">仅查看</span>')+'</div></td></tr>';}).join('')+'</tbody></table></div></section></div>';
}
function detail(role,mode){
 var edit=mode==='edit',checked=hasPermission(role),title=edit?'配置角色权限':'查看角色';
 return '<div class="page-heading"><div><div class="heading-title"><h1>'+title+'</h1><span class="badge">'+(edit?'配置':'只读')+'</span></div><p class="heading-subtitle">'+E(role.name)+'</p></div><a class="btn" href="#roles" id="role-back">返回</a></div>'+reviewNote+'<div class="page-body"><section class="card"><div class="card-heading"><h2>基本信息</h2></div><div class="card-body role-info">'+[['角色名称',role.name],['角色编码',role.code],['角色状态',role.status],['角色说明',role.description]].map(function(v){return '<div class="role-field"><label>'+v[0]+'</label><p>'+E(v[1])+'</p></div>';}).join('')+'</div></section><section class="card"><div class="card-heading"><h2>功能权限</h2><span class="badge badge-blue">本次新增</span></div><div class="card-body"><div class="permission-tree"><div class="permission-parent">'+I('coupon',17)+'卡券中心</div><div class="permission-leaf"><input type="checkbox" id="permission-void"'+(checked?' checked':'')+(!edit?' disabled':'')+'><label for="permission-void"><span>卡券实例失效</span><span class="muted">允许访问卡券实例处理页面，并执行失效操作。</span></label></div><div class="permission-leaf"><input type="checkbox" id="permission-unfreeze"'+(hasPermission(role,'unfreeze')?' checked':'')+(!edit?' disabled':'')+'><label for="permission-unfreeze"><span>卡券实例解冻</span><span class="muted">允许访问卡券实例处理页面，并解冻已冻结卡券。</span></label></div></div><p class="form-help" style="margin-top:12px">'+(edit?'勾选后点击保存，对该示例角色生效。':'当前为查看状态，不能修改权限。')+'</p><div id="role-save-message" role="status" style="margin-top:12px"></div></div>'+(edit?'<div class="role-actions"><button class="btn" id="cancel-role">取消</button><button class="btn btn-primary" id="save-role">保存</button></div>':'<div class="role-actions"><a class="btn" href="#roles">返回列表</a>'+(!role.canManageRoles?'<a class="btn btn-primary" href="#roles/edit/'+E(role.id)+'">配置权限</a>':'')+'</div>')+'</section></div>';
}
function show(app,route){
 var target=document.getElementById('app');
 if(!app.service.canManageRoles()){target.innerHTML=app.denied('当前角色无角色权限配置权限，请联系权限管理员。');return;}
 if(route==='roles'){target.innerHTML=list(app);return;}
 var parts=route.split('/'),mode=parts[1],id=parts[2],role=app.service.snapshot().roles.find(function(r){return r.id===id;});
 if(parts.length!==3||!role||['view','edit'].indexOf(mode)<0){target.innerHTML='<div class="not-found"><h1>未找到该角色页面</h1><a href="#roles">返回角色列表</a></div>';return;}
 if(mode==='edit'&&role.canManageRoles){target.innerHTML=app.denied('权限管理员样例仅支持查看，请在角色列表中选择示例运营角色或示例普通角色进行配置。');return;}
 target.innerHTML=detail(role,mode);
 document.getElementById('breadcrumb').innerHTML+='<span>›</span><strong>'+(mode==='edit'?'配置':'查看')+'</strong>';
 if(mode==='edit'){
  document.getElementById('cancel-role').onclick=function(){location.hash='roles';};
  document.getElementById('save-role').onclick=function(){
   var result=app.service.configurePermission(role.id,document.getElementById('permission-void').checked,document.getElementById('permission-unfreeze').checked);
   if(result.ok){root.DFN.toast(result.message);location.hash='roles';}
   else{document.getElementById('role-save-message').textContent=result.message;}
  };
 }
}
root.DFNPages.roles={show:show};
})(window);
