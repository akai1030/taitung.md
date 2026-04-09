"use client";

import { getCurrentSeason, getCurrentMonthName } from "@/lib/season";
import { useTranslation } from "@/lib/i18n";

export default function SeasonBanner() {
  const season = getCurrentSeason();
  const monthName = getCurrentMonthName();
  const { t } = useTranslation();

  return (
    <section className="px-10 flex justify-center">
      <div className="max-w-content w-full py-20 border-t border-ink/[0.06]">
        <p className="text-xs tracking-[0.2em] uppercase text-sunrise font-medium mb-5">
          {t("season.label")} &middot; {monthName}
        </p>
        <p className="font-display text-h2 leading-relaxed text-ink-soft">
          {season.description.split("\uFF0C".replace("FF0C", String.fromCharCode(0xFF0C))).map((part, i) => (
            <span key={i}>
              {i > 0 && String.fromCharCode(0xFF0C)}
              <em className="not-italic text-ink font-semibold">{part}</em>
            </span>
          ))}
        </p>
        <div className="flex gap-8 mt-10 flex-wrap">
          {season.highlights.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2.5 text-sm text-smoke cursor-pointer hover:text-ink transition-colors"
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
