import { Sparkles, MapPin, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t, navigate } = useApp();

  const offices = [
    { name: 'Makkah Office', address: 'Makkah, Saudi Arabia', phone: '+966 50 000 0000' },
    { name: 'Oman Office', address: 'Muscat, Oman', phone: '+968 00 000 000' },
    { name: 'Bangladesh Office', address: 'Dhaka, Bangladesh', phone: '+880 00 000 00000' },
  ];

  return (
    <footer className="mt-8 relative z-10" style={{ background: 'rgba(6,10,8,0.7)', borderTop: '1px solid rgba(20,83,45,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#060A08', border: '1px solid rgba(20,83,45,0.20)' }}>
                <Sparkles className="w-4 h-4 turmeric" />
              </div>
              <div>
                <div className="font-sans text-lg font-extrabold turmeric tracking-tight">{t('brandName')}</div>
                <div className="sage text-[0.55rem] tracking-[0.15em] uppercase">{t('brandTagline')}</div>
              </div>
            </div>
            <p className="sage text-sm leading-relaxed">{t('brandTagline')}</p>
          </div>

          <div>
            <h4 className="turmeric text-sm font-semibold mb-3">Links</h4>
            <ul className="space-y-2">
              {[
                { label: t('home'), path: '/' },
                { label: t('investorLogin'), path: '/investor-login' },
                { label: t('admin'), path: '/admin' },
              ].map((link) => (
                <li key={link.path}>
                  <button onClick={() => navigate(link.path)} className="sage hover:text-turmeric text-sm transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="turmeric text-sm font-semibold mb-3">Offices</h4>
            <div className="space-y-3">
              {offices.map((office) => (
                <div key={office.name} className="text-xs">
                  <p className="turmeric font-medium">{office.name}</p>
                  <div className="flex items-start gap-1.5 sage mt-0.5">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sage">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span dir="ltr">{office.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 text-center" style={{ borderTop: '1px solid rgba(20,83,45,0.06)' }}>
          <p className="sage text-xs">© {new Date().getFullYear()} {t('brandName')}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}
