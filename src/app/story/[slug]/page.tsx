import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug, getExcerpt } from "@/lib/content";
import { getLayerById } from "@/lib/layers";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import NavFloat from "@/components/NavFloat";
import VoiceBlock from "@/components/VoiceBlock";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import { VoiceType } from "@/lib/types";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

/**
 * 每篇故事的獨立 metadata。
 *
 * 在此之前所有故事頁都繼承 layout 的同一組標題與描述，
 * 也就是說 Google 眼中這幾頁「標題完全相同」——會被判為重複內容，
 * 通常只收錄其中一頁。這是全站最嚴重的 SEO 問題，比沒有 sitemap 更致命。
 */
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "找不到這篇故事" };

  const { frontmatter, content } = article;
  const description = getExcerpt(content);
  const path = `/story/${article.slug}`;
  const published = frontmatter.created;
  const modified = frontmatter.updated || frontmatter.last_verified || published;

  return {
    title: frontmatter.title,
    description,
    keywords: [
      ...(frontmatter.tags || []),
      ...(frontmatter.township ? [frontmatter.township] : []),
      "台東",
    ],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description,
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "zh_TW",
      publishedTime: published,
      modifiedTime: modified,
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description,
    },
  };
}

export default function StoryPage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const { frontmatter, content } = article;
  const layers = frontmatter.layer?.map((l) => getLayerById(l)).filter(Boolean) || [];
  const readTime = Math.max(1, Math.ceil(content.length / 500));
  const voiceTypes = frontmatter.voices?.map((v) => v.type) || [];

  // Split content into paragraphs and distribute across voices
  const paragraphs = content
    .split(/\n## /)
    .filter((p) => p.trim().length > 0);

  const voiceLabels: Record<string, string> = {
    academic: "學術研究",
    "oral-history": "口述歷史",
    "field-note": "田野筆記",
    "youth-action": "青年行動",
    visitor: "旅人觀察",
  };

  // Related articles
  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .filter((a) => a.frontmatter.layer?.some((l) => frontmatter.layer?.includes(l)))
    .slice(0, 2);

  // ── Article 結構化資料
  // author 只在 frontmatter 真的有署名時才填人名；沒有就掛站台，
  // 不假造一個作者出來（HARD-RULES 絕對禁令：不得產生假的內容）。
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: getExcerpt(content),
    inLanguage: "zh-Hant-TW",
    url: absoluteUrl(`/story/${article.slug}`),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/story/${article.slug}`),
    },
    datePublished: frontmatter.created,
    dateModified: frontmatter.updated || frontmatter.last_verified || frontmatter.created,
    author: frontmatter.author
      ? { "@type": "Person", name: frontmatter.author }
      : { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    isAccessibleForFree: true,
    keywords: frontmatter.tags?.join(", "),
    ...(frontmatter.township && {
      spatialCoverage: {
        "@type": "Place",
        name: `臺東縣${frontmatter.township}`,
        ...(frontmatter.coordinates && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: frontmatter.coordinates[0],
            longitude: frontmatter.coordinates[1],
          },
        }),
      },
    }),
    // 有 URL 的來源才列進 citation——沒 URL 的引用對機器沒有意義
    ...(frontmatter.sources?.some((s) => s.url) && {
      citation: frontmatter.sources
        .filter((s) => s.url)
        .map((s) => ({
          "@type": "CreativeWork",
          name: s.citation || s.title || s.name,
          url: s.url,
        })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <NavFloat />
      <main>
        {/* Hero */}
        <section
          className="relative pt-40 pb-20 px-8"
          style={{ background: "linear-gradient(180deg, var(--sand-deep) 0%, var(--cream) 100%)" }}
        >
          <div className="max-w-[800px] mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-stone mb-8">
              <Link href="/" className="text-smoke no-underline hover:text-ink transition-colors">
                Taitung.md
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-smoke">故事</span>
            </div>

            {/* Layer tags */}
            <div className="flex gap-2 mb-5">
              {layers.map((layer) =>
                layer ? (
                  <span
                    key={layer.id}
                    className="inline-flex items-center gap-1.5 text-xs font-body px-2.5 py-1 rounded-full"
                    style={{ color: layer.color, backgroundColor: `${layer.color}15` }}
                  >
                    <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: layer.color }} />
                    {layer.name}
                  </span>
                ) : null
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-black leading-tight tracking-tight mb-6">
              {frontmatter.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-smoke pb-8 border-b border-ink/[0.06]">
              {frontmatter.township && <span>{frontmatter.township}</span>}
              <span>{readTime} 分鐘閱讀</span>
              {frontmatter.coordinates && (
                <span className="font-accent italic text-stone">
                  {frontmatter.coordinates[0].toFixed(4)}&deg;N, {frontmatter.coordinates[1].toFixed(4)}&deg;E
                </span>
              )}
              {voiceTypes.length > 0 && (
                <span className="text-stone">{voiceTypes.length} 個聲道</span>
              )}
            </div>
          </div>
        </section>

        {/* Source notice */}
        {frontmatter.sources && frontmatter.sources.length > 0 && (
          <div className="bg-cream border-b border-ink/[0.06] py-4 px-8">
            <p className="max-w-[800px] mx-auto text-[0.78rem] text-smoke">
              本文引述來自公開學術資料與田野訪談，完整來源見文末。
            </p>
          </div>
        )}

        {/* Article content — dialogue-style multi-voice */}
        <section className="bg-cream py-16 px-8">
          <div className="max-w-[800px] mx-auto">
            {paragraphs.map((para, i) => {
              // Assign voice type based on available voices, cycling through them
              const voiceType = voiceTypes.length > 0
                ? voiceTypes[i % voiceTypes.length]
                : "academic";

              const isFirstPara = i === 0;
              const cleanPara = isFirstPara ? para : para;
              const lines = cleanPara.split("\n").filter((l) => l.trim());
              const heading = !isFirstPara && lines[0] ? lines[0] : undefined;
              const body = isFirstPara ? lines : lines.slice(1);

              return (
                <ScrollReveal key={i}>
                  <div className={i > 0 ? "border-t border-ink/[0.06] mt-8" : ""}>
                    {heading && (
                      <h2 className="font-display text-[1.5rem] font-bold text-ink mt-12 mb-2 tracking-tight">
                        {heading}
                      </h2>
                    )}
                    <VoiceBlock type={voiceType as VoiceType}>
                      {body.map((line, j) => (
                        <p key={j} className="mb-4 last:mb-0">
                          {line}
                        </p>
                      ))}
                    </VoiceBlock>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* Related stories */}
        {relatedArticles.length > 0 && (
          <section className="bg-sand-deep py-16 px-8">
            <div className="max-w-[800px] mx-auto">
              <h3 className="font-display text-lg font-semibold text-ink mb-8">相關故事</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((ra) => (
                  <Link
                    key={ra.slug}
                    href={`/story/${ra.slug}`}
                    className="block bg-cream p-8 no-underline text-inherit transition-colors hover:bg-white"
                  >
                    <div className="flex gap-1.5 mb-3">
                      {ra.frontmatter.layer?.slice(0, 2).map((l) => {
                        const layer = getLayerById(l);
                        return layer ? (
                          <span key={l} className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: layer.color }} />
                        ) : null;
                      })}
                    </div>
                    <h4 className="font-display text-base font-semibold text-ink mb-2">{ra.frontmatter.title}</h4>
                    <p className="text-[0.78rem] text-smoke">{ra.frontmatter.township}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sources & AI declaration */}
        <section className="bg-cream py-12 px-8 border-t border-ink/[0.06]">
          <div className="max-w-[800px] mx-auto text-[0.82rem] text-smoke">
            {frontmatter.sources && frontmatter.sources.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-ink-soft mb-2">資料來源</p>
                <ul className="list-none space-y-2">
                  {frontmatter.sources.map((s, i) => (
                    <li key={i} className="flex flex-col gap-0.5">
                      <span className="flex items-start gap-2">
                        <span className="text-stone mt-0.5">[{i + 1}]</span>
                        <span>{s.citation || s.title || s.name}</span>
                      </span>
                      {/* H15：ogdl-1.0 來源必須渲染完整顯名聲明，未標示視為自始未取得授權 */}
                      {s.license === "ogdl-1.0" && s.attribution_statement && (
                        <span className="pl-5 text-[0.72rem] text-stone italic">
                          {s.attribution_statement}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {frontmatter.ai_assisted && frontmatter.ai_assisted.length > 0 && (
              <p className="text-stone">
                AI 輔助：{frontmatter.ai_assisted.join("、")}
              </p>
            )}
            {frontmatter.ai_generated === false && (
              <p className="text-stone text-[0.75rem] mt-2">
                本文內容非 AI 生成。
              </p>
            )}
          </div>
        </section>

        {/* Contribute CTA */}
        <section className="bg-cream py-12 px-8 border-t border-ink/[0.06]">
          <div className="max-w-[800px] mx-auto text-center">
            <h3 className="font-display text-lg font-semibold text-ink mb-3">你知道更多嗎？</h3>
            <p className="text-[0.88rem] text-smoke mb-6">
              如果你有這個地方的故事、照片、或想修正的資訊，歡迎補充。
            </p>
            <Link
              href="/about"
              className="inline-block px-8 py-3 bg-pacific text-cream text-[0.85rem] font-medium no-underline rounded-button transition-opacity hover:opacity-90"
            >
              補充這篇故事
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
