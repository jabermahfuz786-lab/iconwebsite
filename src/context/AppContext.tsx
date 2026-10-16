import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Language } from '@/types';
import { translations, isRTL, type TranslationKey } from '@/lib/i18n';

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  rtl: boolean;
  route: string;
  navigate: (route: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('icon-lang') as Language | null;
    return saved || 'bn';
  });
  const [route, setRoute] = useState<string>(() => window.location.hash.slice(1) || '/');

  const rtl = isRTL(lang);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('icon-lang', l);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return (translations[lang] as Partial<Record<TranslationKey, string>>)[key] || translations.en[key] || key;
  }, [lang]);

  const navigate = useCallback((r: string) => {
    window.location.hash = r;
    setRoute(r);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [rtl, lang]);

  return (
    <AppContext.Provider value={{ lang, setLang, t, rtl, route, navigate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
