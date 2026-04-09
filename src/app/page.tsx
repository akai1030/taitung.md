import Link from "next/link";
import dynamic from "next/dynamic";
import { layers } from "@/lib/layers";
import { getAllArticles, getMapPoints } from "@/lib/content";
import NavFloat from "@/components/NavFloat";
import SeasonBanner from "@/components/SeasonBanner";
import ArticleCard from "@/components/ArticleCard";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

const TaitungMap = dynamic(() => import("@/components/TaitungMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-sand flex items-center justify-center">
      <span className="text-smoke text-sm">地圖載入中...</span>
    </div>
  ),
});

export default function Home() {
  const articles = getAllArticles();
  const mapPoints = getMapPoints();

  // Count articles per layer
  const layerCounts: Record<string, number> = {};
  layers.forEach((l) => {
    layerCounts[l.id] = articles.filter(
      (a) => a.layer === l.id || a.frontmatter.layer?.includes(l.id)
    ).length;
  });

  const latestArticles = articles.slice(0, 8);

  return (
    <div className="bg-cream min-h-screen">
      <NavFloat />

      {/* ─── 1. Opening Hero ─── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Contour SVG background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor" className="text-ink" opacity="0.04" strokeWidth="1">
            <path d="M-100,400 Q200,350 400,380 T800,360 T1300,400" />
            <path d="M-100,350 Q150,300 350,320 T750,300 T1300,340" />
            <path d="M-100,450 Q250,420 450,440 T850,410 T1300,460" />
            <path d="M-100,300 Q100,260 300,270 T700,250 T1300,290" />
            <path d="M-100,500 Q300,470 500,490 T900,470 T1300,510" />
            <path d="M-100,250 Q80,220 280,230 T680,210 T1300,240" />
            <path d="M-100,550 Q350,530 550,540 T950,520 T1300,560" />
            <path d="M-100,200 Q120,180 320,185 T720,170 T1300,195" />
            <path d="M-100,600 Q280,580 480,590 T880,570 T1300,610" />
            <path d="M-100,150 Q160,140 360,138 T760,130 T1300,148" />
            <path d="M-100,650 Q320,640 520,645 T920,630 T1300,655" />
          </g>
        </svg>

        <div className="relative z-10 text-center px-10">
          <h1 className="font-display text-display font-black tracking-[-0.04em] text-ink mb-6">
            台東
            <span className="inline-block w-[0.12em] h-[0.12em] rounded-full bg-pacific ml-[0.05em] align-[0.35em]" />
          </h1>
          <p className="font-accent italic text-xl md:text-2xl text-ink-soft tracking-wide">
            An open knowledge base of Taitung
          </p>
          <p className="font-accent text-sm text-stone mt-4 tracking-widest">
            22.7583°N, 121.1444°E
          </p>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <span className="text-xs text-stone tracking-widest font-accent">scroll</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-stone"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── 2. Season Banner ─── */}
      <SeasonBanner />

      {/* ─── 3. Layers Grid ─── */}
      <section id="layers" className="px-10 flex justify-center">
        <div className="max-w-wide w-full py-[120px]">
          <ScrollReveal>
            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-smoke font-medium mb-4">
                Landscape Layers
              </p>
              <h2 className="font-display text-h1 font-bold text-ink tracking-tight">
                十二個地景層
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink/[0.06]">
              {layers.map((layer) => (
                <Link
                  key={layer.id}
                  href={`/${layer.id}`}
                  className="group relative bg-cream p-8 no-underline text-inherit transition-colors duration-300 hover:bg-sand/50"
                >
                  <span className="text-3xl mb-4 block">{layer.icon}</span>
                  <h3 className="font-display text-lg font-bold text-ink mb-1">
                    {layer.name}
                  </h3>
                  <p className="font-accent italic text-sm text-smoke mb-3">
                    {layer.nameEn}
                  </p>
                  <p className="text-xs text-stone">
                    {layerCounts[layer.id] || 0} 篇文章
                  </p>
                  {/* Bottom border animation on hover */}
                  <span
                    className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500"
                    style={{
                      backgroundColor: layer.color,
                      transitionTimingFunction: "cubic-bezier(.23,1,.32,1)",
                    }}
                  />
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 4. Latest Stories ─── */}
      <section className="py-[120px]">
        <ScrollReveal>
          <div className="px-10 flex justify-center mb-12">
            <div className="max-w-wide w-full flex items-end justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-smoke font-medium mb-4">
                  Latest Stories
                </p>
                <h2 className="font-display text-h1 font-bold text-ink tracking-tight">
                  最新故事
                </h2>
              </div>
              <Link
                href="/search"
                className="text-sm text-pacific font-medium no-underline hover:underline underline-offset-4"
              >
                瀏覽全部 &rarr;
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="pl-10 md:pl-[calc((100vw-1200px)/2+40px)] overflow-x-auto hide-scrollbar">
            <div className="flex gap-8 pb-4 pr-10 snap-x snap-mandatory">
              {latestArticles.map((article) => (
                <ArticleCard
                  key={`${article.layer}-${article.slug}`}
                  article={article}
                  variant="horizontal"
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── 5. Quote ─── */}
      <section className="bg-ink text-sand px-10 py-[120px]">
        <ScrollReveal>
          <div className="max-w-content mx-auto text-center">
            <span className="font-accent text-[6rem] leading-none text-sand/10 block mb-4">
              &ldquo;
            </span>
            <blockquote className="font-display text-h2 font-semibold leading-relaxed text-sand mb-10 -mt-12">
              台東不是台灣的後山，<br className="hidden md:inline" />
              台東是台灣面向太平洋的前門。
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <span className="inline-block px-3 py-1 text-xs rounded-full border border-sand/20 text-stone">
                口述歷史
              </span>
              <span className="text-sm text-stone">
                — 台東在地觀點
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── 6. Map ─── */}
      <section className="px-10 flex justify-center py-[120px]">
        <div className="max-w-wide w-full">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-smoke font-medium mb-4">
                  Explore the Map
                </p>
                <h2 className="font-display text-h1 font-bold text-ink tracking-tight mb-6">
                  在地圖上探索台東
                </h2>
                <p className="text-reading text-ink-soft leading-relaxed mb-10 max-w-prose">
                  從海岸線到中央山脈，每一篇文章都錨定在真實的地理座標上。
                  打開地圖，用空間的方式重新認識台東。
                </p>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 text-pacific font-medium no-underline hover:underline underline-offset-4"
                >
                  開啟全螢幕地圖
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="aspect-square rounded-card overflow-hidden border border-ink/[0.06]">
                <TaitungMap
                  points={mapPoints}
                  interactive={false}
                  zoom={9.2}
                  className="w-full h-full"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 7. Voices ─── */}
      <section className="bg-sand px-10 py-[120px]">
        <div className="max-w-wide mx-auto">
          <ScrollReveal>
            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-smoke font-medium mb-4">
                Voices
              </p>
              <h2 className="font-display text-h1 font-bold text-ink tracking-tight">
                多元聲道
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/[0.06]">
              {/* Academic */}
              <div className="bg-cream p-10">
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-6"
                  style={{ color: "#1B5E7B", backgroundColor: "#EEF5F8" }}
                >
                  學術研究
                </span>
                <p className="font-display text-lg leading-relaxed text-ink-soft mb-6">
                  「台東的南島語族文化保存，是太平洋研究中不可忽視的一環。」
                </p>
                <p className="text-sm text-stone">
                  — 文化研究者
                </p>
              </div>

              {/* Oral History */}
              <div className="bg-cream p-10">
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-6"
                  style={{ color: "#C8782A", backgroundColor: "#FBF3EA" }}
                >
                  口述歷史
                </span>
                <p className="font-display text-lg leading-relaxed text-ink-soft mb-6">
                  「以前的知本溪，水是清的，魚用手就抓得到。」
                </p>
                <p className="text-sm text-stone">
                  — 卑南族耆老
                </p>
              </div>

              {/* Field Note */}
              <div className="bg-cream p-10">
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-6"
                  style={{ color: "#3A6B42", backgroundColor: "#EDF5EE" }}
                >
                  田野筆記
                </span>
                <p className="font-display text-lg leading-relaxed text-ink-soft mb-6">
                  「清晨五點的池上，稻浪的聲音比任何音樂都療癒。」
                </p>
                <p className="text-sm text-stone">
                  — 駐地研究員
                </p>
              </div>

              {/* Youth Action */}
              <div className="bg-cream p-10">
                <span
                  className="inline-block text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-6"
                  style={{ color: "#5BAD6F", backgroundColor: "#EFF8F1" }}
                >
                  青年行動
                </span>
                <p className="font-display text-lg leading-relaxed text-ink-soft mb-6">
                  「我們不只是回來，我們是要留下來創造。」
                </p>
                <p className="text-sm text-stone">
                  — 返鄉青年
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── 8. CTA ─── */}
      <section className="px-10 py-[120px] flex justify-center">
        <ScrollReveal>
          <div className="max-w-content mx-auto text-center">
            <h2 className="font-display text-h1 font-bold text-ink tracking-tight mb-6">
              參與台東的故事
            </h2>
            <p className="text-reading text-ink-soft leading-relaxed mb-10 max-w-prose mx-auto">
              Taitung.md 是一座共筆的知識庫。無論你是研究者、在地居民、旅人或學生，
              都可以為台東的故事增添一個聲道。
            </p>
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 bg-pacific text-cream px-8 py-3.5 rounded-button font-medium text-sm no-underline hover:opacity-90 transition-opacity"
            >
              開始貢獻
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
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── 9. Footer ─── */}
      <Footer />
    </div>
  );
}
