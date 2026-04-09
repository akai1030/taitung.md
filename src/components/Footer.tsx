import Link from "next/link";
import { layers } from "@/lib/layers";

export default function Footer() {
  return (
    <footer className="bg-ink text-sand/80 px-10 py-20">
      <div className="max-w-wide mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-accent text-xl font-semibold text-sand mb-4">
              Taitung.md
            </h3>
            <p className="text-sm leading-relaxed text-stone max-w-sm">
              \u4e00\u5ea7\u958b\u6e90\u7684\u53f0\u6771\u77e5\u8b58\u5eab\u3002\u5f9e\u81fa\u6771\u5927\u5b78\u51fa\u767c\uff0c\u70ba\u6240\u6709\u60f3\u8a8d\u8b58\u53f0\u6771\u7684\u4eba\u800c\u5efa\u3002
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-stone mb-4">
              \u5730\u666f\u5c64
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {layers.map((layer) => (
                <Link
                  key={layer.id}
                  href={`/${layer.id}`}
                  className="text-sm text-stone/80 hover:text-sand transition-colors no-underline"
                >
                  {layer.icon} {layer.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-stone mb-4">
              \u9023\u7d50
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-stone/80 hover:text-sand transition-colors no-underline"
              >
                \u95dc\u65bc
              </Link>
              <Link
                href="/contribute"
                className="text-sm text-stone/80 hover:text-sand transition-colors no-underline"
              >
                \u53c3\u8207\u8ca2\u737b
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-stone/80 hover:text-sand transition-colors no-underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-sand/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-stone/60">
            \u5167\u5bb9\u63a1\u7528 CC BY-SA 4.0 \u6388\u6b0a
          </p>
          <p className="text-xs text-stone/60 font-accent italic">
            22.7583\u00b0N, 121.1444\u00b0E
          </p>
        </div>
      </div>
    </footer>
  );
}
