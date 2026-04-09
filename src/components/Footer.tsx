"use client";

import Link from "next/link";
import { layers } from "@/lib/layers";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-ink text-sand/80 px-10 py-20">
      <div className="max-w-wide mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-accent text-xl font-semibold text-sand mb-4">
              Taitung.md
            </h3>
            <p className="text-sm leading-relaxed text-stone max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-stone mb-4">
              {t("footer.layers")}
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
              {t("nav.contribute").slice(0, 2)}
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-sm text-stone/80 hover:text-sand transition-colors no-underline"
              >
                {t("nav.about")}
              </Link>
              <Link
                href="/contribute"
                className="text-sm text-stone/80 hover:text-sand transition-colors no-underline"
              >
                {t("footer.contribute")}
              </Link>
              <a
                href="https://github.com/akai1030/taitung.md"
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
            {t("footer.license")}
          </p>
          <p className="text-xs text-stone/60 font-accent italic">
            22.7583&deg;N, 121.1444&deg;E
          </p>
        </div>
      </div>
    </footer>
  );
}
