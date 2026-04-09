"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function NavFloat() {
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-0.5 rounded-full px-2 py-1.5 border transition-all duration-400 ${
        scrolled
          ? "bg-cream/95 border-ink/8 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
          : "bg-cream/85 border-ink/8"
      }`}
      style={{ backdropFilter: "blur(20px) saturate(1.5)" }}
    >
      <Link
        href="/"
        className="font-accent text-base font-semibold px-4 py-1.5 tracking-tight whitespace-nowrap"
      >
        Taitung.md
      </Link>

      <Link href="/#layers" className="nav-link">
        {t("nav.layers")}
      </Link>
      <Link href="/map" className="nav-link">
        {t("nav.map")}
      </Link>
      <Link href="/about" className="nav-link">
        {t("nav.about")}
      </Link>
      <Link href="/contribute" className="nav-link">
        {t("nav.contribute")}
      </Link>

      <button
        className="flex items-center justify-center w-8 h-8 rounded-full border-none bg-transparent cursor-pointer text-smoke hover:bg-ink/5 hover:text-ink transition-all"
        aria-label={t("nav.search")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <button
        onClick={() => setLocale(locale === "zh-tw" ? "en" : "zh-tw")}
        className="text-xs text-smoke px-3 py-1 border border-stone rounded-full ml-1 hover:border-ink hover:text-ink transition-all"
      >
        {locale === "zh-tw" ? "EN" : "中文"}
      </button>

      <style jsx>{`
        .nav-link {
          font-size: 0.8rem;
          color: var(--smoke);
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 999px;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--ink);
          background: rgba(30, 29, 26, 0.05);
        }
      `}</style>
    </nav>
  );
}
