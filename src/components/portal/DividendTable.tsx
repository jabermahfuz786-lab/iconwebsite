import type { Dividend } from '@/lib/portal';
import { usePortalText, formatMoney } from '@/lib/portalText';

export default function DividendTable({ rows }: { rows: Dividend[] }) {
  const { t, lang } = usePortalText();
  const statusLabel: Record<Dividend['status'], string> = {
    scheduled: t('payScheduled'),
    pending: t('payPending'),
    paid: t('payPaid'),
    failed: t('payFailed'),
  };

  return (
    <section className="glass portal-section">
      <h3>{t('dividends')}</h3>
      {rows.length === 0 ? (
        <p className="portal-small">{t('noDividends')}</p>
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>{t('date')}</th>
                <th>{t('project')}</th>
                <th>{t('amount')}</th>
                <th>{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.paid_on ? new Date(r.paid_on).toLocaleDateString('en-GB') : '—'}</td>
                  <td>{(lang === 'en' ? r.project_name_en : r.project_name_bn) || '—'}</td>
                  <td>{formatMoney(r.amount, r.currency)}</td>
                  <td><span className={`portal-pill ${r.status === 'paid' ? 'open' : ''}`}>{statusLabel[r.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
