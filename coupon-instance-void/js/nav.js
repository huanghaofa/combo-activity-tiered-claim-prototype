(function(root){
'use strict';
var app=root.DFNApp,I=root.DFN.icon;
app.renderNav=function(){var route=app.route(),html='';if(app.service.canVoid())html+='<div class="nav-group">'+I('coupon',17)+'卡券中心</div><a class="nav-link'+(route==='void'?' active':'')+'" id="nav-void" href="#void"'+(route==='void'?' aria-current="page"':'')+'>卡券实例作废</a>';if(app.service.canManageRoles()&&root.DFNPages.roles)html+='<div class="nav-group">'+I('shield',17)+'系统管理</div><a class="nav-link'+(route.indexOf('roles')===0?' active':'')+'" id="nav-roles" href="#roles"'+(route.indexOf('roles')===0?' aria-current="page"':'')+'>角色管理</a>';document.getElementById('main-nav').innerHTML=html||'<div class="nav-empty">当前角色暂无可访问的功能</div>';};
app.toggleMenu=function(open){var small=root.innerWidth<=760;if(!small){if(open)root.DFN.toast('当前为展开导航模式');return;}document.getElementById('sidebar').classList.toggle('open',open);document.getElementById('sidebar-backdrop').hidden=!open;document.getElementById('menu-toggle').setAttribute('aria-expanded',String(open));};
document.getElementById('menu-toggle').onclick=function(){app.toggleMenu(!document.getElementById('sidebar').classList.contains('open'));};
document.getElementById('sidebar-backdrop').onclick=function(){app.toggleMenu(false);};
root.addEventListener('keydown',function(e){if(e.key==='Escape')app.toggleMenu(false);});
root.addEventListener('resize',function(){if(root.innerWidth>760){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-backdrop').hidden=true;document.getElementById('menu-toggle').setAttribute('aria-expanded','false');}});
root.getCurrentPage=function(){return app.route();};root.navigateTo=function(page){location.hash=page;};
app.init();
})(window);
