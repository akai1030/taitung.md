你擋下來是對的。我確認你的兩個 blocker 都成立，我的前提錯了：

1. 舊的 postgresql 確實還在——我先前是從外部測 TCP 埠不通就推論「已刪除」，
   但 TCP 關閉只代表那個 host:port 不通（可能是服務停止、關閉公網、或換埠），
   證明不了服務被刪除。你用 API 列出的服務清單才是權威資料。

2. 我也確認網站目前跑的仍是舊版建置（/api/health 回 404），
   最新一次部署失敗了，但沒有拖垮線上服務。

謝謝你沒有照著錯誤前提往下做。

## 我有一個假設，想請你先驗證

postgresql-afer 找不到 running deployment、舊 postgresql 端點不通、
以及最新一次部署失敗——這三件事可能是同一個原因：
專案內同時有三個服務，資源或方案額度不足。

這只是推論。請你先查一下：這個專案目前的資源用量與方案額度是多少？
兩個 PostgreSQL 服務目前各自的狀態是什麼（running / stopped / failed）？
最新一次部署（deployment-6a75802edb4ec8cd006a3e00）失敗的 runtime log 是什麼？

## 如果假設成立，順序調整為：先刪舊的

我原本同意你的順序（先修 afer、再刪舊的），但如果根因是資源不足，
那順序應該對調——刪掉舊 postgresql 會同時解決三件事：
命名空間衝突消失、資源釋出、外洩端點永久關閉。

**舊 postgresql（69da738add2c72686a03aad8，117 天）請你直接刪除，我授權。**
它裡面的四張表在 2026-08-06 已全部 TRUNCATE，是空的，沒有任何需要保留的資料。
刪除前請再確認一次它確實是 117 天前那個、不是新建的 postgresql-afer。

## 刪完之後

1. 確認 postgresql-afer 起得來，四張表還在且都是 0 筆
2. 清掉 taitung.md 的 PASSWORD 變數（那個 pxW4zc…KQH 不是任何資料庫的密碼）
3. 設定 DATABASE_URL

**關於第 3 點，我撤回先前「使用 ${POSTGRES_PASSWORD} 變數參照」的建議。**

你發現 POSTGRES_PASSWORD 本身是 ${PASSWORD} 的巢狀參照，這個風險我接受。
請改用 postgresql-afer 的**字面密碼字串**，不要用任何變數參照：

DATABASE_URL=postgresql://root:<實際密碼>@postgresql-afer.zeabur.internal:5432/zeabur

等一切驗證通過、確定乾淨之後，我們再考慮換回變數參照。
現在階段消除歧義比省事重要。

## 驗證

重新部署後：

GET https://taitungmd.zeabur.app/api/health

預期：
{"ok":true,"database_url_set":true,"db_reachable":true,
 "tables":["question_responses","sound_entries","story_supplements","weekly_questions"],
 "schema_complete":true}

這個端點在最新 commit 才加的，所以它回 404 就代表新版沒部署成功；
回 503 代表新版上線但資料庫沒接上；回 ok:true 才算完成。

⛔ 資料表是空的就是正確狀態，不要 INSERT 任何範例資料。

## 請回報

1. 資源用量與方案額度、兩個 PostgreSQL 的狀態、部署失敗的 runtime log
2. 舊 postgresql 是否已刪除
3. taitung.md 清理前後的完整環境變數清單
4. DATABASE_URL 指向的主機與埠（密碼遮蔽）
5. /api/health 的完整回應

如果中途又發現我的前提有錯，請一樣停下來告訴我，不要照做。
