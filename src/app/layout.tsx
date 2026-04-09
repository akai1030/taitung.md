import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taitung.md \u2014 \u8d70\u9032\u53f0\u6771",
  description:
    "\u4e00\u5ea7\u958b\u6e90\u7684\u53f0\u6771\u77e5\u8b58\u5eab\u3002\u5f9e\u81fa\u6771\u5927\u5b78\u51fa\u767c\uff0c\u70ba\u6240\u6709\u60f3\u8a8d\u8b58\u53f0\u6771\u7684\u4eba\u800c\u5efa\u3002",
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
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
