import { Lock, Unlock } from 'lucide-react';
import type { PortalProject } from '@/lib/portal';
import { usePortalText, formatMoney } from '@/lib/portalText';

type Props = {
  project: PortalProject;
  onUnlock: () => void;
  onView: () => void;
};

export default function ProjectCard({ project, onUnlock, onView }: Props) {
  const { t, lang } = usePortalText();
  const name = lang === 'en' ? project.name_en : project.name_bn;
  const sector = lang === 'en' ? project.sector_en : project.sector_bn;
  const invested = Number(project.my_amount) > 0;

  return (
    <div className="glass portal-project">
      <div
        className="portal-project-img"
        style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : undefined}
        aria-hidden="true"
      >
        {!project.image_url && <span>{name.charAt(0)}</span>}
      </div>
      <div className="portal-project-body">
        <div className="portal-row">
          <h3>{name}</h3>
          <span className={`portal-pill ${project.is_unlocked ? 'open' : ''}`}>
            {project.is_unlocked ? <Unlock size={12} /> : <Lock size={12} />}
            {project.is_unlocked ? t('unlocked') : t('locked')}
          </span>
        </div>
        <p className="portal-small">{sector}</p>
        <p className="portal-small">
          {t('invested')}: {invested ? formatMoney(project.my_amount, project.my_currency || 'USD') : '—'}
        </p>

        {project.is_unlocked ? (
          <button type="button" className="portal-btn" onClick={onView}>{t('view')}</button>
        ) : project.has_pin ? (
          <button type="button" className="portal-btn" onClick={onUnlock} disabled={!invested}>
            {t('unlock')}
          </button>
        ) : (
          <p className="portal-small">{t('noPin')}</p>
        )}
      </div>
    </div>
  );
}
