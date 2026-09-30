import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, Upload, Send, CheckCircle, AlertCircle, Building2, Home, FileText,
  Plane, Car, Code2, Shield, ArrowRight, MapPin, DollarSign, Lock, Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase, whatsappLink } from '@/lib/supabase';
import type { Project, Currency } from '@/types';

export default function HomePage() {
  const { t } = useApp();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-5 animate-slide-up">
            <span className="badge badge-gold">{t('brandTagline')}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl text-cream-50 mb-4 animate-slide-up tracking-wide" style={{ animationDelay: '0.1s' }}>
            {t('brandName')}
          </h1>
          <p className="text-cream-50/50 text-lg max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('hub2Subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => document.getElementById('business')?.scrollIntoView({ behavior: 'smooth' })} className="btn-gold cta-pulse">
              {t('businessCity')} <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => document.getElementById('expat')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline-gold">
              {t('expatServices')}
            </button>
          </div>
        </div>
      </section>

      {/* HUB 1 (TOP): Business City */}
      <BusinessHub />

      {/* HUB 2 (BOTTOM): Expat Services */}
      <ExpatHub />
    </div>
  );
}

// ============ HUB 1 (TOP): BUSINESS CITY ============
function BusinessHub() {
  const { t } = useApp();

  return (
    <section id="business" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-2 tracking-wide">{t('hub2Title')}</h2>
          <div className="section-divider mb-2" />
          <p className="text-cream-50/40 text-sm">{t('hub2Subtitle')}</p>
        </div>

        <div className="space-y-6">
          <BusinessBlock
            icon={Home}
            title={t('residencyTitle')}
            desc={t('residencyDesc')}
            bullets={[
              '৪ মিলিয়ন এসএআর রিয়েল এস্টেট ক্রয় → প্রিমিয়াম রেসিডেন্সি',
              'কর্পোরেট ইনভেস্টর আইন সহায়তা',
              'ইউরোপ/যুক্তরাষ্ট্র থেকে ভিআইপি রিলোকেশন',
            ]}
            ctas={[
              { label: t('residencyCta'), primary: true },
              { label: t('residencyCta2'), primary: false },
            ]}
            inquiryType="premium_residency"
          />

          <BusinessBlock
            icon={Shield}
            title={t('licenseTitle')}
            desc={t('licenseDesc')}
            bullets={[
              'MISA ইনভেস্টর লাইসেন্স দ্রুত প্রসেসিং',
              '১০০% বিদেশি মালিকানাধীন কোম্পানি',
              'সম্পূর্ণ আইনি সহায়তা',
            ]}
            ctas={[
              { label: t('licenseCta'), primary: true },
              { label: t('licenseCta2'), primary: false },
            ]}
            inquiryType="investor_license"
          />

          <RealEstateBlock />

          <BusinessBlock
            icon={Building2}
            title={t('omanTitle')}
            desc={t('omanDesc')}
            bullets={[
              '৮ কোটি টাকার প্রিমিয়াম কমার্শিয়াল মেগা-প্রজেক্ট',
              'নিচের তলা: প্রিমিয়াম রিটেইল দোকান',
              'উপরের তলা: লাক্সারি হোটেল অ্যাপার্টমেন্ট',
              'উচ্চ বার্ষিক ভাড়া লাভ + রিসেল মূল্য বৃদ্ধি',
            ]}
            ctas={[
              { label: t('omanCta'), primary: true },
              { label: t('omanCta2'), primary: false },
            ]}
            inquiryType="oman_project"
          />

          <BusinessBlock
            icon={Plane}
            title={t('umrahB2bTitle')}
            desc={t('umrahB2bDesc')}
            bullets={[
              'হোলসেল গ্রুপ টিকিটিং',
              'প্রিমিয়াম মাল্টিপল-এন্ট্রি ওমরাহ ভিসা',
              'আন্তর্জাতিক এজেন্সি পোর্টাল',
            ]}
            ctas={[{ label: t('umrahB2bCta'), primary: true }]}
            inquiryType="b2b_umrah"
          />

          <BusinessBlock
            icon={Car}
            title={t('transportTitle')}
            desc={t('transportDesc')}
            bullets={[
              'কমার্শিয়াল ও লাক্সারি যানবাহন লিজিং',
              'এয়ারপোর্ট ফ্লিট ডেপ্লয়মেন্ট',
              'ফ্র্যাকশনাল অটোমোটিভ বিনিয়োগ',
            ]}
            ctas={[{ label: t('transportCta'), primary: true }]}
            inquiryType="transport"
          />

          <BusinessBlock
            icon={Code2}
            title={t('itTitle')}
            desc={t('itDesc')}
            bullets={[
              'কর্পোরেট ফেসবুক বুস্টিং',
              'হাই-এন্ড ভিডিও ও কনটেন্ট ক্রিয়েশন',
              'প্রিমিয়াম ওয়েবসাইট/মোবাইল অ্যাপ ডেভেলপমেন্ট',
            ]}
            ctas={[{ label: t('itCta'), primary: true }]}
            inquiryType="it_services"
          />

          <VaultBlock />
        </div>
      </div>
    </section>
  );
}

function BusinessBlock({
  icon: Icon, title, desc, bullets, ctas, inquiryType,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  bullets: string[];
  ctas: { label: string; primary: boolean }[];
  inquiryType: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleCta = async (label: string) => {
    await supabase.from('business_inquiries').insert({ inquiry_type: inquiryType, message: label });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="smoke-card-glow p-6 md:p-8">
      <div className="flex items-start gap-4 mb-4">
        <div className="neu-icon neu-icon-lg">
          <Icon className="w-6 h-6 text-amber-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl text-cream-50 mb-1 tracking-wide">{title}</h3>
          <p className="text-cream-50/50 text-sm leading-relaxed">{desc}</p>
        </div>
      </div>

      {bullets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-5 ml-0 md:ml-16">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-cream-50/60 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" style={{ boxShadow: '0 0 4px rgba(230, 161, 92, 0.5)' }} />
              {b}
            </div>
          ))}
        </div>
      )}

      {submitted && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl smoke-inset text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" /> আপনার অনুরোধ গ্রহণ করা হয়েছে।
        </div>
      )}

      <div className="flex flex-wrap gap-3 ml-0 md:ml-16">
        {ctas.map((cta, i) => (
          <button
            key={i}
            onClick={() => handleCta(cta.label)}
            className={cta.primary ? 'btn-gold cta-pulse' : 'btn-outline-gold'}
          >
            {cta.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RealEstateBlock() {
  const { t } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>('USD');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .in('category', ['makkah', 'madinah', 'oman'])
        .order('sort_order')
        .limit(8);
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const rates: Record<Currency, number> = { USD: 1, SAR: 3.75, OMR: 0.385, BDT: 110 };
  const convertPrice = (price: number, from: Currency, to: Currency) => (price / rates[from]) * rates[to];
  const formatPrice = (price: number, curr: Currency) => {
    const symbols: Record<Currency, string> = { SAR: 'SAR', OMR: 'OMR', BDT: '৳', USD: '$' };
    const formatted = price >= 1000000 ? `${(price / 1000000).toFixed(1)}M` : price >= 1000 ? `${(price / 1000).toFixed(0)}K` : price.toString();
    return `${symbols[curr]} ${formatted}`;
  };

  const scroll = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });

  return (
    <div className="smoke-card-glow p-6 md:p-8">
      <div className="flex items-start gap-4 mb-5">
        <div className="neu-icon neu-icon-lg">
          <Building2 className="w-6 h-6 text-amber-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl text-cream-50 mb-1 tracking-wide">{t('realEstateTitle')}</h3>
          <p className="text-cream-50/50 text-sm">{t('realEstateDesc')}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          {(['SAR', 'OMR', 'BDT', 'USD'] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)} className={`currency-btn ${currency === c ? 'active' : ''}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {loading ? (
            [1, 2, 3].map((i) => <div key={i} className="shrink-0 w-72 h-64 skeleton rounded-2xl" />)
          ) : (
            projects.map((p) => (
              <div key={p.id} className="shrink-0 w-72 smoke-card overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-espresso-600 to-espresso-700 flex items-center justify-center relative">
                  <Building2 className="w-10 h-10 text-amber-400/30" />
                  <div className="absolute top-2 left-2">
                    <span className={`badge ${
                      p.status_badge === 'available' ? 'badge-gold' :
                      p.status_badge === 'upcoming' ? 'badge-blue' :
                      p.status_badge === 'completed' ? 'badge-green' : 'badge-red'
                    }`}>{p.status_badge}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-cream-50 font-medium text-sm mb-1">{p.name}</h4>
                  <div className="flex items-center gap-1 text-cream-50/40 text-xs mb-2">
                    <MapPin className="w-3 h-3" /> {p.city}, {p.country}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-cream-50/40 text-[0.65rem]">{t('startingFrom')}</p>
                      <p className="text-amber-300 font-medium text-sm">{formatPrice(convertPrice(p.starting_price, p.price_currency, currency), currency)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cream-50/40 text-[0.65rem]">{t('unitsLeft')}</p>
                      <p className="text-cream-50/80 font-medium text-sm">{p.available_units}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[0.65rem] mb-1">
                      <span className="text-cream-50/40">{p.construction_status === 'ready' ? t('ready') : t('underConstruction')}</span>
                      <span className="text-amber-300">{p.construction_progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${p.construction_progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cream-50/40">
                    <span className="badge badge-charcoal">{p.property_type}</span>
                    <span className="badge badge-charcoal">{p.payment_type === 'cash' ? t('cash') : t('installment')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && projects.length > 3 && (
          <div className="flex gap-2 mt-3 justify-center">
            <button onClick={() => scroll(-1)} className="scroll-arrow">←</button>
            <button onClick={() => scroll(1)} className="scroll-arrow">→</button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'real_estate_buy' })} className="btn-gold cta-pulse">
          {t('realEstateCta')}
        </button>
        <button onClick={() => supabase.from('business_inquiries').insert({ inquiry_type: 'real_estate_invest' })} className="btn-outline-gold">
          {t('realEstateCta2')}
        </button>
        <a href={whatsappLink('আমি রিয়েল এস্টেট প্রজেক্ট সম্পর্কে জানতে চাই।')} target="_blank" rel="noopener noreferrer" className="btn-dark flex items-center gap-2">
          {t('realEstateCta3')}
        </a>
      </div>
    </div>
  );
}

function VaultBlock() {
  const { t, navigate } = useApp();
  return (
    <div className="smoke-card-glow p-8 md:p-10 text-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(230, 161, 92, 0.06), transparent 70%)' }} />
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-espresso-900 flex items-center justify-center mx-auto mb-4" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 2px rgba(230, 161, 92, 0.1), 0 0 15px rgba(230, 161, 92, 0.1)' }}>
          <Lock className="w-7 h-7 text-amber-300" />
        </div>
        <h3 className="font-serif text-2xl text-cream-50 mb-2 tracking-wide">{t('vaultTitle')}</h3>
        <p className="text-cream-50/40 text-sm mb-6 max-w-md mx-auto">{t('vaultSubtitle')}</p>
        <button onClick={() => navigate('/investor-login')} className="btn-dark cta-pulse inline-flex items-center gap-2">
          <Lock className="w-4 h-4" /> {t('signIn')}
        </button>
      </div>
    </div>
  );
}

// ============ HUB 2 (BOTTOM): EXPAT SERVICES ============
function ExpatHub() {
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
    <section id="expat" className="py-16 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-2 tracking-wide">{t('hub1Title')}</h2>
          <div className="section-divider mb-2" />
          <p className="text-cream-50/40 text-sm">{t('hub1Subtitle')}</p>
        </div>

        <div className="space-y-3">
          {services.map((service, i) => (
            <ExpatServiceCard
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
                  service_type: t(service.key as any),
                  description,
                  contact_name: name,
                  contact_phone: phone,
                });
                setSubmitting(false);
                setSubmitted(i);
                setTimeout(() => { setSubmitted(null); setExpanded(null); }, 4000);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpatServiceCard({
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
    <div className={`smoke-card overflow-hidden ${isExpanded ? '!border-amber-400/60' : ''}`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left">
        <span className="service-index">{index}</span>
        <div className="neu-icon">
          <Icon className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-cream-50 font-medium text-sm leading-tight">{title}</h3>
          <p className="text-cream-50/40 text-xs mt-0.5 truncate">{desc}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-300 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="expand-content px-4 pb-4">
          {submitted ? (
            <div className="flex items-center gap-3 p-4 rounded-xl smoke-inset">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <p className="text-green-400 text-sm">{t('submitted')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('yourName')} required className="input-luxury text-sm" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('yourPhone')} required className="input-luxury text-sm" />
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('problemDesc')} required rows={3} className="input-luxury text-sm resize-none" />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-cream-50/50 text-xs cursor-pointer hover:text-amber-300 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('uploadDoc')}</span>
                  <input type="file" className="hidden" />
                </label>
              </div>
              <button type="submit" disabled={submitting} className="btn-gold cta-pulse w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" />
                {submitting ? t('loading') : t('submitToCare')}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
