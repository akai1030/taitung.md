import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { getCurrentQuestion, getResponses } from "@/lib/questions";

/**
 * 本週提問。**所有數字都來自資料庫。**
 *
 * 舊版把 question / responseCount / week 寫成 props 預設值（「4 people answered」、
 * Week 14），於是首頁會宣稱有 4 個人回答過——即使一筆都沒有。
 * 捏造社群參與數字是 docs/CONTENT-STRATEGY.md 的絕對紅線。
 */
export default async function WeeklyQuestionBand() {
  const question = await getCurrentQuestion();
  const responses = question ? await getResponses(question.id) : [];
  const n = responses.length;

  return (
    <section className="relative bg-ink py-[10vh] px-8 flex flex-col items-center text-center overflow-hidden">
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
        }}
      />
      <ScrollReveal>
        <p className="font-accent text-[0.68rem] tracking-[0.35em] uppercase text-gold mb-10">
          Question of the Week{question ? ` · Week ${question.week}` : ""}
        </p>
        <h2
          className="font-display font-light leading-[1.6] text-cream/90 max-w-[650px] tracking-[0.04em]"
          style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)" }}
        >
          {question ? question.question : "本週還沒有提問"}
        </h2>
        <p className="mt-10 font-accent text-[0.75rem] text-cream/25 tracking-[0.1em]">
          {!question
            ? "編輯團隊每週提出一個關於台東的問題"
            : n === 0
              ? "還沒有人回答"
              : `${n} 則回答`}
        </p>
        {question && (
          <div className="mt-12 flex gap-4 flex-wrap justify-center">
            <Link
              href="/question"
              className="px-[2.2em] py-[0.9em] font-body font-normal text-[0.82rem] tracking-[0.08em] bg-gold text-ink no-underline transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5"
            >
              寫下你的回答
            </Link>
            {n > 0 && (
              <Link
                href="/question"
                className="px-[2.2em] py-[0.9em] font-body font-normal text-[0.82rem] tracking-[0.08em] bg-transparent text-cream/50 border border-cream/[0.12] no-underline transition-all duration-300 hover:text-cream/80 hover:border-cream/30"
              >
                看看別人怎麼說
              </Link>
            )}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}
