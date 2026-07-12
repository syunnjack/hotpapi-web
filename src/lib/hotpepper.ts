// ホットペッパーグルメAPI連携。APIキーはサーバー側でのみ読み込み、クライアントには
// 一切送らない(hotpAPI01(C#デスクトップ版)でキーがソースにハードコードされていた反省を踏まえる)。
const BASE_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

export interface SearchParams {
  keyword?: string;
  largeAreaCode?: string;
  genreCode?: string;
  budgetCode?: string;
  privateRoom?: boolean;
  nonSmoking?: boolean;
  freeDrink?: boolean;
  course?: boolean;
  count?: number;
  start?: number;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  station_name: string;
  genre?: { name: string };
  budget?: { average: string };
  catch?: string;
  capacity?: number;
  access?: string;
  mobile_access?: string;
  urls?: { pc?: string };
  photo?: { pc?: { l?: string; m?: string; s?: string } };
  open?: string;
  close?: string;
  wifi?: string;
  private_room?: string;
  non_smoking?: string;
  free_drink?: string;
  course?: string;
  parking?: string;
}

export interface SearchResult {
  resultsAvailable: number;
  resultsReturned: number;
  resultsStart: number;
  shops: Shop[];
}

function requireApiKey(): string {
  const key = process.env.HOTPEPPER_API_KEY;
  if (!key) throw new Error("環境変数 HOTPEPPER_API_KEY が設定されていません。");
  return key;
}

// 「今すぐ予約できるお店」= 本日営業中(available_today=1)かつ現在時刻以降も営業(open=HHMM)。
// hotpAPI01(C#デスクトップ版)と同じ検索条件を踏襲する。
//
// revalidateSecondsを省略すると常にno-store(完全動的)で取得する。/searchのような
// dynamic="force-dynamic"のページ向け。
// revalidateSecondsを指定すると、その秒数でNextのfetchキャッシュに乗せる。/genre, /area
// のようなrevalidate指定ページ向け(ここでno-storeのままだと、ページ側のrevalidate設定と
// 矛盾し「Page changed from static to dynamic」エラーになる)。
export async function searchAvailableNow(params: SearchParams, revalidateSeconds?: number): Promise<SearchResult> {
  const apiKey = requireApiKey();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

  const query = new URLSearchParams({
    key: apiKey,
    format: "json",
    count: String(params.count ?? 20),
    start: String(params.start ?? 1),
    available_today: "1",
    open: timeStr,
  });

  if (params.keyword) query.set("keyword", params.keyword);
  if (params.largeAreaCode) query.set("large_area", params.largeAreaCode);
  if (params.genreCode) query.set("genre", params.genreCode);
  if (params.budgetCode) query.set("budget", params.budgetCode);
  if (params.privateRoom) query.set("private_room", "1");
  if (params.nonSmoking) query.set("non_smoking", "1");
  if (params.freeDrink) query.set("free_drink", "1");
  if (params.course) query.set("course", "1");

  const res = await fetch(
    `${BASE_URL}?${query.toString()}`,
    revalidateSeconds !== undefined ? { next: { revalidate: revalidateSeconds } } : { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`ホットペッパーAPIの呼び出しに失敗しました(status=${res.status})`);
  }

  const data = await res.json();
  const results = data?.results;
  if (!results) throw new Error("レスポンスが不正です。");

  return {
    resultsAvailable: Number(results.results_available ?? 0),
    resultsReturned: Number(results.results_returned ?? 0),
    resultsStart: Number(results.results_start ?? 1),
    shops: (results.shop ?? []) as Shop[],
  };
}
