import { getSupabaseServerClient } from "@/lib/supabase";

export interface FeedbackCounts {
  helpful: number;
  notHelpful: number;
}

// 検索結果に表示する店舗群の「実際に入れましたか」件数をまとめて取得する。
export async function getFeedbackCounts(shopIds: string[]): Promise<Map<string, FeedbackCounts>> {
  const counts = new Map<string, FeedbackCounts>();
  if (shopIds.length === 0) return counts;

  try {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.from("hotpapi_shop_feedback").select("shop_id, helpful").in("shop_id", shopIds);
    for (const row of data ?? []) {
      const entry = counts.get(row.shop_id) ?? { helpful: 0, notHelpful: 0 };
      if (row.helpful) entry.helpful += 1;
      else entry.notHelpful += 1;
      counts.set(row.shop_id, entry);
    }
  } catch {
    // Supabase未設定でも検索結果自体は表示できるようにする。
  }
  return counts;
}

// 匿名の検索ログ。「今よく検索されている組み合わせ」の集計に使う。
export async function logSearch(params: {
  areaCode?: string;
  genreCode?: string;
  budgetCode?: string;
  keyword?: string;
  resultCount: number;
}): Promise<void> {
  try {
    const supabase = getSupabaseServerClient();
    await supabase.from("hotpapi_search_logs").insert({
      area_code: params.areaCode ?? null,
      genre_code: params.genreCode ?? null,
      budget_code: params.budgetCode ?? null,
      keyword: params.keyword ?? null,
      result_count: params.resultCount,
    });
  } catch {
    // ログ記録の失敗で検索結果表示自体を止めない。
  }
}

export interface PopularCombo {
  areaCode: string | null;
  genreCode: string | null;
  count: number;
}

// 直近の検索ログから、よく検索されているエリア×ジャンルの組み合わせを集計する。
export async function getPopularCombos(limit = 6): Promise<PopularCombo[]> {
  try {
    const supabase = getSupabaseServerClient();
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("hotpapi_search_logs")
      .select("area_code, genre_code")
      .gte("created_at", since)
      .not("area_code", "is", null)
      .not("genre_code", "is", null)
      .limit(2000);

    const counts = new Map<string, PopularCombo>();
    for (const row of (data ?? []) as Array<{ area_code: string | null; genre_code: string | null }>) {
      const key = `${row.area_code}|${row.genre_code}`;
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else counts.set(key, { areaCode: row.area_code, genreCode: row.genre_code, count: 1 });
    }
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
  } catch {
    return [];
  }
}
