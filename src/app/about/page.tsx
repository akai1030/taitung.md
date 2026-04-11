import NavFloat from "@/components/NavFloat";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <NavFloat />
      <main className="pt-40 pb-32 px-8">
        <div className="max-w-prose mx-auto">
          <ScrollReveal>
            <h1 className="font-display text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight mb-8">
              關於 Taitung.md
            </h1>

            <div className="prose-taitung font-body">
              <p>
                Taitung.md 是一座開源的台東知識庫。先感覺到，才開始讀。
              </p>
              <p>
                使用者打開網站的前五秒，應該感受到海、空氣、陽光——不是看到分類格子。然後被一篇故事吸引，進入多聲道的對話式閱讀。然後被一個問題打動，留下自己的回答。
              </p>

              <h2>不是 wiki，不是部落格，不是資料庫</h2>
              <p>
                它是一個讓人走進台東的入口。每篇故事的不同聲道——學術研究、口述歷史、田野筆記、青年行動——在同一頁面上交織對話。不是 tab 切換，是一場圓桌。
              </p>

              <h2>內容真實至上</h2>
              <p>
                每一句出現在網站上的話都有來源。AI 不生成任何實質內容——不寫口述歷史、不捏造數據、不虛構引言。AI 做基礎建設：程式碼、設計系統、資料處理。
              </p>

              <h2>台東七族</h2>
              <p>
                台東擁有七個原住民族群：阿美族（Amis）、排灣族（Paiwan）、布農族（Bunun）、卑南族（Puyuma）、魯凱族（Rukai）、達悟族（Tao）、噶瑪蘭族（Kavalan）。
              </p>
              <p>
                這座知識庫對原住民文化懷有最深的敬意。織紋和圖騰不是裝飾品，而是有意義地出現在對應的文化區塊。
              </p>

              <h2>參與方式</h2>
              <p>
                Taitung.md 的參與方式從低門檻到高門檻：
              </p>
              <ul>
                <li>回答每週提問（打字 200 字以內）</li>
                <li>補充現有故事（事實補充、個人經歷、錯誤修正）</li>
                <li>投遞線索（地點 + 一兩句描述）</li>
                <li>上傳照片或聲音</li>
                <li>提交完整文章</li>
                <li>GitHub PR（技術貢獻者）</li>
              </ul>

              <h2>技術棧</h2>
              <p>
                Next.js 14 + TypeScript + Tailwind CSS + Three.js + MapLibre GL + PostgreSQL。內容用 Markdown + YAML Frontmatter 撰寫。部署在 Zeabur。
              </p>
              <p>
                <a href="https://github.com/akai1030/taitung.md" target="_blank" rel="noopener noreferrer">
                  GitHub Repository &rarr;
                </a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
