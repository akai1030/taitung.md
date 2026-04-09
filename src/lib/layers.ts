import { Layer } from "./types";

export const layers: Layer[] = [
  { id: "land", icon: "🗺️", name: "土地", nameEn: "Land", color: "#8B7355" },
  { id: "time", icon: "🏛️", name: "時間", nameEn: "Time", color: "#A0522D" },
  { id: "people", icon: "👥", name: "人群", nameEn: "People", color: "#D4922A" },
  { id: "knowledge", icon: "🎓", name: "知識", nameEn: "Knowledge", color: "#2B6CB0" },
  { id: "living", icon: "🍚", name: "生活", nameEn: "Living", color: "#7B8B6F" },
  { id: "celebration", icon: "🎭", name: "慶典", nameEn: "Celebration", color: "#C53D3D" },
  { id: "experience", icon: "🏄", name: "體驗", nameEn: "Experience", color: "#4A90B8" },
  { id: "youth", icon: "🌱", name: "青年", nameEn: "Youth", color: "#5BAD6F" },
  { id: "design", icon: "🎨", name: "設計", nameEn: "Design", color: "#8B6FB0" },
  { id: "education", icon: "📚", name: "教育", nameEn: "Education", color: "#B08D57" },
  { id: "sustainability", icon: "🌿", name: "永續", nameEn: "Sustainability", color: "#3D7C47" },
  { id: "connection", icon: "🚂", name: "連結", nameEn: "Connection", color: "#6B7B8D" },
];

export function getLayerById(id: string): Layer | undefined {
  return layers.find((l) => l.id === id);
}

export function getLayerColor(id: string): string {
  return getLayerById(id)?.color ?? "#8A8578";
}
