import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Check,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';
import { fetchUserNotifications, getReadableErrorMessage } from '../../lib/api';
import { useAuth } from '../../lib/auth';

function formatRelativeDate(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.round(diffMinutes / 60)}h ago`;
  if (diffMinutes < 10080) return `${Math.round(diffMinutes / 1440)}d ago`;
  return date.toLocaleDateString();
}

function getNotificationTone(type) {
  const normalized = String(type || '').toLowerCase();
  if (normalized.includes('success') || normalized.includes('resolved')) return 'success';
  if (normalized.includes('warning') || normalized.includes('urgent')) return 'warning';
  return 'info';
}

const Notifications = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ALL');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;

    async function loadNotifications() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchUserNotifications();
        if (isActive) {
          setNotifications(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(getReadableErrorMessage(error, 'Unable to load your notifications.'));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'citizen' } });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, is_read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((note) => (note.id === id ? { ...note, is_read: true } : note)),
    );
  };

  const filteredNotifications = notifications.filter((note) =>
    activeTab === 'ALL' ? true : !note.is_read,
  );

  const userName = user?.full_name || 'Citizen';
  const initials = useMemo(
    () =>
      userName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [userName],
  );

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-orange-400/10 rounded-full blur-[100px]"></div>
      </div>

      <aside className={`hidden lg:flex flex-col w-64 border-r h-full shrink-0 relative z-20 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>CivicUser</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/user/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/user/report-issue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button onClick={() => navigate('/user/notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left transition-all ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
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
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/user/dashboard')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : '!bg-blue-50 border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.1)]'}`}>
              <Bell className="w-5 h-5 text-blue-500" />
              {notifications.some((note) => !note.is_read) ? (
                <span className={`absolute top-2 right-2 w-2 h-2 !bg-blue-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span>
              ) : null}
            </button>

            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Citizen</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                {initials || 'CU'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {errorMessage ? (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Your Alerts</h2>
                <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stay updated on your reports and neighborhood issues.</p>
              </div>

              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                {['ALL', 'UNREAD'].map((f) => (
                  <button key={f} onClick={() => setActiveTab(f)} className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeTab === f ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-blue-100 text-slate-900 shadow-sm') : (isDark ? '!bg-slate-800 text-slate-500 hover:text-slate-300 hover:!bg-slate-800/50' : '!bg-slate-100 text-slate-500 hover:text-slate-700 hover:!bg-slate-50')}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Showing {filteredNotifications.length} items
              </span>
              <button onClick={handleMarkAllRead} disabled={!notifications.some((note) => !note.is_read)} className={`text-xs font-bold transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg disabled:opacity-50 ${isDark ? 'text-blue-400 hover:text-white !bg-slate-800' : 'text-blue-600 hover:text-blue-800 !bg-blue-50 hover:!bg-blue-100'}`}>
                <Check className="w-4 h-4" /> Mark all as read
              </button>
            </div>

            {isLoading ? (
              <div className="py-16 flex items-center justify-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading notifications...
              </div>
            ) : null}

            {!isLoading ? (
              <div className="space-y-4">
                {filteredNotifications.map((note) => {
                  const tone = getNotificationTone(note.type);
                  const Icon = tone === 'success' ? CheckCircle2 : tone === 'warning' ? AlertCircle : Info;
                  const colorClass = tone === 'success' ? 'text-emerald-500' : tone === 'warning' ? 'text-rose-500' : 'text-blue-500';
                  const bgClass = tone === 'success' ? '!bg-emerald-500/10' : tone === 'warning' ? '!bg-rose-500/10' : '!bg-blue-500/10';

                  return (
                    <div key={note.id} onClick={() => handleMarkRead(note.id)} className={`relative p-6 border rounded-[2rem] transition-all duration-300 cursor-pointer group backdrop-blur-xl ${!note.is_read ? (isDark ? 'border-blue-500/30 shadow-lg shadow-blue-900/10 !bg-slate-900/80 hover:!bg-slate-900' : 'border-blue-300 shadow-lg shadow-blue-100 !bg-white/90 hover:!bg-white') : (isDark ? '!bg-slate-900/40 border-slate-800 hover:!bg-slate-900/80' : '!bg-white/60 border-slate-200/60 hover:!bg-white hover:border-slate-300 shadow-sm')}`}>
                      {!note.is_read ? (
                        <div className="absolute top-6 left-6 w-2 h-2 rounded-full !bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                      ) : null}

                      <div className="flex items-start gap-6 pl-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className={`font-bold text-lg ${!note.is_read ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
                              {note.title}
                            </h3>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Clock className="w-3.5 h-3.5" /> {formatRelativeDate(note.created_at)}
                            </span>
                          </div>
                          <p className={`leading-relaxed text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {note.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {!filteredNotifications.length ? (
                  <div className={`text-center py-24 rounded-[2.5rem] border border-dashed backdrop-blur-xl ${isDark ? '!bg-slate-900/30 border-slate-800' : '!bg-white/50 border-slate-300'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? '!bg-slate-800' : '!bg-slate-100'}`}>
                      <CheckCircle2 className={`w-8 h-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    </div>
                    <p className={`font-bold text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>You're all caught up!</p>
                    <p className="text-slate-500 text-sm mt-1">No new notifications right now.</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
