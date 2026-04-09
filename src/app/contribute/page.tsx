import NavFloat from "@/components/NavFloat";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContributePage() {
  const ways = [
    {
      icon: "\ud83d\udcdd",
      title: "\u6211\u60f3\u5beb\u4e00\u7bc7\u6587\u7ae0",
      description: "\u7dda\u4e0a\u8868\u55ae\uff08\u4e0d\u9700\u8981\u5e33\u865f\uff09",
      difficulty: "\u96f6\u9580\u6abb",
    },
    {
      icon: "\ud83c\udfa4",
      title: "\u6211\u60f3\u5206\u4eab\u53e3\u8ff0\u6545\u4e8b",
      description: "\u9810\u7d04\u9304\u97f3\u6216\u4e0a\u50b3\u9304\u97f3\u6a94",
      difficulty: "\u96f6\u9580\u6abb",
    },
    {
      icon: "\ud83d\udcf8",
      title: "\u6211\u6709\u7167\u7247\u60f3\u5206\u4eab",
      description: "\u4e0a\u50b3\u7167\u7247 + \u7c21\u77ed\u8aaa\u660e",
      difficulty: "\u96f6\u9580\u6abb",
    },
    {
      icon: "\ud83d\udca1",
      title: "\u6211\u77e5\u9053\u4e00\u500b\u597d\u6545\u4e8b",
      description: "\u7559\u4e0b\u7dda\u7d22\uff0c\u6211\u5011\u4f86\u5beb",
      difficulty: "\u96f6\u9580\u6abb",
    },
    {
      icon: "\ud83d\udcbb",
      title: "\u6211\u6703\u7528 GitHub",
      description: "\u76f4\u63a5\u958b PR",
      difficulty: "\u6280\u8853\u8005",
    },
  ];

  return (
    <>
      <NavFloat />
      <main className="pt-40 pb-32 px-10">
        <div className="max-w-content mx-auto">
          <ScrollReveal>
            <h1 className="font-display text-h1 font-bold tracking-tight mb-4">
              \u4f60\u60f3\u600e\u9ebc\u53c3\u8207\uff1f
            </h1>
            <p className="text-smoke text-lg max-w-prose mb-16">
              \u4e0d\u6703\u7528 GitHub \u4e5f\u6c92\u95dc\u4fc2\u3002\u4f60\u7684\u6545\u4e8b\u3001\u4f60\u7684\u7167\u7247\u3001\u4f60\u7684\u8072\u97f3\uff0c\u90fd\u662f\u53f0\u6771\u77e5\u8b58\u7684\u4e00\u90e8\u5206\u3002
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
