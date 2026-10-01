import { Sparkles, MapPin, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t, navigate } = useApp();

  const offices = [
    { name: 'মক্কা অফিস', address: 'মক্কা, সৌদি আরব', phone: '+966 50 000 0000' },
    { name: 'ওমান অফিস', address: 'মাস্কাট, ওমান', phone: '+968 00 000 000' },
    { name: 'বাংলাদেশ অফিস', address: 'ঢাকা, বাংলাদেশ', phone: '+880 00 000 00000' },
    { name: 'যুক্তরাজ্য / যুক্তরাষ্ট্র', address: 'লন্ডন / নিউইয়র্ক', phone: '+44 00 000 00000' },
  ];

  return (
    <footer className="mt-16 relative z-10" style={{ background: 'rgba(8,10,12,0.7)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(0,255,102,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#0D0F12', border: '1px solid rgba(0,255,102,0.20)', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                <Sparkles className="w-4 h-4 neon-text" />
              </div>
              <div>
                <div className="font-serif text-lg text-white tracking-wide">{t('brandName')}</div>
                <div className="text-[0.55rem] tracking-[0.2em] uppercase sage-text">{t('brandTagline')}</div>
              </div>
            </div>
            <p className="sage-text text-sm leading-relaxed mb-4">{t('hub2Subtitle')}</p>
            <div className="flex gap-2">
              {['Facebook', 'Twitter', 'Instagram'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer text-xs sage-text hover:neon-text" style={{ border: '1px solid rgba(0,255,102,0.18)' }}>
                  {s[0]}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-white text-base mb-3">লিংক</h4>
            <ul className="space-y-2">
              {[
                { label: t('home'), path: '/' },
                { label: t('businessCity'), path: '/#business' },
                { label: t('expatServices'), path: '/#expat' },
                { label: t('investorLogin'), path: '/investor-login' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => {
                      if (link.path.startsWith('/#')) {
                        navigate('/');
                        setTimeout(() => document.getElementById(link.path.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 100);
                      } else navigate(link.path);
                    }}
                    className="sage-text hover:text-green-400 text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-base mb-3">আইনি</h4>
            <ul className="space-y-2">
              {[t('privacyPolicy'), t('termsConditions')].map((label) => (
                <li key={label}>
                  <button className="sage-text hover:text-green-400 text-sm transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white text-base mb-3">অফিস</h4>
            <div className="space-y-3">
              {offices.map((office) => (
                <div key={office.name} className="text-xs">
                  <p className="neon-text font-medium">{office.name}</p>
                  <div className="flex items-start gap-1.5 mt-0.5 sage-text">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sage-text">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span dir="ltr">{office.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid rgba(0,255,102,0.06)' }}>
          <p className="text-xs" style={{ color: 'rgba(184,255,217,0.25)' }}>© {new Date().getFullYear()} {t('brandName')}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}
