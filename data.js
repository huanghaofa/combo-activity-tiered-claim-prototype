window.StateBoardData = {
  "version": "20260907-003-pages-only",
  "initialView": {
    "x": 0,
    "y": 100,
    "width": 3360,
    "height": 4040,
    "maxScale": 0.65
  },
  "sections": [
    {
      "id": "policy-group",
      "title": "01 · 活动政策页",
      "shortTitle": "政策页",
      "subtitle": "正常展示 / 活动未开始 / 活动已结束",
      "x": 80,
      "y": 160,
      "width": 510,
      "height": 2250
    },
    {
      "id": "login",
      "title": "02 · 登录弹窗",
      "shortTitle": "登录弹窗",
      "subtitle": "未登录才弹出，登录后继续本次参与",
      "x": 700,
      "y": 160,
      "width": 520,
      "height": 720
    },
    {
      "id": "lottery",
      "title": "03 · 抽奖页",
      "shortTitle": "抽奖页",
      "subtitle": "待抽奖 / 已中奖 / 未中奖；每次参与都检查未参加的抽奖",
      "x": 1380,
      "y": 160,
      "width": 1620,
      "height": 1260
    },
    {
      "id": "results",
      "title": "04 · 领券结果页",
      "shortTitle": "领券结果页",
      "subtitle": "同一个页面的五种情况：按实际发券、人群及等级展示；未中奖券不展示",
      "x": 700,
      "y": 1730,
      "width": 2540,
      "height": 2370
    }
  ],
  "nodes": [
    {
      "id": "policy",
      "type": "screen",
      "screenId": "policy",
      "title": "正常展示",
      "description": "后台配置图片及链接；点击图片内的参与入口。",
      "x": 170,
      "y": 350,
      "width": 340,
      "height": 1283.8974358974358,
      "sectionId": "policy-group",
      "coverage": [
        "F01"
      ]
    },
    {
      "id": "combo-upcoming",
      "type": "screen",
      "screenId": "combo-upcoming",
      "title": "活动暂未开启",
      "description": "加载或点击时，组合活动尚未到开始时间。",
      "x": 170,
      "y": 1730,
      "width": 340,
      "height": 267.38461538461536,
      "sectionId": "policy-group",
      "coverage": [
        "T01"
      ]
    },
    {
      "id": "combo-ended",
      "type": "screen",
      "screenId": "combo-ended",
      "title": "活动已结束",
      "description": "加载或点击时，组合活动已经结束。",
      "x": 170,
      "y": 2070,
      "width": 340,
      "height": 267.38461538461536,
      "sectionId": "policy-group",
      "coverage": [
        "T02"
      ]
    },
    {
      "id": "login-dialog",
      "type": "dialog",
      "title": "登录弹窗",
      "description": "未登录时提示；登录成功后继续参与。",
      "x": 790,
      "y": 360,
      "width": 360,
      "height": 260,
      "sectionId": "login"
    },
    {
      "id": "lottery-ready",
      "type": "screen",
      "screenId": "lottery-ready",
      "title": "待抽奖",
      "description": "符合人群、VIN/等级，且未参加过该抽奖。",
      "x": 1480,
      "y": 410,
      "width": 340,
      "height": 835.7948717948718,
      "sectionId": "lottery",
      "coverage": [
        "L01"
      ]
    },
    {
      "id": "lottery-won",
      "type": "screen",
      "screenId": "lottery-won",
      "title": "已中奖",
      "description": "发放本次实际中奖券，记录已经参加。",
      "x": 2020,
      "y": 410,
      "width": 340,
      "height": 835.7948717948718,
      "sectionId": "lottery",
      "coverage": [
        "L02"
      ]
    },
    {
      "id": "lottery-lost",
      "type": "screen",
      "screenId": "lottery-lost",
      "title": "未中奖",
      "description": "记录已经参加；领券结果中不展示未中奖券。",
      "x": 2560,
      "y": 410,
      "width": 340,
      "height": 835.7948717948718,
      "sectionId": "lottery",
      "coverage": [
        "L03"
      ]
    },
    {
      "id": "number-partial",
      "type": "screen",
      "screenId": "number-partial",
      "title": "部分领取 · 需认证 / 绑车",
      "description": "号码级示例；已领券在前，认证组在绑车组前。",
      "x": 790,
      "y": 1980,
      "width": 340,
      "height": 1976.1025641025642,
      "sectionId": "results",
      "coverage": [
        "R01",
        "F03"
      ]
    },
    {
      "id": "bound-folded",
      "type": "screen",
      "screenId": "bound-folded",
      "title": "部分领取 · 仅需认证",
      "description": "绑车级示例；首个已领活动显示，其他默认折叠。",
      "x": 1280,
      "y": 1980,
      "width": 340,
      "height": 1175.7948717948718,
      "sectionId": "results",
      "coverage": [
        "R02"
      ]
    },
    {
      "id": "verified-expanded",
      "type": "screen",
      "screenId": "verified-expanded",
      "title": "可参与活动全部领取",
      "description": "认证级示例；为方便看图，已领活动在此全部展开。",
      "x": 1770,
      "y": 1980,
      "width": 340,
      "height": 1858.4102564102564,
      "sectionId": "results",
      "coverage": [
        "R04",
        "F05"
      ]
    },
    {
      "id": "all-locked",
      "type": "screen",
      "screenId": "all-locked",
      "title": "本次未领取 · 等级不足",
      "description": "所有子活动均需升级；显示认证与绑车引导及卡券。",
      "x": 2260,
      "y": 1980,
      "width": 340,
      "height": 1473.948717948718,
      "sectionId": "results",
      "coverage": [
        "R03",
        "F04"
      ]
    },
    {
      "id": "audience-none",
      "type": "screen",
      "screenId": "audience-none",
      "title": "本次未领取 · 人群不匹配",
      "description": "没有可参与活动；不展示通过升级即可领取的承诺。",
      "x": 2750,
      "y": 1980,
      "width": 340,
      "height": 835.7948717948718,
      "sectionId": "results",
      "coverage": [
        "R05"
      ]
    }
  ],
  "edges": [
    {
      "id": "E01",
      "from": "policy",
      "to": "combo-upcoming",
      "label": "时间未到",
      "fromSide": "left",
      "toSide": "left",
      "kind": "detail",
      "fromRatio": 0.15,
      "points": [
        {
          "x": 125,
          "y": 542.5846153846154
        },
        {
          "x": 125,
          "y": 1863.6923076923076
        }
      ],
      "labelX": 125,
      "labelY": 1665.5261538461536
    },
    {
      "id": "E02",
      "from": "policy",
      "to": "combo-ended",
      "label": "时间已过",
      "fromSide": "left",
      "toSide": "left",
      "kind": "detail",
      "fromRatio": 0.22,
      "points": [
        {
          "x": 125,
          "y": 632.4574358974359
        },
        {
          "x": 125,
          "y": 2203.6923076923076
        }
      ],
      "labelX": 83,
      "labelY": 1418.0748717948718
    },
    {
      "id": "E03",
      "from": "policy",
      "to": "login-dialog",
      "label": "点击立即参与\n尚未登录",
      "fromSide": "right",
      "toSide": "left",
      "kind": "flow",
      "fromRatio": 0.13,
      "points": [
        {
          "x": 555,
          "y": 516.9066666666666
        },
        {
          "x": 745,
          "y": 516.9066666666666
        },
        {
          "x": 745,
          "y": 490
        }
      ],
      "labelX": 650,
      "labelY": 516.9066666666666
    },
    {
      "id": "E04",
      "from": "login-dialog",
      "to": "policy",
      "label": "登录成功\n继续本次参与",
      "fromSide": "bottom",
      "toSide": "right",
      "kind": "return",
      "toRatio": 0.25,
      "points": [
        {
          "x": 970,
          "y": 665
        },
        {
          "x": 555,
          "y": 665
        },
        {
          "x": 555,
          "y": 670.9743589743589
        }
      ],
      "labelX": 762.5,
      "labelY": 665
    },
    {
      "id": "E05",
      "from": "policy",
      "to": "lottery-ready",
      "label": "已登录，校验人群 + VIN/等级\n存在符合条件且未参加的抽奖",
      "fromSide": "right",
      "toSide": "left",
      "kind": "flow",
      "fromRatio": 0.35,
      "toRatio": 0.4,
      "points": [
        {
          "x": 555,
          "y": 799.3641025641025
        },
        {
          "x": 1435,
          "y": 799.3641025641025
        },
        {
          "x": 1435,
          "y": 744.3179487179488
        }
      ],
      "labelX": 995,
      "labelY": 799.3641025641025
    },
    {
      "id": "E06",
      "from": "policy",
      "to": "results",
      "label": "已登录，资格校验后\n无符合条件的待参加抽奖",
      "fromSide": "right",
      "toSide": "top",
      "kind": "flow",
      "fromRatio": 0.66,
      "toRatio": 0.12,
      "points": [
        {
          "x": 555,
          "y": 1197.3723076923077
        },
        {
          "x": 555,
          "y": 1685
        },
        {
          "x": 1004.8,
          "y": 1685
        }
      ],
      "labelX": 779.9,
      "labelY": 1685
    },
    {
      "id": "E07",
      "from": "lottery-ready",
      "to": "lottery-won",
      "label": "点击抽奖 → 中奖",
      "fromSide": "right",
      "toSide": "left",
      "kind": "flow",
      "fromRatio": 0.35,
      "toRatio": 0.35,
      "points": [
        {
          "x": 1865,
          "y": 702.5282051282052
        },
        {
          "x": 1975,
          "y": 702.5282051282052
        }
      ],
      "labelX": 1920,
      "labelY": 702.5282051282052
    },
    {
      "id": "E08",
      "from": "lottery-ready",
      "to": "lottery-lost",
      "label": "点击抽奖 → 未中奖",
      "fromSide": "top",
      "toSide": "top",
      "kind": "flow",
      "points": [
        {
          "x": 1650,
          "y": 365
        },
        {
          "x": 2730,
          "y": 365
        }
      ],
      "labelX": 2190,
      "labelY": 365
    },
    {
      "id": "E09",
      "from": "lottery-won",
      "to": "results",
      "label": "无其他待抽奖活动\n展示普通券 + 中奖券",
      "fromSide": "bottom",
      "toSide": "top",
      "kind": "flow",
      "toRatio": 0.53,
      "points": [
        {
          "x": 2190,
          "y": 1290.7948717948718
        },
        {
          "x": 2046.2,
          "y": 1290.7948717948718
        },
        {
          "x": 2046.2,
          "y": 1685
        }
      ],
      "labelX": 2046.2,
      "labelY": 1487.897435897436
    },
    {
      "id": "E10",
      "from": "lottery-lost",
      "to": "results",
      "label": "无其他待抽奖活动\n不展示未中奖券",
      "fromSide": "bottom",
      "toSide": "top",
      "kind": "flow",
      "toRatio": 0.81,
      "points": [
        {
          "x": 2730,
          "y": 1290.7948717948718
        },
        {
          "x": 2730,
          "y": 1685
        },
        {
          "x": 2757.4,
          "y": 1685
        }
      ],
      "labelX": 2730,
      "labelY": 1487.897435897436
    },
    {
      "id": "E11",
      "from": "lottery-won",
      "to": "lottery-ready",
      "label": "还有符合条件未参加的抽奖\n进入下一抽奖活动",
      "fromSide": "top",
      "toSide": "top",
      "kind": "return",
      "fromRatio": 0.3,
      "toRatio": 0.3,
      "points": [
        {
          "x": 2122,
          "y": 365
        },
        {
          "x": 1582,
          "y": 365
        }
      ],
      "labelX": 1852,
      "labelY": 365
    },
    {
      "id": "E12",
      "from": "lottery-lost",
      "to": "lottery-ready",
      "label": "还有其他待参加抽奖",
      "fromSide": "right",
      "toSide": "bottom",
      "kind": "return",
      "fromRatio": 0.7,
      "points": [
        {
          "x": 2945,
          "y": 995.0564102564102
        },
        {
          "x": 2945,
          "y": 1290.7948717948718
        },
        {
          "x": 1650,
          "y": 1290.7948717948718
        }
      ],
      "labelX": 2297.5,
      "labelY": 1290.7948717948718
    },
    {
      "id": "E13",
      "from": "results",
      "to": "policy",
      "label": "完成认证 / 绑车后返回\n手动再次点击参与",
      "fromSide": "left",
      "toSide": "right",
      "kind": "return",
      "fromRatio": 0.09,
      "toRatio": 0.9,
      "points": [
        {
          "x": 655,
          "y": 1943.3
        },
        {
          "x": 655,
          "y": 1505.5076923076922
        },
        {
          "x": 555,
          "y": 1505.5076923076922
        }
      ],
      "labelX": 655,
      "labelY": 1811.9623076923076
    }
  ],
  "coverage": {
    "F01": "policy",
    "T01": "combo-upcoming",
    "T02": "combo-ended",
    "L01": "lottery-ready",
    "L02": "lottery-won",
    "L03": "lottery-lost",
    "R01": "number-partial",
    "F03": "number-partial",
    "R02": "bound-folded",
    "R04": "verified-expanded",
    "F05": "verified-expanded",
    "R03": "all-locked",
    "F04": "all-locked",
    "R05": "audience-none"
  }
};
