# Claude Code 啟動 Prompt

> 把以下內容貼進 Claude Code。建議分階段執行，每個階段完成後確認再繼續。

---

## Prompt 1：讀文件 + 理解現狀

```
讀完以下文件，然後告訴我你的理解：

1. CLAUDE.md（主指引，最重要）
2. ARCHITECTURE.md（技術架構）
3. DESIGN-SYSTEM.md（設計系統）
4. CONTENT-STRATEGY.md（內容策略）
5. RETHINK.md（v1→v2 的思考過程，理解「為什麼」要改）

然後看一下現有的 Next.js 專案（在 taitung-md/ 資料夾），告訴我：
- 現在已經有哪些頁面和元件
- 哪些是 v1 的東西需要拆掉或重寫
- 哪些可以保留或改造

不要開始寫 code，先給我一份現狀分析。
```

---

## Prompt 2：Phase 1 — 首頁重建

```
開始 Phase 1：重建首頁。

參考 prototype/home.html 的視覺語言和排版結構，用 React + Tailwind 實作。
不要直接搬 HTML，要用 Next.js 14 App Router 的方式重寫。

首頁是一段旅程，從上到下依序是：

1. **海洋英雄區（OceanHero）**
   - 全屏高度，cream 背景
   - 大字「台東」（Noto Serif TC, 200 字重，極大）+ 英文「Taitung」（Cormorant Garamond, 300 italic）
   - 經緯度 22.7554°N, 121.1446°E
   - 「海風正從太平洋的方向吹來」
   - CSS 波浪動畫在底部
   - 滾動時有 parallax 效果

2. **引言過渡（QuoteDisplay）**
   - 台東文學家的真實引言（從 quotes.yaml 讀取）
   - 背景從海的色調漸變到陸地的 sand 色

3. **此刻的台東（SeasonMoment）**
   - 先用 new Date().getMonth() 做季節 fallback
   - 天氣 API 之後再接

4. **最近的故事（StoryCard 列表）**
   - 非對稱雜誌式排版，不是等大卡片格線
   - 從 content/ 資料夾讀 markdown frontmatter

5. **本週提問（WeeklyQuestion）**
   - 黑底金字（--ink 背景，--gold 文字）
   - 一個問題 + 回答數 + CTA 按鈕

6. **參與入口**
   - 橫向滾動的參與方式卡片

7. **語錄**
   - 從 quotes.yaml 隨機一句

8. **Footer**
   - 經緯度、版權

色彩用 CLAUDE.md 裡定義的：cream (#FAF8F3) 為主背景，ink (#1E1D1A) 主文字，pacific (#1B5E7B) 互動色，gold (#d4a44a) CTA。

字型：Noto Serif TC 做標題，Noto Sans TC 做內文，Cormorant Garamond 做英文裝飾。用 next/font/google 載入。

NavFloat 導航列：透明背景，滾動後變實心。項目只有：故事、提問、聲音、地圖、搜尋。

要有 ScrollReveal 效果（Intersection Observer），元素滾動進入時淡入上移。

重要：
- 不要用等大等距的卡片格線
- 不要用 AI 感的泛用設計（紫色漸層、Inter 字型、圓角卡片陰影堆疊）
- 大量留白，不規則的視覺節奏
- 看 prototype/home.html 理解視覺方向
```

---

## Prompt 3：Phase 2 — 文章頁（對話式多聲道）

```
開始 Phase 2：建文章頁 /story/[slug]。

參考 prototype/story.html，這是最重要的頁面之一。

核心概念：聲道不是 tab 切換，是同一頁面上的對話式交織。

建立 VoiceBlock 元件，根據 type prop 顯示不同視覺語言：

- academic（學術研究）：pacific 藍 #1B5E7B，左側藍色圓點，正式字體，引用區塊
- oral-history（口述歷史）：sunrise 橘 #C8782A，左側橘色豎線，較大的 Noto Serif TC，inline AudioPlayer
- field-note（田野筆記）：valley 綠 #3A6B42，綠色背景區塊，斜體，附日期地點天氣 metadata
- youth-action（青年行動）：#5BAD6F，正常字體，行動卡片（計畫名稱 + 連結）

頁面結構：
1. 英雄區（全寬色塊背景 + 標題 + 副標 + 地景層 LayerTag + 經緯度 + 聲道數量）
2. 來源提示橫幅
3. VoiceBlock 交替出現，之間有細線分隔
4. 全寬圖片區（打破閱讀節奏）
5. 相關故事（2 欄）
6. 引用來源列表
7. 「你知道更多嗎？」參與 CTA
8. Footer

用現有的 content/ 資料夾裡的 markdown 檔案測試。
路由從 /[layer]/[slug] 改為 /story/[slug]。
舊的 [layer] 路由可以刪掉。

記得文章底部要顯示：
📎 資料來源：[列出 frontmatter 的 sources]
🤖 AI 輔助：[列出 ai_assisted，空的就不顯示]
```

---

## Prompt 4：Phase 3 — 球體入場動畫

```
開始 Phase 3：球體入場動畫 /intro。

參考 prototype/globe.html，用 Three.js 實作。

重要：用 dynamic import lazy load，不要影響首頁載入速度。
不支援 WebGL 的裝置直接 redirect 到首頁。

四個階段（共 10 秒）：

1. 太空（0-3s）：
   - 星空背景（獨立 canvas 或 points geometry）
   - 程式化地球（用 Canvas 2D 繪製紋理貼到球體上，不載入圖片）
   - 地球緩慢旋轉
   - 台東位置（22.7554°N, 121.1446°E）有金色脈動光點
   - 底部顯示經緯度文字

2. 靠近（3-6.5s）：
   - 地球旋轉讓台灣面向鏡頭
   - 鏡頭 zoom in
   - 星星淡出
   - 大氣層光暈 shader 變亮
   - 「台東 / Taitung」大字浮現

3. 大氣層（6.5-8.5s）：
   - 穿過大氣層的感覺
   - 海洋色（pacific #1B5E7B）從底部漫上來
   - 球體逐漸被海洋色覆蓋

4. 海面（8.5-10s）：
   - 完全過渡到海洋／cream 背景
   - 顯示「海風正從太平洋的方向吹來」
   - 「走進台東」按鈕（點擊 → 跳轉首頁）

UI 元素：
- 右上角 skip 按鈕（整個動畫期間可見）
- 底部細長進度條
- 尊重 prefers-reduced-motion（直接 skip）
- 用 cookie 記住已看過，下次直接進首頁

參考 prototype/globe.html 裡的 latLngToVec3 函式和 easing 函式。
```

---

## Prompt 5：Phase 4 — 每週提問 + 聲音地圖

```
開始 Phase 4：每週提問頁和聲音地圖頁。

### 每週提問 /question

參考 prototype/question.html。

- 頂部：本週問題（大字，黑底金字風格）+ 日期範圍 + 回答數
- 中間：回答輸入區（textarea 200 字限制 + 錄音按鈕 + 照片上傳 + 匿名切換）
- 下方：已有回答列表（作者/匿名 + 地點 + 時間 + 內容）
- 底部：過去的問題（折疊式列表，點擊展開）

MVP 資料來源：從 questions/ 資料夾讀 YAML 檔案。
回答的寫入功能可以先做 UI，後端之後再接。

### 聲音地圖 /sound

參考 prototype/sound.html。

- 暗色系頁面（ink #1E1D1A 背景）
- 聲音卡片格線（地點名 + 聲音描述 + 時長 + 動態波形條）
- Hover 時波形條動起來
- 點擊播放，底部出現 now-playing bar
- 底部「上傳你錄到的台東聲音」CTA

MVP 先用 placeholder 資料和 public/audio/ 裡的檔案。
```

---

## Prompt 6：Phase 5 — 收尾

```
Phase 5 收尾：

1. 地圖頁 /map：MapLibre GL 全螢幕地圖，從文章 frontmatter 的 coordinates 讀取標記點。點擊標記 → 展開故事卡片。地景層可作為圖層切換。

2. 搜尋頁 /search：整合 Pagefind（build-time 索引），支援中文搜尋。

3. 關於頁 /about：靜態頁面，包含專案介紹 + 貢獻指南（取代舊的 /contribute）。

4. i18n：用 next-intl 設定 zh-tw 和 en 兩個 locale。zh-tw 為預設。

5. 清理：
   - 刪除所有 v1 的舊路由（/[layer]/*、/contribute、/nttu）
   - 刪除不再需要的元件（VoiceSwitcher tab 切換版、舊的 LayerToggle）
   - 確認 tailwind.config.ts 有定義所有自訂色彩

6. SEO：
   - 每頁有正確的 metadata
   - /llms.txt 和 /robots.txt 放在 public/

7. 跑一次 build 確認沒有錯誤。
```

---

## 注意事項（每個 Phase 都適用）

```
通用注意事項，每個階段都請遵守：

1. 看 prototype/ 裡的 HTML 原型理解視覺方向，但用 React + Tailwind 重寫，不要直接搬 HTML
2. 色彩系統用 CLAUDE.md 定義的 CSS 變數
3. 字型：Noto Serif TC（標題）、Noto Sans TC（內文）、Cormorant Garamond（英文裝飾），用 next/font/google
4. 不要生成假的內容——文章用 content/ 裡現有的，語錄用 quotes.yaml 裡的，提問用 questions/ 裡的
5. 所有互動元素要有 focus 樣式（pacific 藍外框）
6. 支援 prefers-reduced-motion
7. 大量留白，不規則的視覺節奏，呼吸感
8. 不要用 AI 感的泛用設計
```
