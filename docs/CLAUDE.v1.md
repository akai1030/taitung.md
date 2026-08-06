# CLAUDE.md — Taitung.md 專案指引

> 這份文件供 Claude Code CLI 讀取，作為整個開發過程的持續參考。

---

## 專案概述

Taitung.md 是一座開源的台東知識庫。從臺東大學出發，為所有想認識台東的人而建。核心理念：地圖優先、多聲道、活的內容、青年參與。

**不是 wiki，不是部落格。** 它是一個以地理座標為錨點的互動式紀錄片體驗。使用者滾動頁面就是走進台東的旅程。

---

## 技術棧

- **框架**：Next.js 14 App Router + TypeScript
- **樣式**：Tailwind CSS（自訂色彩和字型見下方）
- **內容**：MDX + YAML Frontmatter（gray-matter 解析）
- **地圖**：MapLibre GL 或 Mapbox GL JS
- **搜尋**：Pagefind（build-time 索引，支援中文）
- **i18n**：next-intl（zh-tw + en）
- **部署**：Zeabur

---

## 設計原則

1. **呼吸感**：大量留白，讓內容有空間。閱讀時像在台東散步。
2. **地方的溫度**：不冷冰冰的科技感，色彩和字型帶有土地的暖度。
3. **資訊平等**：所有內容地位平等。東大內容不設特權專區，不標「著重更新」，不給予超越其他內容的視覺地位。東大文章自然穿插在一般文章列表中。
4. **文化敬意**：原住民織紋和圖騰不是裝飾品。只用在對應文化的區塊，不混用族群圖騰。
5. **紀錄片風格**：頁面滾動是旅程，不是瀏覽。使用編輯式大字排版、全版面沉浸區塊。

---

## 色彩系統

```css
/* 基底 — 台東的土地色 */
--sand: #F5F0E8;
--sand-deep: #E8E0D0;
--cream: #FAF8F3;        /* 頁面主背景 */
--ink: #1E1D1A;           /* 主要文字 */
--ink-soft: #3D3B35;
--smoke: #8A8578;         /* 次要文字 */
--stone: #B8B0A2;         /* 邊框、caption */

/* 強調 — 山海 */
--pacific: #1B5E7B;       /* 主互動色 */
--valley: #3A6B42;        /* 生態相關 */
--sunrise: #C8782A;       /* 季節、重點 */

/* 地景層各自有專屬色，完整定義見 DESIGN-SYSTEM.md */
```

---

## 字型

| 用途 | 字型 | 載入方式 |
|------|------|----------|
| 中文標題 | Noto Serif TC (400/600/700/900) | Google Fonts |
| 中文內文 | Noto Sans TC (300/400/500/700) | Google Fonts |
| 英文裝飾 | Cormorant Garamond (400/600/700/italic) | Google Fonts |

建議用 `next/font/google` 載入以減少 FOUT。

---

## 目錄結構

```
taitung-md/
├── content/                    # Markdown 文章
│   ├── land/                   # 🗺️ 土地層
│   ├── time/                   # 🏛️ 時間層
│   ├── people/                 # 👥 人群層
│   ├── knowledge/              # 🎓 知識層
│   │   └── nttu/               # 東大相關（與其他子目錄平等）
│   ├── living/                 # 🍚 生活層
│   ├── celebration/            # 🎭 慶典層
│   ├── experience/             # 🏄 體驗層
│   ├── youth/                  # 🌱 青年層
│   │   └── voices/             # 青年投稿
│   ├── design/                 # 🎨 設計層
│   ├── education/              # 📚 教育層
│   ├── sustainability/         # 🌿 永續層
│   ├── connection/             # 🚂 連結層
│   └── township/               # 16 鄉鎮
├── src/
│   ├── app/[locale]/           # Next.js App Router
│   │   ├── page.tsx            # 首頁
│   │   ├── [layer]/
│   │   │   ├── page.tsx        # 地景層列表
│   │   │   └── [slug]/page.tsx # 文章頁
│   │   ├── township/[slug]/page.tsx
│   │   ├── map/page.tsx        # 全螢幕地圖
│   │   ├── search/page.tsx
│   │   ├── contribute/page.tsx
│   │   └── about/page.tsx
│   ├── components/             # 共用元件
│   ├── lib/                    # 工具函式
│   │   ├── content.ts          # Markdown 解析
│   │   ├── types.ts            # TypeScript 型別
│   │   ├── layers.ts           # 12 地景層定義
│   │   ├── season.ts           # 季節引擎
│   │   ├── map.ts              # 地圖資料
│   │   └── i18n.ts             # 多語系
│   └── styles/globals.css
├── public/
│   ├── llms.txt
│   ├── robots.txt
│   └── audio/                  # 口述歷史音檔
├── scripts/
│   └── check-content.ts        # 內容品質檢查
├── messages/
│   ├── zh-tw.json
│   └── en.json
├── ARCHITECTURE.md             # 完整技術架構文件
├── DESIGN-SYSTEM.md            # 完整設計系統定義
├── prototype/                  # HTML 原型（視覺參考）
│   ├── index.html              # 首頁原型
│   └── article.html            # 文章頁原型
└── CLAUDE.md                   # 本文件
```

---

## Frontmatter 規格

每篇 Markdown 文章的 YAML frontmatter：

```yaml
---
title: "都蘭：太平洋岸最自由的部落"
slug: dulan
layer: [people, living, experience]     # 所屬地景層（可多層）
township: 東河鄉
coordinates: [22.8897, 121.2253]        # [lat, lng]
locale: zh-tw
voices:
  - type: academic
  - type: oral-history
  - type: field-note
  - type: youth-action
tags: [阿美族, 都蘭部落, 衝浪, 藝術家聚落]
season: all                              # all / spring / summer / autumn / winter
related:
  - /people/amis
  - /experience/surfing
sources:
  - title: "都蘭部落文史工作室"
    url: ""
audio:
  - file: dulan-elder-story.mp3
    speaker: "林阿公"
    language: amis
    duration: "4:32"
nttu: true                               # boolean，低調標記
author: ""
created: 2026-04-10
updated: 2026-04-10
---
```

---

## 12 個地景層

| ID | Icon | 中文 | English | 色碼 |
|----|------|------|---------|------|
| land | 🗺️ | 土地 | Land | #8B7355 |
| time | 🏛️ | 時間 | Time | #A0522D |
| people | 👥 | 人群 | People | #D4922A |
| knowledge | 🎓 | 知識 | Knowledge | #2B6CB0 |
| living | 🍚 | 生活 | Living | #7B8B6F |
| celebration | 🎭 | 慶典 | Celebration | #C53D3D |
| experience | 🏄 | 體驗 | Experience | #4A90B8 |
| youth | 🌱 | 青年 | Youth | #5BAD6F |
| design | 🎨 | 設計 | Design | #8B6FB0 |
| education | 📚 | 教育 | Education | #B08D57 |
| sustainability | 🌿 | 永續 | Sustainability | #3D7C47 |
| connection | 🚂 | 連結 | Connection | #6B7B8D |

---

## 5 種聲道

| Type | 中文 | 色碼 | 呈現風格 |
|------|------|------|----------|
| academic | 學術研究 | #1B5E7B (pacific) | 正式排版，附引用 |
| oral-history | 口述歷史 | #C8782A (sunrise) | 音檔播放器 + 逐字稿 |
| field-note | 田野筆記 | #3A6B42 (valley) | 第一人稱，日期戳，觀察框 |
| youth-action | 青年行動 | #5BAD6F | 行動卡片，青年觀點引言 |
| visitor | 旅人觀察 | #4A90B8 | 外部視角短篇 |

---

## 台東七族

在涉及原住民內容時，台東有七個原住民族群：

1. 阿美族（Amis）— 台東最大原住民族群，約 4 萬人
2. 排灣族（Paiwan）— 金峰、達仁、太麻里、大武
3. 布農族（Bunun）— 海端、延平，約 8,400 人
4. 卑南族（Puyuma）— 台東平原，約 6,500 人
5. 魯凱族（Rukai）— 卑南鄉東興村
6. 達悟族（Tao）— 蘭嶼，約 2,700 人
7. 噶瑪蘭族（Kavalan）— 長濱鄉，約 113 人，宜蘭南遷族群

---

## 開發注意事項

- **原型是視覺參考**：prototype/ 裡的 HTML 檔定義了版面結構和互動行為，實作時用 React + Tailwind 重寫，不要直接搬 HTML
- **內容平等**：不要在 UI 上建立任何看起來像「某某專區」的東西。所有文章在列表中平等出現
- **季節引擎**：首頁的「此刻的台東」根據 `new Date().getMonth()` 動態改變
- **漸進增強**：地圖頁用 `dynamic import` lazy load，搜尋用 Pagefind 不需要 server
- **音檔**：MVP 可以先放 placeholder，音檔格式為 mp3，放在 public/audio/
- **Accessibility**：所有互動元素要有 focus 樣式（太平洋藍外框），支援 prefers-reduced-motion

---

## 不要做的事

- ❌ 不要建「東大專區」或任何機構的特權區塊
- ❌ 不要在任何地方寫「著重更新」
- ❌ 不要把織紋圖騰用在非對應文化的區塊
- ❌ 不要混用不同族群的圖騰
- ❌ 不要用 AI 感的泛用設計（紫色漸層、Inter 字型、圓角卡片陰影堆疊）
- ❌ 不要做成 wiki 或知識庫的「樣子」——這是紀錄片風格的編輯式體驗

---

*文件版本：v1.0*
*產出日期：2026-04-09*
