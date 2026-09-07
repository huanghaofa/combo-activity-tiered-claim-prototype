(function () {
  'use strict';
  var key = new URLSearchParams(window.location.search || '').get('scene');
  var scenario = window.ComboPrototypeData.scenarios[key];
  if (!scenario || !scenario.previewResult) return;
  var state = window.ComboApp.getState();
  // These are explicit saved Mock snapshots, not participation or grant requests.
  if (scenario.previewLottery) {
    state.lotteryQueue = [scenario.previewLottery.activityId];
    state.lotteryIndex = 0;
    state.lotteryView = scenario.previewLottery.finished ? scenario.previewLottery.activityId : '';
  }
  if (scenario.previewUpgrade) state.upgrade = { targetLevel: scenario.previewUpgrade };
  if (scenario.previewContextError) state.lastBatch.serviceError = true;
  if (scenario.previewArtwork) {
    state.activities.forEach(function (activity) {
      activity.coupons.forEach(function (coupon) {
        if (coupon.id === scenario.previewArtwork.couponId) coupon.imageSrc = scenario.previewArtwork.src;
      });
    });
  }
})();
