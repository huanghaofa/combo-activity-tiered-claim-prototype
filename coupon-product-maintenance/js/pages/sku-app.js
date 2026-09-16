(function(){
 'use strict';
 const D=window.SkuDomain,M=window.MockData,KEY='DFN_SKU_EXPORT_20260916_v1';
 const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let templates=D.clone(M.templates),draft=null,filter={id:'',name:''},mode='list',tid=M.templates[0].id,notice='',saveOutcome='success',syncOutcome='success',readToken=0;
 try{const raw=localStorage.getItem(KEY);if(raw){const saved=JSON.parse(raw);if(D.validStore(saved,M.templates))templates=saved;else notice='本地演示数据不兼容，已使用初始虚构数据。';}}catch(e){notice='本地存储不可用；保存时会提示，请保留当前页面。';}
 const current=()=>templates.find(t=>t.id===tid)||templates[0];
 const now=()=>new Date().toLocaleString('sv-SE',{hour12:false});
 function toast(message,bad=false){const e=$('#toast');e.textContent=message;e.classList.toggle('bad',bad);e.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>e.hidden=true,4200);}
 function persist(next){try{localStorage.setItem(KEY,JSON.stringify(next));templates=next;return true;}catch(e){toast('保存失败：浏览器本地存储不可用，已保存数据未改变。',true);return false;}}
 function replace(t){return persist(templates.map(x=>x.id===t.id?t:x));}
 function download(filename,text){const blob=new Blob([text],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function modal(title,body,footer){readToken++;const d=$('#modal');$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;$('#modal-foot').innerHTML=footer;if(!d.open)d.showModal();d.scrollTop=0;}
 function close(){readToken++;$('#modal').close();}
 function go(hash){if(draft&&draft.imports.length){modal('离开商品维护？','<p>本次未保存的商品变更将被放弃。原已保存集合保持不变。</p>','<button id="stay">继续维护</button><button id="leave" class="primary">放弃并离开</button>');$('#stay').onclick=close;$('#leave').onclick=()=>{draft=null;close();location.hash=hash;};}else{draft=null;location.hash=hash;}}
 function field(label,value,opt={}){return '<div class="field"><label'+(opt.id?' for="'+opt.id+'"':'')+'>'+(opt.required?'<em>*</em>':'')+esc(label)+'：</label><div class="field-content">'+(opt.raw||('<'+(opt.area?'textarea':'input')+' disabled'+(opt.id?' id="'+opt.id+'"':'')+' aria-label="'+esc(label)+'"'+(!opt.area?' value="'+esc(value)+'">': '>'+esc(value)+'</textarea>')))+(opt.help?'<div class="helper">'+esc(opt.help)+'</div>':'')+'</div></div>';}
 function renderList(){
  const rows=templates.filter(t=>t.id.toLowerCase().includes(filter.id.toLowerCase())&&t.name.includes(filter.name));
  return '<section class="panel"><div class="filters"><label>卡券ID：<input id="filter-id" value="'+esc(filter.id)+'" placeholder="请输入"></label><label>卡券名称：<input id="filter-name" value="'+esc(filter.name)+'" placeholder="请输入"></label><div class="inline"><button id="reset-filter">重置</button><button id="search" class="primary">查询</button></div></div></section><section class="panel"><div class="table-title"><h1>卡券列表</h1><span class="helper">2个虚构模板 · 本次增量：商品维护</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>序号</th><th>卡券</th><th>适用范围</th><th>核销说明</th><th>统计</th><th>系统时间</th><th>卡券状态</th><th>操作</th></tr></thead><tbody>'+rows.map((t,i)=>'<tr><td>'+(i+1)+'</td><td><div class="stack"><strong>'+esc(t.name)+'</strong><span>卡券ID：'+t.id+'</span><span>类型：'+t.type+'</span><span>面值：'+t.face+'</span><span>卡券归属：厂家（演示）</span></div></td><td>'+esc(t.scene)+'<br>商品SKU：'+t.saved.length+'个</td><td>'+t.redemption+'<br>'+t.threshold+'</td><td>发放 '+t.issued+'<br>领取 '+t.received+'</td><td>创建 '+t.created+'<br>更新 '+t.updated+'</td><td><span class="tag">已投放</span></td><td><div class="stack" data-anno="list-actions"><a href="#view/'+t.id+'">查看</a><a href="#maintain/'+t.id+'" class="maintain-link">商品维护</a><span class="inline"><button class="link" disabled title="原有功能，本次不演示">禁用</button><button class="link" disabled title="原有功能，本次不演示">复制</button></span></div></td></tr>').join('')+(rows.length?'':'<tr><td colspan="8" class="empty">暂无数据</td></tr>')+'</tbody></table></div><div class="table-foot">共 '+rows.length+' 条　　1 / 1 页</div></section><div class="notice small">评审提示：已投放模板的商品维护属于本次增量。空集合模板仅用于验证导出边界，不代表真实系统允许空商品投放。</div>';
 }
 function status(t){const label={success:'下游同步成功',failed:'下游同步失败',pending:'等待下游同步'}[t.sync];return '<div class="status-box '+t.sync+'" id="sync-status"><strong>'+label+'</strong><div class="status-meta">卡券中心已保存 V'+t.version+' · '+t.saved.length+' 个SKU；下游当前生效 V'+t.effectiveVersion+' · '+t.effective.length+' 个SKU</div>'+(t.sync!=='success'?'<div class="status-meta">新关系尚未在下游生效，继续使用上一成功版本。</div><button id="retry-sync" class="link">完成同步 / 重试（演示）</button>':'')+'</div>';}
 function sku(t,edit){
  const changes=draft?.imports||[];
  return '<div id="sku-area"><div class="associated-count">已关联<span id="saved-count">'+t.saved.length+'</span>个商品</div><div class="sku-tools inline"><button id="choose-products" '+(!edit?'disabled':'')+'>选择商品</button><button id="upload" class="primary" '+(!edit?'disabled':'')+'>上传文件</button><a class="btn" href="assets/templates/SKU导入模板.csv" download>下载模板</a><button id="export">导出已关联商品</button></div>'+(changes.length?'<div class="draft" id="draft-summary"><strong>本次商品草稿：待新增 '+(draft.ids.length-t.saved.length)+' 个商品</strong><p>保存后共 '+draft.ids.length+' 个。未保存草稿不进入导出。</p>'+changes.map(x=>'<div class="file-result">'+esc(x.fileName)+'：读取 '+x.total+'，成功 '+x.accepted.length+'，失败 '+x.failed+'</div>').join('')+'</div>':'')+'</div>';
 }
 function renderForm(t,edit){
  if(edit&&!draft)draft=D.draft(t);
  return '<div class="page-head"><div><h1>'+ (edit?'商品维护':'查看卡券')+' <span class="tag">已投放</span></h1><div class="subtitle">'+esc(t.name)+'　/　'+t.id+'</div></div><div class="page-actions"><button data-go="list">返回</button>'+(!edit?'<button class="primary" data-go="maintain/'+t.id+'">商品维护</button>':'')+'</div></div><div class="form-body">'+status(t)+'<section class="form-section" id="base-fields"><h2>基本信息</h2>'+field('卡券ID',t.id)+field('品牌',t.brand,{required:true,help:'首次提交后不可再编辑'})+field('创券来源',t.source,{required:true})+field('业务场景',t.scene,{required:true,help:'首次提交后不可再编辑'})+field('卡券分类',t.type,{required:true})+field('卡券名称',t.name,{required:true})+field('卡券图片','',{required:true,raw:'<div class="image-placeholder">原卡券图片占位<br>虚构展示</div>'})+field('面值',t.face,{required:true})+field('发放数量',t.quantity,{required:true})+'</section><section class="form-section"><h2>核销与适用范围</h2>'+field('核销方式',t.redemption,{required:true})+field('使用门槛',t.threshold)+field('适用车系/车型','当前商城场景不适用')+field('适用专营店','当前商城场景不适用')+field('适用商城商品','',{required:true,raw:sku(t,edit)})+field('使用须知',t.terms,{required:true,area:true})+'</section><section class="form-section"><h2>领取与有效期</h2>'+field('领取规则',t.limit)+field('领券时间',t.receiveTime)+field('核销时间',t.useTime)+'</section><section><h2>关联设置</h2>'+field('结算规则',t.settlement)+field('短信通知',t.sms,{required:true})+'</section>'+(edit?'<details class="demo-control"><summary>演示控制（评审专用）</summary><div class="inline"><label for="save-outcome">本次保存</label><select id="save-outcome"><option value="success">成功</option><option value="failed">失败</option></select><label for="sync-outcome">下游同步</label><select id="sync-outcome"><option value="success">成功</option><option value="failed">失败</option><option value="pending">待同步</option></select></div><p>仅改变本地演示结果。正式权限、审批、生效适用场景和接口合同待确认。</p></details>':'')+'</div><div class="form-foot" id="save-area">'+(edit?'<button data-go="view/'+t.id+'">取消</button><button id="save" class="primary" '+(!draft.imports.length?'disabled':'')+'>保存商品配置</button><span class="helper">仅保存商品关系；其他卡券字段保持原值。正式审批 / 重新发布要求待确认。</span>':'<button data-go="list">返回卡券列表</button>')+'</div>';
 }
 function showProducts(){
  const linked=new Set(draft.ids);
  modal('选择商品','<p class="helper">以下均为虚构商品。确认后加入商品草稿，请再保存商品配置。</p><div class="product-picker">'+M.catalog.map(p=>'<label class="product-option"><input type="checkbox" value="'+esc(p.id)+'" '+(linked.has(p.id)?'checked disabled':'')+'><span><strong>'+esc(p.name)+'</strong><span class="helper">'+esc(p.id)+(linked.has(p.id)?' · 已关联或已在草稿中':'')+'</span></span></label>').join('')+'</div>','<button id="cancel-products">取消</button><button id="confirm-products" class="primary" disabled>确认选择</button>');
  const selected=()=>Array.from(document.querySelectorAll('.product-picker input:checked:not(:disabled)'),e=>e.value);
  document.querySelectorAll('.product-picker input').forEach(e=>e.onchange=()=>$('#confirm-products').disabled=!selected().length);
  $('#cancel-products').onclick=close;
  $('#confirm-products').onclick=()=>{
   const ids=selected();if(!ids.length)return;
   const result=D.inspect('sku_id\r\n'+ids.join('\r\n')+'\r\n',draft.ids,M.catalog,'选择商品（本地演示）');
   if(!result.accepted.length){toast('所选商品未能关联，请重新选择。',true);return;}
   draft=D.applyImport(draft,result);close();render();$('#sku-area').scrollIntoView({block:'center'});
   toast('已加入 '+result.accepted.length+' 个商品到草稿'+(result.failed?'，'+result.failed+' 个未能关联':'')+'，请保存商品配置。');
  };
 }
 function showImport(){
  let result=null;modal('导入商品SKU','<div class="notice small">本地演示：真实解析CSV，按虚构商品目录模拟逐行写入结果；确认只进入草稿，保存后才纳入已保存成功集合。</div><div class="file-drop"><strong>上传SKU导入文件</strong><input id="sku-file" type="file" accept=".csv" aria-label="选择CSV文件"><div class="inline"><button id="demo-mixed">使用部分失败样例</button><button id="demo-failed">使用全部失败样例</button></div><div class="helper">第一行仅 sku_id；每行一个ID。只支持CSV，不模拟Excel成功。</div></div><div id="import-result" class="file-result"><p>尚未选择文件。</p></div>','<button id="cancel-import">取消</button><button id="confirm-import" class="primary" disabled>确认加入草稿</button>');
  const draw=(text,name)=>{try{result=D.inspect(text,draft.ids,M.catalog,name);$('#import-result').innerHTML='<p>'+esc(name)+'</p><div class="metrics"><div><strong>'+result.total+'</strong>读取行数</div><div class="success"><strong>'+result.accepted.length+'</strong>模拟成功</div><div class="error"><strong>'+result.failed+'</strong>未导入</div></div><p>重复 '+result.counts.duplicate+' · 格式错误 '+result.counts.format+' · 不存在 '+result.counts.missing+' · 模拟写入失败 '+result.counts.writeFailed+'</p><p>失败行不会加入草稿或导出。成功定义仍待业务确认。</p>';$('#confirm-import').disabled=!result.accepted.length;}catch(e){result=null;$('#import-result').innerHTML='<p class="error">'+esc(e.message)+'</p>';$('#confirm-import').disabled=true;}};
  $('#sku-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;const token=++readToken;result=null;$('#confirm-import').disabled=true;$('#import-result').textContent='正在读取文件…';if(!/\.csv$/i.test(file.name)){$('#import-result').textContent='仅支持 CSV 文件，Excel 尚未实现。';return;}try{const text=await file.text();if(token===readToken&&$('#modal').open)draw(text,file.name);}catch(e){if(token===readToken){$('#import-result').textContent='文件读取失败，请重新选择。';}}};
  $('#demo-mixed').onclick=()=>{readToken++;draw(M.mixedCsv,'部分失败演示.csv');};$('#demo-failed').onclick=()=>{readToken++;draw(M.allFailedCsv,'全部失败演示.csv');};$('#cancel-import').onclick=close;
  $('#confirm-import').onclick=()=>{if(!result?.accepted.length)return;draft=D.applyImport(draft,result);close();render();$('#sku-area').scrollIntoView({block:'center'});toast('已加入商品草稿，请保存商品配置。');};
 }
 function showExport(){
  const t=current(),ids=D.select(t,'saved','all');
  if(!ids.length){toast('暂无已关联商品可导出。');return;}
  download(t.id+'_已关联商品SKU.csv',D.skuListCsv(t));
  toast('已导出 '+ids.length+' 个已关联商品的SKU。');
 }
 function save(){
  if(saveOutcome==='failed'){toast('模拟保存失败，草稿已保留；已保存集合未改变。',true);return;}
  try{let t=D.commit(current(),draft,now());t=D.settle(t,syncOutcome);if(!replace(t))return;draft=null;location.hash='view/'+t.id;toast(syncOutcome==='success'?'商品配置已在本地保存，模拟同步成功。':'商品配置已在本地保存；下游尚未生效。');}catch(e){toast(e.message,true);}
 }
 function render(){
  const bits=location.hash.replace(/^#/,'').split('/');mode=['list','view','maintain'].includes(bits[0])?bits[0]:'list';tid=templates.some(t=>t.id===bits[1])?bits[1]:templates[0].id;
  if(draft&&(mode!=='maintain'||draft.id!==tid))draft=null;
  $('#breadcrumb').textContent='工作台 > 卡券中心 > 卡券列表'+(mode==='list'?'':' > '+(mode==='maintain'?'商品维护':'查看卡券'));
  $('#current-tab').textContent=mode==='list'?'卡券列表':mode==='maintain'?'商品维护':'查看卡券';
  $('#app').innerHTML=(notice?'<div class="notice small">'+esc(notice)+'</div>':'')+(mode==='list'?renderList():renderForm(current(),mode==='maintain'));
  if(mode==='list'){$('#search').onclick=()=>{filter={id:$('#filter-id').value.trim(),name:$('#filter-name').value.trim()};render();};$('#reset-filter').onclick=()=>{filter={id:'',name:''};render();};}
  else{$('#export').onclick=showExport;if(mode==='maintain'){$('#choose-products').onclick=showProducts;$('#upload').onclick=showImport;$('#save').onclick=save;$('#save-outcome').value=saveOutcome;$('#sync-outcome').value=syncOutcome;$('#save-outcome').onchange=e=>saveOutcome=e.target.value;$('#sync-outcome').onchange=e=>syncOutcome=e.target.value;}
   const retry=$('#retry-sync');if(retry)retry.onclick=()=>{if(replace(D.settle(current(),'success'))){render();toast('模拟重试成功，已切换完整关系版本。');}};
  }
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  if(window.AnnotationRuntime)window.AnnotationRuntime.refresh();
 }
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(draft?.imports.length&&a&&a.getAttribute('href')?.startsWith('#')){e.preventDefault();go(a.getAttribute('href').slice(1));}});
 window.addEventListener('hashchange',()=>{close();render();window.scrollTo(0,0);});
 window.addEventListener('beforeunload',e=>{if(draft?.imports.length){e.preventDefault();e.returnValue='';}});
 $('#modal').addEventListener('close',()=>readToken++);
 window.SkuApp={page:()=>mode};render();
})();
