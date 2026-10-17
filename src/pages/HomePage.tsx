import { useState, useEffect, type ReactNode } from 'react';
import {
  ChevronDown, ChevronRight, Lock,
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
import { InvestorLoginForm } from '@/pages/InvestorLoginPage';

// The investor login form, placed inside the Investment Sector box (its own portal colours, no full-page height)
function InvestorLoginEmbed() {
  return (
    <div className="portal-theme" style={{ minHeight: 0, background: 'transparent' }}>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <InvestorLoginForm />
      </div>
    </div>
  );
}



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
                  <div className="achievement-icon w-7 h-7 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ background: 'rgba(15,44,42,0.85)', border: '1px solid rgba(255,214,10,0.35)' }}>
                    <a.icon className="w-4 h-4" style={{ color: '#FFD60A' }} />
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
const HERO_SLIDES = [
  { desktop: '/photos/hero-desktop.webp', mobile: '/photos/hero-mobile.webp' },
  { desktop: '/photos/hero-desktop-2.webp', mobile: '/photos/hero-mobile-2.webp' },
];

function HeroBanner() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlide((n) => (n + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    // Starts below the fixed header (76px) so the menu never sits on the picture; height 72% of screen, 420–820px
    <section className="hero-banner-section relative flex items-center justify-center overflow-hidden" style={{ marginTop: 76, minHeight: 'clamp(420px, 72vh, 820px)' }}>
      {/* Background pictures: slide 1 shows first, then slide 2 after 5 seconds, and so on. Phones get the mobile picture. */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((sl, i) => (
          <picture
            key={i}
            className="absolute inset-0 block w-full h-full transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <source media="(max-width: 767px)" srcSet={sl.mobile} />
            <img src={sl.desktop} alt="ICON" className="w-full h-full object-cover" style={{ objectPosition: 'center 40%' }} />
          </picture>
        ))}
        {/* Brush edges: a soft melt into the page colour, only at the very edges so the picture stays full size */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(11,11,13,0.85) 0%, rgba(11,11,13,0) 7%, rgba(11,11,13,0) 93%, rgba(11,11,13,0.85) 100%)' }} />
        <div className="absolute inset-x-0 top-0 h-[12%] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(11,11,13,0.6) 0%, rgba(11,11,13,0) 100%)' }} />
        {/* Bottom brush: melts the picture fully into the page colour (inline, so it always applies) */}
        <div className="hero-bottom-brush" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%', pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(11,11,13,0) 0%, rgba(11,11,13,0.8) 50%, #0B0B0D 100%)' }} />
        {/* Rising water droplets, same as the rest of the site */}
        <ParticleLayer count={22} />
        {/* Light band that runs across the banner */}
        <div className="hero-sheen-track absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="hero-sheen" />
        </div>
      </div>

      {/* Banner text: only the word ICON, small, top-left under the language switch */}
      <div className="absolute z-10 top-3 left-4 lg:left-8">
        <h1 className="lux-serif text-2xl md:text-3xl font-black tracking-[0.12em] turmeric-glow">ICON</h1>
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
    children: [
      { key: 'inv-login', icon: Lock, label: 'Investor Login', labelBn: 'ইনভেস্টর লগ ইন', img: '/card-investor-sector.webp', render: () => <InvestorLoginEmbed /> },
      { key: 'inv-opps', icon: Briefcase, label: 'Investment Opportunities', labelBn: 'ইনভেস্টমেন্ট সুযোগসমূহ', img: '/card-investor-sector.webp', render: () => <InvestmentContent /> },
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
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#17171B 0%,#0B0B0D 60%,#2A2410 100%)' }} />
        )}
      </div>
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(11,11,13,0.85) 45%, rgba(11,11,13,0.98) 100%)' }} />
      <div className="relative z-10 p-2 md:p-2.5 flex flex-col items-center text-center" style={{ paddingTop: '0.6rem' }}>
        <div className={`${iconBox} rounded-xl flex items-center justify-center mb-1`} style={{ background: 'rgba(11,11,13,0.9)', border: '1.5px solid #FFD60A', boxShadow: '0 0 12px rgba(255,214,10,0.3)' }}>
          <node.icon className={size === 'small' ? 'w-3.5 h-3.5' : 'w-4 h-4'} style={{ color: '#FFD60A' }} />
        </div>
        <p className="text-white font-bold leading-tight" style={{ fontSize: titleSize, fontWeight: 700 }}>
          {bizName(node, lang)}
        </p>
        {onClick && (
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center mt-1.5 transition-transform ${active ? 'rotate-90' : ''}`}
            style={{ background: 'rgba(11,11,13,0.8)', border: '1.5px solid #FFD60A' }}
          >
            <ChevronRight className="w-3 h-3" style={{ color: '#FFD60A' }} />
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

// Full-width bar. Closed: it opens its folder. Open: it sits on top and closes it.
function BizBar({ node, lang, open, onClick }: { node: BizNode; lang: string; open: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative w-full overflow-hidden rounded-xl text-left" style={{ border: '1px solid rgba(255,214,10,0.6)', boxShadow: '0 0 14px rgba(255,214,10,0.2)' }}>
      {node.img && <img src={node.img} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(11,11,13,0.97) 0%, rgba(11,11,13,0.85) 60%, rgba(11,11,13,0.65) 100%)' }} />
      <div className="relative z-10 flex items-center gap-3 px-3 py-2.5 md:px-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(11,11,13,0.9)', border: '1.5px solid #FFD60A' }}>
          <node.icon className="w-3.5 h-3.5" style={{ color: '#FFD60A' }} />
        </div>
        <p className="flex-1 min-w-0 text-white font-bold text-base md:text-lg leading-tight truncate">{bizName(node, lang)}</p>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(11,11,13,0.8)', border: '1.5px solid #FFD60A' }}>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? '' : '-rotate-90'}`} style={{ color: '#FFD60A' }} />
        </div>
      </div>
    </button>
  );
}

type BizOpenMap = Record<string, boolean>;
type BizSetOpen = (node: BizNode, value: boolean) => void;

const SECTOR_BOX_STYLE = { background: 'linear-gradient(160deg, rgba(255,214,10,0.14) 0%, rgba(40,34,12,0.7) 55%, rgba(11,11,13,0.9) 100%)', border: '1px dashed rgba(255,214,10,0.5)' };
const DETAIL_STYLE = { maxHeight: '70vh', background: 'rgba(11,11,13,0.9)', border: '1px solid rgba(255,214,10,0.3)' };

// An open folder: its bar on top, then one of three things:
// - its open sub-folder (bar + that sub-folder's content; the other sub-folders are hidden),
// - its sub-folder tiles (2 per row), or
// - its details (inside this box, so nothing below it shows through).
function BizExpanded({ node, lang, openMap, setOpen }: { node: BizNode; lang: string; openMap: BizOpenMap; setOpen: BizSetOpen }) {
  const kids = node.children ?? [];
  const activeKid = kids.find((k) => openMap[k.key]);
  return (
    <>
      <BizBar node={node} lang={lang} open onClick={() => setOpen(node, false)} />
      {activeKid && <BizExpanded node={activeKid} lang={lang} openMap={openMap} setOpen={setOpen} />}
      {!activeKid && kids.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {kids.map((child) => (
            <BizTile key={child.key} node={child} size="small" lang={lang} onClick={() => setOpen(child, true)} />
          ))}
        </div>
      )}
      {!activeKid && kids.length === 0 && node.render && (
        <div className="animate-fade-in rounded-2xl p-3 md:p-4 overflow-y-auto" style={DETAIL_STYLE}>
          {node.render()}
        </div>
      )}
    </>
  );
}

// All folder keys under a node, so closing a folder also closes anything open inside it.
function descendantKeys(node: BizNode): string[] {
  return (node.children ?? []).flatMap((c) => [c.key, ...descendantKeys(c)]);
}

function BusinessCityPanel() {
  const { t, lang } = useApp();
  const [openMap, setOpenMap] = useState<BizOpenMap>({});
  const setOpen: BizSetOpen = (node, value) =>
    setOpenMap((m) => {
      const next = { ...m, [node.key]: value };
      if (!value) for (const k of descendantKeys(node)) next[k] = false;
      return next;
    });

  // Nothing open: the four sectors sit side by side in their usual 2×2 places.
  // Something open: each sector is a full-width row in the same fixed order.
  // An open sector shows its bar and folders in one box; a closed one shows a thin bar.
  const anyOpen = BUSINESS_CITY_TREE.some((n) => openMap[n.key]);

  return (
    <div className="biz-panel">
      <div className="biz-panel-inner p-4 md:p-5 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.06]">
          <img src="/business-city-bg.webp" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.4) brightness(1.1)' }} />
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(17,17,20,0.4) 0%, transparent 30%, transparent 70%, rgba(17,17,20,0.5) 100%)' }} />
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,214,10,0.35)' }}>
                <Briefcase className="w-4 h-4 biz-accent" />
              </div>
              <h2 className="biz-glow text-xl font-bold tracking-tight lux-serif">{t('businessCity')}</h2>
            </div>
          </div>

          {anyOpen ? (
            <div className="flex flex-col gap-3 md:gap-4">
              {BUSINESS_CITY_TREE.map((node) =>
                openMap[node.key] ? (
                  <div key={node.key} className="animate-fade-in rounded-2xl p-2 md:p-2.5 flex flex-col gap-2 min-w-0" style={SECTOR_BOX_STYLE}>
                    <BizExpanded node={node} lang={lang} openMap={openMap} setOpen={setOpen} />
                  </div>
                ) : (
                  <BizBar key={node.key} node={node} lang={lang} open={false} onClick={() => setOpen(node, true)} />
                ),
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 md:gap-3">
              {BUSINESS_CITY_TREE.map((node) => (
                <BizTile key={node.key} node={node} size="big" lang={lang} onClick={() => setOpen(node, true)} />
              ))}
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
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0, background: 'linear-gradient(180deg, rgba(17,17,20,0.3) 0%, transparent 30%, transparent 70%, rgba(17,17,20,0.4) 100%)' }} />

            {/* All content sits above background at z-10 */}
            <div className="chairman-content relative" style={{ zIndex: 10, position: 'relative', display: 'block', clear: 'both' }}>
              {/* Chairman Badge */}
              <div className="text-center mb-6">
                <div className="chairman-main-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full">
                  <Crown className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 8px rgba(255,214,10,0.5))' }} />
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
                      <div className="chairman-icon w-7 h-7 md:w-10 md:h-10 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ background: 'rgba(13,48,38,0.9)', border: '1px solid rgba(255,214,10,0.45)' }}>
                        <Award className="w-3.5 h-3.5 md:w-5 md:h-5" style={{ color: '#FFD60A' }} />
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
