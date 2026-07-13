-- UGC施策用の最小スキーマ。
-- 店舗データ自体はホットペッパーグルメAPI由来で自社DBには持たないため、
-- ここでは「フィードバック」「検索ログ」など自社発の付加情報のみを持つ。
--
-- work-catalog(av-meikan.jp)と同じSupabaseプロジェクトを流用しているため、
-- テーブル名は hotpapi_ 接頭辞を付けて衝突を避ける
-- (実際に無印の search_logs が work-catalog側で既に使われていたため)。

-- 店舗フィードバック(「実際に入れましたか？」)。アカウント不要、IPハッシュで簡易的な連投防止のみ行う
-- (退会・ログイン機構が無いサイトのため、認証必須のUGCより先にこちらを実装する)。
create table public.hotpapi_shop_feedback (
  id bigint generated always as identity primary key,
  shop_id text not null,
  shop_name text,
  helpful boolean not null,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index hotpapi_shop_feedback_shop_id_idx on public.hotpapi_shop_feedback (shop_id);

-- 検索ログ(匿名)。「今よく検索されている組み合わせ」の集計に使う。
create table public.hotpapi_search_logs (
  id bigint generated always as identity primary key,
  area_code text,
  genre_code text,
  budget_code text,
  keyword text,
  result_count integer,
  created_at timestamptz not null default now()
);
create index hotpapi_search_logs_area_genre_idx on public.hotpapi_search_logs (area_code, genre_code);

-- どちらもservice role(サーバー側API)経由でのみ読み書きする想定のため、
-- クライアント向けのRLSポリシーはあえて設けない(anon keyからは一切アクセスできない)。
alter table public.hotpapi_shop_feedback enable row level security;
alter table public.hotpapi_search_logs enable row level security;
