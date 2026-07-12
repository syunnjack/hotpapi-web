import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { resolveBaseUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(resolveBaseUrl()),
  title: { default: SITE_NAME, template: `%s｜${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: resolveBaseUrl(),
    locale: "ja_JP",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <body className="flex min-h-full flex-col bg-orange-50 text-neutral-800 antialiased">
        <header className="border-b border-orange-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
            <Link href="/" className="text-lg font-bold text-orange-600">
              🍽️ {SITE_NAME}
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-orange-100 px-4 py-8 text-center text-xs text-neutral-500">
          © {SITE_NAME}　本サービスはホットペッパーグルメAPI(リクルート)を利用しています。
        </footer>
      </body>
    </html>
  );
}
