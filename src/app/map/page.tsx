"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { layers } from "@/lib/layers";
import { LayerId } from "@/lib/types";

const TaitungMap = dynamic(() => import("@/components/TaitungMap"), {
  ssr: false,
});

export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState<LayerId[]>(
    layers.map((l) => l.id)
  );

  const toggleLayer = (id: LayerId) => {
    setActiveLayers((prev) =>
      prev.includes(id)
        ? prev.filter((l) => l !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-[100] bg-cream/90 backdrop-blur-lg rounded-full px-4 py-2 text-sm text-smoke no-underline hover:text-ink border border-ink/[0.08] transition-all"
      >
        {"← Taitung.md"}
      </Link>

      {/* Layer toggle panel */}
      <div className="fixed top-6 right-6 z-[100] bg-cream/90 backdrop-blur-lg rounded-card p-4 border border-ink/[0.08] max-h-[80vh] overflow-y-auto">
        <h3 className="text-xs tracking-[0.15em] uppercase text-stone mb-3">
          {"地景層"}
        </h3>
        <div className="space-y-2">
          {layers.map((layer) => (
            <label
              key={layer.id}
              className="flex items-center gap-2.5 cursor-pointer text-sm hover:text-ink transition-colors"
            >
              <input
                type="checkbox"
                checked={activeLayers.includes(layer.id)}
                onChange={() => toggleLayer(layer.id)}
                className="sr-only peer"
              />
              <span
                className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors peer-checked:border-transparent"
                style={{
                  borderColor: activeLayers.includes(layer.id)
                    ? layer.color
                    : "#B8B0A2",
                  backgroundColor: activeLayers.includes(layer.id)
                    ? layer.color
                    : "transparent",
                }}
              >
                {activeLayers.includes(layer.id) && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className="text-sm">
                {layer.icon} {layer.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <TaitungMap
        className="w-full h-full"
        zoom={9.5}
        interactive={true}
        activeLayers={activeLayers}
        points={[]}
      />
    </div>
  );
}
