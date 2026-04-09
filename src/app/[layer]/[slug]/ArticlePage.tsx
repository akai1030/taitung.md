"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Article, VoiceType } from "@/lib/types";
import { getLayerById } from "@/lib/layers";
import VoiceSwitcher from "@/components/VoiceSwitcher";
import LayerTag from "@/components/LayerTag";

const TaitungMap = dynamic(() => import("@/components/TaitungMap"), {
  ssr: false,
});

interface ArticlePageProps {
  article: Article;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const { frontmatter, content } = article;
  const voices =
    frontmatter.voices?.map((v) => v.type) || (["academic"] as VoiceType[]);
  const [activeVoice, setActiveVoice] = useState<VoiceType>(voices[0]);

  return (
    <>
      {voices.length > 1 && (
        <VoiceSwitcher voices={voices} onSwitch={setActiveVoice} />
      )}

      <div className="max-w-[1100px] mx-auto px-10 pb-32 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-20 items-start">
        {/* Main content */}
        <article className="prose-taitung font-display">
          {content.split("\n").map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={i}>{trimmed.replace("## ", "")}</h2>
              );
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={i}>{trimmed.replace("### ", "")}</h3>
              );
            }
            return <p key={i}>{trimmed}</p>;
          })}
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-28">
          {/* Mini map */}
          {frontmatter.coordinates && (
            <div className="mb-8">
              <TaitungMap
                className="w-full h-48 rounded-card"
                center={[
                  frontmatter.coordinates[1],
                  frontmatter.coordinates[0],
                ]}
                zoom={12}
                interactive={false}
                points={[
                  {
                    coordinates: frontmatter.coordinates,
                    title: frontmatter.title,
                    slug: article.slug,
                    layer: frontmatter.layer?.[0] || "land",
                  },
                ]}
              />
            </div>
          )}

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase text-stone mb-3">
                {"標籤"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-sand rounded-full text-smoke"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {frontmatter.sources && frontmatter.sources.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] uppercase text-stone mb-3">
                {"參考來源"}
              </h4>
              <ul className="space-y-2">
                {frontmatter.sources.map((source, i) => (
                  <li key={i} className="text-sm text-smoke">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pacific no-underline hover:underline"
                      >
                        {source.title}
                      </a>
                    ) : (
                      source.title
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related */}
          {frontmatter.related && frontmatter.related.length > 0 && (
            <div>
              <h4 className="text-xs tracking-[0.15em] uppercase text-stone mb-3">
                {"相關文章"}
              </h4>
              <ul className="space-y-2">
                {frontmatter.related.map((path) => (
                  <li key={path}>
                    <Link
                      href={path}
                      className="text-sm text-pacific no-underline hover:underline"
                    >
                      {path}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
