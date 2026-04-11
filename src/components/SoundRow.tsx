import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const sounds = [
  { icon: "🌊", name: "都蘭海浪", place: "東河鄉", dur: "2:30" },
  { icon: "🌾", name: "池上稻浪", place: "池上鄉", dur: "1:45" },
  { icon: "🎶", name: "豐年祭歌聲", place: "台東市", dur: "3:20" },
  { icon: "💧", name: "知本溪流", place: "台東市", dur: "4:10" },
  { icon: "🚣", name: "蘭嶼拼板舟", place: "蘭嶼鄉", dur: "2:55" },
  { icon: "🚂", name: "台東火車站", place: "台東市", dur: "1:20" },
];

export default function SoundRow() {
  return (
    <section className="bg-cream py-[10vh] px-8">
      <div className="max-w-[1100px] mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-[4vh]">
            <h2 className="font-display font-normal text-ink" style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)" }}>
              台東的聲音
            </h2>
            <Link href="/sound" className="font-accent text-[0.8rem] text-stone no-underline tracking-[0.05em] transition-colors hover:text-pacific">
              explore all &rarr;
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex gap-px overflow-x-auto hide-scrollbar -mx-8 px-8 bg-ink/[0.04]">
            {sounds.map((s) => (
              <Link
                key={s.name}
                href="/sound"
                className="flex-shrink-0 w-[220px] bg-cream p-[2.5em_2em] cursor-pointer transition-all duration-[400ms] relative no-underline text-inherit group"
              >
                <span className="text-[1.3rem] block mb-4 opacity-50">{s.icon}</span>
                <span className="font-display font-normal text-[0.92rem] text-ink block mb-1">{s.name}</span>
                <span className="font-accent text-[0.7rem] text-stone tracking-[0.08em] block">{s.place}</span>
                <span className="font-accent text-[0.65rem] text-stone tracking-[0.05em] mt-6 block">{s.dur}</span>
                {/* Hover bottom bar */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-pacific transition-all duration-[400ms] group-hover:w-[30px]" />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
