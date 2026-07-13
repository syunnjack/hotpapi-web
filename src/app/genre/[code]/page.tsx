import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { searchAvailableNow } from "@/lib/hotpepper";
import { GENRES, resolveBaseUrl } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  return [];
}

function findGenre(code: string) {
  return GENRES.find((g) => g.code === code && g.code !== "");
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const genre = findGenre(code);
  if (!genre) return { title: "ジャンルが見つかりません" };
  return buildMetadata({
    title: `${genre.name}を今すぐ予約`,
    description: `${genre.name}で今すぐ入店・予約できるお店を検索できます。エリアを絞り込んでさらに検索することもできます。`,
    path: `/genre/${genre.code}`,
  });
}

export default async function GenreLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const genre = findGenre(code);
  if (!genre) notFound();

  const baseUrl = resolveBaseUrl();
  const pageUrl = `${baseUrl}/genre/${genre.code}`;

  let shops: Awaited<ReturnType<typeof searchAvailableNow>>["shops"] = [];
  let total = 0;
  try {
    const result = await searchAvailableNow({ genreCode: genre.code, count: 12 }, 300);
    shops = result.shops;
    total = result.resultsAvailable;
  } catch {
    // 一覧取得に失敗しても、ジャンルページ自体(検索導線)は表示する。
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "トップ", url: baseUrl },
            { name: `${genre.name}を今すぐ予約`, url: pageUrl },
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
        / {genre.name}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">{genre.name}を今すぐ予約</h1>
      <p className="mt-2 text-sm text-neutral-500">
        現在時点で{genre.name}のお店が全国で{total}件、今すぐ入店・予約できます。エリアを絞り込むには下の検索フォームをご利用ください。
      </p>
      <p className="mt-1 text-xs text-neutral-400">
        {`取得時点: ${new Date().toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}`}
      </p>

      <Link
        href={`/search?genre=${genre.code}`}
        className="mt-4 inline-block rounded-full bg-gradient-to-r from-orange-600 to-orange-400 px-5 py-2.5 text-sm font-bold text-white hover:from-orange-700 hover:to-orange-500"
      >
        🔍 {genre.name}のお店をもっと見る
      </Link>

      {shops.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shops.map((shop) => (
            <li key={shop.id} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-orange-100">
              <a href={shop.urls?.pc ?? "#"} target="_blank" rel="noopener noreferrer sponsored" className="block">
                <p className="truncate text-sm font-bold text-neutral-900">{shop.name}</p>
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
