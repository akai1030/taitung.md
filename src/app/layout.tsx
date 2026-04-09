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
  title: "Taitung.md \— \走\進\台\東",
  description:
    "\一\座\開\源\的\台\東\知\識\庫\。\從\臺\東\大\學\出\發\，\為\所\有\想\認\識\台\東\的\人\而\建\。",
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
