import { useState } from 'react';
import {
  Building2, Home, FileText, Plane, Code2, Shield,
  DollarSign, Briefcase, Globe, PiggyBank, TrendingUp, Hotel, Store, Wheat, FlaskConical,
  CheckCircle2, MapPin, Zap, Lock, Handshake, Activity, Clock, XCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { whatsappLink } from '@/lib/supabase';
import { InquiryModal } from '@/components/InquiryModal';

const GOLD = '#9A7820';

// ============================================================
// REAL ESTATE — Zones, Pricing, Founding Partners, CTA at bottom
// ============================================================
export function RealEstateContent() {
  const { t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [fpModal, setFpModal] = useState(false);
  const [fpName, setFpName] = useState('');

  const makkahZones = ['Al Aziziyah', 'Nuzhah', 'Shisha', 'Khalidiyah', 'Al Shati', 'Al Rusayfah'];
  const madinahZones = ['Quba', 'Sultana', 'Bani Salamah', 'Al Harrah', 'Al Iskan'];
  const makkahProjects = ['Masar', 'Jabal Omar', 'Ruwayfa', 'Saraya', 'Zone 1', 'Zone 2', 'Zone 3'];
  const madinahProjects = ['Madinah Central', 'Quba District', 'Sultana Heights'];

  const foundingPartners = [
    { icon: Building2, name: 'Makkah Founding Partner' },
    { icon: Home, name: 'Madinah Founding Partner' },
    { icon: Building2, name: 'Oman Founding Partner' },
    { icon: Building2, name: 'Salalah Founding Partner' },
    { icon: Hotel, name: 'Kuakata Land & Hotel Project Founding Partner' },
  ];

  const fpFeatures = [
    'Transparent Profit Sharing & Legal Mutual Agreement',
    'Formal Investment License Agreement setup',
    'Real-Time Project Tracking via custom Real Estate Controlling Software & Investor Portal — monitor progress A-to-Z anytime',
  ];

  const openFpModal = (name: string) => { setFpName(name); setFpModal(true); };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Non-Saudi Zone heading */}
      <div className="text-center">
        <h4 className="turmeric-glow text-lg font-bold lux-serif">{t('reNonSaudiZones')}</h4>
      </div>

      {/* Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="beam-small"><div className="beam-small-inner p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" style={{ color: GOLD }} />
            <p className="lux-body text-sm font-bold">{t('reMakkahZones')}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {makkahZones.map((z, i) => <span key={i} className="badge badge-charcoal">{z}</span>)}
          </div>
          <div className="space-y-1.5">
            {makkahProjects.map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: 'rgba(184,144,58,0.04)' }}>
                <Building2 className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
                <p className="lux-body text-xs opacity-70">{p}</p>
              </div>
            ))}
          </div>
        </div></div>
        <div className="beam-small"><div className="beam-small-inner p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4" style={{ color: GOLD }} />
            <p className="lux-body text-sm font-bold">{t('reMadinahZones')}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {madinahZones.map((z, i) => <span key={i} className="badge badge-charcoal">{z}</span>)}
          </div>
          <div className="space-y-1.5">
            {madinahProjects.map((p, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: 'rgba(184,144,58,0.04)' }}>
                <Home className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
                <p className="lux-body text-xs opacity-70">{p}</p>
              </div>
            ))}
          </div>
        </div></div>
      </div>

      {/* Pricing */}
      <div>
        <h4 className="turmeric-glow text-lg font-bold text-center mb-1 lux-serif">{t('rePricing')}</h4>
        <p className="sage text-xs text-center mb-3">{t('rePricingSub')}</p>
        <div className="beam-small mb-2"><div className="beam-small-inner p-3">
          <p className="sage text-xs font-semibold mb-2">{t('reLandZone')}</p>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
            <p className="lux-body text-xs opacity-70">3,000 SAR/sqm (15-20 mins from Haram)</p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} />
            <p className="lux-body text-xs opacity-70">2.5 Million SAR (0-meter / Jabal Omar)</p>
          </div>
        </div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="beam-small"><div className="beam-small-inner p-3">
            <p className="text-sm font-bold mb-2" style={{ color: GOLD }}>{t('reFlatMakkah')}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} /><p className="lux-body text-xs opacity-70">300,000 – 500,000 SAR (15-20 mins)</p></div>
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} /><p className="lux-body text-xs opacity-70">500,000 – 700,000 SAR (10 mins)</p></div>
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} /><p className="lux-body text-xs opacity-70">2.5M – 4M SAR (Zero meter)</p></div>
            </div>
          </div></div>
          <div className="beam-small"><div className="beam-small-inner p-3">
            <p className="text-sm font-bold mb-2" style={{ color: GOLD }}>{t('reFlatMadinah')}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} /><p className="lux-body text-xs opacity-70">299,500 – 499,500 SAR (15-20 mins)</p></div>
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} /><p className="lux-body text-xs opacity-70">499,500 – 699,500 SAR (10 mins)</p></div>
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 shrink-0" style={{ color: GOLD }} /><p className="lux-body text-xs opacity-70">2.0M – 3.5M SAR (Quba & local zones)</p></div>
            </div>
          </div></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="beam-small"><div className="beam-small-inner p-3">
            <p className="text-sm font-bold mb-1" style={{ color: GOLD }}>{t('reVillaMakkah')}</p>
            <p className="lux-body text-xs opacity-60">Separate curated rate card for Makkah villas.</p>
          </div></div>
          <div className="beam-small"><div className="beam-small-inner p-3">
            <p className="text-sm font-bold mb-1" style={{ color: GOLD }}>{t('reVillaMadinah')}</p>
            <p className="lux-body text-xs opacity-60">Separate curated rate card for Madinah villas.</p>
          </div></div>
        </div>
      </div>

      {/* Founding Partner Cards */}
      <div>
        <h4 className="turmeric-glow text-base font-bold text-center mb-3 lux-serif">Founding Partner Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {foundingPartners.map((fp, i) => (
            <button key={i} onClick={() => openFpModal(fp.name)} className="text-left beam-small hover:scale-[1.01] transition-transform">
              <div className="beam-small-inner p-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(184,144,58,0.06)', border: '1px solid rgba(184,144,58,0.15)' }}>
                    <fp.icon className="w-4 h-4" style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="lux-body text-xs font-semibold">{fp.name}</p>
                      <Handshake className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
                    </div>
                    <p className="lux-body text-[0.65rem] leading-relaxed opacity-65">Transparent profit sharing & real-time tracking</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA — at the absolute bottom */}
      <div className="flex gap-2 pt-2">
        <button onClick={() => setModalOpen(true)} className="btn-gold flex-1">{t('reBecomeInvestorOrBuy')}</button>
        <a href={whatsappLink('Real Estate inquiry')} target="_blank" rel="noopener noreferrer" className="btn-outline">{t('whatsapp')}</a>
      </div>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('reInquiry')}
        inquiryType="real_estate"
        whatsappMsg="Real Estate Inquiry"
        fields={[
          { key: 'name', label: t('yourName'), type: 'text', required: true },
          { key: 'phone', label: t('yourPhone'), type: 'tel', required: true },
        ]}
      />
      <InquiryModal
        open={fpModal}
        onClose={() => setFpModal(false)}
        title={fpName}
        inquiryType="founding_partner"
        whatsappMsg={`Founding Partner Inquiry: ${fpName}`}
        fields={[
          { key: 'name', label: t('yourName'), type: 'text', required: true },
          { key: 'phone', label: t('yourPhone'), type: 'tel', required: true },
        ]}
      >
        <div className="space-y-2 p-3 rounded-lg" style={{ background: 'rgba(184,144,58,0.04)' }}>
          {fpFeatures.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p className="lux-body text-xs opacity-75 leading-relaxed">{f}</p>
            </div>
          ))}
        </div>
      </InquiryModal>
    </div>
  );
}

// ============================================================
// INVESTOR LICENSE
// ============================================================
export function LicenseContent() {
  const { t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const services = [
    { label: t('licMISA') }, { label: t('licZATCA') }, { label: t('licQIWA') },
    { label: t('licMuqeem') }, { label: t('licCR') }, { label: t('licNameClearance') },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="beam-small"><div className="beam-small-inner p-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6" style={{ color: GOLD }} />
            <h4 className="text-base font-bold lux-serif" style={{ color: GOLD }}>{t('licService')}</h4>
          </div>
          <p className="lux-body text-sm leading-relaxed opacity-80">{t('licServiceDesc')}</p>
        </div></div>
        <div className="beam-small"><div className="beam-small-inner p-5">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-6 h-6" style={{ color: GOLD }} />
            <h4 className="text-base font-bold lux-serif" style={{ color: GOLD }}>{t('licTrading')}</h4>
          </div>
          <p className="lux-body text-sm leading-relaxed opacity-80">{t('licTradingDesc')}</p>
        </div></div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2" style={{ color: GOLD }}>{t('licOurServices')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {services.map((s, i) => (
            <div key={i} className="beam-small"><div className="beam-small-inner p-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: GOLD }} />
              <p className="lux-body text-xs opacity-80">{s.label}</p>
            </div></div>
          ))}
        </div>
      </div>

      <div className="beam-small"><div className="beam-small-inner p-4">
        <h4 className="text-sm font-bold mb-3" style={{ color: GOLD }}>{t('licFeeStructure')}</h4>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(184,144,58,0.06)' }}>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} />
            <p className="lux-body text-xs leading-relaxed opacity-80">{t('licGovFee')}</p>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(184,144,58,0.04)' }}>
            <div>
              <p className="lux-body text-xs font-semibold">{t('licServiceFee')}</p>
              <p className="sage text-[0.6rem]">{t('licNoHidden')}</p>
            </div>
            <p className="text-sm font-bold" style={{ color: GOLD }}>6,500 SAR</p>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(184,144,58,0.04)' }}>
            <div>
              <p className="lux-body text-xs font-semibold">{t('licTradingFee')}</p>
              <p className="sage text-[0.6rem]">{t('licNoHidden')}</p>
            </div>
            <p className="text-sm font-bold" style={{ color: GOLD }}>8,500 SAR</p>
          </div>
          <p className="sage text-[0.6rem] text-center pt-1">{t('licOfficialFees')}</p>
        </div>
      </div></div>

      <button onClick={() => setModalOpen(true)} className="btn-gold w-full">{t('licApply')}</button>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('licAppForm')}
        inquiryType="investor_license"
        whatsappMsg="Investor License Inquiry"
        fields={[
          { key: 'name', label: t('yourName'), type: 'text', required: true },
          { key: 'phone', label: t('yourPhone'), type: 'tel', required: true },
          { key: 'passportId', label: t('licPassportId'), type: 'text', required: true },
          { key: 'signature', label: t('licSignature'), type: 'text', placeholder: 'Type your full name as signature' },
        ]}
      />
    </div>
  );
}

// ============================================================
// UMRAH B2B
// ============================================================
export function UmrahContent() {
  const { t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const services = [
    { icon: FileText, label: 'Umrah MOFA' },
    { icon: Plane, label: 'Transportation' },
    { icon: Shield, label: 'Rapid Passport & Visa' },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="text-center">
        <h4 className="turmeric-glow text-base font-bold lux-serif">{t('umrahB2BHeader')}</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {services.map((s, i) => (
          <div key={i} className="beam-small"><div className="beam-small-inner p-4 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184,144,58,0.06)', border: '1px solid rgba(184,144,58,0.15)' }}>
              <s.icon className="w-5 h-5" style={{ color: GOLD }} />
            </div>
            <p className="lux-body text-xs font-medium">{s.label}</p>
            <span className="badge badge-gold flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Fast</span>
          </div></div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setModalOpen(true)} className="btn-gold flex-1">{t('umrahCta')}</button>
        <a href={whatsappLink('Umrah B2B Inquiry')} target="_blank" rel="noopener noreferrer" className="btn-outline">{t('whatsapp')}</a>
      </div>
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Umrah B2B Inquiry"
        inquiryType="b2b_umrah"
        whatsappMsg="Umrah B2B Inquiry"
        fields={[
          { key: 'name', label: t('yourName'), type: 'text', required: true },
          { key: 'phone', label: t('yourPhone'), type: 'tel', required: true },
          { key: 'service', label: 'Service', type: 'select', options: ['Umrah MOFA', 'Transportation', 'Passport & Visa'] },
        ]}
      />
    </div>
  );
}

// ============================================================
// IT SECTOR
// ============================================================
export function ITContent() {
  const { t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const services = [
    { icon: TrendingUp, label: t('itBoost') },
    { icon: FileText, label: t('itVideo') },
    { icon: Code2, label: t('itDev') },
    { icon: Globe, label: t('itCorporate') },
  ];

  return (
    <div className="animate-fade-in space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {services.map((s, i) => (
          <div key={i} className="beam-small"><div className="beam-small-inner p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(184,144,58,0.06)', border: '1px solid rgba(184,144,58,0.15)' }}>
              <s.icon className="w-4 h-4" style={{ color: GOLD }} />
            </div>
            <p className="lux-body text-xs font-medium">{s.label}</p>
          </div></div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setModalOpen(true)} className="btn-gold flex-1">{t('itCta')}</button>
        <a href={whatsappLink('IT Services Inquiry')} target="_blank" rel="noopener noreferrer" className="btn-outline">{t('whatsapp')}</a>
      </div>
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="IT Services Inquiry"
        inquiryType="it_services"
        whatsappMsg="IT Services Inquiry"
      />
    </div>
  );
}

// ============================================================
// SAVINGS FUND — Provashi Savings Fund
// ============================================================
export function SavingsContent() {
  const { t } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [fundType, setFundType] = useState('umrah');

  return (
    <div className="animate-fade-in space-y-4">
      <div className="text-center">
        <h4 className="turmeric-glow text-lg font-bold lux-serif">Provashi Savings Fund</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="beam-small"><div className="beam-small-inner p-4">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5" style={{ color: GOLD }} />
            <h4 className="text-sm font-bold" style={{ color: GOLD }}>Umrah Savings</h4>
          </div>
          <p className="lux-body text-xs leading-relaxed mb-3 opacity-70">{t('sfUmrahDesc')}</p>
          <button onClick={() => { setFundType('umrah'); setModalOpen(true); }} className="btn-gold w-full text-xs">{t('sfRegister')}</button>
        </div></div>
        <div className="beam-small"><div className="beam-small-inner p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: GOLD }} />
            <h4 className="text-sm font-bold" style={{ color: GOLD }}>Provashi Savings</h4>
          </div>
          <p className="lux-body text-xs leading-relaxed mb-3 opacity-70">{t('sfExpatDesc')}</p>
          <button onClick={() => { setFundType('expat'); setModalOpen(true); }} className="btn-gold w-full text-xs">{t('sfRegister')}</button>
        </div></div>
      </div>
      <a href={whatsappLink('Savings Fund Inquiry')} target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-center block">{t('whatsapp')}</a>
      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={fundType === 'umrah' ? 'Umrah Savings' : 'Provashi Savings'}
        inquiryType={`savings_${fundType}`}
        whatsappMsg={`${fundType === 'umrah' ? 'Umrah' : 'Provashi'} Savings Fund Inquiry`}
        fields={[
          { key: 'name', label: t('yourName'), type: 'text', required: true },
          { key: 'phone', label: t('yourPhone'), type: 'tel', required: true },
          { key: 'amount', label: 'Amount (BDT)', type: 'text', placeholder: '100,000+' },
        ]}
      />
    </div>
  );
}

// ============================================================
// INVESTOR SECTOR — Investor Login portal + categorized projects
// ============================================================
type ProjectStatus = 'running' | 'expired' | 'completed';

interface ProjectItem {
  icon: typeof Hotel;
  name: string;
  type: string;
  status: ProjectStatus;
  desc?: string;
  open?: boolean;
}

export function InvestmentContent() {
  const { t, navigate } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('');

  const openInquiry = (title: string, type: string) => {
    setModalTitle(title); setModalType(type); setModalOpen(true);
  };

  const runningProjects: ProjectItem[] = [
    { icon: Hotel, name: 'Makkah Hotel Project', type: 'makkah_hotel', status: 'running', open: true },
    { icon: Handshake, name: 'Makkah Founding Partner', type: 'makkah_founding', status: 'running' },
    { icon: Hotel, name: 'Kuakata Hotel & Land Project', type: 'kuakata_hotel', status: 'running', open: true },
    { icon: Building2, name: 'Oman S33 Project', type: 'oman_s33', status: 'running', desc: '80M BDT. Ground floor 8 shops, 9 top flats.' },
    { icon: Building2, name: 'Oman S11 Project', type: 'oman_s11', status: 'running' },
    { icon: Building2, name: 'Oman C11 Project', type: 'oman_c11', status: 'running' },
    { icon: Building2, name: 'Oman C004 Project', type: 'oman_c004', status: 'running' },
    { icon: Building2, name: 'Oman June 11 Project', type: 'oman_june11', status: 'running' },
  ];

  const expiredProjects: ProjectItem[] = [
    { icon: XCircle, name: 'February Project', type: 'february', status: 'expired', desc: 'Investment Closed' },
    { icon: XCircle, name: 'June/July Project', type: 'june_july', status: 'expired', desc: 'Not Complete' },
  ];

  const completedProjects: ProjectItem[] = [
    { icon: CheckCircle2, name: 'Oman A33 Project', type: 'oman_a33', status: 'completed' },
    { icon: CheckCircle2, name: 'Oman A10 Project', type: 'oman_a10', status: 'completed' },
    { icon: CheckCircle2, name: 'Makkah C333 Project', type: 'makkah_c333', status: 'completed' },
  ];

  const statusBadge = (status: ProjectStatus, open?: boolean) => {
    if (status === 'running') {
      return open
        ? <span className="badge badge-green flex items-center gap-1"><Activity className="w-2.5 h-2.5" /> Running · Open</span>
        : <span className="badge badge-gold flex items-center gap-1"><Activity className="w-2.5 h-2.5" /> Running</span>;
    }
    if (status === 'expired') return <span className="badge badge-red flex items-center gap-1"><XCircle className="w-2.5 h-2.5" /> Expired</span>;
    return <span className="badge badge-charcoal flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Completed</span>;
  };

  const renderProject = (p: ProjectItem) => (
    <button key={p.type} onClick={() => openInquiry(p.name, p.type)} className="text-left beam-small hover:scale-[1.01] transition-transform">
      <div className="beam-small-inner p-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(184,144,58,0.06)', border: '1px solid rgba(184,144,58,0.15)' }}>
            <p.icon className="w-4 h-4" style={{ color: GOLD }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="lux-body text-xs font-semibold">{p.name}</p>
              {statusBadge(p.status, p.open)}
            </div>
            {p.desc && <p className="lux-body text-[0.65rem] leading-relaxed opacity-65">{p.desc}</p>}
            {p.status === 'running' && <p className="text-[0.6rem] mt-1" style={{ color: GOLD }}>High ROI</p>}
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="animate-fade-in space-y-4">
      {/* Investor Login Portal — prominent at top */}
      <div className="beam-small">
        <div className="beam-small-inner p-5 text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(250,247,241,0.6)', border: '1px solid rgba(184,144,58,0.25)' }}>
            <Lock className="w-6 h-6" style={{ color: GOLD }} />
          </div>
          <h4 className="text-base font-bold mb-1 lux-serif" style={{ color: GOLD }}>Investor Login</h4>
          <p className="sage text-xs mb-3">Access your secure investor portal to track allocations, payments & agreements</p>
          <button onClick={() => navigate('/investor-login')} className="btn-dark inline-flex items-center gap-2">
            <Lock className="w-4 h-4" /> {t('signIn')}
          </button>
        </div>
      </div>

      {/* Running / Active Opportunities */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4" style={{ color: GOLD }} />
          <h4 className="text-sm font-bold lux-serif" style={{ color: GOLD }}>Active Investment Opportunities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {runningProjects.map(renderProject)}
        </div>
      </div>

      {/* Expired / Closed */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4" style={{ color: '#A89A8C' }} />
          <h4 className="text-sm font-bold sage lux-serif">Expired / Closed Opportunities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {expiredProjects.map(renderProject)}
        </div>
      </div>

      {/* Completed Track Record */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4" style={{ color: GOLD }} />
          <h4 className="text-sm font-bold lux-serif" style={{ color: GOLD }}>Completed Projects (Track Record)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {completedProjects.map(renderProject)}
        </div>
      </div>

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle || t('giPartnerInquiry')}
        inquiryType={modalType || 'investor_sector'}
        whatsappMsg={`Investment Inquiry: ${modalTitle}`}
      />
    </div>
  );
}
