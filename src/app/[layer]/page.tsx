import { notFound } from "next/navigation";
import Link from "next/link";
import { layers, getLayerById } from "@/lib/layers";
import { getArticlesByLayer } from "@/lib/content";
import NavFloat from "@/components/NavFloat";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export function generateStaticParams() {
  return layers.map((layer) => ({ layer: layer.id }));
}

export default function LayerPage({
  params,
}: {
  params: { layer: string };
}) {
  const layer = getLayerById(params.layer);
  if (!layer) notFound();

  const articles = getArticlesByLayer(params.layer);

  return (
    <>
      <NavFloat />

      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 px-10">
          <div className="max-w-content mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{layer.icon}</span>
              <div>
                <h1 className="font-display text-h1 font-bold tracking-tight">
                  {layer.name}
                </h1>
                <p className="font-accent text-lg text-stone italic">
                  {layer.nameEn}
                </p>
              </div>
            </div>
            <div
              className="w-full h-1 rounded-full mb-8"
              style={{ backgroundColor: layer.color }}
            />
            <p className="text-smoke text-lg max-w-prose">
              {articles.length} \u7bc7\u6587\u7ae0
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="px-10 pb-32">
          <div className="max-w-wide mx-auto">
            {articles.length > 0 ? (
              <ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <ArticleCard
                      key={`${article.layer}-${article.slug}`}
                      article={article}
                    />
                  ))}
                </div>
              </ScrollReveal>
            ) : (
              <div className="text-center py-20">
                <p className="text-smoke text-lg">\u9084\u6c92\u6709\u6587\u7ae0\u3002\u6210\u70ba\u7b2c\u4e00\u500b\u8ca2\u737b\u8005\uff1f</p>
                <Link
                  href="/contribute"
                  className="inline-block mt-4 text-pacific font-accent italic border-b border-pacific hover:gap-3 transition-all"
                >
                  \u4e86\u89e3\u5982\u4f55\u53c3\u8207 \u2192
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
