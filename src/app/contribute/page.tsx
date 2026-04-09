import NavFloat from "@/components/NavFloat";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContributePage() {
  const ways = [
    {
      icon: "✍️",
      title: "我想寫一篇文章",
      description: "線上表單（不需要帳號）",
      difficulty: "零門檻",
    },
    {
      icon: "🎤",
      title: "我想分享口述故事",
      description: "預約錄音或上傳錄音檔",
      difficulty: "零門檻",
    },
    {
      icon: "📷",
      title: "我有照片想分享",
      description: "上傳照片 + 簡短說明",
      difficulty: "零門檻",
    },
    {
      icon: "💡",
      title: "我知道一個好故事",
      description: "留下線索，我們來寫",
      difficulty: "零門檻",
    },
    {
      icon: "⌨️",
      title: "我會用 GitHub",
      description: "直接開 PR",
      difficulty: "技術者",
    },
  ];

  return (
    <>
      <NavFloat />
      <main className="pt-40 pb-32 px-10">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <h1 className="font-display text-h1 font-bold tracking-tight mb-4">
              {"你想怎麼參與？"}
            </h1>
            <p className="text-smoke text-lg max-w-prose mb-16">
              {"不會用 GitHub 也沒關係。你的故事、你的照片、你的聲音，都是台東知識的一部分。"}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/[0.06]">
            {ways.map((way) => (
              <ScrollReveal key={way.title}>
                <div className="bg-cream p-10 hover:bg-sand transition-colors cursor-pointer group">
                  <span className="text-3xl block mb-4">{way.icon}</span>
                  <h3 className="font-display text-lg font-bold mb-2">
                    {way.title}
                  </h3>
                  <p className="text-sm text-smoke mb-4">{way.description}</p>
                  <span className="text-xs text-stone px-2 py-0.5 bg-sand rounded-full">
                    {way.difficulty}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
