import { LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { usePortalText } from '@/lib/portalText';

export default function PortalHeader({ showLogout }: { showLogout: boolean }) {
  const { lang, setLang, navigate } = useApp();
  const { t } = usePortalText();

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
