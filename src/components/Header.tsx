import { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Language } from '@/types';
import { checkAdminSession } from '@/lib/adminApi';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { t, lang, setLang, route, navigate } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Admin buttons appear only for a signed-in account listed in admin_users.
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const ok = await checkAdminSession();
      if (alive) setIsAdmin(ok);
    };
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { refresh(); });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => { setLangOpen(false); }, [route]);

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
    { label: 'Content', path: '/content' },
    ...(isAdmin ? [{ label: t('admin'), path: '/admin' }] : []),
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

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-3'
      }`}
      style={{
        background: scrolled ? 'linear-gradient(180deg, rgba(11,11,13,0.92), rgba(8,28,25,0.86))' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,214,10,0.35)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 lg:px-8">
        <div className="flex items-center gap-2 lg:justify-between">
          {/* Language Switcher (left, same line on phones) */}
          <div ref={langRef} className="relative z-10 shrink-0 lg:flex-1">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 transition-colors text-sm sage hover:text-turmeric"
            >
              <Globe className="w-4 h-4" />
              <span className="font-medium hidden sm:inline">{languages.find((l) => l.code === lang)?.label || 'EN'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-2 left-0 py-2 min-w-[120px] animate-fade-in z-50" style={{ background: 'linear-gradient(180deg, rgba(8,28,25,0.97), rgba(11,11,13,0.97))', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,214,10,0.4)', borderRadius: '16px', boxShadow: '0 8px 30px rgba(255,214,10,0.08), 0 0 20px rgba(255,214,10,0.10)' }}>
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

          {/* Phones: all menu buttons on this same line, small, scroll sideways only if they do not fit */}
          <nav className="app-chip-row lg:hidden flex-1 min-w-0">
            {navItems.map((item) => (
              <button key={item.path} onClick={() => navigate(item.path)} className={`app-chip ${isActive(item.path) ? 'active' : ''}`}>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop: nav + VIP Access on the right */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-5">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <button key={item.path} onClick={() => navigate(item.path)} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
