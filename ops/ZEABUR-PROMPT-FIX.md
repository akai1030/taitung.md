你上次在「設定 Next.js 服務的環境變數」這一步之前就斷線了，所以 DATABASE_URL 沒有設定。

我從外部驗證確認：
- 網站已經部署成功並可存取（https://taitungmd.zeabur.app 各頁皆 200）
- Pagefind 搜尋索引有正確產生（/pagefind/pagefind.js 回 200）
- 但 POST /api/question 回傳 {"error":"資料庫未設定"} HTTP 503
  → 代表 taitung.md 服務的執行環境沒有 DATABASE_URL

請完成以下兩件事：

## 1. 清理 taitung.md 服務上的舊環境變數

你先前提到這個服務「has its own local PASSWORD variable」，那是 2026-04 舊部署留下的。
舊的 PostgreSQL 我已經刪除了，所以任何指向它的殘留變數都是無效且危險的。

請列出這個服務目前所有環境變數給我看，並清掉所有舊 PostgreSQL 的殘留項
（PASSWORD、舊的 DATABASE_URL、其他 POSTGRES_* 等）。

## 2. 設定 DATABASE_URL

指向現存的那個 PostgreSQL 服務（postgresql-afer）。

因為舊的 PostgreSQL 已經刪除，專案內現在只剩一個 PostgreSQL，
先前的變數命名空間衝突問題已經不存在，可以安全使用變數參照：

DATABASE_URL=postgresql://<使用者>:${POSTGRES_PASSWORD}@<內網主機>.zeabur.internal:<埠>/<資料庫名>

請使用內網主機名（*.zeabur.internal），不要用公網位址。

設定完成後重新部署，並用以下端點驗證（我剛加了一個健康檢查端點）：

GET https://taitungmd.zeabur.app/api/health

預期回傳：
{
  "ok": true,
  "database_url_set": true,
  "db_reachable": true,
  "tables": ["question_responses","sound_entries","story_supplements","weekly_questions"],
  "schema_complete": true
}

若 ok 不是 true，請把完整回應貼給我。

⛔ 提醒：資料表是空的就是正確狀態，不要 INSERT 任何範例資料。
/question 顯示「本週還沒有提問」、/sound 顯示「這裡還沒有任何聲音」都是正確的，不需要修。

請回報：清理前後的環境變數清單、DATABASE_URL 指向的主機與埠（密碼可遮蔽）、
以及 /api/health 的完整回應。
