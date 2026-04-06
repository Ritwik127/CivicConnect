import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  LayoutDashboard,
  ListTodo,
  Loader2,
  LogOut,
  MapPin,
  MessageSquare,
  Moon,
  Settings,
  Sun,
} from 'lucide-react';
import { fetchWorkerTasks, getReadableErrorMessage } from '../../lib/api';
import { useAuth } from '../../lib/auth';

function formatLabel(value) {
  return String(value || '').replaceAll('_', ' ');
}

function formatDateTime(value) {
  if (!value) return 'No deadline';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function initialsFor(name) {
  return String(name || 'CW')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const priorityClasses = {
  critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const priorityRank = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const MyTasks = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;
    async function loadTasks() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchWorkerTasks();
        if (isActive) setTasks(data || []);
      } catch (error) {
        if (isActive) setErrorMessage(getReadableErrorMessage(error, 'Unable to load worker tasks.'));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadTasks();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((left, right) => {
      const leftPriority = priorityRank[String(left.priority || 'medium').toLowerCase()] ?? 99;
      const rightPriority = priorityRank[String(right.priority || 'medium').toLowerCase()] ?? 99;
      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      const leftDue = left.due_at ? new Date(left.due_at).getTime() : Number.MAX_SAFE_INTEGER;
      const rightDue = right.due_at ? new Date(right.due_at).getTime() : Number.MAX_SAFE_INTEGER;
      return leftDue - rightDue;
    });

    if (filter === 'ALL') return sortedTasks;
    if (filter === 'PENDING') return sortedTasks.filter((task) => ['assigned', 'in_progress', 'submitted'].includes(task.status));
    if (filter === 'RESOLVED') return sortedTasks.filter((task) => task.status === 'resolved');
    return sortedTasks;
  }, [filter, tasks]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'worker' } });
  };

  const workerName = user?.full_name || 'Worker';
  const workerInitials = initialsFor(workerName);

  return (
    <div className={`flex min-h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <aside className={`hidden lg:flex flex-col w-64 border-r h-screen shrink-0 relative z-20 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30"><span className="font-bold text-xl text-white">C</span></div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => navigate('/worker/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:text-white hover:!bg-slate-800/80' : '!bg-orange-50 text-slate-600 hover:text-orange-700 hover:!bg-white hover:shadow-sm'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}><ListTodo className="w-5 h-5" /> My Tasks</button>
          <button onClick={() => navigate('/worker/communications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:text-white hover:!bg-slate-800/80' : '!bg-orange-50 text-slate-600 hover:text-orange-700 hover:!bg-white hover:shadow-sm'}`}><MessageSquare className="w-5 h-5" /> Communications</button>
        </nav>
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:text-white hover:!bg-slate-800/80' : '!bg-orange-50 text-slate-600 hover:text-orange-700 hover:!bg-white hover:shadow-sm'}`}><Settings className="w-5 h-5" /> Settings</button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-rose-500 ${isDark ? '!bg-orange-500/10 hover:!bg-rose-500/10' : '!bg-orange-50 hover:!bg-rose-50 hover:shadow-sm'}`}><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/dashboard')} className={`lg:hidden p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 text-slate-400 border-slate-700' : '!bg-slate-100 text-slate-600 border-slate-200'}`}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Task Queue</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => navigate('/worker/notifications')} className={`p-2.5 rounded-xl border shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}><Bell className="w-5 h-5" /></button>
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.department || 'Worker'}</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-900/20">{workerInitials}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">My Tasks</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your live field assignments.</p>
              </div>
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                {['ALL', 'PENDING', 'RESOLVED'].map((item) => (
                  <button key={item} onClick={() => setFilter(item)} className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${filter === item ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-slate-100 text-slate-900 shadow-sm') : 'text-slate-500'}`}>{item}</button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className={`border rounded-[2.5rem] p-12 flex items-center justify-center gap-3 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60'}`}><Loader2 className="w-5 h-5 animate-spin text-orange-500" /><span className="font-medium">Loading tasks...</span></div>
            ) : errorMessage ? (
              <div className={`border rounded-[2.5rem] p-8 flex items-start gap-3 ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}><AlertCircle className="w-5 h-5 mt-0.5" /><div><p className="font-bold">Unable to load tasks</p><p className="text-sm mt-1">{errorMessage}</p></div></div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task) => {
                  const issue = task.issue || {};
                  const priorityKey = String(task.priority || 'medium').toLowerCase();
                  return (
                    <button key={task.task_code} onClick={() => navigate(`/worker/taskdetails/${task.task_code}`)} className={`w-full border p-6 rounded-[2rem] text-left transition-all duration-300 group ${isDark ? '!bg-slate-900/80 border-slate-800 hover:!bg-slate-800 hover:border-slate-600 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:!bg-white hover:border-orange-300 shadow-lg shadow-slate-200/50 hover:shadow-xl'}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${task.status === 'resolved' ? '!bg-emerald-500/10 text-emerald-500' : '!bg-orange-500/10 text-orange-500'}`}>{task.status === 'resolved' ? <CheckCircle2 className="w-7 h-7" /> : <Activity className="w-7 h-7" />}</div>
                          <div>
                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                              <h3 className="font-bold text-xl">{issue.title || task.issue_title || task.title}</h3>
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {issue.category || task.issue_category || 'General'}
                              </span>
                              <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${priorityClasses[priorityKey] || priorityClasses.medium}`}>{formatLabel(task.priority)}</span>
                            </div>
                            <div className={`flex flex-wrap items-center gap-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              <span className="flex items-center gap-1.5 font-bold"><MapPin className="w-4 h-4" /> {issue.address || 'No address provided'}</span>
                              <span className="flex items-center gap-1.5">{issue.latitude && issue.longitude ? `${issue.latitude}, ${issue.longitude}` : 'Coordinates not available'}</span>
                              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {formatLabel(task.status)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6 md:w-72">
                          <div className="flex flex-col items-start md:items-end">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Due</span>
                            <span className={`text-sm font-bold flex items-center gap-1.5 ${task.status === 'resolved' ? 'text-emerald-500' : (isDark ? 'text-amber-400' : 'text-amber-600')}`}><Clock className="w-3.5 h-3.5" /> {formatDateTime(task.due_at)}</span>
                          </div>
                          <span className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-md ${isDark ? '!bg-slate-800/80 text-slate-400 group-hover:!bg-orange-600 group-hover:text-white' : '!bg-slate-100 text-slate-600 group-hover:!bg-orange-600 group-hover:text-white'}`}><ChevronRight className="w-5 h-5" /></span>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {!filteredTasks.length ? (
                  <div className={`text-center py-24 rounded-[2.5rem] border border-dashed ${isDark ? '!bg-slate-900/30 border-slate-800 text-slate-400' : '!bg-white/50 border-slate-300 text-slate-500'}`}><Filter className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} /><p className="font-bold text-lg">No tasks match this filter.</p></div>
                ) : null}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTasks;
