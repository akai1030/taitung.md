"use client";

import { useState } from "react";
import NavFloat from "@/components/NavFloat";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

// Static data for MVP — will be replaced with DB queries
const currentQuestion = {
  week: 14,
  question: "你在台東最想念的聲音是什麼？",
  dateRange: "2026-04-07 — 2026-04-13",
  responses: [
    { id: 1, author: "匿名", place: "台東市", text: "知本溪夜晚的溪水聲，小時候阿嬤家旁邊就是溪，入睡前一定會聽到。", time: "3 小時前" },
    { id: 2, author: "小林", place: "池上鄉", text: "收割季拖拉機轟隆隆的聲音，那代表豐收。", time: "5 小時前" },
    { id: 3, author: "匿名", place: "蘭嶼", text: "拼板舟下水時，族人一起唱的歌。那個旋律在海上特別清楚。", time: "昨天" },
    { id: 4, author: "阿美", place: "都蘭", text: "海浪打在礁石上的聲音，每天早上衝浪前都會先聽一下浪的節奏。", time: "昨天" },
  ],
};

const pastQuestions = [
  { week: 13, question: "如果只能帶一道台東的食物去外太空，你帶什麼？", count: 32 },
  { week: 12, question: "你在台東遇過最善良的陌生人？", count: 28 },
];

export default function QuestionPage() {
  const [answer, setAnswer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  return (
    <div className="min-h-screen bg-cream">
      <NavFloat />

      {/* Hero — dark band */}
      <section className="relative bg-ink pt-32 pb-20 px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px" }} />
        <p className="font-accent text-[0.68rem] tracking-[0.35em] uppercase text-gold mb-8 relative">
          Question of the Week &middot; Week {currentQuestion.week}
        </p>
        <h1 className="font-display font-light text-cream/90 max-w-[650px] mx-auto tracking-[0.04em] leading-[1.6] relative" style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.8rem)" }}>
          {currentQuestion.question}
        </h1>
        <p className="mt-6 font-accent text-[0.75rem] text-cream/25 tracking-[0.1em] relative">
          {currentQuestion.dateRange} &middot; {currentQuestion.responses.length} 則回答
        </p>
      </section>

      {/* Answer input */}
      <section className="bg-cream py-12 px-8">
        <div className="max-w-[600px] mx-auto">
          <ScrollReveal>
            <h2 className="font-display text-lg font-semibold text-ink mb-6">寫下你的回答</h2>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="在這裡寫下你的想法⋯⋯"
              maxLength={200}
              className="w-full h-32 p-4 bg-sand-deep/50 border border-ink/[0.06] rounded-lg font-body text-[0.92rem] text-ink resize-none focus:outline-none focus:border-pacific transition-colors"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="accent-pacific"
                  />
                  <span className="text-[0.82rem] text-smoke">匿名</span>
                </label>
                <span className="text-[0.72rem] text-stone">{answer.length}/200</span>
              </div>
              <button className="px-6 py-2.5 bg-gold text-ink text-[0.82rem] font-medium border-none cursor-pointer transition-all hover:bg-gold-light hover:-translate-y-0.5">
                送出
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Responses */}
      <section className="bg-cream pb-16 px-8">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-display text-lg font-semibold text-ink mb-8">大家的回答</h2>
          <div className="flex flex-col gap-0">
            {currentQuestion.responses.map((r) => (
              <ScrollReveal key={r.id}>
                <div className="py-6 border-t border-ink/[0.06]">
                  <p className="font-body text-[0.92rem] leading-[1.8] text-ink-soft mb-3">
                    {r.text}
                  </p>
                  <div className="flex items-center gap-3 text-[0.72rem] text-stone">
                    <span>{r.author}</span>
                    <span>&middot;</span>
                    <span>{r.place}</span>
                    <span>&middot;</span>
                    <span>{r.time}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Past questions */}
      <section className="bg-sand-deep/50 py-16 px-8">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-display text-lg font-semibold text-ink mb-8">過去的問題</h2>
          <div className="flex flex-col gap-4">
            {pastQuestions.map((pq) => (
              <div key={pq.week} className="bg-cream p-6 cursor-pointer transition-colors hover:bg-white">
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

      <Footer />
    </div>
  );
}
