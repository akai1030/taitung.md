"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

import zhTW from "../../messages/zh-tw.json";
import en from "../../messages/en.json";

type Messages = Record<string, string>;
type Locale = "zh-tw" | "en";

const messages: Record<Locale, Messages> = {
  "zh-tw": zhTW,
  en: en,
};

interface I18nContextType {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh-tw",
  t: (key: string) => key,
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh-tw");

  const t = useCallback(
    (key: string): string => {
      return messages[locale]?.[key] ?? messages["zh-tw"]?.[key] ?? key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
