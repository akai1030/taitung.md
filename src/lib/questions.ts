import pool from "./db";

export interface WeeklyQuestion {
  id: number;
  week: number;
  question: string;
  date_start: string;
  date_end: string;
}

export interface QuestionResponse {
  id: number;
  author_name: string;
  place: string | null;
  content: string;
  created_at: string;
}

/** 資料庫不可用時一律回傳 null／空陣列，絕不回傳假資料。 */
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!process.env.DATABASE_URL) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.error("[questions] DB 查詢失敗：", (err as Error).message);
    return fallback;
  }
}

/** 取得目前這一週的問題。沒有就回 null——空狀態是誠實的，不要填假的。 */
export async function getCurrentQuestion(): Promise<WeeklyQuestion | null> {
  return safeQuery(async () => {
    const { rows } = await pool.query<WeeklyQuestion>(
      `SELECT id, week, question, date_start, date_end
         FROM weekly_questions
        WHERE CURRENT_DATE BETWEEN date_start AND date_end
        ORDER BY week DESC LIMIT 1`
    );
    if (rows.length) return rows[0];
    // 沒有涵蓋今天的問題 → 退而取最新一則，但仍可能沒有
    const latest = await pool.query<WeeklyQuestion>(
      `SELECT id, week, question, date_start, date_end
         FROM weekly_questions ORDER BY week DESC LIMIT 1`
    );
    return latest.rows[0] ?? null;
  }, null);
}

export async function getResponses(questionId: number): Promise<QuestionResponse[]> {
  return safeQuery(async () => {
    const { rows } = await pool.query<QuestionResponse>(
      `SELECT id, author_name, place, content, created_at
         FROM question_responses
        WHERE question_id = $1
        ORDER BY created_at DESC LIMIT 200`,
      [questionId]
    );
    return rows;
  }, []);
}

export async function getPastQuestions(excludeId?: number) {
  return safeQuery(async () => {
    const { rows } = await pool.query<WeeklyQuestion & { count: number }>(
      `SELECT q.id, q.week, q.question, q.date_start, q.date_end,
              COUNT(r.id)::int AS count
         FROM weekly_questions q
         LEFT JOIN question_responses r ON r.question_id = q.id
        WHERE ($1::int IS NULL OR q.id <> $1)
        GROUP BY q.id
        ORDER BY q.week DESC LIMIT 12`,
      [excludeId ?? null]
    );
    return rows;
  }, [] as (WeeklyQuestion & { count: number })[]);
}

export async function createResponse(input: {
  questionId: number;
  content: string;
  authorName?: string;
  place?: string;
  isAnonymous: boolean;
}) {
  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO question_responses
       (question_id, author_name, place, content, is_anonymous, submitted_via)
     VALUES ($1, $2, $3, $4, $5, 'web')
     RETURNING id`,
    [
      input.questionId,
      input.isAnonymous ? "匿名" : (input.authorName?.trim() || "匿名"),
      input.place?.trim() || null,
      input.content.trim(),
      input.isAnonymous,
    ]
  );
  return rows[0].id;
}

/** 相對時間。真的有 created_at 才算得出來——沒有資料就沒有「3 小時前」。 */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "剛剛";
  if (m < 60) return `${m} 分鐘前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小時前`;
  const d = Math.floor(h / 24);
  if (d === 1) return "昨天";
  if (d < 30) return `${d} 天前`;
  return new Date(iso).toISOString().slice(0, 10);
}
