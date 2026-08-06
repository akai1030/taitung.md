"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_LEN = 200;

export default function QuestionForm({ hasQuestion }: { hasQuestion: boolean }) {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!hasQuestion) return null;

  async function submit() {
    const content = answer.trim();
    if (!content) {
      setError("請先寫下你的回答");
      return;
    }
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          isAnonymous,
          authorName: isAnonymous ? undefined : name,
          place: place || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "送出失敗");
        setState("idle");
        return;
      }
      setAnswer("");
      setState("done");
      router.refresh(); // 讓伺服器端重新查一次，看到自己剛送出的回答
    } catch {
      setError("連線失敗，請稍後再試");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="py-8 text-center">
        <p className="font-display text-base text-ink mb-2">收到了，謝謝你。</p>
        <p className="text-[0.82rem] text-smoke mb-6">你的回答已經在下面了。</p>
        <button
          onClick={() => setState("idle")}
          className="text-[0.82rem] text-pacific underline underline-offset-4 bg-transparent border-none cursor-pointer"
        >
          再寫一則
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-display text-lg font-semibold text-ink mb-6">寫下你的回答</h2>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="在這裡寫下你的想法⋯⋯"
        maxLength={MAX_LEN}
        className="w-full h-32 p-4 bg-sand-deep/50 border border-ink/[0.06] rounded-lg font-body text-[0.92rem] text-ink resize-none focus:outline-none focus:border-pacific transition-colors"
      />

      <div className="flex flex-wrap gap-3 mt-3">
        {!isAnonymous && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            maxLength={40}
            className="flex-1 min-w-[140px] px-4 py-2.5 bg-sand-deep/50 border border-ink/[0.06] rounded-lg font-body text-[0.85rem] text-ink focus:outline-none focus:border-pacific transition-colors"
          />
        )}
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="你在哪裡？（選填）"
          maxLength={40}
          className="flex-1 min-w-[140px] px-4 py-2.5 bg-sand-deep/50 border border-ink/[0.06] rounded-lg font-body text-[0.85rem] text-ink focus:outline-none focus:border-pacific transition-colors"
        />
      </div>

      {error && <p className="mt-3 text-[0.8rem] text-[#B4453C]">{error}</p>}

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
          <span className="text-[0.72rem] text-stone">
            {answer.length}/{MAX_LEN}
          </span>
        </div>
        <button
          onClick={submit}
          disabled={state === "sending" || !answer.trim()}
          className="px-6 py-2.5 bg-gold text-ink text-[0.82rem] font-medium border-none cursor-pointer transition-all hover:bg-gold-light hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {state === "sending" ? "送出中⋯⋯" : "送出"}
        </button>
      </div>
    </>
  );
}
