(function(root){
'use strict';
root.DFN=root.DFN||{};
root.DFN.clone=function(v){return JSON.parse(JSON.stringify(v));};
root.DFN.escape=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
root.DFN.icon=function(name,size){
 var paths={menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',coupon:'<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6Z"/><path d="M15 6v12" stroke-dasharray="2 2"/>',shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',check:'<path d="m5 12 4 4L19 6"/>',arrow:'<path d="m9 5 7 7-7 7"/>',lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>'};
 return '<svg width="'+(size||18)+'" height="'+(size||18)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.info)+'</svg>';
};
root.DFN.toast=function(message){var el=document.getElementById('toast');el.textContent=message;el.hidden=false;clearTimeout(root.DFN.toastTimer);root.DFN.toastTimer=setTimeout(function(){el.hidden=true;},3200);};
})(window);
