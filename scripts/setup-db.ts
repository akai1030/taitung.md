#!/usr/bin/env npx tsx
/**
 * setup-db.ts — 建立資料表結構。**只建 schema，不塞任何內容。**
 *
 * ⚠️ 2026-08-06 重寫。原版有兩個嚴重問題：
 *
 * 1. 硬編碼了完整的 production 連線字串（含密碼）作為 fallback，
 *    隨 commit c7eda1b 進入 public repo，公開暴露約 117 天。
 *    → 現在一律從 env 讀，讀不到就中止。**絕不在原始碼裡放憑證。**
 *
 * 2. 塞入捏造的社群投稿與音檔條目——包含假姓名（「小林」「阿美」）、
 *    假地點、假時間戳，以及把不存在的錄音掛在「部落文化工作者」與
 *    「達悟文化協會」名下。
 *    直接違反 docs/CONTENT-STRATEGY.md 的絕對紅線：
 *      「社群回答／讀者投稿 — 捏造『匿名 · 台東市 · 3 小時前』
 *        → 社群參與全部變成假的，根基崩塌」
 *    → 原資料已備份於 ops/QUARANTINE/2026-08-06-fabricated-seed.json，不得回填。
 *
 * **這支腳本永遠不得包含 INSERT 任何內容資料的語句。**
 * 每週提問由人類設定；投稿由真實使用者產生；音檔由真實的人錄。
 * 沒有真實內容時，正確的狀態是「空的」，不是「填滿假的」。
 */

import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("✗ 缺少環境變數 DATABASE_URL。");
  console.error("  請放在 .env.local（已被 .gitignore 排除），不要寫進原始碼。");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function setup() {
  const client = await pool.connect();
  try {
    console.log("已連線。開始建立 schema（不塞任何內容資料）。\n");

    await client.query(`
      CREATE TABLE IF NOT EXISTS weekly_questions (
        id SERIAL PRIMARY KEY,
        week INT UNIQUE NOT NULL,
        question TEXT NOT NULL,
        date_start DATE NOT NULL,
        date_end DATE NOT NULL,
        created_by TEXT NOT NULL DEFAULT 'human',   -- 問題只能由人類設定
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("  ✓ weekly_questions");

    await client.query(`
      CREATE TABLE IF NOT EXISTS question_responses (
        id SERIAL PRIMARY KEY,
        question_id INT REFERENCES weekly_questions(id),
        author_name VARCHAR(100) DEFAULT '匿名',
        place VARCHAR(100),
        content TEXT NOT NULL,
        response_type VARCHAR(20) DEFAULT 'text',
        is_anonymous BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        -- 出處驗證：每一筆都必須能追溯到真實提交
        submission_ip_hash TEXT,
        submitted_via VARCHAR(30) NOT NULL DEFAULT 'web',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("  ✓ question_responses");

    await client.query(`
      CREATE TABLE IF NOT EXISTS sound_entries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        place VARCHAR(100),
        township VARCHAR(50),
        coordinates POINT,
        -- file_url 必填：沒有檔案就不該有條目。
        -- 原版 6 筆全是 NULL，等於宣稱有錄音但檔案不存在。
        file_url VARCHAR(500) NOT NULL,
        duration VARCHAR(20),
        contributor VARCHAR(100),
        -- 原住民族相關聲音需標記，供人工審查（ETHICS E6/H13：祭儀內容不收錄）
        indigenous BOOLEAN NOT NULL DEFAULT false,
        tk_notice VARCHAR(50),
        consent_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("  ✓ sound_entries（file_url 改為 NOT NULL）");

    await client.query(`
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
    `);
    console.log("  ✓ story_supplements");

    console.log("\n完成。資料表是空的——這是正確狀態。");
    console.log("每週提問請人工新增；投稿與音檔由真實使用者產生。");
  } catch (err) {
    console.error("建置失敗：", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
