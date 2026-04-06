import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  FileText,
  MapPin,
  Camera,
  LayoutDashboard,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';
import { fetchCitizenDashboard, getReadableErrorMessage } from '../../lib/api';
import { useAuth } from '../../lib/auth';

function formatRelativeDate(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return 'Just now';
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString(undefined, { dateStyle: 'medium' });
}

function getIssueIcon(category) {
  const normalized = String(category || '').toLowerCase();

  if (normalized.includes('garbage')) {
    return <Camera className="w-5 h-5 text-emerald-500" />;
  }

  if (normalized.includes('light')) {
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  }

  return <MapPin className="w-5 h-5 text-orange-500" />;
}

function StatusBadge({ status }) {
  const styles = {
    resolved: '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    in_progress: '!bg-orange-500/10 text-orange-600 dark:text-orange-400',
    open: '!bg-rose-500/10 text-rose-600 dark:text-rose-400',
    acknowledged: '!bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };

  return (
    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest border border-current opacity-90 ${styles[status] || styles.open}`}>
      {String(status || 'open').replaceAll('_', '-').toUpperCase()}
    </span>
  );
}

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const data = await fetchCitizenDashboard();
        if (isMounted) {
          setDashboard(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getReadableErrorMessage(error, 'Unable to load dashboard data.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayUser = dashboard?.user || user;
  const stats = [
    { label: 'Open', count: dashboard?.stats?.open ?? 0, icon: AlertCircle, color: 'text-rose-500', bg: '!bg-rose-500/10' },
    { label: 'In-Progress', count: dashboard?.stats?.in_progress ?? 0, icon: Clock, color: 'text-amber-500', bg: '!bg-amber-500/10' },
    { label: 'Resolved', count: dashboard?.stats?.resolved ?? 0, icon: CheckCircle2, color: 'text-emerald-500', bg: '!bg-emerald-500/10' },
  ];
  const recentReports = dashboard?.recent_reports || [];
  const notifications = dashboard?.notifications || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] !bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] !bg-purple-400/10 rounded-full blur-[100px]"></div>
      </div>

      <aside className={`hidden lg:flex flex-col w-64 border-r h-full shrink-0 relative z-20 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>CivicUser</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/user/report-issue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button onClick={() => navigate('/user/notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/user/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-blue-500/10 hover:!bg-rose-500/10' : '!bg-blue-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <h1 className="text-2xl font-black tracking-tight">Citizen Dashboard</h1>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => navigate('/user/notifications')} className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
              {notifications.length ? <span className={`absolute top-2 right-2 w-2 h-2 !bg-blue-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span> : null}
            </button>

            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{displayUser?.full_name || 'Citizen'}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Citizen</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                {(displayUser?.full_name || 'CI').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight">
                  Hello, {(displayUser?.full_name || 'Citizen').split(' ')[0]}!
                </h2>
                <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Check the live status of your reports and neighborhood updates.</p>
              </div>
              <button onClick={() => navigate('/user/report-issue')} className={`px-7 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${isDark ? '!bg-blue-600 hover:!bg-blue-500 text-white shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-600/30 hover:-translate-y-0.5'}`}>
                <PlusCircle className="w-5 h-5" /> Report New Issue
              </button>
            </div>

            {errorMessage ? (
              <div className={`rounded-[2rem] border px-6 py-5 text-sm ${isDark ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {errorMessage}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => {
                const IconComp = stat.icon;
                return (
                  <div key={stat.label} className={`border p-7 rounded-[2rem] flex items-center gap-6 transition-all duration-300 group hover:-translate-y-1 backdrop-blur-xl ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20 hover:border-slate-600' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300'}`}>
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                      <p className="text-3xl font-black mt-1 tracking-tight">{stat.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {isLoading ? (
              <div className={`rounded-[2rem] border p-12 flex items-center justify-center gap-3 ${isDark ? '!bg-slate-900/60 border-slate-800' : '!bg-white border-slate-200'}`}>
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span>Loading your dashboard...</span>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black">My Recent Reports</h3>
                    <button onClick={() => navigate('/user/my-reports')} className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${isDark ? 'text-blue-400 !bg-blue-500/10 hover:!bg-blue-500/20' : 'text-blue-700 !bg-blue-50 hover:!bg-blue-100'}`}>View All</button>
                  </div>

                  <div className={`border rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? '!bg-slate-800/50 text-slate-400' : '!bg-slate-50/80 text-slate-500'}`}>
                          <tr>
                            <th className="px-8 py-5">Issue</th>
                            <th className="px-8 py-5">Location</th>
                            <th className="px-8 py-5 text-center">Status</th>
                            <th className="px-8 py-5 text-right">Time</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                          {recentReports.map((report) => (
                            <tr key={report.id} onClick={() => navigate(`/user/issue/${report.id}`)} className={`transition-colors group cursor-pointer ${isDark ? 'hover:!bg-slate-800/40' : 'hover:!bg-blue-50/50'}`}>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? '!bg-slate-800' : '!bg-slate-100 group-hover:!bg-white'}`}>
                                    {getIssueIcon(report.category)}
                                  </div>
                                  <div>
                                    <p className="font-bold">{report.category || report.title}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {report.tracking_code}</p>
                                  </div>
                                </div>
                              </td>
                              <td className={`px-8 py-6 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{report.address || 'Address unavailable'}</td>
                              <td className="px-8 py-6 text-center">
                                <StatusBadge status={report.status} />
                              </td>
                              <td className="px-8 py-6 text-right text-xs text-slate-500 font-bold">
                                <div className={`flex items-center justify-end gap-2 transition-colors ${isDark ? 'group-hover:text-slate-300' : 'group-hover:text-blue-600'}`}>
                                  {formatRelativeDate(report.created_at)} <ChevronRight className="w-4 h-4 opacity-50" />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!recentReports.length ? (
                      <div className={`px-8 py-10 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No reports yet. Submit your first issue to start tracking it here.
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black">Alerts</h3>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((note) => (
                      <div key={note.id} className={`p-6 border rounded-[2rem] transition-all duration-300 cursor-pointer backdrop-blur-xl group hover:-translate-y-1 ${isDark ? '!bg-slate-900/80 border-slate-800 hover:border-slate-600 shadow-lg shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:border-blue-200 shadow-lg shadow-slate-200/50 hover:shadow-xl'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`text-sm font-bold ${note.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>{note.title}</h4>
                          <span className="text-[10px] font-bold text-slate-500">{formatRelativeDate(note.created_at)}</span>
                        </div>
                        <p className={`text-xs leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{note.body}</p>
                      </div>
                    ))}

                    {!notifications.length ? (
                      <div className={`w-full py-6 text-center text-xs font-black uppercase tracking-[0.3em] border border-dashed rounded-[2rem] ${isDark ? 'text-slate-500 border-slate-700 !bg-slate-900/30' : 'text-slate-400 border-slate-300 !bg-slate-50/50'}`}>
                        No alerts right now
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
