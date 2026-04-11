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
