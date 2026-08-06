# BACKLOG — 研究待辦池

> 每一項必須能對應 `CHARTER.md` 的 A（記載軸）／B（缺口軸）／C（當下軸）某一條，否則不做。
> 每輪執行從這裡挑一件。

更新：2026-08-06

---

## 🔴 需人類裁決

### B-005 — 開源 vs 資料主權的結構性矛盾
**軸**：跨軸（定位問題）｜**來源**：`PRECEDENT-AND-RISK.md` §R1

CHARTER 說開源，ETHICS 說遵守 CARE 的 Authority to control。把原民內容放 public repo ＝ 送進全球訓練語料，不可逆。CARE 的「控制權」在此架構下**結構性無法實現**。

提議選項（待陳昀楷裁決）：
1. `indigenous: true` 內容不進 public repo，改私有儲存 + 網站端獨立供應
2. 整個 repo 轉私有，只公開 build 產物
3. 維持全開源，但在 `/about` 誠實聲明此限制並放棄 CARE 宣稱

**不做決定就等於選了 3。** 這是本專案目前最重要的未決問題。

### B-006 — 中央氣象署 API（降級為 🟡 中優先）
**軸**：C｜`.env.local` 的 `CWA_API_KEY` 回 401。

**⚠️ 自我更正**：我初次記錄時寫「首頁『此刻的台東』目前是壞的」——**錯的**。查 `src/` 後確認整個 codebase 無任何 weather/CWA 程式碼，`SeasonMoment.tsx` 用的是 `src/lib/season.ts` 的靜態季節資料。**天氣功能從未實作，不是壞掉。**

這是我從「key 失效」推論出「功能壞掉」，中間隔了一個沒查證的假設——依 `METHOD.md` §3 只能標 `inferred`，我卻當 `verified` 寫進了日誌與來源清冊。**已更正三處。**

若要實作：需人類重新申請 key（agent 不得註冊帳號或接受服務條款，CHARTER §3 ❌）。

---

## 🟠 高優先

### B-001 — 灰色文獻入口的可及性方案
**軸**：A｜**來源**：JOURNAL 2026-08-06 §2.2

GRB（Angular SPA，無公開 API）與 NDLTD（需 session）皆無法簡單 HTTP 存取。這推翻了 `METHOD.md` §4.2 的假設。而灰色文獻是本專案宣稱的核心優勢——**這個優勢目前是不可及的。**

選項：(a) headless browser（成本高、脆弱）(b) 改用 WebFetch 逐頁（慢但可行）(c) 找替代入口（華藝、Google Scholar）(d) 承認並改寫 METHOD

### B-002 — 完成噶瑪蘭族檢索的辯證探究
**軸**：B｜**來源**：JOURNAL 2026-08-06 §3 F2

F2 目前只能到 `inferred`。依 `GOVERNANCE.md` §4，反命題「記載存在，只是檢索方式找不到」尚未認真檢驗。必須補：
- [ ] 族語名檢索：Kavalan、加禮宛、噶瑪蘭（三者分開查）
- [ ] 聚落名檢索：三間厝、樟原、大峰峰（不要只查「長濱」）
- [ ] 日文檢索（日治時期調查文獻）
- [ ] 跨界檢索：社群跨台東長濱／花蓮豐濱行政界，只查台東會系統性低估
- [ ] 相關脈絡：加禮宛事件

**查完才能決定 F2 升格為缺口主張，或被推翻。**

### B-004 — 修正 `docs/CLAUDE.md` 噶瑪蘭族陳述
**軸**：A｜**來源**：JOURNAL 2026-08-06 §3 F1｜**Tier**：T3（indigenous）→ 開 PR

同時犯時間混淆、層級混淆、實體過度簡化三種錯。修正時須寫明 `as_of: 2002`、`spatial_level: county`、聚落層級另列。

---

## 🟡 中優先

### B-003 — 五篇既有內容的來源追溯
**軸**：A｜47 FAIL。但**真問題不是補 URL**——原 frontmatter 的 sources 只有機構名，沒指向任何具體文獻，「當初這句話根據什麼」的資訊已遺失。
正解：全部降為 `status: seed` + 標注來源待補，而非假裝補個 URL 就合格。見 `NOT-DONE.md`。

### B-007 — 建立實體 registry 骨架
**軸**：跨軸｜依 `ENTITIES.md` P6，對齊中研院 THCTS 與原民會核定部落名冊，不自建。
先做 `ENTITIES.md` §2.1 的七個高風險同名詞（都蘭／卑南／知本／長濱／大武／太麻里／成功）。

### B-008 — COVERAGE 矩陣初始化
**軸**：B｜`[16 鄉鎮市 × 7 族群 × 主題軸 × 語言]`。目前 0% 覆蓋。

---

## ⚪ 低優先

### B-014 — 把確信度紀律套用到 `ops/` 自身
**軸**：跨軸｜**來源**：JOURNAL 2026-08-06 §3 F6

我在寫完方法論後不到一小時，就在日誌裡把一個 `inferred` 當 `verified` 寫出來（CWA「功能壞掉」）。
**沒有任何 HARD-RULE 攔得住**，因為 H1–H21 只檢查 `content/`，不檢查 agent 自己在 `ops/` 裡寫的判斷。

這是規則體系的真實缺口：**迴圈對自己的推論沒有稽核。**
提議：JOURNAL 的「發現」段落強制標確信度，並由 `audit-content.ts` 檢查；推論類陳述須寫出推論鏈。

---

- B-009 CI（GitHub Actions）跑 audit + build
- B-010 `robots.txt` 拒絕 AI 訓練爬蟲（依 R1，即使不可強制，不聲明等於默許）
- B-011 `/about` 改寫：AI 揭露、下架承諾、以及 `PRECEDENT-AND-RISK.md` §3.7 那段原文
- B-012 退場條款（連續 N 月無產出 → 自動產封存頁，不要靜靜爛掉）

### B-015 — lockfile 在 npm 10 / npm 11 之間不同步
**軸**：C（維運）｜**來源**：CI run 31076089801

CI（Node 20 / npm 10）`npm ci` 失敗：`Missing: @swc/helpers@0.5.23 from lock file`。
但本機（Node 24 / npm 11）`npm ci` 通過，且 lockfile 內部一致（next@14.2.35 → @swc/helpers@0.5.5）。
`package.json` engines 限 `>=20 <22`，Zeabur 也 pin Node 20，所以不能改用新版 Node。

**目前處置**：CI 改為 `npm ci || npm install`。可跑，但**犧牲了可重現性**——這是技術債，不是解法。
**正解**：用 Node 20 的 npm 重新產生 lockfile 並提交（需要一台裝 Node 20 的環境，或在 CI 裡產生後回推）。

---

## 🔴 上線前必辦（阻擋部署）

### B-016 — rotate 資料庫密碼並開啟 SSL
**軸**：C｜**來源**：2026-08-06 安全評估

`scripts/setup-db.ts` 的硬編碼憑證自 c7eda1b（2026-04-12）公開於 public repo 約 117 天。
`main` 已清除，但 commit `c7eda1b` 的 raw URL **永久可讀**。

**鑑識結果：目前無入侵跡象**——無後門角色、無額外資料庫、無勒索表、資料完整、
交易數（約每 40 秒一次）與受管服務健康檢查相符。GitHub code search 未索引（total_count 0）。

**但暴露面為真**：公網開放（Hetzner 新加坡，TCP 直連）、`root` 為 superuser、`ssl = off`（連線未加密）。

**風險的時間性**：過去四個月大概沒事，因為裡面只有 12 筆假資料，沒有任何值得偷的東西。
**這個結論在 `/question` 上線那天失效**——那時資料庫開始承接真實使用者的姓名、地點與投稿。

→ **必須在收到第一筆真實投稿之前完成**：Zeabur 後台 rotate 密碼、開啟 SSL、
   考慮改用非 superuser 的應用程式帳號、限制來源 IP。

### B-017 — 稽核缺口：`audit-content.ts` 不掃資料庫
**軸**：跨軸｜**來源**：2026-08-06

那 10 筆捏造資料（假投稿、假音檔貢獻者「部落文化工作者」「達悟文化協會」）
**躲過了今天新建的全部 21 條 HARD-RULES**，因為稽核只掃 `content/`。

這與 B-014（不掃 `ops/`）是同一個病：**規則只覆蓋了最容易檢查的那一層。**
→ 稽核需擴及：資料庫內容、`ops/` 的自述判斷。
→ 資料已隔離備份於 `ops/QUARANTINE/2026-08-06-fabricated-seed.json`，四張表已 TRUNCATE。
