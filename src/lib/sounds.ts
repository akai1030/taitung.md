import pool from "./db";

export interface SoundEntry {
  id: number;
  title: string;
  description: string | null;
  place: string | null;
  township: string | null;
  file_url: string;
  duration: string | null;
  contributor: string | null;
  indigenous: boolean;
  tk_notice: string | null;
  consent_verified: boolean;
}

/**
 * 取得聲音條目。
 *
 * 兩道守門，都不是裝飾：
 *  - file_url 為 NOT NULL（schema 層）——沒有檔案就不該有條目
 *  - indigenous 為 true 者，必須 consent_verified 才會出現在前台
 *
 * 資料庫不可用時回傳空陣列。**空的是正確狀態，不要用假資料填滿。**
 */
export async function getSounds(): Promise<SoundEntry[]> {
  if (!process.env.DATABASE_URL) return [];
  try {
    const { rows } = await pool.query<SoundEntry>(
      `SELECT id, title, description, place, township, file_url,
              duration, contributor, indigenous, tk_notice, consent_verified
         FROM sound_entries
        WHERE file_url IS NOT NULL
          AND (indigenous = false OR consent_verified = true)
        ORDER BY created_at DESC
        LIMIT 200`
    );
    return rows;
  } catch (err) {
    console.error("[sounds] DB 查詢失敗：", (err as Error).message);
    return [];
  }
}
