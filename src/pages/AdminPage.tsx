import { useState, useEffect } from 'react';
import { Lock, Building, Users, Plus, Pencil, Trash2, X, Save, Eye, EyeOff, AlertCircle, UserPlus, Link2, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Project, Investor, Investment, ProjectCategory, PropertyType, ConstructionStatus, PaymentType, EngagementType, Currency, StatusBadge } from '@/types';

type Tab = 'projects' | 'investors' | 'investments';

const ADMIN_PASSWORD = 'myicon-admin-2024';
const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`;

async function adminFetch(resource: string, options: RequestInit = {}) {
  const body = options.body ? JSON.parse(options.body as string) : {};
  const res = await fetch(`${EDGE_URL}/${resource}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      ...options.headers,
    },
    body: JSON.stringify({ ...body, _admin_password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

async function adminGet(resource: string) {
  const res = await fetch(`${EDGE_URL}/${resource}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'X-Admin-Password': ADMIN_PASSWORD,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

interface AdminInvestment extends Investment {
  investors?: { investor_code: string; full_name: string; email: string };
}

export default function AdminPage() {
  const { t } = useApp();
  const [authed, setAuthed] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [tab, setTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [investments, setInvestments] = useState<AdminInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showInvestorForm, setShowInvestorForm] = useState(false);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem('my-icon-admin', 'true');
    } else {
      setError('Invalid admin password');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('my-icon-admin') === 'true') {
      setAuthed(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, invRes, invsRes] = await Promise.all([
        adminGet('projects'),
        adminGet('investors'),
        adminGet('investments'),
      ]);
      setProjects(projRes.projects || []);
      setInvestors(invRes.investors || []);
      setInvestments(invsRes.investments || []);
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  if (!authed) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center animate-fade-in">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full border border-yellow-500/25 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-yellow-500" />
            </div>
            <h1 className="font-serif text-3xl text-white mb-2">{t('adminLogin')}</h1>
            <div className="section-divider" />
          </div>
          <div className="neon-card p-8">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Admin Password"
                required
                className="input-luxury"
                autoFocus
              />
              <button type="submit" className="btn-gold w-full">{t('signIn')}</button>
            </form>
            <p className="text-center text-white/35 text-xs mt-4">
              Authorized personnel only. All actions are logged.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-white">{t('adminPanel')}</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400/50 hover:text-red-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-yellow-500/15 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setTab('projects')}
            className={`tab-btn flex items-center gap-2 ${tab === 'projects' ? 'active' : ''}`}
          >
            <Building className="w-4 h-4" /> {t('manageProjects')}
          </button>
          <button
            onClick={() => setTab('investors')}
            className={`tab-btn flex items-center gap-2 ${tab === 'investors' ? 'active' : ''}`}
          >
            <Users className="w-4 h-4" /> {t('manageInvestors')}
          </button>
          <button
            onClick={() => setTab('investments')}
            className={`tab-btn flex items-center gap-2 ${tab === 'investments' ? 'active' : ''}`}
          >
            <Link2 className="w-4 h-4" /> Assign Investments
          </button>
        </div>

        {tab === 'projects' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => { setEditingProject(null); setShowProjectForm(true); }}
                className="btn-gold flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> {t('addProject')}
              </button>
            </div>

            {loading ? (
              <div className="neon-card h-64 skeleton" />
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="neon-card p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-medium">{p.name}</h3>
                        <span className={`badge ${
                          p.status_badge === 'available' ? 'badge-gold' :
                          p.status_badge === 'upcoming' ? 'badge-blue' :
                          p.status_badge === 'sold_out' ? 'badge-red' : 'badge-green'
                        } text-[0.6rem]`}>{p.status_badge}</span>
                        {p.is_public ? <Eye className="w-3.5 h-3.5 text-yellow-500" /> : <EyeOff className="w-3.5 h-3.5 text-white/35" />}
                      </div>
                      <p className="text-white/45 text-sm">{p.city}, {p.country} · {p.category} · {p.available_units}/{p.total_units} units</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProject(p); setShowProjectForm(true); }} className="p-2 rounded-lg border border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/10 transition-all">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showProjectForm && (
              <ProjectForm
                project={editingProject}
                onClose={() => { setShowProjectForm(false); setEditingProject(null); }}
                onSaved={() => { setShowProjectForm(false); setEditingProject(null); loadData(); }}
              />
            )}
          </div>
        )}

        {tab === 'investors' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowInvestorForm(true)}
                className="btn-gold flex items-center gap-2 text-sm"
              >
                <UserPlus className="w-4 h-4" /> Add Investor
              </button>
            </div>

            {loading ? (
              <div className="neon-card h-64 skeleton" />
            ) : investors.length === 0 ? (
              <div className="neon-card p-8 text-center">
                <Users className="w-12 h-12 text-yellow-500/40 mx-auto mb-3" />
                <p className="text-white/45">No investors yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {investors.map((inv) => (
                  <div key={inv.id} className="neon-card p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{inv.full_name}</h3>
                      <p className="text-white/45 text-sm">{inv.investor_code} · {inv.email}</p>
                      {'user_id' in inv && (inv as Record<string, unknown>).user_id ? (
                        <span className="badge badge-green text-[0.6rem] mt-1 inline-block">Linked to auth</span>
                      ) : (
                        <span className="badge badge-gold text-[0.6rem] mt-1 inline-block">No auth link</span>
                      )}
                    </div>
                    <span className={`badge ${inv.is_active ? 'badge-green' : 'badge-red'}`}>
                      {inv.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {showInvestorForm && (
              <InvestorForm onClose={() => setShowInvestorForm(false)} onSaved={() => { setShowInvestorForm(false); loadData(); }} />
            )}
          </div>
        )}

        {tab === 'investments' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowInvestmentForm(true)}
                className="btn-gold flex items-center gap-2 text-sm"
              >
                <Link2 className="w-4 h-4" /> Assign Investment
              </button>
            </div>

            {loading ? (
              <div className="neon-card h-64 skeleton" />
            ) : investments.length === 0 ? (
              <div className="neon-card p-8 text-center">
                <Link2 className="w-12 h-12 text-yellow-500/40 mx-auto mb-3" />
                <p className="text-white/45">No investments assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {investments.map((inv) => (
                  <div key={inv.id} className="neon-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium">{inv.project_name}</h3>
                        <p className="text-white/45 text-sm">
                          {inv.investors?.full_name} ({inv.investors?.investor_code}) · {inv.investors?.email}
                        </p>
                      </div>
                      <span className={`badge ${inv.status === 'active' ? 'badge-green' : 'badge-gold'}`}>{inv.status}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-2">
                      <div>
                        <p className="text-white/35 text-xs">Investment</p>
                        <p className="text-white/70">{inv.currency} {inv.investment_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/35 text-xs">Paid</p>
                        <p className="text-white/70">{inv.currency} {inv.paid_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/35 text-xs">Due</p>
                        <p className="text-white/70">{inv.currency} {inv.due_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/35 text-xs">Next Installment</p>
                        <p className="text-white/70">{inv.next_installment_date || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showInvestmentForm && (
              <InvestmentForm
                investors={investors}
                projects={projects}
                onClose={() => setShowInvestmentForm(false)}
                onSaved={() => { setShowInvestmentForm(false); loadData(); }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectForm({ project, onClose, onSaved }: { project: Project | null; onClose: () => void; onSaved: () => void }) {
  const { t } = useApp();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: project?.name || '',
    slug: project?.slug || '',
    category: project?.category || 'upcoming' as ProjectCategory,
    country: project?.country || '',
    city: project?.city || '',
    property_type: project?.property_type || 'building' as PropertyType,
    construction_status: project?.construction_status || 'under_construction' as ConstructionStatus,
    starting_price: project?.starting_price || 0,
    price_currency: project?.price_currency || 'USD' as Currency,
    payment_type: project?.payment_type || 'cash' as PaymentType,
    engagement_type: project?.engagement_type || 'ownership' as EngagementType,
    available_units: project?.available_units || 1,
    total_units: project?.total_units || 1,
    construction_progress: project?.construction_progress || 0,
    expected_completion: project?.expected_completion || '',
    description: project?.description || '',
    is_public: project?.is_public ?? true,
    status_badge: project?.status_badge || 'available' as StatusBadge,
    featured: project?.featured || false,
    ownership_info: project?.ownership_info || '',
    installment_plan: project?.installment_plan || '',
    land_size: project?.land_size || '',
    unit_size: project?.unit_size || '',
    map_lat: project?.map_lat || '',
    map_lng: project?.map_lng || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      expected_completion: form.expected_completion || null,
      map_lat: form.map_lat ? parseFloat(String(form.map_lat)) : null,
      map_lng: form.map_lng ? parseFloat(String(form.map_lng)) : null,
    };
    if (project) payload.id = project.id;

    try {
      await adminFetch('projects', { method: 'POST', body: JSON.stringify(payload) });
      onSaved();
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="neon-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-white">{project ? t('editProject') : t('addProject')}</h2>
          <button onClick={onClose} className="text-white/45 hover:text-yellow-500"><X className="w-5 h-5" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('projectName')} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
            <SelectField label={t('category')} value={form.category} onChange={(v) => setForm({ ...form, category: v as ProjectCategory })}
              options={[{value:'makkah',label:'Makkah'},{value:'madinah',label:'Madinah'},{value:'oman',label:'Oman'},{value:'bangladesh',label:'Bangladesh'},{value:'upcoming',label:'Upcoming'},{value:'completed',label:'Completed'}]} />
            <SelectField label={t('statusBadge')} value={form.status_badge} onChange={(v) => setForm({ ...form, status_badge: v as StatusBadge })}
              options={[{value:'available',label:'Available'},{value:'upcoming',label:'Upcoming'},{value:'sold_out',label:'Sold Out'},{value:'completed',label:'Completed'}]} />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
            <SelectField label={t('propertyType')} value={form.property_type} onChange={(v) => setForm({ ...form, property_type: v as PropertyType })}
              options={[{value:'land',label:'Land'},{value:'flat',label:'Flat'},{value:'hotel',label:'Hotel'},{value:'building',label:'Building'}]} />
            <SelectField label="Construction" value={form.construction_status} onChange={(v) => setForm({ ...form, construction_status: v as ConstructionStatus })}
              options={[{value:'ready',label:'Ready'},{value:'under_construction',label:'Under Construction'},{value:'upcoming',label:'Upcoming'}]} />
            <Field label="Starting Price" type="number" value={String(form.starting_price)} onChange={(v) => setForm({ ...form, starting_price: Number(v) })} />
            <SelectField label="Currency" value={form.price_currency} onChange={(v) => setForm({ ...form, price_currency: v as Currency })}
              options={[{value:'SAR',label:'SAR'},{value:'OMR',label:'OMR'},{value:'BDT',label:'BDT'},{value:'USD',label:'USD'}]} />
            <SelectField label="Payment" value={form.payment_type} onChange={(v) => setForm({ ...form, payment_type: v as PaymentType })}
              options={[{value:'cash',label:'Cash'},{value:'installment',label:'Installment'}]} />
            <SelectField label="Engagement" value={form.engagement_type} onChange={(v) => setForm({ ...form, engagement_type: v as EngagementType })}
              options={[{value:'ownership',label:'Ownership'},{value:'investment',label:'Investment'}]} />
            <Field label="Available Units" type="number" value={String(form.available_units)} onChange={(v) => setForm({ ...form, available_units: Number(v) })} />
            <Field label="Total Units" type="number" value={String(form.total_units)} onChange={(v) => setForm({ ...form, total_units: Number(v) })} />
            <Field label="Construction %" type="number" value={String(form.construction_progress)} onChange={(v) => setForm({ ...form, construction_progress: Number(v) })} />
            <Field label="Expected Completion" type="date" value={form.expected_completion} onChange={(v) => setForm({ ...form, expected_completion: v })} />
            <Field label="Land Size" value={form.land_size} onChange={(v) => setForm({ ...form, land_size: v })} />
            <Field label="Unit Size" value={form.unit_size} onChange={(v) => setForm({ ...form, unit_size: v })} />
            <Field label="Map Lat" value={String(form.map_lat)} onChange={(v) => setForm({ ...form, map_lat: v })} />
            <Field label="Map Lng" value={String(form.map_lng)} onChange={(v) => setForm({ ...form, map_lng: v })} />
          </div>

          <div>
            <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-luxury" />
          </div>
          <div>
            <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">Ownership Info</label>
            <input type="text" value={form.ownership_info} onChange={(e) => setForm({ ...form, ownership_info: e.target.value })} className="input-luxury" />
          </div>
          <div>
            <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">Installment Plan</label>
            <input type="text" value={form.installment_plan} onChange={(e) => setForm({ ...form, installment_plan: e.target.value })} className="input-luxury" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-white/55 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="accent-gold-600" />
              {t('isPublic')}
            </label>
            <label className="flex items-center gap-2 text-white/55 text-sm cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold-600" />
              Featured
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? t('loading') : t('save')}
            </button>
            <button type="button" onClick={onClose} className="btn-outline-gold">{t('cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvestorForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const { t } = useApp();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    investor_code: '',
    full_name: '',
    phone: '',
    country: '',
    nominee_name: '',
    nominee_relation: '',
    nominee_phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await adminFetch('investors', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          investor_code: form.investor_code,
          full_name: form.full_name,
          phone: form.phone,
          country: form.country,
          nominee_name: form.nominee_name,
          nominee_relation: form.nominee_relation,
          nominee_phone: form.nominee_phone,
        }),
      });
      onSaved();
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="neon-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-white">Add Investor</h2>
          <button onClick={onClose} className="text-white/45 hover:text-yellow-500"><X className="w-5 h-5" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
            <Field label="Investor Code" value={form.investor_code} onChange={(v) => setForm({ ...form, investor_code: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Field label="Nominee Name" value={form.nominee_name} onChange={(v) => setForm({ ...form, nominee_name: v })} />
            <Field label="Nominee Relation" value={form.nominee_relation} onChange={(v) => setForm({ ...form, nominee_relation: v })} />
            <Field label="Nominee Phone" value={form.nominee_phone} onChange={(v) => setForm({ ...form, nominee_phone: v })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? t('loading') : 'Create Investor'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline-gold">{t('cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvestmentForm({ investors, projects, onClose, onSaved }: {
  investors: Investor[];
  projects: Project[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useApp();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    investor_id: '',
    project_id: '',
    project_name: '',
    investment_amount: 0,
    paid_amount: 0,
    due_amount: 0,
    currency: 'USD' as Currency,
    next_installment_date: '',
    next_installment_amount: 0,
    profit_distributed: 0,
    agreement_url: '',
    status: 'active',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!form.investor_id) {
      setError('Please select an investor.');
      setSaving(false);
      return;
    }

    // If a project is selected, auto-fill project_name
    const selectedProject = projects.find((p) => p.id === form.project_id);
    const projectName = selectedProject ? selectedProject.name : form.project_name;

    if (!projectName) {
      setError('Please select a project or enter a project name.');
      setSaving(false);
      return;
    }

    try {
      await adminFetch('investments', {
        method: 'POST',
        body: JSON.stringify({
          investor_id: form.investor_id,
          project_id: form.project_id || null,
          project_name: projectName,
          investment_amount: Number(form.investment_amount),
          paid_amount: Number(form.paid_amount),
          due_amount: Number(form.due_amount),
          currency: form.currency,
          next_installment_date: form.next_installment_date || null,
          next_installment_amount: Number(form.next_installment_amount) || null,
          profit_distributed: Number(form.profit_distributed) || 0,
          agreement_url: form.agreement_url || null,
          status: form.status,
        }),
      });
      onSaved();
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="neon-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-yellow-500" /> Assign Investment
          </h2>
          <button onClick={onClose} className="text-white/45 hover:text-yellow-500"><X className="w-5 h-5" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Investor selector */}
          <div>
            <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">Select Investor</label>
            <select
              value={form.investor_id}
              onChange={(e) => setForm({ ...form, investor_id: e.target.value })}
              required
              className="input-luxury text-sm"
            >
              <option value="">— Choose an investor —</option>
              {investors.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.full_name} ({inv.investor_code}) — {inv.email}
                </option>
              ))}
            </select>
          </div>

          {/* Project selector */}
          <div>
            <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">Select Project (optional)</label>
            <select
              value={form.project_id}
              onChange={(e) => setForm({ ...form, project_id: e.target.value })}
              className="input-luxury text-sm"
            >
              <option value="">— Custom project name —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.city}, {p.country})</option>
              ))}
            </select>
          </div>

          {/* Project name (shown when no project selected) */}
          {!form.project_id && (
            <Field label="Project Name" value={form.project_name} onChange={(v) => setForm({ ...form, project_name: v })} required />
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Investment Amount" type="number" value={String(form.investment_amount)} onChange={(v) => setForm({ ...form, investment_amount: Number(v) })} />
            <SelectField label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v as Currency })}
              options={[{value:'SAR',label:'SAR'},{value:'OMR',label:'OMR'},{value:'BDT',label:'BDT'},{value:'USD',label:'USD'}]} />
            <Field label="Paid Amount" type="number" value={String(form.paid_amount)} onChange={(v) => setForm({ ...form, paid_amount: Number(v) })} />
            <Field label="Due Amount" type="number" value={String(form.due_amount)} onChange={(v) => setForm({ ...form, due_amount: Number(v) })} />
            <Field label="Next Installment Date" type="date" value={form.next_installment_date} onChange={(v) => setForm({ ...form, next_installment_date: v })} />
            <Field label="Next Installment Amount" type="number" value={String(form.next_installment_amount)} onChange={(v) => setForm({ ...form, next_installment_amount: Number(v) })} />
            <Field label="Profit Distributed" type="number" value={String(form.profit_distributed)} onChange={(v) => setForm({ ...form, profit_distributed: Number(v) })} />
            <SelectField label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })}
              options={[{value:'active',label:'Active'},{value:'completed',label:'Completed'},{value:'pending',label:'Pending'}]} />
          </div>

          <Field label="Agreement URL" value={form.agreement_url} onChange={(v) => setForm({ ...form, agreement_url: v })} />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? t('loading') : 'Assign Investment'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline-gold">{t('cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="input-luxury text-sm" />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-white/45 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-luxury text-sm">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
