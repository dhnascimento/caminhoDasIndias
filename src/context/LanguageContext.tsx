import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LocalizedString } from '../types/slides';

export type Language = 'en' | 'pt';

const LANG_STORAGE_KEY = 'slideshow-language';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pt',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('pt');

  useEffect(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
    if (stored === 'en' || stored === 'pt') {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const { lang, setLang } = useContext(LanguageContext);

  const t = useCallback((field: LocalizedString | undefined): string => {
    if (field === undefined || field === null) return '';
    if (typeof field === 'string') return field;
    return field[lang] ?? field.en ?? '';
  }, [lang]);

  return { lang, setLang, t };
}
