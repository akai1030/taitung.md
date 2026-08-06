"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import type { SoundEntry } from "@/lib/sounds";

function WaveBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[0.4, 0.85, 0.55, 1, 0.7].map((h, i) => (
        <span
          key={i}
          className="w-[2px] bg-pacific/60 rounded-full origin-bottom transition-transform"
          style={{
            height: `${h * 100}%`,
            animation: active ? `wave 900ms ease-in-out ${i * 110}ms infinite alternate` : undefined,
            transform: active ? undefined : "scaleY(0.35)",
          }}
        />
      ))}
      <style>{`@keyframes wave{from{transform:scaleY(0.3)}to{transform:scaleY(1)}}`}</style>
    </div>
  );
}

export default function SoundGrid({ sounds }: { sounds: SoundEntry[] }) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const current = sounds.find((s) => s.id === playing) ?? null;

  useEffect(() => {
    if (!current) {
      audio.current?.pause();
      return;
    }
    if (!audio.current) audio.current = new Audio();
    audio.current.src = current.file_url;
    audio.current.play().catch(() => setPlaying(null));
    const el = audio.current;
    const onEnd = () => setPlaying(null);
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, [current]);

  useEffect(() => () => audio.current?.pause(), []);

  return (
    <>
      <section className="px-8 pb-20">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/[0.06]">
          {sounds.map((s) => (
            <ScrollReveal key={s.id}>
              <button
                onClick={() => setPlaying(playing === s.id ? null : s.id)}
                className="w-full h-full bg-ink p-8 text-left cursor-pointer border-none transition-all duration-[400ms] group hover:bg-[#1a1a18]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-normal text-cream/85 text-[1rem] mb-1">{s.title}</h3>
                    <p className="font-accent text-[0.7rem] text-cream/25 tracking-[0.08em]">
                      {[s.place, s.township].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <WaveBars active={playing === s.id} />
                </div>
                {s.description && (
                  <p className="font-body font-light text-[0.82rem] text-cream/35 leading-[1.7] mb-4">
                    {s.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-accent text-[0.65rem] text-cream/20 tracking-[0.1em]">
                    {s.duration ?? ""}
                  </span>
                  <span className="font-body text-[0.68rem] text-cream/15">{s.contributor ?? ""}</span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {current && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a09] border-t border-cream/[0.06] py-4 px-8 z-[999]">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPlaying(null)}
                aria-label="停止播放"
                className="w-10 h-10 rounded-full bg-pacific flex items-center justify-center border-none cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              </button>
              <div>
                <p className="font-display text-[0.88rem] text-cream/80">{current.title}</p>
                <p className="font-accent text-[0.68rem] text-cream/25">{current.place}</p>
              </div>
            </div>
            <span className="font-accent text-[0.68rem] text-cream/20">{current.duration ?? ""}</span>
          </div>
        </div>
      )}
    </>
  );
}
