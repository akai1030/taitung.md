import { NextResponse } from "next/server";
import { getCurrentQuestion, getResponses, createResponse } from "@/lib/questions";

export const dynamic = "force-dynamic";

/** 200 字上限（見 docs/CLAUDE.md 每週提問機制） */
const MAX_LEN = 200;

export async function GET() {
  const question = await getCurrentQuestion();
  if (!question) {
    return NextResponse.json({ question: null, responses: [] });
  }
  const responses = await getResponses(question.id);
  return NextResponse.json({ question, responses });
}

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "資料庫未設定" }, { status: 503 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "格式錯誤" }, { status: 400 });
  }

  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "請寫下你的回答" }, { status: 400 });
  }
  if (content.length > MAX_LEN) {
    return NextResponse.json(
      { error: `最多 ${MAX_LEN} 字，目前 ${content.length} 字` },
      { status: 400 }
    );
  }

  const question = await getCurrentQuestion();
  if (!question) {
    return NextResponse.json({ error: "目前沒有進行中的提問" }, { status: 409 });
  }

  try {
    const id = await createResponse({
      questionId: question.id,
      content,
      authorName: typeof body?.authorName === "string" ? body.authorName : undefined,
      place: typeof body?.place === "string" ? body.place : undefined,
      isAnonymous: body?.isAnonymous !== false,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("[api/question] 寫入失敗：", (err as Error).message);
    return NextResponse.json({ error: "寫入失敗，請稍後再試" }, { status: 500 });
  }
}
