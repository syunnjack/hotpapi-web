import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import JsonLd from "@/components/JsonLd";
import { GENRES, LARGE_AREAS, resolveBaseUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

const MAJOR_AREA_CODES = ["Z011", "Z012", "Z022", "Z023", "Z033", "Z041", "Z091", "Z098"];
const MAJOR_AREAS = LARGE_AREAS.filter((a) => MAJOR_AREA_CODES.includes(a.code));
const REAL_GENRES = GENRES.filter((g) => g.code !== "");

export default function HomePage() {
  const baseUrl = resolveBaseUrl();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <JsonLd
        data={[
          {
            "@type": "WebSite",
            name: SITE_NAME,
            url: baseUrl,
            description: SITE_DESCRIPTION,
            potentialAction: {
              "@type": "SearchAction",
              target: `${baseUrl}/search?keyword={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
          { "@type": "Organization", name: SITE_NAME, url: baseUrl, description: SITE_DESCRIPTION },
        ]}
      />
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">今から予約できるお店を探そう</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500">{SITE_DESCRIPTION}</p>
      </div>

      <div className="mt-8">
        <SearchForm />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-bold text-neutral-700">エリアから探す</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {MAJOR_AREAS.map((a) => (
            <Link key={a.code} href={`/area/${a.code}`} className="rounded-full border border-orange-200 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-orange-400">
              {a.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-bold text-neutral-700">ジャンルから探す</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {REAL_GENRES.map((g) => (
            <Link key={g.code} href={`/genre/${g.code}`} className="rounded-full border border-orange-200 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-orange-400">
              {g.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-400">
        {SITE_NAME}はホットペッパーグルメAPI(リクルート)を利用した非公式の検索サービスです。予約・在庫状況の最終確認は各店舗・送客先でお願いします。
      </p>
    </div>
  );
}
