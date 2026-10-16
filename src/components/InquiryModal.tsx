import { useState, type ReactNode } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { supabase, whatsappLink } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';

interface InquiryField {
  key: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'select' | 'textarea' | 'signature';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  inquiryType: string;
  whatsappMsg: string;
  fields?: InquiryField[];
  children?: ReactNode;
}

export function InquiryModal({ open, onClose, title, inquiryType, whatsappMsg, fields, children }: InquiryModalProps) {
  const { t } = useApp();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const defaultFields: InquiryField[] = [
    { key: 'name', label: t('yourName'), type: 'text', required: true },
    { key: 'phone', label: t('yourPhone'), type: 'tel', required: true },
  { key: 'message', label: t('message'), type: 'textarea' },
  ];

  const activeFields = fields || defaultFields;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('business_inquiries').insert({
      inquiry_type: inquiryType,
      name: formData.name || '',
      phone: formData.phone || '',
      email: formData.email || '',
      message: formData.message || JSON.stringify(formData),
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => { setDone(false); setFormData({}); onClose(); }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(42,37,32,0.3)', backdropFilter: 'blur(6px)' }}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden" style={{ background: 'rgba(250,247,241,0.95)', border: '1px solid rgba(255,214,10,0.4)', boxShadow: '0 12px 40px rgba(255,214,10,0.12), inset 0 0 15px rgba(255,214,10,0.06)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,214,10,0.12)' }}>
          <h3 className="text-lg font-bold lux-serif" style={{ color: '#FFD60A' }}>{title}</h3>
          <button onClick={onClose} className="text-[#2A2520]/40 hover:text-[#2A2520] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(255,214,10,0.10)', border: '1px solid rgba(255,214,10,0.3)' }}>
              <Send className="w-7 h-7" style={{ color: '#FFD60A' }} />
            </div>
            <p className="text-[#2A2520]/80 text-sm">{t('submitted')}</p>
          </div>
        ) : (
          <div className="p-5">
            {children && <div className="mb-4">{children}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              {activeFields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(154,120,32,0.8)' }}>{f.label}{f.required && ' *'}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="ca-input"
                      rows={3}
                      placeholder={f.placeholder}
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      required={f.required}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      className="ca-input"
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      required={f.required}
                    >
                      <option value="">{t('select')}</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      className="ca-input"
                      placeholder={f.placeholder || f.label}
                      value={formData[f.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      required={f.required}
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting} className="ca-btn-primary flex-1">
                  {submitting ? '...' : t('submit')}
                </button>
                <a href={whatsappLink(whatsappMsg)} target="_blank" rel="noopener noreferrer" className="ca-btn-outline flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> {t('whatsapp')}
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
