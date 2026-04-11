// Placeholder — will be replaced with next-intl when locale routing is set up
// For now, components use hardcoded Chinese strings

export function useTranslation() {
  return {
    locale: "zh-tw" as const,
    t: (key: string) => key,
    setLocale: (_locale: string) => {},
  };
}
