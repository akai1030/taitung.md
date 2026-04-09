import NavFloat from "@/components/NavFloat";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <>
      <NavFloat />
      <main className="pt-40 pb-32 px-10">
        <div className="max-w-prose mx-auto">
          <ScrollReveal>
            <h1 className="font-display text-h1 font-bold tracking-tight mb-8">
              {"關於"} Taitung.md
            </h1>

            <div className="prose-taitung font-body">
              <p>
                {"Taitung.md 是一座開源的台東知識庫。從臺東大學出發，為所有想認識台東的人而建。"}
              </p>

              <h2>{"不是 wiki，不是部落格"}</h2>
              <p>
                {"它是一個以地理座標為錨點的互動式紀錄片體驗。台東的知識天然帶有空間性——每個部落、每條溪流、每座山都是一個故事的錨點。"}
                {"使用者不應該像翻百科全書一樣閱讀台東，而是像走進台東一樣探索它。"}
              </p>

              <h2>{"核心理念"}</h2>
              <p>
                <strong>{"地圖優先"}</strong>{"：所有內容都掛在地理座標上，地圖是主要導航方式。"}
              </p>
              <p>
                <strong>{"多聲道"}</strong>{"：同一個地方可能有學術研究、部落耆老口述、學生田野筆記、青年行動紀錄，全部並存。"}
              </p>
              <p>
                <strong>{"活的內容"}</strong>{"：季節、祭典、氣候會改變台東的面貌，知識庫也跟著呼吸。"}
              </p>
              <p>
                <strong>{"青年參與"}</strong>{"：青年不只是使用者，更是核心貢獻者和策展人。"}
              </p>

              <h2>{"台東七族"}</h2>
              <p>
                {"台東擁有七個原住民族群：阿美族、排灣族、布農族、卑南族、魯凱族、達悟族、噶瑪蘭族。"}
                {"這座知識庫對原住民文化懷有最深的敬意——織紋和圖騰不是裝飾品，而是有意義地出現在對應的文化區塊。"}
              </p>

              <h2>{"技術"}</h2>
              <p>
                {"建構在 Next.js + TypeScript + Tailwind CSS + MapLibre GL JS 之上。"}
                {"內容用 Markdown + YAML Frontmatter 撰寫，Git 友善，AI 可讀。"}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
