"use client";

import { useEffect, useRef, useState } from "react";
import NavFloat from "@/components/NavFloat";
import Footer from "@/components/Footer";

interface Hit {
  url: string;
  meta: { title?: string };
  excerpt: string;
}

/** pagefind 由 postbuild 產生於 /pagefind/，必須在執行期載入，不能讓 webpack 打包 */
async function loadPagefind(): Promise<any> {
  // @ts-expect-error — 執行期動態載入，路徑不存在於編譯期
  const mod = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
  await mod.options?.({ excerptLength: 30 });
  return mod;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  const pf = useRef<any>(null);
  const seq = useRef(0);

  // 首次輸入時才載入索引，避免所有訪客都下載
  useEffect(() => {
    if (!query || pf.current || status === "unavailable") return;
    setStatus("loading");
    loadPagefind()
      .then((m) => {
        pf.current = m;
        setStatus("ready");
      })
      .catch(() => setStatus("unavailable"));
  }, [query, status]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setHits(null);
      return;
    }
    if (!pf.current) return;
    const mine = ++seq.current;
    const t = setTimeout(async () => {
      try {
        const search = await pf.current.search(q);
        const data: Hit[] = await Promise.all(
          search.results.slice(0, 20).map((r: any) => r.data())
        );
        if (mine === seq.current) setHits(data);
      } catch {
        if (mine === seq.current) setStatus("unavailable");
      }
    }, 180);
    return () => clearTimeout(t);
  }, [query, status]);

  /** pagefind 索引的是建置產物，URL 會帶 .html —— 還原成站上路徑 */
  const toHref = (url: string) =>
    url.replace(/\.html$/, "").replace(/\/index$/, "/") || "/";

  return (
    <div className="min-h-screen bg-cream">
      <NavFloat />
      <main className="pt-40 pb-32 px-8">
        <div className="max-w-content mx-auto">
          <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight mb-8">
            搜尋
          </h1>

          <div className="relative mb-16">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="輸入關鍵字搜尋台東的故事..."
              autoFocus
              className="w-full px-6 py-4 pr-14 text-lg bg-sand border border-ink/[0.06] rounded-button font-body focus:outline-none focus:border-pacific transition-colors"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-stone">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          {status === "unavailable" && (
            <div className="text-center py-20">
              <p className="text-smoke">搜尋索引尚未建立。</p>
              <p className="mt-3 text-[0.8rem] text-stone">
                索引於建置時產生（<code className="font-accent">npm run build</code> 會自動執行）。
              </p>
            </div>
          )}

          {status === "loading" && !hits && (
            <p className="text-center py-20 text-smoke">載入索引中⋯⋯</p>
          )}

          {hits && hits.length === 0 && (
            <div className="text-center py-20">
              <p className="text-smoke">找不到「{query.trim()}」的相關內容。</p>
              <p className="mt-3 text-[0.8rem] text-stone">
                目前站上只有 5 篇故事。找不到不代表台東沒有——只代表這裡還沒有記錄。
              </p>
            </div>
          )}

          {hits && hits.length > 0 && (
            <>
              <p className="font-accent text-[0.72rem] tracking-[0.15em] text-stone mb-8">
                {hits.length} 個結果
              </p>
              <div className="flex flex-col">
                {hits.map((h) => (
                  <a
                    key={h.url}
                    href={toHref(h.url)}
                    className="py-6 border-t border-ink/[0.06] no-underline group"
                  >
                    <h2 className="font-display text-lg text-ink mb-2 group-hover:text-pacific transition-colors">
                      {h.meta?.title ?? toHref(h.url)}
                    </h2>
                    <p
                      className="font-body text-[0.88rem] leading-[1.8] text-smoke [&_mark]:bg-gold/30 [&_mark]:text-ink"
                      dangerouslySetInnerHTML={{ __html: h.excerpt }}
                    />
                    <p className="mt-2 font-accent text-[0.68rem] tracking-[0.1em] text-stone">
                      {toHref(h.url)}
                    </p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
