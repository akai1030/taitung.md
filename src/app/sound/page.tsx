"use client";

import { useState } from "react";
import NavFloat from "@/components/NavFloat";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

const sounds = [
  { id: 1, title: "都蘭海浪", desc: "清晨六點，都蘭鼻的太平洋浪聲", place: "都蘭鼻", township: "東河鄉", duration: "2:30", contributor: "阿海" },
  { id: 2, title: "池上稻浪", desc: "秋收前，風吹過金色稻田的聲音", place: "伯朗大道", township: "池上鄉", duration: "1:45", contributor: "小農" },
  { id: 3, title: "豐年祭歌聲", desc: "馬蘭部落豐年祭的迎賓舞曲", place: "馬蘭部落", township: "台東市", duration: "3:20", contributor: "部落文化工作者" },
  { id: 4, title: "知本溪流", desc: "夜晚的知本溪，蟲鳴與溪水交織", place: "知本溫泉", township: "台東市", duration: "4:10", contributor: "匿名" },
  { id: 5, title: "蘭嶼拼板舟", desc: "拼板舟下水祭典的吟唱", place: "朗島部落", township: "蘭嶼鄉", duration: "2:55", contributor: "達悟文化協會" },
  { id: 6, title: "台東火車站", desc: "普悠瑪號進站的廣播與列車聲", place: "台東車站", township: "台東市", duration: "1:20", contributor: "旅人" },
];

function WaveBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-300"
          style={{
            backgroundColor: active ? "var(--pacific)" : "rgba(255,255,255,0.2)",
            height: active ? `${6 + ((i * 7 + 3) % 14)}px` : "4px",
            animation: active ? `wave-bar ${0.4 + i * 0.1}s ease-in-out infinite alternate` : "none",
            // @ts-expect-error CSS custom property
            "--h": `${6 + ((i * 7 + 3) % 14)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function SoundPage() {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-ink">
      <NavFloat />

      {/* Hero */}
      <section className="pt-32 pb-16 px-8 text-center">
        <p className="font-accent text-[0.7rem] tracking-[0.3em] uppercase text-pacific mb-6">
          Sound Map
        </p>
        <h1 className="font-display font-light text-cream/90 tracking-[0.04em]" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}>
          台東的聲音
        </h1>
        <p className="font-body font-extralight text-[0.88rem] text-cream/30 mt-4 max-w-[500px] mx-auto leading-[1.8]">
          每個地方都有自己的聲音。閉上眼睛，聽見台東。
        </p>
      </section>

      {/* Sound grid */}
      <section className="px-8 pb-20">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-cream/[0.06]">
          {sounds.map((s) => (
            <ScrollReveal key={s.id}>
              <button
                onClick={() => setPlaying(playing === s.id ? null : s.id)}
                className="w-full bg-ink p-8 text-left cursor-pointer border-none transition-all duration-[400ms] group hover:bg-[#1a1a18]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-display font-normal text-cream/85 text-[1rem] mb-1">{s.title}</h3>
                    <p className="font-accent text-[0.7rem] text-cream/25 tracking-[0.08em]">{s.place} &middot; {s.township}</p>
                  </div>
                  <WaveBars active={playing === s.id} />
                </div>
                <p className="font-body font-light text-[0.82rem] text-cream/35 leading-[1.7] mb-4">
                  {s.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-accent text-[0.65rem] text-cream/20 tracking-[0.1em]">{s.duration}</span>
                  <span className="font-body text-[0.68rem] text-cream/15">{s.contributor}</span>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-20 text-center">
        <ScrollReveal>
          <p className="font-body font-light text-cream/30 text-[0.88rem] mb-6">
            你也錄到了台東的聲音？
          </p>
          <button className="px-8 py-3 bg-transparent border border-cream/15 text-cream/50 font-body text-[0.82rem] cursor-pointer transition-all hover:text-cream/80 hover:border-cream/30">
            上傳聲音
          </button>
        </ScrollReveal>
      </section>

      {/* Now playing bar */}
      {playing && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a09] border-t border-cream/[0.06] py-4 px-8 z-[999]">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPlaying(null)}
                className="w-10 h-10 rounded-full bg-pacific flex items-center justify-center border-none cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              </button>
              <div>
                <p className="font-display text-[0.88rem] text-cream/80">{sounds.find((s) => s.id === playing)?.title}</p>
                <p className="font-accent text-[0.68rem] text-cream/25">{sounds.find((s) => s.id === playing)?.place}</p>
              </div>
            </div>
            <span className="font-accent text-[0.68rem] text-cream/20">{sounds.find((s) => s.id === playing)?.duration}</span>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
