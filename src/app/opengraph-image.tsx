import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ fontSize: 72 }}>🍽️</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 16, color: "#ff4500" }}>{SITE_NAME}</div>
        <div style={{ fontSize: 30, color: "#7a6a5a", marginTop: 24, maxWidth: 900 }}>{SITE_DESCRIPTION}</div>
      </div>
    ),
    { ...size }
  );
}
