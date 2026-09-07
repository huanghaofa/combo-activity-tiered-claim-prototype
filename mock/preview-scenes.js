(function () {
  'use strict';
  // Saved display-only fixtures. Opening these previews never invokes a real service.
  var data = window.ComboPrototypeData;
  var direct = ['CP-N-01', 'CP-N-02', 'CP-B-01', 'CP-B-02', 'CP-B-04', 'CP-B-05'];
  var audiences = ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'];
  function add(key, base, overrides) {
    data.scenarios[key] = Object.assign(JSON.parse(JSON.stringify(data.scenarios[base])), { key: key, previewResult: true }, overrides);
  }
  add('verified-result-preview', 'folded-preview', {
    label: '认证级 · 全部可参与活动领取结果', level: 'verified',
    claimedIds: direct.concat(['CP-V-01', 'CP-L-B-01']),
    lotteryRecords: {
      'ACT-L-B': { status: 'completed', outcome: 'won', prizeCouponIds: ['CP-L-B-01'] },
      'ACT-L-V': { status: 'completed', outcome: 'lost', prizeCouponIds: [] }
    }
  });
  add('no-eligible-preview', 'grouped-preview', {
    label: '人群均不匹配 · 暂无可参与活动', level: 'verified', vin: 'MOCK-VIN-001', audiences: [], claimedIds: []
  });
  add('artwork-preview', 'grouped-preview', {
    label: '配置券图 · 图外待解锁', previewArtwork: { couponId: 'CP-V-01', src: 'assets/images/coupon-original.svg' }
  });
  add('lottery-ready-preview', 'folded-preview', {
    label: '抽奖 · 待参与', claimedIds: direct, lotteryRecords: {},
    previewLottery: { activityId: 'ACT-L-B', finished: false }
  });
  add('lottery-won-preview', 'folded-preview', {
    label: '抽奖 · 已中奖', previewLottery: { activityId: 'ACT-L-B', finished: true }
  });
  add('lottery-lost-preview', 'folded-preview', {
    label: '抽奖 · 未中奖', claimedIds: direct,
    lotteryRecords: { 'ACT-L-B': { status: 'completed', outcome: 'lost', prizeCouponIds: [] } },
    previewLottery: { activityId: 'ACT-L-B', finished: true }
  });
  add('bind-preview', 'grouped-preview', { label: '绑定车辆 · 回流', previewUpgrade: 'bound' });
  add('certify-preview', 'folded-preview', { label: '车主认证 · 回流', previewUpgrade: 'verified' });
  add('context-error-preview', 'level-error', {
    label: '资格异常 · 结果页', claimedIds: [], audiences: audiences, previewContextError: true
  });
})();
