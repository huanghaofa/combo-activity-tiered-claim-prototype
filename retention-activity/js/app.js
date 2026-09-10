(function(){
  'use strict';
  const R=window.ActivityRules,C=window.DemoCoupons;
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const levels={number:'号码级',bound:'绑车级',certified:'认证级'};
  const attrs={person:'选人',car:'选车',both:'选人+车'};
  const subjects={maker:'厂家-->用户',makerStore:'厂家+店端-->用户',store:'店端-->用户',mallAfter:'商城 售后',mallNearby:'商城 周边'};
  const triggers={push:'后台统一推送',behavior:'用户行为触发',active:'C端主动参与活动',claim:'C端主动领取'};
  const key='dfn-admission-review-20260910-draft';
  let counter=1,step=Number(location.hash.replace('#step',''))||1,section='base',pageStep=1,dialog=null,toastTimer;
  let f={old:'no',brand:'东风日产',name:'',business:'维保活动',prize:'卡券中心-卡券',start:'',end:'',subjects:['maker'],trigger:'active',subtype:'',channels:[],mallChannels:[],mallBusiness:'',pv:'',policy:'',subsidy:'',status:'',level:'',checkpoints:[],attribute:'car',crowds:[],pushMode:'',claimMode:'manual',claimDetail:'',strategy:'',mutex:'no',couponConfigs:[newCoupon()],shareTitle:'',shareDescription:'',seoTitle:'',seoKeywords:'',seoDescription:'',cover:'',shareApp:'',shareMini:'',unstarted:'no',ended:'no',successBackground:'',successCopy:'',hotspots:[]};
  function newCoupon(){return {key:counter++,couponId:'',quantity:1,execute:'',receiveLimit:'',issueLimit:'',limitMode:'limit'};}
  function radio(name,value,label,disabled=false,selected){const checked=selected===undefined?f[name]===value:selected;
    return `<label class="choice ${disabled?'disabled':''}"><input type="radio" name="${esc(name)}" data-field="${esc(name)}" value="${esc(value)}" ${checked?'checked':''} ${disabled?'disabled':''}>${esc(label)}</label>`;}
  function check(name,value,label,disabled=false){return `<label class="choice ${disabled?'disabled':''}"><input type="checkbox" data-field="${esc(name)}" value="${esc(value)}" ${Array.isArray(f[name])&&f[name].includes(value)?'checked':''} ${disabled?'disabled':''}>${esc(label)}</label>`;}
  function radios(name,items,disabled=[]){return `<div class="choices">${items.map(x=>{const pair=Array.isArray(x)?x:[x,x];return radio(name,pair[0],pair[1],disabled.includes(pair[0]));}).join('')}</div>`;}
  function checks(name,items,disabled=[]){return `<div class="choices">${items.map(x=>{const pair=Array.isArray(x)?x:[x,x];return check(name,pair[0],pair[1],disabled.includes(pair[0]));}).join('')}</div>`;}
  function input(name,placeholder='',type='text',extra=''){return `<input id="field-${name}" aria-label="${esc(placeholder||name)}" type="${type}" data-field="${name}" value="${esc(f[name])}" placeholder="${esc(placeholder)}" ${extra}>`;}
  function textarea(name,placeholder=''){return `<textarea id="field-${name}" aria-label="${esc(placeholder||name)}" data-field="${name}" placeholder="${esc(placeholder)}" maxlength="1000">${esc(f[name])}</textarea>`;}
  function field(label,body,required=false,hint='',extra=''){return `<div class="field" ${extra}><div class="field-label">${required?'<span class="req">*</span>':''}${label}：</div><div class="control">${body}${hint?`<p class="hint">${hint}</p>`:''}</div></div>`;}
  function frozenHint(){return '<p class="hint amber">ⓘ 首次提交后不可再修改</p>';}
  function upload(name,caption){return `<div><label class="upload" aria-label="${esc(caption)}">${f[name]?`<img src="${esc(f[name])}" alt="${esc(caption)}">`:'＋'}<input type="file" accept="image/jpeg,image/png,image/gif" data-upload="${name}" aria-label="${esc(caption)}"></label><div class="upload-label">${esc(caption)}</div></div>`;}
  function hasPages(){return f.trigger==='active';}
  function buttons(){return `<div class="form-footer"><button class="primary" data-action="draft">保存草稿</button>${step>1&&section==='base'?'<button data-action="previous">上一步</button>':''}<button class="primary" data-action="next">${section==='base'&&step===(hasPages()?4:3)?(hasPages()?'下一步':'确 定'):'下一步'}</button><button data-action="cancel">取 消</button></div>`;}
  function steps(){const names=['基本信息','关联卡券','活动对象','分享与SEO'];return `<div class="steps" role="tablist" aria-label="活动创建步骤">${names.slice(0,hasPages()?4:3).map((t,i)=>`<button role="tab" aria-selected="${step===i+1}" class="${step===i+1?'active':''}" data-step="${i+1}"><span class="req">*</span>step${i+1}: ${t}</button>`).join('')}</div>`;}
  function render(){if(step>3&&!hasPages())step=3;
    $('#main').innerHTML=`<div class="page-head"><h1>活动详情页</h1><div class="actions"><button class="primary" data-action="draft">保存草稿</button><button class="primary" data-action="submit">确 定</button><button class="primary" data-action="cancel">返 回</button></div></div>
    <p class="page-desc">功能说明：活动的配置，可创建/编辑/查看活动配置的基础信息、界面信息</p>
    <div class="content"><div class="major-tabs" role="tablist" aria-label="配置分类"><button role="tab" aria-selected="${section==='base'}" class="${section==='base'?'active':''}" data-section="base">基础配置</button>${hasPages()?`<button role="tab" aria-selected="${section==='page'}" class="${section==='page'?'active':''}" data-section="page">页面配置</button>`:''}</div>
    ${section==='base'?steps():pageTabs()}<div class="form-panel" role="tabpanel">${section==='base'?[stepOne,stepTwo,stepThree,stepFour][step-1]():pageConfig()}${buttons()}</div></div>`;
  }
  function stepOne(){return field('是否旧E3S活动',radios('old',[['yes','是'],['no','否']]),true)+
    field('品牌',radios('brand',['东风日产','启辰','英菲尼迪'],['英菲尼迪'])+frozenHint(),true)+
    field('活动名称',input('name','请输入活动名称，不超过30个字符','text','maxlength="30"'),true)+
    field('业务板块','<label class="choice disabled"><input type="radio" checked disabled>保客营销</label>',true)+
    field('业务子板块',radios('business',['会员权益','维保活动','续保活动','取送车活动'])+frozenHint(),true)+
    field('活动奖品',radios('prize',['卡券中心-卡券','续保权益','续保权益&售后卡券'],['续保权益','续保权益&售后卡券'])+frozenHint(),true)+
    field('活动时间',`<div class="inline date-range">${input('start','开始日期','date')}<span>→</span>${input('end','结束日期','date')}</div>`,true,'开始时间默认为当天00:00:00，结束时间默认为当天23:59:59')+
    `<div class="type-title"><span class="req">*</span>活动类型：${frozenHint()}</div>`+
    field('活动主体',checks('subjects',Object.entries(subjects),['store']),true)+
    (R.isMall(f)?field('商城-业务归属',`<select aria-label="商城-业务归属" data-field="mallBusiness"><option value="">请选择</option><option ${f.mallBusiness==='售后'?'selected':''}>售后</option><option ${f.mallBusiness==='商城'?'selected':''}>商城</option></select>`)+field('商城-是否PV补贴',radios('pv',[['yes','是'],['no','否']]))+field('商城-渠道',checks('mallChannels',['商城APP','商城小程序','商城官网']),true):'')+
    field('触发方式',`<div class="trigger-group"><span>后台自动触发（直接发到用户卡包）：</span>${radios('trigger',[['push','后台统一推送'],['behavior','用户行为触发']])}</div><div class="trigger-group"><span>客户主动领取（需要用户点击领取）：</span>${radios('trigger',[['active','C端主动参与活动'],['claim','C端主动领取']],R.isMall(f)?['active']:[])}</div>`,true)+
    (f.trigger==='active'?`<div class="trigger-block">${radios('subtype',['BIMC双月活动','BIMC会员周活动','BIMC单店机动券活动'],['BIMC单店机动券活动'])}</div>`+field('推广渠道',checks('channels',['App','微信小程序','服务号']),true,'渠道与品牌对应，例：品牌选择了日产+渠道为APP，推广渠道为“日产APP”')+
    field('活动封面',`<div class="upload-wrap">${upload('cover','移动 16:9')}</div>`,true,'图片文件大小不超过2M，支持图片格式：JPG/PNG/GIF/JPEG')+
    field('活动链接',`<div class="inline">${input('link','请输入活动链接','url','class="grow"')}${input('linkId','唯一标识','text','class="narrow"')}<button data-action="check-link">检 查</button></div>`,true,'创建后不可二次更改，请仔细核对后填入；链接与移动端图片对应'):'')+
    field('活动政策(对客户)',textarea('policy','请输入活动政策，不超过1000个字符'))+
    field('活动补贴(对专营店)',textarea('subsidy','请输入活动补贴，不超过1000个字符'))+
    (R.admissionVisible(f)?`<section class="admission" id="admission-config"><h2>准入配置</h2>${field('准入等级',`<div class="choices segmented">${Object.entries(levels).map(([v,l])=>radio('level',v,l)).join('')}</div>`,true)}${field('校验节点',checks('checkpoints',['进入活动','领券前']),true)}<div class="trigger-block"><p class="hint amber">ⓘ 提示：准入配置一旦确认后不可修改，请仔细核对</p>${f.level==='number'?'<p class="hint blue">号码级活动仅支持“选人”，且只能关联领取规则为“用户”的卡券。</p>':''}</div></section>`:'')+
    field('活动状态',radios('status',[['enabled','启用'],['disabled','禁用']]),true,'','id="activity-status"');}
  function couponCard(conf,index){const c=C.find(x=>x.id===conf.couponId),issue=conf.couponId?R.couponIssue(f,c):'',bad=!!issue;
    function cr(name,items){return `<div class="choices">${items.map(x=>`<label class="choice"><input type="radio" data-config="${conf.key}" data-cfield="${name}" name="c-${conf.key}-${name}" value="${esc(x)}" ${conf[name]===x?'checked':''}>${esc(x)}</label>`).join('')}</div>`;}
    function ci(name,label,value=conf[name],disabled=false){return `<input aria-label="${esc(label)} ${index+1}" type="number" min="1" data-config="${conf.key}" data-cfield="${name}" value="${esc(value)}" class="narrow" ${disabled?'disabled':''}>`;}
    return `<section class="coupon-card ${bad?'invalid':''}" data-card="${conf.key}"><div class="coupon-head"><span>卡券配置 ${index+1}</span>${f.couponConfigs.length>1?`<button class="link" data-remove-config="${conf.key}">删除配置</button>`:''}</div>${bad?`<div class="error-box">${esc(issue)}。请重新选择或移除。</div>`:''}`+
    field('关联卡券ID',`<div class="inline"><input aria-label="关联卡券ID ${index+1}" readonly value="${esc(c?c.id+' / '+c.name:conf.couponId)}" class="grow" placeholder="请选择卡券"><button class="primary" data-choose-coupon="${conf.key}">选择卡券</button>${conf.couponId?`<button class="link" data-clear-coupon="${conf.key}">移除</button>`:''}</div>${c?`<p class="hint">领取规则：<strong>${c.receiveRule==='user'?'用户':'VIN'}</strong>　核销方式：<strong>${esc(c.method||'未配置')}</strong></p>`:''}`,true)+
    field('购买渠道','<div class="choices"><label class="choice disabled"><input type="radio" disabled>店头</label><label class="choice disabled"><input type="radio" disabled>商城</label><label class="choice disabled"><input type="radio" disabled>店头&商城</label></div>')+
    field('卡券限领数量',ci('limit','卡券限领数量',c?c.limit:'',true)+' 张')+
    field('活动发放卡券数量',ci('quantity','活动发放卡券数量')+' 张',true)+
    field('卡券执行逻辑',cr('execute',['需要发券，也需激活','只需激活，不需发券','按照概率抽取','只需要发券']),true)+
    field('卡券限领数量',ci('receiveLimit','活动卡券限领数量')+' 张')+
    field('发放限制',`<div class="inline"><select aria-label="发放限制 ${index+1}" data-config="${conf.key}" data-cfield="limitMode"><option value="limit" ${conf.limitMode==='limit'?'selected':''}>限制</option><option value="unlimited" ${conf.limitMode==='unlimited'?'selected':''}>不限制</option></select>${ci('issueLimit','发放限制数量')} 张</div>`)+
    field('门店',`<button data-info="本地演示卡券适用门店：广州示例专营店、深圳示例专营店。">查看门店</button>`)+
    field('车系',`<button data-info="本地演示卡券适用车系：轩逸、天籁。">查看车型</button>`)+
    field('卡券补贴结算规则ID',`<div class="inline"><input aria-label="卡券补贴结算规则ID ${index+1}" readonly value="${c?c.settlementId:''}"><input aria-label="结算规则名称 ${index+1}" readonly value="${c?c.settlementName:''}"></div>`)+`</section>`;
  }
  function stepTwo(){const bad=R.conflicts(f,C);return (R.effectiveLevel(f)?`<div class="summary-strip">准入等级：<strong>${levels[R.effectiveLevel(f)]}</strong>${R.effectiveLevel(f)==='number'?'　领取规则：<strong>用户</strong>　BIMC（新）、维修保养（新）仅限<strong>线上核销</strong>':''}<button class="link" data-step="1">返回基本信息</button></div>`:'')+
    (bad.length?`<div class="error-box" role="alert">已关联 ${bad.length} 张不符合号码级规则的卡券：${bad.map(x=>esc(x.name)).join('、')}。请重新选择后再继续。</div>`:'')+
    field('活动卡券的领取方式',radios('claimMode',[['automatic','自动领取'],['manual','手动领取']],['push','behavior'].includes(f.trigger)?['manual']:['automatic'])+(f.claimMode==='manual'?radios('claimDetail',['逐一领取','一键领取']):''),true)+
    field('卡券策略',radios('strategy',['与指定券叠加','与指定券互斥','与全部券叠加','与全部券互斥','无'])+frozenHint(),true)+
    f.couponConfigs.map(couponCard).join('')+`<button data-action="add-coupon" class="primary">＋ 添加卡券配置</button>`+
    `<div class="mt24">${field('是否互斥活动',radios('mutex',[['yes','是'],['no','否']])+frozenHint(),true)}${field('',`<button data-info="本地演示暂无已关联的互斥活动。">查看全部互斥活动</button>`)}</div>`;
  }
  function stepThree(){const choices=R.allowed(f),ids=R.identifiers(f.attribute);return field('活动属性',radios('attribute',Object.entries(attrs),Object.keys(attrs).filter(x=>!choices.includes(x)))+
    (R.optional(f)?`<button class="link" data-action="clear-attribute" ${!f.attribute?'disabled':''}>清空选择</button>`:'')+
    `<p class="hint">${R.optional(f)?'当前活动类型为非必填，可保留为空。':'单选，根据所选属性发放或领取卡券。'}${R.effectiveLevel(f)==='number'?'号码级仅允许选择“选人”。':f.subjects.includes('mallNearby')?'商城周边及商城售后与周边复选时，仅支持选人。':''}</p>`,!R.optional(f))+
    field('用户标识',ids.length?`<div class="choices">${ids.map(id=>`<label class="choice disabled"><input type="checkbox" aria-label="${id}" checked disabled>${id}</label>`).join('')}</div>`:'<span class="hint">请先选择活动属性</span>',false,ids.length?'由活动属性自动确定，不可编辑。':'')+
    (f.attribute==='both'?field('',`<p class="hint blue no-margin">oneid 与 VIN 为“且”的关系；两个字段均保持一致时，才可发放或领取卡券。</p>`):'')+
    (f.subjects.includes('mallNearby')?field('大数据人群包推送类型',radios('pushMode',['全量推送','精准推送'])):'')+
    field('大数据人群包选择',`<button class="primary" data-action="crowds">选择人群包</button>${f.crowds.length?`<p class="hint">已选择：${f.crowds.map(esc).join('、')}</p>`:''}`,false,'提供可选择的大数据用户人群包，可以根据活动需求选择相关的人群包');}
  function stepFour(){return field('分享标题',input('shareTitle','请输入分享标题'),true)+field('分享描述',textarea('shareDescription','请输入分享描述'),true)+
    field('分享图标',`<div class="upload-wrap">${upload('shareApp','WAP/APP 1:1')}${upload('shareMini','小程序 1:1')}</div>`,false,'点击图片区域，选择需要上传的图片；图片文件大小不超过2M，支持JPG/PNG/GIF。')+
    field('SEO标题',input('seoTitle','请输入标题'))+field('SEO关键词',input('seoKeywords','请输入关键词'),false,'多个关键字使用英文逗号分隔')+field('SEO描述',textarea('seoDescription','请输入描述'));}
  function pageTabs(){return `<div class="steps" role="tablist" aria-label="页面配置步骤">${['未开始拦截页','专题页','领券成功','结束拦截页'].map((x,i)=>`<button role="tab" aria-selected="${pageStep===i+1}" class="${pageStep===i+1?'active':''}" data-page-step="${i+1}">${i===2?'<span class="req">*</span>':''}${i+1} ${x}</button>`).join('')}</div>`;}
  function pageConfig(){if(pageStep===1||pageStep===4){let name=pageStep===1?'unstarted':'ended';return field(`是否启用${pageStep===1?'未开始':'结束'}拦截页`,radios(name,[['yes','是'],['no','否']]))+(f[name]==='yes'?field('页面底图',upload(name+'Image','拦截页图片')):'');}
    let channels=field('配置渠道',checks('channels',['App','微信小程序','服务号'],['App','微信小程序','服务号']));
    if(pageStep===3)return channels+field('页面底图',upload('successBackground','领券成功底图 16:9'),true,'图片文件大小不超过2M，支持图片格式：JPG/PNG/GIF/JPEG')+field('核销码查询路径文案',textarea('successCopy','请输入核销码查询路径文案'));
    return channels+`<div class="block-table"><table class="table-grid"><thead><tr>${['图片','图片类型','图片备注','APP链接','小程序链接','服务号链接','活动卡券ID','卡券状态'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${f.hotspots.map((x,i)=>`<tr>${['image','type','note','app','mini','service','coupon','status'].map(k=>`<td><input type="text" aria-label="热点 ${i+1} ${k}" data-hotspot="${i}" data-hfield="${k}" value="${esc(x[k])}"></td>`).join('')}</tr>`).join('')}</tbody></table></div><button data-action="add-hotspot" class="mt24">＋ 添加热点</button>`;
  }
  function toast(t){clearTimeout(toastTimer);$('#toast').textContent=t;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),5000);}
  function modal(title,body,foot,small=false){$('#modal-root').innerHTML=`<div class="overlay"><section class="dialog ${small?'small':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="dialog-head"><h2>${esc(title)}</h2><button class="close" data-action="close-modal" aria-label="关闭弹窗">×</button></div><div class="dialog-body">${body}</div><div class="dialog-foot">${foot||'<button data-action="close-modal">关 闭</button>'}</div></section></div>`;}
  let returnFocus;
  function closeModal(){dialog=null;$('#modal-root').innerHTML='';if(returnFocus&&document.contains(returnFocus))returnFocus.focus();}
  function openCoupons(configKey){returnFocus=document.activeElement;const conf=f.couponConfigs.find(c=>c.key===Number(configKey));dialog={kind:'coupons',configKey:conf.key,pending:conf.couponId,scene:'',id:'',name:'',page:1,pageSize:4};renderCoupons();}
  function renderCoupons(){const request=R.queryFor(f,dialog),result=R.queryCoupons(C,request),selected=C.find(c=>c.id===dialog.pending),eligible=selected&&R.couponAllowed(f,selected),nPages=Math.max(1,Math.ceil(result.total/dialog.pageSize));
    const body=`<div class="filters"><div class="filter-field"><label for="query-scene"><span class="req">*</span>卡券业务场景：</label><select id="query-scene" data-filter="scene"><option value="">请选择卡券业务场景</option><option value="bimc" ${dialog.scene==='bimc'?'selected':''}>售后营销 / BIMC（新）</option><option value="maintenance" ${dialog.scene==='maintenance'?'selected':''}>售后营销 / 维修保养（新）</option><option value="mall" ${dialog.scene==='mall'?'selected':''}>商城营销 / 新商城</option></select></div><div class="filter-field"><label for="query-id">卡券id：</label><input id="query-id" data-filter="id" value="${esc(dialog.id)}" placeholder="请输入卡券id"></div><div class="filter-field"><label for="query-name">卡券名称：</label><input id="query-name" data-filter="name" value="${esc(dialog.name)}" placeholder="请输入卡券名称"></div><div class="actions"><button class="primary" data-action="search-coupons">搜索</button><button data-action="reset-coupons">重置</button></div></div>
    <div class="filter-lock">${request.receiveRule==='user'?(request.method==='线上核销'?'号码级：领取规则=用户，且核销方式=线上核销。搜索、重置和翻页均保留这两个条件。':'号码级：领取规则已限定为“用户”。BIMC（新）、维修保养（新）还须满足核销方式=线上核销。'):'按当前业务场景查询卡券，保留原有查询条件。'}</div>
    <div class="table-title"><span>卡券业务场景下可选卡券（${result.total}）</span><div class="actions"><button data-action="refresh-coupons" ${!dialog.scene?'disabled':''}>↻ 刷新</button><button data-action="coupon-upstream">新增卡券</button><button data-action="coupon-upstream">复制卡券</button></div></div>
    <div class="block-table"><table><thead><tr>${['单选','卡券id','卡券名称','领取规则','卡券状态','售后产品','核销方式','卡券描述','有效期','补贴结算规则ID','补贴结算规则名称','线上规则明细','线下规则明细'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${result.items.length?result.items.map(c=>`<tr><td class="radio-cell"><input type="radio" name="coupon-choice" aria-label="选择 ${esc(c.id)}" data-coupon-id="${c.id}" ${dialog.pending===c.id?'checked':''}></td><td>${c.id}</td><td>${c.name}</td><td><span class="tag ${c.receiveRule==='user'?'':'gray'}">${c.receiveRule==='user'?'用户':'VIN'}</span></td><td>${c.status}</td><td>${c.product}</td><td>${esc(c.method||'未配置')}</td><td>${c.description}</td><td>${c.validity}</td><td>${c.settlementId}</td><td>${c.settlementName}</td><td>${c.online}</td><td>${c.offline}</td></tr>`).join(''):`<tr><td colspan="13" class="empty">${dialog.scene?'暂无符合条件的卡券':'请先选择卡券业务场景'}</td></tr>`}</tbody></table></div>
    <div class="pagination"><span>共 ${result.total} 条</span><button aria-label="上一页卡券" data-coupon-page="${dialog.page-1}" ${dialog.page<=1?'disabled':''}>‹</button><span>${dialog.page} / ${nPages}</span><button aria-label="下一页卡券" data-coupon-page="${dialog.page+1}" ${dialog.page>=nPages?'disabled':''}>›</button><span>${dialog.pageSize} 条/页</span></div>
    ${selected?`<div class="selected-info">已选：${selected.id} / ${selected.name}　领取规则：${selected.receiveRule==='user'?'用户':'VIN'}　核销方式：${esc(selected.method||'未配置')}${eligible?'':'（'+esc(R.couponIssue(f,selected))+'，请重新选择）'}</div>`:''}`;
    modal('选择卡券',body,`<button class="primary" data-action="confirm-coupon" ${!eligible?'disabled':''}>确 认</button><button data-action="close-modal">取 消</button>`);
  }
  function showErrors(errors){modal('请完善活动配置',`<div class="error-box">${errors.map(esc).join('<br>')}</div>`,null,true);}
  function baseErrors(){const e=[];if(!f.name.trim())e.push('请填写活动名称');if(!f.start||!f.end)e.push('请选择活动时间');if(f.start&&f.end&&f.end<f.start)e.push('结束日期不能早于开始日期');if(!f.subjects.length)e.push('请选择活动主体');if(!f.trigger)e.push('请选择触发方式');if(!f.status)e.push('请选择活动状态');if(R.admissionVisible(f)){if(!f.level)e.push('请选择准入等级');if(!f.checkpoints.length)e.push('请选择校验节点');}return e;}
  function guardConflicts(){const e=R.conflicts(f,C);if(e.length){showErrors(['存在不符合关联规则的已选卡券，请返回 step2 重新选择或移除：',...e.map(x=>x.name+'（'+x.id+'）：'+x.reason)]);return false;}return true;}
  function saveDraft(){if(!guardConflicts())return;const errors=R.validate(f,C).filter(x=>x!=='请选择活动属性');if(errors.length)return showErrors(errors);try{localStorage.setItem(key,JSON.stringify({form:f,step,savedAt:new Date().toISOString()}));toast('草稿已保存到本地浏览器');}catch(e){toast('本地草稿保存失败，请检查浏览器存储空间');}}
  function submit(){const errors=[...baseErrors(),...R.validate(f,C)];if(!f.couponConfigs.some(c=>c.couponId))errors.push('请至少关联一张卡券');if(f.couponConfigs.some(c=>!c.couponId))errors.push('请补全或删除空白卡券配置');if(f.couponConfigs.some(c=>!c.execute))errors.push('请选择每张卡券的执行逻辑');if(f.couponConfigs.some(c=>!Number.isInteger(Number(c.quantity))||Number(c.quantity)<1))errors.push('活动发放卡券数量需为正整数');if(errors.length)return showErrors(errors);
    dialog={kind:'submit'};modal('确认活动配置',`<dl class="summary-list"><dt>活动名称</dt><dd>${esc(f.name)}</dd><dt>触发方式</dt><dd>${triggers[f.trigger]}</dd><dt>准入等级</dt><dd>${levels[R.effectiveLevel(f)]||'不适用'}</dd><dt>活动属性</dt><dd>${attrs[f.attribute]||'未填写'}</dd><dt>用户标识</dt><dd>${R.identifiers(f.attribute).join(' 且 ')||'未填写'}</dd><dt>关联卡券</dt><dd>${f.couponConfigs.map(c=>esc(c.couponId)).join('<br>')}</dd></dl><p class="hint mt24">本次仅保存本地演示活动，供页面和规则评审。</p>`,`<button class="primary" data-action="confirm-save">确认保存</button><button data-action="close-modal">取 消</button>`,true);
  }
  function next(){if(!guardConflicts())return;if(section==='page'){if(pageStep<4){pageStep++;render();}else submit();return;}if(step===1){const e=baseErrors();if(e.length)return showErrors(e);}if(step===3){const e=R.validate(f,C);if(e.length)return showErrors(e);}if(step<(hasPages()?4:3)){step++;history.replaceState(null,'','#step'+step);render();}else if(hasPages()){section='page';pageStep=1;render();}else submit();}
  function changeField(el){let name=el.dataset.field;if(!name)return;const old=f.attribute;
    if(el.type==='checkbox'){const v=new Set(f[name]||[]);el.checked?v.add(el.value):v.delete(el.value);f[name]=[...v];}else f[name]=el.value;
    if(['subjects','trigger','level'].includes(name)){
      if(R.isMall(f)&&f.trigger==='active')f.trigger='claim';
      if(!hasPages())section='base';
      f.claimMode=['push','behavior'].includes(f.trigger)?'automatic':'manual';
      f=R.normalize(f,name==='subjects'||name==='trigger');
      if(old!==f.attribute&&name==='level'&&f.level==='number')toast('号码级活动属性已调整为“选人”，用户标识为 oneid');
    }
    if(['subjects','trigger','level','attribute','claimMode','business','unstarted','ended'].includes(name))render();
  }
  document.addEventListener('input',e=>{const el=e.target;if(el.dataset.field&&!['radio','checkbox'].includes(el.type))f[el.dataset.field]=el.value;
    if(el.dataset.filter&&dialog?.kind==='coupons')dialog[el.dataset.filter]=el.value;
    if(el.dataset.config&&el.dataset.cfield){const c=f.couponConfigs.find(x=>x.key===Number(el.dataset.config));if(c)c[el.dataset.cfield]=el.value;}
    if(el.dataset.hotspot!==undefined)f.hotspots[Number(el.dataset.hotspot)][el.dataset.hfield]=el.value;
  });
  document.addEventListener('change',async e=>{const el=e.target;
    if(el.dataset.upload){const file=el.files[0];if(!file)return;if(!['image/jpeg','image/png','image/gif'].includes(file.type)||file.size>2*1024*1024){toast('请选择不超过2M的 JPG、PNG 或 GIF 图片');el.value='';return;}const reader=new FileReader();reader.onload=()=>{f[el.dataset.upload]=reader.result;render();};reader.readAsDataURL(file);return;}
    if(el.dataset.field)changeField(el);
    if(el.dataset.filter==='scene'&&dialog?.kind==='coupons'){dialog.scene=el.value;dialog.pending='';dialog.page=1;renderCoupons();}
    if(el.dataset.couponId&&dialog?.kind==='coupons'){const c=C.find(x=>x.id===el.dataset.couponId);if(R.couponAllowed(f,c)){dialog.pending=c.id;renderCoupons();}}
  });
  document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.step){section='base';step=Number(b.dataset.step);history.replaceState(null,'','#step'+step);render();return;}
    if(b.dataset.section){section=b.dataset.section;render();return;}
    if(b.dataset.pageStep){pageStep=Number(b.dataset.pageStep);render();return;}
    if(b.dataset.chooseCoupon){openCoupons(b.dataset.chooseCoupon);return;}
    if(b.dataset.clearCoupon){f.couponConfigs.find(x=>x.key===Number(b.dataset.clearCoupon)).couponId='';render();return;}
    if(b.dataset.removeConfig){f.couponConfigs=f.couponConfigs.filter(x=>x.key!==Number(b.dataset.removeConfig));render();return;}
    if(b.dataset.info){modal('查看信息',`<p>${esc(b.dataset.info)}</p>`,null,true);return;}
    if(b.dataset.couponPage){dialog.page=Number(b.dataset.couponPage);renderCoupons();return;}
    switch(b.dataset.action){
      case 'toggle-menu':$('#sidebar').classList.toggle('open');break;
      case 'back-form':section='base';step=1;render();break;
      case 'previous':step=Math.max(1,step-1);history.replaceState(null,'','#step'+step);render();break;
      case 'next':next();break;
      case 'draft':saveDraft();break;
      case 'submit':submit();break;
      case 'confirm-save':if(!guardConflicts())break;try{localStorage.setItem(key+'-saved',JSON.stringify(f));closeModal();toast('本地演示活动已保存');}catch(e){toast('本地保存失败，请检查浏览器存储空间');}break;
      case 'cancel':modal('返回活动创建',`<p>当前内容保留在本页。可先保存草稿，再返回基本信息。</p>`,`<button class="primary" data-action="return-first">返回基本信息</button><button data-action="close-modal">继续编辑</button>`,true);break;
      case 'return-first':closeModal();section='base';step=1;render();break;
      case 'clear-attribute':if(R.optional(f)){f.attribute='';render();}break;
      case 'close-modal':closeModal();break;
      case 'add-coupon':f.couponConfigs.push(newCoupon());render();break;
      case 'search-coupons':case 'refresh-coupons':if(!dialog.scene){toast('请先选择卡券业务场景');break;}dialog.page=1;renderCoupons();break;
      case 'reset-coupons':dialog.id='';dialog.name='';dialog.page=1;renderCoupons();break;
      case 'confirm-coupon':{const c=C.find(x=>x.id===dialog.pending);if(!R.couponAllowed(f,c)){toast('该卡券不符合当前准入规则，请重新查询');break;}f.couponConfigs.find(x=>x.key===dialog.configKey).couponId=c.id;closeModal();render();break;}
      case 'coupon-upstream':toast('新增、复制卡券由卡券中心处理；本原型仅演示已有卡券关联。');break;
      case 'crowds':dialog={kind:'crowds'};modal('选择人群包',`<p class="hint">以下为本地演示人群包</p>${['九月维保人群','售后活跃用户'].map(x=>`<p><label class="choice"><input type="checkbox" data-crowd="${x}" ${f.crowds.includes(x)?'checked':''}>${x}</label></p>`).join('')}`,`<button class="primary" data-action="confirm-crowds">确 认</button><button data-action="close-modal">取 消</button>`,true);break;
      case 'confirm-crowds':f.crowds=[...document.querySelectorAll('[data-crowd]:checked')].map(e=>e.dataset.crowd);closeModal();render();break;
      case 'check-link':toast(/^https?:\/\//i.test(f.link||'')?'链接格式正确；目标可达性需在正式环境检查':'请输入以 http:// 或 https:// 开头的链接');break;
      case 'add-hotspot':f.hotspots.push({image:'',type:'',note:'',app:'',mini:'',service:'',coupon:'',status:''});render();break;
      case 'resume-draft':try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.form){f=R.normalize(saved.form,false);counter=Math.max(...f.couponConfigs.map(c=>c.key),0)+1;step=saved.step||1;render();closeModal();toast('已恢复本地草稿');}}catch(e){toast('草稿读取失败');}break;
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal-root').children.length)closeModal();if(e.key==='Enter'&&e.target.dataset.filter&&dialog?.kind==='coupons'){e.preventDefault();dialog.page=1;renderCoupons();}
    if(e.key==='Tab'&&$('#modal-root').children.length){const focusables=[...$('#modal-root').querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled)')];if(!focusables.length)return;let first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  window.addEventListener('hashchange',()=>{const match=location.hash.match(/^#step([1-4])$/);if(match){step=Number(match[1]);section='base';render();}});
  render();
  try{if(localStorage.getItem(key))modal('发现本地草稿','<p>可继续上次保存在此浏览器的草稿，或保持当前新建表单。</p>','<button class="primary" data-action="resume-draft">继续草稿</button><button data-action="close-modal">新建活动</button>',true);}catch(e){}
})();
