(function(g){
  'use strict';
  const clone=x=>JSON.parse(JSON.stringify(x));
  function parseCsv(text){
    text=String(text).replace(/^\uFEFF/,'');let rows=[],row=[],field='',quoted=false,closed=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(quoted){if(c==='"'){if(text[i+1]==='"'){field+='"';i++;}else{quoted=false;closed=true;}}else field+=c;continue;}
      if(c==='"'){if(field||closed)throw Error('CSV 引号格式错误');quoted=true;continue;}
      if(closed&&c!==','&&c!=='\r'&&c!=='\n')throw Error('CSV 引号后存在异常内容');
      if(c===','){row.push(field);field='';closed=false;}
      else if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);rows.push(row);row=[];field='';closed=false;}
      else field+=c;
    }
    if(quoted)throw Error('CSV 引号未闭合');
    if(field||row.length||closed){row.push(field);rows.push(row);}
    if(!rows.length||rows[0].length!==1||rows[0][0].trim().toLowerCase()!=='sku_id')throw Error('请使用只有 sku_id 一列的 CSV 导入模板');
    return rows.slice(1);
  }
  function inspect(text,existing,catalog,fileName){
    const rows=parseCsv(text),seen=new Set(existing),map=new Map(catalog.map(x=>[x.id,x]));
    const accepted=[],errors=[],counts={duplicate:0,format:0,missing:0,writeFailed:0};
    rows.forEach((r,i)=>{
      const id=(r[0]||'').trim();let reason='';
      if(r.length!==1||!id||!/^[-A-Za-z0-9_]+$/.test(id))reason='format';
      else if(seen.has(id))reason='duplicate';
      else if(!map.has(id))reason='missing';
      else if(!map.get(id).writable)reason='writeFailed';
      if(reason){counts[reason]++;errors.push({row:i+2,id,reason});}
      else{seen.add(id);accepted.push(id);}
    });
    return {fileName,total:rows.length,accepted,errors,counts,failed:errors.length};
  }
  function draft(t){return {id:t.id,baseVersion:t.version,ids:t.saved.slice(),imports:[]};}
  function applyImport(d,r){if(!r.accepted.length)throw Error('没有可导入的成功 SKU');const n=clone(d);n.ids=[...new Set([...d.ids,...r.accepted])];n.imports.push(clone(r));return n;}
  function commit(t,d,now){
    if(d.id!==t.id||d.baseVersion!==t.version)throw Error('演示版本已变化，请重新进入商品维护');
    if(!d.imports.length)throw Error('尚无商品变更');
    const n=clone(t);n.saved=d.ids.slice();n.version++;n.sync='pending';n.updated=now;
    for(const item of d.imports)n.batches.push({...clone(item),id:'DEMO-B'+String(n.batches.length+1).padStart(3,'0'),savedVersion:n.version});
    n.audit.push({version:n.version,before:t.saved.length,after:n.saved.length,time:now});return n;
  }
  function settle(t,outcome){const n=clone(t);n.sync=outcome;if(outcome==='success'){n.effective=n.saved.slice();n.effectiveVersion=n.version;}return n;}
  function select(t,basis,batch){
    if(!['saved','effective'].includes(basis))throw Error('未知成功口径');let ids=t[basis].slice();
    if(batch&&batch!=='all'){const b=t.batches.find(x=>x.id===batch);if(!b)throw Error('导入批次不存在');const accepted=new Set(b.accepted);ids=ids.filter(id=>accepted.has(id));}
    return [...new Set(ids)];
  }
  function cell(value){let s=String(value??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function csv(t,basis,batch,now){
    const ids=select(t,basis,batch),label=basis==='saved'?'卡券中心保存成功':'下游同步成功',version=basis==='saved'?t.version:t.effectiveVersion;
    const rows=[['SKU ID','卡券模板ID','成功口径','关系版本','导出范围','导出时间'],...ids.map(id=>[id,t.id,label,'V'+version,batch==='all'?'当前模板全部':batch,now])];
    return '\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')+'\r\n';
  }
  function skuListCsv(t){return '\uFEFF'+[['sku_id'],...select(t,'saved','all').map(id=>[id])].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';}
  function validStore(value,seed){return Array.isArray(value)&&value.length===seed.length&&value.every((t,i)=>t.id===seed[i].id&&t.relationType==='SKU'&&Array.isArray(t.saved)&&Array.isArray(t.effective)&&Array.isArray(t.batches)&&Array.isArray(t.audit)&&Number.isInteger(t.version)&&Number.isInteger(t.effectiveVersion)&&['pending','failed','success'].includes(t.sync));}
  g.SkuDomain={clone,parseCsv,inspect,draft,applyImport,commit,settle,select,csv,skuListCsv,cell,validStore};
  if(typeof module!=='undefined')module.exports=g.SkuDomain;
})(typeof window!=='undefined'?window:globalThis);
