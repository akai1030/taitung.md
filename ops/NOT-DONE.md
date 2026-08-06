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
```
