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
    { label: t('investorLogin'), path: '/investor-login' },
    { label: t('admin'), path: '/admin' },
    { label: 'Content', path: '/admin/content' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ar', label: 'العربية' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return route === '/' || route === '';
    return route.startsWith(path);
  };

  const handleNav = (path: string) => navigate(path);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
        style={{
          background: scrolled ? 'rgba(18,12,7,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212,160,23,0.10)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:border-turmeric-500 transition-colors" style={{ background: '#1A120B', border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
              <Sparkles className="w-4 h-4 turmeric" />
            </div>
            <div className="text-left">
              <div className="font-sans text-lg font-extrabold turmeric leading-none tracking-tight">{t('brandName')}</div>
              <div className="sage text-[0.55rem] tracking-[0.15em] uppercase">{t('brandTagline')}</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => handleNav(item.path)} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 transition-colors text-sm sage hover:text-turmeric"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{languages.find((l) => l.code === lang)?.label || 'EN'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full mt-2 right-0 py-2 min-w-[120px] animate-fade-in z-50" style={{ background: '#1A120B', border: '1px solid rgba(212,160,23,0.20)', borderRadius: '0.75rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang === l.code ? 'turmeric' : 'sage hover:text-turmeric'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden sage">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 pt-16 animate-fade-in" style={{ background: 'rgba(18,12,7,0.97)', backdropFilter: 'blur(16px)' }}>
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
