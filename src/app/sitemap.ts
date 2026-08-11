import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

/**
 * 動態 sitemap。每新增一篇 `content/*.md` 就自動多一筆，不需要人工維護。
 *
 * 這是「網站被搜尋到」的第一塊拼圖：沒有 sitemap，Google 只能靠爬連結
 * 慢慢發現頁面；有 sitemap 且在 Search Console 提交過，新文章通常幾天內就會被收錄。
 */

/** 取最能代表「內容最後變動」的日期，全部缺才退回今天。 */
function lastModified(fm: {
  updated?: string;
  last_verified?: string;
  created?: string;
}): Date {
  const raw = fm.updated || fm.last_verified || fm.created;
  if (!raw) return new Date();
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  // 首頁的 lastModified 取最新一篇文章的日期——有新內容才算首頁有更新
  const newest = articles.length > 0 ? lastModified(articles[0].frontmatter) : new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/intro"), lastModified: newest, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/map"), lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/sound"), lastModified: newest, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/question"), lastModified: newest, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified: newest, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/search"), lastModified: newest, changeFrequency: "monthly", priority: 0.3 },
  ];

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/story/${a.slug}`),
    lastModified: lastModified(a.frontmatter),
    changeFrequency: "monthly",
    // 已查證的內容比 seed 值得優先索引
    priority: a.frontmatter.status === "seed" ? 0.6 : 0.8,
  }));

  return [...staticEntries, ...articleEntries];
}
