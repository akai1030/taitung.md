# CLAUDE.md — Taitung.md 專案指引

> 這份文件供 Claude Code CLI 讀取，作為整個開發過程的持續參考。
> v1 備份在 CLAUDE.v1.md。本文件反映 v2 方向的根本性調整。

---

## ⚠️ 重大方向轉變

v1 把 Taitung.md 定位為「以地景層分類的互動知識庫」。
v2 徹底重新定位：**Taitung.md 是一個讓人感覺到台東的體驗，不是讓人查資料的系統。**

核心差異：

| v1（舊）| v2（新）|
|---------|---------|
| 12 個地景層分類頁面 | 地景層是後台標籤，不是前台導航 |
| 首頁是目錄 + 地圖預覽 | 首頁是 3D 球體 → 海洋沉浸 → 故事 |
| 文章頁有聲道 tab 切換 | 聲道是同一頁面上的對話式交織 |
| 投稿表單 | 每週提問 + 線索投遞 + 故事補充 |
| 地圖是獨立頁面 | 地圖融入體驗（不是首要入口） |
| 任何人可投稿任何內容 | 所有內容必須有真實來源，AI 不生成內容 |

---

## 專案概述

Taitung.md 是一座開源的台東知識庫。核心理念：**先感覺到，才開始讀。**

使用者打開網站的前五秒，應該感受到海、空氣、陽光——不是看到分類格子。然後被一篇故事吸引，進入多聲道的對話式閱讀。然後被一個問題打動，留下自己的回答。

**不是 wiki，不是部落格，不是資料庫。** 它是一個讓人走進台東的入口。

---

## 技術棧

- **框架**：Next.js 14 App Router + TypeScript
- **樣式**：Tailwind CSS（自訂色彩和字型見 DESIGN-SYSTEM.md）
- **內容**：MDX + YAML Frontmatter（gray-matter 解析）
- **3D**：Three.js（球體入場動畫）
- **地圖**：MapLibre GL（探索頁面，非首頁）
- **搜尋**：Pagefind（build-time 索引，支援中文）
- **i18n**：next-intl（zh-tw + en）
- **天氣 API**：中央氣象署 opendata.cwa.gov.tw（「此刻的台東」用真實天氣）
- **部署**：Zeabur

---

## 設計原則

1. **感官優先**：設計的出發點是「使用者能不能在 3 秒內感覺到海、空氣、和陽光」，不是「使用者能不能找到資訊」
2. **呼吸感**：大量留白，不規則的視覺節奏。不是所有區塊都等距等大
3. **紀錄片風格**：頁面是旅程，不是目錄。多種聲音交織，不是 tab 切換
4. **地方的溫度**：不冷冰冰的科技感，色彩和字型帶有土地的暖度
5. **文化敬意**：原住民織紋和圖騰不是裝飾品。只用在對應文化的區塊
6. **內容平等**：東大內容不設特權專區，所有文章在列表中平等出現
7. **真實至上**：每一句出現在網站上的話都必須有來源，詳見「內容紅線」章節

---

## 原型參考

`prototype/` 資料夾裡有完整的 HTML 原型，定義了視覺語言和互動行為。**實作時用 React + Tailwind 重寫，不要直接搬 HTML。**

| 檔案 | 內容 | 對應的 Next.js 頁面 |
|------|------|---------------------|
| `globe.html` | 3D 球體入場動畫（太空 → 大氣層 → 海平面） | 首次訪問的入場體驗 |
| `home.html` | 首頁（海洋英雄區 → 季節 → 故事 → 提問 → 參與 → 語錄） | `app/[locale]/page.tsx` |
| `story.html` | 文章頁（都蘭範例，四種聲道對話式排版） | `app/[locale]/story/[slug]/page.tsx` |
| `question.html` | 每週提問頁（問題 + 回答輸入 + 歷史回答 + 過去問題） | `app/[locale]/question/page.tsx` |
| `sound.html` | 聲音地圖頁（暗色系，聲音卡片 + 底部播放器） | `app/[locale]/sound/page.tsx` |
| `index.html` | **舊版首頁原型（v1），僅供視覺參考，不要照做結構** | — |
| `article.html` | **舊版文章原型（v1），僅供視覺參考，不要照做結構** | — |

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
--sunrise: #C8782A;       /* 季節、重點、口述歷史 */
--gold: #d4a44a;          /* CTA 按鈕、本週提問 */
```

---

## 字型

| 用途 | 字型 | 載入方式 |
|------|------|----------|
| 中文標題 | Noto Serif TC (200/300/400/600/700/900) | `next/font/google` |
| 中文內文 | Noto Sans TC (100/200/300/400/500/700) | `next/font/google` |
| 英文裝飾 | Cormorant Garamond (300/400/600/700/italic) | `next/font/google` |

注意 v2 比 v1 多用了更細的字重（200、300），用在大標題上製造輕盈感。

---

## 頁面結構與路由

### 使用者流程

```
首次訪問：
  球體入場（10秒，可 skip）→ 首頁

首頁滾動（這是一段旅程，不是目錄）：
  1. 海洋英雄區（大字「台東」+ 經緯度 + 「海風正從太平洋吹來」）
  2. 引言過渡（夏曼·藍波安的話，從海的色調過渡到陸地色）
  3. 此刻的台東（基於真實天氣 API + 當前季節的文字）
  4. 最近的故事（非對稱的雜誌式排版，不是等大卡片格線）
  5. 本週提問（黑底金字，一個問題 + 回答數 + CTA）
  6. 參與入口（回答提問、補充故事、投遞線索、拍照上傳）
  7. 語錄（台東作家的真實引言，來自 quotes.yaml）
  8. Footer

找到故事的方式（沒有一條路徑是「選分類 → 看列表」）：
  路徑 1：首頁滾動 → 被一篇故事吸引 → 點進去 → 透過相關故事繼續
  路徑 2：搜尋 → 直接找到
  路徑 3：本週提問 → 看別人的回答 → 被引到正式故事
  路徑 4：地圖探索 → zoom 到區域 → 點擊故事
```

### 路由

```
app/[locale]/
├── page.tsx                    # 首頁（海洋英雄 → 季節 → 故事 → 提問）
├── intro/page.tsx              # 球體入場動畫（Three.js）
├── story/
│   └── [slug]/page.tsx         # 文章頁（對話式多聲道）
├── question/
│   ├── page.tsx                # 本週提問 + 回答 + 歷史問題
│   └── [week]/page.tsx         # 過去某一週的問題
├── sound/page.tsx              # 聲音地圖（暗色系）
├── map/page.tsx                # 全螢幕地圖探索
├── search/page.tsx             # Pagefind 搜尋
├── about/page.tsx              # 關於 + 貢獻指南（合併，不再有獨立的 /contribute）
└── api/
    ├── articles/route.ts       # 文章列表 + 座標（JSON）
    ├── weather/route.ts        # 中央氣象署 API 轉接
    └── question/route.ts       # 本週提問相關
```

### 重要：被移除的路由

```
❌ /[layer]/page.tsx            — 不再有地景層列表頁
❌ /[layer]/[slug]/page.tsx     — 文章改用 /story/[slug]
❌ /contribute/page.tsx         — 合併進 /about，參與入口散佈在各頁面
❌ /nttu/                       — 不設東大專區
```

---

## 球體入場動畫規格

參考 `prototype/globe.html`，用 Three.js r128 實作。

### 四個階段（共 10 秒）

| 階段 | 時間 | 畫面 | 細節 |
|------|------|------|------|
| 太空 | 0-3s | 星空 + 地球緩慢旋轉 | 程式化地球（不載入圖片）；台東位置有金色脈動光點；底部顯示經緯度 |
| 靠近 | 3-6.5s | 地球轉向台灣，鏡頭 zoom in | 星星淡出；大氣層光暈變亮；「台東 / Taitung」大字浮現 |
| 大氣層 | 6.5-8.5s | 穿過大氣層 | 海洋色從底部漫上來；球體逐漸被海洋覆蓋 |
| 海面 | 8.5-10s | 完全過渡到海洋 | 顯示「海風正從太平洋的方向吹來」+ 「走進台東」按鈕 |

- 右上角有 skip 按鈕
- 底部有進度條
- 尊重 `prefers-reduced-motion`
- 用 cookie 記住已看過，下次直接進首頁
- 台東經緯度：22.7554°N, 121.1446°E（台東縣政府）

---

## 文章頁：對話式多聲道

參考 `prototype/story.html`。**不是 tab 切換，是同一頁面上的聲音交織。**

### 排版規則

四種聲道在同一頁面上依序出現，各有獨立的視覺語言：

| 聲道 | 色碼 | 排版特徵 |
|------|------|----------|
| 學術研究 `academic` | `#1B5E7B` (pacific) | 正式字體、附引用區塊、左側藍色圓點 |
| 口述歷史 `oral-history` | `#C8782A` (sunrise) | 左側橘色豎線、較大的宋體字、附音檔播放器 |
| 田野筆記 `field-note` | `#3A6B42` (valley) | 斜體、綠色左邊框背景區塊、附日期地點天氣 |
| 青年行動 `youth-action` | `#5BAD6F` | 正常字體、附行動卡片（計畫名稱 + 連結） |
| 旅人觀察 `visitor` | `#4A90B8` | 短篇形式 |

### 頁面結構

```
1. 英雄區（全寬色塊背景 + 標題 + 副標 + 地景層標籤 + 經緯度 + 聲道數）
2. 來源提示（「本文引述來自公開學術資料與田野訪談，完整來源見文末」）
3. 聲道區塊交替出現（學術 → 口述 → 田野 → 青年，每塊之間有細線分隔）
4. 中間可插入全寬圖片區（佔滿螢幕寬度，打破閱讀節奏）
5. 相關故事（2 欄格線）
6. 引用來源（完整列表，每條有編號）
7. Footer
```

---

## 每週提問系統

參考 `prototype/question.html`。這是社群參與的核心機制。

### 機制

- 每週一個問題，由編輯團隊設定
- 回答方式：打字（200 字以內）、錄音（選填）、附照片（選填）
- 可選匿名
- 所有回答即時可見
- 過去的提問可回溯瀏覽

### 資料模型

```yaml
# questions/week-14.yaml
week: 14
date_range: "2026-04-07 — 2026-04-13"
question: "你在台東最想念的聲音是什麼？"
response_count: 47
responses:
  - id: r001
    text: "知本溪夜晚的溪水聲..."
    author: "匿名"
    place: "台東市"
    timestamp: "2026-04-11T14:23:00+08:00"
    type: text          # text | audio | photo
    featured: false     # 是否被選為精選
```

### 技術方案（MVP）

MVP 階段不需要後端資料庫。用 GitHub Discussions 或 GitHub Issues 作為後端：
- 每週一個 Discussion 帖
- 前端透過 GitHub API 讀取/發表回答
- 或者用 Zeabur 提供的免費 PostgreSQL

---

## 12 個地景層（後台標籤，不是前台頁面）

| ID | Icon | 中文 | English | 色碼 | 角色 |
|----|------|------|---------|------|------|
| land | 🗺️ | 土地 | Land | #8B7355 | 後台標籤 |
| time | 🏛️ | 時間 | Time | #A0522D | 後台標籤 |
| people | 👥 | 人群 | People | #D4922A | 後台標籤 |
| knowledge | 🎓 | 知識 | Knowledge | #2B6CB0 | 後台標籤 |
| living | 🍚 | 生活 | Living | #7B8B6F | 後台標籤 |
| celebration | 🎭 | 慶典 | Celebration | #C53D3D | 後台標籤 |
| experience | 🏄 | 體驗 | Experience | #4A90B8 | 後台標籤 |
| youth | 🌱 | 青年 | Youth | #5BAD6F | 後台標籤 |
| design | 🎨 | 設計 | Design | #8B6FB0 | 後台標籤 |
| education | 📚 | 教育 | Education | #B08D57 | 後台標籤 |
| sustainability | 🌿 | 永續 | Sustainability | #3D7C47 | 後台標籤 |
| connection | 🚂 | 連結 | Connection | #6B7B8D | 後台標籤 |

前台不會有「12 個格子讓你選」。標籤出現在：
- 文章頁頂部（小圓點 + 文字）
- 文章底部（點擊標籤 → 顯示同標籤的其他故事）
- 地圖頁的圖層切換
- 搜尋篩選

---

## Frontmatter 規格（v2）

```yaml
---
title: "都蘭：太平洋岸最自由的部落"
slug: dulan
layer: [people, living, experience]
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
related:
  - dulan-surfing
  - amis-people

# v2 新增：內容來源標注（必填）
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

# v2 新增：AI 使用聲明（必填）
ai_generated: false
ai_assisted: []          # 例如：["翻譯初稿", "資料格式轉換"]

# v2 新增：內容狀態
status: seed             # seed | growing | mature | needs-update
last_verified: 2026-04-10

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

---

## 內容紅線：什麼絕對不能用 AI 生成

這是整個專案最重要的規則。**違反任何一條，網站的信任就歸零。**

### 🚫 絕對禁止 AI 生成

- **口述歷史 / 引言**：真人說的話，捏造等於偽造證詞
- **人物故事 / 描述**：描述真人經歷，錯一個細節就是不尊重
- **統計數據 / 數字**：假數據會被學術社群打臉
- **原住民文化描述**：族語翻譯、祭儀、文化意涵——錯了就是文化冒犯
- **地名 / 歷史事件 / 年代**：不確定就不要寫
- **引用來源 / 參考文獻**：不可捏造不存在的論文或書籍
- **照片描述 / 圖說**：不可虛構
- **田野筆記**：如果沒有人真的去過那個地方
- **音檔逐字稿**：如果沒有對應的音檔
- **社群回答 / 投稿**：不可捏造假的使用者回答

### ✅ AI 可以做的事

- 程式碼（前端、後端、資料處理腳本）
- 設計系統（色彩、字型、排版規則）
- UI/UX 原型和元件
- 爬取公開資料 + 格式轉換
- 內容品質檢查腳本
- 搜尋 + 推薦邏輯
- 翻譯初稿（需人工審核）
- 把真實資料整理成文章結構（需人工確認）

### 前端標注

每篇文章底部必須顯示：

```
📎 資料來源：[列出所有 sources]
🤖 AI 輔助：[列出 ai_assisted，如果是空的就不顯示]
```

---

## 真實資料來源（可程式化爬取）

這些是已確認存在的台東公開資料，可以寫腳本定期抓取作為內容骨架：

| 來源 | URL | 資料類型 | 用途 |
|------|-----|----------|------|
| data.gov.tw 台東觀光景點 | `data.gov.tw/dataset/7777` | JSON，含座標 | 景點基礎資訊 |
| data.gov.tw 台東活動 | `data.gov.tw/dataset/7778` | JSON | 活動資訊 |
| 中央氣象署 API | `opendata.cwa.gov.tw` | JSON API | 「此刻的台東」真實天氣 |
| 國家文化記憶庫 API | `memory.culture.tw` | JSON API | 歷史照片和文化資料 |
| 文化部文化資產 | `nchdb.boch.gov.tw` | 結構化查詢 | 古蹟、歷史建築 |
| 水利署 | `data.wra.gov.tw` | API | 河川水位、降雨 |
| OpenStreetMap | `osm.tw` | ODbL 授權 | 地圖底圖 |
| 台東縣統計年報 | `taitung.gov.tw/statistics` | PDF/CSV | 人口、產業數據 |

在 `scripts/` 下建立 `sync-open-data.ts`，build time 執行。

---

## 社群協作機制

### 參與方式優先順序（從低到高門檻）

1. **回答每週提問**（打字 < 200 字，不用帳號）
2. **補充現有故事**（在文章底部的結構化表單：事實補充 / 個人經歷 / 錯誤修正 / 提供照片）
3. **投遞線索**（地點 + 一兩句描述 + 為什麼值得記錄）
4. **上傳照片 + 一句圖說**
5. **寫一段個人經驗**（300-800 字短文）
6. **提交完整文章**
7. **GitHub PR**（技術貢獻者）

### 不再有獨立的 /contribute 頁面

參與入口散佈在各個頁面裡：
- 首頁有「參與入口」橫向滾動區
- 每篇故事底部有「你知道更多嗎？」
- 本週提問頁本身就是參與
- 聲音地圖頁底部有「上傳聲音」

---

## 台東七族

涉及原住民內容時必須準確：

1. **阿美族**（Amis）— 台東最大原住民族群，約 4 萬人
2. **排灣族**（Paiwan）— 金峰、達仁、太麻里、大武
3. **布農族**（Bunun）— 海端、延平，約 8,400 人
4. **卑南族**（Puyuma）— 台東平原，約 6,500 人
5. **魯凱族**（Rukai）— 卑南鄉東興村
6. **達悟族**（Tao）— 蘭嶼，約 2,700 人
7. **噶瑪蘭族**（Kavalan）— 長濱鄉，約 113 人，宜蘭南遷族群

---

## 目錄結構

```
taitung-md/
├── content/                    # Markdown 文章（依主題，非依地景層分資料夾）
│   ├── dulan.md                # 每篇文章一個 slug
│   ├── green-island.md
│   ├── chishang-rice.md
│   ├── amis.md
│   ├── return-home.md
│   └── ...
├── questions/                  # 每週提問（YAML）
│   ├── week-14.yaml
│   └── ...
├── data/                       # 爬取的公開資料（JSON）
│   ├── attractions.json        # from data.gov.tw
│   ├── weather-cache.json      # from 氣象署
│   └── cultural-assets.json    # from 文化部
├── src/
│   ├── app/[locale]/
│   │   ├── page.tsx            # 首頁
│   │   ├── intro/page.tsx      # 球體入場
│   │   ├── story/[slug]/page.tsx
│   │   ├── question/page.tsx
│   │   ├── sound/page.tsx
│   │   ├── map/page.tsx
│   │   ├── search/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── GlobeIntro.tsx      # Three.js 球體
│   │   ├── OceanHero.tsx       # 首頁海洋英雄區
│   │   ├── SeasonMoment.tsx    # 此刻的台東（接天氣 API）
│   │   ├── StoryCard.tsx       # 故事卡片（非對稱排版）
│   │   ├── VoiceBlock.tsx      # 聲道區塊（學術/口述/田野/青年）
│   │   ├── AudioPlayer.tsx     # 口述歷史播放器
│   │   ├── WeeklyQuestion.tsx  # 每週提問元件
│   │   ├── QuoteDisplay.tsx    # 語錄顯示
│   │   ├── NavFloat.tsx        # 浮動導航列
│   │   ├── Footer.tsx
│   │   └── ScrollReveal.tsx    # Intersection Observer 動畫
│   ├── lib/
│   │   ├── content.ts          # Markdown 解析 + 文章查詢
│   │   ├── types.ts            # TypeScript 型別
│   │   ├── layers.ts           # 12 地景層定義（純資料）
│   │   ├── season.ts           # 季節引擎
│   │   ├── weather.ts          # 氣象署 API 串接
│   │   ├── quotes.ts           # 語錄載入（from quotes.yaml）
│   │   └── i18n.ts
│   └── styles/globals.css
├── scripts/
│   ├── sync-open-data.ts       # 爬取公開資料
│   ├── check-content.ts        # 內容品質檢查
│   └── validate-sources.ts     # 驗證引用來源是否存活
├── public/
│   ├── llms.txt
│   ├── robots.txt
│   └── audio/
├── prototype/                  # HTML 原型（視覺參考，不要直接搬）
│   ├── globe.html
│   ├── home.html
│   ├── story.html
│   ├── question.html
│   └── sound.html
├── messages/
│   ├── zh-tw.json
│   └── en.json
├── CLAUDE.md                   # 本文件
├── ARCHITECTURE.md
├── DESIGN-SYSTEM.md
├── CONTENT-STRATEGY.md         # 內容來源 + AI 紅線 + 社群機制
├── RETHINK.md                  # 方向重新構想的完整思考過程
└── quotes.yaml                 # 台東文學語錄資料庫（真實引言）
```

---

## 開發注意事項

- **原型是視覺參考**：prototype/ 裡的 HTML 檔定義了版面結構和互動行為，實作時用 React + Tailwind 重寫
- **內容平等**：不要在 UI 上建立任何看起來像「某某專區」的東西
- **季節引擎**：「此刻的台東」優先接中央氣象署 API 真實天氣，fallback 到 `new Date().getMonth()` 的季節預設文字
- **漸進增強**：球體動畫用 `dynamic import` lazy load；不支援 WebGL 的裝置直接 skip 到首頁
- **音檔**：MVP 先放 placeholder，音檔格式為 mp3，放在 public/audio/
- **Accessibility**：所有互動元素有 focus 樣式（太平洋藍外框），支援 prefers-reduced-motion
- **球體記憶**：用 cookie 記住使用者已看過球體動畫，下次直接進首頁

---

## 不要做的事

- ❌ 不要建地景層分類列表頁（/land、/people 等頁面不需要）
- ❌ 不要建「東大專區」或任何機構的特權區塊
- ❌ 不要把聲道做成 tab 切換——做成同一頁面上的對話式交織
- ❌ 不要用等大等距的卡片格線——用非對稱的雜誌式排版
- ❌ 不要把織紋圖騰用在非對應文化的區塊
- ❌ 不要用 AI 感的泛用設計（紫色漸層、Inter 字型、圓角卡片陰影堆疊）
- ❌ 不要生成假的內容、假的數據、假的引言、假的社群回答
- ❌ 不要做成 wiki 或知識庫的「樣子」

---

## 經緯度

全站統一使用台東縣政府的經緯度作為代表座標：
**22.7554°N, 121.1446°E**

---

*文件版本：v2.0*
*產出日期：2026-04-11*
*方向：感官體驗 × 內容真實 × 社群參與*
