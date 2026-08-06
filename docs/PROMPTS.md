# Taitung.md — Claude Code 批次開發 Prompts

> 按開發順序排列。每個 prompt 是一個獨立的開發單元，依序執行。
> 開始前請先讀完 CLAUDE.md，確保理解專案架構和設計系統。

---

## Prompt 1：專案初始化

```
初始化 Taitung.md 專案。

技術棧：Next.js 14 App Router + TypeScript + Tailwind CSS + MDX。
部署目標：Zeabur。

執行以下步驟：
1. 用 `create-next-app` 建立專案（app router, typescript, tailwind, eslint）
2. 安裝依賴：
   - @next/mdx, @mdx-js/react, gray-matter（MDX + frontmatter）
   - next-intl（i18n）
   - pagefind（搜尋，dev dependency）
3. 設定 Tailwind：根據 DESIGN-SYSTEM.md 加入自訂色彩變數、字型、間距
4. 設定 next.config.ts：啟用 MDX、設定 i18n locale（zh-tw, en）
5. 建立目錄結構：
   - content/（land, time, people, knowledge/nttu, living, celebration, experience, youth, design, education, sustainability, connection, township）
   - src/app/[locale]/（page.tsx, [layer]/, nttu/, township/, map/, search/, contribute/, about/）
   - src/components/
   - src/lib/
   - public/audio/
6. 建立 public/llms.txt 和 public/robots.txt（內容見 ARCHITECTURE.md）
7. 設定 globals.css：Google Fonts 載入（Cormorant Garamond, Noto Serif TC, Noto Sans TC）、CSS 變數（見 DESIGN-SYSTEM.md）、noise texture overlay
8. 確認 dev server 能正常啟動

不需要寫任何頁面內容，只做骨架。
```

---

## Prompt 2：內容系統（Markdown 解析 + Frontmatter）

```
建立內容解析系統。

參考 ARCHITECTURE.md 的 frontmatter 規格，建立以下：

1. src/lib/content.ts：
   - getAllArticles()：掃描 content/ 目錄，解析所有 .md 檔的 frontmatter
   - getArticleBySlug(layer, slug)：取得單篇文章的 frontmatter + MDX 內容
   - getArticlesByLayer(layer)：依地景層篩選文章
   - getArticlesByTownship(township)：依鄉鎮篩選
   - getSeasonalArticles(month)：依當前月份篩選（用 frontmatter 的 season 欄位）
   - 所有函式回傳的文章物件需包含 TypeScript 型別定義

2. src/lib/types.ts：
   - Article 型別（完整 frontmatter 欄位）
   - Layer 型別（12 個地景層的定義，含 id, name, nameEn, icon, color）
   - Voice 型別（academic, oral-history, field-note, youth-action, visitor）
   - Township 型別

3. 建立 2-3 篇示範文章（用真實內容）：
   - content/people/dulan.md（都蘭，包含多聲道內容）
   - content/land/green-island.md（綠島）
   - content/knowledge/nttu/library.md（東大圖書館）
   每篇都要有完整的 frontmatter，格式見 ARCHITECTURE.md。

4. src/lib/layers.ts：
   - 12 個地景層的靜態定義（id, name, nameEn, icon, color 見 DESIGN-SYSTEM.md）

確保所有函式都能正確解析 MDX 格式和 YAML frontmatter。
```

---

## Prompt 3：首頁

```
建立首頁 src/app/[locale]/page.tsx。

設計參考：prototype/index.html
設計系統：DESIGN-SYSTEM.md

首頁是一個滾動式紀錄片體驗，由以下區塊組成（由上而下）：

1. 開場（Opening）：
   - 巨型「台東」字標，Noto Serif TC 900 weight
   - 副標 "An open-source knowledge of place"（Cormorant Garamond italic）
   - 座標 22.7583° N, 121.1444° E
   - 背景：SVG 等高線地形紋（見原型）
   - 底部 scroll 提示動畫

2. 此刻的台東（Season）：
   - 從 src/lib/season.ts 取得當月資料
   - 用詩意的文字呈現當季活動，不是橫幅
   - 建立 src/lib/season.ts：定義 12 個月各自的季節文字和活動

3. 地景層探索（Layers）：
   - 4x3 網格（與原型一致）
   - 每格顯示 icon、中文名、英文名、文章數
   - hover 時底部出現該層專屬色的線條
   - 點擊進入 /[layer]/ 頁面

4. 最近的故事（Stories）：
   - 水平捲動卡片列表
   - 從 getAllArticles() 取最新文章
   - 所有內容平等呈現，不分特區
   - 卡片：圖片 placeholder + 地景層標籤 + 標題 + 鄉鎮/閱讀時間

5. 引言（Quote）：
   - 深色全版面區塊
   - 靜態引言（之後可改為動態）
   - 等高線 SVG 背景（淡色版）

6. 地圖預覽（Map Preview）：
   - 左文右圖的 split layout
   - 右側為靜態 SVG 台東輪廓 + 知識節點 pin（之後替換為 Mapbox）
   - 「進入全螢幕地圖 →」連結

7. 多元聲音（Voices）：
   - 2x2 網格
   - 每格一種聲道：學術、口述、田野、青年
   - 各有引言和來源

8. 投稿號召（Contribute）
9. Footer

所有區塊使用 IntersectionObserver 做 scroll reveal 動畫。
浮動膠囊式導覽列（fixed top center）。

元件拆分建議：
- components/Opening.tsx
- components/SeasonBanner.tsx
- components/LayerGrid.tsx
- components/StoryCarousel.tsx
- components/QuoteBlock.tsx
- components/MapPreview.tsx
- components/VoicesGrid.tsx
- components/ContributeCTA.tsx
- components/FloatingNav.tsx
- components/Footer.tsx
```

---

## Prompt 4：文章頁 + 多聲道系統

```
建立文章頁 src/app/[locale]/[layer]/[slug]/page.tsx。

設計參考：prototype/article.html
設計系統：DESIGN-SYSTEM.md

頁面結構：

1. 文章 Hero：
   - 麵包屑（首頁 / 地景層 / 文章名）
   - 地景層標籤（多個，各有對應色）
   - 大標題（Noto Serif TC 900）
   - Meta：鄉鎮 · 閱讀時間 · 座標

2. 聲道切換器（VoiceSwitcher）：
   - sticky 固定在 nav 下方
   - 四個 tab：📖 學術研究 / 🎤 口述歷史 / 📝 田野筆記 / 🌱 青年行動
   - 選中時底部出現 2px 色線（每個聲道不同顏色）
   - 切換時平滑過渡

3. 主內容區（左）+ 側欄（右）：
   - 主內容根據當前聲道顯示不同面板：
     a. 學術研究：標準文章排版，Noto Serif TC，附引用標記
     b. 口述歷史：音檔播放器（AudioPlayer 元件）+ 逐字稿 toggle + 引言區塊
     c. 田野筆記：日期戳 + 第一人稱敘述 + 綠色觀察紀錄框
     d. 青年行動：行動卡片（綠色左邊框）+ 青年觀點引言
   - 側欄：迷你地圖 placeholder、目錄（TOC）、相關文章、標籤、資料來源

元件拆分：
- components/VoiceSwitcher.tsx
- components/AudioPlayer.tsx（播放/暫停、進度條、時間顯示、逐字稿 toggle）
- components/ArticleHero.tsx
- components/ArticleSidebar.tsx
- components/OralQuote.tsx
- components/FieldObservation.tsx
- components/YouthActionCard.tsx

用 getArticleBySlug() 取內容。
用 generateStaticParams() 做 SSG。
每篇文章不一定有所有聲道，只顯示 frontmatter 中 voices 列出的聲道。
```

---

## Prompt 5：地景層列表頁 + 鄉鎮頁

```
建立兩個列表頁：

1. 地景層列表 src/app/[locale]/[layer]/page.tsx：
   - 頂部：層 icon + 層名（中英文）+ 層描述
   - 文章列表：卡片式排列，和首頁的故事卡片樣式一致
   - 篩選：可依鄉鎮篩選（簡單的 pill 選擇器）
   - 用 getArticlesByLayer() 取資料
   - generateStaticParams() 產生 12 個地景層頁面

2. 鄉鎮總覽 src/app/[locale]/township/[slug]/page.tsx：
   - 頂部：鄉鎮名 + 簡介
   - 該鄉鎮的所有文章，依地景層分組顯示
   - 用 getArticlesByTownship() 取資料
   - generateStaticParams() 產生 16 個鄉鎮頁面

兩個頁面都要：
- 麵包屑導航
- scroll reveal 動畫
- 響應式（mobile 單欄, desktop 多欄）
```

---

## Prompt 6：搜尋系統（Pagefind）

```
整合 Pagefind 搜尋。

1. 在 build script 中加入 pagefind：
   - next.config.ts 或 package.json scripts 加入 postbuild 執行 pagefind --site .next/server/app
   
2. 建立搜尋頁 src/app/[locale]/search/page.tsx：
   - 搜尋輸入框（大型、置中）
   - 即時搜尋結果（Pagefind UI 或自訂 UI）
   - 結果顯示：標題、摘要、地景層標籤、鄉鎮

3. 在 FloatingNav 的搜尋按鈕加上互動：
   - 點擊展開搜尋輸入框（在 nav 內 inline 展開）
   - 或跳轉到 /search 頁面
   
4. 確保中文搜尋正常運作（Pagefind 的中文分詞）。
```

---

## Prompt 7：i18n 多語系

```
設定 next-intl 多語系。

1. 設定 middleware.ts：locale 偵測和路由
2. 建立 messages/zh-tw.json 和 messages/en.json：
   - UI 文字翻譯（導覽列、按鈕、標籤、地景層名稱等）
3. 所有元件中的 hardcoded 中文改用 useTranslations()
4. 內容層面：
   - content/ 目錄的文章預設為 zh-tw
   - 英文版文章放在 content/en/（結構鏡像）
   - getArticleBySlug 支援 locale 參數
5. 導覽列的語言切換按鈕（EN/中）能正確切換 locale
6. HTML lang 屬性正確設定
```

---

## Prompt 8：投稿頁面

```
建立投稿頁 src/app/[locale]/contribute/page.tsx。

設計風格和首頁一致（editorial, 大量留白）。

五種投稿方式，每種有獨立的展開區塊：

1. 📝 寫一篇：表單（標題、內文 textarea、選擇地景層、選擇鄉鎮、上傳照片）
2. 🎤 錄口述：說明錄音流程 + 上傳音檔的表單
3. 📷 傳照片：拖放上傳 + 簡短說明欄位
4. 💡 留線索：簡易表單（一段文字描述 + 選擇性的地點資訊）
5. ⌨️ GitHub PR：連結到 GitHub repo + 簡易 contributing guide

表單提交先用 client-side 狀態模擬成功訊息（MVP 不需要 backend）。
之後可以接 API route 存到資料庫或發 GitHub Issue。

元件：
- components/ContributeForm.tsx
- components/FileUpload.tsx
```

---

## Prompt 9：地圖頁面（Mapbox / MapLibre）

```
建立全螢幕地圖頁 src/app/[locale]/map/page.tsx。

使用 MapLibre GL（免費，Mapbox 相容）或 Mapbox GL JS。

1. 全螢幕地圖，3D terrain 地形渲染
2. 載入所有文章的座標作為知識節點（markers）
3. 地景層切換面板（側邊欄）：
   - 12 個 checkbox，勾選/取消控制地圖上對應標記的顯示
   - 每層有專屬色（見 DESIGN-SYSTEM.md）
4. 點擊標記彈出摘要卡片（文章標題、地景層、鄉鎮、閱讀時間、連結）
5. 季節濾鏡：依當月高亮當季內容
6. 響應式：mobile 時側欄改為底部抽屜

元件：
- components/TaitungMap.tsx（核心地圖元件）
- components/LayerToggle.tsx（地景層切換）
- components/MapPopup.tsx（標記彈出卡片）

地圖 style 用淡色調 terrain style，和網站整體 cream 色調協調。
```

---

## Prompt 10：SEO + 效能 + 部署

```
最終優化和部署設定。

1. SEO：
   - 每頁的 metadata（title, description, og:image）
   - generateMetadata() 動態生成文章頁 metadata
   - sitemap.xml（next-sitemap 或手動）
   - 結構化資料（JSON-LD）：Article, Place
   
2. 效能：
   - 圖片用 next/image 優化
   - 字型用 next/font 載入（減少 FOUT）
   - 地圖元件用 dynamic import（lazy load）
   - Lighthouse 檢查並修正問題

3. 無障礙：
   - 所有圖片有 alt
   - 互動元素有 focus 樣式
   - 音檔有逐字稿
   - 支援 prefers-reduced-motion
   - 支援 prefers-color-scheme（深色模式基礎）
   - 鍵盤導航測試

4. 部署：
   - 建立 zeabur.json（或在 Zeabur dashboard 設定）
   - 確認 build 成功
   - 設定環境變數（MAPBOX_TOKEN 等）

5. CI：
   - .github/workflows/ci.yml：lint + type-check + build
   - 基本的 frontmatter 驗證 script（scripts/check-content.ts）
```

---

## Prompt 11：台東文學語錄系統

```
建立台東文學語錄系統。

資料來源：content/quotes.yaml（已建好，包含 8 位作家 + 12 則語錄）

1. src/lib/quotes.ts：
   - 解析 content/quotes.yaml
   - getAllAuthors()：取得所有作家資料
   - getAllQuotes()：取得所有語錄
   - getQuotesByLayer(layer)：依地景層篩選語錄
   - getRandomQuote()：隨機取一則（首頁引言輪播用）
   - getAuthorById(id)：取得單一作家詳細資料
   - TypeScript 型別：Author, Quote, Work

2. 首頁引言區塊改為動態：
   - 替換目前首頁 QuoteBlock 的靜態內容
   - 每次載入或每隔 30 秒從語錄庫隨機抽一則
   - 顯示：語錄文字 + 作家名 + 族群/身份 + 來源
   - 淡入淡出切換動畫

3. 語錄探索頁 src/app/[locale]/quotes/page.tsx：
   - 頂部：頁面標題「台東的聲音」+ 簡介文字
   - 作家列表：每位作家一個區塊，包含：
     a. 姓名（中文 + 族語/英文）
     b. 族群 + 家鄉部落 + 鄉鎮
     c. 簡介
     d. 代表作品列表
     e. 該作家的所有語錄，以大字引言排版呈現
   - 可依地景層篩選
   - 設計風格和首頁一致（editorial, 大留白, Noto Serif TC 引言）

4. 文章頁側欄加入「相關語錄」：
   - 如果文章的 layer 和某些語錄的 layers 重疊，側欄顯示 1-2 則相關語錄
   - 小字引言 + 作家名，點擊連結到語錄頁

作家資料中有 coordinates，未來可以在地圖上顯示作家的家鄉/駐地。

注意：quotes.yaml 裡的語錄是從公開訪談和出版品摘錄的，
呈現時要附上來源（source 欄位），尊重原作者。
```

---

## 使用說明

1. 在專案根目錄開啟 Claude Code CLI
2. 確保 CLAUDE.md 在根目錄（Claude Code 會自動讀取）
3. 依序複製每個 prompt 貼入 Claude Code
4. 每個 prompt 完成後，跑一次 `npm run dev` 確認無誤再繼續
5. Prompt 之間的依賴：1→2→3→4→5→6→7→8→9→10（大致線性，6-8 可平行）

---

*文件版本：v1.0*
*產出日期：2026-04-09*
