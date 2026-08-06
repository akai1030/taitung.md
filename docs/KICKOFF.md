# Taitung.md — 專案總覽

> 一座開源的台東知識庫。從臺東大學出發，為所有想認識台東的人而建。

---

## 專案定位

Taitung.md 不是 wiki，不是部落格。它是一個以地理座標為錨點的**互動式紀錄片體驗**——使用者滾動頁面就是走進台東的旅程。

核心特色：
- **地圖優先**：所有內容掛在地理座標上，地圖是主要導航方式之一
- **12 地景層**：不用傳統分類，用可疊加的「視角」來組織知識（土地、時間、人群、知識、生活、慶典、體驗、青年、設計、教育、永續、連結）
- **多聲道系統**：同一主題可有學術研究、耆老口述、田野筆記、青年行動、旅人觀察等不同聲音
- **季節引擎**：首頁根據當月自動推薦當季的台東
- **零門檻投稿**：網頁表單、LINE、錄音、Google Docs，不只 GitHub PR

---

## 技術棧

Next.js 14 App Router + TypeScript + Tailwind CSS + MDX + MapLibre GL + Pagefind + next-intl，部署在 Zeabur。

---

## 設計原則

空氣感為主體，山海色做強調。紀錄片風格的編輯式排版，不是知識庫的樣子。所有內容地位平等，不設機構特權專區。原住民文化元素只在對應區塊使用，絕不隨意裝飾。

---

## 涵蓋的台東知識

- 七個原住民族群：阿美族、排灣族、布農族、卑南族、魯凱族、達悟族、噶瑪蘭族
- 16 個鄉鎮市，從池上到蘭嶼
- 史前文化（卑南遺址）到當代生活（慢城運動、數位遊牧）
- 臺東大學的研究資源、南島文化、山形圖書館
- 青年返鄉、地方創生、在地組織網絡

---

## 規劃階段產出文件

| 階段 | 文件 | 說明 |
|------|------|------|
| 研究 | [RESEARCH.md](RESEARCH.md) | 台東相關資料蒐集、類似專案分析 |
| 架構 | [ARCHITECTURE.md](ARCHITECTURE.md) | 技術架構、內容結構、功能設計、API 路由 |
| 設計 | [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | 色彩、字型、元件風格、動畫、響應式、無障礙 |
| 原型 | [prototype/index.html](prototype/index.html) | 首頁互動原型（紀錄片風格滾動體驗） |
| 原型 | [prototype/article.html](prototype/article.html) | 文章頁原型（四聲道切換、音檔播放器） |
| 開發 | [PROMPTS.md](PROMPTS.md) | Claude Code CLI 批次開發 prompt（10 個，依序執行） |
| 開發 | [CLAUDE.md](CLAUDE.md) | Claude Code CLI 專案指引（技術棧、設計系統、注意事項） |

---

## 開發流程

1. 開啟 Claude Code CLI，確保 CLAUDE.md 在專案根目錄
2. 依序執行 PROMPTS.md 中的 10 個 prompt
3. 每個 prompt 完成後跑 `npm run dev` 確認無誤
4. Prompt 1-5 為線性依賴，6-8 可平行開發
5. Prompt 9（地圖）和 10（SEO/部署）最後做
6. 設計微調可以獨立進行，不影響功能開發

---

## 待確認事項

- [ ] 域名 taitung.md 是否可取得
- [ ] Mapbox token 或改用完全免費的 MapLibre + 開源地圖磚
- [ ] 口述歷史音檔的錄製與授權
- [ ] 原住民文化內容的審閱流程（建議找部落文化工作者協助）
- [ ] 投稿表單的後端處理方式（GitHub Issue / Zeabur DB / 外部服務）

---

*產出日期：2026-04-09*
*規劃工具：Cowork*
*開發工具：Claude Code CLI*
