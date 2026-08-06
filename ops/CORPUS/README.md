# CORPUS — 語料庫

> 採集到的原始材料。**這裡不是文章，是材料。**
> 每筆綁定來源與存取日期；**不做跨來源融合**（`ENTITIES.md` P5）。

檔名：`YYYY-MM-DD-{slug}.yaml`

---

## 格式

```yaml
id: corpus-0001
collected: 2026-08-06
collected_by: agent

source:
  tier: T2                      # T1 一手／T2 學術／T3 機構／T4 媒體／T5 灰色／T6 未驗證（不可用）
  type: journal-article
  authors: ["…"]
  title: "…"
  container: "…"
  year: 2018
  identifier: "doi:… / ISBN / URL"
  url: "https://…"
  archive_url: "https://web.archive.org/…"   # 連結腐化對策
  accessed: 2026-08-06
  license: unknown              # unknown 者不得進入網站內容（H14）
  attribution_statement: null   # license: ogdl-1.0 時必填（H15，法律要件）
  syndicated_from: null         # 轉載鏈偵測（METHOD §2）

reading_level: abstract-only    # full-text | abstract-only | metadata-only
                                # 誠實標明讀到哪一層

entities:                       # 綁 entity id，不綁名稱（ENTITIES P4）
  - settlement.dulan-atolan

claims:
  - claim_id: c-0001
    text: "…"
    confidence: attested        # verified / attested / inferred / gap / disputed
    temporal: { as_of: 2024-12-31 }        # 量化陳述必填（H6）
    spatial_level: township                # 量化陳述必填（H6）
    inference_chain: null                  # confidence: inferred 時必填

indigenous: false
tk_notice: null                 # indigenous: true 時必填（H11）
pii: false
```

---

## 三條紀律

1. **不聚合。** 五個來源就是五筆 CORPUS，不要合成一段順暢的文字。
   實證依據：「產出越多引用的模型，必須從越多檢索段落聚合資訊，因而提高跨來源事實誤植與混淆的機率」（`LITERATURE.md` §2.1）。

2. **`reading_level` 要誠實。** 只讀到摘要就寫 `abstract-only`。
   引用未讀是幽靈引用的古典成因，比 LLM 更早存在。

3. **筆數為 0 的檢索也要記。** 記在 `JOURNAL/`，那是缺口分析的原始資料——
   `gap` 是本專案最有價值的產出，而它的證據就是這些零。
