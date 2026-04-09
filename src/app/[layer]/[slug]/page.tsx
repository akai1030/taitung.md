import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { getLayerById } from "@/lib/layers";
import NavFloat from "@/components/NavFloat";
import LayerTag from "@/components/LayerTag";
import Footer from "@/components/Footer";
import ArticlePage from "./ArticlePage";

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    layer: a.layer,
    slug: a.slug,
  }));
}

export default function ArticleSlugPage({
  params,
}: {
  params: { layer: string; slug: string };
}) {
  const article = getArticleBySlug(params.layer, params.slug);
  if (!article) notFound();

  const { frontmatter, content } = article;
  const layer = getLayerById(params.layer);
  const readTime = Math.max(1, Math.ceil(content.length / 500));

  return (
    <>
      <NavFloat />

      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 px-10 max-w-[800px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-stone mb-8">
            <Link
              href="/"
              className="text-smoke no-underline hover:text-ink transition-colors"
            >
              Taitung.md
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href={`/${params.layer}`}
              className="text-smoke no-underline hover:text-ink transition-colors"
            >
              {layer?.icon} {layer?.name}
            </Link>
          </div>

          {/* Layer tags */}
          <div className="flex gap-2 mb-5">
            {frontmatter.layer?.map((l) => (
              <LayerTag key={l} layerId={l} />
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-h1 font-black leading-tight tracking-tight mb-6">
            {frontmatter.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-smoke pb-8 border-b border-ink/[0.06]">
            {frontmatter.township && <span>{frontmatter.township}</span>}
            <span>{readTime}{" 分鐘閱讀"}</span>
            {frontmatter.coordinates && (
              <span className="font-accent italic text-stone">
                {frontmatter.coordinates[0].toFixed(4)}&deg;N,{" "}
                {frontmatter.coordinates[1].toFixed(4)}&deg;E
              </span>
            )}
          </div>
        </section>

        {/* Article content with voice switcher and sidebar */}
        <ArticlePage article={article} />
      </main>

      <Footer />
    </>
  );
}
