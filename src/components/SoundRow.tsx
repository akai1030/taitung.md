import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { getSounds } from "@/lib/sounds";

/** 首頁的聲音橫列。資料全來自資料庫；沒有錄音就整區不顯示。 */
export default async function SoundRow() {
  const sounds = (await getSounds()).slice(0, 8);

  // 一筆都沒有 → 不渲染。首頁不該出現「有六段錄音」的假象。
  if (sounds.length === 0) return null;

  return (
    <section className="bg-cream py-[10vh] px-8">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-[4vh]">
            <h2
              className="font-display font-normal text-ink"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)" }}
            >
              台東的聲音
            </h2>
            <Link
              href="/sound"
              className="font-accent text-[0.8rem] text-stone no-underline tracking-[0.05em] transition-colors hover:text-pacific"
            >
              explore all &rarr;
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex gap-px overflow-x-auto hide-scrollbar -mx-8 px-8 bg-ink/[0.04]">
            {sounds.map((s) => (
              <Link
                key={s.id}
                href="/sound"
                className="flex-shrink-0 w-[220px] bg-cream p-[2.5em_2em] cursor-pointer transition-all duration-[400ms] relative no-underline text-inherit group"
              >
                <span className="font-display font-normal text-[0.92rem] text-ink block mb-1">
                  {s.title}
                </span>
                <span className="font-accent text-[0.7rem] text-stone tracking-[0.08em] block">
                  {s.township ?? s.place ?? ""}
                </span>
                <span className="font-accent text-[0.65rem] text-stone tracking-[0.05em] mt-6 block">
                  {s.duration ?? ""}
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-pacific transition-all duration-[400ms] group-hover:w-[30px]" />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
