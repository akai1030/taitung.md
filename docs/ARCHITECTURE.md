# Taitung.md 技術架構文件 v2

> 一座開源的台東知識庫。先感覺到，才開始讀。

---

## 一、核心理念

v2 的 Taitung.md 不再是「一張會呼吸的台東地圖」。它是**一段讓人走進台東的旅程**。

使用者打開網站的前五秒，應該感受到海、空氣、陽光——不是看到分類格子。然後被一篇故事吸引，進入多聲道的對話式閱讀。然後被一個問題打動，留下自己的回答。

四個設計原則：

1. **感官優先**：先讓使用者「感覺到」台東，資訊其次
2. **多聲道**：學術、口述、田野、青年行動——不是 tab 切換，是同一頁面上的對話交織
3. **活的內容**：季節、天氣、每週提問讓網站持續變動
4. **真實至上**：每一句話都有來源，AI 不生成內容

---

## 二、技術選型

### 核心框架

| 層級 | 選擇 | 理由 |
|------|------|------|
| **框架** | Next.js 14 App Router + TypeScript | SSG 預渲染效能好，App Router 支援 RSC，streaming 適合入場動畫等重互動頁面 |
| **樣式** | Tailwind CSS | 快速迭代，utility-first 適合元件化開發 |
| **內容格式** | Markdown + MDX + YAML Frontmatter | Git 友善、AI 可讀，MDX 支援嵌入互動元件 |
| **3D 入場** | Three.js r128 | 球體入場動畫，程式化地球（不載入貼圖），dynamic import lazy load |
| **地圖引擎** | MapLibre GL | 開源向量瓦片、3D 地形，用在 /map 探索頁（不是首頁） |
| **搜尋** | Pagefind | 零伺服器成本，build time 索引，支援中文 |
| **i18n** | next-intl | 多語系路由，保留原住民語擴充空間 |
| **天氣** | 中央氣象署 opendata.cwa.gov.tw | 「此刻的台東」使用真實天氣資料 |
| **音訊** | 原生 HTML5 Audio | 口述歷史、聲音地圖播放 |

### 部署

| 項目 | 選擇 | 理由 |
|------|------|------|
| **託管** | Zeabur | 台灣團隊，部署快，支援 Next.js |
| **域名** | `taitung.md`（首選） | 簡潔，.md 呼應 Markdown 精神 |
| **CI/CD** | GitHub Actions | 自動建置、內容檢查、部署 |
| **資料庫** | MVP 無需，後續視需求加 PostgreSQL | 內容由 Markdown 驅動，每週提問 MVP 用 GitHub Discussions |

---

## 三、頁面架構

### 3.1 使用者流程

```
首次訪問：
  球體入場（10 秒，可 skip）→ 首頁

首頁（一段旅程，不是目錄）：
  1. 海洋英雄區 — 大字「台東」+ 經緯度 22.7554°N, 121.1446°E + 「海風正從太平洋吹來」
  2. 引言過渡 — 台東文學家的真實引言（from quotes.yaml），從海的色調過渡到陸地色
  3. 此刻的台東 — 真實天氣 API + 當前季節推薦
  4. 最近的故事 — 非對稱雜誌式排版（不是等大卡片格線）
  5. 本週提問 — 黑底金字，一個問題 + 回答數 + CTA
  6. 參與入口 — 回答提問 / 補充故事 / 投遞線索 / 拍照上傳
  7. 語錄 — 台東作家真實引言
  8. Footer

找到故事的四條路徑（沒有「選分類 → 看列表」）：
  路徑 1：首頁滾動 → 被故事吸引 → 點進去 → 相關故事繼續
  路徑 2：搜尋 → 直接找到
  路徑 3：本週提問 → 看回答 → 被引到正式故事
  路徑 4：地圖探索 → zoom 到區域 → 點擊故事
```

### 3.2 路由結構

```
app/[locale]/
├── page.tsx                    # 首頁（海洋英雄 → 季節 → 故事 → 提問）
├── intro/page.tsx              # 球體入場動畫（Three.js，dynamic import）
├── story/
│   └── [slug]/page.tsx         # 文章頁（對話式多聲道，不是 tab 切換）
├── question/
│   ├── page.tsx                # 本週提問 + 回答 + 歷史問題
│   └── [week]/page.tsx         # 過去某一週的問題
├── sound/page.tsx              # 聲音地圖（暗色系，聲音卡片 + 播放器）
├── map/page.tsx                # 全螢幕地圖探索（MapLibre GL）
├── search/page.tsx             # Pagefind 搜尋
└── about/page.tsx              # 關於 + 貢獻指南（合併，不再有獨立的 /contribute）

api/
├── articles/route.ts           # 文章列表 + 座標（JSON）
├── weather/route.ts            # 中央氣象署 API 轉接
└── question/route.ts           # 本週提問相關
```

### 3.3 被移除的路由（v1 → v2）

```
❌ /[layer]/page.tsx            — 不再有地景層列表頁
❌ /[layer]/[slug]/page.tsx     — 文章改用 /story/[slug]
❌ /contribute/page.tsx         — 合併進 /about，參與入口散佈在各頁面
❌ /nttu/                       — 不設東大專區
```

---

## 四、元件架構

### 4.1 核心元件

```
src/components/
├── GlobeIntro.tsx          # Three.js 球體入場動畫（4 階段 × 10 秒）
├── OceanHero.tsx           # 首頁海洋英雄區（CSS 波浪、parallax、經緯度）
├── SeasonMoment.tsx        # 「此刻的台東」（天氣 API + 季節邏輯）
├── StoryCard.tsx           # 故事卡片（非對稱排版，hover 效果）
├── VoiceBlock.tsx          # 聲道區塊（根據 type 切換視覺語言）
├── AudioPlayer.tsx         # 口述歷史播放器（波形 UI，inline 在聲道區塊中）
├── WeeklyQuestion.tsx      # 每週提問元件（問題 + 輸入 + 回答列表）
├── QuoteDisplay.tsx        # 語錄顯示（台東文學家真實引言）
├── NavFloat.tsx            # 浮動導航列（透明 → 實心 on scroll）
├── Footer.tsx              # 頁尾（經緯度、版權、連結）
├── ScrollReveal.tsx        # Intersection Observer 動畫容器
├── SoundCard.tsx           # 聲音卡片（暗色系，hover 動態波形）
└── LayerTag.tsx            # 地景層標籤（小圓點 + 文字，用在文章頁）
```

### 4.2 VoiceBlock 視覺語言

VoiceBlock 是文章頁的核心元件。同一篇文章中，不同聲道的區塊**交替出現在同一頁面上**，每種有獨立的視覺語言：

| 聲道 | type prop | 色碼 | 排版特徵 |
|------|-----------|------|----------|
| 學術研究 | `academic` | `#1B5E7B` (pacific) | 正式字體、引用區塊、左側藍色圓點 |
| 口述歷史 | `oral-history` | `#C8782A` (sunrise) | 左側橘色豎線、較大宋體字、inline 音檔播放器 |
| 田野筆記 | `field-note` | `#3A6B42` (valley) | 斜體、綠色背景區塊、附日期地點天氣 |
| 青年行動 | `youth-action` | `#5BAD6F` | 正常字體、行動卡片（計畫名稱 + 連結） |
| 旅人觀察 | `visitor` | `#4A90B8` | 短篇形式 |

### 4.3 球體入場動畫（GlobeIntro）

參考 `prototype/globe.html`，用 Three.js r128 實作。

四個階段（共 10 秒）：

| 階段 | 時間 | 畫面 | 技術細節 |
|------|------|------|----------|
| 太空 | 0-3s | 星空 + 地球緩慢旋轉 | 程式化地球（Canvas 繪製紋理，不載入圖片）；台東金色脈動光點；底部經緯度 |
| 靠近 | 3-6.5s | 地球轉向台灣，鏡頭 zoom in | 星星淡出；大氣層 shader 光暈變亮；「台東 / Taitung」浮現 |
| 大氣層 | 6.5-8.5s | 穿過大氣層 | 海洋色從底部漫上來；球體逐漸被海洋覆蓋 |
| 海面 | 8.5-10s | 完全過渡到海洋 | 「海風正從太平洋的方向吹來」+ 「走進台東」按鈕 |

技術要求：
- `dynamic import` lazy load，不影響首頁載入速度
- 不支援 WebGL 的裝置直接 skip 到首頁
- 右上角 skip 按鈕、底部進度條
- 尊重 `prefers-reduced-motion`
- Cookie 記住已看過，下次直接進首頁
- 台東經緯度：22.7554°N, 121.1446°E（台東縣政府）

---

## 五、內容架構

### 5.1 文章存放

v2 不再按地景層分資料夾。每篇文章以 slug 命名，平放在 `content/` 下：

```
content/
├── dulan.md
├── green-island.md
├── chishang-rice.md
├── amis.md
├── return-home.md
├── surfing.md
├── peinan-site.md
└── ...
```

地景層是 frontmatter 中的 `layer` 欄位（陣列），用於後台篩選、地圖圖層切換、搜尋篩選。前台不會出現「12 個格子讓你選分類」。

### 5.2 每週提問

```
questions/
├── week-14.yaml
├── week-15.yaml
└── ...
```

每個 YAML 包含 week、date_range、question、responses 陣列。MVP 階段可搭配 GitHub Discussions 作為回答後端。

### 5.3 公開資料快取

```
data/
├── attractions.json        # from data.gov.tw（台東觀光景點，含座標）
├── weather-cache.json      # from 中央氣象署 API
├── cultural-assets.json    # from 文化部文化資產
└── events.json             # from data.gov.tw（台東活動）
```

由 `scripts/sync-open-data.ts` 在 build time 執行，定期更新。

### 5.4 Frontmatter 規格

```yaml
---
title: "都蘭：太平洋岸最自由的部落"
slug: dulan
layer: [people, living, experience]     # 後台標籤（可多層）
township: 東河鄉
coordinates: [22.8897, 121.2253]
locale: zh-tw
voices:
  - type: academic
  - type: oral-history
  - type: field-note
  - type: youth-action
tags: [阿美族, 都蘭部落, 衝浪, 藝術家聚落]
season: all

# 內容來源標注（必填）
source_type: [public-data, community, academic]
sources:
  - type: academic
    citation: "劉益昌等，《東海岸阿美族聚落空間研究》，中研院民族所，2018"
  - type: government-opendata
    name: "東管處海岸環境監測年報"
    url: "https://www.eastcoast-nsa.gov.tw"
    accessed: 2026-04-10
  - type: community-contribution
    author: "林清源"
    verified: true

# AI 使用聲明（必填）
ai_generated: false
ai_assisted: []

# 內容狀態
status: seed                 # seed | growing | mature | needs-update
last_verified: 2026-04-10

related:
  - dulan-surfing
  - amis-people
audio:
  - file: dulan-elder-story.mp3
    speaker: "林清源"
    language: amis
    duration: "4:32"
    source: "台東大學南島文化研究中心"
nttu: true
author: ""
created: 2026-04-10
updated: 2026-04-10
---
```

### 5.5 12 個地景層定義（後台標籤）

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

標籤出現在：文章頁頂部（小圓點 + 文字）、文章底部（點擊 → 同標籤故事）、地圖頁圖層切換、搜尋篩選。

---

## 六、外部資料整合

### 6.1 公開資料來源

| 來源 | URL | 資料類型 | 用途 |
|------|-----|----------|------|
| data.gov.tw 台東觀光景點 | `data.gov.tw/dataset/7777` | JSON，含座標 | 景點基礎資訊 |
| data.gov.tw 台東活動 | `data.gov.tw/dataset/7778` | JSON | 活動行事曆 |
| 中央氣象署 API | `opendata.cwa.gov.tw` | JSON API | 「此刻的台東」真實天氣 |
| 國家文化記憶庫 API | `memory.culture.tw` | JSON API | 歷史照片和文化資料 |
| 文化部文化資產 | `nchdb.boch.gov.tw` | 結構化查詢 | 古蹟、歷史建築 |
| 水利署 | `data.wra.gov.tw` | API | 河川水位、降雨 |
| OpenStreetMap | `osm.tw` | ODbL 授權 | 地圖底圖 |
| 台東縣統計年報 | `taitung.gov.tw/statistics` | PDF/CSV | 人口、產業數據 |

### 6.2 資料同步腳本

```
scripts/
├── sync-open-data.ts       # build time 執行，爬取上述資料源
├── check-content.ts        # 內容品質檢查（frontmatter 完整性、座標驗證、來源檢查）
└── validate-sources.ts     # 驗證引用來源連結是否存活
```

---

## 七、季節引擎

台東四季都有不同面貌，「此刻的台東」區塊動態反映：

```
1-3 月：洛神花加工季、春節部落巡禮、鯨豚季開始
4-6 月：飛魚季（蘭嶼）、螢火蟲季、金針花初開
7-9 月：熱氣球嘉年華、衝浪旺季、豐年祭、池上秋收
10-12 月：釋迦產季、候鳥季、溫泉季
```

實作：
- 優先接中央氣象署 API 取得真實天氣（溫度、天氣狀態、日出日落）
- Fallback 到 `new Date().getMonth()` 的季節預設文字
- 文章 frontmatter 的 `season` 欄位用於當季推薦

---

## 八、社群參與機制

### 8.1 核心：每週提問

每週一個問題，由編輯團隊設定。這是降低參與門檻的關鍵設計。

回答方式：打字（200 字以內）、錄音（選填）、附照片（選填）、可選匿名。所有回答即時可見，過去的提問可回溯。

MVP 技術方案：GitHub Discussions 作為後端，前端透過 GitHub API 讀寫。或 Zeabur 免費 PostgreSQL。

### 8.2 參與方式（從低到高門檻）

1. 回答每週提問（< 200 字，不用帳號）
2. 補充現有故事（文章底部結構化表單）
3. 投遞線索（地點 + 一兩句描述）
4. 上傳照片 + 圖說
5. 寫一段個人經驗（300-800 字）
6. 提交完整文章
7. GitHub PR

### 8.3 參與入口分佈

不再有獨立的 /contribute 頁面。入口散佈在各頁面：
- 首頁「參與入口」橫向滾動區
- 每篇故事底部「你知道更多嗎？」
- 本週提問頁本身就是參與
- 聲音地圖底部「上傳聲音」

---

## 九、品質系統

### 9.1 內容紅線

詳見 CONTENT-STRATEGY.md。核心規則：**AI 不生成任何實質內容。**

AI 絕對禁止生成：口述歷史/引言、人物故事、統計數據、原住民文化描述、地名/歷史事件/年代、引用來源/參考文獻、照片描述、田野筆記、音檔逐字稿、社群回答。

AI 可以做：程式碼、設計系統、UI 原型、爬取資料 + 格式轉換、品質檢查腳本、翻譯初稿（需審核）。

### 9.2 內容檢查（CI 自動執行）

| 檢查項目 | 說明 |
|----------|------|
| Frontmatter 完整性 | 必填欄位齊全（title、layer、township、coordinates、source_type、sources、ai_generated） |
| 座標驗證 | coordinates 落在台東縣範圍內 |
| 來源引用 | 每篇至少一個 source |
| 族語拼寫 | 原住民族名、部落名使用官方羅馬拼音 |
| 鄉鎮對應 | township 為台東 16 鄉鎮市之一 |
| AI 聲明 | ai_generated 必須為 false（MVP 階段不收錄 AI 生成文章） |
| 交叉引用 | related 連結有效 |
| 音檔檢查 | audio 欄位的檔案存在、格式正確 |
| 連結存活 | 外部連結可存取 |

### 9.3 CI/CD Pipeline

```yaml
on: [push, pull_request]

jobs:
  check:
    - lint-markdown
    - validate-frontmatter
    - verify-coordinates
    - check-indigenous-terms
    - check-sources
    - check-audio-files
    - verify-ai-declaration
    - build-test

  deploy:
    needs: check
    - deploy-to-zeabur
    - rebuild-search-index (Pagefind)
    - sync-open-data
```

---

## 十、完整檔案結構

```
taitung-md/
├── .github/workflows/          # CI/CD
├── content/                    # Markdown 文章（平放，slug 命名）
│   ├── dulan.md
│   ├── green-island.md
│   ├── chishang-rice.md
│   ├── amis.md
│   ├── return-home.md
│   ├── surfing.md
│   └── ...
├── questions/                  # 每週提問（YAML）
│   ├── week-14.yaml
│   └── ...
├── data/                       # 爬取的公開資料快取（JSON）
│   ├── attractions.json
│   ├── weather-cache.json
│   ├── cultural-assets.json
│   └── events.json
├── src/
│   ├── app/[locale]/
│   │   ├── page.tsx            # 首頁
│   │   ├── intro/page.tsx      # 球體入場（Three.js）
│   │   ├── story/[slug]/page.tsx
│   │   ├── question/page.tsx
│   │   ├── question/[week]/page.tsx
│   │   ├── sound/page.tsx
│   │   ├── map/page.tsx
│   │   ├── search/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── GlobeIntro.tsx
│   │   ├── OceanHero.tsx
│   │   ├── SeasonMoment.tsx
│   │   ├── StoryCard.tsx
│   │   ├── VoiceBlock.tsx
│   │   ├── AudioPlayer.tsx
│   │   ├── WeeklyQuestion.tsx
│   │   ├── QuoteDisplay.tsx
│   │   ├── NavFloat.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── SoundCard.tsx
│   │   └── LayerTag.tsx
│   ├── lib/
│   │   ├── content.ts          # Markdown 解析 + 文章查詢
│   │   ├── types.ts
│   │   ├── layers.ts           # 12 地景層定義（純資料）
│   │   ├── season.ts           # 季節引擎
│   │   ├── weather.ts          # 中央氣象署 API
│   │   ├── quotes.ts           # 語錄載入
│   │   └── i18n.ts
│   └── styles/globals.css
├── scripts/
│   ├── sync-open-data.ts
│   ├── check-content.ts
│   └── validate-sources.ts
├── public/
│   ├── llms.txt
│   ├── robots.txt
│   └── audio/
├── prototype/                  # HTML 原型（視覺參考，React + Tailwind 重寫）
│   ├── globe.html              # 球體入場
│   ├── home.html               # 首頁
│   ├── story.html              # 文章頁
│   ├── question.html           # 每週提問
│   └── sound.html              # 聲音地圖
├── messages/
│   ├── zh-tw.json
│   └── en.json
├── quotes.yaml                 # 台東文學語錄（真實引言）
├── CLAUDE.md                   # Claude Code 專案指引（主文件）
├── ARCHITECTURE.md             # 本文件
├── DESIGN-SYSTEM.md            # 色彩、字型、間距等設計規範
├── CONTENT-STRATEGY.md         # 內容來源策略 + AI 紅線 + 社群機制
├── RETHINK.md                  # v1 → v2 方向轉變的完整思考過程
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 十一、AI 入口

### `/llms.txt`

```
# Taitung.md

> An open-source knowledge base about Taitung, the most culturally diverse
> county in Taiwan. Built as a sensory documentary experience — not a wiki.

## Content philosophy
Every piece of content has a verified source. AI generates zero content —
only infrastructure, code, and data processing. Oral histories, cultural
descriptions, and statistics are all human-verified.

## 7 indigenous peoples
Amis, Paiwan, Bunun, Puyuma, Rukai, Tao (Yami), Kavalan

## Content structure
Articles tagged with "landscape layers" (Land, Time, People, Knowledge,
Living, Celebration, Experience, Youth, Design, Education, Sustainability,
Connection). Layers are backend tags, not navigation pages.

## Multi-voice system
Each article weaves multiple voices: academic research, oral history,
field notes, youth action records, visitor observations.

## Endpoints
- /api/articles — Full article index with coordinates (JSON)
- /api/weather — Current Taitung weather (proxied from CWA)
- /zh-tw/ — Traditional Chinese
- /en/ — English
```

### `/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://taitung.md/sitemap.xml
```

---

*文件版本：v2.0*
*產出日期：2026-04-11*
*方向：感官體驗 × 內容真實 × 社群參與*
