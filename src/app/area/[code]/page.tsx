import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { searchAvailableNow } from "@/lib/hotpepper";
import { LARGE_AREAS, resolveBaseUrl } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

function findArea(code: string) {
  return LARGE_AREAS.find((a) => a.code === code && a.code !== "");
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const area = findArea(code);
  if (!area) return { title: "エリアが見つかりません" };
  return buildMetadata({
    title: `${area.name}で今すぐ予約できるお店`,
    description: `${area.name}エリアで今すぐ入店・予約できるお店を検索できます。ジャンルを絞り込んでさらに検索することもできます。`,
    path: `/area/${area.code}`,
  });
}

export default async function AreaLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const area = findArea(code);
  if (!area) notFound();

  const baseUrl = resolveBaseUrl();
  const pageUrl = `${baseUrl}/area/${area.code}`;

  let shops: Awaited<ReturnType<typeof searchAvailableNow>>["shops"] = [];
  let total = 0;
  try {
    const result = await searchAvailableNow({ largeAreaCode: area.code, count: 12 });
    shops = result.shops;
    total = result.resultsAvailable;
  } catch {
    // 一覧取得に失敗しても、エリアページ自体(検索導線)は表示する。
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "トップ", url: baseUrl },
            { name: `${area.name}で今すぐ予約`, url: pageUrl },
          ]),
          {
            "@type": "ItemList",
            itemListElement: shops.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: s.urls?.pc })),
          },
        ]}
      />
      <p className="text-xs text-neutral-400">
        <Link href="/" className="hover:underline">
          トップ
        </Link>{" "}
        / {area.name}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">{area.name}で今すぐ予約できるお店</h1>
      <p className="mt-2 text-sm text-neutral-500">
        現在時点で{area.name}エリアのお店が{total}件、今すぐ入店・予約できます。ジャンルを絞り込むには下の検索フォームをご利用ください。
      </p>

      <Link
        href={`/search?area=${area.code}`}
        className="mt-4 inline-block rounded-full bg-gradient-to-r from-orange-600 to-orange-400 px-5 py-2.5 text-sm font-bold text-white hover:from-orange-700 hover:to-orange-500"
      >
        🔍 {area.name}のお店をもっと見る
      </Link>

      {shops.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shops.map((shop) => (
            <li key={shop.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-orange-100">
              <a href={shop.urls?.pc ?? "#"} target="_blank" rel="noopener noreferrer sponsored" className="block">
                <p className="truncate text-sm font-bold text-neutral-900">{shop.name}</p>
                {shop.genre?.name && <p className="mt-1 text-[11px] text-orange-600">{shop.genre.name}</p>}
                <p className="mt-1 text-[11px] text-neutral-500">📍 {shop.station_name}駅</p>
                {shop.open && <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700">🕐 {shop.open}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
