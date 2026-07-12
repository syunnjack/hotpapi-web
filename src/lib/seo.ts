import type { Metadata } from "next";
import { resolveBaseUrl, SITE_NAME } from "@/lib/constants";

export function buildMetadata(params: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  const baseUrl = resolveBaseUrl();
  const url = `${baseUrl}${params.path}`;
  return {
    title: params.title,
    description: params.description,
    alternates: { canonical: url },
    robots: params.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${params.title}｜${SITE_NAME}`,
      description: params.description,
      url,
      locale: "ja_JP",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: params.title, description: params.description },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
