import { useEffect, useState, type FormEvent } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { resolveLoginEmail } from '@/lib/portal';
import { usePortalText } from '@/lib/portalText';

// The login form on its own, so it can sit inside the Investment Sector as well as on its own page.
export function InvestorLoginForm() {
  const { navigate } = useApp();
  const { t } = usePortalText();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate('/dashboard');
    })();
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const email = await resolveLoginEmail(identifier);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError || !data.user) {
      setError(t('loginFailed'));
      return;
    }
    navigate('/dashboard');
  };

  return (
    <form className="glass portal-login-card" onSubmit={onSubmit}>
      <label className="portal-label" htmlFor="ident">{t('identifierLabel')}</label>
      <div className="portal-field">
        <User size={16} />
        <input
          id="ident"
          className="portal-input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <label className="portal-label" htmlFor="pw">{t('passwordLabel')}</label>
      <div className="portal-field">
        <Lock size={16} />
        <input
          id="pw"
          type="password"
          className="portal-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p className="portal-error">{error}</p>}

      <button type="submit" className="portal-btn portal-btn-full" disabled={loading}>
        {loading ? t('signingIn') : <>{t('signIn')} <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}

export default function InvestorLoginPage() {
  const { t } = usePortalText();

  return (
    <div className="portal-login">
      <div className="portal-login-wrap">
        <div className="portal-login-head">
          <div className="portal-lock"><Lock size={26} /></div>
          <h1>{t('loginTitle')}</h1>
          <p className="portal-small">{t('loginSubtitle')}</p>
        </div>

        <InvestorLoginForm />

        <p className="portal-small portal-center">{t('loginNote')}</p>
      </div>
    </div>
  );
}
