# NOT-DONE — 因謹慎而未做的事

> **這份清單存在的理由：倫理蔓延不留證據。**
>
> 做錯的事會被抓到，沒做的事不會出現在任何報表上。
> 若不強制記錄「因謹慎而放棄的東西」，一個以保護為名的系統就會安靜地收縮到什麼都不做，
> 而且從數據上看起來完美無瑕。
>
> 依據：`PRECEDENT-AND-RISK.md` §3.6 ｜ 強制規則：`HARD-RULES.md` H20

**月度回顧必須回答的問題：**
> 這個月我們以保護之名放棄的東西，加起來是不是就是我們宣稱要對抗的那個沉默？

---

## 格式

```yaml
- date: YYYY-MM-DD
  intended: 原本打算做什麼
  not_done_because: 具體理由（引用 HARD-RULES 條號或 ETHICS 條號）
  harm_avoided: 對照 PRECEDENT-AND-RISK §3.6 的具體傷害表，是哪一種？
                （若答不出具體是哪一種，那就不是倫理判斷，是類別化恐懼 → 應該去做）
  cost: 放棄這件事的代價是什麼
  reversible_when: 什麼條件成立後可以重做
```

**填寫紀律**：`harm_avoided` 欄位若寫得出「因為是原住民族相關」這種類別化理由而非具體傷害類型，該筆即為**不合格的謹慎**，月度回顧應標記並重新評估。

---

## 紀錄

```yaml
- date: 2026-08-06
  intended: |
    把 content/surfing.md 標為 indigenous: true 後直接修正並 commit
    （該文提及阿美族、都蘭部落、原住民衝浪社群）
  not_done_because: HARD-RULES H10 — indigenous:true 不得自動 commit，須開 PR
  harm_avoided: 錯誤的族群描述（見 §3.6 傷害表第 5 列）
  cost: |
    該文的都蘭消歧義問題（「都蘭」裸用 6 次）與空白來源問題延後修正，
    網站上目前仍是不合規版本。
  reversible_when: 陳昀楷 review PR 後

- date: 2026-08-06
  intended: 為五篇既有文章補上 sources 的真實 URL 與 accessed 日期
  not_done_because: |
    非倫理理由——是方法理由。原 frontmatter 的 sources 只有機構名稱（如「中央研究院民族學研究所」），
    沒有指向任何具體文獻。要補的不是 URL，是「當初這句話到底根據什麼」，而那個資訊已經遺失。
  harm_avoided: 不適用（此筆為方法性延後，非倫理性放棄）
  cost: |
    五篇既有內容維持 47 FAIL 狀態。
    真正的意涵：這五篇文章的陳述目前無法被驗證，應全部降為 status: seed 並標注來源待補，
    而不是假裝補個 URL 就合格了。
  reversible_when: 逐篇重新做來源追溯（已列入 BACKLOG，B-003）

- date: 2026-08-10
  intended: |
    為 ops/REGISTRY/entities.yaml 的 27 個 entity 補上官方權威代碼
    （原民會核定部落名冊代碼、THCTS 地名代碼），依 ENTITIES.md P6「對齊既有權威檔，不自建」
  not_done_because: |
    非倫理理由——是方法理由（外部依賴不可用）。本輪實測：cip.gov.tw（原民會部落名冊）與
    thcts.sinica.edu.tw（THCTS 查詢平台）皆回傳 HTTP 503；data.gov.tw dataset 7094
    （部落 GIS 點位）已下架。四個目標權威來源，三個打不開、一個沒了，無從對齊。
  harm_avoided: 不適用（此筆為方法性延後，非倫理性放棄）
  cost: |
    27 個 entity 的 authority_ref 全部是 null，registry 骨架目前只能靠維基百科等次要來源
    支撐實體存在性，還不能作為真正權威對照。有一定機率下一輪核實後，部分 entity 需要修正
    （例如與官方代碼對不上）。
  reversible_when: CIP 或 THCTS 查詢平台任一恢復可用時，逐筆補上 authority_ref

- date: 2026-08-25
  intended: |
    把 corpus-0003（B-027 候選：107 學年度 NDLTD 論文〈臺東縣金峰鄉sapulju部落
    pavavaljung巴法法瀧開拓者頭目家族遷移研究〉核實材料）比照 corpus-0004→
    content/pacefongan.md 的既有模式，寫成一篇新的 content/（可推進「有完整來源的
    內容」指標）。已有的材料是兩個獨立公開來源：國立臺東大學山海部落遊憩教育中心
    機構頁（s-0003）與地方部落格（s-0004），兩者對巴法法瀧家族的開拓敘事有落差
    （見 corpus-0003 c-0005，已標 disputed，未擅自合併）。
  not_done_because: |
    這不是來源不可及（s-0003／s-0004 本身皆可讀，本輪也重試了 NDLTD 論文全文，
    仍撞驗證碼——見 corpus-0007，論文本身依然不可讀，但這不是本筆放棄的主因）。
    真正的理由是：s-0003 機構頁明確記載「現任領袖為李冠廷先生」，把這句話寫進
    公開內容，等於本站替一個具名在世個人的部落傳統領袖身分背書；而 s-0003／s-0004
    對這個家族的開拓敘事本身有出入（c-0005），一旦公開發布，這篇文章就不只是
    「記載一個地方故事」，而可能被讀成本站在替特定家族的傳統領袖正當性主張表態，
    這超出本站「記載已存在的公開記載」的定位，需要當事家族／部落的同意，本站無法
    自行取得同意。08-21 核實當下已做過同樣判斷（見 corpus-0003 tk_notice），
    本輪重新檢視後維持原判斷，未因今天多讀到論文摘要的機會（本輪未能讀到）而改變。
  harm_avoided: |
    誤述在世個人（PRECEDENT-AND-RISK.md §3.6 傷害表第 2 列：引述/涉及真人身分主張，
    需當事人同意）——具體風險是替特定具名在世人士的部落傳統領袖身分背書，且該身分
    敘事本身在兩個既有公開來源之間就有出入。
  cost: |
    今天的 B-027 進度停在方法論層（corpus-0007：NDLTD 間歇性確認），未產出新的
    content/，「有完整來源的內容」指標本輪未推進一格（見 JOURNAL 2026-08-25、
    METRICS.md）。sapulju 部落的開拓史材料留在 corpus-0003，未轉為網站內容。
  reversible_when: |
    若能聯繫到 sapulju 部落或 pavavaljung 家族本人確認可公開發布，或找到不需具名
    現任領袖、且不會被讀成背書特定家族權威主張的敘事寫法（例如只寫部落創建的
    集體遷移史，不寫「誰是現任領袖」「誰的家族被認同為領袖」）。
```
