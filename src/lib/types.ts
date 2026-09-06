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

export type ContentStatus = "seed" | "growing" | "mature" | "needs-update";

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
  source?: string;
}

export interface ArticleSource {
  type?: string;
  title?: string;
  citation?: string;
  name?: string;
  url?: string;
  author?: string;
  accessed?: string;
  verified?: boolean;
  license?: string;
  attribution_statement?: string;
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
  // v2 fields
  source_type?: string[];
  ai_generated?: boolean;
  ai_assisted?: string[];
  ai_in_methods?: string[];
  ai_in_acknowledgment?: string[];
  status?: ContentStatus;
  last_verified?: string;
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

export interface QuoteAuthor {
  id: string;
  name: string;
  nameEn?: string;
  ethnicity?: string;
  hometown?: string;
  township?: string;
  role?: string;
  bio?: string;
}

export interface Quote {
  id: string;
  author: string; // author id
  text: string;
  source: string;
  tags?: string[];
  layers?: string[];
}

export interface QuotesData {
  authors: QuoteAuthor[];
  quotes: Quote[];
}
