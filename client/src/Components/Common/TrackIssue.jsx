import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Loader2,
  Sun,
  Moon,
  ArrowLeft,
  Clock,
  Check,
  Search,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTrackedIssue, getReadableErrorMessage } from '../../lib/api';

function formatIssueDate(value) {
  if (!value) {
    return 'Unavailable';
  }

  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatStatusLabel(status) {
  return String(status || '')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildUpdates(issue) {
  const updates = [
    {
      id: 'reported',
      date: formatIssueDate(issue.created_at),
      title: 'Report Logged',
      desc: 'The issue has been recorded in CivicConnect and routed for review.',
      completed: true,
    },
    {
      id: 'assigned',
      date: issue.department ? 'Assigned' : 'Pending',
      title: issue.department ? `Assigned to ${issue.department}` : 'Awaiting Department Assignment',
      desc: issue.department
        ? `The report is being handled by ${issue.department}.`
        : 'The system is determining the responsible department.',
      completed: ['acknowledged', 'in_progress', 'resolved', 'closed'].includes(issue.status),
    },
    {
      id: 'progress',
      date: ['in_progress', 'resolved', 'closed'].includes(issue.status) ? formatStatusLabel(issue.status) : 'Pending',
      title: 'Work In Progress',
      desc: 'Field teams are actively working through the reported issue.',
      completed: ['in_progress', 'resolved', 'closed'].includes(issue.status),
    },
    {
      id: 'resolved',
      date: issue.resolved_at ? formatIssueDate(issue.resolved_at) : 'Pending',
      title: 'Resolved',
      desc: issue.resolved_at
        ? 'The issue has been marked resolved by the service team.'
        : 'Resolution is still pending verification.',
      completed: ['resolved', 'closed'].includes(issue.status),
    },
  ];

  if (issue.status === 'rejected') {
    updates[3] = {
      id: 'rejected',
      date: 'Rejected',
      title: 'Report Rejected',
      desc: 'The report was closed without resolution. Please contact support if this seems incorrect.',
      completed: true,
    };
  }

  return updates;
}

const TrackIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchId, setSearchId] = useState(location.state?.trackingCode || '');
  const [isSearching, setIsSearching] = useState(false);
  const [issueData, setIssueData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const runSearch = async (trackingCode) => {
    if (!trackingCode.trim()) {
      return;
    }

    setIsSearching(true);
    setErrorMessage('');

    try {
      const issue = await fetchTrackedIssue(trackingCode.trim());
      setIssueData(issue);
    } catch (error) {
      setIssueData(null);
      setErrorMessage(getReadableErrorMessage(error, 'Tracking ID not found.'));
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (location.state?.trackingCode) {
      runSearch(location.state.trackingCode);
    }
  }, [location.state?.trackingCode]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await runSearch(searchId);
  };

  const updates = issueData ? buildUpdates(issueData) : [];
  const statusLabel = issueData ? formatStatusLabel(issueData.status) : '';

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-hidden transition-colors duration-500 relative ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-300/20 rounded-full blur-[120px]"></div>
      </div>

      <header className={`border-b px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4 shrink-0 backdrop-blur-xl z-20 transition-all duration-300 ${isDark ? 'bg-[#0f172a]/80 border-slate-800/50' : 'bg-white/80 border-slate-200/50'}`}>
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={() => navigate('/')}
            className={`p-2.5 -ml-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight truncate">Track Issue</h1>
              <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-black tracking-wider uppercase ${isDark ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                <ShieldCheck className="w-3 h-3" />
                Live Status
              </span>
            </div>
            <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Municipal service tracker for registered complaints
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800/70 text-slate-300 border border-slate-700' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
            <Timer className="w-4 h-4 text-blue-500" />
            Tracking Code Search
          </div>
          {issueData?.department ? (
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800/70 text-slate-300 border border-slate-700' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Dept: {issueData.department}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/anonymousreport')}
            className={`hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'}`}
          >
            Report New
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8 mt-4 sm:mt-8">
          <div className={`rounded-[2rem] p-6 sm:p-10 backdrop-blur-2xl transition-all duration-500 border ${isDark ? 'bg-slate-900/60 border-slate-800 shadow-xl shadow-black/40' : 'bg-white/80 border-white shadow-lg shadow-slate-200/50'}`}>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Enter Tracking ID</h2>
            <p className={`mb-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Use the unique tracking code returned when the issue was submitted.</p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. ISS-1234ABCD"
                  value={searchId}
                  onChange={(event) => setSearchId(event.target.value.toUpperCase())}
                  className={`w-full pl-14 pr-4 py-4 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-mono text-lg font-bold uppercase ${isDark ? 'bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-700 focus:border-blue-500' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-blue-400 focus:bg-white shadow-inner'}`}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchId.trim()}
                className="py-4 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center min-w-[140px] shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
              </button>
            </form>

            {errorMessage ? (
              <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-500">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            ) : null}
          </div>

          {issueData ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className={`rounded-[2rem] p-6 sm:p-8 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      {statusLabel}
                    </span>
                    <h3 className="text-3xl font-black font-mono tracking-wider">{issueData.tracking_code}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl ${isDark ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Category</p>
                    <p className="font-bold text-lg">{issueData.category || issueData.title}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Date Reported</p>
                    <p className="font-bold text-lg">{formatIssueDate(issueData.created_at)}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Location</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {issueData.address || 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`rounded-[2rem] p-6 sm:p-10 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <h3 className="text-xl font-black mb-8 tracking-tight">Resolution Journey</h3>

                <div className="space-y-0 relative">
                  <div className={`absolute top-4 bottom-8 left-6 w-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                  {updates.map((update) => (
                    <div key={update.id} className="relative flex items-start gap-6 pb-10 last:pb-0">
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0 transition-all duration-300 ${update.completed ? 'bg-blue-500 border-blue-100 dark:border-blue-900 text-white shadow-lg shadow-blue-500/30' : (isDark ? 'bg-slate-800 border-slate-900 text-slate-500' : 'bg-slate-100 border-white text-slate-400')}`}>
                        {update.completed ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>

                      <div className={`flex-1 pt-1 ${!update.completed ? 'opacity-60' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <span className={`text-lg font-black ${update.completed ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
                            {update.title}
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {update.date}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{update.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default TrackIssue;
