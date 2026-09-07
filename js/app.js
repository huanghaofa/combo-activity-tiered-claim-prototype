(function () {
  'use strict';

  var source = window.ComboPrototypeData;
  var utils = window.ComboUtils;
  var state = null;

  function createState() {
    var scenarioKey = utils.query('scene', source.defaults.scenario);
    var scenario = source.scenarios[scenarioKey] || source.scenarios[source.defaults.scenario];
    return {
      scenarioKey: scenario.key,
      comboStatus: scenario.comboStatus || 'active',
      loggedIn: Boolean(scenario.loggedIn),
      userLevel: scenario.level || 'number',
      vin: scenario.vin || '',
      audiences: utils.clone(scenario.audiences || []),
      activities: utils.clone(source.activities.filter(function (activity) { return !scenario.activityIds || scenario.activityIds.indexOf(activity.id) >= 0; })),
      claimedIds: utils.clone(scenario.claimedIds || []),
      activatedIds: utils.clone(scenario.activatedIds || []),
      expandedActivityIds: [],
      readyActivitiesExpanded: false,
      lotteryRecords: utils.clone(scenario.lotteryRecords || {}),
      outcomes: utils.clone(scenario.outcomes || {}),
      batchCount: 0,
      contextQueryCount: 0,
      lastBatch: null,
      lotteryQueue: [],
      lotteryIndex: 0,
      lotteryView: '',
      upgrade: null,
      notice: ''
    };
  }

  function init() {
    if (!state) {
      state = createState();
      // Explicit review scene: a saved Mock result, not a claim request on page load.
      if ((source.scenarios[state.scenarioKey] || {}).previewResult) {
        state.lastBatch = {
          batchNo: 0, snapshotLevel: state.userLevel, snapshotVin: state.vin,
          snapshotAudiences: state.audiences.slice(), directActivityIds: [],
          queuedLotteryIds: [], completedLotteryIds: [], historicalLotteryIds: [],
          lockedActivityIds: [], upcomingActivityIds: [],
          endedActivityIds: [], hiddenActivityIds: [], newlyClaimedIds: [],
          claimedIdsBefore: state.claimedIds.slice(), claimedIdsAfter: state.claimedIds.slice(), serviceError: false
        };
        state.activities.forEach(function (activity) {
          var bucket = 'directActivityIds';
          if (!audienceMatches(activity)) bucket = 'hiddenActivityIds';
          else if (activity.timeStatus === 'upcoming') bucket = 'upcomingActivityIds';
          else if (activity.timeStatus === 'ended') bucket = 'endedActivityIds';
          else if (!vinMatches(activity) || !levelReady(activity.requiredLevel, state.userLevel)) bucket = 'lockedActivityIds';
          else if (activity.type === 'lottery') bucket = state.lotteryRecords[activity.id] ? 'historicalLotteryIds' : 'queuedLotteryIds';
          state.lastBatch[bucket].push(activity.id);
        });
      }
    }
  }

  function levelMeta(level) {
    return source.levels[level] || source.levels.error;
  }

  function levelReady(requiredLevel, currentLevel) {
    var current = source.levels[currentLevel || state.userLevel];
    var required = source.levels[requiredLevel];
    return Boolean(current && required && current.rank >= required.rank && current.rank > 0);
  }

  function findActivity(id) {
    return state.activities.find(function (activity) { return activity.id === id; }) || null;
  }

  function findCoupon(id) {
    var found = null;
    state.activities.some(function (activity) {
      return activity.coupons.some(function (coupon) {
        if (coupon.id !== id) return false;
        found = coupon;
        return true;
      });
    });
    return found;
  }

  function unique(list) {
    return (list || []).filter(function (item, index, values) { return values.indexOf(item) === index; });
  }

  function audienceMatches(activity) {
    return state.audiences.indexOf(activity.audienceKey) >= 0;
  }

  function vinMatches(activity) {
    return activity.requiredLevel === 'number' || Boolean(state.vin);
  }

  function topBar(title, backAction) {
    return '<header class="top-bar">' +
      '<button class="icon-button" type="button" data-action="' + (backAction || 'back') + '" aria-label="返回"><span class="back-arrow" aria-hidden="true"></span></button>' +
      '<h1>' + utils.escapeHTML(title) + '</h1>' +
      '<button class="icon-button" type="button" data-action="more" aria-label="更多"><span class="top-more" aria-hidden="true"><i></i><i></i><i></i></span></button>' +
      '</header>';
  }

  function renderComboTimeGate() {
    var ended = state.comboStatus === 'ended';
    return '<div class="phone-page time-gate-page" data-testid="combo-time-gate">' +
      topBar('活动政策') +
      '<div class="time-gate-stage"><section class="time-gate-card"><h2>' +
        (ended ? '活动已结束，感谢关注！' : '活动暂未开启，感谢关注！') +
      '</h2></section></div>' +
    '</div>';
  }

  function renderMaterial(material) {
    var e = utils.escapeHTML;
    if (material.ratio === 'rules') {
      return '<section class="campaign-rules" data-material-id="' + e(material.id) + '"><span class="campaign-eyebrow">参与须知</span><h2>' + e(material.headline) + '</h2><ol>' + material.rules.map(function (rule) { return '<li>' + e(rule) + '</li>'; }).join('') + '</ol><p class="campaign-fineprint">具体权益以活动页面展示及卡券使用规则为准</p></section>';
    }
    var participate = material.action === 'participate';
    var linked = participate || material.action === 'link';
    var tag = linked ? 'button' : 'section';
    var copy = '';
    if (participate) copy = '<div class="campaign-participate-copy"><span>车主专享福利</span><strong>立即参与</strong><small>养护好礼 · 幸运抽奖</small></div><span class="campaign-arrow" aria-hidden="true">→</span>';
    else if (material.ratio === 'hero') copy = '<div class="campaign-material-copy"><span class="campaign-eyebrow">' + e(material.eyebrow) + '</span><h2>' + e(material.headline) + '</h2><p>' + e(material.copy) + '</p><span class="campaign-period">' + e(source.combo.period) + '</span></div>';
    else if (material.ratio === 'poster') copy = '<div class="campaign-poster-copy"><span class="campaign-eyebrow">' + e(material.eyebrow) + '</span><h2>' + e(material.headline) + '</h2><p>' + e(material.copy) + '</p><div class="campaign-benefits">' + material.benefits.map(function (benefit, index) { return '<article><b>0' + (index + 1) + '</b><strong>' + e(benefit.title) + '</strong><span>' + e(benefit.copy) + '</span></article>'; }).join('') + '</div></div>';
    else copy = '<div class="campaign-shop-copy"><span class="campaign-eyebrow">' + e(material.eyebrow) + '</span><h2>' + e(material.headline) + '</h2><p>' + e(material.copy) + ' →</p></div>';
    return '<' + tag + ' class="policy-material policy-material--' + e(material.ratio) + '" ' + (linked ? 'type="button" data-action="' + (participate ? 'participate' : 'material-link') + '" ' : '') + (participate ? 'data-testid="participate" ' : '') + 'data-material-id="' + e(material.id) + '" aria-label="' + e(material.alt) + '">' +
      (material.src ? '<img src="' + e(material.src) + '" alt="' + e(material.alt) + '">' : '') + copy + '</' + tag + '>';
  }

  function renderActivity() {
    if (state.comboStatus !== 'active') return renderComboTimeGate();
    return '<div class="phone-page activity-page policy-page">' +
      topBar('活动政策') +
      '<div class="page-content policy-content">' +
        (state.notice ? '<div class="return-notice" data-testid="return-notice">' + utils.escapeHTML(state.notice) + '</div>' : '') +
        '<div class="policy-materials" data-testid="policy-materials">' + source.combo.materials.map(renderMaterial).join('') + '</div>' +
      '</div>' +
    '</div>';
  }

  function renderLogin() {
    return '<div class="phone-page login-page">' +
      topBar('账号登录', 'login-back') +
      '<div class="login-content">' +
        '<img src="assets/images/combo-hero.png" alt="车主活动登录背景">' +
        '<span>登录后继续参与</span><h2>请先登录您的账号</h2>' +
        '<p>登录后即可参与活动。</p>' +
        '<button class="primary-button" type="button" data-action="complete-login" data-testid="complete-login">一键登录并继续</button>' +
        '<button class="text-button" type="button" data-action="login-back">暂不登录</button>' +
      '</div>' +
    '</div>';
  }

  function issueCouponIds(ids, batch) {
    (ids || []).forEach(function (id) {
      var coupon = findCoupon(id);
      if (!coupon || coupon.expired) return;
      if (state.claimedIds.indexOf(id) < 0) {
        state.claimedIds.push(id);
        if (batch.newlyClaimedIds.indexOf(id) < 0) batch.newlyClaimedIds.push(id);
      }
    });
  }

  function startParticipation() {
    init();
    if (state.comboStatus !== 'active') {
      window.ComboRouter.go('activity');
      return;
    }
    if (!state.loggedIn) {
      window.ComboRouter.go('login');
      return;
    }

    state.batchCount += 1;
    state.contextQueryCount += 1;
    state.notice = '';
    state.readyActivitiesExpanded = false;

    var batch = {
      batchNo: state.batchCount,
      snapshotLevel: state.userLevel,
      snapshotVin: state.vin,
      snapshotAudiences: state.audiences.slice(),
      directActivityIds: [],
      queuedLotteryIds: [],
      completedLotteryIds: [],
      historicalLotteryIds: [],
      lockedActivityIds: [],
      upcomingActivityIds: [],
      endedActivityIds: [],
      hiddenActivityIds: [],
      newlyClaimedIds: [],
      claimedIdsBefore: state.claimedIds.slice(),
      claimedIdsAfter: [],
      serviceError: state.userLevel === 'error'
    };

    if (batch.serviceError) {
      batch.claimedIdsAfter = state.claimedIds.slice();
      state.lastBatch = batch;
      window.ComboRouter.go('result');
      return;
    }

    state.activities.slice().sort(function (a, b) { return a.order - b.order; }).forEach(function (activity) {
      if (!audienceMatches(activity)) {
        batch.hiddenActivityIds.push(activity.id);
        return;
      }
      if (activity.timeStatus === 'upcoming') {
        batch.upcomingActivityIds.push(activity.id);
        return;
      }
      if (activity.timeStatus === 'ended') {
        batch.endedActivityIds.push(activity.id);
        return;
      }
      if (!vinMatches(activity) || !levelReady(activity.requiredLevel, state.userLevel)) {
        batch.lockedActivityIds.push(activity.id);
        return;
      }
      if (activity.type === 'lottery') {
        var record = state.lotteryRecords[activity.id];
        if (record && record.status === 'completed') batch.historicalLotteryIds.push(activity.id);
        else batch.queuedLotteryIds.push(activity.id);
        return;
      }
      batch.directActivityIds.push(activity.id);
      issueCouponIds(activity.coupons.map(function (coupon) { return coupon.id; }), batch);
    });

    batch.claimedIdsAfter = state.claimedIds.slice();
    state.lastBatch = batch;
    state.lotteryQueue = batch.queuedLotteryIds.slice();
    state.lotteryIndex = 0;
    state.lotteryView = '';

    if (state.lotteryQueue.length) window.ComboRouter.go('lottery');
    else window.ComboRouter.go('result');
  }

  function currentLottery() {
    return findActivity(state.lotteryQueue[state.lotteryIndex]);
  }

  function renderLotteryCoupon(coupon) {
    return '<div class="lottery-prize"><span>' + utils.escapeHTML(coupon.name) + '</span><strong>' + utils.escapeHTML(coupon.value) + utils.escapeHTML(coupon.unit) + '</strong><small>' + utils.escapeHTML(coupon.rule) + '</small></div>';
  }

  function renderLottery() {
    var activity = currentLottery();
    if (!activity || !state.lastBatch) return renderActivity();
    var record = state.lotteryRecords[activity.id];
    var finished = Boolean(record && record.status === 'completed' && state.lotteryView === activity.id);
    var remaining = Math.max(0, state.lotteryQueue.length - state.lotteryIndex - 1);
    var outcomeTitle = record && record.outcome === 'won' ? '恭喜中奖' : '很遗憾，未中奖';
    return '<div class="phone-page lottery-page" data-testid="lottery-page" data-activity-id="' + utils.escapeHTML(activity.id) + '">' +
      topBar('活动抽奖', 'lottery-back') +
      '<div class="lottery-content">' +
        '<div class="lottery-cover"><img src="assets/images/combo-hero.png" alt="' + utils.escapeHTML(activity.drawTitle) + '"></div>' +
        '<p class="lottery-progress">' + (state.lotteryQueue.length > 1 ? '专属惊喜 ' + (state.lotteryIndex + 1) + ' / ' + state.lotteryQueue.length : '秋日车主幸运礼') + '</p>' +
        (finished ?
          '<section class="lottery-result ' + (record.outcome === 'won' ? 'is-won' : 'is-lost') + '"><span>抽奖结果</span><h2>' + outcomeTitle + '</h2><p>' + (record.outcome === 'won' ? '奖品已发放至您的卡包' : '本次未获得奖品，感谢您的参与') + '</p>' + (record.outcome === 'won' ? activity.coupons.map(renderLotteryCoupon).join('') : '') + '</section>' :
          '<section class="lottery-panel"><span>车主专属 · 幸运好礼</span><h2>' + utils.escapeHTML(activity.drawTitle) + '</h2><p>点击立即抽奖，看看今天的幸运好礼。</p><div class="lottery-prize-preview">最高可得 ' + utils.escapeHTML(activity.coupons[0].value + activity.coupons[0].unit) + '</div></section>') +
      '</div>' +
      '<footer class="lottery-footer">' +
        (finished ? '<button class="primary-button" type="button" data-action="continue-lottery" data-testid="continue-lottery">' + (remaining ? '继续抽奖（还有 ' + remaining + ' 份惊喜）' : '查看我的好礼') + '</button>' : '<button class="primary-button" type="button" data-action="draw" data-testid="draw">立即抽奖</button>') +
      '</footer>' +
    '</div>';
  }

  function completeLottery() {
    var activity = currentLottery();
    if (!activity || !state.lastBatch) return;
    var existing = state.lotteryRecords[activity.id];
    if (existing && existing.status === 'completed') {
      state.lotteryView = activity.id;
      render('lottery');
      return;
    }
    var outcome = state.outcomes[activity.id] || 'lost';
    var prizeIds = outcome === 'won' ? activity.coupons.map(function (coupon) { return coupon.id; }) : [];
    state.lotteryRecords[activity.id] = { status: 'completed', outcome: outcome, prizeCouponIds: prizeIds };
    state.lastBatch.completedLotteryIds.push(activity.id);
    issueCouponIds(prizeIds, state.lastBatch);
    state.lastBatch.claimedIdsAfter = state.claimedIds.slice();
    state.lotteryView = activity.id;
    render('lottery');
  }

  function continueLottery() {
    state.lotteryIndex += 1;
    state.lotteryView = '';
    while (state.lotteryIndex < state.lotteryQueue.length) {
      var record = state.lotteryRecords[state.lotteryQueue[state.lotteryIndex]];
      if (!record || record.status !== 'completed') break;
      state.lotteryIndex += 1;
    }
    if (state.lotteryIndex >= state.lotteryQueue.length) window.ComboRouter.go('result');
    else render('lottery');
  }

  function couponStatus(activity, coupon) {
    var owned = state.claimedIds.indexOf(coupon.id) >= 0;
    if (coupon.expired) return 'expired';
    if (!owned) return 'unclaimed';
    // Coupons already received on this page are activated; no extra activation step.
    return 'active';
  }

  function sortedCoupons(activity) {
    var ranks = { unclaimed: 0, active: 1, expired: 2 };
    var seen = {};
    return activity.coupons.filter(function (coupon) {
      if (seen[coupon.id]) return false;
      seen[coupon.id] = true;
      return true;
    }).map(function (coupon, index) { return { coupon: coupon, index: index }; })
      .sort(function (a, b) {
        return ranks[couponStatus(activity, a.coupon)] - ranks[couponStatus(activity, b.coupon)] || a.index - b.index;
      }).map(function (entry) { return entry.coupon; });
  }

  function isLocked(activity) {
    return !vinMatches(activity) || !levelReady(activity.requiredLevel, state.lastBatch.snapshotLevel);
  }

  function needsUpgrade(activity) {
    var record = state.lotteryRecords[activity.id];
    return activity.timeStatus === 'active' && isLocked(activity) && !(record && record.status === 'completed') && sortedCoupons(activity).some(function (coupon) { return couponStatus(activity, coupon) === 'unclaimed'; });
  }

  function renderResultCoupon(activity, coupon) {
    var status = couponStatus(activity, coupon);
    var action = '', text = '', disabled = false;
    var record = state.lotteryRecords[activity.id];
    if (status === 'expired') { text = '已过期'; disabled = true; }
    else if (status === 'active') { text = '立即使用'; action = 'use-coupon'; }
    else if (activity.timeStatus === 'upcoming') { text = '活动未开始'; disabled = true; }
    else if (activity.timeStatus === 'ended') { text = '暂不可领取'; disabled = true; }
    else if (activity.type === 'lottery' && record && record.status === 'completed') { text = record.outcome === 'lost' ? '未中奖' : '未获得'; disabled = true; }
    else if (isLocked(activity)) { text = '待解锁'; disabled = true; }
    else if (activity.type === 'lottery') {
      if (record && record.status === 'completed') { text = record.outcome === 'lost' ? '未中奖' : '未获得'; disabled = true; }
      else { text = '去抽奖'; action = 'resume-lottery'; }
    } else { text = '立即领取'; action = 'claim-coupon'; }
    var lockedCoupon = status === 'unclaimed' && needsUpgrade(activity);
    // imageSrc is a prototype display option, not a confirmed backend contract.
    var couponVisual = coupon.imageSrc ? '<div class="legacy-coupon-visual"><img src="' + utils.escapeHTML(coupon.imageSrc) + '" alt="' + utils.escapeHTML(coupon.name) + '"></div>' :
      '<div class="legacy-coupon-copy"><div class="coupon-amount"><strong>' + utils.escapeHTML(coupon.value) + '</strong><em>' + utils.escapeHTML(coupon.unit) + '</em></div><span class="coupon-name">' + utils.escapeHTML(coupon.name) + '</span><small class="coupon-rule">' + utils.escapeHTML(coupon.rule) + '</small></div>';
    return '<article class="legacy-coupon' + (lockedCoupon ? ' is-locked' : '') + '" data-coupon-id="' + utils.escapeHTML(coupon.id) + '" data-status="' + status + '"' + (coupon.imageSrc ? ' data-coupon-image="true"' : '') + '>' +
      couponVisual +
      '<div class="legacy-coupon-control"><button type="button" class="legacy-coupon-button" data-action="' + action + '" data-activity-id="' + utils.escapeHTML(activity.id) + '" data-coupon-id="' + utils.escapeHTML(coupon.id) + '" data-target-level="' + activity.requiredLevel + '"' + (disabled ? ' disabled' : '') + '>' + text + '</button>' +
      '</div></article>';
  }

  function resultCoupons(activity) {
    var coupons = sortedCoupons(activity);
    // Locked groups remain previews; the received list only shows awarded lottery prizes.
    if (activity.type !== 'lottery' || needsUpgrade(activity)) return coupons;
    var record = state.lotteryRecords[activity.id];
    if (!record || record.status !== 'completed' || record.outcome !== 'won') return [];
    return coupons.filter(function (coupon) {
      return (record.prizeCouponIds || []).indexOf(coupon.id) >= 0 && state.claimedIds.indexOf(coupon.id) >= 0;
    });
  }

  function renderResultActivity(activity) {
    var coupons = resultCoupons(activity);
    var expanded = state.expandedActivityIds.indexOf(activity.id) >= 0;
    var visible = expanded ? coupons : coupons.slice(0, 3);
    var locked = needsUpgrade(activity);
    return '<section class="legacy-activity" data-activity-id="' + utils.escapeHTML(activity.id) + '" data-type="' + activity.type + '" data-time-status="' + activity.timeStatus + '" data-locked="' + locked + '">' +
      '<h2>' + utils.escapeHTML(activity.name) + '</h2>' +
      '<div class="legacy-coupon-list" id="coupons-' + activity.id + '">' + visible.map(function (coupon) { return renderResultCoupon(activity, coupon); }).join('') + '</div>' +
      (activity.timeStatus === 'upcoming' ? '<p class="legacy-countdown">活动开始倒计时：' + utils.escapeHTML(activity.countdown) + '</p>' : '') +
      (coupons.length > 3 ? '<button type="button" class="legacy-expand" data-action="toggle-coupons" data-activity-id="' + activity.id + '" aria-expanded="' + expanded + '" aria-controls="coupons-' + activity.id + '">' + (expanded ? '收起' : '查看更多') + '</button>' : '') +
      '</section>';
  }

  function renderUnlockGroup(level, activities) {
    if (!activities.length) return '';
    var verified = level === 'verified';
    var hasLottery = activities.some(function (activity) { return activity.type === 'lottery'; });
    var hasOwned = activities.some(function (activity) { return activity.coupons.some(function (coupon) { return state.claimedIds.indexOf(coupon.id) >= 0; }); });
    return '<section class="unlock-group is-' + level + '" data-unlock-level="' + level + '">' +
      '<header class="unlock-group-header"><span class="unlock-group-icon" aria-hidden="true">' + (verified ? '✓' : '＋') + '</span><div class="unlock-group-copy"><span class="campaign-eyebrow">' + activities.length + ' 个专享活动 · 待解锁</span><h2>' + (verified ? '认证后可领取' : '绑车后可领取') + '</h2><p>' + (verified ? '完成车主认证，解锁全部等级的可领卡券' : '绑定爱车，领取以下绑车级专享卡券') + '</p></div><button class="unlock-group-action" type="button" data-action="upgrade" data-target-level="' + level + '">' + (verified ? '去认证' : '去绑车') + '</button></header>' +
      '<p class="unlock-group-footnote">' + (hasLottery ? '抽奖活动解锁后仍需抽奖，奖品以抽奖结果为准。' : '仅限符合参与条件且在有效期内的待领卡券。') + (hasOwned ? '已领卡券仍可正常使用。' : '') + '</p>' +
      '<div class="unlock-group-activities">' + activities.map(renderResultActivity).join('') + '</div></section>';
  }

  function renderErrorResult() {
    return '<div class="phone-page result-page">' + topBar('领取结果') + '<div class="result-content"><section class="result-hero"><div class="result-icon is-error">!</div><h2>暂时无法核验</h2><p>暂时无法核验参与资格，本次未抽奖、未发券。</p></section><section class="error-card"><p>请稍后重试。</p><button class="primary-button" type="button" data-action="retry-context">重新校验</button></section></div></div>';
  }

  function renderReadyActivities(activities) {
    if (!activities.length) return '';
    var remaining = activities.slice(1);
    var expanded = state.readyActivitiesExpanded;
    return '<div class="ready-activities" data-testid="ready-activities">' +
      renderResultActivity(activities[0]) +
      (remaining.length ? '<div class="legacy-activity-stack other-ready-activities" id="other-ready-activities"' + (expanded ? '' : ' hidden') + '>' + (expanded ? remaining.map(renderResultActivity).join('') : '') + '</div>' +
        '<button type="button" class="ready-activities-toggle" data-action="toggle-ready-activities" aria-expanded="' + expanded + '" aria-controls="other-ready-activities">' + (expanded ? '收起其他已领活动' : '展开其他已领活动（' + remaining.length + '个）') + '</button>' : '') +
      '</div>';
  }

  function renderResult() {
    var batch = state.lastBatch;
    if (!batch) return renderActivity();
    if (batch.serviceError) return renderErrorResult();
    var activities = state.activities.filter(function (activity) {
      return activity.timeStatus !== 'ended' && batch.snapshotAudiences.indexOf(activity.audienceKey) >= 0 && batch.hiddenActivityIds.indexOf(activity.id) < 0 && (activity.type !== 'lottery' || resultCoupons(activity).length > 0);
    }).sort(function (a, b) { return Number(b.type === 'lottery') - Number(a.type === 'lottery') || a.order - b.order; });
    var hasCoupons = activities.some(function (activity) { return resultCoupons(activity).some(function (coupon) { return state.claimedIds.indexOf(coupon.id) >= 0; }); });
    var grouped = { ready: [], bound: [], verified: [], time: [] };
    activities.forEach(function (activity) {
      if (activity.timeStatus === 'upcoming') grouped.time.push(activity);
      else if (needsUpgrade(activity)) grouped[activity.requiredLevel].push(activity);
      else grouped.ready.push(activity);
    });
    var hasLocked = Boolean(grouped.bound.length || grouped.verified.length);
    var allLocked = !hasCoupons && activities.length > 0 && grouped.bound.length + grouped.verified.length === activities.length;
    var ownedCount = unique(activities.reduce(function (ids, activity) { return ids.concat(resultCoupons(activity).filter(function (coupon) { return state.claimedIds.indexOf(coupon.id) >= 0; }).map(function (coupon) { return coupon.id; })); }, [])).length;
    return '<div class="phone-page result-page" data-testid="participation-result">' +
      topBar(hasCoupons ? '领取成功' : '领取结果') +
      '<div class="legacy-result-content">' +
        (hasCoupons ? '<div class="campaign-result-summary"><span class="campaign-result-check" aria-hidden="true">✓</span><div><h2>好礼已放入您的卡包</h2><p>共 ' + ownedCount + ' 张卡券，请在有效期内使用</p></div></div>' : '') +
        (!hasCoupons ? (allLocked ? '<div class="campaign-locked-empty" data-testid="all-locked-result"><span aria-hidden="true">♡</span><h2>还有好礼，等您解锁</h2><p>当前等级暂不满足本页活动的参与条件，本次未发放卡券。</p><p>完成认证可解锁全部等级活动；绑车可解锁部分活动。</p></div>' : '<p class="legacy-result-notice" data-testid="empty-result">本次暂未领取卡券' + (hasLocked ? '，完成认证或绑车后可继续领取。' : '。') + '</p>') : '') +
        renderReadyActivities(grouped.ready) +
        renderUnlockGroup('verified', grouped.verified) + renderUnlockGroup('bound', grouped.bound) +
        (grouped.time.length ? '<h2 class="campaign-more-title">更多活动</h2><div class="legacy-activity-stack">' + grouped.time.map(renderResultActivity).join('') + '</div>' : '') +
        (!activities.length ? '<p class="legacy-result-notice">暂无符合参与条件的活动</p>' : '') +
        '<div class="coupon-center-entry"><button type="button" class="coupon-center-link" data-action="coupon-center" data-testid="more-coupons">查看更多优惠券</button></div>' +
      '</div>' +
    '</div>';
  }

  function renderCouponCenter() {
    return '<div class="phone-page coupon-center-page" data-testid="coupon-center">' + topBar('领券中心', 'coupon-center-back') +
      '<section class="coupon-center-placeholder"><span aria-hidden="true">🎟</span><h2>更多好礼，等您来领</h2><p>此处为领券中心跳转演示。<br>正式页面沿用现有领券中心，后续接入实际地址。</p></section></div>';
  }

  function startUpgrade(targetLevel) {
    state.upgrade = { targetLevel: targetLevel };
    window.ComboRouter.go('upgrade');
  }

  function renderUpgrade() {
    if (!state.upgrade) return renderResult();
    var target = state.upgrade.targetLevel;
    return '<div class="phone-page upgrade-page">' + topBar(target === 'verified' ? '车主认证' : '绑定车辆', 'upgrade-back') + '<div class="upgrade-content"><img class="upgrade-image" src="assets/images/policy-ribbon.png" alt="完善车辆信息"><h2>' + (target === 'verified' ? '认证车主，解锁更多关怀' : '绑定爱车，专享养护好礼') + '</h2><p>完成后返回活动页，再次点击“立即参与”，继续领取专属好礼。</p></div><footer class="upgrade-actions"><button class="primary-button" type="button" data-action="complete-upgrade">完成并返回活动</button><button class="secondary-button" type="button" data-action="upgrade-back">暂不升级</button></footer></div>';
  }

  function completeUpgrade() {
    if (!state.upgrade) return;
    state.userLevel = state.upgrade.targetLevel;
    if (!state.vin) state.vin = 'MOCK-VIN-001';
    if (state.audiences.indexOf('bound-owners') < 0) state.audiences.push('bound-owners');
    state.notice = state.userLevel === 'verified' ? '车主认证已完成，请再次点击“立即参与”' : '车辆绑定已完成，请再次点击“立即参与”';
    state.upgrade = null;
    window.ComboRouter.go('activity');
  }

  function bindCommon(app) {
    app.querySelectorAll('[data-action="more"]').forEach(function (button) { button.addEventListener('click', function () { utils.showToast('分享与客服功能沿用现有入口'); }); });
    app.querySelectorAll('[data-action="material-link"]').forEach(function (button) { button.addEventListener('click', function () { utils.showToast('前往活动商城（跳转演示）'); }); });
    app.querySelectorAll('[data-action="use-coupon"]').forEach(function (button) { button.addEventListener('click', function () { utils.showToast('卡券使用页跳转演示'); }); });
    app.querySelectorAll('[data-action="result-back"]').forEach(function (button) { button.addEventListener('click', function () { window.ComboRouter.go('activity'); }); });
  }

  function bindActivity(app) {
    var participate = app.querySelector('[data-action="participate"]');
    if (participate) participate.addEventListener('click', startParticipation);
  }

  function bindLogin(app) {
    app.querySelectorAll('[data-action="login-back"]').forEach(function (button) { button.addEventListener('click', function () { window.ComboRouter.go('activity'); }); });
    var login = app.querySelector('[data-action="complete-login"]');
    if (login) login.addEventListener('click', function () {
      var scenario = source.scenarios[state.scenarioKey] || {};
      state.loggedIn = true;
      state.userLevel = scenario.loginLevel || state.userLevel;
      state.vin = scenario.loginVin || state.vin;
      state.audiences = utils.clone(scenario.loginAudiences || state.audiences);
      startParticipation();
    });
  }

  function bindLottery(app) {
    var draw = app.querySelector('[data-action="draw"]');
    if (draw) draw.addEventListener('click', completeLottery);
    var next = app.querySelector('[data-action="continue-lottery"]');
    if (next) next.addEventListener('click', continueLottery);
    var back = app.querySelector('[data-action="lottery-back"]');
    if (back) back.addEventListener('click', function () {
      state.notice = '抽奖尚未完成，下次点击“立即参与”仍会进入未参加的抽奖';
      window.ComboRouter.go('activity');
    });
  }

  function bindResult(app) {
    var readyToggle = app.querySelector('[data-action="toggle-ready-activities"]');
    if (readyToggle) readyToggle.addEventListener('click', function () {
      state.readyActivitiesExpanded = !state.readyActivitiesExpanded;
      render('result', true);
      var toggle = app.querySelector('[data-action="toggle-ready-activities"]');
      if (toggle) toggle.focus({ preventScroll: true });
    });
    var couponCenter = app.querySelector('[data-action="coupon-center"]');
    if (couponCenter) couponCenter.addEventListener('click', function () { window.ComboRouter.go('coupon-center'); });
    app.querySelectorAll('[data-action="upgrade"]').forEach(function (button) { button.addEventListener('click', function () { startUpgrade(button.getAttribute('data-target-level')); }); });
    app.querySelectorAll('[data-action="toggle-coupons"]').forEach(function (button) { button.addEventListener('click', function () {
      var id = button.getAttribute('data-activity-id');
      var index = state.expandedActivityIds.indexOf(id);
      if (index < 0) state.expandedActivityIds.push(id);
      else state.expandedActivityIds.splice(index, 1);
      render('result', true);
      var toggle = app.querySelector('[data-action="toggle-coupons"][data-activity-id="' + id + '"]');
      if (toggle) toggle.focus({ preventScroll: true });
    }); });
    app.querySelectorAll('[data-action="claim-coupon"]').forEach(function (button) { button.addEventListener('click', function () {
      var activity = findActivity(button.getAttribute('data-activity-id'));
      var id = button.getAttribute('data-coupon-id');
      if (!activity || activity.type !== 'direct' || state.comboStatus !== 'active' || activity.timeStatus !== 'active' || !audienceMatches(activity) || isLocked(activity)) return;
      issueCouponIds([id], state.lastBatch);
      state.lastBatch.claimedIdsAfter = state.claimedIds.slice();
      render('result', true);
      utils.showToast('领取成功（原型演示）');
    }); });
    app.querySelectorAll('[data-action="resume-lottery"]').forEach(function (button) { button.addEventListener('click', function () {
      var activity = findActivity(button.getAttribute('data-activity-id'));
      var record = activity && state.lotteryRecords[activity.id];
      if (!activity || activity.type !== 'lottery' || state.comboStatus !== 'active' || activity.timeStatus !== 'active' || !audienceMatches(activity) || isLocked(activity) || (record && record.status === 'completed')) return;
      state.lotteryQueue = [activity.id];
      state.lotteryIndex = 0;
      state.lotteryView = '';
      window.ComboRouter.go('lottery');
    }); });
    var retry = app.querySelector('[data-action="retry-context"]');
    if (retry) retry.addEventListener('click', function () { state.userLevel = (source.scenarios[state.scenarioKey] || {}).retryLevel || 'bound'; startParticipation(); });
  }

  function bindUpgrade(app) {
    var complete = app.querySelector('[data-action="complete-upgrade"]');
    if (complete) complete.addEventListener('click', completeUpgrade);
    var back = app.querySelector('[data-action="upgrade-back"]');
    if (back) back.addEventListener('click', function () { state.upgrade = null; window.ComboRouter.go('result'); });
  }

  function bindCouponCenter(app) {
    var back = app.querySelector('[data-action="coupon-center-back"]');
    if (back) back.addEventListener('click', function () { window.ComboRouter.go(state.lastBatch ? 'result' : 'activity'); });
  }

  function render(route, preserveScroll) {
    init();
    var app = document.getElementById('app');
    if (!app) return;
    var activeRoute = route || 'activity';
    if (activeRoute === 'result' && !state.lastBatch) activeRoute = 'activity';
    if (activeRoute === 'lottery' && (!state.lastBatch || !currentLottery())) activeRoute = state.lastBatch ? 'result' : 'activity';
    if (activeRoute === 'upgrade' && !state.upgrade) activeRoute = state.lastBatch ? 'result' : 'activity';

    if (activeRoute === 'login') app.innerHTML = renderLogin();
    else if (activeRoute === 'lottery') app.innerHTML = renderLottery();
    else if (activeRoute === 'result') app.innerHTML = renderResult();
    else if (activeRoute === 'coupon-center') app.innerHTML = renderCouponCenter();
    else if (activeRoute === 'upgrade') app.innerHTML = renderUpgrade();
    else app.innerHTML = renderActivity();

    app.setAttribute('data-route', activeRoute);
    bindCommon(app);
    if (activeRoute === 'activity') bindActivity(app);
    if (activeRoute === 'login') bindLogin(app);
    if (activeRoute === 'lottery') bindLottery(app);
    if (activeRoute === 'result') bindResult(app);
    if (activeRoute === 'coupon-center') bindCouponCenter(app);
    if (activeRoute === 'upgrade') bindUpgrade(app);
    document.title = activeRoute === 'activity' ? '活动政策｜' + source.combo.title : activeRoute === 'lottery' ? '活动抽奖｜' + source.combo.title : activeRoute === 'result' ? '活动参与结果｜' + source.combo.title : activeRoute === 'coupon-center' ? '领券中心｜跳转演示' : '组合活动｜' + source.combo.title;
    if (!preserveScroll) window.scrollTo(0, 0);
  }

  window.ComboApp = {
    init: init,
    render: render,
    startParticipation: startParticipation,
    completeLottery: completeLottery,
    continueLottery: continueLottery,
    getState: function () { init(); return state; },
    getDebugSnapshot: function () {
      init();
      return {
        scenarioKey: state.scenarioKey,
        comboStatus: state.comboStatus,
        loggedIn: state.loggedIn,
        userLevel: state.userLevel,
        vin: state.vin,
        claimedIds: state.claimedIds.slice(),
        lotteryRecords: utils.clone(state.lotteryRecords),
        batchCount: state.batchCount,
        contextQueryCount: state.contextQueryCount,
        lastBatch: utils.clone(state.lastBatch)
      };
    },
    reset: function () { state = createState(); window.ComboRouter.go('activity', true); }
  };
})();
