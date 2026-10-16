import { useEffect, useState, type FormEvent } from 'react';
import { ShieldCheck, Send, Briefcase, UserPlus, Megaphone } from 'lucide-react';
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


  const [bcProject, setBcProject] = useState('');
  const [bcTitle, setBcTitle] = useState('');
  const [bcBody, setBcBody] = useState('');

  const [invInvestor, setInvInvestor] = useState('');
  const [invProject, setInvProject] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invCurrency, setInvCurrency] = useState('USD');
  const [invReturn, setInvReturn] = useState('');

  const emptyInvestor = {
    email: '', investor_code: '', full_name: '', first_name: '', last_name: '', phone: '', membership_level: '',
    father_name: '', permanent_address: '', nid_pass: '', photo_url: '',
    nominee_name: '', nominee_father_name: '', nominee_pass: '',
    nominee_address: '', nominee_phone: '', nominee_relation: '',
  };
  const [newInv, setNewInv] = useState<typeof emptyInvestor>(emptyInvestor);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  const [updProject, setUpdProject] = useState('');
  const [updTitle, setUpdTitle] = useState('');
  const [updBody, setUpdBody] = useState('');
  const [updImage, setUpdImage] = useState('');

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
    if (result.status === 'ok') setAuthed(true);
    else if (result.status === 'not_admin') setLoginErr('This account does not have admin access.');
    else setLoginErr(result.message);
  };

  const invField = (key: keyof typeof emptyInvestor, label: string, required = false) => (
    <div className="grid gap-1" key={key}>
      <label className="text-sm opacity-80">{label}{required ? ' *' : ''}</label>
      <input
        className="portal-input"
        value={newInv[key]}
        onChange={(e) => setNewInv({ ...newInv, [key]: e.target.value })}
        required={required}
      />
    </div>
  );

  const submitNewInvestor = (e: FormEvent) => {
    e.preventDefault();
    setCreatedPassword(null);
    run(async () => {
      const res = await adminPost<{ password: string }>('investors', newInv);
      setCreatedPassword(res.password);
      setNewInv(emptyInvestor);
      const list = await adminGet<{ investors: InvestorRow[] }>('investors');
      setInvestors(list.investors ?? []);
    }, 'ইনভেস্টর তৈরি হয়েছে। নিচের পাসওয়ার্ডটি কপি করে ইনভেস্টরকে দিন।');
  };

  const submitUpdate = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      await adminPost('project-updates', {
        investor_project_id: updProject,
        title: updTitle,
        body: updBody,
        image_url: updImage || null,
      });
      setUpdTitle(''); setUpdBody(''); setUpdImage('');
    }, 'আপডেট পোস্ট হয়েছে। প্রজেক্টের সব ইনভেস্টর এটা দেখতে পাবে।');
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
      <div className="portal-theme" style={{ minHeight: "100vh", padding: "96px 16px 64px", boxSizing: "border-box" }}><div style={{ maxWidth: 380, margin: "0 auto" }}>
        <form className="glass portal-section p-8" onSubmit={login}>
          <h2 style={{ marginTop: 0 }}>Admin — Investor Portal</h2>
          <input type="email" className="portal-input" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="portal-input" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          {loginErr && <p className="text-sm" style={{ color: '#c0392b' }}>{loginErr}</p>}
          <button type="submit" className="portal-btn w-full mt-3">Enter</button>
        </form>
      </div>
      </div>
    );
  }

  const label = (p: ProjectRow) => p.name_en;

  return (
    <div className="portal-theme" style={{ minHeight: "100vh", padding: "96px 16px 64px", boxSizing: "border-box" }}><div style={{ maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontSize: '1.6rem' }}>Investor Portal — Admin</h1>
      {msg && (
        <p className="text-sm mb-4" style={{ color: msg.ok ? '#15803d' : '#c0392b' }}>{msg.text}</p>
      )}

      <section className="glass portal-section mb-6">
        <h3 className="flex items-center gap-2"><UserPlus size={16} /> নতুন ইনভেস্টর এন্ট্রি (শুধু অ্যাডমিনের জন্য)</h3>
        <form onSubmit={submitNewInvestor} className="grid gap-3 mt-3">
          <p className="text-sm opacity-80 mt-2">ইনভেস্টরের তথ্য (পাসপোর্ট অনুযায়ী)</p>
          <div className="grid grid-cols-2 gap-3">
            {invField('full_name', 'নাম (পুরো নাম)', true)}
            {invField('first_name', 'ফার্স্ট নেম')}
            {invField('last_name', 'লাস্ট নেম')}
            {invField('father_name', 'পিতার নাম')}
            {invField('nid_pass', 'পাসপোর্ট নম্বর')}
            {invField('permanent_address', 'ঠিকানা')}
            {invField('investor_code', 'ইনভেস্টর কোড / সিরিয়াল (যেমন S33-01)', true)}
            {invField('email', 'ইমেইল (লগইনের জন্য)', true)}
            {invField('phone', 'মোবাইল')}
            {invField('membership_level', 'সদস্যপদ (যেমন VIP Platinum)')}
            {invField('photo_url', 'পাসপোর্ট ছবির লিংক')}
          </div>
          <p className="text-sm opacity-80 mt-2">নমিনির তথ্য</p>
          <div className="grid grid-cols-2 gap-3">
            {invField('nominee_name', 'নমিনির নাম')}
            {invField('nominee_relation', 'নমিনির সম্পর্ক')}
            {invField('nominee_father_name', 'নমিনির পিতার নাম')}
            {invField('nominee_pass', 'নমিনির পাসপোর্ট নম্বর')}
            {invField('nominee_address', 'নমিনির ঠিকানা')}
            {invField('nominee_phone', 'নমিনির মোবাইল')}
          </div>
          <button type="submit" className="portal-btn">ইনভেস্টর সেভ করুন ও পাসওয়ার্ড বানান</button>
        </form>
        {createdPassword && (
          <div className="mt-4 p-4 rounded border border-yellow-600">
            <p className="text-sm">এই পাসওয়ার্ডটি আর দেখানো হবে না। কপি করে ইনভেস্টরকে দিন:</p>
            <p className="text-lg font-mono mt-2 select-all">{createdPassword}</p>
          </div>
        )}
      </section>

      <section className="glass portal-section mb-6">
        <h3 className="flex items-center gap-2"><Megaphone size={16} /> প্রজেক্টে নতুন আপডেট পোস্ট</h3>
        <form onSubmit={submitUpdate} className="grid gap-3 mt-3">
          <label className="text-sm opacity-80">১. কোন প্রজেক্টের আপডেট</label>
          <select className="portal-input" value={updProject} onChange={(e) => setUpdProject(e.target.value)} required>
            <option value="">প্রজেক্ট বেছে নিন</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{label(p)}</option>)}
          </select>
          <label className="text-sm opacity-80">২. আপডেটের শিরোনাম</label>
          <input className="portal-input" placeholder="যেমন: নির্মাণ কাজ শুরু হয়েছে" value={updTitle} onChange={(e) => setUpdTitle(e.target.value)} required />
          <label className="text-sm opacity-80">৩. বিস্তারিত</label>
          <textarea className="portal-input" rows={4} placeholder="আপডেটের বিবরণ লিখুন" value={updBody} onChange={(e) => setUpdBody(e.target.value)} />
          <label className="text-sm opacity-80">৪. ছবির লিংক (ঐচ্ছিক)</label>
          <input className="portal-input" placeholder="https://..." value={updImage} onChange={(e) => setUpdImage(e.target.value)} />
          <button type="submit" className="portal-btn">আপডেট পোস্ট করুন</button>
        </form>
      </section>

      <section className="glass portal-section mb-6">
        <h3 className="flex items-center gap-2"><Briefcase size={16} /> Add investment to a portal project</h3>
        <form onSubmit={submitInvestment} className="grid gap-3 mt-3">
          <label className="text-sm opacity-80">১. ইনভেস্টর বেছে নিন</label>
          <select className="portal-input" value={invInvestor} onChange={(e) => setInvInvestor(e.target.value)} required>
            <option value="">Select investor</option>
            {investors.map((i) => <option key={i.id} value={i.id}>{i.investor_code} — {i.full_name}</option>)}
          </select>
          <label className="text-sm opacity-80">২. কোন প্রজেক্টে বিনিয়োগ</label>
          <select className="portal-input" value={invProject} onChange={(e) => setInvProject(e.target.value)} required>
            <option value="">Select project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{label(p)}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm opacity-80">৩. টাকার পরিমাণ</label>
            <input className="portal-input" type="number" min="1" step="any" placeholder="যেমন 3300000" value={invAmount} onChange={(e) => setInvAmount(e.target.value)} required />
            <label className="text-sm opacity-80">৪. কারেন্সি</label>
            <select className="portal-input" value={invCurrency} onChange={(e) => setInvCurrency(e.target.value)}>
              <option>USD</option><option>SAR</option><option>OMR</option><option>BDT</option>
            </select>
            <label className="text-sm opacity-80">৫. প্রত্যাশিত রিটার্ন % (না জানলে ফাঁকা রাখুন)</label>
            <input className="portal-input" type="number" step="any" placeholder="যেমন 12" value={invReturn} onChange={(e) => setInvReturn(e.target.value)} />
          </div>
          <button type="submit" className="portal-btn">Add investment</button>
        </form>
      </section>

      <section className="glass portal-section">
        <h3 className="flex items-center gap-2"><Send size={16} /> Broadcast message to investors</h3>
        <form onSubmit={submitBroadcast} className="grid gap-3 mt-3">
          <label className="text-sm opacity-80">কাদের কাছে পাঠাবেন</label>
          <select className="portal-input" value={bcProject} onChange={(e) => setBcProject(e.target.value)}>
            <option value="">All investors (all projects)</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{label(p)} — holders only</option>)}
          </select>
          <label className="text-sm opacity-80">শিরোনাম</label>
          <input className="portal-input" placeholder="যেমন: প্রজেক্ট আপডেট" value={bcTitle} onChange={(e) => setBcTitle(e.target.value)} required />
          <label className="text-sm opacity-80">বার্তা</label>
          <textarea className="portal-input" rows={4} placeholder="এখানে বার্তা লিখুন" value={bcBody} onChange={(e) => setBcBody(e.target.value)} required />
          <button type="submit" className="portal-btn">Send</button>
        </form>
      </section>

      <p className="text-xs mt-6 flex items-center gap-2" style={{ opacity: 0.6 }}>
        <ShieldCheck size={14} /> Project updates, files, dividends and membership level are managed in Supabase Table Editor.
      </p>
    </div>
    </div>
  );
}
