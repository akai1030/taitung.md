import Link from "next/link";
import { Article } from "@/lib/types";
import { getLayerById } from "@/lib/layers";

const voiceColors: Record<string, string> = {
  academic: "#1B5E7B",
  "oral-history": "#C8782A",
  "field-note": "#3A6B42",
  "youth-action": "#5BAD6F",
  visitor: "#4A90B8",
  media: "#8B6F47",
};

const voiceLabels: Record<string, string> = {
  academic: "學術",
  "oral-history": "口述",
  "field-note": "田野",
  "youth-action": "青年",
  visitor: "旅人",
  media: "媒體",
};

interface StoryCardProps {
  article: Article;
  featured?: boolean;
}

export default function StoryCard({ article, featured = false }: StoryCardProps) {
  const { frontmatter, slug, content } = article;
  const excerpt = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/^#+\s.*$/gm, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, featured ? 200 : 120);

  return (
    <Link
      href={`/story/${slug}`}
      className={`block bg-cream p-[3.5em_3em] cursor-pointer relative overflow-hidden no-underline text-inherit transition-all duration-500 hover:bg-[#f5f0e6] ${
        featured ? "flex flex-col justify-end min-h-[450px]" : ""
      }`}
      style={featured ? { background: "linear-gradient(175deg, #e8dcc8 0%, #d8ccb8 100%)" } : undefined}
    >
      {/* Layer dots */}
      <div className="flex gap-[0.6em] mb-8">
        {frontmatter.layer?.slice(0, 3).map((l) => {
          const layer = getLayerById(l);
          return (
            <span
              key={l}
              className="w-[7px] h-[7px] rounded-full opacity-60"
              style={{ backgroundColor: layer?.color }}
              title={layer?.name}
            />
          );
        })}
      </div>

      {/* Place */}
      <p className="font-accent text-[0.7rem] tracking-[0.2em] uppercase text-stone mb-4">
        {frontmatter.township || ""}
      </p>

      {/* Title */}
      <h3
        className={`font-display font-semibold leading-[1.6] text-ink tracking-[0.02em] mb-3 ${
          featured ? "text-[clamp(1.5rem,3vw,2rem)]" : "text-[clamp(1.2rem,2vw,1.5rem)]"
        }`}
      >
        {frontmatter.title}
      </h3>

      {/* Excerpt */}
      <p className="font-body font-light text-[0.85rem] leading-[1.9] text-smoke line-clamp-3">
        {excerpt}
      </p>

      {/* Voice tags */}
      {frontmatter.voices && frontmatter.voices.length > 0 && (
        <div className="flex gap-4 mt-8">
          {frontmatter.voices.map((v) => (
            <span key={v.type} className="font-body text-[0.68rem] text-stone tracking-[0.05em] flex items-center gap-[0.4em]">
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: voiceColors[v.type] }} />
              {voiceLabels[v.type] || v.type}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
