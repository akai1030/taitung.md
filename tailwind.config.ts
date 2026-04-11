import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: { DEFAULT: "#F5F0E8", deep: "#E8E0D0" },
        cream: "#FAF8F3",
        ink: { DEFAULT: "#1E1D1A", soft: "#3D3B35" },
        smoke: "#8A8578",
        stone: "#B8B0A2",
        pacific: { DEFAULT: "#1B5E7B", faint: "#EEF5F8" },
        valley: { DEFAULT: "#3A6B42", faint: "#EDF5EE" },
        sunrise: { DEFAULT: "#C8782A", faint: "#FBF3EA" },
        gold: { DEFAULT: "#d4a44a", light: "#e0b458" },
        volcano: "#C53D3D",
        // 地景層色
        layer: {
          land: "#8B7355",
          time: "#A0522D",
          people: "#D4922A",
          knowledge: "#2B6CB0",
          living: "#7B8B6F",
          celebration: "#C53D3D",
          experience: "#4A90B8",
          youth: "#5BAD6F",
          design: "#8B6FB0",
          education: "#B08D57",
          sustainability: "#3D7C47",
          connection: "#6B7B8D",
        },
        // 文化色
        culture: {
          brick: "#A0522D",
          earth: "#8B7355",
          bamboo: "#5B8A52",
          deep: "#1C1C1A",
        },
      },
      fontFamily: {
        display: [
          "var(--font-noto-serif-tc)",
          "var(--font-cormorant)",
          "serif",
        ],
        body: ["var(--font-noto-sans-tc)", "sans-serif"],
        accent: ["var(--font-cormorant)", "serif"],
      },
      fontSize: {
        display: ["clamp(4rem, 12vw, 10rem)", { lineHeight: "0.95" }],
        "h1": ["clamp(2rem, 5vw, 3.2rem)", { lineHeight: "1.25" }],
        "h2": ["clamp(1.5rem, 3.5vw, 2.4rem)", { lineHeight: "1.35" }],
        "h3": ["1.25rem", { lineHeight: "1.4" }],
        "reading": ["1.125rem", { lineHeight: "1.85" }],
      },
      spacing: {
        "4xl": "96px",
        "3xl-s": "64px",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
      },
      maxWidth: {
        prose: "680px",
        content: "900px",
        wide: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
