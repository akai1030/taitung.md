"use client";

import { useState } from "react";
import NavFloat from "@/components/NavFloat";
import Footer from "@/components/Footer";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <NavFloat />
      <main className="pt-40 pb-32 px-10">
        <div className="max-w-content mx-auto">
          <h1 className="font-display text-h1 font-bold tracking-tight mb-8">
            \搜\尋
          </h1>

          <div className="relative mb-16">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="\輸\入\關\鍵\字\搜\尋\台\東\的\故\事..."
              className="w-full px-6 py-4 text-lg bg-sand border border-ink/[0.06] rounded-button font-body focus:outline-none focus:border-pacific transition-colors"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-stone">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          <div className="text-center py-20">
            <p className="text-smoke">
              \搜\尋\功\能\將\由 Pagefind \驅\動\，\建\置\時\自\動\索\引\全\部\內\容\。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
