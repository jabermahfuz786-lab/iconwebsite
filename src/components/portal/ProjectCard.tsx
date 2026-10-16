import type { PortalProject } from '@/lib/portal';
import { usePortalText, formatMoney } from '@/lib/portalText';

type Props = {
  project: PortalProject;
  onView: () => void;
};

export default function ProjectCard({ project, onView }: Props) {
  const { t, lang } = usePortalText();
  const name = lang === 'en' ? project.name_en : project.name_bn;
  const sector = lang === 'en' ? project.sector_en : project.sector_bn;

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
        <h3>{name}</h3>
        <p className="portal-small">{sector}</p>
        <p className="portal-small">
          {t('invested')}: {formatMoney(project.my_amount, project.my_currency || 'USD')}
        </p>
        <button type="button" className="portal-btn" onClick={onView}>{t('view')}</button>
      </div>
    </div>
  );
}
