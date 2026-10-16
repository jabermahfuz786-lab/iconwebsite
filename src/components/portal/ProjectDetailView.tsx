import { useEffect, useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { fetchProjectDetail, type ProjectDetail } from '@/lib/portal';
import { usePortalText, formatMoney } from '@/lib/portalText';

export default function ProjectDetailView({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const { t, lang } = usePortalText();
  const [data, setData] = useState<ProjectDetail | null>(null);
  const [state, setState] = useState<'loading' | 'locked' | 'error' | 'ready'>('loading');

  useEffect(() => {
    (async () => {
      const res = await fetchProjectDetail(projectId);
      if (res === 'locked') setState('locked');
      else if (res === 'error') setState('error');
      else {
        setData(res);
        setState('ready');
      }
    })();
  }, [projectId]);

  const statusKey = {
    planning: 'statusPlanning',
    active: 'statusActive',
    on_hold: 'statusOnHold',
    completed: 'statusCompleted',
  } as const;

  return (
    <div>
      <button type="button" className="portal-btn-ghost portal-back" onClick={onBack}>
        <ArrowLeft size={16} /> {t('back')}
      </button>

      {state === 'loading' && <p className="portal-small">{t('loading')}</p>}
      {state === 'locked' && <p className="portal-error">{t('lockedNow')}</p>}
      {state === 'error' && <p className="portal-error">{t('loadError')}</p>}

      {state === 'ready' && data && (
        <>
          <div className="glass portal-detail-head">
            {data.project.image_url && (
              <div className="portal-detail-img" style={{ backgroundImage: `url(${data.project.image_url})` }} />
            )}
            <div className="portal-row">
              <h2>{lang === 'en' ? data.project.name_en : data.project.name_bn}</h2>
              {data.project.status && <span className="portal-pill open">{t(statusKey[data.project.status])}</span>}
            </div>
            <p className="portal-small">{lang === 'en' ? data.project.sector_en : data.project.sector_bn}</p>
            <p className="portal-small">{formatMoney(data.my_amount, data.my_currency || 'USD')}</p>
            <div className="portal-row" style={{ marginTop: 12 }}>
              <span className="portal-small">{t('progress')}</span>
              <span className="portal-small">
                {data.project.progress_percent !== null ? `${data.project.progress_percent}%` : t('noInfo')}
              </span>
            </div>
            {data.project.progress_percent !== null && (
              <div className="portal-bar"><div style={{ width: `${data.project.progress_percent}%` }} /></div>
            )}
            {data.project.summary && <p style={{ marginTop: 12 }}>{data.project.summary}</p>}
          </div>

          <div className="portal-two">
            <section className="glass portal-section">
              <h3>{t('movingForward')}</h3>
              <p className="portal-pre">{data.project.moving_forward || t('noInfo')}</p>
            </section>
            <section className="glass portal-section">
              <h3>{t('notMovingForward')}</h3>
              <p className="portal-pre">{data.project.not_moving_forward || t('noInfo')}</p>
            </section>
          </div>

          <section className="glass portal-section">
            <h3>{t('updates')}</h3>
            {data.updates.length === 0 && <p className="portal-small">{t('noUpdates')}</p>}
            <div className="portal-timeline">
              {data.updates.map((u) => (
                <div key={u.id} className="portal-timeline-item">
                  <span className="portal-small">{new Date(u.update_date).toLocaleDateString('en-GB')}</span>
                  <h4>{u.title}</h4>
                  {u.image_url && <img src={u.image_url} alt="" className="portal-update-img" />}
                  <p className="portal-pre">{u.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass portal-section">
            <h3>{t('files')}</h3>
            {data.files.length === 0 && <p className="portal-small">{t('noFiles')}</p>}
            {data.files.map((f) => (
              <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer" className="portal-file">
                <FileText size={16} /> <span>{f.title}</span> <span className="portal-small">{t('openFile')}</span>
              </a>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
