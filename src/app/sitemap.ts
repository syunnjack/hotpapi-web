import type { MetadataRoute } from "next";
import { GENRES, LARGE_AREAS, resolveBaseUrl } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveBaseUrl();
  const entries: MetadataRoute.Sitemap = [{ url: baseUrl, changeFrequency: "daily", priority: 1 }];

  for (const area of LARGE_AREAS) {
    if (!area.code) continue;
    entries.push({ url: `${baseUrl}/area/${area.code}`, changeFrequency: "hourly", priority: 0.7 });
  }
  for (const genre of GENRES) {
    if (!genre.code) continue;
    entries.push({ url: `${baseUrl}/genre/${genre.code}`, changeFrequency: "hourly", priority: 0.7 });
  }

  return entries;
}
