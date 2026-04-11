import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink pt-24 pb-16 px-8">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
          {/* Brand */}
          <div>
            <p className="font-accent text-[1.1rem] font-semibold text-cream/40 tracking-[0.02em]">
              Taitung.md
            </p>
            <p className="font-body font-extralight text-[0.78rem] text-cream/15 mt-3 leading-[1.8] max-w-[280px]">
              一座開源的台東知識庫。先感覺到，才開始讀。
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="font-accent text-[0.7rem] tracking-[0.2em] uppercase text-cream/25 mb-6">Explore</h4>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/", label: "故事" },
                  { href: "/sound", label: "聲音地圖" },
                  { href: "/question", label: "本週提問" },
                  { href: "/map", label: "地圖" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="font-body text-[0.78rem] font-light text-cream/30 no-underline transition-colors hover:text-cream/60">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-accent text-[0.7rem] tracking-[0.2em] uppercase text-cream/25 mb-6">About</h4>
              <div className="flex flex-col gap-3">
                {[
                  { href: "/about", label: "關於" },
                  { href: "https://github.com/akai1030/taitung.md", label: "GitHub", external: true },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    {...("external" in item ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="font-body text-[0.78rem] font-light text-cream/30 no-underline transition-colors hover:text-cream/60"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/[0.06] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-accent text-[0.68rem] text-cream/[0.12] tracking-[0.2em]">
            22.7554&deg;N, 121.1446&deg;E
          </p>
          <p className="font-body text-[0.68rem] text-cream/10">
            CC BY-SA 4.0 &middot; Taitung.md
          </p>
        </div>
      </div>
    </footer>
  );
}
