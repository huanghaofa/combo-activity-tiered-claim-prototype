(function(){
  'use strict';
  const root=document.getElementById('review-resource');
  const labels={prototype:'交互原型',doc:'需求文档',features:'功能清单',flows:'流程图'};
  const positions={prototype:0,doc:0,features:0,flows:0};
  let view='prototype',lastStep='#step1',ledger='features',flow='collaboration';
  const zoom={collaboration:100,filter:100};
  function stepHash(){const step=document.querySelector('.steps [aria-selected="true"]');return step?'#step'+step.dataset.step:lastStep;}
  function route(hash){const m=hash.match(/^#review-(doc|features|flows)(?:\/([\w-]+))?$/);return m?{view:m[1],detail:m[2]||''}:{view:'prototype',detail:''};}
  function show(next,detail='',remember=true){
    if(remember){positions[view]=window.scrollY;if(view==='prototype')lastStep=stepHash();}
    view=next;const resources=next!=='prototype';
    document.body.classList.toggle('review-resources',resources);root.hidden=!resources;
    document.querySelectorAll('[data-review-panel]').forEach(p=>p.hidden=p.dataset.reviewPanel!==next);
    document.querySelectorAll('[data-review-view]').forEach(a=>{if(a.dataset.reviewView===next)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.title='保客活动 · '+labels[next]+' · 准入联动评审';
    if(next==='features')selectLedger(['features','acceptance','questions'].includes(detail)?detail:'features');
    if(next==='flows')selectFlow(['collaboration','filter'].includes(detail)?detail:'collaboration');
    if(next==='doc'){
      document.querySelectorAll('.review-toc a').forEach(a=>a.classList.toggle('active',a.dataset.reviewDetail===detail));
      const target=detail&&document.getElementById('review-doc-'+detail);
      if(target){requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}else window.scrollTo(0,positions[next]);
    }else window.scrollTo(0,positions[next]);
    window.dispatchEvent(new Event('resize'));
  }
  function selectLedger(name){
    ledger=name;
    document.querySelectorAll('.review-ledger-panel').forEach(p=>p.hidden=p.dataset.ledger!==name);
    document.querySelectorAll('[data-ledger-link]').forEach(a=>{if(a.dataset.ledgerLink===name)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.getElementById('review-owner-wrap').hidden=name!=='features';
    filterRows();
  }
  function filterRows(){
    const keyword=document.getElementById('review-search').value.trim().toLowerCase();
    const owner=document.getElementById('review-owner').value;
    const panel=document.querySelector('[data-ledger="'+ledger+'"]');let count=0;
    panel.querySelectorAll('tbody tr').forEach(row=>{row.hidden=!(row.textContent.toLowerCase().includes(keyword)&&(ledger!=='features'||!owner||row.dataset.owner===owner));if(!row.hidden)count++;});
    const total=panel.querySelectorAll('tbody tr').length;
    document.getElementById('review-result-count').textContent='显示 '+count+' / '+total+' 项';
    panel.querySelector('.review-empty').hidden=count!==0;
  }
  function selectFlow(name){flow=name;document.querySelectorAll('.review-flow-panel').forEach(p=>p.hidden=p.dataset.flow!==name);document.querySelectorAll('[data-flow-link]').forEach(a=>{if(a.dataset.flowLink===name)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
  document.addEventListener('click',function(e){
    const link=e.target.closest('a[data-review-view],a[data-review-detail],a[data-ledger-link],a[data-flow-link]');
    if(link&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){
      e.preventDefault();const next=link.dataset.reviewView||view;
      const detail=link.dataset.reviewDetail||link.dataset.ledgerLink||link.dataset.flowLink||'';
      if(view==='prototype')lastStep=stepHash();
      const hash=next==='prototype'?lastStep:'#review-'+next+(detail?'/'+detail:'');
      if(location.hash!==hash)history.pushState(null,'',hash);
      show(next,detail);return;
    }
    const button=e.target.closest('button[data-review-zoom]');
    if(button){const pane=button.closest('.review-flow-panel');const name=pane.dataset.flow;zoom[name]=button.dataset.reviewZoom==='fit'?100:Math.max(50,Math.min(300,zoom[name]+Number(button.dataset.reviewZoom)));pane.querySelector('.review-flow-canvas img').style.width=zoom[name]+'%';pane.querySelector('.review-zoom-value').textContent=zoom[name]+'%';pane.querySelector('[data-review-zoom="-25"]').disabled=zoom[name]===50;pane.querySelector('[data-review-zoom="25"]').disabled=zoom[name]===300;if(button.dataset.reviewZoom==='fit'){const canvas=pane.querySelector('.review-flow-canvas');canvas.scrollTo(0,0);}}
  });
  document.getElementById('review-search').addEventListener('input',filterRows);
  document.getElementById('review-owner').addEventListener('change',filterRows);
  window.addEventListener('hashchange',()=>{const next=route(location.hash);show(next.view,next.detail);});
  const initial=route(location.hash);lastStep=stepHash();show(initial.view,initial.detail,false);
})();
