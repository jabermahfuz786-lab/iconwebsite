import type { PortalProject } from '@/lib/portal';
import { usePortalText, formatMoney } from '@/lib/portalText';

type Props = {
  project: PortalProject;
  onView: () => void;
};

// Every project card has the same look. Photo shows when image_url is set.
export default function ProjectCard({ project, onView }: Props) {
  const { t, lang } = usePortalText();
  const name = lang === 'en' ? project.name_en : project.name_bn;
  const sector = lang === 'en' ? project.sector_en : project.sector_bn;

  return (
    <div className="portal-project">
      <div
        className="portal-project-img"
        style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : undefined}
        aria-hidden="true"
      >
        {!project.image_url && <span>{name.charAt(0)}</span>}
      </div>
      <div className="portal-project-body">
        <span className="portal-sector">{sector}</span>
        <h3>{name}</h3>
        <p className="portal-small">
          {t('invested')}: <strong>{formatMoney(project.my_amount, project.my_currency || 'USD')}</strong>
        </p>
        <button type="button" className="portal-btn" onClick={onView}>{t('view')}</button>
      </div>
    </div>
  );
}
