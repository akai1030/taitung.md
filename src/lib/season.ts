import { Season } from "./types";

interface SeasonInfo {
  id: Season;
  name: string;
  nameEn: string;
  months: number[];
  highlights: { text: string; color: string }[];
  description: string;
}

const seasons: SeasonInfo[] = [
  {
    id: "spring",
    name: "春",
    nameEn: "Spring",
    months: [3, 4, 5],
    description: "飛魚季正在蘭嶼進行中，螢火蟲季開始了",
    highlights: [
      { text: "飛魚季（蘭嶼）", color: "#4A90B8" },
      { text: "螢火蟲季", color: "#5BAD6F" },
      { text: "金針花初開", color: "#D4922A" },
    ],
  },
  {
    id: "summer",
    name: "夏",
    nameEn: "Summer",
    months: [6, 7, 8],
    description: "熱氣球嘉年華升空中，豐年祭在部落間傳唱",
    highlights: [
      { text: "熱氣球嘉年華", color: "#C53D3D" },
      { text: "衝浪旺季", color: "#4A90B8" },
      { text: "豐年祭", color: "#D4922A" },
    ],
  },
  {
    id: "autumn",
    name: "秋",
    nameEn: "Autumn",
    months: [9, 10, 11],
    description: "釋迦產季開始，池上秋收藝術節即將登場",
    highlights: [
      { text: "池上秋收藝術節", color: "#8B7355" },
      { text: "釋迦產季", color: "#3A6B42" },
      { text: "候鳥季", color: "#6B7B8D" },
    ],
  },
  {
    id: "winter",
    name: "冬",
    nameEn: "Winter",
    months: [12, 1, 2],
    description: "洛神花加工季節，溫泉季開始了",
    highlights: [
      { text: "洛神花加工季", color: "#C53D3D" },
      { text: "溫泉季", color: "#4A90B8" },
      { text: "春節部落巡禮", color: "#D4922A" },
    ],
  },
];

export function getCurrentSeason(): SeasonInfo {
  const month = new Date().getMonth() + 1;
  return seasons.find((s) => s.months.includes(month)) ?? seasons[0];
}

export function getSeasonByMonth(month: number): SeasonInfo {
  return seasons.find((s) => s.months.includes(month)) ?? seasons[0];
}

export function getCurrentMonthName(): string {
  const monthNames = [
    "一月", "二月", "三月", "四月", "五月", "六月",
    "七月", "八月", "九月", "十月", "十一月", "十二月",
  ];
  return monthNames[new Date().getMonth()];
}
