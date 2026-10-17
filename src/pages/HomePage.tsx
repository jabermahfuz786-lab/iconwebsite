import { useState, useEffect, type ReactNode } from 'react';
import {
  ChevronDown, ChevronRight, ArrowLeft,
  Building2, Home, FileText, Plane, Code2, Shield, MapPin, Sparkles,
  DollarSign, Briefcase, Globe, Star, Award, Crown, Youtube,
  PiggyBank, TrendingUp, Hotel, Store, Wheat, FlaskConical, Sprout, Landmark,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  RealEstateContent, LicenseContent, UmrahContent, ITContent,
  SavingsContent, InvestmentContent,
} from '@/components/BusinessSections';
import { ArabAgroContent, PendingContent } from '@/components/AgroProjects';



function ParticleLayer({ count = 12 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 8.3 + 5) % 100}%`,
    duration: `${8 + (i % 5) * 2}s`,
    delay: `${i * 0.8}s`,
    size: 2 + (i % 3),
  }));
  return (
    <div className="particle-layer">
      {particles.map((p, i) => (
        <span key={i} className="particle" style={{
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size}px`,
          animationDuration: p.duration,
          animationDelay: p.delay,
        }} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="animate-fade-in min-h-screen">
      <HeroBanner />
      <AchievementsSection />
      <section id="dual-columns" className="biz-city-section pt-8 px-4 pb-8">
        <ParticleLayer count={14} />
        <div className="max-w-7xl mx-auto relative z-10">
          <BusinessCityPanel />
        </div>
      </section>
      <ChairmanProfile />
    </div>
  );
}

// ============================================================
// ACHIEVEMENTS — 12 compact luxury metric tiles
// ============================================================
function AchievementsSection() {
  const { t } = useApp();
  const achievements = [
    { icon: Building2, value: '100+', label: t('ach1') },
    { icon: DollarSign, value: '3000+', label: t('ach2') },
    { icon: Briefcase, value: '9', label: t('ach3') },
    { icon: Store, value: '30+', label: t('ach4') },
    { icon: Wheat, value: '100+', label: t('ach5') },
    { icon: Star, value: '', label: t('ach6') },
    { icon: FlaskConical, value: '', label: t('ach7') },
    { icon: Globe, value: '3', label: t('ach9') },
    { icon: Briefcase, value: '15+', label: t('ach12') },
    { icon: FileText, value: '1K+', label: t('ach13') },
    { icon: Hotel, value: '100+', label: t('ach14') },
    { icon: TrendingUp, value: '100%', label: t('ach15') },
  ];

  return (
    <section className="achievements-section px-4 py-6 md:py-8">
      <ParticleLayer count={12} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="achievement-heading text-center mb-4">
          <h2 className="turmeric-glow text-xl font-bold tracking-tight lux-serif">{t('achievementsTitle')}</h2>
          <p className="sage text-xs mt-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{t('achievementsTitleBn')}</p>
        </div>
        <div className="achievements-grid grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {achievements.map((a, i) => (
            <div key={i} className="beam-small ach-float achievement-card-border" style={{ animationDelay: `${i * 0.3}s` }}>
              <div className="beam-small-inner achievement-card-inner p-2.5 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="achievement-icon w-7 h-7 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ background: 'rgba(21,59,59,0.85)', border: '1px solid rgba(212,175,55,0.35)' }}>
                    <a.icon className="w-4 h-4" style={{ color: '#D4AF37' }} />
                  </div>
                  <p className="turmeric-glow text-base font-extrabold mb-0.5 leading-none">{a.value}</p>
                  <p className="lux-body text-[0.6rem] leading-tight opacity-60">{a.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HERO BANNER — compact max 75vh, reduced bg opacity
// ============================================================
function HeroBanner() {
  const { t } = useApp();
  const slides = [
    { url: '/photos/hero-makkah-window.webp', alt: 'Makkah skyline through a window at sunrise' },
    { url: '/photos/hero-madinah-land.webp', alt: 'Illuminated land plot in Madinah at night' },
    { url: '/photos/hero-office.webp', alt: 'ICON office and consultation desk' },
    { url: '/photos/hero-cr-desk.webp', alt: 'Signing a business registration document' },
  ];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const scrollToBusinessCity = () => {
    document.getElementById('dual-columns')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: '50vh', maxHeight: '75vh' }}>
      {/* Slideshow background */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 0.6 : 0 }}
          >
            <img src={s.url} alt={s.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Dark heavy overlay for luxury aesthetic */}
        <div className="hero-banner-overlay absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(14,43,43,0.48) 0%, rgba(14,43,43,0.64) 52%, rgba(14,43,43,0.9) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle 1200px at 50% 30%, rgba(212,175,55,0.06), transparent 70%)' }} />
        {/* ICON light sweep effect — slow and subtle */}
        <div className="absolute inset-0 z-0" style={{
          background: 'linear-gradient(110deg, transparent 35%, rgba(212,175,55,0.03) 48%, rgba(243,229,171,0.05) 50%, rgba(212,175,55,0.03) 52%, transparent 65%)',
          backgroundSize: '300% 100%',
          animation: 'iconSweep 14s ease-in-out infinite',
        }} />
        <style>{`@keyframes iconSweep { 0%, 100% { background-position: 200% 0; } 50% { background-position: -100% 0; } }`}</style>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === slide ? 28 : 8,
              background: i === slide ? '#D4AF37' : 'rgba(42,37,32,0.25)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-10 text-center">
        {/* Title */}
        <h1 className="lux-serif text-4xl md:text-6xl font-black mb-2 tracking-tight leading-none turmeric-glow" style={{ textShadow: '0 0 30px rgba(212,175,55,0.15), 0 0 60px rgba(212,175,55,0.08)' }}>
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-xl mb-4 font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#D4AF37', textShadow: '0 0 16px rgba(212,175,55,0.10)' }}>
          {t('heroTitleBn')}
        </p>

        {/* Country badge (below the title) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 animate-fade-in" style={{ background: 'rgba(14,43,43,0.82)', border: '1px solid #D4AF37', boxShadow: '0 0 14px rgba(212,175,55,0.25)', backdropFilter: 'blur(12px)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
          <span className="text-xs font-semibold tracking-wider" style={{ color: '#D4AF37' }}>{t('heroBadge')}</span>
        </div>

        {/* Divider */}
        <div className="section-divider mb-5" />

        {/* Subtitle */}
        <p className="lux-body text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed opacity-80 font-medium">
          {t('heroSubtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={scrollToBusinessCity} className="btn-gold inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> {t('heroCta1')}
          </button>
        </div>

        {/* Scroll hint */}
        <div className="mt-8 flex flex-col items-center gap-1" style={{ color: '#8A8275' }}>
          <span className="text-[0.65rem] tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// BUSINESS CITY — 9 category cards
// ============================================================
type BizNode = {
  key: string;
  icon: LucideIcon;
  label: string;
  labelBn: string;
  img?: string;
  render?: () => ReactNode;
  children?: BizNode[];
};

const pending = (title: string) => () => <PendingContent title={title} />;

const BUSINESS_CITY_TREE: BizNode[] = [
  {
    key: 'saudi', icon: Building2, label: 'Saudi Arabia', labelBn: 'সৌদি আরবিয়া', img: '/card-real-estate.webp',
    children: [
      { key: 'sa-re', icon: Building2, label: 'Real Estate', labelBn: 'রিয়েল এস্টেট', img: '/card-real-estate.webp', render: () => <RealEstateContent /> },
      { key: 'sa-lic', icon: Shield, label: 'Investor License', labelBn: 'ইনভেস্টর লাইসেন্স', img: '/card-investor-license.webp', render: () => <LicenseContent /> },
      { key: 'sa-umrah', icon: Plane, label: 'Umrah B2B', labelBn: 'ওমরাহ B2B', img: '/card-umrah-b2b.webp', render: () => <UmrahContent /> },
      { key: 'sa-it', icon: Code2, label: 'IT Sector', labelBn: 'IT সেক্টর', img: '/card-it-sector.webp', render: () => <ITContent /> },
    ],
  },
  {
    key: 'oman', icon: Landmark, label: 'Oman', labelBn: 'ওমান', img: '/photos/arab-agro/01.jpg',
    children: [
      {
        key: 'om-re', icon: Building2, label: 'Oman Real Estate', labelBn: 'ওমান রিয়েল এস্টেট', img: '/photos/arab-agro/02.jpg',
        children: [
          { key: 'om-s33', icon: Building2, label: 'S33 Project', labelBn: 'S33 প্রজেক্ট', img: '', render: pending('S33 Project') },
        ],
      },
      { key: 'om-agro', icon: Sprout, label: 'Arab Agro', labelBn: 'আরব এগ্রো', img: '/photos/arab-agro/01.jpg', render: () => <ArabAgroContent /> },
      { key: 'om-rest', icon: Store, label: 'Restaurant Lazizz Club', labelBn: 'রেস্টুরেন্ট লাজিজ ক্লাব', img: '', render: pending('Restaurant Lazizz Club') },
      { key: 'om-it', icon: Code2, label: 'IT Sector', labelBn: 'IT সেক্টর', img: '/card-it-sector.webp', render: () => <ITContent /> },
    ],
  },
  {
    key: 'bd', icon: Globe, label: 'Bangladesh', labelBn: 'বাংলাদেশ', img: '',
    children: [
      { key: 'bd-tuhfa', icon: Hotel, label: 'TUHFA Collection', labelBn: 'তোহফা কালেকশন', img: '', render: pending('TUHFA Collection') },
      { key: 'bd-re', icon: Building2, label: 'Real Estate', labelBn: 'রিয়েল এস্টেট', img: '', render: pending('Real Estate') },
      { key: 'bd-it', icon: Code2, label: 'IT Sector', labelBn: 'IT সেক্টর', img: '/card-it-sector.webp', render: () => <ITContent /> },
    ],
  },
  {
    key: 'invest', icon: TrendingUp, label: 'Investment Sector', labelBn: 'ইনভেস্টমেন্ট সেক্টর', img: '/card-investor-sector.webp',
    render: () => <InvestmentContent />,
    children: [
      { key: 'inv-savings', icon: PiggyBank, label: 'Expat Savings Fund', labelBn: 'প্রবাসী সেভিংস ফান্ড', img: '/card-savings-fund.webp', render: () => <SavingsContent /> },
      { key: 'inv-umrah', icon: Plane, label: 'Umrah B2B', labelBn: 'ওমরাহ B2B', img: '/card-umrah-b2b.webp', render: () => <UmrahContent /> },
    ],
  },
];

type BizSize = 'big' | 'small' | 'header';

function bizName(n: BizNode, lang: string) {
  return lang === 'bn' ? n.labelBn : n.label;
}

function BizTile({ node, size, active = false, lang, onClick }: { node: BizNode; size: BizSize; active?: boolean; lang: string; onClick?: () => void }) {
  const minH = size === 'big' ? 260 : size === 'header' ? 150 : 128;
  const titleSize = size === 'big' ? '18px' : size === 'header' ? '20px' : '13px';
  const iconBox = size === 'small' ? 'w-7 h-7' : 'w-9 h-9';
  const inner = (
    <div className="biz-card-inner relative overflow-hidden" style={{ borderRadius: '18px', minHeight: `${minH}px`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div className="absolute inset-0 z-0">
        {node.img ? (
          <img src={node.img} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#17171B 0%,#0E2B2B 60%,#2A2410 100%)' }} />
        )}
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(14,43,43,0.85) 45%, rgba(14,43,43,0.98) 100%)' }} />
      <div className="relative z-10 p-2 md:p-2.5 flex flex-col items-center text-center" style={{ paddingTop: '0.6rem' }}>
        <div className={`${iconBox} rounded-xl flex items-center justify-center mb-1`} style={{ background: 'rgba(14,43,43,0.9)', border: '1.5px solid #D4AF37', boxShadow: '0 0 12px rgba(212,175,55,0.3)' }}>
          <node.icon className={size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} style={{ color: '#D4AF37' }} />
        </div>
        <p className="text-white font-bold leading-tight" style={{ fontSize: titleSize, fontWeight: 700 }}>
          {bizName(node, lang)}
        </p>
        {onClick && (
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mt-1.5 transition-transform ${active ? 'rotate-90' : ''}`}
            style={{ background: 'rgba(14,43,43,0.8)', border: '1.5px solid #D4AF37' }}
          >
            <ChevronRight className="w-3 h-3" style={{ color: '#D4AF37' }} />
          </div>
        )}
      </div>
    </div>
  );
  if (!onClick) return <div className="business-city-card biz-card">{inner}</div>;
  return (
    <button onClick={onClick} className={`business-city-card biz-card w-full text-left ${active ? 'biz-card-active' : ''}`} style={{ padding: 0 }}>
      {inner}
    </button>
  );
}

function BizHeader({ node, lang, onBack, open, onToggle }: { node: BizNode; lang: string; onBack: () => void; open?: boolean; onToggle?: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(212,175,55,0.6)', boxShadow: '0 0 18px rgba(212,175,55,0.2)' }}>
      {node.img && <img src={node.img} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(14,43,43,0.97) 0%, rgba(14,43,43,0.85) 60%, rgba(14,43,43,0.65) 100%)' }} />
      <div className="relative z-10 flex items-center gap-3 p-3 md:p-4">
        <button onClick={onBack} aria-label="Back" className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(14,43,43,0.9)', border: '1.5px solid #D4AF37' }}>
          <ArrowLeft className="w-4 h-4" style={{ color: '#D4AF37' }} />
        </button>
        <button onClick={onBack} className="flex-1 min-w-0 text-left">
          <p className="text-white font-bold text-base md:text-xl leading-tight truncate">{bizName(node, lang)}</p>
        </button>
        {onToggle && (
          <button onClick={onToggle} aria-label="Toggle" className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(14,43,43,0.9)', border: '1.5px solid #D4AF37' }}>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} style={{ color: '#D4AF37' }} />
          </button>
        )}
      </div>
    </div>
  );
}

const BACK_LABEL: Record<string, string> = { en: 'Back', bn: 'পেছনে', ar: 'رجوع' };

function BusinessCityPanel() {
  const { t, lang } = useApp();
  // path: folders opened so far (the last one is shown as the heading)
  // leafKey: an item whose details are open alone
  // listOpen: whether the heading's sub-folders are shown
  const [path, setPath] = useState<BizNode[]>([]);
  const [leafKey, setLeafKey] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(true);

  const header = path.length ? path[path.length - 1] : null;
  const parentList: BizNode[] = path.length >= 2 ? path[path.length - 2].children ?? [] : BUSINESS_CITY_TREE;
  const childList: BizNode[] = header ? header.children ?? [] : [];
  const leaf = leafKey ? childList.find((n) => n.key === leafKey) ?? null : null;
  const siblings = header ? parentList.filter((n) => n.key !== header.key) : [];

  const goUp = () => {
    setLeafKey(null);
    setListOpen(true);
    setPath(path.slice(0, -1));
  };

  const openChild = (child: BizNode) => {
    if (child.children && child.children.length > 0) {
      setPath([...path, child]);
      setLeafKey(null);
      setListOpen(true);
    } else {
      setLeafKey(child.key);
    }
  };

  const openSibling = (node: BizNode) => {
    setPath([...path.slice(0, -1), node]);
    setLeafKey(null);
    setListOpen(true);
  };

  const backLabel = BACK_LABEL[lang] ?? BACK_LABEL.en;

  return (
    <div className="biz-panel">
      <div className="biz-panel-inner p-4 md:p-5 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.06]">
          <img src="/business-city-bg.webp" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.4) brightness(1.1)' }} />
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(21,59,59,0.4) 0%, transparent 30%, transparent 70%, rgba(21,59,59,0.5) 100%)' }} />
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.35)' }}>
                <Briefcase className="w-4 h-4 biz-accent" />
              </div>
              <h2 className="biz-glow text-xl font-bold tracking-tight lux-serif">{t('businessCity')}</h2>
            </div>
          </div>

          {!header && (
            <div className="grid grid-cols-2 gap-2.5 md:gap-3">
              {BUSINESS_CITY_TREE.map((node) => (
                <BizTile key={node.key} node={node} size="big" lang={lang} onClick={() => openSibling(node)} />
              ))}
            </div>
          )}

          {header && leaf && (
            /* Only this item is shown: its heading and its details */
            <div className="flex flex-col gap-3">
              <BizHeader node={leaf} lang={lang} onBack={() => setLeafKey(null)} />
              <div className="animate-fade-in rounded-2xl p-3 md:p-4" style={{ background: 'rgba(14,43,43,0.9)', border: '1px solid rgba(212,175,55,0.3)' }}>
                {leaf.render ? leaf.render() : null}
              </div>
            </div>
          )}

          {header && !leaf && (
            <div className="flex flex-col gap-3">
              <BizHeader
                node={header}
                lang={lang}
                onBack={goUp}
                open={listOpen}
                onToggle={childList.length > 0 ? () => setListOpen(!listOpen) : undefined}
              />

              {header.render && (
                <div className="animate-fade-in rounded-2xl p-3 md:p-4" style={{ background: 'rgba(14,43,43,0.9)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  {header.render()}
                </div>
              )}

              {listOpen && childList.length > 0 && (
                <div
                  className="rounded-2xl p-2.5 md:p-3"
                  style={{ background: 'linear-gradient(160deg, rgba(212,175,55,0.14) 0%, rgba(40,34,12,0.7) 55%, rgba(14,43,43,0.9) 100%)', border: '1px dashed rgba(212,175,55,0.5)' }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {childList.map((child) => (
                      <BizTile key={child.key} node={child} size="small" lang={lang} onClick={() => openChild(child)} />
                    ))}
                  </div>
                </div>
              )}

              {siblings.length > 0 && (
                <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 opacity-90">
                    {siblings.map((node) => (
                      <BizTile
                        key={node.key}
                        node={node}
                        size={path.length === 1 ? 'big' : 'small'}
                        lang={lang}
                        onClick={() => openSibling(node)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHAIRMAN PROFILE
// ============================================================
function ChairmanProfile() {
  const subTags = ['Businessman', 'Motivational Speaker', 'Columnist'];
  const holdings = [
    { name: 'ICON SAUDI ARABIA', region: 'Saudi Arabia' },
    { name: 'ICON OMAN', region: 'Oman' },
    { name: 'ICON BANGLADESH', region: 'Bangladesh' },
  ];

  return (
    <section className="chairman-section px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="beam-panel">
          <div className="beam-panel-inner chairman-panel relative overflow-hidden">
            {/* Background overlay — stays behind all content */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: 'linear-gradient(180deg, rgba(21,59,59,0.3) 0%, transparent 30%, transparent 70%, rgba(21,59,59,0.4) 100%)' }} />

            {/* All content sits above background at z-10 */}
            <div className="chairman-content relative" style={{ zIndex: 10, position: 'relative', display: 'block', clear: 'both' }}>
              {/* Chairman Badge */}
              <div className="text-center mb-6">
                <div className="chairman-main-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full">
                  <Crown className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.5))' }} />
                  <span className="text-xs tracking-wider">CHAIRMAN</span>
                </div>
              </div>

              {/* Portrait */}
              <div className="flex justify-center mb-5">
                <div className="chairman-portrait">
                  <img src="/chairman-portrait.webp" alt="Mahfuzur Rahman Jaber" />
                </div>
              </div>

              {/* Name + Bengali name — high z-index, above all backgrounds */}
              <div className="text-center mb-4" style={{ position: 'relative', zIndex: 10 }}>
                <h3 className="chairman-name lux-serif font-bold mb-1">Mahfuzur Rahman Jaber</h3>
                <p className="chairman-name-bn" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>মাহফুজুর রহমান জাবের</p>
              </div>

              {/* Sub-Tags with gold bullet separators */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                {subTags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <span className="chairman-bullet" />}
                    <span className="chairman-tag">{tag}</span>
                  </div>
                ))}
              </div>

              <div className="section-divider mb-8" />

              {/* Official Holdings: three small cards in one row on every screen */}
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {holdings.map((h, i) => (
                  <div key={i} className="beam-small min-w-0">
                    <div className="beam-small-inner chairman-icon-btn p-2 md:p-4 text-center">
                      <div className="chairman-icon w-7 h-7 md:w-10 md:h-10 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ background: 'rgba(21,59,59,0.9)', border: '1px solid rgba(212,175,55,0.45)' }}>
                        <Award className="w-3.5 h-3.5 md:w-5 md:h-5" style={{ color: '#D4AF37' }} />
                      </div>
                      <h4 className="lux-body text-[0.6rem] md:text-sm font-semibold leading-tight">{h.name}</h4>
                      <p className="sage text-[0.55rem] md:text-[0.65rem] mt-0.5">{h.region}</p>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="youtube-btn mt-1.5 inline-flex" style={{ padding: '.2rem .4rem', fontSize: '.55rem', gap: '.25rem' }}>
                        <Youtube className="w-3 h-3 md:w-4 md:h-4" />
                        <span>YouTube</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
