import { getAllArticles } from "@/lib/content";
import NavFloat from "@/components/NavFloat";
import OceanHero from "@/components/OceanHero";
import QuoteTransition from "@/components/QuoteTransition";
import SeasonMoment from "@/components/SeasonMoment";
import StoryCard from "@/components/StoryCard";
import WeeklyQuestionBand from "@/components/WeeklyQuestionBand";
import SoundRow from "@/components/SoundRow";
import VoicesPreview from "@/components/VoicesPreview";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

export default function Home() {
  const articles = getAllArticles();
  const latestArticles = articles.slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: "#0e3a52" }}>
      <NavFloat />

      {/* 1. Ocean Hero */}
      <OceanHero />

      {/* 2. Quote Transition (sea → land gradient) */}
      <QuoteTransition />

      {/* 3. Season Moment */}
      <SeasonMoment />

      {/* 4. Stories — asymmetric magazine grid */}
      <section className="bg-cream py-[4vh_2rem_14vh]">
        <ScrollReveal>
          <div className="max-w-[1100px] mx-auto mb-[6vh] px-8 flex items-end justify-between">
            <h2 className="font-display font-normal text-ink tracking-[0.02em]" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}>
              最近的故事
            </h2>
            <a href="/search" className="font-accent text-[0.8rem] text-stone no-underline tracking-[0.05em] transition-colors hover:text-pacific">
              browse all &rarr;
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-[2px] bg-ink/[0.04]">
            {latestArticles.map((article, i) => (
              <div key={article.slug} className={i === 0 ? "md:row-span-2" : ""}>
                <StoryCard article={article} featured={i === 0} />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 5. Weekly Question Band */}
      <WeeklyQuestionBand />

      {/* 6. Sound Row */}
      <SoundRow />

      {/* 7. Voices Preview (quotes from Taitung writers) */}
      <VoicesPreview />

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
