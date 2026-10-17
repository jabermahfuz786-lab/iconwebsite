import { Sparkles, MapPin, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t, navigate } = useApp();

  const offices = [
    { name: 'Corporate Office', address: 'Alsafa Tower, Lift14 Office A72, Aziziyah, Makkah, Saudi Arabia', phone: '+966 53 400 7456' },
    { name: 'Oman Office', address: 'Sahalnoot, 153, Salalah, Oman', phone: '+968 7272 4934' },
    { name: 'Bangladesh Office', address: 'H2, Block G, South Banasree, Dhaka, Bangladesh', phone: '+880 1736 5560 32' },
  ];

  return (
    <footer className="mt-8 relative z-10" style={{ background: '#0E2B2B', borderTop: '1px solid rgba(212,175,55,0.4)', boxShadow: '0 -1px 12px rgba(212,175,55,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.35)' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <div className="font-sans text-lg font-extrabold tracking-tight" style={{ color: '#D4AF37' }}>{t('brandName')}</div>
                <div className="text-[0.55rem] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('brandTagline')}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('brandTagline')}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Links</h4>
            <ul className="space-y-2">
              {[
                { label: t('home'), path: '/' },
                { label: t('investorLogin'), path: '/investor-login' },
                { label: t('admin'), path: '/admin' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#D4AF37' }}>Offices</h4>
            <div className="space-y-3">
              {offices.map((office) => (
                <div key={office.name} className="text-xs">
                  <p className="font-medium" style={{ color: '#D4AF37' }}>{office.name}</p>
                  <div className="flex items-start gap-1.5 mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <Phone className="w-3 h-3 shrink-0" />
                    <span dir="ltr">{office.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 text-center" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>© {new Date().getFullYear()} {t('brandName')}. {t('allRightsReserved')}.</p>
        </div>
      </div>
    </footer>
  );
}
