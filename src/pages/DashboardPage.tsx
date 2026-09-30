import { useState, useEffect, useCallback } from 'react';
import { User, Briefcase, DollarSign, Calendar, FileText, Receipt, UserCheck, TrendingUp, Bell, CalendarPlus, LogOut, AlertCircle, Clock, Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import type { Investor, Investment, InvestmentDocument, InvestorNotice, InvestorMeeting } from '@/types';

export default function DashboardPage() {
  const { t, navigate } = useApp();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [documents, setDocuments] = useState<InvestmentDocument[]>([]);
  const [notices, setNotices] = useState<InvestorNotice[]>([]);
  const [meetings, setMeetings] = useState<InvestorMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingSuccess, setMeetingSuccess] = useState(false);

  // Meeting form state
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingTopic, setMeetingTopic] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  const loadData = useCallback(async (email: string) => {
    // Get investor profile
    const { data: inv } = await supabase
      .from('investors')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!inv) {
      setLoading(false);
      return;
    }

    setInvestor(inv as Investor);

    // Get investments
    const { data: invs } = await supabase
      .from('investments')
      .select('*')
      .eq('investor_id', inv.id)
      .order('created_at', { ascending: false });
    setInvestments(invs || []);

    // Get documents for all investments
    if (invs && invs.length > 0) {
      const invIds = invs.map((i) => i.id);
      const { data: docs } = await supabase
        .from('investment_documents')
        .select('*')
        .in('investment_id', invIds)
        .order('created_at', { ascending: false });
      setDocuments(docs || []);
    }

    // Get notices
    const { data: nots } = await supabase
      .from('investor_notices')
      .select('*')
      .or(`investor_id.is.null,investor_id.eq.${inv.id}`)
      .order('created_at', { ascending: false })
      .limit(10);
    setNotices(nots || []);

    // Get meetings
    const { data: mtgs } = await supabase
      .from('investor_meetings')
      .select('*')
      .eq('investor_id', inv.id)
      .order('created_at', { ascending: false });
    setMeetings(mtgs || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/investor-login');
        return;
      }
      await loadData(session.user.email || '');
    })();
  }, [navigate, loadData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investor) return;

    const { data } = await supabase
      .from('investor_meetings')
      .insert({
        investor_id: investor.id,
        requested_date: meetingDate,
        requested_time: meetingTime,
        topic: meetingTopic,
        notes: meetingNotes,
        status: 'pending',
      })
      .select()
      .single();

    if (data) {
      setMeetings([data as InvestorMeeting, ...meetings]);
      setMeetingSuccess(true);
      setShowMeetingForm(false);
      setMeetingDate('');
      setMeetingTime('');
      setMeetingTopic('');
      setMeetingNotes('');
      setTimeout(() => setMeetingSuccess(false), 4000);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    const symbols: Record<string, string> = { SAR: 'SAR', OMR: 'OMR', BDT: 'BDT', USD: '$' };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const daysUntil = (dateStr: string | null) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="smoke-card h-96 skeleton" />
        </div>
      </div>
    );
  }

  if (!investor) {
    return (
      <div className="pt-24 pb-20 text-center">
        <AlertCircle className="w-12 h-12 text-amber-300 mx-auto mb-4" />
        <p className="text-cream-50/50 text-lg mb-4">Investor profile not found. Please contact your account manager.</p>
        <button onClick={handleSignOut} className="btn-outline-gold">{t('signOut')}</button>
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, i) => sum + i.investment_amount, 0);
  const totalPaid = investments.reduce((sum, i) => sum + i.paid_amount, 0);
  const totalDue = investments.reduce((sum, i) => sum + i.due_amount, 0);
  const totalProfit = investments.reduce((sum, i) => sum + (i.profit_distributed || 0), 0);

  return (
    <div className="pt-24 pb-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-cream-50 mb-1">{t('dashboard')}</h1>
            <p className="text-cream-50/50 text-sm">{t('profileOverview')}</p>
          </div>
          <button onClick={handleSignOut} className="btn-outline-gold flex items-center gap-2 text-sm">
            <LogOut className="w-4 h-4" /> {t('signOut')}
          </button>
        </div>

        {/* Profile Card */}
        <div className="smoke-card p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-amber-300/10 border border-amber-400/25 flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-amber-300" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl text-cream-50">{investor.full_name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                <div className="flex items-center gap-2 text-cream-50/60">
                  <span className="text-cream-50/40">{t('investorCode')}:</span>
                  <span className="text-amber-300 font-mono">{investor.investor_code}</span>
                </div>
                <div className="flex items-center gap-2 text-cream-50/60">
                  <span className="text-cream-50/40">Email:</span>
                  <span>{investor.email}</span>
                </div>
                {investor.phone && (
                  <div className="flex items-center gap-2 text-cream-50/60">
                    <span className="text-cream-50/40">Phone:</span>
                    <span dir="ltr">{investor.phone}</span>
                  </div>
                )}
                {investor.country && (
                  <div className="flex items-center gap-2 text-cream-50/60">
                    <span className="text-cream-50/40">{t('country')}:</span>
                    <span>{investor.country}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className={`badge ${investor.is_active ? 'badge-green' : 'badge-red'}`}>
                {investor.is_active ? 'Active' : 'Suspended'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Briefcase} label={t('investmentAmount')} value={formatPrice(totalInvested, 'USD')} />
          <StatCard icon={DollarSign} label={t('paidAmount')} value={formatPrice(totalPaid, 'USD')} />
          <StatCard icon={AlertCircle} label={t('dueAmount')} value={formatPrice(totalDue, 'USD')} />
          <StatCard icon={TrendingUp} label={t('profitDistribution')} value={formatPrice(totalProfit, 'USD')} />
        </div>

        {/* Investments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Investments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="smoke-card p-6">
              <h3 className="font-serif text-xl text-cream-50 mb-4">{t('projectAllocation')}</h3>
              {investments.length === 0 ? (
                <p className="text-cream-50/40 text-sm">{t('noInvestments')}</p>
              ) : (
                <div className="space-y-4">
                  {investments.map((inv) => {
                    const days = daysUntil(inv.next_installment_date);
                    return (
                      <div key={inv.id} className="p-4 rounded-lg bg-amber-300/5 border border-amber-400/15">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-cream-50 font-medium">{inv.project_name}</h4>
                          <span className={`badge ${inv.status === 'active' ? 'badge-green' : 'badge-gold'}`}>{inv.status}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-cream-50/40 text-xs">{t('investmentAmount')}</p>
                            <p className="text-cream-50/80">{formatPrice(inv.investment_amount, inv.currency)}</p>
                          </div>
                          <div>
                            <p className="text-cream-50/40 text-xs">{t('paidAmount')}</p>
                            <p className="text-cream-50/80">{formatPrice(inv.paid_amount, inv.currency)}</p>
                          </div>
                          <div>
                            <p className="text-cream-50/40 text-xs">{t('dueAmount')}</p>
                            <p className="text-cream-50/80">{formatPrice(inv.due_amount, inv.currency)}</p>
                          </div>
                          <div>
                            <p className="text-cream-50/40 text-xs">{t('nextInstallment')}</p>
                            <p className="text-cream-50/80">
                              {inv.next_installment_date ? new Date(inv.next_installment_date).toLocaleDateString() : 'N/A'}
                              {days !== null && days > 0 && (
                                <span className="text-amber-300 text-xs ml-1">({days} {t('days')})</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Construction Progress */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-cream-50/40">{t('constructionProgress')}</span>
                            <span className="text-amber-300">Check project page</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: '50%' }} />
                          </div>
                        </div>

                        {/* Agreement */}
                        {inv.agreement_url && (
                          <a
                            href={inv.agreement_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 text-amber-300 hover:text-amber-300 text-xs"
                          >
                            <FileText className="w-3.5 h-3.5" /> {t('agreementPdf')}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Documents */}
            {documents.length > 0 && (
              <div className="smoke-card p-6">
                <h3 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-300" /> {t('digitalReceipts')}
                </h3>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-amber-300/5 border border-amber-400/15 hover:border-amber-400/30 transition-all"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <div className="flex-1">
                        <p className="text-cream-50/80 text-sm">{doc.title}</p>
                        <p className="text-cream-50/40 text-xs capitalize">{doc.document_type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Notices, Nominee, Meeting */}
          <div className="space-y-6">
            {/* Nominee */}
            {investor.nominee_name && (
              <div className="smoke-card p-6">
                <h3 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-300" /> {t('nomineeInfo')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-50/40">Name:</span>
                    <span className="text-cream-50/80">{investor.nominee_name}</span>
                  </div>
                  {investor.nominee_relation && (
                    <div className="flex justify-between">
                      <span className="text-cream-50/40">Relation:</span>
                      <span className="text-cream-50/80">{investor.nominee_relation}</span>
                    </div>
                  )}
                  {investor.nominee_phone && (
                    <div className="flex justify-between">
                      <span className="text-cream-50/40">Phone:</span>
                      <span className="text-cream-50/80" dir="ltr">{investor.nominee_phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notices */}
            <div className="smoke-card p-6">
              <h3 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-300" /> {t('noticeBoard')}
              </h3>
              {notices.length === 0 ? (
                <p className="text-cream-50/40 text-sm">No notices at this time.</p>
              ) : (
                <div className="space-y-3">
                  {notices.map((notice) => (
                    <div key={notice.id} className="p-3 rounded-lg bg-amber-300/5 border border-amber-400/15">
                      <p className="text-cream-50 text-sm font-medium">{notice.title}</p>
                      <p className="text-cream-50/50 text-xs mt-1">{notice.body}</p>
                      <p className="text-cream-50/40 text-xs mt-1">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting Request */}
            <div className="smoke-card p-6">
              <h3 className="font-serif text-xl text-cream-50 mb-4 flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-amber-300" /> {t('requestMeeting')}
              </h3>
              {meetingSuccess && (
                <div className="mb-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                  {t('meetingRequested')}
                </div>
              )}
              {showMeetingForm ? (
                <form onSubmit={handleMeetingSubmit} className="space-y-3">
                  <input
                    type="date"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    required
                    className="input-luxury text-sm"
                  />
                  <input
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    required
                    className="input-luxury text-sm"
                  />
                  <input
                    type="text"
                    value={meetingTopic}
                    onChange={(e) => setMeetingTopic(e.target.value)}
                    required
                    placeholder={t('meetingTopic')}
                    className="input-luxury text-sm"
                  />
                  <textarea
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder={t('meetingNotes')}
                    rows={2}
                    className="input-luxury text-sm"
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-gold flex-1 text-sm">{t('requestMeetingBtn')}</button>
                    <button type="button" onClick={() => setShowMeetingForm(false)} className="btn-outline-gold text-sm">{t('cancel')}</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setShowMeetingForm(true)} className="btn-outline-gold w-full text-sm flex items-center justify-center gap-2">
                  <CalendarPlus className="w-4 h-4" /> {t('requestMeetingBtn')}
                </button>
              )}

              {/* Existing meetings */}
              {meetings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {meetings.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 text-xs p-2 rounded bg-amber-300/5">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span className="text-cream-50/60">{m.requested_date} at {m.requested_time}</span>
                      <span className={`badge ${m.status === 'pending' ? 'badge-gold' : 'badge-green'} text-[0.6rem] ml-auto`}>{m.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="smoke-card p-5">
      <div className="w-10 h-10 rounded-lg bg-amber-300/10 flex items-center justify-center mb-2">
        <Icon className="w-5 h-5 text-amber-300" />
      </div>
      <p className="text-cream-50/40 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-cream-50 font-serif text-xl mt-1">{value}</p>
    </div>
  );
}
