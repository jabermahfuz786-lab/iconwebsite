import { useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import { saveSiteValue, uploadSiteMedia, useSiteContent } from '@/lib/siteContent';

// Admin-only website editor. Each slot is one picture on the public site.
// Uploading replaces the picture immediately on the live site.

const HERO_SLOTS = [1, 2, 3, 4].flatMap((n) => [
  { key: `hero_desktop_${n}`, label: `হিরো ছবি ${n} — ডেস্কটপ` },
  { key: `hero_mobile_${n}`, label: `হিরো ছবি ${n} — মোবাইল` },
]);

function SlotRow({ slotKey, label, current }: { slotKey: string; label: string; current?: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setMsg('');
    try {
      const url = await uploadSiteMedia(file, slotKey);
      await saveSiteValue(slotKey, url);
      setMsg('বদলানো হয়েছে।');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'আপলোড ব্যর্থ হয়েছে।');
    }
    setBusy(false);
  };

  return (
    <div className="portal-row" style={{ justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ width: 96, height: 56, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {current ? <img src={current} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={18} />}
        </div>
        <div>
          <div>{label}</div>
          <div className="portal-small">{current ? 'আপলোড করা ছবি ব্যবহার হচ্ছে' : 'এখন ডিফল্ট ছবি দেখাচ্ছে'}</div>
          {msg && <div className="portal-small">{msg}</div>}
        </div>
      </div>
      <label className="portal-btn-ghost" style={{ cursor: busy ? 'wait' : 'pointer', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <Upload size={14} /> {busy ? 'আপলোড হচ্ছে...' : 'বদলান'}
        <input
          type="file"
          accept="image/*"
          hidden
          disabled={busy}
          onChange={(e) => { onPick(e.target.files?.[0]); e.target.value = ''; }}
        />
      </label>
    </div>
  );
}

export default function WebsiteEditor() {
  const site = useSiteContent();

  return (
    <section className="glass portal-section" style={{ marginTop: 22 }}>
      <h3>ওয়েবসাইট এডিটর</h3>
      <p className="portal-small" style={{ marginBottom: 12 }}>
        ছবি বদলালে সাথে সাথে ওয়েবসাইটে দেখা যাবে। বর্তমানে হিরো ব্যানারের ছবিগুলো এখান থেকে বদলানো যায়।
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {HERO_SLOTS.map((s) => (
          <SlotRow key={s.key} slotKey={s.key} label={s.label} current={site[s.key]} />
        ))}
      </div>
    </section>
  );
}
