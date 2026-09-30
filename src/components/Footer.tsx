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
    <footer className="bg-espresso-800/60 backdrop-blur border-t border-amber-400/15 mt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-espresso-700 border border-amber-400/30 flex items-center justify-center" style={{ boxShadow: 'inset 0 1px 2px rgba(230, 161, 92, 0.1), 0 2px 6px rgba(0,0,0,0.2)' }}>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="font-serif text-lg text-cream-50 tracking-wide">{t('brandName')}</div>
                <div className="text-[0.55rem] text-amber-300/60 tracking-[0.2em] uppercase">{t('brandTagline')}</div>
              </div>
            </div>
            <p className="text-cream-50/40 text-sm leading-relaxed mb-4">{t('hub2Subtitle')}</p>
            <div className="flex gap-2">
              {['Facebook', 'Twitter', 'Instagram'].map((s) => (
                <div key={s} className="w-8 h-8 rounded-full border border-amber-400/25 flex items-center justify-center text-amber-300/50 hover:text-amber-300 hover:border-amber-300 transition-all cursor-pointer text-xs">
                  {s[0]}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-cream-50 text-base mb-3">লিংক</h4>
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
                    className="text-cream-50/40 hover:text-amber-300 text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-cream-50 text-base mb-3">আইনি</h4>
            <ul className="space-y-2">
              {[t('privacyPolicy'), t('termsConditions')].map((label) => (
                <li key={label}>
                  <button className="text-cream-50/40 hover:text-amber-300 text-sm transition-colors">{label}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-cream-50 text-base mb-3">অফিস</h4>
            <div className="space-y-3">
              {offices.map((office) => (
                <div key={office.name} className="text-xs">
                  <p className="text-amber-300 font-medium">{office.name}</p>
                  <div className="flex items-start gap-1.5 text-cream-50/40 mt-0.5">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cream-50/40">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span dir="ltr">{office.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-amber-400/10 text-center">
          <p className="text-cream-50/30 text-xs">© {new Date().getFullYear()} {t('brandName')}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}
