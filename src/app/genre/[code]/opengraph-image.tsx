import { ImageResponse } from "next/og";
import { searchAvailableNow } from "@/lib/hotpepper";
import { GENRES, SITE_NAME } from "@/lib/constants";

export const alt = "ジャンル別 今すぐ予約できるお店";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const genre = GENRES.find((g) => g.code === code);
  let total: number | null = null;
  if (genre) {
    try {
      const result = await searchAvailableNow({ genreCode: genre.code, count: 1 }, 300);
      total = result.resultsAvailable;
    } catch {
      total = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#fff7f0",
          color: "#3a2a1a",
        }}
      >
        <div style={{ fontSize: 28, color: "#a3907e" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 20, color: "#ff4500" }}>{`${genre?.name ?? "ジャンル"}を今すぐ予約`}</div>
        {total !== null && <div style={{ fontSize: 34, color: "#7a6a5a", marginTop: 28 }}>{`現在 ${total}件 予約受付中`}</div>}
      </div>
    ),
    { ...size }
  );
}
