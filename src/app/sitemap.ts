import type { MetadataRoute } from "next";
import { resolveBaseUrl } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveBaseUrl();
  return [{ url: baseUrl, changeFrequency: "daily", priority: 1 }];
}
