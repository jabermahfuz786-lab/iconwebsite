import { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronRight,
  Building2, Home, FileText, Plane, Code2, Shield, MapPin, Sparkles,
  DollarSign, Briefcase, Globe, Star, Award, Crown, Youtube,
  PiggyBank, TrendingUp, Hotel, Store, Wheat, FlaskConical,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  RealEstateContent, LicenseContent, UmrahContent, ITContent,
  SavingsContent, InvestmentContent,
} from '@/components/BusinessSections';



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
        <div className="hero-banner-overlay absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,13,0.48) 0%, rgba(11,11,13,0.64) 52%, rgba(11,11,13,0.9) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle 1200px at 50% 30%, rgba(255,214,10,0.06), transparent 70%)' }} />
        {/* ICON light sweep effect — slow and subtle */}
        <div className="absolute inset-0 z-0" style={{
          background: 'linear-gradient(110deg, transparent 35%, rgba(255,214,10,0.03) 48%, rgba(243,229,171,0.05) 50%, rgba(255,214,10,0.03) 52%, transparent 65%)',
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
              background: i === slide ? '#FFD60A' : 'rgba(42,37,32,0.25)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 animate-fade-in" style={{ background: 'rgba(250,247,241,0.85)', border: '1px solid rgba(255,214,10,0.4)', backdropFilter: 'blur(12px)' }}>
          <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFD60A' }} />
          <span className="text-xs font-semibold tracking-wider" style={{ color: '#FFD60A' }}>{t('heroBadge')}</span>
        </div>

        {/* Title */}
        <h1 className="lux-serif text-4xl md:text-6xl font-black mb-2 tracking-tight leading-none turmeric-glow" style={{ textShadow: '0 0 30px rgba(255,214,10,0.15), 0 0 60px rgba(255,214,10,0.08)' }}>
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-xl mb-4 font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif', color: '#FFD60A', textShadow: '0 0 16px rgba(255,214,10,0.10)' }}>
          {t('heroTitleBn')}
        </p>

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
// BUSINESS CITY — 6 category cards
// ============================================================
function BusinessCityPanel() {
  const { t } = useApp();
  const [activeCat, setActiveCat] = useState<number | null>(null);

  const categories = [
    { icon: Building2, label: t('catRealEstate'), labelBn: t('catRealEstateBn'), img: '/card-real-estate.webp' },
    { icon: Shield, label: t('catLicense'), labelBn: t('catLicenseBn'), img: '/card-investor-license.webp' },
    { icon: Plane, label: t('catUmrah'), labelBn: t('catUmrahBn'), img: '/card-umrah-b2b.webp' },
    { icon: Code2, label: t('catIT'), labelBn: t('catITBn'), img: '/card-it-sector.webp' },
    { icon: PiggyBank, label: t('catSavings'), labelBn: t('catSavingsBn'), img: '/card-savings-fund.webp' },
    { icon: TrendingUp, label: t('catInvestment'), labelBn: t('catInvestmentBn'), img: '/card-investor-sector.webp' },
  ];

  return (
    <div className="biz-panel">
      <div className="biz-panel-inner p-4 md:p-5 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-[0.06]">
          <img src="/business-city-bg.webp" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.4) brightness(1.1)' }} />
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(17,17,20,0.4) 0%, transparent 30%, transparent 70%, rgba(17,17,20,0.5) 100%)' }} />
        <div className="relative z-10">
          {/* Header — centered */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(250,247,241,0.7)', border: '1px solid rgba(255,214,10,0.30)' }}>
                <Briefcase className="w-4 h-4 biz-accent" />
              </div>
              <div>
                <h2 className="biz-glow text-xl font-bold tracking-tight lux-serif">{t('businessCity')}</h2>
              </div>
            </div>
          </div>

          {/* Category Grid — 6 image cards, 3 cols on desktop */}
          <div className="business-city-grid grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3 mb-4">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCat(activeCat === i ? null : i)}
                className={`business-city-card biz-card ${activeCat === i ? 'biz-card-active' : ''}`}
              >
                <div
                  className="biz-card-inner relative overflow-hidden cursor-pointer"
                  style={{
                    borderRadius: '20px',
                    minHeight: '175px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: 0,
                  }}
                >
                  {/* Full background image */}
                  <div className="absolute inset-0 z-0">
                    <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
                  </div>

                  {/* Dark gradient overlay on lower portion */}
                  <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,12,8,0.85) 40%, rgba(10,8,5,0.98) 100%)' }} />

                  {/* Bottom content section */}
                  <div className="relative z-10 p-2 md:p-2.5 flex flex-col items-center text-center" style={{ paddingTop: '0.75rem' }}>
                    {/* Floating gold badge icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center mb-1.5"
                      style={{
                        background: 'rgba(18,12,8,0.9)',
                        border: '1.5px solid #FFD60A',
                        boxShadow: '0 0 12px rgba(255,214,10,0.3)',
                      }}
                    >
                      <cat.icon className="w-4.5 h-4.5" style={{ color: '#FFD60A' }} />
                    </div>

                    {/* Title */}
                    <p className="text-white font-bold text-[15px] md:text-base leading-tight mb-0.5" style={{ fontSize: '16px', fontWeight: 700 }}>
                      {cat.label}
                    </p>
                    <p className="text-white/60 text-[0.62rem] mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                      {cat.labelBn}
                    </p>

                    {/* Golden circular arrow button */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${activeCat === i ? 'rotate-90' : ''}`}
                      style={{
                        background: 'rgba(18,12,8,0.8)',
                        border: '1.5px solid #FFD60A',
                        boxShadow: '0 0 8px rgba(255,214,10,0.2)',
                      }}
                    >
                      <ChevronRight className="w-3 h-3" style={{ color: '#FFD60A' }} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Category Content */}
          {activeCat === 0 && <RealEstateContent />}
          {activeCat === 1 && <LicenseContent />}
          {activeCat === 2 && <UmrahContent />}
          {activeCat === 3 && <ITContent />}
          {activeCat === 4 && <SavingsContent />}
          {activeCat === 5 && <InvestmentContent />}

          {activeCat === null && (
            <div className="text-center py-8 sage text-sm">Select a category to explore</div>
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

              {/* Official Holdings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {holdings.map((h, i) => (
                  <div key={i} className="beam-small">
                    <div className="beam-small-inner chairman-icon-btn p-4 text-center">
                      <div className="chairman-icon w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(13,48,38,0.9)', border: '1.5px solid rgba(255,214,10,0.45)' }}>
                        <Award className="w-5 h-5" style={{ color: '#FFD60A' }} />
                      </div>
                      <div className="chairman-holding-badge inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full mb-2">
                        <span className="text-[0.6rem] tracking-wider">CHAIRMAN</span>
                      </div>
                      <h4 className="lux-body text-sm font-semibold">{h.name}</h4>
                      <p className="sage text-[0.65rem] mt-0.5">{h.region}</p>
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="youtube-btn mt-3 inline-flex">
                        <Youtube className="w-4 h-4" />
                        <span>Watch Presentation</span>
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
