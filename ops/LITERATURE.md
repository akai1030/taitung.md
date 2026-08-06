# LITERATURE — 方法論文獻回顧

> `CHARTER` / `ETHICS` / `METHOD` / `ENTITIES` 四份文件不是憑空設計的。
> 這份文件記錄它們各自對應到哪些既有的國內外方法論、標準與研究，以及**我在哪些地方偏離了既有做法、為什麼**。
>
> **閱讀層級聲明**：本回顧多數條目為「檢索結果層級」（讀到摘要與平台說明，未取得全文）。已標明。這不是缺陷的掩飾，是 §5 所述紀律的自我適用——本專案要求所有陳述標注確信度，這份文件自己也必須遵守。

版本：v1.0 ｜ 檢索日：2026-08-06

---

## 一、原住民族資料治理

### 1.1 已採用

| 框架 | 來源 | 本專案怎麼用 |
|---|---|---|
| **CARE Principles for Indigenous Data Governance** — Collective benefit, Authority to control, Responsibility, Ethics。2019 由 Global Indigenous Data Alliance (GIDA) 發布 | [Data Science Journal](https://datascience.codata.org/articles/10.5334/dsj-2020-043)、[GIDA](https://fnigc.ca/wp-content/uploads/2025/09/GIDA-Communique-CARE-Directs-Us-Home-Prioritizing-Indigenous-Peoples-Community-Standards-final.pdf) | 已寫入 `ETHICS.md` §1.2。關鍵論點：**FAIR 追求最大開放，CARE 中心是原住民族主權**——兩者不是同一件事，且會衝突 |
| **CARE 與 FAIR 併行操作化** | [Nature Scientific Data](https://www.nature.com/articles/s41597-021-00892-0)、[Ada Lovelace Institute](https://www.adalovelaceinstitute.org/blog/care-principles-operationalising-indigenous-data-governance/) | 本站是開源專案（傾向 FAIR），但原民內容必須套 CARE。這個張力要明寫在 `/about`，不能假裝不存在 |
| **《原住民族基本法》第 21 條** 諮商同意權 | [全國法規資料庫](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0130003&flno=21)、[原民會釋義](https://law.cip.gov.tw/LawContent.aspx?id=GL000202)、[原民會說明文件 PDF](https://www.cip.gov.tw/data/news/202312/T-30609048.pdf) | `ETHICS.md` §1.1 |
| **《人體研究法》第 15 條** — 以原住民族為研究目的者需諮詢並取得同意，**「其研究結果之發表，亦同」** | [清大研究倫理中心](https://rec.site.nthu.edu.tw/p/406-1233-107495,r7436.php) | 「發表亦同」這五個字是關鍵。目前本專案未做人體研究，但一旦收口述歷史即刻適用 |

### 1.2 新採用（原設計缺漏，此次補上）

**Local Contexts — TK Labels / BC Labels**（[localcontexts.org](https://localcontexts.org/labels/about-the-labels/)、[DataCite 整合說明](https://support.datacite.org/docs/local-contexts-notices-and-labels)）

我原本的 `ETHICS.md` 只設計了 `consent: pending|obtained|declined` 三態。這太粗糙。Local Contexts 是國際上實際運作的標籤系統，讓**社群自己**定義流通條件——包含聖物／祭儀材料、性別限制、季節性使用條件、僅供外展用途等分級。

> 「TK 與 BC Labels 讓原住民社群有工具，為自己的文化遺產內容加上文化與歷史脈絡、以及文化權威。」

**這個發現改變了設計**：同意不是布林值，是一組由社群定義的條件。而且 Local Contexts 還有 **Notices**——供**機構在尚未聯繫到社群時**先行標記「此材料涉及原住民族權益，脈絡待補」。這正好解決本專案的實際處境：我們現在還沒有部落授權，但不能因此假裝這些材料沒有歸屬問題。

→ **行動**：`ETHICS.md` §1.3 的 E3 改採 Label/Notice 分級。詳見該節修訂。

### 1.3 參考但未直接採用

- **OCAP®**（加拿大 First Nations：Ownership, Control, Access, Possession）與 **Te Mana Raraunga**（毛利資料主權）——與 CARE 同源，但制度綁定各自國家。台灣情境下以原基法＋CARE 為主。

---

## 二、實體解析與權威控制（反混淆）

### 2.1 支持本專案設計的實證

**這是本次回顧最重要的發現，它從實證上支持了「不做跨來源摘要」這條規則。**

- **《Cited but Not Verified: Parsing and Evaluating Source Attribution in LLM Deep Research Agents》**（[arXiv:2605.06635](https://arxiv.org/html/2605.06635v1)）：LLM deep research agent 從數百個網路來源合成報告並附行內引用，但**這些引用無法被可靠驗證**。
- 關鍵機制陳述：**「產出越多引用的模型，必須從越多檢索段落聚合資訊，因而提高跨來源事實誤植與混淆（misattribution or conflation of facts across sources）的機率。」**
- **《LLM hallucinations in the wild: Large-scale evidence from non-existent citations》**（[arXiv:2605.07723](https://arxiv.org/pdf/2605.07723)）：對 arXiv / bioRxiv / SSRN / PMC 建立驗證管線，估計 2025 一年就有 **146,932+** 筆幻覺引用，且**到 2025 年底仍在上升、未見平緩**——即使 RAG 與推理模型持續進步。
- **CiteGuard**（[arXiv:2510.17853](https://arxiv.org/pdf/2510.17853)）：以檢索增強驗證做引用歸屬查核。
- 另註（[Aaron Tay](https://aarontay.substack.com/p/why-ghost-references-still-haunt)）：幽靈引用在 LLM 之前就存在，源於人類的**「引用未讀」與「混淆相似論文」**。

**推論（標為 `inferred`）**：既然「聚合越多來源 → 混淆機率越高」是已觀察到的機制，那麼降低混淆的直接手段就是**不聚合**。`ENTITIES.md` P5「禁止跨來源融合摘要、只做並列」不只是保守做法，是針對已知失效機制的對症設計。

→ **行動**：`ENTITIES.md` P5 加註此實證依據。並新增規則：**本專案自身產出的引用必須經 `audit-content.ts` 做存在性驗證**（URL 存活 + 標題比對），不能只是格式正確。

### 2.2 已採用的既有方法

| 方法 | 來源 | 用法 |
|---|---|---|
| **Fellegi-Sunter 機率式記錄連結** — 對每組記錄配對取三種動作：link / possible link / not link，在控制兩類條件錯誤率下最小化 possible link | [(Almost) All of Entity Resolution, arXiv:2008.04443](https://arxiv.org/pdf/2008.04443) | **直接修正了我的設計**：我原本只設「合併／不合併」二態。Fellegi-Sunter 的三態才對——中間態 `possible-link` 對應 `ENTITIES.md` §4 的 `unresolved`，應提升為一等公民 |
| **Splink** — 開源機率式連結，Fellegi-Sunter 實作，SQL backend，百萬筆記錄可在筆電上約一分鐘完成 | [GitHub](https://github.com/moj-analytical-services/splink)、[比較評述](https://tilores.io/content/best-open-source-entity-resolution-and-record-linkage-libraries-splink-zingg-dedupe-and-when-to-move-beyond-them/) | 語料規模到達數千筆後導入。目前規模用規則式即可，但 schema 現在就要設計成相容 |
| **CIDOC CRM** — ISO 標準的文化遺產形式本體（E21 Person、E71 Human-Made Thing 等） | [cidoc-crm.org](https://cidoc-crm.org/)、[LOD 本體回顧](https://isprs-archives.copernicus.org/articles/XLVIII-M-2-2023/943/2023/isprs-archives-XLVIII-M-2-2023-943-2023.pdf) | **不全面採用**（對本專案過重），但 entity `type` 詞彙表要能對映到 CIDOC CRM class，保留未來互通性 |
| **W3C PROV-O** — 出處本體，常與 CIDOC CRM 併用 | 同上 | CORPUS 的 metadata 欄位對齊 PROV 的 Entity / Activity / Agent 三元 |
| **Wikidata 作為權威控制樞紐** | [Cataloging & Classification Quarterly](https://www.tandfonline.com/doi/abs/10.1080/01639374.2023.2188338) | entity 加選填 `wikidata_qid`，讓外部可對接 |

### 2.3 台灣在地權威檔（原設計完全遺漏，重大補充）

我原本打算自建地名 registry。這是重複造輪子，而且會造出一個比既有權威更差的輪子。

| 資源 | URL | 用途 |
|---|---|---|
| **台灣歷史文化地圖 THCTS**（中研院人社中心 GIS 專題中心）—— 整合臺灣歷史文化地圖、臺灣研究網路化、空照圖管理系統、**臺灣地區地名查詢系統**、漢籍資料庫 | [gis.rchss.sinica.edu.tw/thcts](https://gis.rchss.sinica.edu.tw/thcts/) | **地名消歧義的第一權威**。分荷西、明鄭、清、日治、戰後各期的空間圖層——正好解 `ENTITIES.md` §2.2 歷史更名問題 |
| **臺灣百年歷史地圖** | [gis.rchss.sinica.edu.tw/twhgis](https://gis.rchss.sinica.edu.tw/twhgis/)、[WMTS 服務](https://gis.sinica.edu.tw/tileserver/) | 有 WMTS 圖磚服務，可直接接進網站地圖層 |
| **文化資源地理資訊系統 CRGIS** | [crgis.rchss.sinica.edu.tw](https://crgis.rchss.sinica.edu.tw/) | 文化資源點位 |
| **原民會核定部落名冊**（最新版 2018-04-17 刊登公報） | [cip.gov.tw 本會部落核定](https://www.cip.gov.tw/zh-tw/news/data-list/7CDD0E527E32B424/index.html) | **部落實體的官方權威名冊**。解決「部落 ≠ 行政區」的層級混淆 |
| **原民會開放資料平台** | [data.cip.gov.tw](https://data.cip.gov.tw/home/datamenu.aspx) | |
| **原住民族部落調查-各縣市**（data.gov.tw dataset 7094）／**原住民族部落位置 GIS 點位** | [dataset/7094](https://data.gov.tw/dataset/7094) | 部落座標 |
| **台灣原住民族數位典藏知識入口網** | [portal.tacp.gov.tw](https://portal.tacp.gov.tw/) | |

→ **行動**：`ENTITIES.md` 改為 **「對齊既有權威檔」而非「自建」**。本專案的 entity registry 只負責*本地 ID ↔ 外部權威 ID 的對映*，以及權威檔涵蓋不到的實體（如當代團體、活動）。

---

## 三、系統性檢索與灰色文獻

| 方法 | 來源 | 用法 |
|---|---|---|
| **PRISMA-S** — PRISMA 的檢索報告延伸，經三階段 Delphi + 共識會議 + 公開審查制定，含 **16 項報告項目** | [Systematic Reviews, 2021](https://systematicreviewsjournal.biomedcentral.com/articles/10.1186/s13643-020-01542-z) | **直接採用為 `METHOD.md` §4 的報告格式**。既有的檢索報告「往往報告不良」——這正是自動化迴圈該解決的：機器不會偷懶不記 |
| **灰色文獻檢索指引** — 灰色文獻（學位論文、會議論文、技術報告、政府文件）因取得不易與缺乏標準化方法而在系統性回顧中被低估；**目前無普遍接受的識別與評估指引** | [ScienceDirect 建議](https://www.sciencedirect.com/science/article/pii/S0895435626000971)、[UNC LibGuide](https://guides.lib.unc.edu/grey-literature/systematic-reviews) | 需記錄檢索策略、擷取筆數、篩選筆數，納入 PRISMA 流程圖。**「無普遍接受的指引」＝ 這裡有本專案可做出原創貢獻的空間** |

### 台灣的灰色文獻檢索入口（原設計遺漏）

| 資源 | URL | 為什麼重要 |
|---|---|---|
| **GRB 政府研究資訊系統** — 收錄政府經費資助之研究計畫及成果報告最完整者，由國研院科政中心建置 | [grbsearch.stpi.narl.org.tw](https://grbsearch.stpi.narl.org.tw/) | **這是 `METHOD.md` 說的「金礦」的實際入口**。台東大量地方知識活在政府委託計畫的結案報告裡 |
| **臺灣博碩士論文知識加值系統 NDLTD** | [ndltd.ncl.edu.tw](https://ndltd.ncl.edu.tw/) | 學位論文 |
| **國家圖書館期刊文獻資訊網** | [tpl.ncl.edu.tw](https://tpl.ncl.edu.tw/) | 中文期刊 |
| **政府計畫資料庫**（國發會） | [gdb.ndc.gov.tw](https://gdb.ndc.gov.tw/) | |

---

## 四、授權

**《政府資料開放授權條款－第 1 版》**（[data.gov.tw/license](https://data.gov.tw/license)）

原設計只寫「確認是否為政府資料開放授權條款」。實際條款要求比這嚴格得多：

> 使用者利用本條款授權之開放資料及後續衍生物，**必須依附錄「顯名聲明」之方式明確標示原始資料提供機關之相關聲明；未盡此標示義務者，視為自始未取得授權。**

**「視為自始未取得授權」** —— 這不是建議格式，是授權生效的條件。標示格式為：

```
提供機關／單位 [年份] [開放資料名稱及版本編號]
本開放資料依政府資料開放授權條款進行公眾釋出，使用者於遵守本條款各項規定之前提下，得利用之。
政府資料開放授權條款：http://data.gov.tw/?q=principle
```

本條款與 **CC BY 4.0 相容**。

→ **行動**：`audit-content.ts` 新增 **E13a**：任何 `license: ogdl-1.0` 的來源，其衍生內容必須渲染出完整顯名聲明，缺一即 fail。這是法律要件，不是風格偏好。

---

## 五、AI 揭露

**ICMJE / COPE 共識**（[CASRAI 整理](https://casrai.org/guides/can-ai-be-listed-as-an-author)、[Accountability in Research 2025](https://www.tandfonline.com/doi/full/10.1080/08989621.2025.2481949)）：

三條原則自 2023 年成形、2025 年再確認：
1. **AI 不能是作者**——作者身份意味著問責，AI 無法被問責
2. **人類作者承擔全部責任**
3. **相關 AI 使用必須揭露**

ICMJE 2024 建議的**分位置揭露**：
- AI 用於**寫作輔助** → 寫在 **acknowledgment**
- AI 用於**資料蒐集、分析、圖表產生** → 寫在 **methods**

→ **行動**：這修正了 `ETHICS.md` E17–E19。原設計把所有 AI 使用混在一個 `ai_assisted` 陣列。應依 ICMJE 分成兩類欄位：

```yaml
ai_in_methods: [來源蒐集, 連結查證, 結構整理]   # 影響研究結果的
ai_in_acknowledgment: [格式轉換, 翻譯初稿]      # 僅寫作輔助的
```

**本專案的特殊性**：AI 是主要執行者，不是輔助。ICMJE 的框架預設 AI 是配角。這裡我們**超出**既有規範而非規避——`/about` 必須明說「本站內容由自動化研究迴圈產出，人類（陳昀楷）承擔全部責任」。第 2 條原則在這裡是加重的，不是減輕的。

---

## 六、參與式典藏模型

**Post-custodial（後保管）典藏理論** — 典藏者不再實體取得與保管記錄，而是為**仍由創建者保管**的記錄提供管理協助（[SAA Dictionary](https://dictionary.archivists.org/entry/postcustodial.html)）。

**SAADA 的實作**：不接受實體保管，而是向個人、家庭、組織、學術與政府典藏單位**借出**記錄、數位化、**以文化上適切的方式描述**、連結相關材料、免費公開；數位化後實體材料**留在原處**（[EDUCAUSE Review](https://er.educause.edu/articles/2017/10/participatory-and-post-custodial-archives-as-community-practice)、[Kula](https://kula.uvic.ca/index.php/kula/article/download/292/513/3219)）。

> 「後保管制讓社群自己保有對自身歷史的所有權，同時以少數觀點填補官方記錄的缺口。」

**這一句同時描述了本專案 `CHARTER.md` 的 B 軸（缺口軸）與 CARE 的 Authority to control。** `docs/RETHINK.md` 已將 SAADA 列為參考案例，但當時只取了「共同策展」的概念；**後保管模型是更根本的一層**：本站不應該想「擁有」台東的內容。

→ **行動**：寫入 `CHARTER.md` 的定位——Taitung.md 是**指向**與**連結**的層，不是收納的倉庫。這也大幅降低授權風險。

---

## 七、本回顧改變了什麼（總結）

| 文件 | 原設計 | 修正 | 依據 |
|---|---|---|---|
| `ETHICS.md` | consent 三態布林 | 改採 Local Contexts Label/Notice 分級 | Local Contexts |
| `ETHICS.md` | `ai_assisted` 單一陣列 | 拆為 methods / acknowledgment 兩類 | ICMJE 2024 |
| `ETHICS.md` | 「確認授權條款」 | OGDL 顯名聲明為強制法律要件，未標示＝未取得授權 | OGDL v1 |
| `ENTITIES.md` | 合併／不合併二態 | 三態：link / possible-link / not-link | Fellegi-Sunter |
| `ENTITIES.md` | 自建地名 registry | 改為對齊中研院 THCTS 與原民會部落名冊 | 中研院 GIS、原民會 |
| `ENTITIES.md` | 禁止跨來源摘要（直覺） | 同一規則，但補上實證機制依據 | arXiv:2605.06635 |
| `METHOD.md` | 自訂檢索紀錄格式 | 改採 PRISMA-S 16 項 | PRISMA-S |
| `METHOD.md` | 灰色文獻「金礦」（無入口） | 補 GRB／NDLTD／NCL／GDB 實際入口 | — |
| `CHARTER.md` | 未定義收納立場 | 明定後保管立場：連結而非擁有 | Post-custodial、SAADA |
| 全部 | 自產引用只檢查格式 | 必須做存在性驗證 | 引用幻覺實證研究 |

**未解決、留給後續**：灰色文獻「無普遍接受的識別與評估指引」。若本專案能發展出一套可運作的台灣地方灰色文獻評估準則，那本身就是可發表的貢獻——這是 `CHARTER.md` 論點之外的第二個原創貢獻機會。
