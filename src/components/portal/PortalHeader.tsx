import { LogOut, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { usePortalText } from '@/lib/portalText';

export default function PortalHeader({ showLogout }: { showLogout: boolean }) {
  const { lang, setLang, navigate } = useApp();
  const { t } = usePortalText();

  // Way back to the public website from the login / dashboard pages
  const backLabel = lang === 'bn' ? 'ওয়েবসাইটে ফিরুন' : lang === 'ar' ? 'العودة إلى الموقع' : 'Back to website';

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/investor-login');
  };

  return (
    <header className="portal-header">
      <div className="portal-brand">
        <span className="portal-logo">Icon</span>
        <span className="portal-subtitle">{t('subtitle')}</span>
      </div>
      <div className="portal-actions">
        <button type="button" className="portal-logout" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> {backLabel}
        </button>
        <div className="portal-lang" role="group" aria-label="Language">
          <button type="button" className={lang !== 'en' ? 'on' : ''} onClick={() => setLang('bn')}>বাংলা</button>
          <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
        </div>
        {showLogout && (
          <button type="button" className="portal-logout" onClick={logout}>
            <LogOut size={16} /> {t('logout')}
          </button>
        )}
      </div>
    </header>
  );
}
