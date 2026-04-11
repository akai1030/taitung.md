"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NavFloat() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between transition-all ${
        scrolled
          ? "bg-cream/[0.92] backdrop-blur-[20px] backdrop-saturate-[1.4] py-3.5 px-8 shadow-[0_1px_0_rgba(30,29,26,0.06)]"
          : "py-5 px-8"
      }`}
      style={{ transitionDuration: "600ms", transitionTimingFunction: "cubic-bezier(.23,1,.32,1)" }}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className={`font-accent text-[1.05rem] font-semibold tracking-[0.02em] no-underline transition-colors duration-[600ms] ${
            scrolled ? "text-ink" : "text-white/85"
          }`}
        >
          Taitung.md
        </Link>
        <span className="w-[5px] h-[5px] rounded-full bg-pacific opacity-70" />
      </div>
      <div className="flex items-center gap-1.5">
        {[
          { href: "/", label: "故事" },
          { href: "/sound", label: "聲音" },
          { href: "/question", label: "提問" },
          { href: "/map", label: "地圖" },
          { href: "/about", label: "關於" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`font-body text-[0.78rem] font-normal no-underline px-3.5 py-[7px] rounded-full transition-all duration-300 tracking-[0.02em] hidden md:inline-block ${
              scrolled
                ? "text-smoke hover:text-ink hover:bg-ink/[0.04]"
                : "text-white/45 hover:text-white/90 hover:bg-white/[0.08]"
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/search"
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hidden md:flex ${
            scrolled ? "text-smoke hover:text-ink hover:bg-ink/[0.04]" : "text-white/45 hover:text-white/90"
          }`}
          aria-label="搜尋"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
        <Link
          href="/en"
          className={`font-accent text-[0.72rem] px-3 py-[5px] rounded-full no-underline transition-all duration-300 ml-2 ${
            scrolled
              ? "text-stone border border-stone hover:text-ink hover:border-ink"
              : "text-white/35 border border-white/15 hover:text-white/80 hover:border-white/40"
          }`}
        >
          EN
        </Link>
      </div>
    </nav>
  );
}
