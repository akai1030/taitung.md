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
            \u641c\u5c0b
          </h1>

          <div className="relative mb-16">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="\u8f38\u5165\u95dc\u9375\u5b57\u641c\u5c0b\u53f0\u6771\u7684\u6545\u4e8b..."
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
              \u641c\u5c0b\u529f\u80fd\u5c07\u7531 Pagefind \u9a45\u52d5\uff0c\u5efa\u7f6e\u6642\u81ea\u52d5\u7d22\u5f15\u5168\u90e8\u5167\u5bb9\u3002
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
