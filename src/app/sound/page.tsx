import NavFloat from "@/components/NavFloat";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import SoundGrid from "@/components/SoundGrid";
import { getSounds } from "@/lib/sounds";

export const dynamic = "force-dynamic";

export default async function SoundPage() {
  const sounds = await getSounds();

  return (
    <div className="min-h-screen bg-ink">
      <NavFloat />

      {/* Hero */}
      <section className="pt-32 pb-16 px-8 text-center">
        <p className="font-accent text-[0.7rem] tracking-[0.3em] uppercase text-pacific mb-6">
          Sound Map
        </p>
        <h1
          className="font-display font-light text-cream/90 tracking-[0.04em]"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
        >
          台東的聲音
        </h1>
        <p className="font-body font-extralight text-[0.88rem] text-cream/30 mt-4 max-w-[500px] mx-auto leading-[1.8]">
          每個地方都有自己的聲音。閉上眼睛，聽見台東。
        </p>
      </section>

      {sounds.length === 0 ? (
        /* 空狀態：這裡還沒有任何錄音。這是事實，不是待補的版面。 */
        <section className="px-8 pb-24">
          <div className="max-w-[560px] mx-auto text-center">
            <ScrollReveal>
              <div className="border-t border-cream/[0.08] pt-14">
                <p className="font-display font-light text-cream/70 text-[1.15rem] leading-[1.9] mb-8">
                  這裡還沒有任何聲音。
                </p>
                <p className="font-body font-light text-[0.86rem] text-cream/35 leading-[2] mb-4">
                  聲音必須是真的有人去錄的。海浪、市場、火車進站、田裡的風——
                  這些沒辦法被生成，也不該被生成。
                </p>
                <p className="font-body font-light text-[0.86rem] text-cream/35 leading-[2]">
                  所以在有人真的按下錄音鍵之前，這一頁就是空的。
                  空白比填滿假的誠實。
                </p>

                <div className="mt-14 pt-10 border-t border-cream/[0.06]">
                  <p className="font-body font-light text-cream/45 text-[0.9rem] mb-3">
                    你身邊有台東的聲音嗎？
                  </p>
                  <p className="font-body font-extralight text-[0.78rem] text-cream/25 leading-[1.9] mb-8">
                    30 秒就好。不用剪輯，不用配樂。
                  </p>
                  <a
                    href="/about"
                    className="inline-block px-8 py-3 bg-transparent border border-cream/15 text-cream/50 font-body text-[0.82rem] no-underline transition-all hover:text-cream/80 hover:border-cream/30"
                  >
                    了解怎麼參與
                  </a>
                </div>

                <p className="mt-16 font-accent text-[0.62rem] tracking-[0.16em] text-cream/15 leading-[2]">
                  涉及部落祭儀、歌謠等傳統文化表達的錄音，
                  <br />
                  須經該部落同意後才會出現在此。
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : (
        <>
          <SoundGrid sounds={sounds} />
          <section className="px-8 pb-20 text-center">
            <ScrollReveal>
              <p className="font-body font-light text-cream/30 text-[0.88rem] mb-6">
                你也錄到了台東的聲音？
              </p>
              <a
                href="/about"
                className="inline-block px-8 py-3 bg-transparent border border-cream/15 text-cream/50 font-body text-[0.82rem] no-underline transition-all hover:text-cream/80 hover:border-cream/30"
              >
                了解怎麼參與
              </a>
            </ScrollReveal>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
