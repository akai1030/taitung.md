import NavFloat from "@/components/NavFloat";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import QuestionForm from "@/components/QuestionForm";
import {
  getCurrentQuestion,
  getResponses,
  getPastQuestions,
  relativeTime,
} from "@/lib/questions";

// 每次請求都重新查——回答是即時可見的（見 docs/RETHINK.md 方向 4）
export const dynamic = "force-dynamic";

const noise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default async function QuestionPage() {
  const question = await getCurrentQuestion();
  const responses = question ? await getResponses(question.id) : [];
  const past = await getPastQuestions(question?.id);

  return (
    <div className="min-h-screen bg-cream">
      <NavFloat />

      {/* Hero — dark band */}
      <section className="relative bg-ink pt-32 pb-20 px-8 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: noise, backgroundSize: "256px" }}
        />
        <p className="font-accent text-[0.68rem] tracking-[0.35em] uppercase text-gold mb-8 relative">
          Question of the Week
          {question ? ` · Week ${question.week}` : ""}
        </p>
        <h1
          className="font-display font-light text-cream/90 max-w-[650px] mx-auto tracking-[0.04em] leading-[1.6] relative"
          style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)" }}
        >
          {question ? question.question : "本週還沒有提問"}
        </h1>
        <p className="mt-6 font-accent text-[0.75rem] text-cream/25 tracking-[0.1em] relative">
          {question
            ? `${String(question.date_start).slice(0, 10)} — ${String(question.date_end).slice(0, 10)} · ${responses.length} 則回答`
            : "編輯團隊每週提出一個關於台東的問題"}
        </p>
      </section>

      {/* Answer input — 沒有進行中的問題時不顯示表單 */}
      {question && (
        <section className="bg-cream py-12 px-8">
          <div className="max-w-[600px] mx-auto">
            <ScrollReveal>
              <QuestionForm hasQuestion />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Responses */}
      <section className="bg-cream pb-16 px-8">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-display text-lg font-semibold text-ink mb-8">大家的回答</h2>

          {responses.length === 0 ? (
            <div className="py-10 border-t border-ink/[0.06]">
              <p className="font-body text-[0.92rem] leading-[1.9] text-smoke">
                {question
                  ? "還沒有人回答。你可以是第一個。"
                  : "目前沒有進行中的提問。"}
              </p>
              <p className="mt-4 text-[0.78rem] leading-[1.9] text-stone">
                這裡只會出現真實使用者寫下的回答。
                在有人回答之前，它就是空的——我們不會放範例、示意或任何預先寫好的內容。
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {responses.map((r) => (
                <ScrollReveal key={r.id}>
                  <div className="py-6 border-t border-ink/[0.06]">
                    <p className="font-body text-[0.92rem] leading-[1.8] text-ink-soft mb-3 whitespace-pre-wrap">
                      {r.content}
                    </p>
                    <div className="flex items-center gap-3 text-[0.72rem] text-stone">
                      <span>{r.author_name}</span>
                      {r.place && (
                        <>
                          <span>&middot;</span>
                          <span>{r.place}</span>
                        </>
                      )}
                      <span>&middot;</span>
                      <span>{relativeTime(String(r.created_at))}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past questions */}
      {past.length > 0 && (
        <section className="bg-sand-deep/50 py-16 px-8">
          <div className="max-w-[600px] mx-auto">
            <h2 className="font-display text-lg font-semibold text-ink mb-8">過去的問題</h2>
            <div className="flex flex-col gap-4">
              {past.map((pq) => (
                <div key={pq.id} className="bg-cream p-6">
                  <p className="font-accent text-[0.68rem] tracking-[0.15em] text-stone mb-2">
                    Week {pq.week}
                  </p>
                  <p className="font-display text-base text-ink">{pq.question}</p>
                  <p className="text-[0.72rem] text-stone mt-2">{pq.count} 則回答</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
