接續剛才中斷的工作。上次進度：新的 PostgreSQL 已建立，四張表已建好，
但在驗證資料表狀態時斷線。沒有任何寫入動作被中斷。

你先前指出「專案內有兩個 PostgreSQL 服務時，${POSTGRES_*} 變數參照可能靜默解析到錯誤的資料庫」——
這個判斷是正確的，請照這個結論處理。**修正我原本的指示：不要使用 ${POSTGRES_PASSWORD} 變數參照。**
在舊的 PostgreSQL 服務被刪除之前，DATABASE_URL 請直接使用「新」PostgreSQL 服務面板上的
完整字面連線字串，確保不會指到舊的那個。

請依序完成：

## 1. 確認新資料庫狀態
連到「新」的 PostgreSQL，確認這四張表存在且都是 0 筆：
weekly_questions / question_responses / sound_entries / story_supplements

⛔ 確認完就好，**不要 INSERT 任何資料**。四張表都是空的就是正確狀態。
不要範例投稿、不要示範問題、不要測試音檔、不要 placeholder。一筆都不要。
這個網站收錄的是真實使用者投稿與涉及原住民族部落的內容，先前就是因為被塞了假的社群
投稿（假姓名、假地點、掛在真實原住民族組織名下的不存在錄音）而必須全部清除。

## 2. 先清理 taitung.md 服務上的舊環境變數

你提到 taitung.md 服務「has its own local PASSWORD variable」——那是 2026-04 舊部署留下的。
請列出這個服務目前**所有**環境變數給我看，並清掉所有指向舊 PostgreSQL 的殘留項
（例如舊的 DATABASE_URL、PASSWORD、POSTGRES_* 等）。

理由：如果服務上還留著指向舊資料庫的 DATABASE_URL，網站會成功連上舊的、
表面完全正常，但真實使用者投稿會全部寫進那個即將被刪除的服務裡。
**這種錯不會報錯，只會安靜地把資料寫到錯的地方。**

清理後這個服務應該只剩一個資料庫相關變數：指向「新」PostgreSQL 的 DATABASE_URL。

## 3. 設定 Next.js 服務
Git repository：https://github.com/akai1030/taitung.md，分支 main

| 項目 | 值 |
|---|---|
| Node 版本 | 20（package.json engines 限制 >=20 <22，用 22 以上會失敗） |
| Build command | npm run build |
| Start command | npm start |

四個不可更動的限制：
1. Node 必須是 20
2. Build command 必須就是 `npm run build`，不要改寫。它會自動觸發 postbuild 產生
   Pagefind 搜尋索引。若被改寫而跳過 postbuild，/search 會失效且不會有任何錯誤訊息。
3. 不可使用 static export。/question、/sound、/api/question 是動態路由，首頁是 ISR，
   必須跑 Node server。
4. 不要修改 next.config.mjs、package.json 的 scripts、或 zbpack.json。

環境變數只需要一個 DATABASE_URL，值為「新」PostgreSQL 的完整字面連線字串。
主機請優先使用內網位址（*.zeabur.internal），不要用公網 IP。

設定完成後，請把你實際填入 DATABASE_URL 的主機名與埠號告訴我（密碼可遮蔽），
讓我確認指向的是新服務而不是舊的。

## 4. 部署並逐項驗證

| 路徑 | 預期結果 |
|---|---|
| / | 正常顯示，「本週提問」區塊顯示「本週還沒有提問」 |
| /api/question | 回傳 {"question":null,"responses":[]}。若 500/503 代表 DATABASE_URL 有問題 |
| /search | 輸入「都蘭」或「阿美」能搜到文章。若顯示「搜尋索引尚未建立」代表 postbuild 沒跑到 |
| /question | 顯示「本週還沒有提問」 |
| /sound | 顯示「這裡還沒有任何聲音」 |
| /story/amis | 文章正常顯示 |
| /map | 地圖正常載入 |

/question 顯示「本週還沒有提問」、/sound 顯示「這裡還沒有任何聲音」——
這兩個都是正確狀態，不是 bug，不需要修，不要填東西進去。

請回報：
1. taitung.md 服務清理前後的完整環境變數清單
2. DATABASE_URL 指向的主機與埠（密碼可遮蔽）——我要確認是新服務不是舊的
3. 部署網址
4. Node 版本與實際使用的 build command
5. 上表每一項的實際結果

第 2 項最重要。請直接告訴我那個主機名，不要只說「已設定完成」。
