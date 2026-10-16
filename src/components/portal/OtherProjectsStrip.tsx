import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CatalogProject } from '@/lib/portal';
import { usePortalText } from '@/lib/portalText';

// Slim strip: other company projects the investor is NOT in. Collapsed by default.
export default function OtherProjectsStrip({ projects }: { projects: CatalogProject[] }) {
  const { t, lang } = usePortalText();
  const [open, setOpen] = useState(false);

  return (
    <div className="portal-strip">
      <button type="button" className="portal-strip-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>
          <strong>{t('otherProjects')}</strong>
          <span className="portal-small"> · {t('otherProjectsHint')}</span>
        </span>
        <span className="portal-strip-toggle">
          {open ? t('hideOthers') : t('showOthers')}
          <ChevronDown size={16} className={open ? 'rot' : ''} />
        </span>
      </button>
      {open && (
        <ul className="portal-strip-list">
          {projects.length === 0 && <li className="portal-small">{t('noOthers')}</li>}
          {projects.map((p) => (
            <li key={p.id}>
              <span>{lang === 'en' ? p.name_en : p.name_bn}</span>
              <span className="portal-small">{lang === 'en' ? p.sector_en : p.sector_bn}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
