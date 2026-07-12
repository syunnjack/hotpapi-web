import SearchForm from "@/components/SearchForm";
import JsonLd from "@/components/JsonLd";
import { resolveBaseUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

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

      <p className="mt-6 text-center text-xs text-neutral-400">
        {SITE_NAME}はホットペッパーグルメAPI(リクルート)を利用した非公式の検索サービスです。予約・在庫状況の最終確認は各店舗・送客先でお願いします。
      </p>
    </div>
  );
}
