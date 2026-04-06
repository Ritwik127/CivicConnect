import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Info,
  LayoutDashboard,
  ListTodo,
  Loader2,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';
import { fetchWorkerNotifications, getReadableErrorMessage } from '../../lib/api';
import { useAuth } from '../../lib/auth';

function initialsFor(name) {
  return String(name || 'CW').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function formatDateTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

const WorkerNotifications = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ALL');
  const [notifications, setNotifications] = useState([]);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;
    async function loadNotifications() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchWorkerNotifications();
        if (isActive) setNotifications((data || []).map((item) => ({ ...item, read: item.is_read })));
      } catch (error) {
        if (isActive) setErrorMessage(getReadableErrorMessage(error, 'Unable to load notifications.'));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadNotifications();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredNotifications = useMemo(() => notifications.filter((item) => (activeTab === 'ALL' ? true : !item.read)), [activeTab, notifications]);

  const handleMarkRead = (id) => setNotifications((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const handleMarkAllRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'worker' } });
  };

  const workerName = user?.full_name || 'Worker';
  const workerInitials = initialsFor(workerName);

  return (
    <div className={`flex min-h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <aside className={`hidden lg:flex flex-col w-64 border-r h-screen shrink-0 relative z-20 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30"><span className="font-bold text-xl text-white">C</span></div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/worker/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><ListTodo className="w-5 h-5" /> My Tasks</button>
          <button onClick={() => navigate('/worker/communications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><MessageSquare className="w-5 h-5" /> Communications</button>
        </nav>
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Settings className="w-5 h-5" /> Settings</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-rose-500"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/dashboard')} className={`lg:hidden p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 text-slate-400 border-slate-700' : '!bg-slate-100 text-slate-600 border-slate-200'}`}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Alerts & Notifications</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button className={`p-2.5 rounded-xl border relative ${isDark ? '!bg-slate-800/50 border-orange-500/50' : '!bg-orange-50 border-orange-200'}`}><Bell className="w-5 h-5 text-orange-500" /></button>
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.department || 'Worker'}</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white">{workerInitials}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Your Alerts</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loaded from your live worker notifications feed.</p>
              </div>
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                {['ALL', 'UNREAD'].map((item) => (
                  <button key={item} onClick={() => setActiveTab(item)} className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase ${activeTab === item ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-slate-100 text-slate-900 shadow-sm') : 'text-slate-500'}`}>{item}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Showing {filteredNotifications.length} items</span>
              <button onClick={handleMarkAllRead} className={`text-xs font-bold flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'text-orange-400 !bg-slate-800' : 'text-orange-600 !bg-orange-50'}`}><Check className="w-4 h-4" /> Mark all as read</button>
            </div>

            {isLoading ? (
              <div className={`border rounded-[2.5rem] p-12 flex items-center justify-center gap-3 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60'}`}><Loader2 className="w-5 h-5 animate-spin text-orange-500" /><span className="font-medium">Loading notifications...</span></div>
            ) : errorMessage ? (
              <div className={`border rounded-[2.5rem] p-8 flex items-start gap-3 ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}><AlertCircle className="w-5 h-5 mt-0.5" /><div><p className="font-bold">Unable to load notifications</p><p className="text-sm mt-1">{errorMessage}</p></div></div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((note) => {
                  const Icon = note.type === 'success' ? CheckCircle2 : note.type === 'warning' ? AlertCircle : Info;
                  const colorClass = note.type === 'success' ? 'text-emerald-500' : note.type === 'warning' ? 'text-rose-500' : 'text-blue-500';
                  const bgClass = note.type === 'success' ? '!bg-emerald-500/10' : note.type === 'warning' ? '!bg-rose-500/10' : '!bg-blue-500/10';
                  return (
                    <div key={note.id} onClick={() => handleMarkRead(note.id)} className={`relative p-6 border rounded-[2rem] cursor-pointer ${!note.read ? (isDark ? 'border-orange-500/30 !bg-slate-900/80' : 'border-orange-300 !bg-white/90') : (isDark ? '!bg-slate-900/40 border-slate-800' : '!bg-white/60 border-slate-200/60 shadow-sm')}`}>
                      {!note.read ? <div className="absolute top-6 left-6 w-2 h-2 rounded-full !bg-orange-500"></div> : null}
                      <div className="flex items-start gap-6 pl-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}><Icon className="w-6 h-6" /></div>
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="font-bold text-lg">{note.title}</h3>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> {formatDateTime(note.created_at)}</span>
                          </div>
                          <p className={`leading-relaxed text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{note.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {!filteredNotifications.length ? (
                  <div className={`text-center py-24 rounded-[2.5rem] border border-dashed ${isDark ? '!bg-slate-900/30 border-slate-800 text-slate-400' : '!bg-white/50 border-slate-300 text-slate-500'}`}><CheckCircle2 className={`w-8 h-8 mx-auto mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} /><p className="font-bold text-lg">You're all caught up!</p></div>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerNotifications;
