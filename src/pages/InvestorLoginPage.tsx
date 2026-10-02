import { useState, useEffect } from 'react';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function InvestorLoginPage() {
  const { t, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(t('loginError'));
      setLoading(false);
      return;
    }

    if (data.user) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center animate-fade-in">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(250,247,241,0.8)', border: '1px solid rgba(184,144,58,0.25)', boxShadow: '0 4px 20px rgba(184,144,58,0.08), 0 0 18px rgba(184,144,58,0.06)' }}>
            <Lock className="w-7 h-7" style={{ color: '#B8903A' }} />
          </div>
          <h1 className="font-serif text-4xl mb-2 tracking-wide" style={{ color: '#2A2520' }}>{t('investorLoginTitle')}</h1>
          <div className="section-divider mb-2" />
          <p className="text-sm" style={{ color: 'rgba(42,37,32,0.5)' }}>{t('investorLoginSubtitle')}</p>
        </div>

        <div className="neon-card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', color: '#c0392b' }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(42,37,32,0.55)' }}>{t('investorId')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(184,144,58,0.5)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-luxury pl-10"
                  placeholder="investor@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(42,37,32,0.55)' }}>{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(184,144,58,0.5)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-luxury pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? t('loading') : (
                <>
                  {t('signIn')} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'rgba(42,37,32,0.35)' }}>
          Authorized access only. Contact your account manager for credentials.
        </p>
      </div>
    </div>
  );
}
