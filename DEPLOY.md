# DEPLOY — Zeabur 部署與資料庫憑證輪替

> 這份文件同時給人看，也可以整段貼給 Zeabur AI 執行。
> 每一步都標了「誰做」與「為什麼」。**步驟順序不可調換的地方已標明。**

最後更新：2026-08-07

---

## A. 專案特徵（Zeabur 需要知道的）

| 項目 | 值 | 說明 |
|---|---|---|
| 框架 | Next.js 14.2.35 App Router | |
| Node | **20**（`.nvmrc` 與 `package.json` engines `>=20 <22`） | 不可用 22+ |
| Build | `npm run build` | 會自動觸發 `postbuild` |
| Postbuild | `pagefind --site .next/server/app --output-path public/pagefind` | **搜尋索引。少了這步 `/search` 會顯示「索引尚未建立」** |
| Start | `npm start`（`next start`） | |
| Output | 一般模式（非 `standalone`、非 `export`） | |
| 需要環境變數 | `DATABASE_URL`（僅此一個） | |

### ⚠️ 不能用靜態匯出

`/question`、`/sound`、`/api/question` 是**動態路由**（`force-dynamic`），首頁是 ISR（`revalidate = 300`）。
必須跑 Node server，不能改成 static export，否則投稿功能會整個失效。

### 為什麼 postbuild 必須在 build 之後、start 之前

pagefind 索引的是 `.next/server/app` 裡的建置產物，輸出到 `public/pagefind/`。
Next 在執行期才讀 `public/`，所以順序是 `build → pagefind → start`。
`npm run build` 已內建觸發 postbuild，**只要 Zeabur 用 `npm run build` 就會自動完成**。

---

## B. 資料庫憑證輪替（B-016）

### 為什麼一定要做

`scripts/setup-db.ts` 曾硬編碼完整連線字串（含密碼）進 public repo，自 commit `c7eda1b`
（2026-04-12）起公開約 117 天。`main` 已清除，但**該 commit 的 raw URL 永久可讀**。

2026-08-06 鑑識：**無入侵跡象**（無後門角色、無額外資料庫、無勒索表、資料完整，
交易頻率與健康檢查相符）。過去無事的原因很現實——裡面只有 12 筆假資料，沒有值得偷的東西。

**但 `/question` 上線後，資料庫會開始承接真實使用者的姓名、地點與投稿。到那時這個結論就失效。**

### 🔴 最重要的一件事：改環境變數沒有用

**在 Zeabur 面板改 `POSTGRES_PASSWORD`，密碼不會改變。**

Docker 官方 postgres image 的 `POSTGRES_PASSWORD` **只在資料目錄為空、首次初始化時生效**。
這個資料庫從 2026-04 就存在，volume 有資料，該變數會被**完全忽略**。

更危險的是它會製造不一致：面板顯示新密碼、連線字串給你新的，但資料庫實際只認舊密碼。
**你會以為換好了，於是停止擔心——這比不換更糟。**

### 正確順序（不可調換）

```
步驟 1  對資料庫執行 SQL          ← 這一步才真的改變密碼
步驟 2  更新 Zeabur 面板的變數     ← 讓面板顯示與實際一致
步驟 3  更新應用服務的 DATABASE_URL
步驟 4  重啟應用服務
步驟 5  驗證舊密碼已失效
```

先做 2 再做 1，中間那段時間面板是錯的，任何照面板設定的服務都會連不上。

### 步驟 1 —— 改密碼（SQL）

```sql
ALTER USER root WITH PASSWORD '<新密碼>';
```

新密碼請用 32 字元以上隨機字串。產生方式：

```bash
openssl rand -base64 36 | tr -d '/+=' | head -c 40
```

### 步驟 2 —— Zeabur 面板

PostgreSQL 服務 → **Variables** 分頁 → 把 `POSTGRES_PASSWORD` 改成同一個值。
（這一步不會改變資料庫，只是讓面板顯示的連線字串正確。）

### 步驟 3 —— 應用服務的 DATABASE_URL

Next.js 服務 → **Variables** 分頁 → `DATABASE_URL`。

**建議改用變數參照，而不是貼死字串**，這樣以後換密碼不必兩邊都改：

```
DATABASE_URL=postgresql://root:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/zeabur
```

Zeabur 支援 `${VAR}` 跨服務參照並自動注入。

### 步驟 4 —— 改走內網（強烈建議）

PostgreSQL 服務 → **Networking** 分頁，會看到 `xxx.zeabur.internal` 的主機名與埠。
**把 `DATABASE_URL` 指向內網主機名，不要走公網 IP。**

理由：目前資料庫在 Hetzner 新加坡的公網 IP、TCP 埠對全世界開放、`ssl = off`（連線未加密）。
改走內網後，資料庫不再需要對公網暴露，這比開 SSL 更根本地解決問題。

> **關於 SSL**：Zeabur 的 PostgreSQL 是容器化服務，`ssl = off` 是預設。
> 若走內網，流量不出 Zeabur 內部網路，SSL 的必要性大幅降低。
> 若因故必須走公網，則需在連線字串加 `?sslmode=require`，並確認伺服器端已啟用 SSL——
> 這需要掛載憑證並改 `postgresql.conf`，在 Zeabur 上較麻煩。**優先選內網。**

### 步驟 5 —— 驗證

用**舊**密碼連線，應該失敗：

```bash
psql "postgresql://root:<舊密碼>@<host>:<port>/zeabur" -c "select 1"
# 預期：FATAL: password authentication failed for user "root"
```

用**新**密碼連線，應該成功且看得到四張表：

```bash
psql "postgresql://root:<新密碼>@<host>:<port>/zeabur" -c "\dt"
# 預期：question_responses / sound_entries / story_supplements / weekly_questions
```

**兩個都驗過才算完成。** 只驗新密碼會漏掉「舊密碼還活著」這個最危險的狀況。

---

## C. 部署檢查清單

- [ ] Zeabur 專案已連上 `github.com/akai1030/taitung.md` 的 `main`
- [ ] Node 版本為 20
- [ ] Build command 為 `npm run build`（會自動跑 pagefind）
- [ ] Start command 為 `npm start`
- [ ] `DATABASE_URL` 已設定（建議用 `${POSTGRES_PASSWORD}` 參照 + 內網主機名）
- [ ] 密碼已依 §B 輪替，且**新舊都驗過**
- [ ] 部署後逐頁確認：

| 路徑 | 預期 |
|---|---|
| `/` | 顯示「本週還沒有提問」（資料庫是空的，這是正確的） |
| `/search` | 輸入字能搜到故事。若顯示「索引尚未建立」→ postbuild 沒跑到 |
| `/question` | 顯示「本週還沒有提問」。**這是正確狀態**——問題要由人工新增 |
| `/sound` | 顯示「這裡還沒有任何聲音」。**這是正確狀態**——需要真實錄音 |
| `/story/amis` | 文章正常顯示 |

---

## D. 資料庫目前狀態

四張表**都是空的**，這是刻意的。

2026-08-06 移除了 10 筆捏造資料（4 筆假投稿、6 筆假音檔條目，含掛在「部落文化工作者」
與「達悟文化協會」名下的不存在錄音）。原始資料保留於
`ops/QUARANTINE/2026-08-06-fabricated-seed.json`，**不得回填**。

Schema 已於同日 migrate：`sound_entries.file_url` 改為 `NOT NULL`（沒檔案就不該有條目），
並新增 `indigenous` / `tk_notice` / `consent_verified` 欄位。

### 上線後要新增第一個每週提問

問題由**人**設定，不是 agent（`weekly_questions.created_by` 預設 `'human'`）：

```sql
INSERT INTO weekly_questions (week, question, date_start, date_end)
VALUES (32, '<你的問題>', '2026-08-10', '2026-08-16');
```

在這之前，`/question` 顯示「本週還沒有提問」是**正確的**，不是壞掉。

---

## E. 給 Zeabur AI 的一段話（可整段複製）

```
這是一個 Next.js 14 App Router 專案，需要以下設定：

1. Node 版本 20（不可用 22 以上，package.json engines 限制 >=20 <22）
2. Build command: npm run build（此指令會自動觸發 postbuild 產生 pagefind 搜尋索引，
   不要跳過或改寫 build 指令，否則 /search 會失效）
3. Start command: npm start
4. 不可使用 static export——/question、/sound、/api/question 是動態路由，需要 Node server
5. 需要環境變數 DATABASE_URL，指向本專案的 PostgreSQL 服務。
   請使用內網主機名（*.zeabur.internal）而非公網 IP，並用 ${POSTGRES_PASSWORD} 參照：
   DATABASE_URL=postgresql://root:${POSTGRES_PASSWORD}@<內網主機>:<埠>/zeabur

另外關於 PostgreSQL 密碼輪替，請注意：
這個資料庫的 volume 早已初始化，因此修改 POSTGRES_PASSWORD 環境變數「不會」改變實際密碼
（Docker postgres image 的該變數僅在首次初始化時生效）。
必須先執行 SQL「ALTER USER root WITH PASSWORD '<新密碼>';」實際改變密碼，
再更新 POSTGRES_PASSWORD 變數使面板顯示一致。順序不可顛倒。
完成後請同時用舊密碼與新密碼各驗證一次：舊的必須失敗，新的必須成功。
```
