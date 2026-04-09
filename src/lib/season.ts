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
    name: "\u6625",
    nameEn: "Spring",
    months: [3, 4, 5],
    description: "\u98db\u9b5a\u5b63\u6b63\u5728\u862d\u55bc\u9032\u884c\u4e2d\uff0c\u87a2\u706b\u87f2\u5b63\u958b\u59cb\u4e86",
    highlights: [
      { text: "\u98db\u9b5a\u5b63\uff08\u862d\u55bc\uff09", color: "#4A90B8" },
      { text: "\u87a2\u706b\u87f2\u5b63", color: "#5BAD6F" },
      { text: "\u91d1\u91dd\u82b1\u521d\u958b", color: "#D4922A" },
    ],
  },
  {
    id: "summer",
    name: "\u590f",
    nameEn: "Summer",
    months: [6, 7, 8],
    description: "\u71b1\u6c23\u7403\u5609\u5e74\u83ef\u5347\u7a7a\u4e2d\uff0c\u8c50\u5e74\u796d\u5728\u90e8\u843d\u9593\u50b3\u5531",
    highlights: [
      { text: "\u71b1\u6c23\u7403\u5609\u5e74\u83ef", color: "#C53D3D" },
      { text: "\u885d\u6d6a\u65fa\u5b63", color: "#4A90B8" },
      { text: "\u8c50\u5e74\u796d", color: "#D4922A" },
    ],
  },
  {
    id: "autumn",
    name: "\u79cb",
    nameEn: "Autumn",
    months: [9, 10, 11],
    description: "\u91cb\u8fe6\u7522\u5b63\u958b\u59cb\uff0c\u6c60\u4e0a\u79cb\u6536\u85dd\u8853\u7bc0\u5373\u5c07\u767b\u5834",
    highlights: [
      { text: "\u6c60\u4e0a\u79cb\u6536\u85dd\u8853\u7bc0", color: "#8B7355" },
      { text: "\u91cb\u8fe6\u7522\u5b63", color: "#3A6B42" },
      { text: "\u5019\u9ce5\u5b63", color: "#6B7B8D" },
    ],
  },
  {
    id: "winter",
    name: "\u51ac",
    nameEn: "Winter",
    months: [12, 1, 2],
    description: "\u6d1b\u795e\u82b1\u52a0\u5de5\u5b63\u7bc0\uff0c\u6eab\u6cc9\u5b63\u958b\u59cb\u4e86",
    highlights: [
      { text: "\u6d1b\u795e\u82b1\u52a0\u5de5\u5b63", color: "#C53D3D" },
      { text: "\u6eab\u6cc9\u5b63", color: "#4A90B8" },
      { text: "\u6625\u7bc0\u90e8\u843d\u5de1\u79ae", color: "#D4922A" },
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
    "\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708",
    "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708",
  ];
  return monthNames[new Date().getMonth()];
}
