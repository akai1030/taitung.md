"use client";

import { useEffect, useState } from "react";

export default function OceanHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Generate sparkle positions deterministically
  const sparkles = Array.from({ length: 18 }, (_, i) => ({
    left: `${12 + (i * 37) % 76}%`,
    top: `${5 + (i * 23) % 30}%`,
    duration: `${2 + (i % 4) * 0.8}s`,
    delay: `${(i * 0.4) % 3}s`,
  }));

  return (
    <section className="relative w-full h-[105vh] overflow-hidden flex flex-col justify-end">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #5a8aaa 0%, #6a9ab8 15%, #89b4c8 30%, #a8c8d4 45%, #c0d0c4 55%, #d4ccb0 68%, #dcc4a0 78%, #e0b080 88%, #d89860 100%)",
          animation: "sky-breathe 15s ease-in-out infinite alternate",
        }}
      >
        {/* Sun */}
        <div className="absolute pointer-events-none" style={{ top: "14%", right: "22%" }}>
          <div className="absolute -inset-[200px] rounded-full" style={{ background: "radial-gradient(circle, rgba(255,240,180,0.06) 0%, transparent 60%)" }} />
          <div
            className="absolute -inset-20 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,248,200,0.2) 0%, rgba(255,240,180,0.05) 50%, transparent 70%)", animation: "flare-breathe 8s ease-in-out infinite alternate" }}
          />
          <div
            className="w-[90px] h-[90px] rounded-full"
            style={{ background: "radial-gradient(circle, #fffae0 0%, #f5d870 25%, #e8b040 55%, rgba(232,168,48,0) 100%)", animation: "sun-pulse 10s ease-in-out infinite alternate" }}
          />
        </div>

        {/* Clouds */}
        <div className="absolute rounded-[200px] pointer-events-none blur-[25px] bg-white/[0.12] w-[450px] h-[50px]" style={{ top: "10%", left: "-5%", animation: "drift 90s linear infinite" }} />
        <div className="absolute rounded-[200px] pointer-events-none blur-[25px] bg-white/[0.08] w-[350px] h-[35px]" style={{ top: "20%", left: "40%", animation: "drift 130s linear infinite", animationDelay: "-50s" }} />
        <div className="absolute rounded-[200px] pointer-events-none blur-[25px] bg-white/[0.06] w-[550px] h-[45px]" style={{ top: "6%", left: "65%", animation: "drift 110s linear infinite", animationDelay: "-25s" }} />
      </div>

      {/* Mountains silhouette */}
      <div className="absolute left-0 right-0 h-[8%] pointer-events-none z-[2]" style={{ bottom: "52%" }}>
        <svg className="absolute bottom-0 w-[110%] h-full -left-[5%]" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,80 C100,40 200,70 350,35 C450,15 520,45 650,25 C750,10 830,50 960,30 C1060,15 1150,55 1280,40 C1350,30 1400,50 1440,45 L1440,100 L0,100 Z" fill="rgba(60,80,78,0.25)" />
          <path d="M0,85 C150,55 280,75 420,50 C540,30 640,65 780,40 C880,25 1000,60 1140,45 C1250,35 1380,55 1440,50 L1440,100 L0,100 Z" fill="rgba(50,72,68,0.3)" />
        </svg>
      </div>

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 right-0 h-[52%] overflow-hidden z-[3]">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #4a8a9e 0%, #2e7088 15%, #1e5a74 35%, #144a62 55%, #0e3a52 100%)" }} />
        {/* Horizon line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] blur-[1px]" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,240,200,0.25) 30%, rgba(255,235,180,0.4) 50%, rgba(255,240,200,0.25) 70%, transparent 95%)" }} />
        {/* Wave layers */}
        <div className="absolute w-[200%] -left-1/2 top-0 h-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 40'%3E%3Cpath d='M0,20 C180,8 360,32 540,20 C720,8 900,32 1080,20 C1260,8 1440,20 1440,20' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1.2'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat-x", backgroundSize: "720px 40px", animation: "wave-drift 7s linear infinite" }} />
        <div className="absolute w-[200%] -left-1/2 top-[10px] h-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 40'%3E%3Cpath d='M0,20 C200,10 400,30 600,20 C800,10 1000,30 1200,20 C1400,10 1440,20 1440,20' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat-x", backgroundSize: "960px 40px", animation: "wave-drift 11s linear infinite reverse" }} />
        {/* Water reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/2" style={{ background: "radial-gradient(ellipse 50% 60% at 65% 0%, rgba(255,240,200,0.1) 0%, transparent 100%)", animation: "water-glow 5s ease-in-out infinite alternate" }} />
        {/* Sparkles */}
        {mounted && (
          <div className="absolute top-0 left-0 right-0 h-[35%] pointer-events-none">
            {sparkles.map((s, i) => (
              <div
                key={i}
                className="absolute w-[2.5px] h-[2.5px] bg-[rgba(255,252,235,0.8)] rounded-full"
                style={{ left: s.left, top: s.top, animation: `spark ${s.duration} ease-in-out infinite`, animationDelay: s.delay }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hero text */}
      <div className="relative z-10 px-[8vw] pb-[10vh] max-w-[900px]">
        <h1
          className="font-display font-extralight tracking-[0.12em] text-white/[0.92] leading-[1.05]"
          style={{ fontSize: "clamp(4rem, 11vw, 8rem)", textShadow: "0 2px 60px rgba(0,0,0,0.08)", opacity: 0, animation: "hero-in 2.2s cubic-bezier(.23,1,.32,1) 0.5s forwards" }}
        >
          台東
        </h1>
        <p
          className="font-accent font-light tracking-[0.35em] uppercase mt-[0.6em]"
          style={{ fontSize: "clamp(0.9rem, 2vw, 1.2rem)", color: "rgba(255,248,224,0.4)", opacity: 0, animation: "hero-in 2s cubic-bezier(.23,1,.32,1) 1s forwards" }}
        >
          Taitung
        </p>
        <p
          className="font-body font-extralight mt-16 leading-[2.2] tracking-[0.06em]"
          style={{ fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)", color: "rgba(255,255,255,0.35)", opacity: 0, animation: "hero-in 2s cubic-bezier(.23,1,.32,1) 1.6s forwards" }}
        >
          海風正從太平洋的方向吹來
        </p>
        <p
          className="font-accent font-light tracking-[0.2em] mt-8"
          style={{ fontSize: "0.72rem", color: "rgba(255,248,224,0.2)", opacity: 0, animation: "hero-in 2s cubic-bezier(.23,1,.32,1) 2s forwards" }}
        >
          22.7554&deg;N, 121.1446&deg;E
        </p>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: 0, animation: "hero-in 1.5s cubic-bezier(.23,1,.32,1) 3s forwards" }}
      >
        <span className="font-accent text-[0.65rem] tracking-[0.3em] text-white/20 uppercase">scroll</span>
        <div className="w-px h-7" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)", animation: "scroll-bob 2.5s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
