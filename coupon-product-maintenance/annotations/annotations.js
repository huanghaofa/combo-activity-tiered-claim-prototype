(function(){
 const base={id:1,title:'商品之外的字段保持原规则',target:'#base-fields',sections:{functionDesc:'本次仅放开已投放模板的商品维护；品牌、来源、场景、分类、名称、图片、面值、发放数量及领用核销规则保持只读。',dataSource:'2026-08-18留存SIT与本地基线；当前SIT未取得，不代表已核对所有生产分支。'}};
 const sku={id:2,title:'已关联商品与一键导出',target:'#sku-area',sections:{functionDesc:'按用户批注，商品区仅显示“已关联X个商品”及选择商品、上传文件、下载模板、导出已关联商品；不显示SKU/商品分类单选和原数量版本汇总块。',interactionDesc:'点击“导出已关联商品”直接下载SKU列表，无弹窗和范围选择。CSV仅一列sku_id，每个已关联SKU一行；无关联商品时提示，不生成空文件。',judgeRule:'本原型读取本模板已保存关联集合；失败记录、重复项和未保存草稿不导出。同步结果不再作为用户导出选项。',dataSource:'2026-09-16用户三条浏览器批注；本地关联数据均为虚构。'}};
 window.AnnotationData={
  list:[{id:1,title:'已投放增加商品维护入口',target:'.data-table tbody tr:first-child .maintain-link',sections:{functionDesc:'需求DFN-REQ-20260916-001，功能8。查看与商品维护是两个独立页面状态；只调整商品相关限制。',otherDesc:'功能7导出位于详情/维护页“适用商城商品”，不复用卡券列表整券导出。'}},{id:2,title:'来源与虚构数据边界',target:'.table-wrap',sections:{dataSource:'当前派单及本地SIT留存证据。腾讯台账只读查询被自动审批拒绝，尚未按ID/序号回读。',otherDesc:'两个模板和所有数量均为虚构。空成功集合仅为边界演示；不推断真实系统允许空关系投放。'}}],
  view:[base,sku],maintain:[base,sku]
 };
})();
