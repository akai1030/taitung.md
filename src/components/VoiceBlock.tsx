import { VoiceType } from "@/lib/types";

interface VoiceBlockProps {
  type: VoiceType;
  children: React.ReactNode;
  speaker?: string;
  meta?: string;
}

const voiceConfig: Record<VoiceType, {
  color: string;
  bg: string;
  label: string;
  labelEn: string;
}> = {
  academic: {
    color: "#1B5E7B",
    bg: "#EEF5F8",
    label: "學術研究",
    labelEn: "Academic Research",
  },
  "oral-history": {
    color: "#C8782A",
    bg: "#FBF3EA",
    label: "口述歷史",
    labelEn: "Oral History",
  },
  "field-note": {
    color: "#3A6B42",
    bg: "#EDF5EE",
    label: "田野筆記",
    labelEn: "Field Note",
  },
  "youth-action": {
    color: "#5BAD6F",
    bg: "#EFF8F1",
    label: "青年行動",
    labelEn: "Youth Action",
  },
  visitor: {
    color: "#4A90B8",
    bg: "#EDF4F8",
    label: "旅人觀察",
    labelEn: "Visitor",
  },
  media: {
    color: "#8B6F47",
    bg: "#F5F0E8",
    label: "機構媒體報導",
    labelEn: "Institutional Media",
  },
};

export default function VoiceBlock({ type, children, speaker, meta }: VoiceBlockProps) {
  const config = voiceConfig[type] || voiceConfig.academic;

  if (type === "academic") {
    return (
      <div className="relative pl-8 py-8">
        {/* Blue dot */}
        <div className="absolute left-0 top-10 w-[10px] h-[10px] rounded-full" style={{ backgroundColor: config.color }} />
        <p className="font-accent text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: config.color }}>
          {config.label}
        </p>
        <div className="prose-taitung font-body">
          {children}
        </div>
        {speaker && (
          <p className="mt-4 font-accent italic text-[0.82rem] text-smoke">
            — {speaker}
          </p>
        )}
      </div>
    );
  }

  if (type === "oral-history") {
    return (
      <div className="relative py-8" style={{ borderLeft: `3px solid ${config.color}`, paddingLeft: "2rem" }}>
        <p className="font-accent text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: config.color }}>
          {config.label}
        </p>
        <div className="font-display text-[1.15rem] leading-[2] text-ink-soft">
          {children}
        </div>
        {speaker && (
          <p className="mt-4 font-accent italic text-[0.82rem]" style={{ color: config.color }}>
            — {speaker}
          </p>
        )}
      </div>
    );
  }

  if (type === "field-note") {
    return (
      <div className="relative py-8 px-8 rounded-lg" style={{ backgroundColor: config.bg }}>
        <p className="font-accent text-[0.68rem] tracking-[0.2em] uppercase mb-2" style={{ color: config.color }}>
          {config.label}
        </p>
        {meta && (
          <p className="font-accent text-[0.65rem] text-smoke tracking-[0.1em] mb-4">
            {meta}
          </p>
        )}
        <div className="prose-taitung italic font-body">
          {children}
        </div>
        {speaker && (
          <p className="mt-4 font-accent text-[0.78rem]" style={{ color: config.color }}>
            — {speaker}
          </p>
        )}
      </div>
    );
  }

  if (type === "youth-action") {
    return (
      <div className="relative py-8 pl-6" style={{ borderLeft: `3px solid ${config.color}` }}>
        <p className="font-accent text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: config.color }}>
          {config.label}
        </p>
        <div className="prose-taitung font-body">
          {children}
        </div>
        {speaker && (
          <p className="mt-4 font-accent text-[0.82rem]" style={{ color: config.color }}>
            — {speaker}
          </p>
        )}
      </div>
    );
  }

  if (type === "media") {
    return (
      <div className="relative py-8 px-8 rounded-lg" style={{ backgroundColor: config.bg }}>
        <p className="font-accent text-[0.68rem] tracking-[0.2em] uppercase mb-2" style={{ color: config.color }}>
          {config.label}
        </p>
        {meta && (
          <p className="font-accent text-[0.65rem] text-smoke tracking-[0.1em] mb-4">
            {meta}
          </p>
        )}
        <div className="prose-taitung font-body">
          {children}
        </div>
        {speaker && (
          <p className="mt-4 font-accent text-[0.78rem]" style={{ color: config.color }}>
            — {speaker}
          </p>
        )}
      </div>
    );
  }

  // visitor
  return (
    <div className="relative py-8 pl-6" style={{ borderLeft: `2px solid ${config.color}` }}>
      <p className="font-accent text-[0.68rem] tracking-[0.2em] uppercase mb-4" style={{ color: config.color }}>
        {config.label}
      </p>
      <div className="prose-taitung font-body text-[0.95rem]">
        {children}
      </div>
      {speaker && (
        <p className="mt-4 font-accent italic text-[0.78rem] text-smoke">
          — {speaker}
        </p>
      )}
    </div>
  );
}
