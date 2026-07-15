export const SITE_NAME = "今すぐ予約グルメ検索";
export const SITE_DESCRIPTION =
  "ホットペッパーグルメAPIを使い、現在時刻から今すぐ予約・入店できる飲食店だけを検索できるサービスです。";

const FALLBACK_BASE_URL = "http://localhost:3000";

export function resolveBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return FALLBACK_BASE_URL;
  try {
    new URL(url);
    return url;
  } catch {
    return FALLBACK_BASE_URL;
  }
}

// 大エリアコード。ホットペッパーグルメAPI「大エリアマスタAPI」の実レスポンスで
// 実際にコードと都道府県名の対応を検証済み(hotpAPI01側で見つかった表示名バグの修正と同じ確認方法)。
export const LARGE_AREAS: Array<{ code: string; name: string }> = [
  { code: "", name: "全国" },
  { code: "Z011", name: "東京" },
  { code: "Z012", name: "神奈川" },
  { code: "Z013", name: "埼玉" },
  { code: "Z014", name: "千葉" },
  { code: "Z015", name: "茨城" },
  { code: "Z016", name: "栃木" },
  { code: "Z017", name: "群馬" },
  { code: "Z021", name: "滋賀" },
  { code: "Z022", name: "京都" },
  { code: "Z023", name: "大阪" },
  { code: "Z024", name: "兵庫" },
  { code: "Z025", name: "奈良" },
  { code: "Z026", name: "和歌山" },
  { code: "Z031", name: "岐阜" },
  { code: "Z032", name: "静岡" },
  { code: "Z033", name: "愛知" },
  { code: "Z034", name: "三重" },
  { code: "Z041", name: "北海道" },
  { code: "Z051", name: "青森" },
  { code: "Z052", name: "岩手" },
  { code: "Z053", name: "宮城" },
  { code: "Z054", name: "秋田" },
  { code: "Z055", name: "山形" },
  { code: "Z056", name: "福島" },
  { code: "Z061", name: "新潟" },
  { code: "Z062", name: "富山" },
  { code: "Z063", name: "石川" },
  { code: "Z064", name: "福井" },
  { code: "Z065", name: "山梨" },
  { code: "Z066", name: "長野" },
  { code: "Z071", name: "鳥取" },
  { code: "Z072", name: "島根" },
  { code: "Z073", name: "岡山" },
  { code: "Z074", name: "広島" },
  { code: "Z075", name: "山口" },
  { code: "Z081", name: "徳島" },
  { code: "Z082", name: "香川" },
  { code: "Z083", name: "愛媛" },
  { code: "Z084", name: "高知" },
  { code: "Z091", name: "福岡" },
  { code: "Z092", name: "佐賀" },
  { code: "Z093", name: "長崎" },
  { code: "Z094", name: "熊本" },
  { code: "Z095", name: "大分" },
  { code: "Z096", name: "宮崎" },
  { code: "Z097", name: "鹿児島" },
  { code: "Z098", name: "沖縄" },
];

export const GENRES: Array<{ code: string; name: string }> = [
  { code: "", name: "すべてのジャンル" },
  { code: "G004", name: "和食" },
  { code: "G013", name: "ラーメン" },
  { code: "G016", name: "お好み焼き・もんじゃ" },
  { code: "G008", name: "焼肉・ホルモン" },
  { code: "G001", name: "居酒屋" },
  { code: "G002", name: "ダイニングバー・バル" },
  { code: "G005", name: "洋食" },
  { code: "G006", name: "イタリアン・フレンチ" },
  { code: "G007", name: "中華" },
  { code: "G017", name: "韓国料理" },
  { code: "G009", name: "アジア・エスニック料理" },
  { code: "G010", name: "各国料理" },
  { code: "G003", name: "創作料理" },
  { code: "G012", name: "バー・カクテル" },
  { code: "G014", name: "カフェ・スイーツ" },
  { code: "G011", name: "カラオケ・パーティ" },
  { code: "G015", name: "その他グルメ" },
];

// 「予算マスタAPI」の実レスポンスで検証済み。旧B004/B005/B006は現在のAPIでは無効なコードで、
// 検索条件に指定すると常に0件になる(サイレントに壊れる)ため、より細分化された現行コードに置き換えた。
export const BUDGETS: Array<{ code: string; name: string }> = [
  { code: "", name: "指定なし" },
  { code: "B009", name: "〜500円" },
  { code: "B010", name: "501〜1,000円" },
  { code: "B011", name: "1,001〜1,500円" },
  { code: "B001", name: "1,501〜2,000円" },
  { code: "B002", name: "2,001〜3,000円" },
  { code: "B003", name: "3,001〜4,000円" },
  { code: "B008", name: "4,001〜5,000円" },
  { code: "B015", name: "5,001〜6,000円" },
  { code: "B016", name: "6,001〜7,000円" },
  { code: "B017", name: "7,001〜8,000円" },
  { code: "B018", name: "8,001〜9,000円" },
  { code: "B019", name: "9,001〜10,000円" },
  { code: "B020", name: "10,001〜12,000円" },
  { code: "B021", name: "12,001〜15,000円" },
  { code: "B012", name: "15,001〜20,000円" },
  { code: "B013", name: "20,001〜30,000円" },
  { code: "B014", name: "30,001円〜" },
];
