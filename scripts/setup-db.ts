import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL
  || 'postgresql://root:0pVItq3j28nfmJNK65Ui7QhW1H4DT9OY@5.223.88.238:31998/zeabur';

const pool = new Pool({ connectionString: DATABASE_URL });

async function setup() {
  const client = await pool.connect();
  try {
    console.log('Connected to database.');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS weekly_questions (
        id SERIAL PRIMARY KEY,
        week INT UNIQUE NOT NULL,
        question TEXT NOT NULL,
        date_start DATE NOT NULL,
        date_end DATE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table weekly_questions created.');

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
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table question_responses created.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS sound_entries (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        place VARCHAR(100),
        township VARCHAR(50),
        coordinates POINT,
        file_url VARCHAR(500),
        duration VARCHAR(20),
        contributor VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table sound_entries created.');

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
    console.log('Table story_supplements created.');

    // Seed weekly questions
    await client.query(`
      INSERT INTO weekly_questions (week, question, date_start, date_end) VALUES
      (14, '你在台東最想念的聲音是什麼？', '2026-04-07', '2026-04-13'),
      (15, '如果只能帶一個人去認識台東，你會帶他去哪裡？', '2026-04-14', '2026-04-20')
      ON CONFLICT (week) DO NOTHING;
    `);
    console.log('Seeded weekly_questions.');

    // Seed question responses
    const { rows } = await client.query(`SELECT id FROM weekly_questions WHERE week = 14`);
    if (rows.length > 0) {
      const qid = rows[0].id;
      // Check if responses already exist
      const existing = await client.query(`SELECT COUNT(*) FROM question_responses WHERE question_id = $1`, [qid]);
      if (parseInt(existing.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO question_responses (question_id, author_name, place, content, is_anonymous) VALUES
          ($1, '匿名', '台東市', '知本溪夜晚的溪水聲，小時候阿嬤家旁邊就是溪，入睡前一定會聽到。', true),
          ($1, '小林', '池上鄉', '收割季拖拉機轟隆隆的聲音，那代表豐收。', false),
          ($1, '匿名', '蘭嶼', '拼板舟下水時，族人一起唱的歌。那個旋律在海上特別清楚。', true),
          ($1, '阿美', '都蘭', '海浪打在礁石上的聲音，每天早上衝浪前都會先聽一下浪的節奏。', false);
        `, [qid]);
        console.log('Seeded question_responses.');
      } else {
        console.log('question_responses already seeded, skipping.');
      }
    }

    // Seed sound entries
    const soundCount = await client.query(`SELECT COUNT(*) FROM sound_entries`);
    if (parseInt(soundCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO sound_entries (title, description, place, township, duration, contributor) VALUES
        ('都蘭海浪', '清晨六點，都蘭鼻的太平洋浪聲', '都蘭鼻', '東河鄉', '2:30', '阿海'),
        ('池上稻浪', '秋收前，風吹過金色稻田的聲音', '伯朗大道', '池上鄉', '1:45', '小農'),
        ('豐年祭歌聲', '馬蘭部落豐年祭的迎賓舞曲', '馬蘭部落', '台東市', '3:20', '部落文化工作者'),
        ('知本溪流', '夜晚的知本溪，蟲鳴與溪水交織', '知本溫泉', '台東市', '4:10', '匿名'),
        ('蘭嶼拼板舟', '拼板舟下水祭典的吟唱', '朗島部落', '蘭嶼鄉', '2:55', '達悟文化協會'),
        ('台東火車站', '普悠瑪號進站的廣播與列車聲', '台東車站', '台東市', '1:20', '旅人');
      `);
      console.log('Seeded sound_entries.');
    } else {
      console.log('sound_entries already seeded, skipping.');
    }

    console.log('\nAll done! Database setup complete.');
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
