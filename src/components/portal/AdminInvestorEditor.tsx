import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Investor } from '@/types';

// Admin-only editing of investor records. Shown only when the signed-in user is in admin_users.

type Field = { key: string; label: string; sensitive?: boolean; wide?: boolean };

const FIELDS: Field[] = [
  { key: 'full_name', label: 'পূর্ণ নাম' },
  { key: 'first_name', label: 'প্রথম নাম' },
  { key: 'last_name', label: 'শেষ নাম' },
  { key: 'email', label: 'ইমেইল (লগইন)' },
  { key: 'phone', label: 'মোবাইল' },
  { key: 'country', label: 'দেশ' },
  { key: 'investor_code', label: 'ইনভেস্টর আইডি' },
  { key: 'membership_level', label: 'মেম্বারশিপ লেভেল' },
  { key: 'father_name', label: 'বাবার নাম' },
  { key: 'mother_name', label: 'মায়ের নাম' },
  { key: 'permanent_address', label: 'স্থায়ী ঠিকানা', wide: true },
  { key: 'nid_pass', label: 'পাসপোর্ট / NID', sensitive: true },
  { key: 'nominee_name', label: 'নমিনির নাম' },
  { key: 'nominee_relation', label: 'নমিনির সম্পর্ক' },
  { key: 'nominee_phone', label: 'নমিনির মোবাইল' },
  { key: 'nominee_father_name', label: 'নমিনির বাবার নাম' },
  { key: 'nominee_mother_name', label: 'নমিনির মায়ের নাম' },
  { key: 'nominee_pass', label: 'নমিনির পাসপোর্ট / NID', sensitive: true },
  { key: 'nominee_address', label: 'নমিনির ঠিকানা', wide: true },
  { key: 'photo_url', label: 'ছবির লিংক', wide: true },
];

// Shows only the last 4 characters of a sensitive value.
function maskValue(v: unknown): string {
  const s = v == null ? '' : String(v);
  if (!s) return '';
  return s.length <= 4 ? '••••' : '•••• ' + s.slice(-4);
}

function readField(inv: Investor, key: string): string {
  const v = (inv as unknown as Record<string, unknown>)[key];
  return v == null ? '' : String(v);
}

export function InvestorEditModal({
  investor,
  onClose,
  onSaved,
}: {
  investor: Investor;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [active, setActive] = useState(Boolean((investor as unknown as Record<string, unknown>).is_active));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = f.sensitive ? '' : readField(investor, f.key);
    setValues(init);
    setActive(Boolean((investor as unknown as Record<string, unknown>).is_active));
  }, [investor]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setOk(false);

    const payload: Record<string, unknown> = { is_active: active, updated_at: new Date().toISOString() };
    for (const f of FIELDS) {
      const raw = (values[f.key] ?? '').trim();
      // Sensitive fields: an empty box means "keep the current value".
      if (f.sensitive && raw === '') continue;
      payload[f.key] = raw === '' ? null : raw;
    }

    const { error: err } = await supabase.from('investors').update(payload).eq('id', investor.id);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setOk(true);
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <form
        className="glass portal-section w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        onSubmit={save}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ margin: 0 }}>ইনভেস্টর তথ্য এডিট</h3>
          <button type="button" onClick={onClose} className="portal-btn-ghost" aria-label="বন্ধ করুন">
            <X size={16} />
          </button>
        </div>

        <div className="portal-details">
          {FIELDS.map((f) => (
            <label key={f.key} className="portal-detail" style={f.wide ? { gridColumn: '1 / -1' } : undefined}>
              <span className="portal-small">{f.label}</span>
              <input
                className="portal-input"
                value={values[f.key] ?? ''}
                placeholder={f.sensitive ? (maskValue(readField(investor, f.key)) || 'এখনো নেই') : ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
              />
              {f.sensitive && (
                <span className="portal-small">খালি রাখলে বর্তমান মান থাকবে।</span>
              )}
            </label>
          ))}
        </div>

        <label className="portal-row" style={{ gap: 8, marginTop: 14 }}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <span>অ্যাকাউন্ট সক্রিয়</span>
        </label>

        {error && <p className="portal-error" style={{ marginTop: 12 }}>{error}</p>}
        {ok && <p className="portal-ok" style={{ marginTop: 12 }}>সেভ হয়েছে।</p>}

        <div className="portal-row" style={{ gap: 8, marginTop: 16 }}>
          <button type="submit" className="portal-btn" disabled={saving}>
            {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
          </button>
          <button type="button" className="portal-btn-ghost" onClick={onClose}>বন্ধ করুন</button>
        </div>
      </form>
    </div>
  );
}

// Admin-only list of every investor, each with a pencil to edit.
export function AdminInvestorsPanel() {
  const [rows, setRows] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Investor | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('investors')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    setRows((data as Investor[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="glass portal-section" style={{ marginTop: 22 }}>
      <h3>সব ইনভেস্টর (অ্যাডমিন)</h3>
      {error && <p className="portal-error">{error}</p>}
      {loading && <p className="portal-small">লোড হচ্ছে...</p>}
      {!loading && rows.length === 0 && <p className="portal-small">কোনো ইনভেস্টর নেই।</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r) => (
          <div key={r.id} className="portal-row" style={{ justifyContent: 'space-between', gap: 8 }}>
            <div>
              <div>{readField(r, 'full_name') || '(নাম নেই)'}</div>
              <div className="portal-small">
                {readField(r, 'investor_code')} · {readField(r, 'email')} · {readField(r, 'phone')}
              </div>
            </div>
            <button type="button" className="portal-btn-ghost" onClick={() => setEditing(r)} aria-label="এডিট">
              <Pencil size={16} />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <InvestorEditModal
          investor={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { load(); }}
        />
      )}
    </section>
  );
}
