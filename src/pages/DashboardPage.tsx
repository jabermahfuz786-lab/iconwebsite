import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { CalendarPlus, FileText, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Investor, InvestmentDocument, InvestorMeeting } from '@/types';
import {
  fetchOverview, fetchProjects, fetchDividends, fetchCatalog,
  type Overview, type PortalProject, type Dividend, type CatalogProject,
} from '@/lib/portal';
import { usePortalText } from '@/lib/portalText';
import OverviewCards from '@/components/portal/OverviewCards';
import ProjectCard from '@/components/portal/ProjectCard';
import ProjectDetailView from '@/components/portal/ProjectDetailView';
import DividendTable from '@/components/portal/DividendTable';
import OtherProjectsStrip from '@/components/portal/OtherProjectsStrip';

function DetailRow({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  const { t } = usePortalText();
  return (
    <div className="portal-detail" style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <span className="portal-small">{label}</span>
      <div>{value || t('notProvided')}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { navigate } = useApp();
  const { t } = usePortalText();

  const [ready, setReady] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [catalog, setCatalog] = useState<CatalogProject[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [documents, setDocuments] = useState<InvestmentDocument[]>([]);
  const [meetings, setMeetings] = useState<InvestorMeeting[]>([]);
  const [viewId, setViewId] = useState<string | null>(null);

  const [mDate, setMDate] = useState('');
  const [mTime, setMTime] = useState('');
  const [mTopic, setMTopic] = useState('');
  const [mNotes, setMNotes] = useState('');
  const [mShow, setMShow] = useState(false);
  const [mSent, setMSent] = useState(false);

  const loadAll = useCallback(async () => {
    const [ov, pr, cat, dv, inv, docs, mtgs] = await Promise.all([
      fetchOverview(),
      fetchProjects(),
      fetchCatalog(),
      fetchDividends(),
      supabase.from('investors').select('*').maybeSingle(),
      supabase.from('investment_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('investor_meetings').select('*').order('created_at', { ascending: false }),
    ]);
    setOverview(ov);
    setProjects(pr);
    setCatalog(cat);
    setDividends(dv);
    setInvestor((inv.data as Investor | null) ?? null);
    setDocuments((docs.data as InvestmentDocument[]) ?? []);
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

  // Projects the investor is NOT in, for the slim strip.
  const others = useMemo(() => {
    const held = new Set(projects.map((p) => p.id));
    return catalog.filter((c) => !held.has(c.id));
  }, [catalog, projects]);

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
    <div className="portal-page portal-fade">
      <div className="portal-hello">
        <p className="portal-small">{t('welcome')}</p>
        <h1>{overview.full_name}</h1>
        <span className="portal-pill open">{overview.investor_code}</span>
      </div>

      <OverviewCards overview={overview} />

      {!viewId && <OtherProjectsStrip projects={others} />}

      <h2 className="portal-h2">
        {t('myProjects')} ({projects.length})
      </h2>

      {viewId ? (
        <ProjectDetailView projectId={viewId} onBack={() => setViewId(null)} />
      ) : (
        <div className="portal-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onView={() => setViewId(p.id)} />
          ))}
        </div>
      )}

      {!viewId && (
        <>
          <section className="glass portal-section" style={{ marginTop: 22 }}>
            <h3>{t('myDetails')}</h3>
            <p className="portal-small" style={{ marginBottom: 12 }}>{t('myDetailsNote')}</p>
            <div className="portal-details-top">
              {investor?.photo_url && (
                <img src={investor.photo_url} alt={t('passportPhoto')} className="portal-photo" />
              )}
              <div className="portal-details">
                <DetailRow label={t('fullName')} value={investor?.full_name} />
                <DetailRow label={t('firstName')} value={investor?.first_name} />
                <DetailRow label={t('lastName')} value={investor?.last_name} />
                <DetailRow label={t('fatherName')} value={investor?.father_name} />
                <DetailRow label={t('passportNo')} value={investor?.nid_pass} />
                <DetailRow label={t('address')} value={investor?.permanent_address} wide />
                <DetailRow label={t('investorId')} value={investor?.investor_code} />
                <DetailRow label={t('email')} value={investor?.email} />
                <DetailRow label={t('mobile')} value={investor?.phone} />
              </div>
            </div>
            <h3 style={{ marginTop: 18 }}><UserCheck size={16} /> {t('nomineeTitle')}</h3>
            <div className="portal-details">
              <DetailRow label={t('fullName')} value={investor?.nominee_name} />
              <DetailRow label={t('nomineeFather')} value={investor?.nominee_father_name} />
              <DetailRow label={t('nomineePassport')} value={investor?.nominee_pass} />
              <DetailRow label={t('nomineeAddress')} value={investor?.nominee_address} wide />
              <DetailRow label={t('nomineePhone')} value={investor?.nominee_phone} />
            </div>
          </section>

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

          <section className="glass portal-section" style={{ marginTop: 16 }}>
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
        </>
      )}
    </div>
  );
}
