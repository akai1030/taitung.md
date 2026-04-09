import Link from "next/link";
import { Article } from "@/lib/types";
import LayerTag from "./LayerTag";
import { getLayerById } from "@/lib/layers";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "horizontal";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const { frontmatter, slug, layer } = article;
  const readTime = Math.max(1, Math.ceil(article.content.length / 500));
  const primaryLayer = frontmatter.layer?.[0] || layer;
  const layerInfo = getLayerById(primaryLayer);
  const icon = layerInfo?.icon || "📝";

  if (variant === "horizontal") {
    return (
      <Link
        href={`/${layer}/${slug}`}
        className="flex-shrink-0 w-[380px] snap-start cursor-pointer no-underline text-inherit transition-transform duration-400 hover:-translate-y-1"
        style={{ transitionTimingFunction: "cubic-bezier(.23,1,.32,1)" }}
      >
        <div className="w-full h-[260px] bg-sand-deep rounded overflow-hidden mb-5 flex items-center justify-center">
          <span className="text-5xl opacity-30">{icon}</span>
        </div>
        <div className="flex gap-2 mb-2.5">
          {frontmatter.layer?.slice(0, 2).map((l) => (
            <LayerTag key={l} layerId={l} />
          ))}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug tracking-tight mb-2">
          {frontmatter.title}
        </h3>
        <p className="text-sm text-stone">
          {frontmatter.township && `${frontmatter.township} \u00b7 `}
          {readTime}
          {" 分鐘閱讀"}
        </p>
      </Link>
    );
  }

  return (
    <Link
      href={`/${layer}/${slug}`}
      className="group block no-underline text-inherit"
    >
      <div className="bg-sand/50 rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-pacific border border-transparent">
        <div className="w-full h-48 bg-sand-deep flex items-center justify-center">
          <span className="text-4xl opacity-30">{icon}</span>
        </div>
        <div className="p-5">
          <div className="flex gap-2 mb-2.5">
            {frontmatter.layer?.slice(0, 2).map((l) => (
              <LayerTag key={l} layerId={l} />
            ))}
          </div>
          <h3 className="font-display text-base font-bold leading-snug tracking-tight mb-1.5">
            {frontmatter.title}
          </h3>
          <p className="text-sm text-stone">
            {frontmatter.township && `${frontmatter.township} \u00b7 `}
            {readTime}
            {" 分鐘閱讀"}
          </p>
        </div>
      </div>
    </Link>
  );
}
