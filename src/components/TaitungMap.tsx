"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPoint, LayerId } from "@/lib/types";
import { getLayerColor } from "@/lib/layers";

interface TaitungMapProps {
  points?: MapPoint[];
  className?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  activeLayers?: LayerId[];
}

export default function TaitungMap({
  points = [],
  className = "",
  center = [121.1444, 22.7583],
  zoom = 9,
  interactive = true,
  activeLayers,
}: TaitungMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: center,
      zoom: zoom,
      interactive: interactive,
      attributionControl: false,
    });

    map.current.on("load", () => {
      setLoaded(true);

      if (!interactive) {
        map.current!.scrollZoom.disable();
        map.current!.dragPan.disable();
      }
    });

    if (interactive) {
      map.current.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right"
      );
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !loaded) return;

    // Remove existing markers
    const existingMarkers = document.querySelectorAll(".map-marker");
    existingMarkers.forEach((el) => el.remove());

    // Add points
    const filteredPoints = activeLayers
      ? points.filter((p) => activeLayers.includes(p.layer))
      : points;

    filteredPoints.forEach((point) => {
      const color = getLayerColor(point.layer);

      const el = document.createElement("div");
      el.className = "map-marker";
      el.style.cssText = `
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #FAF8F3;
        box-shadow: 0 2px 8px ${color}40;
        cursor: pointer;
        transition: transform 0.3s;
      `;
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.5)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const popup = new maplibregl.Popup({
        offset: 15,
        closeButton: false,
      }).setHTML(
        `<div style="font-family: var(--font-body); padding: 4px 0;">
          <strong style="font-size: 0.85rem;">${point.title}</strong>
          ${point.township ? `<br><span style="font-size: 0.75rem; color: #8A8578;">${point.township}</span>` : ""}
        </div>`
      );

      new maplibregl.Marker({ element: el })
        .setLngLat([point.coordinates[1], point.coordinates[0]])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [points, loaded, activeLayers]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 bg-sand flex items-center justify-center">
          <span className="text-smoke text-sm">\u5730\u5716\u8f09\u5165\u4e2d...</span>
        </div>
      )}
    </div>
  );
}
