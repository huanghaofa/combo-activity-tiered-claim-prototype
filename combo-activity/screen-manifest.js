window.ScreenManifest = {
  "policy": {
    "src": "screens/policy.png",
    "width": 390,
    "height": 1358,
    "kind": "page",
    "title": "活动政策页",
    "scene": "bound-lottery",
    "route": "activity",
    "actions": []
  },
  "combo-upcoming": {
    "src": "screens/combo-upcoming.png",
    "width": 390,
    "height": 192,
    "kind": "fragment",
    "title": "组合活动未开始",
    "scene": "combo-upcoming",
    "route": "activity",
    "actions": []
  },
  "combo-ended": {
    "src": "screens/combo-ended.png",
    "width": 390,
    "height": 192,
    "kind": "fragment",
    "title": "组合活动已结束",
    "scene": "combo-ended",
    "route": "activity",
    "actions": []
  },
  "lottery-ready": {
    "src": "screens/lottery-ready.png",
    "width": 390,
    "height": 844,
    "kind": "page",
    "title": "抽奖待参与",
    "scene": "lottery-ready-preview",
    "route": "lottery",
    "actions": []
  },
  "lottery-won": {
    "src": "screens/lottery-won.png",
    "width": 390,
    "height": 844,
    "kind": "page",
    "title": "抽奖已中奖",
    "scene": "lottery-won-preview",
    "route": "lottery",
    "actions": []
  },
  "lottery-lost": {
    "src": "screens/lottery-lost.png",
    "width": 390,
    "height": 844,
    "kind": "page",
    "title": "抽奖未中奖",
    "scene": "lottery-lost-preview",
    "route": "lottery",
    "actions": []
  },
  "number-partial": {
    "src": "screens/number-partial.png",
    "width": 390,
    "height": 2152,
    "kind": "page",
    "title": "号码级 · 部分领取",
    "scene": "grouped-preview",
    "route": "result",
    "actions": []
  },
  "bound-folded": {
    "src": "screens/bound-folded.png",
    "width": 390,
    "height": 1234,
    "kind": "page",
    "title": "绑车级 · 默认折叠",
    "scene": "folded-preview",
    "route": "result",
    "actions": []
  },
  "verified-expanded": {
    "src": "screens/verified-expanded.png",
    "width": 390,
    "height": 2017,
    "kind": "page",
    "title": "认证级 · 已领活动与卡券全部展开",
    "scene": "verified-result-preview",
    "route": "result",
    "actions": [
      "expand-ready",
      "expand-all-coupons"
    ]
  },
  "all-locked": {
    "src": "screens/all-locked.png",
    "width": 390,
    "height": 1576,
    "kind": "page",
    "title": "当前等级均不满足",
    "scene": "all-locked-preview",
    "route": "result",
    "actions": []
  },
  "audience-none": {
    "src": "screens/audience-none.png",
    "width": 390,
    "height": 844,
    "kind": "page",
    "title": "人群均不匹配",
    "scene": "no-eligible-preview",
    "route": "result",
    "actions": []
  }
};
