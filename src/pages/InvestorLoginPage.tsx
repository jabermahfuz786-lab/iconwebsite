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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#1A120B', border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 18px rgba(234,179,8,0.12)' }}>
            <Lock className="w-7 h-7 text-yellow-500" />
          </div>
          <h1 className="font-serif text-4xl text-white mb-2 tracking-wide">{t('investorLoginTitle')}</h1>
          <div className="section-divider mb-2" />
          <p className="text-white/45 text-sm">{t('investorLoginSubtitle')}</p>
        </div>

        <div className="neon-card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/55 text-xs mb-1.5 uppercase tracking-wider">{t('investorId')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
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
              <label className="block text-white/55 text-xs mb-1.5 uppercase tracking-wider">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500/50" />
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

        <p className="text-center text-white/35 text-xs mt-6">
          Authorized access only. Contact your account manager for credentials.
        </p>
      </div>
    </div>
  );
}
