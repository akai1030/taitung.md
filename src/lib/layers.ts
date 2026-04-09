import { Layer } from "./types";

export const layers: Layer[] = [
  { id: "land", icon: "\ud83d\uddfa\ufe0f", name: "\u571f\u5730", nameEn: "Land", color: "#8B7355" },
  { id: "time", icon: "\ud83c\udfdb\ufe0f", name: "\u6642\u9593", nameEn: "Time", color: "#A0522D" },
  { id: "people", icon: "\ud83d\udc65", name: "\u4eba\u7fa4", nameEn: "People", color: "#D4922A" },
  { id: "knowledge", icon: "\ud83c\udf93", name: "\u77e5\u8b58", nameEn: "Knowledge", color: "#2B6CB0" },
  { id: "living", icon: "\ud83c\udf5a", name: "\u751f\u6d3b", nameEn: "Living", color: "#7B8B6F" },
  { id: "celebration", icon: "\ud83c\udfad", name: "\u6176\u5178", nameEn: "Celebration", color: "#C53D3D" },
  { id: "experience", icon: "\ud83c\udfc4", name: "\u9ad4\u9a57", nameEn: "Experience", color: "#4A90B8" },
  { id: "youth", icon: "\ud83c\udf31", name: "\u9752\u5e74", nameEn: "Youth", color: "#5BAD6F" },
  { id: "design", icon: "\ud83c\udfa8", name: "\u8a2d\u8a08", nameEn: "Design", color: "#8B6FB0" },
  { id: "education", icon: "\ud83d\udcda", name: "\u6559\u80b2", nameEn: "Education", color: "#B08D57" },
  { id: "sustainability", icon: "\ud83c\udf3f", name: "\u6c38\u7e8c", nameEn: "Sustainability", color: "#3D7C47" },
  { id: "connection", icon: "\ud83d\ude82", name: "\u9023\u7d50", nameEn: "Connection", color: "#6B7B8D" },
];

export function getLayerById(id: string): Layer | undefined {
  return layers.find((l) => l.id === id);
}

export function getLayerColor(id: string): string {
  return getLayerById(id)?.color ?? "#8A8578";
}
