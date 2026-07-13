import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import { searchAvailableNow } from "@/lib/hotpepper";
import { GENRES, LARGE_AREAS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

const PER_PAGE = 20;

interface SearchPageProps {
  searchParams: Promise<{
    keyword?: string;
    area?: string;
    genre?: string;
    budget?: string;
    privateRoom?: string;
    nonSmoking?: string;
    freeDrink?: string;
    course?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const areaName = LARGE_AREAS.find((a) => a.code === sp.area)?.name;
  const genreName = GENRES.find((g) => g.code === sp.genre)?.name;
  const title = [areaName, genreName, "今すぐ予約できるお店"].filter(Boolean).join(" ");
  return buildMetadata({
    title,
    description: `${areaName ?? "全国"}で${genreName ? genreName + "の" : ""}今すぐ予約・入店できるお店を検索した結果です。`,
    path: "/search",
    noindex: true, // 検索結果は現在時刻に依存し内容が刻々と変わるため、検索エンジンにはインデックスさせない。
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const params = {
    keyword: sp.keyword?.trim() || undefined,
    largeAreaCode: sp.area || undefined,
    genreCode: sp.genre || undefined,
    budgetCode: sp.budget || undefined,
    privateRoom: sp.privateRoom === "1",
    nonSmoking: sp.nonSmoking === "1",
    freeDrink: sp.freeDrink === "1",
    course: sp.course === "1",
    count: PER_PAGE,
    start: (page - 1) * PER_PAGE + 1,
  };

  let result;
  let error: string | null = null;
  try {
    result = await searchAvailableNow(params);
  } catch (e) {
    error = e instanceof Error ? e.message : "検索に失敗しました。";
  }

  const totalPages = result ? Math.max(1, Math.ceil(result.resultsAvailable / PER_PAGE)) : 1;

  function pageHref(targetPage: number) {
    const q = new URLSearchParams();
    if (sp.keyword) q.set("keyword", sp.keyword);
    if (sp.area) q.set("area", sp.area);
    if (sp.genre) q.set("genre", sp.genre);
    if (sp.budget) q.set("budget", sp.budget);
    if (sp.privateRoom) q.set("privateRoom", sp.privateRoom);
    if (sp.nonSmoking) q.set("nonSmoking", sp.nonSmoking);
    if (sp.freeDrink) q.set("freeDrink", sp.freeDrink);
    if (sp.course) q.set("course", sp.course);
    q.set("page", String(targetPage));
    return `/search?${q.toString()}`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SearchForm
        defaultValues={{
          keyword: sp.keyword,
          area: sp.area,
          genre: sp.genre,
          budget: sp.budget,
          privateRoom: sp.privateRoom === "1",
          nonSmoking: sp.nonSmoking === "1",
          freeDrink: sp.freeDrink === "1",
          course: sp.course === "1",
        }}
      />

      <div className="mt-6">
        {error && (
          <div className="rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-orange-100">
            <p className="text-2xl">⚠️</p>
            <p className="mt-2 text-sm font-bold text-neutral-800">エラーが発生しました</p>
            <p className="mt-1 text-xs text-neutral-500">{error}</p>
          </div>
        )}

        {result && (
          <>
            <p className="text-sm text-neutral-500">
              全 {result.resultsAvailable} 件
              <span className="ml-2 text-xs text-neutral-400">
                （{new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}時点）
              </span>
            </p>

            {result.shops.length === 0 ? (
              <div className="mt-4 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-orange-100">
                <p className="text-2xl">😢</p>
                <p className="mt-2 text-sm text-neutral-500">条件に合うお店が見つかりませんでした。検索条件を変えてお試しください。</p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {result.shops.map((shop) => {
                  const img = shop.photo?.pc?.l;
                  const tags: string[] = [];
                  if (shop.private_room === "あり") tags.push("🚪個室");
                  if (shop.non_smoking === "全席禁煙") tags.push("🚭禁煙");
                  if (shop.free_drink === "あり") tags.push("🍺飲み放題");
                  if (shop.course === "あり") tags.push("🍱コース");
                  if (shop.wifi === "あり") tags.push("📶Wi-Fi");
                  if (shop.parking === "あり") tags.push("🅿️駐車場");

                  return (
                    <li key={shop.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100 transition hover:shadow-md">
                      <a
                        href={shop.urls?.pc ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="flex gap-0"
                      >
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element -- ホットペッパーAPI提供画像
                          <img src={img} alt={shop.name} loading="lazy" className="h-auto w-32 shrink-0 object-cover" />
                        ) : (
                          <div className="flex w-32 shrink-0 items-center justify-center bg-orange-50 text-3xl">🍽️</div>
                        )}
                        <div className="min-w-0 flex-1 p-3">
                          <p className="truncate text-sm font-bold text-neutral-900">{shop.name}</p>
                          {shop.genre?.name && (
                            <span className="mt-1 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-600">
                              {shop.genre.name}
                            </span>
                          )}
                          <p className="mt-1 text-[11px] text-neutral-500">
                            📍 {shop.station_name}駅{shop.capacity ? `　👥 ${shop.capacity}席` : ""}
                          </p>
                          {(shop.mobile_access || shop.access) && (
                            <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-400">{shop.mobile_access || shop.access}</p>
                          )}
                          {tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {tags.map((t) => (
                                <span key={t} className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            {shop.open && <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700">🕐 {shop.open}</span>}
                            {shop.budget?.average && <span className="text-[11px] text-neutral-500">💴 平均 {shop.budget.average}</span>}
                          </div>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                {page > 1 ? (
                  <Link href={pageHref(page - 1)} className="rounded-lg border-2 border-orange-500 px-3 py-1.5 text-xs font-bold text-orange-600">
                    ◀ 前へ
                  </Link>
                ) : (
                  <span className="rounded-lg border-2 border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-300">◀ 前へ</span>
                )}
                <span className="text-xs text-neutral-500">
                  {page} / {totalPages} ページ
                </span>
                {page < totalPages ? (
                  <Link href={pageHref(page + 1)} className="rounded-lg border-2 border-orange-500 px-3 py-1.5 text-xs font-bold text-orange-600">
                    次へ ▶
                  </Link>
                ) : (
                  <span className="rounded-lg border-2 border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-300">次へ ▶</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
