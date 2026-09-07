(function () {
  'use strict';

  var activities = [
    {
      id: 'ACT-D-N', order: 1, name: '金秋到店关怀礼', subtitle: '养护多一份关怀，出行多一份安心', type: 'direct', requiredLevel: 'number', audienceKey: 'all-members', timeStatus: 'active',
      coupons: [
        { id: 'CP-N-01', value: '20', unit: '元', name: '保养抵用券', rule: '满 199 元可用', valid: '至 2026-12-31', source: '直接领取' },
        { id: 'CP-N-02', value: '10', unit: '元', name: '精品抵用券', rule: '满 99 元可用', valid: '至 2026-12-31', source: '直接领取' },
        { id: 'CP-E-01', value: '10', unit: '元', name: '精品优惠券', rule: '满 100 元减 10 元', valid: '有效期至 2026-08-31', source: '直接领取', expired: true }
      ]
    },
    {
      id: 'ACT-L-B', order: 2, name: '金秋养护幸运抽奖', subtitle: '幸运好礼，伴您一路同行', type: 'lottery', requiredLevel: 'bound', audienceKey: 'service-loyal', timeStatus: 'active',
      drawTitle: '金秋车主幸运抽奖',
      coupons: [
        { id: 'CP-L-B-01', value: '100', unit: '元', name: '深度维保券', rule: '满 999 元可用', valid: '至 2026-12-31', source: '抽奖获得' }
      ]
    },
    {
      id: 'ACT-D-B', order: 3, name: '秋日安心养护礼', subtitle: '保养、洗车、工时优惠，一次备齐', type: 'direct', requiredLevel: 'bound', audienceKey: 'bound-owners', timeStatus: 'active',
      coupons: [
        { id: 'CP-B-01', value: '8.8', unit: '折', name: '基础保养券', rule: '指定保养套餐可用', valid: '至 2026-12-31', source: '直接领取' },
        { id: 'CP-B-02', value: '30', unit: '元', name: '工时抵用券', rule: '满 199 元可用', valid: '至 2026-12-31', source: '直接领取' },
        { id: 'CP-B-03', value: '10', unit: '元', name: '精品优惠券', rule: '满 100 元减 10 元', valid: '已过期', source: '直接领取', expired: true },
        { id: 'CP-B-04', value: '50', unit: '元', name: '车主专享券', rule: '车主专享权益', valid: '至 2026-12-31', source: '直接领取' },
        { id: 'CP-B-05', value: '20', unit: '元', name: '洗车抵用券', rule: '指定洗车服务可用', valid: '至 2026-12-31', source: '直接领取' }
      ]
    },
    {
      id: 'ACT-D-V', order: 4, name: '认证车主尊享礼', subtitle: '专属养护权益，只为爱车的您', type: 'direct', requiredLevel: 'verified', audienceKey: 'vip-candidates', timeStatus: 'active',
      coupons: [
        { id: 'CP-V-01', value: '5', unit: '折', name: '空调养护券', rule: '指定空调养护套餐', valid: '至 2026-12-31', source: '直接领取' }
      ]
    },
    {
      id: 'ACT-L-V', order: 5, name: '车主尊享加码抽奖', subtitle: '再添一份幸运，解锁出行惊喜', type: 'lottery', requiredLevel: 'verified', audienceKey: 'vip-candidates', timeStatus: 'active',
      drawTitle: '认证车主加码抽奖',
      coupons: [
        { id: 'CP-L-V-01', value: '200', unit: '元', name: '车辆养护金', rule: '指定维保项目可用', valid: '至 2026-12-31', source: '抽奖获得' }
      ]
    },
    {
      id: 'ACT-FUTURE', order: 6, name: '国庆出行焕新礼', subtitle: '长假即将启程，好礼敬请期待', type: 'direct', requiredLevel: 'bound', audienceKey: 'bound-owners', timeStatus: 'upcoming', countdown: '2天0小时14分钟59秒',
      coupons: [
        { id: 'CP-F-01', value: '10', unit: '元', name: '满100减10元', rule: '活动开始后可领取', valid: '2026-10-01 开始', source: '直接领取' }
      ]
    }
  ];

  window.ComboPrototypeData = {
    levels: {
      number: { rank: 1, label: '号码级', requirement: '已登录' },
      bound: { rank: 2, label: '绑车级', requirement: '已绑定车辆' },
      verified: { rank: 3, label: '认证级', requirement: '已完成车主认证' },
      error: { rank: 0, label: '暂时无法核验', requirement: '请稍后重试' }
    },
    scenarios: {
      'folded-preview': {
        key: 'folded-preview', label: '已领活动折叠 · 认证可解锁', previewResult: true, comboStatus: 'active', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'],
        claimedIds: ['CP-N-01', 'CP-N-02', 'CP-B-01', 'CP-B-02', 'CP-B-04', 'CP-B-05', 'CP-L-B-01'],
        lotteryRecords: { 'ACT-L-B': { status: 'completed', outcome: 'won', prizeCouponIds: ['CP-L-B-01'] } },
        outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'all-locked-preview': {
        key: 'all-locked-preview', label: '当前等级 · 所有子活动均未满足', previewResult: true, comboStatus: 'active', loggedIn: true, level: 'number', vin: '',
        activityIds: ['ACT-L-B', 'ACT-D-B', 'ACT-D-V', 'ACT-L-V'],
        audiences: ['bound-owners', 'service-loyal', 'vip-candidates'], claimedIds: [],
        outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'grouped-preview': {
        key: 'grouped-preview', label: '号码级 · 绑车与认证分组', previewResult: true, comboStatus: 'active', loggedIn: true, level: 'number', vin: '',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'], claimedIds: ['CP-N-01', 'CP-N-02'],
        outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'coupon-states': {
        key: 'coupon-states', label: '券状态排序演示', previewResult: true, comboStatus: 'active', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'],
        claimedIds: ['CP-N-01', 'CP-N-02', 'CP-B-01', 'CP-B-02', 'CP-B-04', 'CP-L-B-01'],
        lotteryRecords: { 'ACT-L-B': { status: 'completed', outcome: 'won', prizeCouponIds: ['CP-L-B-01'] } },
        outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'number-partial': {
        key: 'number-partial', label: '号码级·分级结果', comboStatus: 'active', loggedIn: true, level: 'number', vin: '',
        audiences: ['all-members', 'bound-owners', 'vip-candidates'], outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'number-zero': {
        key: 'number-zero', label: '号码级·暂无可领', comboStatus: 'active', loggedIn: true, level: 'number', vin: '',
        audiences: ['bound-owners', 'vip-candidates'], outcomes: { 'ACT-L-B': 'lost', 'ACT-L-V': 'won' }
      },
      'guest-login': {
        key: 'guest-login', label: '未登录·登录后继续', comboStatus: 'active', loggedIn: false, level: 'number', vin: '', audiences: [],
        loginLevel: 'bound', loginVin: 'MOCK-VIN-001', loginAudiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'],
        outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'bound-lottery': {
        key: 'bound-lottery', label: '绑车级·抽奖优先', comboStatus: 'active', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'], outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'bound-partial': {
        key: 'bound-partial', label: '绑车级·抽奖优先', comboStatus: 'active', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'], outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'bound-repeat': {
        key: 'bound-repeat', label: '绑车级·抽奖已参加', comboStatus: 'active', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'],
        claimedIds: ['CP-N-01', 'CP-N-02', 'CP-B-01', 'CP-B-02', 'CP-L-B-01'],
        lotteryRecords: { 'ACT-L-B': { status: 'completed', outcome: 'won', prizeCouponIds: ['CP-L-B-01'] } },
        outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'verified-all': {
        key: 'verified-all', label: '认证级·两个独立抽奖', comboStatus: 'active', loggedIn: true, level: 'verified', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'], outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'audience-miss': {
        key: 'audience-miss', label: '认证级·人群不匹配', comboStatus: 'active', loggedIn: true, level: 'verified', vin: 'MOCK-VIN-001',
        audiences: ['all-members'], outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'won' }
      },
      'level-error': {
        key: 'level-error', label: '资格服务异常', comboStatus: 'active', loggedIn: true, level: 'error', retryLevel: 'bound', vin: 'MOCK-VIN-001',
        audiences: ['all-members', 'bound-owners', 'service-loyal', 'vip-candidates'], outcomes: { 'ACT-L-B': 'won', 'ACT-L-V': 'lost' }
      },
      'combo-upcoming': {
        key: 'combo-upcoming', label: '组合活动未开始', comboStatus: 'upcoming', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001', audiences: ['all-members']
      },
      'combo-ended': {
        key: 'combo-ended', label: '组合活动已结束', comboStatus: 'ended', loggedIn: true, level: 'bound', vin: 'MOCK-VIN-001', audiences: ['all-members']
      }
    },
    activities: activities,
    combo: {
      title: '秋日有礼 · 养护同行',
      subtitle: '2026 秋日车主关怀季',
      period: '活动时间 2026.09.01 - 2026.12.31',
      materials: [
        { id: 'MAT-01', src: 'assets/images/combo-hero.png', ratio: 'hero', alt: '秋日有礼，养护同行', eyebrow: '2026 · 秋日车主关怀季', headline: '秋日有礼\n养护同行', copy: '山海有约，好礼一路相伴' },
        { id: 'MAT-02', ratio: 'ribbon', alt: '立即参与', action: 'participate', buttonText: '立即参与' },
        { id: 'MAT-03', ratio: 'poster', alt: '秋日车主专享三重礼', eyebrow: '专享三重好礼', headline: '把关怀带上\n向美好出发', copy: '从日常养护到旅途惊喜，为每一次出发做好准备', benefits: [
          { title: '到店关怀', copy: '日常养护，贴心优惠' },
          { title: '车主专享', copy: '绑车认证，解锁更多' },
          { title: '幸运加码', copy: '参与抽奖，赢养护好礼' }
        ] },
        { id: 'MAT-04', src: 'assets/images/policy-ribbon.png', ratio: 'shop', action: 'link', alt: '秋日出行好物，前往商城', eyebrow: '爱车好物', headline: '为下一段旅程做好准备', copy: '前往商城，发现更多好物' },
        { id: 'MAT-05', ratio: 'rules', alt: '活动参与须知', headline: '活动规则', rules: [
          '活动时间：2026 年 9 月 1 日至 12 月 31 日。各子活动开放时间以页面展示为准。',
          '点击“立即参与”后，符合条件的卡券将发放至您的卡包；符合条件且尚未参加的抽奖将进入抽奖页。',
          '完成绑车或车主认证，可解锁相应等级的活动。完成后请返回本页面，再次点击“立即参与”。',
          '卡券使用范围、使用条件与有效期详见券面。抽奖奖品以实际抽奖结果为准。'
        ] }
      ]
    },
    defaults: { scenario: 'bound-lottery', route: 'activity' }
  };
})();
