"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  file: string;
  speaker: string;
  language: string;
  duration: string;
}

export default function AudioPlayer({
  speaker,
  language,
  duration,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    setPlaying(!playing);
  };

  return (
    <div className="bg-sand-deep/50 rounded-card p-6 my-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">\ud83c\udfa4</span>
        <span className="font-display font-semibold">{speaker}\u7684\u6545\u4e8b</span>
      </div>
      <div className="text-sm text-smoke mb-4">
        \u8a9e\u8a00\uff1a{language}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-pacific text-white flex items-center justify-center border-none cursor-pointer hover:bg-pacific/90 transition-colors"
          aria-label={playing ? "\u66ab\u505c" : "\u64ad\u653e"}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 h-1 bg-stone/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-pacific rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-stone whitespace-nowrap font-accent">
            0:00 / {duration}
          </span>
        </div>
      </div>

      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className="mt-4 text-sm text-smoke hover:text-ink border-none bg-transparent cursor-pointer flex items-center gap-1.5"
      >
        \ud83d\udcc4 {showTranscript ? "\u96b1\u85cf\u9010\u5b57\u7a3f" : "\u986f\u793a\u9010\u5b57\u7a3f"}
      </button>

      {showTranscript && (
        <div className="mt-3 p-4 bg-cream rounded-button text-sm text-ink-soft leading-relaxed">
          (\u9010\u5b57\u7a3f\u5167\u5bb9\u5c07\u5728\u6b64\u986f\u793a)
        </div>
      )}
    </div>
  );
}
