import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronRight, Upload, Send, CheckCircle, AlertCircle,
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
      {/* Dual-Column Master Layout (at the top) */}
      <section className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Business City */}
          <BusinessCityPanel />

          {/* RIGHT: Probashi Seba */}
          <ProbashiSebaPanel />
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
    <div className="beam-panel">
      <div className="beam-panel-inner p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(6,10,8,0.7)', border: '1px solid rgba(20,83,45,0.25)' }}>
            <Briefcase className="w-5 h-5 turmeric" />
          </div>
          <div>
            <h2 className="turmeric-glow text-xl font-bold tracking-tight">{t('businessCity')}</h2>
            <p className="sage text-xs">বিজনেস সিটি</p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCat(activeCat === i ? null : i)}
              className={`beam-small ${activeCat === i ? 'ring-1 ring-turmeric-500/40' : ''}`}
            >
              <div className="beam-small-inner p-4 flex items-center gap-3 cursor-pointer">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(6,10,8,0.6)', border: '1px solid rgba(20,83,45,0.20)' }}>
                  <cat.icon className="w-4 h-4 turmeric" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{cat.label}</p>
                  <p className="sage text-[0.65rem] truncate">{cat.labelBn}</p>
                </div>
                <ChevronRight className={`w-4 h-4 turmeric shrink-0 transition-transform ${activeCat === i ? 'rotate-90' : ''}`} />
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
            <div key={p.id} className="shrink-0 w-56 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(20,83,45,0.18)', background: 'rgba(6,10,8,0.75)' }}>
              <div className="h-20 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A120C, #122016)' }}>
                <Building2 className="w-8 h-8" style={{ color: 'rgba(20,83,45,0.30)' }} />
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(6,10,8,0.6)', border: '1px solid rgba(20,83,45,0.20)' }}>
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
// RIGHT COLUMN: PROBASHI SEBA
// ============================================================
function ProbashiSebaPanel() {
  const { t } = useApp();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);

  const services = [
    { key: 's1', icon: FileText },
    { key: 's2', icon: Shield },
    { key: 's3', icon: FileText },
    { key: 's4', icon: FileText },
    { key: 's5', icon: AlertCircle },
    { key: 's6', icon: Shield },
    { key: 's7', icon: Lock },
    { key: 's8', icon: AlertCircle },
    { key: 's9', icon: Plane },
    { key: 's10', icon: FileText },
    { key: 's11', icon: DollarSign },
  ];

  const bnNumerals = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০', '১১'];

  return (
    <div className="beam-panel">
      <div className="beam-panel-inner p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(6,10,8,0.7)', border: '1px solid rgba(20,83,45,0.25)' }}>
            <Shield className="w-5 h-5 turmeric" />
          </div>
          <div>
            <h2 className="turmeric-glow text-xl font-bold tracking-tight">PROBASHI SEBA</h2>
            <p className="sage text-xs">প্রবাসী সেবা</p>
          </div>
        </div>

        {/* 11 Service Rows */}
        <div className="space-y-2.5">
          {services.map((service, i) => (
            <ExpatRow
              key={i}
              index={bnNumerals[i]}
              title={t(service.key as any)}
              desc={t(`${service.key}d` as any)}
              icon={service.icon}
              isExpanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? null : i)}
              submitting={submitting}
              submitted={submitted === i}
              onSubmit={async (description, name, phone) => {
                setSubmitting(true);
                await supabase.from('expat_service_requests').insert({
                  service_type: t(service.key as any), description, contact_name: name, contact_phone: phone,
                });
                setSubmitting(false);
                setSubmitted(i);
                setTimeout(() => { setSubmitted(null); setExpanded(null); }, 3500);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpatRow({
  index, title, desc, icon: Icon, isExpanded, onToggle, submitting, submitted, onSubmit,
}: {
  index: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  submitting: boolean;
  submitted: boolean;
  onSubmit: (desc: string, name: string, phone: string) => Promise<void>;
}) {
  const { t } = useApp();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description, name, phone);
    setDescription(''); setName(''); setPhone('');
  };

  return (
    <div className={`beam-small ${isExpanded ? 'ring-1 ring-turmeric-500/30' : ''}`}>
      <div className="beam-small-inner">
        <button onClick={onToggle} className="w-full flex items-center gap-3 p-3.5 text-left">
          <span className="turmeric font-semibold text-sm w-6 text-center shrink-0">{index}</span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(6,10,8,0.5)', border: '1px solid rgba(20,83,45,0.15)' }}>
            <Icon className="w-4 h-4 turmeric" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-sm font-medium leading-tight truncate">{title}</h3>
            <p className="sage text-[0.65rem] truncate">{desc}</p>
          </div>
          <ChevronDown className={`w-4 h-4 turmeric shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="expand-content px-3.5 pb-3.5">
            {submitted ? (
              <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: 'rgba(20,83,45,0.10)', border: '1px solid rgba(20,83,45,0.20)', color: '#4ade80' }}>
                <CheckCircle className="w-4 h-4 shrink-0" /> {t('submitted')}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('yourName')} required className="input-luxury text-sm" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('yourPhone')} required className="input-luxury text-sm" />
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('problemDesc')} required rows={2} className="input-luxury text-sm resize-none" />
                <label className="flex items-center gap-2 sage text-xs cursor-pointer hover:text-turmeric transition-colors">
                  <Upload className="w-3.5 h-3.5" /> {t('uploadDoc')}
                  <input type="file" className="hidden" />
                </label>
                <button type="submit" disabled={submitting} className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? t('loading') : t('submitToCare')}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
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
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(20,83,45,0.04), transparent 70%)' }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#060A08', border: '1px solid rgba(20,83,45,0.25)', boxShadow: '0 0 16px rgba(20,83,45,0.08)' }}>
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
                <Star className="w-3.5 h-3.5" style={{ color: '#060A08' }} fill="#060A08" />
                <span className="text-xs font-bold tracking-wider" style={{ color: '#060A08' }}>CHAIRMAN</span>
              </div>
            </div>

            {/* Names */}
            <div className="text-center mb-4">
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
                    <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(6,10,8,0.6)', border: '1px solid rgba(20,83,45,0.20)' }}>
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
