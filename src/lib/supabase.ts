import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// work-catalog(av-meikan.jp)のSupabaseプロジェクトを流用している。shop_feedback/search_logs
// のみを扱い、work-catalog側のテーブルには一切触れない。サーバー側専用(service role)。
export function getSupabaseServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabaseの環境変数(NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)が未設定です。");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
