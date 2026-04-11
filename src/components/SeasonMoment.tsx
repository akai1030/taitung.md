import ScrollReveal from "./ScrollReveal";
import { getCurrentSeason, getCurrentMonthName } from "@/lib/season";

export default function SeasonMoment() {
  const season = getCurrentSeason();
  const monthName = getCurrentMonthName();

  return (
    <section className="relative bg-cream py-[14vh] px-8">
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
        }}
      />
      <ScrollReveal className="max-w-[740px] mx-auto relative">
        <p className="font-accent text-[0.7rem] tracking-[0.3em] uppercase text-sunrise mb-10">
          This moment in Taitung &middot; {monthName}
        </p>
        <h2
          className="font-display font-normal leading-[1.8] text-ink-soft tracking-[0.03em]"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)" }}
        >
          {season.description.split("，").map((part, i) => (
            <span key={i}>
              {i > 0 && "，"}
              {part.includes("季") || part.includes("祭") ? (
                <em className="not-italic text-sunrise border-b border-sunrise/20">{part}</em>
              ) : (
                part
              )}
            </span>
          ))}
        </h2>
        <div className="mt-12 font-body font-light text-[0.88rem] leading-[2.1] text-smoke">
          <div className="flex flex-wrap gap-3 mt-4">
            {season.highlights.map((h) => (
              <span
                key={h.text}
                className="inline-flex items-center gap-2 text-[0.78rem]"
              >
                <span className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: h.color }} />
                {h.text}
              </span>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
