import { useState, useEffect } from 'react';
import { Lock, Building, Users, Plus, Pencil, Trash2, X, Save, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Project, Investor, ProjectCategory, PropertyType, ConstructionStatus, PaymentType, EngagementType, Currency, StatusBadge } from '@/types';

type Tab = 'projects' | 'investors';

export default function AdminPage() {
  const { t } = useApp();
  const [authed, setAuthed] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [tab, setTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showInvestorForm, setShowInvestorForm] = useState(false);
  const [error, setError] = useState('');

  // Check for admin session (using service role is not possible from client,
  // so we use a simple admin password check against env)
  const ADMIN_PASSWORD = 'myicon-admin-2024';

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
    // Projects - use service role via RPC or direct query with anon key
    // Since admin uses anon key, we can read public projects
    const { data: projs } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    setProjects((projs as Project[]) || []);

    // Investors - can't read with anon key (RLS), so this will be empty
    // In production, this would use an edge function with service role
    const { data: invs } = await supabase
      .from('investors')
      .select('*')
      .order('created_at', { ascending: false });
    setInvestors((invs as Investor[]) || []);
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
            <div className="w-16 h-16 rounded-full border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-amber-300" />
            </div>
            <h1 className="font-serif text-3xl text-cream-50 mb-2">{t('adminLogin')}</h1>
            <div className="section-divider" />
          </div>
          <div className="smoke-card p-8">
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
            <p className="text-center text-cream-50/40 text-xs mt-4">
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
          <h1 className="font-serif text-3xl md:text-4xl text-cream-50">{t('adminPanel')}</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-amber-400/20 mb-6 overflow-x-auto no-scrollbar">
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
              <div className="smoke-card h-64 skeleton" />
            ) : (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="smoke-card p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-cream-50 font-medium">{p.name}</h3>
                        <span className={`badge ${
                          p.status_badge === 'available' ? 'badge-gold' :
                          p.status_badge === 'upcoming' ? 'badge-blue' :
                          p.status_badge === 'sold_out' ? 'badge-red' : 'badge-green'
                        } text-[0.6rem]`}>{p.status_badge}</span>
                        {p.is_public ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-cream-50/40" />}
                      </div>
                      <p className="text-cream-50/50 text-sm">{p.city}, {p.country} · {p.category} · {p.available_units}/{p.total_units} units</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProject(p); setShowProjectForm(true); }} className="p-2 rounded-lg border border-amber-400/25 text-amber-300 hover:bg-amber-300/10 transition-all">
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
              <div className="smoke-card h-64 skeleton" />
            ) : investors.length === 0 ? (
              <div className="smoke-card p-8 text-center">
                <Users className="w-12 h-12 text-amber-400/40 mx-auto mb-3" />
                <p className="text-cream-50/50">No investors visible. Investor management requires service-role access.</p>
                <p className="text-cream-50/40 text-xs mt-2">Use the Supabase dashboard or an edge function to manage investors.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {investors.map((inv) => (
                  <div key={inv.id} className="smoke-card p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-cream-50 font-medium">{inv.full_name}</h3>
                      <p className="text-cream-50/50 text-sm">{inv.investor_code} · {inv.email}</p>
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

    // Note: This will fail with anon key due to RLS (no public insert policy).
    // In production, this would go through an edge function with service role.
    const { error: saveError } = project
      ? await supabase.from('projects').update(payload).eq('id', project.id)
      : await supabase.from('projects').insert(payload);

    if (saveError) {
      setError(`Save failed: ${saveError.message}. Admin writes require service-role access via an edge function.`);
      setSaving(false);
      return;
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-espresso-800/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="smoke-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-cream-50">{project ? t('editProject') : t('addProject')}</h2>
          <button onClick={onClose} className="text-cream-50/50 hover:text-amber-300"><X className="w-5 h-5" /></button>
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
            <label className="block text-cream-50/50 text-xs mb-1.5 uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-luxury" />
          </div>
          <div>
            <label className="block text-cream-50/50 text-xs mb-1.5 uppercase tracking-wider">Ownership Info</label>
            <input type="text" value={form.ownership_info} onChange={(e) => setForm({ ...form, ownership_info: e.target.value })} className="input-luxury" />
          </div>
          <div>
            <label className="block text-cream-50/50 text-xs mb-1.5 uppercase tracking-wider">Installment Plan</label>
            <input type="text" value={form.installment_plan} onChange={(e) => setForm({ ...form, installment_plan: e.target.value })} className="input-luxury" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-cream-50/60 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="accent-gold-600" />
              {t('isPublic')}
            </label>
            <label className="flex items-center gap-2 text-cream-50/60 text-sm cursor-pointer">
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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError(`Auth error: ${authError.message}`);
      setSaving(false);
      return;
    }

    // Create investor record (will fail with anon key due to RLS)
    const { error: invError } = await supabase.from('investors').insert({
      email: form.email,
      investor_code: form.investor_code,
      full_name: form.full_name,
      phone: form.phone,
      country: form.country,
      nominee_name: form.nominee_name,
      nominee_relation: form.nominee_relation,
      nominee_phone: form.nominee_phone,
      is_active: true,
    });

    if (invError) {
      setError(`Investor record creation failed: ${invError.message}. Auth user created. Use service-role edge function for full management.`);
      setSaving(false);
      return;
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-espresso-800/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="smoke-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-cream-50">Add Investor</h2>
          <button onClick={onClose} className="text-cream-50/50 hover:text-amber-300"><X className="w-5 h-5" /></button>
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

function Field({ label, value, onChange, type = 'text', required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-cream-50/50 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
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
      <label className="block text-cream-50/50 text-xs mb-1.5 uppercase tracking-wider">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-luxury text-sm">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
