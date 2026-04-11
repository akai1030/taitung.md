import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taitung.md — 走進台東",
  description: "一座開源的台東知識庫。先感覺到，才開始讀。",
  openGraph: {
    title: "Taitung.md — 走進台東",
    description: "一座開源的台東知識庫。先感覺到，才開始讀。",
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${notoSerifTC.variable} ${notoSansTC.variable} ${cormorant.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
