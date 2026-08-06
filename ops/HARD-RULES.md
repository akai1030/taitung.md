# HARD RULES — 唯一有強制力的規則

> **這一頁是唯一有強制力的文件。** 其餘所有 ops/ 文件都是推理紀錄與參考，**無強制力**。
> 任何衝突，以本頁為準。
>
> 依據：維基百科 2022–2025 治理 AI 內容的三年經驗——**全面性失敗，極簡主義成功**（`PRECEDENT-AND-RISK.md` §1.2）。
> 不能被機器執行的規則不是規則，是願望。**本頁每一條都對應 `scripts/audit-content.ts` 裡一個實際跑得起來的檢查。**

版本：v1.0 ｜ 2026-08-06

---

## A. 內容真實性

| ID | 規則 | 違反後果 |
|---|---|---|
| **H1** | 任何量化陳述（百分比、人數、年份、面積、金額）必須有 `source` | ❌ FAIL |
| **H2** | 任何 `「」` 引號內超過 15 字的引語必須有 `source` | ❌ FAIL |
| **H3** | 每筆 `source` 必須有 `accessed` 日期 | ❌ FAIL |
| **H4** | 每筆有 URL 的 `source`，URL 必須實際存活（存在性驗證，非格式檢查） | ⚠️ WARN，連續 3 次 → FAIL |
| **H5** | frontmatter 必須有 `ai_generated: false`（永遠是 false） | ❌ FAIL |

## B. 實體與混淆

| ID | 規則 | 違反後果 |
|---|---|---|
| **H6** | 量化陳述必須同時有 `as_of`（時間）與 `spatial_level`（county/township/village/settlement） | ❌ FAIL |
| **H7** | 高風險同名詞（都蘭／卑南／知本／長濱／大武／太麻里／成功）單獨出現且未消歧義 | ⚠️ WARN |
| **H8** | 實體合併（`merged_from`）必須附 `merge_evidence` | ❌ FAIL |

## C. 原住民族內容

| ID | 規則 | 違反後果 |
|---|---|---|
| **H9** | 命中族群名／部落名／族語詞 → 必須標 `indigenous: true` | ❌ FAIL |
| **H10** | `indigenous: true` → **不得自動 commit 到 main，必須開 PR** | ❌ FAIL（CI 擋） |
| **H11** | `indigenous: true` → 必須有 `tk_notice` 欄位 | ❌ FAIL |
| **H12** | `tk_label` 欄位**只有人類可填**。agent 填寫即 FAIL | ❌ FAIL |
| **H13** | 祭儀細節、禁忌知識、織紋圖案重製 → 不收錄（詞表偵測） | ⚠️ WARN + 強制人工 |

## D. 授權

| ID | 規則 | 違反後果 |
|---|---|---|
| **H14** | 每筆來源必須有 `license`。`unknown` 者不得進入網站內容 | ❌ FAIL |
| **H15** | `license: ogdl-1.0` → 必須渲染完整顯名聲明（法律要件：未標示視為自始未取得授權） | ❌ FAIL |
| **H16** | 圖片無 `license` → 不得使用 | ❌ FAIL |

## E. 揭露

| ID | 規則 | 違反後果 |
|---|---|---|
| **H17** | 必須有 `ai_in_methods` 與 `ai_in_acknowledgment` 兩欄位（可為空陣列，但欄位必須存在） | ❌ FAIL |
| **H18** | 兩欄位的值只能取自固定詞彙表 | ❌ FAIL |

## F. 迴圈自身

| ID | 規則 | 違反後果 |
|---|---|---|
| **H19** | 每輪執行必須產出一篇 `ops/JOURNAL/YYYY-MM-DD*.md` | ❌ FAIL |
| **H20** | 因倫理考量而未做的事，必須記入 `ops/NOT-DONE.md`（反倫理蔓延） | ❌ FAIL |
| **H21** | `ops/ETHICS.md` 與 `ops/HARD-RULES.md` 本身不得由 agent 修改 | ❌ FAIL（CI 擋 diff） |

---

## 唯一的絕對禁令

**不得產生假的內容**：捏造的引言、口述歷史、統計數字、參考文獻、社群回答、田野筆記、照片圖說。

這一條無法完全機器檢查，因此它同時是設計原則與人工審查重點。**其餘二十一條可以爭論、可以修訂；這一條不行。**

---

*執行：`npx tsx scripts/audit-content.ts`。CI 於每次 push 執行。*
