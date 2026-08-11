/**
 * 站台的絕對網址與識別資訊。
 *
 * canonical / sitemap.xml / robots.txt / Open Graph 全部從這裡取值，
 * 所以**部署時必須在 Zeabur 設 `NEXT_PUBLIC_SITE_URL` 為實際對外網址**。
 * 沒設的話會退回 `https://taitung.md`——那個網域目前還沒註冊，
 * canonical 會指向一個不存在的位址，搜尋引擎會直接忽略整站。
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://taitung.md"
).replace(/\/+$/, "");

export const SITE_NAME = "Taitung.md";

export const SITE_TAGLINE = "走進台東";

export const SITE_DESCRIPTION =
  "一座開源的台東知識庫。先感覺到，才開始讀。";

/** 相對路徑 → 絕對網址。sitemap 與 canonical 都需要絕對值。 */
export function absoluteUrl(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
