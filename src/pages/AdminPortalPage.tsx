import { useEffect, useState, type FormEvent } from 'react';
import { ShieldCheck, Send, KeyRound, Briefcase } from 'lucide-react';
import { adminGet, adminPost, checkAdminSession, signInAdmin } from '@/lib/adminApi';

type InvestorRow = { id: string; email: string; investor_code: string; full_name: string };
type ProjectRow = { id: string; name_en: string; name_bn: string; sort_order: number };


export default function AdminPortalPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [investors, setInvestors] = useState<InvestorRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [pinInvestor, setPinInvestor] = useState('');
  const [pinProject, setPinProject] = useState('');
  const [pinValue, setPinValue] = useState('');

  const [bcProject, setBcProject] = useState('');
  const [bcTitle, setBcTitle] = useState('');
  const [bcBody, setBcBody] = useState('');

  const [invInvestor, setInvInvestor] = useState('');
  const [invProject, setInvProject] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invCurrency, setInvCurrency] = useState('USD');
  const [invReturn, setInvReturn] = useState('');

  useEffect(() => {
    if (!authed) return;
    (async () => {
      try {
        const [inv, pr] = await Promise.all([
          adminGet<{ investors: InvestorRow[] }>('investors'),
          adminGet<{ projects: ProjectRow[] }>('investor-projects'),
        ]);
        setInvestors(inv.investors ?? []);
        setProjects(pr.projects ?? []);
      } catch (err) {
        setMsg({ ok: false, text: (err as Error).message });
      }
    })();
  }, [authed]);

  const run = async (fn: () => Promise<unknown>, okText: string) => {
    setMsg(null);
    try {
      await fn();
      setMsg({ ok: true, text: okText });
    } catch (err) {
      setMsg({ ok: false, text: (err as Error).message });
    }
  };

  useEffect(() => {
    checkAdminSession().then((ok) => { if (ok) setAuthed(true); });
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setLoginErr('');
    const result = await signInAdmin(email, pw);
    if (result === 'ok') setAuthed(true);
    else if (result === 'not_admin') setLoginErr('This account does not have admin access.');
    else setLoginErr('Email or password is incorrect.');
  };

  const submitPin = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await adminPost('investor-pin', { investor_id: pinInvestor, investor_project_id: pinProject, pin: pinValue });
      setPinValue('');
    }, 'PIN সেট হয়েছে। প্রজেক্টটি ইনভেস্টরের জন্য আবার লক হয়েছে।');
  };

  const submitBroadcast = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await adminPost('broadcast', { title: bcTitle, body: bcBody, investor_project_id: bcProject || null });
      setBcTitle(''); setBcBody('');
    }, bcProject ? 'প্রজেক্টের ইনভেস্টরদের কাছে বার্তা পাঠানো হয়েছে।' : 'সব ইনভেস্টরের কাছে বার্তা পাঠানো হয়েছে।');
  };

  const submitInvestment = (e: FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === invProject);
    run(async () => {
      await adminPost('investments', {
        investor_id: invInvestor,
        investor_project_id: invProject,
        project_name: proj?.name_en ?? 'Portal project',
        investment_amount: Number(invAmount),
        currency: invCurrency,
        expected_return_pct: invReturn === '' ? null : Number(invReturn),
        status: 'active',
      });
      setInvAmount(''); setInvReturn('');
    }, 'বিনিয়োগ যুক্ত হয়েছে।');
  };

  if (!authed) {
    return (
      <div className="container" style={{ maxWidth: 380, paddingTop: 96 }}>
        <form className="neon-card p-8" onSubmit={login}>
          <h2 style={{ marginTop: 0 }}>Admin — Investor Portal</h2>
          <input type="email" className="input-luxury" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="input-luxury" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          {loginErr && <p className="text-sm" style={{ color: '#c0392b' }}>{loginErr}</p>}
          <button type="submit" className="btn-gold w-full mt-3">Enter</button>
        </form>
      </div>
    );
  }

  const label = (p: ProjectRow) => p.name_en;

  return (
    <div className="container" style={{ maxWidth: 820, paddingTop: 96, paddingBottom: 64 }}>
      <h1 style={{ fontSize: '1.6rem' }}>Investor Portal — Admin</h1>
      {msg && (
        <p className="text-sm mb-4" style={{ color: msg.ok ? '#15803d' : '#c0392b' }}>{msg.text}</p>
      )}

      <section className="neon-card p-6 mb-6">
        <h3 className="flex items-center gap-2"><KeyRound size={16} /> Set investor PIN for a project</h3>
        <form onSubmit={submitPin} className="grid gap-3 mt-3">
          <select className="input-luxury" value={pinInvestor} onChange={(e) => setPinInvestor(e.target.value)} required>
            <option value="">Select investor</option>
            {investors.map((i) => <option key={i.id} value={i.id}>{i.investor_code} — {i.full_name}</option>)}
          </select>
          <select className="input-luxury" value={pinProject} onChange={(e) => setPinProject(e.target.value)} required>
            <option value="">Select project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{label(p)}</option>)}
          </select>
          <input className="input-luxury" type="text" placeholder="PIN (4–12 characters)" value={pinValue} onChange={(e) => setPinValue(e.target.value)} minLength={4} maxLength={12} required />
          <button type="submit" className="btn-gold">Save PIN</button>
        </form>
      </section>

      <section className="neon-card p-6 mb-6">
        <h3 className="flex items-center gap-2"><Briefcase size={16} /> Add investment to a portal project</h3>
        <form onSubmit={submitInvestment} className="grid gap-3 mt-3">
          <select className="input-luxury" value={invInvestor} onChange={(e) => setInvInvestor(e.target.value)} required>
            <option value="">Select investor</option>
            {investors.map((i) => <option key={i.id} value={i.id}>{i.investor_code} — {i.full_name}</option>)}
          </select>
          <select className="input-luxury" value={invProject} onChange={(e) => setInvProject(e.target.value)} required>
            <option value="">Select project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{label(p)}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-3">
            <input className="input-luxury" type="number" min="1" step="any" placeholder="Amount" value={invAmount} onChange={(e) => setInvAmount(e.target.value)} required />
            <select className="input-luxury" value={invCurrency} onChange={(e) => setInvCurrency(e.target.value)}>
              <option>USD</option><option>SAR</option><option>OMR</option><option>BDT</option>
            </select>
            <input className="input-luxury" type="number" step="any" placeholder="Expected return % (optional)" value={invReturn} onChange={(e) => setInvReturn(e.target.value)} />
          </div>
          <button type="submit" className="btn-gold">Add investment</button>
        </form>
      </section>

      <section className="neon-card p-6">
        <h3 className="flex items-center gap-2"><Send size={16} /> Broadcast message to investors</h3>
        <form onSubmit={submitBroadcast} className="grid gap-3 mt-3">
          <select className="input-luxury" value={bcProject} onChange={(e) => setBcProject(e.target.value)}>
            <option value="">All investors (all projects)</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{label(p)} — holders only</option>)}
          </select>
          <input className="input-luxury" placeholder="Title" value={bcTitle} onChange={(e) => setBcTitle(e.target.value)} required />
          <textarea className="input-luxury" rows={4} placeholder="Message" value={bcBody} onChange={(e) => setBcBody(e.target.value)} required />
          <button type="submit" className="btn-gold">Send</button>
        </form>
      </section>

      <p className="text-xs mt-6 flex items-center gap-2" style={{ opacity: 0.6 }}>
        <ShieldCheck size={14} /> Project updates, files, dividends and membership level are managed in Supabase Table Editor.
      </p>
    </div>
  );
}
