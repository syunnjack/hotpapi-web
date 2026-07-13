import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase";

const feedbackSchema = z.object({
  shopId: z.string().min(1),
  shopName: z.string().max(200).optional(),
  helpful: z.boolean(),
});

// アカウント不要のフィードバック。IPハッシュ+shop_idで簡易的な連投防止のみ行う
// (捕捉を目的とした厳密な不正対策ではなく、素朴な多重クリック防止程度の位置づけ)。
function hashIp(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export async function POST(request: NextRequest) {
  const parsed = feedbackSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "サーバー側の設定不備によりリクエストを処理できません。" }, { status: 500 });
  }

  const ipHash = hashIp(request);

  const { data: existing } = await supabase
    .from("hotpapi_shop_feedback")
    .select("id")
    .eq("shop_id", parsed.data.shopId)
    .eq("ip_hash", ipHash)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "既に評価済みです。" }, { status: 409 });
  }

  const { error } = await supabase.from("hotpapi_shop_feedback").insert({
    shop_id: parsed.data.shopId,
    shop_name: parsed.data.shopName ?? null,
    helpful: parsed.data.helpful,
    ip_hash: ipHash,
  });
  if (error) {
    return NextResponse.json({ error: "送信に失敗しました。" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

// 検索結果に表示する店舗群のフィードバック件数をまとめて取得する。
export async function GET(request: NextRequest) {
  const shopIds = request.nextUrl.searchParams.get("shopIds")?.split(",").filter(Boolean) ?? [];
  if (shopIds.length === 0) {
    return NextResponse.json({ counts: {} });
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    return NextResponse.json({ counts: {} });
  }

  const { data } = await supabase.from("hotpapi_shop_feedback").select("shop_id, helpful").in("shop_id", shopIds);
  const counts: Record<string, { helpful: number; notHelpful: number }> = {};
  for (const row of data ?? []) {
    const entry = counts[row.shop_id] ?? { helpful: 0, notHelpful: 0 };
    if (row.helpful) entry.helpful += 1;
    else entry.notHelpful += 1;
    counts[row.shop_id] = entry;
  }
  return NextResponse.json({ counts });
}
