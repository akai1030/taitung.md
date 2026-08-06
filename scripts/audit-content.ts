#!/usr/bin/env npx tsx
/**
 * audit-content.ts — 把 ops/HARD-RULES.md 變成可執行的檢查
 *
 * 這支腳本是整個自主營運迴圈的守門員。設計原則（見 ops/HARD-RULES.md）：
 *   不能被機器執行的規則不是規則，是願望。
 *
 * 用法：
 *   npx tsx scripts/audit-content.ts                  # 檢查全部（僅新違規會 FAIL）
 *   npx tsx scripts/audit-content.ts --strict         # 忽略 baseline，全部 FAIL 都算
 *   npx tsx scripts/audit-content.ts --write-baseline # 把當前 FAIL 記為既有債務
 *   npx tsx scripts/audit-content.ts --links          # 加上 H4 連結存在性驗證（會發網路請求）
 *   npx tsx scripts/audit-content.ts --json           # 機器可讀輸出
 *
 * 離開碼：0 = 無新違規；1 = 有新違規
 *
 * ── 關於 baseline ──
 * 既有 5 篇內容有 47 項 FAIL。若讓 CI 永遠紅燈，規則就會被忽略——
 * 那正是 PRECEDENT-AND-RISK §1.2 說的「規則越全面越沒人執行」。
 * 所以：既有債務明列在 ops/audit-baseline.json，新違規一律擋。
 * 債務清償進度由 ops/METRICS.md 追蹤，不會被藏起來。
 */

import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const CHECK_LINKS = ARGS.includes("--links");
const JSON_OUT = ARGS.includes("--json");
const STRICT = ARGS.includes("--strict");
const WRITE_BASELINE = ARGS.includes("--write-baseline");
const BASELINE_PATH = join(ROOT, "ops/audit-baseline.json");

type Severity = "FAIL" | "WARN";
interface Finding {
  rule: string;
  severity: Severity;
  file: string;
  line?: number;
  message: string;
  fix: string; // GOVERNANCE R2：異議必須說明修正後應該長什麼樣
}
const findings: Finding[] = [];
const add = (f: Finding) => findings.push(f);

// ─────────────────────────────────────────────────────────
// 詞彙表與偵測樣式
// ─────────────────────────────────────────────────────────

/** ETHICS E18 / H18 —— AI 揭露固定詞彙表，依 ICMJE 2024 分位置 */
const AI_METHODS_VOCAB = ["來源蒐集", "連結查證", "結構整理", "實體比對", "資料格式轉換"];
const AI_ACK_VOCAB = ["格式轉換", "翻譯初稿", "摘要", "程式碼"];

/** H9 —— 台東七族 + 常見族語/部落詞。命中即須 indigenous: true */
const INDIGENOUS_TERMS = [
  "阿美", "排灣", "布農", "卑南", "魯凱", "達悟", "雅美", "噶瑪蘭",
  "原住民", "部落", "族語", "頭目", "豐年祭", "Ilisin", "ilisin",
  "'Atolan", "Atolan", "Katratripulr", "卡大地布", "馬蘭", "南王",
  "Amis", "Paiwan", "Bunun", "Puyuma", "Rukai", "Tao", "Kavalan",
];

/** H13 —— 受限知識詞表。命中即 WARN 並強制人工 */
const RESTRICTED_TERMS = [
  "祭儀", "祭典程序", "禁忌", "巫師", "祖靈", "靈媒",
  "織紋", "圖騰", "紋樣", "傳統服飾",
];

/** ETHICS E7 —— 凝視語彙 */
const GAZE_TERMS = ["原始的", "純樸", "消失中的", "未開化", "淳樸", "神秘的部落"];

/** ENTITIES §2.1 —— 高風險同名詞 */
const AMBIGUOUS_NAMES = ["都蘭", "卑南", "知本", "長濱", "大武", "太麻里", "成功"];
/** 出現這些限定詞之一，視為已消歧義 */
const DISAMBIGUATORS = [
  "部落", "村", "鄉", "鎮", "市", "山", "溪", "遺址", "糖廠", "文化",
  "溫泉", "漁港", "森林遊樂區", "族", "社",
];

/** H1 —— 量化陳述樣式 */
const QUANT_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\d+(\.\d+)?\s*%/g, label: "百分比" },
  { re: /[一二三四五六七八九十百千萬0-9][0-9,\.]*\s*(人|位|名)/g, label: "人數" },
  { re: /[0-9]{3,4}\s*年/g, label: "年份" },
  { re: /[0-9,\.]+\s*(公頃|平方公里|公里|公尺)/g, label: "面積/距離" },
  { re: /[0-9,\.]+\s*(元|萬元|億元)/g, label: "金額" },
  { re: /約?\s*[一二三四五六七八九十百千萬]+\s*(人|位|名|公頃|年)/g, label: "中文數量" },
];

/** H2 —— 引語 */
const QUOTE_RE = /「([^」]{15,})」/g;

/** ETHICS E21 —— 個資樣式 */
const PII_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\b[A-Z][12]\d{8}\b/g, label: "身分證字號" },
  { re: /\b09\d{2}-?\d{3}-?\d{3}\b/g, label: "手機號碼" },
  { re: /[\w.+-]+@[\w-]+\.[\w.]+/g, label: "電子郵件" },
];

// ─────────────────────────────────────────────────────────
// 工具
// ─────────────────────────────────────────────────────────

function walk(dir: string, ext: string[]): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p, ext));
    else if (ext.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
}

/** 找出某字串首次出現的行號（1-indexed） */
function lineOf(body: string, needle: string): number | undefined {
  const idx = body.indexOf(needle);
  if (idx < 0) return undefined;
  return body.slice(0, idx).split("\n").length;
}

/**
 * 判斷某段文字附近是否有來源標記。
 * 接受的形式：行內 [^n] 註腳、(來源：…)、（資料來源：…）、markdown 連結。
 */
function hasNearbySource(body: string, needle: string, window = 220): boolean {
  const idx = body.indexOf(needle);
  if (idx < 0) return false;
  const seg = body.slice(Math.max(0, idx - window), idx + needle.length + window);
  return (
    /\[\^[^\]]+\]/.test(seg) ||
    /[（(]\s*(來源|資料來源|出處|引自|source)\s*[：:]/i.test(seg) ||
    /\[[^\]]+\]\(https?:\/\/[^)]+\)/.test(seg)
  );
}

async function urlAlive(url: string): Promise<boolean> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 15000);
    let r = await fetch(url, { method: "HEAD", signal: ctl.signal, redirect: "follow" });
    if (r.status === 405 || r.status === 501) {
      r = await fetch(url, { method: "GET", signal: ctl.signal, redirect: "follow" });
    }
    clearTimeout(t);
    return r.status < 400;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────
// 內容檢查
// ─────────────────────────────────────────────────────────

async function auditArticle(file: string) {
  const rel = relative(ROOT, file);
  const raw = readFileSync(file, "utf8");
  const { data: fm, content: body } = matter(raw);

  const sources: any[] = Array.isArray(fm.sources) ? fm.sources : [];
  const hasAnySource = sources.length > 0;

  // ── H5 ai_generated
  if (fm.ai_generated !== false) {
    add({
      rule: "H5", severity: "FAIL", file: rel,
      message: `ai_generated 必須明確為 false（目前：${JSON.stringify(fm.ai_generated)}）`,
      fix: "在 frontmatter 加上 `ai_generated: false`",
    });
  }

  // ── H17/H18 AI 揭露分位置（ICMJE 2024）
  for (const [field, vocab] of [
    ["ai_in_methods", AI_METHODS_VOCAB],
    ["ai_in_acknowledgment", AI_ACK_VOCAB],
  ] as const) {
    if (!(field in fm)) {
      add({
        rule: "H17", severity: "FAIL", file: rel,
        message: `缺少 ${field} 欄位（依 ICMJE 2024 分位置揭露；可為空陣列，但欄位必須存在）`,
        fix: `加上 \`${field}: []\``,
      });
    } else if (Array.isArray(fm[field])) {
      for (const v of fm[field]) {
        if (!vocab.includes(v)) {
          add({
            rule: "H18", severity: "FAIL", file: rel,
            message: `${field} 含詞彙表外的值「${v}」`,
            fix: `改用固定詞彙表其中之一：${vocab.join("／")}`,
          });
        }
      }
    }
  }
  if ("ai_assisted" in fm) {
    add({
      rule: "H17", severity: "WARN", file: rel,
      message: "使用了已淘汰的 ai_assisted 欄位（v1.0 舊格式）",
      fix: "拆成 ai_in_methods 與 ai_in_acknowledgment 兩欄，移除 ai_assisted",
    });
  }

  // ── H3/H14 每筆來源的 accessed 與 license
  sources.forEach((s, i) => {
    const label = s.title || s.name || s.citation || `#${i + 1}`;
    if (!s.accessed) {
      add({
        rule: "H3", severity: "FAIL", file: rel,
        message: `來源「${label}」缺 accessed 日期`,
        fix: "加上 `accessed: YYYY-MM-DD`。網路資源會消失，沒有存取日期的引用等於沒有引用",
      });
    }
    if (!s.license) {
      add({
        rule: "H14", severity: "FAIL", file: rel,
        message: `來源「${label}」缺 license`,
        fix: "加上 `license:`（ogdl-1.0 / cc-by-4.0 / public-domain / unknown）。unknown 者不得進入網站內容",
      });
    } else if (s.license === "unknown") {
      add({
        rule: "H14", severity: "FAIL", file: rel,
        message: `來源「${label}」授權為 unknown，不得用於網站內容`,
        fix: "查明授權，或移除此來源與其支撐的陳述",
      });
    }
    if (s.license === "ogdl-1.0" && !s.attribution_statement) {
      add({
        rule: "H15", severity: "FAIL", file: rel,
        message: `來源「${label}」為 OGDL v1，缺 attribution_statement（顯名聲明）`,
        fix: "加上完整顯名聲明字串。法律要件：未標示者「視為自始未取得授權」",
      });
    }
    if (s.url === "") {
      add({
        rule: "H3", severity: "FAIL", file: rel,
        message: `來源「${label}」的 url 是空字串——這是佔位符，不是來源`,
        fix: "填入真實 URL，或改用 citation 欄位寫完整書目，或刪除此筆",
      });
    }
  });

  // ── H1 量化陳述需有來源
  for (const { re, label } of QUANT_PATTERNS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    const seen = new Set<string>();
    while ((m = re.exec(body))) {
      const hit = m[0].trim();
      if (seen.has(hit)) continue;
      seen.add(hit);
      if (!hasNearbySource(body, hit) && !hasAnySource) {
        add({
          rule: "H1", severity: "FAIL", file: rel, line: lineOf(body, hit),
          message: `${label}「${hit}」沒有可辨識的來源標記`,
          fix: "在該句後加行內註腳 [^n]、（來源：…）或 markdown 連結；並在 frontmatter sources 補上對應條目",
        });
      } else if (!hasNearbySource(body, hit)) {
        add({
          rule: "H1", severity: "WARN", file: rel, line: lineOf(body, hit),
          message: `${label}「${hit}」只有文章層級來源，無行內歸屬——無法判斷是哪一筆來源支撐`,
          fix: "加行內註腳把這個數字綁到特定來源（ENTITIES P4：斷言綁在來源上，不綁在名稱上）",
        });
      }
      // ── H6 量化陳述需有時間與空間層級
      if (!fm.as_of && !/\d{4}\s*年/.test(body.slice(Math.max(0, body.indexOf(hit) - 60), body.indexOf(hit) + 60))) {
        add({
          rule: "H6", severity: "WARN", file: rel, line: lineOf(body, hit),
          message: `${label}「${hit}」附近無時間基準（as_of）`,
          fix: "frontmatter 加 `as_of: YYYY-MM-DD`，或在句中寫明統計年度。ENTITIES §2.4：統計年度與發布年度混淆是最常見的量化錯誤",
        });
      }
      if (!fm.spatial_level) {
        add({
          rule: "H6", severity: "WARN", file: rel,
          message: `含量化陳述但 frontmatter 無 spatial_level`,
          fix: "加 `spatial_level: county|township|village|settlement`。ENTITIES §2.4：縣的數字被寫成部落的，是最常見的層級混淆",
        });
        break;
      }
    }
  }

  // ── H2 引語需有來源
  QUOTE_RE.lastIndex = 0;
  let q: RegExpExecArray | null;
  while ((q = QUOTE_RE.exec(body))) {
    const quote = q[0];
    if (!hasNearbySource(body, quote)) {
      add({
        rule: "H2", severity: "FAIL", file: rel, line: lineOf(body, quote),
        message: `引語（${q[1].length} 字）無來源：${quote.slice(0, 30)}…`,
        fix: "標明說話者與出處。若無出處，刪除引號改為間接敘述——捏造引言是絕對禁令",
      });
    }
  }

  // ── H9 原住民族內容標記
  const indigenousHits = INDIGENOUS_TERMS.filter(
    (t) => body.includes(t) || JSON.stringify(fm.tags || []).includes(t)
  );
  if (indigenousHits.length > 0 && fm.indigenous !== true) {
    add({
      rule: "H9", severity: "FAIL", file: rel,
      message: `命中原住民族相關詞（${indigenousHits.slice(0, 5).join("、")}${indigenousHits.length > 5 ? "…" : ""}）但未標 indigenous: true`,
      fix: "加上 `indigenous: true`。此標記會觸發 H10（禁止自動 commit，須開 PR）與 H11（須有 tk_notice）",
    });
  }

  if (fm.indigenous === true) {
    // ── H11 tk_notice
    if (!fm.tk_notice) {
      add({
        rule: "H11", severity: "FAIL", file: rel,
        message: "indigenous: true 但缺 tk_notice",
        fix: "加上 `tk_notice: open-to-collaborate`（Local Contexts Notice——由機構在尚未聯繫上社群時先行標記）",
      });
    }
    // ── H12 tk_label 只有人類可填
    if (fm.tk_label && fm.tk_label_by !== "human") {
      add({
        rule: "H12", severity: "FAIL", file: rel,
        message: "tk_label 已填但未標明由人類填寫",
        fix: "tk_label 只有部落／族人可以定義。agent 不得自行填寫。若確為人類填寫，加 `tk_label_by: human`",
      });
    }
  }

  // ── H13 受限知識
  const restricted = RESTRICTED_TERMS.filter((t) => body.includes(t));
  if (restricted.length > 0) {
    add({
      rule: "H13", severity: "WARN", file: rel,
      message: `命中受限知識詞（${restricted.join("、")}）——傳智條例涵蓋祭儀、圖案、服飾等傳統文化表達`,
      fix: "人工確認：是否觸及祭儀細節、禁忌知識，或重製受《原住民族傳統智慧創作保護條例》保護的圖案／織紋／服飾",
    });
  }

  // ── E7 凝視語彙
  for (const g of GAZE_TERMS) {
    if (body.includes(g)) {
      add({
        rule: "E7", severity: "WARN", file: rel, line: lineOf(body, g),
        message: `使用凝視語彙「${g}」`,
        fix: "改為具體描述。「純樸」「消失中的」把人當成觀看對象而非敘述主體",
      });
    }
  }

  // ── H7 同名詞消歧義
  for (const name of AMBIGUOUS_NAMES) {
    const re = new RegExp(name + "(.{0,4})", "g");
    let m2: RegExpExecArray | null;
    let bare = 0;
    while ((m2 = re.exec(body))) {
      if (!DISAMBIGUATORS.some((d) => m2![1].startsWith(d))) bare++;
    }
    if (bare > 0) {
      add({
        rule: "H7", severity: "WARN", file: rel,
        message: `「${name}」單獨出現 ${bare} 次未加限定詞——這是 ENTITIES §2.1 的高風險同名詞`,
        fix: `明確寫成「${name}部落」／「${name}鄉」／「${name}山」等。例：長濱鄉（行政區）與長濱文化（舊石器考古文化）是完全不同層次的實體`,
      });
    }
  }

  // ── E21 個資
  for (const { re, label } of PII_PATTERNS) {
    re.lastIndex = 0;
    const m3 = re.exec(body);
    if (m3) {
      add({
        rule: "E21", severity: "FAIL", file: rel, line: lineOf(body, m3[0]),
        message: `疑似個資（${label}）：${m3[0].slice(0, 6)}…`,
        fix: "移除。不得收錄非公開的個人聯絡方式、身分證字號、地址",
      });
    }
  }

  // ── E11 聲道與佐證
  const voices: any[] = Array.isArray(fm.voices) ? fm.voices : [];
  const vtypes = voices.map((v) => (typeof v === "string" ? v : v?.type));
  if (vtypes.includes("oral-history") && !fm.audio) {
    add({
      rule: "E11", severity: "FAIL", file: rel,
      message: "voices 含 oral-history 但無 audio 欄位——沒有音檔的口述歷史是什麼？",
      fix: "補上 audio（含 speaker、source），或移除 oral-history 聲道。捏造口述歷史是絕對禁令",
    });
  }
  if (vtypes.includes("field-note") && !fm.fieldwork) {
    add({
      rule: "E11", severity: "FAIL", file: rel,
      message: "voices 含 field-note 但無 fieldwork 紀錄——沒有人真的去過那個地方",
      fix: "補上 fieldwork（含日期、地點、記錄者），或移除 field-note 聲道",
    });
  }

  // ── H4 連結存在性（選用）
  if (CHECK_LINKS) {
    for (const s of sources) {
      if (s.url && /^https?:\/\//.test(s.url)) {
        const ok = await urlAlive(s.url);
        if (!ok) {
          add({
            rule: "H4", severity: "WARN", file: rel,
            message: `來源連結無回應：${s.url}`,
            fix: "改指向 Wayback Machine 存檔（archive_url），或標記為失效並降低該陳述的確信度",
          });
        }
        await new Promise((r) => setTimeout(r, 2000)); // E16 請求間隔
      }
    }
  }
}

// ─────────────────────────────────────────────────────────
// 迴圈自身的檢查
// ─────────────────────────────────────────────────────────

function auditLoop() {
  // ── H19 今日 JOURNAL
  const jdir = join(ROOT, "ops/JOURNAL");
  const today = new Date().toISOString().slice(0, 10);
  const entries = existsSync(jdir) ? readdirSync(jdir).filter((f) => f.endsWith(".md") && f !== "README.md") : [];
  if (!entries.some((f) => f.startsWith(today))) {
    add({
      rule: "H19", severity: "WARN", file: "ops/JOURNAL/",
      message: `今日（${today}）無研究日誌`,
      fix: "寫 ops/JOURNAL/YYYY-MM-DD.md。CHARTER §4：沒有日誌，跑一百次就是重複第一次",
    });
  }

  // ── H20 NOT-DONE 存在
  if (!existsSync(join(ROOT, "ops/NOT-DONE.md"))) {
    add({
      rule: "H20", severity: "FAIL", file: "ops/NOT-DONE.md",
      message: "缺少 NOT-DONE.md（反倫理蔓延機制）",
      fix: "建立此檔。倫理蔓延最陰險的特徵是它不留證據——做錯的事會被抓到，沒做的事不會",
    });
  }

  // ── H21 不可變文件
  for (const f of ["ops/ETHICS.md", "ops/HARD-RULES.md"]) {
    if (!existsSync(join(ROOT, f))) {
      add({ rule: "H21", severity: "FAIL", file: f, message: "不可變文件遺失", fix: "從 git 還原" });
    }
  }
}

// ─────────────────────────────────────────────────────────

/** 指紋：規則 + 檔案 + 訊息。行號不納入，避免內容微調就失效 */
const fingerprint = (f: Finding) => `${f.rule}|${f.file}|${f.message}`;

async function main() {
  const files = [...walk(join(ROOT, "content"), [".md", ".mdx"])];
  for (const f of files) await auditArticle(f);
  auditLoop();

  const allFails = findings.filter((f) => f.severity === "FAIL");
  const warns = findings.filter((f) => f.severity === "WARN");

  // ── baseline
  if (WRITE_BASELINE) {
    const baseline = {
      note: "既有債務。新違規不得加入此清單——清償進度見 ops/METRICS.md。",
      written: new Date().toISOString().slice(0, 10),
      count: allFails.length,
      fingerprints: allFails.map(fingerprint).sort(),
    };
    writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + "\n");
    console.log(`已寫入 baseline：${allFails.length} 項既有 FAIL → ${relative(ROOT, BASELINE_PATH)}`);
    console.log("此後只有『新』違規會讓 CI 失敗。既有債務由 BACKLOG B-003 清償。");
    process.exit(0);
  }

  let known = new Set<string>();
  if (!STRICT && existsSync(BASELINE_PATH)) {
    try {
      known = new Set(JSON.parse(readFileSync(BASELINE_PATH, "utf8")).fingerprints ?? []);
    } catch { /* baseline 壞掉就當作沒有，從嚴 */ }
  }
  const fails = allFails.filter((f) => !known.has(fingerprint(f)));
  const grandfathered = allFails.length - fails.length;

  if (JSON_OUT) {
    console.log(JSON.stringify(
      { ok: fails.length === 0, new_fails: fails.length, grandfathered, warns: warns.length, findings },
      null, 2));
    process.exit(fails.length ? 1 : 0);
  }

  const byFile = new Map<string, Finding[]>();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file)!.push(f);
  }

  console.log("\n═══ audit-content — ops/HARD-RULES.md 執行結果 ═══\n");
  for (const [file, fs] of [...byFile.entries()].sort()) {
    console.log(`\x1b[1m${file}\x1b[0m`);
    for (const f of fs) {
      const tag = f.severity === "FAIL" ? "\x1b[31mFAIL\x1b[0m" : "\x1b[33mWARN\x1b[0m";
      const loc = f.line ? `:${f.line}` : "";
      console.log(`  ${tag} [${f.rule}]${loc} ${f.message}`);
      console.log(`       → ${f.fix}`);
    }
    console.log("");
  }
  console.log(
    `檢查 ${files.length} 篇內容 ｜ \x1b[31m${fails.length} 新 FAIL\x1b[0m` +
    (grandfathered ? ` ｜ \x1b[90m${grandfathered} 既有債務(baseline)\x1b[0m` : "") +
    ` ｜ \x1b[33m${warns.length} WARN\x1b[0m`
  );
  if (grandfathered) console.log(`既有債務清償進度見 ops/METRICS.md；用 --strict 可看全部`);
  if (!CHECK_LINKS) console.log("（未執行 H4 連結存在性驗證，加 --links 開啟）");
  console.log("");
  process.exit(fails.length ? 1 : 0);
}

main();
