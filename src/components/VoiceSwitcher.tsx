"use client";

import { useState } from "react";
import { VoiceType } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface VoiceSwitcherProps {
  voices: VoiceType[];
  onSwitch: (voice: VoiceType) => void;
}

const voiceIcons: Record<VoiceType, string> = {
  academic: "📖",
  "oral-history": "🎤",
  "field-note": "📝",
  "youth-action": "🌱",
  visitor: "🌍",
};

const voiceColors: Record<VoiceType, string> = {
  academic: "var(--pacific)",
  "oral-history": "var(--sunrise)",
  "field-note": "var(--valley)",
  "youth-action": "#5BAD6F",
  visitor: "#4A90B8",
};

export default function VoiceSwitcher({ voices, onSwitch }: VoiceSwitcherProps) {
  const [active, setActive] = useState<VoiceType>(voices[0]);
  const { t } = useTranslation();

  const handleSwitch = (voice: VoiceType) => {
    setActive(voice);
    onSwitch(voice);
  };

  return (
    <div className="sticky top-[72px] z-50 bg-cream pt-4 pb-4 max-w-[800px] mx-auto px-10">
      <div className="flex border-b border-ink/[0.06] relative">
        {voices.map((voice) => (
          <button
            key={voice}
            onClick={() => handleSwitch(voice)}
            className={`px-6 py-3 text-sm cursor-pointer relative border-none bg-transparent font-body whitespace-nowrap transition-colors ${
              active === voice
                ? "text-ink font-medium"
                : "text-stone hover:text-ink-soft"
            }`}
          >
            <span className="mr-1.5">{voiceIcons[voice]}</span>
            {t(`voice.${voice}`)}
            {active === voice && (
              <span
                className="absolute bottom-[-1px] left-6 right-6 h-0.5 rounded-sm"
                style={{ backgroundColor: voiceColors[voice] }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
