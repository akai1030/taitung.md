import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, ArticleFrontmatter, LayerId, MapPoint } from "./types";

const contentDirectory = path.join(process.cwd(), "content");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const entries = fs.readdirSync(contentDirectory, { withFileTypes: true });
  const articles: Article[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const filePath = path.join(contentDirectory, entry.name);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as ArticleFrontmatter;
    const slug = frontmatter.slug || path.basename(entry.name, ".md");
    const primaryLayer = Array.isArray(frontmatter.layer)
      ? frontmatter.layer[0]
      : frontmatter.layer || "land";
    articles.push({ frontmatter, content, slug, layer: primaryLayer });
  }

  // Also check subdirectories for backward compat during migration
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const subdir = path.join(contentDirectory, entry.name);
    const subEntries = fs.readdirSync(subdir, { withFileTypes: true });
    for (const sub of subEntries) {
      if (!sub.isFile() || !sub.name.endsWith(".md")) continue;
      const filePath = path.join(subdir, sub.name);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const frontmatter = data as ArticleFrontmatter;
      const slug = frontmatter.slug || path.basename(sub.name, ".md");
      // Skip if already found at root level
      if (articles.some((a) => a.slug === slug)) continue;
      const primaryLayer = entry.name;
      articles.push({ frontmatter, content, slug, layer: primaryLayer });
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.created || "").getTime() -
      new Date(a.frontmatter.created || "").getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByLayer(layer: string): Article[] {
  return getAllArticles().filter(
    (a) => a.layer === layer || a.frontmatter.layer?.includes(layer as LayerId)
  );
}

/**
 * 從內文取一段當作 meta description / OG description。
 *
 * 刻意「摘錄」而不是「生成摘要」——摘要是新寫的句子，等於憑空多出一段
 * 沒有來源的文字，違反 HARD-RULES 的絕對禁令。摘錄只是把既有文字截斷。
 */
export function getExcerpt(content: string, maxLength = 155): string {
  const plain = content
    .replace(/^#{1,6}\s+/gm, "") // 標題符號
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 圖片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 連結留文字
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;
  // 儘量斷在句尾，斷不了才硬切
  const cut = plain.slice(0, maxLength);
  const lastStop = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("，"));
  return (lastStop > maxLength * 0.5 ? cut.slice(0, lastStop + 1) : cut) + "…";
}

export function getMapPoints(): MapPoint[] {
  return getAllArticles()
    .filter((a) => a.frontmatter.coordinates)
    .map((a) => ({
      coordinates: a.frontmatter.coordinates!,
      title: a.frontmatter.title,
      slug: a.slug,
      layer: (a.frontmatter.layer?.[0] || a.layer) as LayerId,
      township: a.frontmatter.township,
    }));
}
