import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { CalendarPlus, Bell, FileText, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Investor, InvestmentDocument, InvestorNotice, InvestorMeeting } from '@/types';
import {
  fetchOverview, fetchProjects, fetchDividends,
  type Overview, type PortalProject, type Dividend,
} from '@/lib/portal';
import { usePortalText } from '@/lib/portalText';
import OverviewCards from '@/components/portal/OverviewCards';
import ProjectCard from '@/components/portal/ProjectCard';
import PinModal from '@/components/portal/PinModal';
import ProjectDetailView from '@/components/portal/ProjectDetailView';
import DividendTable from '@/components/portal/DividendTable';

export default function DashboardPage() {
  const { navigate } = useApp();
  const { t } = usePortalText();

  const [ready, setReady] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [documents, setDocuments] = useState<InvestmentDocument[]>([]);
  const [notices, setNotices] = useState<InvestorNotice[]>([]);
  const [meetings, setMeetings] = useState<InvestorMeeting[]>([]);
  const [pinFor, setPinFor] = useState<PortalProject | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const [mDate, setMDate] = useState('');
  const [mTime, setMTime] = useState('');
  const [mTopic, setMTopic] = useState('');
  const [mNotes, setMNotes] = useState('');
  const [mShow, setMShow] = useState(false);
  const [mSent, setMSent] = useState(false);

  const loadAll = useCallback(async () => {
    const [ov, pr, dv, inv, docs, nots, mtgs] = await Promise.all([
      fetchOverview(),
      fetchProjects(),
      fetchDividends(),
      supabase.from('investors').select('*').maybeSingle(),
      supabase.from('investment_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('investor_notices').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('investor_meetings').select('*').order('created_at', { ascending: false }),
    ]);
    setOverview(ov);
    setProjects(pr);
    setDividends(dv);
    setInvestor((inv.data as Investor | null) ?? null);
    setDocuments((docs.data as InvestmentDocument[]) ?? []);
    setNotices((nots.data as InvestorNotice[]) ?? []);
    setMeetings((mtgs.data as InvestorMeeting[]) ?? []);
    setReady(true);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/investor-login');
        return;
      }
      await loadAll();
    })();
  }, [navigate, loadAll]);

  const submitMeeting = async (e: FormEvent) => {
    e.preventDefault();
    if (!investor) return;
    const { data } = await supabase
      .from('investor_meetings')
      .insert({ investor_id: investor.id, requested_date: mDate, requested_time: mTime, topic: mTopic, notes: mNotes, status: 'pending' })
      .select()
      .single();
    if (data) {
      setMeetings((prev) => [data as InvestorMeeting, ...prev]);
      setMSent(true);
      setMShow(false);
      setMDate(''); setMTime(''); setMTopic(''); setMNotes('');
      setTimeout(() => setMSent(false), 4000);
    }
  };

  if (!ready) return <div className="portal-page"><p className="portal-small">{t('loading')}</p></div>;

  if (!overview) {
    return (
      <div className="portal-page">
        <p className="portal-error">{t('profileNotFound')}</p>
        <button type="button" className="portal-btn-ghost" onClick={() => supabase.auth.signOut().then(() => navigate('/investor-login'))}>
          {t('logout')}
        </button>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <div className="portal-hello">
        <h1>{overview.full_name}</h1>
        <span className="portal-pill">{overview.investor_code}</span>
      </div>

      <OverviewCards overview={overview} />

      <h2 className="portal-h2">{t('myProjects')}</h2>

      {viewId ? (
        <ProjectDetailView projectId={viewId} onBack={() => setViewId(null)} />
      ) : (
        <div className="portal-grid">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onUnlock={() => setPinFor(p)}
              onView={() => setViewId(p.id)}
            />
          ))}
        </div>
      )}

      {pinFor && (
        <PinModal
          project={pinFor}
          onClose={() => setPinFor(null)}
          onUnlocked={() => {
            const id = pinFor.id;
            setPinFor(null);
            fetchProjects().then(setProjects);
            setViewId(id);
          }}
        />
      )}

      {!viewId && (
        <>
          <div className="portal-two" style={{ marginTop: 16 }}>
            <DividendTable rows={dividends} />

            <section className="glass portal-section">
              <h3><FileText size={16} /> {t('documents')}</h3>
              {documents.length === 0 && <p className="portal-small">{t('noDocuments')}</p>}
              {documents.map((d) => (
                <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer" className="portal-file">
                  <span>{d.title}</span> <span className="portal-small">{d.document_type}</span>
                </a>
              ))}
            </section>
          </div>

          <div className="portal-two" style={{ marginTop: 16 }}>
            <section className="glass portal-section">
              <h3><Bell size={16} /> {t('notices')}</h3>
              {notices.length === 0 && <p className="portal-small">{t('noNotices')}</p>}
              {notices.map((n) => (
                <div key={n.id} className="portal-notice">
                  <strong>{n.title}</strong>
                  <p className="portal-pre">{n.body}</p>
                  <span className="portal-small">{new Date(n.created_at).toLocaleDateString('en-GB')}</span>
                </div>
              ))}
            </section>

            <div>
              {investor?.nominee_name && (
                <section className="glass portal-section">
                  <h3><UserCheck size={16} /> {t('nominee')}</h3>
                  <p>{t('nomineeName')}: {investor.nominee_name}</p>
                  {investor.nominee_relation && <p>{t('nomineeRelation')}: {investor.nominee_relation}</p>}
                </section>
              )}

              <section className="glass portal-section">
                <h3><CalendarPlus size={16} /> {t('meeting')}</h3>
                {mSent && <p className="portal-ok">{t('meetingSent')}</p>}
                {mShow ? (
                  <form onSubmit={submitMeeting} className="portal-form">
                    <input type="date" className="portal-input" value={mDate} onChange={(e) => setMDate(e.target.value)} required aria-label={t('meetingDate')} />
                    <input type="time" className="portal-input" value={mTime} onChange={(e) => setMTime(e.target.value)} required aria-label={t('meetingTime')} />
                    <input className="portal-input" placeholder={t('meetingTopic')} value={mTopic} onChange={(e) => setMTopic(e.target.value)} required />
                    <textarea className="portal-input" placeholder={t('meetingNotes')} value={mNotes} onChange={(e) => setMNotes(e.target.value)} rows={2} />
                    <div className="portal-row" style={{ gap: 8 }}>
                      <button type="submit" className="portal-btn">{t('meetingSend')}</button>
                      <button type="button" className="portal-btn-ghost" onClick={() => setMShow(false)}>{t('cancel')}</button>
                    </div>
                  </form>
                ) : (
                  <button type="button" className="portal-btn" onClick={() => setMShow(true)}>{t('meetingOpen')}</button>
                )}
                {meetings.map((m) => (
                  <div key={m.id} className="portal-small" style={{ marginTop: 8 }}>
                    {m.requested_date} · {m.requested_time} · {m.topic} · {m.status === 'pending' ? t('pending') : t('confirmed')}
                  </div>
                ))}
              </section>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
