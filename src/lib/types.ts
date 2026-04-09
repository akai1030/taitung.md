export type LayerId =
  | "land"
  | "time"
  | "people"
  | "knowledge"
  | "living"
  | "celebration"
  | "experience"
  | "youth"
  | "design"
  | "education"
  | "sustainability"
  | "connection";

export type VoiceType =
  | "academic"
  | "oral-history"
  | "field-note"
  | "youth-action"
  | "visitor";

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface Layer {
  id: LayerId;
  icon: string;
  name: string;
  nameEn: string;
  color: string;
  description?: string;
}

export interface Voice {
  type: VoiceType;
}

export interface AudioEntry {
  file: string;
  speaker: string;
  language: string;
  duration: string;
}

export interface ArticleSource {
  title: string;
  url: string;
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  layer: LayerId[];
  township?: string;
  coordinates?: [number, number];
  locale?: string;
  voices?: Voice[];
  tags?: string[];
  season?: string;
  related?: string[];
  sources?: ArticleSource[];
  audio?: AudioEntry[];
  nttu?: boolean;
  author?: string;
  created?: string;
  updated?: string;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  slug: string;
  layer: string; // primary layer (first in array)
}

export interface MapPoint {
  coordinates: [number, number];
  title: string;
  slug: string;
  layer: LayerId;
  township?: string;
}
