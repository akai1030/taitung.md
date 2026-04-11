import ScrollReveal from "./ScrollReveal";
import { getAllQuotes, getAuthorById } from "@/lib/quotes";

export default function VoicesPreview() {
  const quotes = getAllQuotes();
  // Pick 3 diverse quotes for the preview
  const selected = quotes.slice(0, 4);

  return (
    <section className="py-[10vh] px-8" style={{ background: "linear-gradient(180deg, var(--cream) 0%, #f0e8d8 100%)" }}>
      <div className="max-w-[740px] mx-auto">
        <ScrollReveal>
          <p className="font-accent text-[0.7rem] tracking-[0.3em] uppercase text-stone mb-12">
            Voices from Taitung
          </p>
        </ScrollReveal>
        <div className="flex flex-col gap-12">
          {selected.map((q, i) => {
            const author = getAuthorById(q.author);
            return (
              <ScrollReveal key={q.id} delay={i * 120}>
                <div className="py-10 border-t border-ink/[0.06]">
                  <blockquote className="font-display font-normal leading-[1.9] text-ink tracking-[0.02em]" style={{ fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)" }}>
                    {q.text}
                  </blockquote>
                  <p className="mt-5 font-accent text-[0.82rem] text-smoke italic">
                    {author?.name || q.author}
                  </p>
                  {author?.role && (
                    <p className="text-[0.7rem] text-stone mt-1 tracking-[0.08em] font-accent">
                      {author.role}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
