import ScrollReveal from "./ScrollReveal";
import { getAllQuotes, getAuthorById } from "@/lib/quotes";

export default function QuoteTransition() {
  const quotes = getAllQuotes();
  // Pick a featured quote — prefer Syaman Rapongan (ocean writer) for the sea→land transition
  const oceanQuote = quotes.find((q) => q.author === "syaman-rapongan") || quotes[0];
  const author = oceanQuote ? getAuthorById(oceanQuote.author) : undefined;

  if (!oceanQuote) {
    return null;
  }

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #0e3a52 0%, #1a4a5e 10%, #2a5a6e 25%, #4a7a88 45%, #7a9a90 60%, #a0b8a0 75%, #c8ccb0 88%, #e8dcc8 100%)",
      }}
    >
      <ScrollReveal className="max-w-[620px] px-10 text-center">
        <blockquote
          className="font-display font-light leading-[1.9] tracking-[0.04em] text-white/[0.88]"
          style={{ fontSize: "clamp(1.3rem, 3.2vw, 2rem)" }}
        >
          {oceanQuote.text}
        </blockquote>
        <cite className="block mt-8 font-accent italic text-[0.85rem] text-white/35 tracking-[0.08em] not-italic">
          {author?.name || oceanQuote.author}
        </cite>
        {author?.hometown && (
          <p className="text-[0.72rem] text-white/20 tracking-[0.15em] mt-2 font-accent">
            {author.hometown}
          </p>
        )}
      </ScrollReveal>
    </section>
  );
}
