import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, ArticleFrontmatter, LayerId, MapPoint } from "./types";

const contentDirectory = path.join(process.cwd(), "content");

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md") && !entry.name.startsWith("_")) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getAllArticles(): Article[] {
  const files = getMarkdownFiles(contentDirectory);
  return files
    .map((filePath) => {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const frontmatter = data as ArticleFrontmatter;
      const relativePath = path.relative(contentDirectory, filePath);
      const parts = relativePath.replace(/\\/g, "/").split("/");
      const primaryLayer = parts[0];
      return {
        frontmatter,
        content,
        slug: frontmatter.slug || path.basename(filePath, ".md"),
        layer: primaryLayer,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.created || "").getTime() -
        new Date(a.frontmatter.created || "").getTime()
    );
}

export function getArticleBySlug(
  layer: string,
  slug: string
): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.layer === layer && a.slug === slug);
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

export function getAllLayers(): string[] {
  const articles = getAllArticles();
  const layerSet = new Set<string>();
  articles.forEach((a) => {
    layerSet.add(a.layer);
    a.frontmatter.layer?.forEach((l) => layerSet.add(l));
  });
  return Array.from(layerSet);
}
