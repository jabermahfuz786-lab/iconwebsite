import { Briefcase, Activity, CheckCircle2, TrendingUp, Crown, ShieldCheck } from 'lucide-react';
import type { Overview } from '@/lib/portal';
import { usePortalText, formatMoney } from '@/lib/portalText';

function Money({ map }: { map: Record<string, number> }) {
  const entries = Object.entries(map);
  if (entries.length === 0) return <span className="portal-big">—</span>;
  return (
    <>
      {entries.map(([cur, amt]) => (
        <span key={cur} className="portal-big portal-line">{formatMoney(amt, cur)}</span>
      ))}
    </>
  );
}

// Six tiles, each with its own gradient tone (tone-1 .. tone-6) and a staggered entrance.
export default function OverviewCards({ overview }: { overview: Overview }) {
  const { t } = usePortalText();
  const estimatedEmpty = Object.keys(overview.estimated_by_currency).length === 0;

  return (
    <div className="portal-cards">
      <div className="portal-tile tone-1">
        <Briefcase className="portal-icon" size={20} />
        <p className="portal-label">{t('totalInvestment')}</p>
        <Money map={overview.total_by_currency} />
      </div>

      <div className="portal-tile tone-2">
        <Activity className="portal-icon" size={20} />
        <p className="portal-label">{t('activeProjects')}</p>
        <span className="portal-big">{overview.active_projects}</span>
      </div>

      <div className="portal-tile tone-3">
        <CheckCircle2 className="portal-icon" size={20} />
        <p className="portal-label">{t('completedProjects')}</p>
        <span className="portal-big">{overview.completed_projects}</span>
      </div>

      <div className="portal-tile tone-4">
        <TrendingUp className="portal-icon" size={20} />
        <p className="portal-label">{t('profitReceived')}</p>
        <Money map={overview.received_by_currency} />
        <p className="portal-label" style={{ marginTop: 10 }}>{t('estimatedProfit')}</p>
        {estimatedEmpty ? <span className="portal-small">{t('notAvailable')}</span> : <Money map={overview.estimated_by_currency} />}
      </div>

      <div className="portal-tile tone-5">
        <Crown className="portal-icon" size={20} />
        <p className="portal-label">{t('membership')}</p>
        <span className="portal-big">{overview.membership_level || t('memberDefault')}</span>
      </div>

      <div className="portal-tile tone-6">
        <ShieldCheck className="portal-icon" size={20} />
        <p className="portal-label">{t('securityTitle')}</p>
        <span className="portal-small">{t('securityDesc')}</span>
      </div>
    </div>
  );
}
