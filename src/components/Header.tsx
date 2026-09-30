import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Language } from '@/types';

export default function Header() {
  const { t, lang, setLang, route, navigate } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setLangOpen(false); }, [route]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const navItems = [
    { label: t('home'), path: '/' },
    { label: t('businessCity'), path: '/#business' },
    { label: t('expatServices'), path: '/#expat' },
    { label: t('investorLogin'), path: '/investor-login' },
    { label: t('admin'), path: '/admin' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'bn', label: 'বাংলা', flag: 'BN' },
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'ar', label: 'العربية', flag: 'AR' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return route === '/' || route === '';
    if (path.startsWith('/#')) return true;
    return route.startsWith(path.replace('/#', ''));
  };

  const handleNav = (path: string) => {
    if (path.startsWith('/#')) {
      const anchor = path.slice(2);
      if (route !== '/' && route !== '') {
        navigate('/');
        setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-espresso-800/80 backdrop-blur-xl border-b border-amber-400/20 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-espresso-700 border border-amber-400/30 flex items-center justify-center group-hover:border-amber-300 transition-colors" style={{ boxShadow: 'inset 0 1px 2px rgba(230, 161, 92, 0.1), 0 2px 6px rgba(0,0,0,0.2)' }}>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-left">
              <div className="font-serif text-lg text-cream-50 leading-none tracking-wide">{t('brandName')}</div>
              <div className="text-[0.55rem] text-amber-300/60 tracking-[0.2em] uppercase">{t('brandTagline')}</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => handleNav(item.path)} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-cream-50/70 hover:text-amber-300 transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{lang.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 smoke-card py-2 min-w-[130px] animate-fade-in z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3 ${
                        lang === l.code ? 'text-amber-300 bg-amber-300/10' : 'text-cream-50/60 hover:text-amber-300 hover:bg-amber-300/5'
                      }`}
                    >
                      <span className="font-mono text-xs opacity-50 w-6">{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-cream-50/80">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-espresso-800/95 backdrop-blur-xl pt-16 animate-fade-in">
          <nav className="flex flex-col items-center gap-5 mt-8">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => { handleNav(item.path); }} className={`nav-link text-lg ${isActive(item.path) ? 'active' : ''}`}>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
