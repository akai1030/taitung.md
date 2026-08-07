# 給 Zeabur AI 的提示詞

> 從下面 `═══` 之間整段複製貼上即可。已內含 schema SQL，不需要另外跑腳本。

═══════════════════════════════════════════════════════════

請幫我完成以下部署設定。這是一個 Next.js 專案，需要一個全新的 PostgreSQL。

## 一、建立新的 PostgreSQL 服務

在這個專案裡新增一個 **PostgreSQL** 服務。

**重要：不要沿用專案裡既有的那個 PostgreSQL。** 舊的那個連線憑證曾經外洩，我會自己手動刪除它。新服務請讓 Zeabur 自動產生全新密碼。

建立完成後，請到該服務的 **Networking** 分頁，取得內網主機名（`*.zeabur.internal`）與埠號。**接下來一律使用內網位址，不要使用公網 IP。**

## 二、建立資料表

連到新的 PostgreSQL，執行以下 SQL：

```sql
CREATE TABLE IF NOT EXISTS weekly_questions (
  id SERIAL PRIMARY KEY,
  week INT UNIQUE NOT NULL,
  question TEXT NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'human',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_responses (
  id SERIAL PRIMARY KEY,
  question_id INT REFERENCES weekly_questions(id),
  author_name VARCHAR(100) DEFAULT '匿名',
  place VARCHAR(100),
  content TEXT NOT NULL,
  response_type VARCHAR(20) DEFAULT 'text',
  is_anonymous BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  submission_ip_hash TEXT,
  submitted_via VARCHAR(30) NOT NULL DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sound_entries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  place VARCHAR(100),
  township VARCHAR(50),
  coordinates POINT,
  file_url VARCHAR(500) NOT NULL,
  duration VARCHAR(20),
  contributor VARCHAR(100),
  indigenous BOOLEAN NOT NULL DEFAULT false,
  tk_notice VARCHAR(50),
  consent_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_supplements (
  id SERIAL PRIMARY KEY,
  story_slug VARCHAR(100) NOT NULL,
  supplement_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  author_name VARCHAR(100) DEFAULT '匿名',
  is_anonymous BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 三、⛔ 絕對不要塞任何範例資料

**這是本次設定最重要的一條要求。**

建完表之後**不要 INSERT 任何資料**——不要範例投稿、不要示範問題、不要測試音檔、不要 placeholder、不要「讓畫面看起來比較完整」的假資料。**一筆都不要。**

原因：這個網站收錄的是真實使用者對台東的投稿，以及涉及原住民族部落的內容。這個專案先前就是因為 seed 了假的社群投稿（假姓名、假地點、以及掛在真實原住民族組織名下的不存在錄音）而必須全部清除。捏造社群參與內容會直接摧毀這個網站的正當性。

**四張表都是空的，就是正確狀態。**

部署後你會看到：
- 首頁顯示「本週還沒有提問」
- `/question` 顯示「本週還沒有提問」「還沒有人回答」
- `/sound` 顯示「這裡還沒有任何聲音」

**這些都是正確的，不是 bug，不需要修，也不需要填東西進去。**

## 四、Next.js 服務設定

Git repository：`https://github.com/akai1030/taitung.md`，分支 `main`

| 項目 | 值 |
|---|---|
| Node 版本 | **20** |
| Build command | `npm run build` |
| Start command | `npm start` |

### 四個不可更動的限制

1. **Node 必須是 20。** `package.json` 的 engines 限制 `>=20.0.0 <22.0.0`，用 22 以上會失敗。

2. **Build command 必須就是 `npm run build`，不要改寫成其他指令。**
   這個指令會自動觸發 `postbuild`，產生 Pagefind 搜尋索引。
   若 build 指令被改寫而跳過 postbuild，`/search` 頁面會失效——**而且不會有任何錯誤訊息**，只會顯示「搜尋索引尚未建立」。這是最容易被忽略的失敗模式。

3. **不可使用 static export（`output: 'export'`）。**
   `/question`、`/sound`、`/api/question` 是動態路由（`force-dynamic`），首頁使用 ISR（`revalidate = 300`）。必須跑 Node server。改成靜態匯出會讓投稿功能完全失效。

4. **不要修改 `next.config.mjs`、`package.json` 的 scripts、或 `zbpack.json`。** 這些已經設定好了。

### 環境變數

只需要一個：

```
DATABASE_URL=postgresql://<使用者>:${POSTGRES_PASSWORD}@<內網主機>.zeabur.internal:<埠>/<資料庫名>
```

請使用 `${POSTGRES_PASSWORD}` 變數參照，不要貼死密碼字串，這樣以後輪替憑證只需改一個地方。
主機請用第一步取得的 `*.zeabur.internal` 內網位址。

## 五、部署後請逐項驗證並回報

| 路徑 | 預期結果 |
|---|---|
| `/` | 正常顯示，「本週提問」區塊顯示「本週還沒有提問」 |
| `/search` | 輸入「都蘭」或「阿美」能搜到文章。**若顯示「搜尋索引尚未建立」，代表 postbuild 沒跑到，請檢查 build command 是否被改寫** |
| `/question` | 顯示「本週還沒有提問」（正確狀態） |
| `/api/question` | 回傳 `{"question":null,"responses":[]}`。**若回傳 503 或 500，代表 DATABASE_URL 沒設好** |
| `/sound` | 顯示「這裡還沒有任何聲音」（正確狀態） |
| `/story/amis` | 文章正常顯示 |
| `/map` | 地圖正常載入 |

`/api/question` 那一項最關鍵——它能同時驗證資料庫連線和 API route 都正常。

請完成後告訴我：部署網址、Node 版本、實際使用的 build command、以及上表每一項的結果。

═══════════════════════════════════════════════════════════

---

## 給陳昀楷的備註（這段不要貼給 Zeabur AI）

**新服務跑起來、上表全部驗證通過之後，才刪舊的 PostgreSQL。**
在那之前舊服務是唯一的回退路徑。

舊服務刪除後：
- `5.223.88.238:31998` 這個曾公開 117 天的端點正式失效
- 2026-08-07 輪替的那組密碼也隨之作廢，不必再當敏感資料保管
- `ops/BACKLOG.md` 的 B-016 可標記完成

**上線後要新增第一個每週提問**（由人設定，不是 agent）：

```sql
INSERT INTO weekly_questions (week, question, date_start, date_end)
VALUES (32, '<你的問題>', '2026-08-10', '2026-08-16');
```
