import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * 取代原本寫死的 `public/robots.txt`。
 *
 * 寫死的那份把 sitemap 指向 `https://taitung.md/sitemap.xml`，
 * 但當時 sitemap 根本不存在（404），等於對爬蟲承諾了一個空頭支票。
 * 改成動態產生後，網址跟著 `NEXT_PUBLIC_SITE_URL` 走，不會再對不上。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API 路由沒有可索引的內容，擋掉省爬蟲預算
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
