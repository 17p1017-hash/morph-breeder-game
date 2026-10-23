// 複合モルフ画像の登録データ。source が internal-composite 以外のものは実写写真として扱う。
const COMBO_CATALOG = [
  {
    "id": "combo_01",
    "name": "パステル × エンチ",
    "genes": {
      "パステル": 1,
      "エンチ": 1
    },
    "image": "assets/combos/combo_01.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_02",
    "name": "パステル × レオパード",
    "genes": {
      "パステル": 1,
      "レオパード": 1
    },
    "image": "assets/combos/combo_02.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_03",
    "name": "パステル × オレンジドリーム",
    "genes": {
      "パステル": 1,
      "オレンジドリーム": 1
    },
    "image": "assets/combos/combo_03.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_04",
    "name": "イエローベリー × ファイア",
    "genes": {
      "イエローベリー": 1,
      "ファイア": 1
    },
    "image": "assets/combos/combo_04.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_05",
    "name": "パステル × クラウン",
    "genes": {
      "パステル": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_05.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_06",
    "name": "エンチ × クラウン",
    "genes": {
      "エンチ": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_06.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_07",
    "name": "レオパード × クラウン",
    "genes": {
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_07.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_08",
    "name": "パステル × パイド",
    "genes": {
      "パステル": 1,
      "パイド": 2
    },
    "image": "assets/combos/combo_08.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_09",
    "name": "バナナ × パイド",
    "genes": {
      "バナナ": 1,
      "パイド": 2
    },
    "image": "assets/combos/combo_09.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_10",
    "name": "パステル × デザートゴースト",
    "genes": {
      "パステル": 1,
      "デザートゴースト": 2
    },
    "image": "assets/combos/combo_10.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_11",
    "name": "パステル × バナナ",
    "genes": {
      "パステル": 1,
      "バナナ": 1
    },
    "image": "assets/combos/combo_11_real.png",
    "source": "worldofballpythons",
    "credit": "World of Ball Pythons の Banana Pastel ページ由来の実写写真",
    "status": "実写登録済み",
    "page": "https://worldofballpythons.com/en/morphs/banana-pastel"
  },
  {
    "id": "combo_12",
    "name": "バナナ × エンチ",
    "genes": {
      "バナナ": 1,
      "エンチ": 1
    },
    "image": "assets/combos/combo_12.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_13",
    "name": "パステル × モハベ",
    "genes": {
      "パステル": 1,
      "モハベ": 1
    },
    "image": "assets/combos/combo_13.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_14",
    "name": "モハベ × ファイア",
    "genes": {
      "モハベ": 1,
      "ファイア": 1
    },
    "image": "assets/combos/combo_14.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_15",
    "name": "エンチ × オレンジドリーム",
    "genes": {
      "エンチ": 1,
      "オレンジドリーム": 1
    },
    "image": "assets/combos/combo_15.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_16",
    "name": "レオパード × オレンジドリーム",
    "genes": {
      "レオパード": 1,
      "オレンジドリーム": 1
    },
    "image": "assets/combos/combo_16.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_17",
    "name": "パステル × レッドストライプ",
    "genes": {
      "パステル": 1,
      "レッドストライプ": 1
    },
    "image": "assets/combos/combo_17.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_18",
    "name": "デザートゴースト × クラウン",
    "genes": {
      "デザートゴースト": 2,
      "クラウン": 2
    },
    "image": "assets/combos/combo_18.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_19",
    "name": "パステル × エンチ × クラウン",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_19.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_20",
    "name": "パステル × レオパード × クラウン",
    "genes": {
      "パステル": 1,
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_20.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_21",
    "name": "パステル × エンチ × レオパード",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "レオパード": 1
    },
    "image": "assets/combos/combo_21.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_22",
    "name": "パステル × オレンジドリーム × レオパード",
    "genes": {
      "パステル": 1,
      "オレンジドリーム": 1,
      "レオパード": 1
    },
    "image": "assets/combos/combo_22.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_23",
    "name": "バナナ × パステル × パイド",
    "genes": {
      "バナナ": 1,
      "パステル": 1,
      "パイド": 2
    },
    "image": "assets/combos/combo_23.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_24",
    "name": "バナナ × パステル × エンチ",
    "genes": {
      "バナナ": 1,
      "パステル": 1,
      "エンチ": 1
    },
    "image": "assets/combos/combo_24.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_25",
    "name": "イエローベリー × レオパード",
    "genes": {
      "イエローベリー": 1,
      "レオパード": 1
    },
    "image": "assets/combos/combo_25.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_26",
    "name": "ファイア × クラウン",
    "genes": {
      "ファイア": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_26.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_27",
    "name": "オレンジドリーム × クラウン",
    "genes": {
      "オレンジドリーム": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_27.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_28",
    "name": "モハベ × クラウン",
    "genes": {
      "モハベ": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_28.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_29",
    "name": "パステル × GHI",
    "genes": {
      "パステル": 1,
      "GHI": 1
    },
    "image": "assets/combos/combo_29.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_30",
    "name": "バナナ × GHI",
    "genes": {
      "バナナ": 1,
      "GHI": 1
    },
    "image": "assets/combos/combo_30.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_31",
    "name": "パステル × スパーク",
    "genes": {
      "パステル": 1,
      "スパーク": 1
    },
    "image": "assets/combos/combo_31.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_32",
    "name": "パステル × ゴースト",
    "genes": {
      "パステル": 1,
      "ゴースト": 2
    },
    "image": "assets/combos/combo_32.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_33",
    "name": "オレンジドリーム × パイド",
    "genes": {
      "オレンジドリーム": 1,
      "パイド": 2
    },
    "image": "assets/combos/combo_33.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_34",
    "name": "レオパード × パイド",
    "genes": {
      "レオパード": 1,
      "パイド": 2
    },
    "image": "assets/combos/combo_34.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_35",
    "name": "バナナ × クラウン",
    "genes": {
      "バナナ": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_35.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_36",
    "name": "パステル × エンチ × パイド",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "パイド": 2
    },
    "image": "assets/combos/combo_36.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_37",
    "name": "パステル × イエローベリー",
    "genes": {
      "パステル": 1,
      "イエローベリー": 1
    },
    "image": "assets/combos/combo_37.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_38",
    "name": "オレンジドリーム × イエローベリー",
    "genes": {
      "オレンジドリーム": 1,
      "イエローベリー": 1
    },
    "image": "assets/combos/combo_38.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_39",
    "name": "エンチ × レオパード × イエローベリー",
    "genes": {
      "エンチ": 1,
      "レオパード": 1,
      "イエローベリー": 1
    },
    "image": "assets/combos/combo_39.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_40",
    "name": "パステル × レオパード × イエローベリー",
    "genes": {
      "パステル": 1,
      "レオパード": 1,
      "イエローベリー": 1
    },
    "image": "assets/combos/combo_40.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_41",
    "name": "パステル × オレンジドリーム × イエローベリー",
    "genes": {
      "パステル": 1,
      "オレンジドリーム": 1,
      "イエローベリー": 1
    },
    "image": "assets/combos/combo_41.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_42",
    "name": "パステル × エンチ × オレンジドリーム",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "オレンジドリーム": 1
    },
    "image": "assets/combos/combo_42.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_43",
    "name": "パステル × エンチ × ファイア",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "ファイア": 1
    },
    "image": "assets/combos/combo_43.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_44",
    "name": "パステル × ファイア × クラウン",
    "genes": {
      "パステル": 1,
      "ファイア": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_44.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_45",
    "name": "パステル × モハベ × クラウン",
    "genes": {
      "パステル": 1,
      "モハベ": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_45.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_46",
    "name": "レオパード × イエローベリー × クラウン",
    "genes": {
      "レオパード": 1,
      "イエローベリー": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_46.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_47",
    "name": "パステル × エンチ × レオパード × クラウン",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "レオパード": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_47.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_48",
    "name": "パステル × オレンジドリーム × クラウン",
    "genes": {
      "パステル": 1,
      "オレンジドリーム": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_48.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_49",
    "name": "パステル × エンチ × デザートゴースト × クラウン",
    "genes": {
      "パステル": 1,
      "エンチ": 1,
      "デザートゴースト": 2,
      "クラウン": 2
    },
    "image": "assets/combos/combo_49.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  },
  {
    "id": "combo_50",
    "name": "バナナ × パステル × クラウン",
    "genes": {
      "バナナ": 1,
      "パステル": 1,
      "クラウン": 2
    },
    "image": "assets/combos/combo_50.jpg",
    "source": "internal-composite",
    "credit": "既存モルフ写真から作成した参考合成画像",
    "status": "登録済み"
  }
];
