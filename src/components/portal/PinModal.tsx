import { useState, type FormEvent } from 'react';
import type { PortalProject } from '@/lib/portal';
import { unlockProject } from '@/lib/portal';
import { usePortalText } from '@/lib/portalText';

type Props = {
  project: PortalProject;
  onClose: () => void;
  onUnlocked: () => void;
};

export default function PinModal({ project, onClose, onUnlocked }: Props) {
  const { t, lang } = usePortalText();
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const name = lang === 'en' ? project.name_en : project.name_bn;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await unlockProject(project.id, pin);
    setBusy(false);
    if (result === 'ok') {
      onUnlocked();
      return;
    }
    const messages: Record<string, string> = {
      wrong: t('pinWrong'),
      locked: t('pinLocked'),
      no_investment: t('noInvestment'),
      no_pin: t('noPin'),
      error: t('loadError'),
    };
    setError(messages[result]);
    setPin('');
  };

  return (
    <div className="portal-modal-backdrop" onClick={onClose}>
      <form className="glass portal-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{t('pinTitle')}</h3>
        <p className="portal-small" style={{ marginBottom: 12 }}>{name}</p>
        <p className="portal-small" style={{ marginBottom: 12 }}>{t('pinHelp')}</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={12}
          className="portal-input"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          autoFocus
          required
        />
        {error && <p className="portal-error">{error}</p>}
        <div className="portal-row" style={{ marginTop: 12, gap: 8 }}>
          <button type="button" className="portal-btn-ghost" onClick={onClose}>{t('cancel')}</button>
          <button type="submit" className="portal-btn" disabled={busy || pin.length < 4}>{t('verify')}</button>
        </div>
      </form>
    </div>
  );
}
