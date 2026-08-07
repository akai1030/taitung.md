import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * 部署健康檢查。
 *
 * 存在的理由：/api/question 的 GET 在資料庫未設定時會回傳空結果，
 * 使「沒接上」與「沒資料」無法區分。那個洞已修，但仍需要一個
 * 明確回答「資料庫到底通不通」的端點，供部署驗證使用。
 */
export async function GET() {
  const out: Record<string, unknown> = {
    ok: false,
    database_url_set: Boolean(process.env.DATABASE_URL),
    db_reachable: false,
    tables: null as string[] | null,
  };

  if (!process.env.DATABASE_URL) {
    out.error = "DATABASE_URL 未設定於執行環境";
    return NextResponse.json(out, { status: 503 });
  }

  try {
    const { rows } = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' ORDER BY table_name`
    );
    out.db_reachable = true;
    out.tables = rows.map((r) => r.table_name);
    const expected = ["question_responses", "sound_entries", "story_supplements", "weekly_questions"];
    out.schema_complete = expected.every((t) => (out.tables as string[]).includes(t));
    out.ok = out.schema_complete === true;
    return NextResponse.json(out, { status: out.ok ? 200 : 500 });
  } catch (err) {
    out.error = (err as Error).message;
    return NextResponse.json(out, { status: 503 });
  }
}
