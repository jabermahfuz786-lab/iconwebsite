import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronRight, ChevronUp,
  Building2, Home, FileText, Plane, Code2, Shield, MapPin, Lock, Sparkles,
  ArrowRight, DollarSign, Briefcase, Globe, Star, Award,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase, whatsappLink } from '@/lib/supabase';
import type { Project, Currency } from '@/types';

export default function HomePage() {
  const { t } = useApp();

  return (
    <div className="animate-fade-in min-h-screen">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Achievements */}
      <AchievementsSection />

      {/* Business City */}
      <section id="dual-columns" className="pt-8 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <BusinessCityPanel />
        </div>
      </section>

      {/* Investment Portal */}
      <VaultSection />

      {/* Chairman Profile (at the absolute bottom) */}
      <ChairmanProfile />
    </div>
  );
}

// ============================================================
// ACHIEVEMENTS
// ============================================================
function AchievementsSection() {
  const { t } = useApp();
  const achievements = [
    { icon: Building2, value: '100+', label: t('ach1') },
    { icon: DollarSign, value: '3000+', label: t('ach2') },
    { icon: Briefcase, value: '9', label: t('ach3') },
    { icon: Award, value: '30+', label: t('ach4') },
    { icon: Globe, value: '100+', label: t('ach5') },
    { icon: Star, value: '', label: t('ach6') },
    { icon: Sparkles, value: '', label: t('ach7') },
    { icon: Globe, value: '3', label: t('ach9') },
    { icon: Briefcase, value: '15+', label: t('ach12') },
    { icon: FileText, value: '1K+', label: t('ach13') },
  ];

  return (
    <section className="px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="turmeric-glow text-xl font-bold tracking-tight">{t('achievementsTitle')}</h2>
          <p className="sage text-xs mt-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{t('achievementsTitleBn')}</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {achievements.map((a, i) => (
            <div key={i} className="beam-small animate-fade-in">
              <div className="beam-small-inner p-3 text-center">
                <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: 'rgba(18,12,7,0.6)', border: '1px solid rgba(212,160,23,0.20)' }}>
                  <a.icon className="w-4 h-4 turmeric" />
                </div>
                <p className="turmeric-glow text-lg font-extrabold mb-0.5 leading-none">{a.value}</p>
                <p className="text-white/60 text-[0.6rem] leading-tight">{a.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HERO BANNER
// ============================================================
function HeroBanner() {
  const { t } = useApp();
  const slides = [
    { url: 'https://images.pexels.com/photos/26436662/pexels-photo-26436662.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600', alt: 'Kaaba at night' },
    { url: 'https://images.pexels.com/photos/33169789/pexels-photo-33169789.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600', alt: 'Madinah Prophet Mosque' },
    { url: 'https://images.pexels.com/photos/29824327/pexels-photo-29824327.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600', alt: 'Modern building project' },
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
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Slideshow background */}
      <div className="absolute inset-0 z-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <img src={s.url} alt={s.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(13,8,5,0.50) 0%, rgba(13,8,5,0.72) 60%, #0D0805 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle 1200px at 50% 30%, rgba(234,179,8,0.08), transparent 70%)' }} />
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === slide ? 28 : 8,
              background: i === slide ? '#EAB308' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fade-in" style={{ background: 'rgba(18,12,7,0.7)', border: '1px solid rgba(234,179,8,0.25)', backdropFilter: 'blur(12px)' }}>
          <Sparkles className="w-3.5 h-3.5 turmeric" />
          <span className="turmeric text-xs font-semibold tracking-wider">{t('heroBadge')}</span>
        </div>

        {/* Title */}
        <h1 className="font-sans text-5xl md:text-7xl font-extrabold turmeric-glow mb-3 tracking-tight leading-none">
          {t('heroTitle')}
        </h1>
        <p className="sage text-lg md:text-xl mb-6" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
          {t('heroTitleBn')}
        </p>

        {/* Divider */}
        <div className="section-divider mb-6" />

        {/* Subtitle */}
        <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={scrollToBusinessCity} className="btn-gold inline-flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> {t('heroCta1')}
          </button>
        </div>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-1 sage">
          <span className="text-[0.65rem] tracking-[0.2em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LEFT COLUMN: BUSINESS CITY
// ============================================================
function BusinessCityPanel() {
  const { t } = useApp();
  const [activeCat, setActiveCat] = useState<number | null>(null);

  const categories = [
    { icon: Building2, label: t('catRealEstate'), labelBn: t('catRealEstateBn') },
    { icon: Shield, label: t('catLicense'), labelBn: t('catLicenseBn') },
    { icon: Plane, label: t('catUmrah'), labelBn: t('catUmrahBn') },
    { icon: Code2, label: t('catIT'), labelBn: t('catITBn') },
  ];

  return (
    <div className="biz-panel">
      <div className="biz-panel-inner p-6 md:p-8 relative overflow-hidden">
        {/* Background image — Madinah Clock Tower through glass, handshake */}
        <div className="absolute inset-0 z-0 opacity-[0.14]">
          <img src="/business-city-bg.webp" alt="" className="w-full h-full object-cover" style={{ filter: 'sepia(0.3) hue-rotate(-10deg)' }} />
        </div>
        <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(18,12,7,0.7)', border: '1px solid rgba(20,184,166,0.30)' }}>
            <Briefcase className="w-5 h-5 biz-accent" />
          </div>
          <div>
            <h2 className="biz-glow text-xl font-bold tracking-tight">{t('businessCity')}</h2>
            <p className="sage text-xs">বিজনেস সিটি</p>
          </div>
        </div>

        {/* Category Grid — larger cards */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCat(activeCat === i ? null : i)}
              className={`biz-card ${activeCat === i ? 'biz-card-active' : ''}`}
            >
              <div className="biz-card-inner p-6 flex flex-col items-center gap-4 cursor-pointer text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(18,12,7,0.6)', border: '1px solid rgba(20,184,166,0.20)' }}>
                  <cat.icon className="w-7 h-7 biz-accent" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-base font-semibold truncate">{cat.label}</p>
                  <p className="sage text-[0.7rem] truncate mt-0.5">{cat.labelBn}</p>
                </div>
                <ChevronRight className={`w-5 h-5 biz-accent shrink-0 transition-transform ${activeCat === i ? 'rotate-90' : ''}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Active Category Content */}
        {activeCat === 0 && <RealEstateContent />}
        {activeCat === 1 && <LicenseContent />}
        {activeCat === 2 && <UmrahContent />}
        {activeCat === 3 && <ITContent />}

        {activeCat === null && (
          <div className="text-center py-8 sage text-sm">Select a category to explore</div>
        )}
        </div>
      </div>
    </div>
  );
}

// --- Real Estate Content ---
function RealEstateContent() {
  const { t } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('USD');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('projects').select('*').eq('is_public', true)
        .order('sort_order').limit(8);
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const rates: Record<Currency, number> = { USD: 1, SAR: 3.75, OMR: 0.385, BDT: 110 };
  const convert = (p: number, f: Currency, to: Currency) => (p / rates[f]) * rates[to];
  const fmt = (p: number, c: Currency) => {
    const s: Record<Currency, string> = { SAR: 'SAR', OMR: 'OMR', BDT: '৳', USD: '$' };
    const v = p >= 1000000 ? `${(p / 1000000).toFixed(1)}M` : p >= 1000 ? `${(p / 1000).toFixed(0)}K` : `${p}`;
    return `${s[c]} ${v}`;
  };

  const subItems = [t('reMakkah'), t('reMuscat'), t('reHotelBiz'), t('reOther')];

  return (
    <div className="animate-fade-in space-y-4">
      {/* Sub-category pills */}
      <div className="flex flex-wrap gap-2">
        {subItems.map((item, i) => (
          <span key={i} className="badge badge-charcoal">{item}</span>
        ))}
      </div>

      {/* Currency selector */}
      <div className="flex gap-1">
        {(['SAR', 'OMR', 'BDT', 'USD'] as Currency[]).map((c) => (
          <button key={c} onClick={() => setCurrency(c)} className={`currency-btn ${currency === c ? 'active' : ''}`}>{c}</button>
        ))}
      </div>

      {/* Project cards */}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="shrink-0 w-56 h-44 skeleton rounded-xl" />)
        ) : projects.length === 0 ? (
          <p className="sage text-sm py-4">No projects available yet.</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="shrink-0 w-56 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(212,160,23,0.18)', background: 'rgba(18,12,7,0.75)' }}>
              <div className="h-20 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A120B, #2A1E13)' }}>
                <Building2 className="w-8 h-8" style={{ color: 'rgba(212,160,23,0.30)' }} />
              </div>
              <div className="p-3">
                <h4 className="text-white text-xs font-semibold mb-1 truncate">{p.name}</h4>
                <div className="flex items-center gap-1 sage text-[0.6rem] mb-1.5"><MapPin className="w-2.5 h-2.5" /> {p.city}, {p.country}</div>
                <p className="turmeric text-sm font-medium">{fmt(convert(p.starting_price, p.price_currency, currency), currency)}</p>
                <p className="sage text-[0.6rem]">{t('startingFrom')} · {p.available_units} {t('unitsLeft')}</p>
                <div className="mt-1.5 progress-bar"><div className="progress-bar-fill" style={{ width: `${p.construction_progress}%` }} /></div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'real_estate_buy' })} className="btn-gold">{t('realEstateCta')}</button>
        <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'real_estate_invest' })} className="btn-outline">{t('realEstateCta2')}</button>
        <a href={whatsappLink('Real Estate inquiry')} target="_blank" rel="noopener noreferrer" className="btn-dark">{t('realEstateCta3')}</a>
      </div>
    </div>
  );
}

// --- License Content ---
function LicenseContent() {
  const { t } = useApp();
  const items = [
    { title: t('licFamily'), desc: 'Makkah-Madinah family relocation & VIP setup services.' },
    { title: t('licPremium'), desc: 'Obtain Saudi Premium Residency through 4 Million Saudi Riyal real estate investment pathway.' },
    { title: t('lic7M'), desc: 'Step-by-step processing guidelines for the 7 Million setup — full corporate structuring.' },
  ];

  return (
    <div className="animate-fade-in space-y-3">
      {items.map((item, i) => (
        <div key={i} className="beam-small">
          <div className="beam-small-inner p-4">
            <h4 className="turmeric text-sm font-semibold mb-1">{item.title}</h4>
            <p className="text-white/75 text-xs leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'investor_license' })} className="btn-gold">{t('signIn')}</button>
        <a href={whatsappLink('Investor License inquiry')} target="_blank" rel="noopener noreferrer" className="btn-outline">{t('whatsapp')}</a>
      </div>
    </div>
  );
}

// --- Umrah Content ---
function UmrahContent() {
  const { t } = useApp();
  return (
    <div className="animate-fade-in space-y-3">
      <div className="beam-small">
        <div className="beam-small-inner p-4">
          <p className="text-white/75 text-sm leading-relaxed mb-3">{t('umrahDesc')}</p>
          <div className="flex flex-wrap gap-2">
            {['Group Ticketing', 'Multiple-Entry Visa', 'Wholesale Agency Portal', 'Global B2B Network'].map((tag, i) => (
              <span key={i} className="badge badge-charcoal">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'b2b_umrah' })} className="btn-gold">{t('umrahCta')}</button>
    </div>
  );
}

// --- IT Content ---
function ITContent() {
  const { t } = useApp();
  const services = [
    { icon: Globe, label: t('itBoost') },
    { icon: FileText, label: t('itVideo') },
    { icon: Code2, label: t('itDev') },
  ];
  return (
    <div className="animate-fade-in space-y-3">
      {services.map((s, i) => (
        <div key={i} className="beam-small">
          <div className="beam-small-inner p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(18,12,7,0.6)', border: '1px solid rgba(212,160,23,0.20)' }}>
              <s.icon className="w-4 h-4 turmeric" />
            </div>
            <p className="text-white text-sm font-medium">{s.label}</p>
          </div>
        </div>
      ))}
      <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'it_services' })} className="btn-gold">{t('itCta')}</button>
    </div>
  );
}

// ============================================================
// VAULT / INVESTMENT PORTAL
// ============================================================
function VaultSection() {
  const { t, navigate } = useApp();
  return (
    <section className="px-4 pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="beam-panel">
          <div className="beam-panel-inner p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212,160,23,0.04), transparent 70%)' }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#1A120B', border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 0 16px rgba(212,160,23,0.08)' }}>
                <Lock className="w-7 h-7 turmeric" />
              </div>
              <h3 className="turmeric-glow text-xl font-bold mb-2">{t('vaultTitle')}</h3>
              <p className="sage text-sm mb-5 max-w-sm mx-auto">{t('vaultSubtitle')}</p>
              <button onClick={() => navigate('/investor-login')} className="btn-dark inline-flex items-center gap-2">
                <Lock className="w-4 h-4" /> {t('signIn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CHAIRMAN PROFILE (at the absolute bottom)
// ============================================================
function ChairmanProfile() {
  const subTags = ['Businessman', 'Motivational Speaker', 'Columnist'];
  const holdings = [
    { name: 'ICON SAUDI ARABIA', region: 'Saudi Arabia' },
    { name: 'ICON OMAN', region: 'Oman' },
    { name: 'ICON BANGLADESH', region: 'Bangladesh' },
  ];

  return (
    <section className="px-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <div className="beam-panel">
          <div className="beam-panel-inner p-8 md:p-10">
            {/* Chairman Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #EAB308, #FCD34D)', boxShadow: '0 0 16px rgba(234,179,8,0.25)' }}>
                <Star className="w-3.5 h-3.5" style={{ color: '#1A120B' }} fill="#1A120B" />
                <span className="text-xs font-bold tracking-wider" style={{ color: '#1A120B' }}>CHAIRMAN</span>
              </div>
            </div>

            {/* Portrait and names */}
            <div className="text-center mb-5">
              <div className="chairman-portrait mx-auto mb-5">
                <img src="/IMG_5713.png" alt="Mufti Mahfuzur Rahman Jaber" />
              </div>
              <h3 className="turmeric-glow text-xl md:text-2xl font-bold mb-1">Mufti Mahfuzur Rahman Jaber</h3>
              <p className="text-white/80 text-base font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>মুফতী মাহফুজুর রহমান জাবের</p>
            </div>

            {/* Sub-Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {subTags.map((tag, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <Star className="w-2.5 h-2.5 turmeric" fill="#EAB308" />}
                  <span className="badge badge-gold">{tag}</span>
                </div>
              ))}
            </div>

            <div className="section-divider mb-8" />

            {/* Official Holdings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {holdings.map((h, i) => (
                <div key={i} className="beam-small">
                  <div className="beam-small-inner p-4 text-center">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(18,12,7,0.6)', border: '1px solid rgba(212,160,23,0.20)' }}>
                      <Award className="w-5 h-5 turmeric" />
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full mb-2" style={{ background: 'rgba(234,179,8,0.10)', border: '1px solid rgba(234,179,8,0.25)' }}>
                      <span className="turmeric text-[0.6rem] font-bold tracking-wider">CHAIRMAN</span>
                    </div>
                    <h4 className="text-white text-sm font-semibold">{h.name}</h4>
                    <p className="sage text-[0.65rem] mt-0.5">{h.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
