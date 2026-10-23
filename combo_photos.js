// 写真の権利者から利用許可を得た写真だけを登録してください。画像パスは assets/combos/ 以下を推奨。
const COMBO_CATALOG = [
  {
    "id": "combo_01",
    "name": "パステル × エンチ",
    "genes": {
      "パステル": 1,
      "エンチ": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_02",
    "name": "パステル × レオパード",
    "genes": {
      "パステル": 1,
      "レオパード": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_03",
    "name": "パステル × オレンジドリーム",
    "genes": {
      "パステル": 1,
      "オレンジドリーム": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_04",
    "name": "イエローベリー × ファイア",
    "genes": {
      "イエローベリー": 1,
      "ファイア": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_05",
    "name": "パステル × クラウン",
    "genes": {
      "パステル": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_06",
    "name": "エンチ × クラウン",
    "genes": {
      "エンチ": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_07",
    "name": "レオパード × クラウン",
    "genes": {
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_08",
    "name": "パステル × パイド",
    "genes": {
      "パステル": 1,
      "パイド": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_09",
    "name": "バナナ × パイド",
    "genes": {
      "バナナ": 1,
      "パイド": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_10",
    "name": "パステル × デザートゴースト",
    "genes": {
      "パステル": 1,
      "デザートゴースト": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_11",
    "name": "パステル × バナナ",
    "genes": {
      "パステル": 1,
      "バナナ": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_12",
    "name": "バナナ × エンチ",
    "genes": {
      "バナナ": 1,
      "エンチ": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_13",
    "name": "パステル × モハベ",
    "genes": {
      "パステル": 1,
      "モハベ": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_14",
    "name": "モハベ × ファイア",
    "genes": {
      "モハベ": 1,
      "ファイア": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_15",
    "name": "エンチ × オレンジドリーム",
    "genes": {
      "エンチ": 1,
      "オレンジドリーム": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_16",
    "name": "レオパード × オレンジドリーム",
    "genes": {
      "レオパード": 1,
      "オレンジドリーム": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_17",
    "name": "パステル × レッドストライプ",
    "genes": {
      "パステル": 1,
      "レッドストライプ": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_18",
    "name": "デザートゴースト × クラウン",
    "genes": {
      "デザートゴースト": 2,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_19",
    "name": "レオパード × デザートゴースト",
    "genes": {
      "レオパード": 1,
      "デザートゴースト": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_20",
    "name": "オレンジドリーム × クラウン",
    "genes": {
      "オレンジドリーム": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_21",
    "name": "パステル × エンチ × レオパード",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "レオパード": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_22",
    "name": "パステル × エンチ × オレンジドリーム",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "オレンジドリーム": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_23",
    "name": "パステル × バナナ × エンチ",
    "genes": {
      "パステル": 1,
      "バナナ": 1,
      "エンチ": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_24",
    "name": "パステル × レオパード × クラウン",
    "genes": {
      "パステル": 1,
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_25",
    "name": "エンチ × レオパード × クラウン",
    "genes": {
      "エンチ": 1,
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_26",
    "name": "パステル × オレンジドリーム × クラウン",
    "genes": {
      "パステル": 1,
      "オレンジドリーム": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_27",
    "name": "バナナ × パステル × パイド",
    "genes": {
      "バナナ": 1,
      "パステル": 1,
      "パイド": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_28",
    "name": "パステル × エンチ × レオパード × クラウン",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_29",
    "name": "パステル × エンチ × オレンジドリーム × レオパード",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "オレンジドリーム": 1,
      "レオパード": 1
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  },
  {
    "id": "combo_30",
    "name": "パステル × エンチ × オレンジドリーム × レオパード × クラウン",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "オレンジドリーム": 1,
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "",
    "source": "",
    "credit": "",
    "status": "未登録"
  }
];
