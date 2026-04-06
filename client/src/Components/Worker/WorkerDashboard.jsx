import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  HardHat,
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
import {
  fetchWorkerDashboard,
  fetchWorkerNotifications,
  getReadableErrorMessage,
} from '../../lib/api';
import { useAuth } from '../../lib/auth';

function formatPriority(priority) {
  return String(priority || 'medium').replaceAll('_', ' ');
}

function formatStatus(status) {
  return String(status || 'assigned').replaceAll('_', ' ');
}

function formatDateTime(value) {
  if (!value) {
    return 'No deadline';
  }
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

const notificationClasses = {
  success: 'text-emerald-500',
  warning: 'text-orange-500',
  critical: 'text-rose-500',
  info: 'text-blue-500',
};

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [dashboard, setDashboard] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const [dashboardData, notificationData] = await Promise.all([
          fetchWorkerDashboard(),
          fetchWorkerNotifications(),
        ]);
        if (!isActive) {
          return;
        }
        setDashboard(dashboardData);
        setNotifications(notificationData || []);
      } catch (error) {
        if (isActive) {
          setErrorMessage(getReadableErrorMessage(error, 'Unable to load worker dashboard.'));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const worker = dashboard?.profile_summary || dashboard?.worker || user;
  const workerName = worker?.full_name || 'Worker';
  const workerInitials = useMemo(() => initialsFor(workerName), [workerName]);
  const tasks = dashboard?.tasks || [];
  const stats = dashboard?.task_stats || dashboard?.stats || {};
  const unreadCount =
    typeof dashboard?.notification_count === 'number'
      ? dashboard.notification_count
      : notifications.filter((notification) => !notification.is_read).length;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'worker' } });
  };

  return (
    <div className={`flex min-h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-orange-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-amber-400/10 rounded-full blur-[100px]"></div>
      </div>

      <aside className={`hidden lg:flex flex-col w-64 border-r h-screen shrink-0 relative z-20 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:text-white hover:!bg-slate-800/80' : '!bg-orange-50 text-slate-600 hover:text-orange-700 hover:!bg-white hover:shadow-sm'}`}>
            <ListTodo className="w-5 h-5" /> My Tasks
          </button>
          <button onClick={() => navigate('/worker/communications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:text-white hover:!bg-slate-800/80' : '!bg-orange-50 text-slate-600 hover:text-orange-700 hover:!bg-white hover:shadow-sm'}`}>
            <MessageSquare className="w-5 h-5" /> Communications
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:text-white hover:!bg-slate-800/80' : '!bg-orange-50 text-slate-600 hover:text-orange-700 hover:!bg-white hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-rose-500 ${isDark ? '!bg-orange-500/10 hover:!bg-rose-500/10' : '!bg-orange-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <h1 className="text-2xl font-black tracking-tight">Field Dashboard</h1>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => navigate('/worker/notifications')} className={`p-2.5 rounded-xl border relative shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
              {unreadCount > 0 ? (
                <span className={`absolute top-2 right-2 min-w-[1rem] h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center bg-orange-500 text-white ${isDark ? 'border-[#0f172a]' : 'border-white'}`}>
                  {unreadCount}
                </span>
              ) : null}
            </button>
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{worker?.department || worker?.role || 'Worker'}</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-900/20">
                {workerInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            {isLoading ? (
              <div className={`border rounded-[2.5rem] p-12 flex items-center justify-center gap-3 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60'}`}>
                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                <span className="font-medium">Loading worker dashboard...</span>
              </div>
            ) : errorMessage ? (
              <div className={`border rounded-[2.5rem] p-8 flex items-start gap-3 ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-bold">Unable to load dashboard</p>
                  <p className="text-sm mt-1">{errorMessage}</p>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-3xl font-black tracking-tight">Today's Schedule</h2>
                  <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    You have {stats.active || stats.in_progress || 0} active tasks, {stats.overdue || 0} overdue, and {stats.completed_today || 0} completed today.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Active', value: stats.active || 0, icon: HardHat, color: 'text-orange-500' },
                    { label: 'Overdue', value: stats.overdue || 0, icon: Activity, color: 'text-blue-500' },
                    { label: 'Completed Today', value: stats.completed_today || 0, icon: CheckCircle2, color: 'text-emerald-500' },
                  ].map((item) => (
                    <div key={item.label} className={`border p-6 rounded-[2rem] flex items-center gap-6 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 ${item.color}`}>
                        <item.icon className="w-7 h-7" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</p>
                        <p className="text-3xl font-black mt-1 tracking-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight">Assigned Tasks</h3>
                    <button onClick={() => navigate('/worker/tasks')} className={`text-sm font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                      View all
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {tasks.length ? (
                      tasks.map((task) => {
                        const issue = task.issue || {};
                        const priorityKey = String(task.priority || 'medium').toLowerCase();
                        return (
                          <button
                            key={task.task_code}
                            onClick={() => navigate(`/worker/taskdetails/${task.task_code}`)}
                            className={`border p-6 rounded-[2rem] text-left transition-all duration-300 group ${isDark ? '!bg-slate-900/80 border-slate-800 hover:!bg-slate-800 hover:border-slate-600 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:!bg-white hover:border-orange-300 shadow-lg shadow-slate-200/50 hover:shadow-xl'}`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="flex items-start gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${task.status === 'resolved' ? '!bg-emerald-500/10 text-emerald-500' : '!bg-orange-500/10 text-orange-500'}`}>
                                  {task.status === 'resolved' ? <CheckCircle2 className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h3 className="font-bold text-lg">{issue.title || task.issue_title || task.title}</h3>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                      {issue.category || task.issue_category || 'General'}
                                    </span>
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{task.task_code}</span>
                                    <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${priorityClasses[priorityKey] || priorityClasses.medium}`}>
                                      {formatPriority(task.priority)}
                                    </span>
                                  </div>
                                  <div className={`flex flex-wrap items-center gap-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {issue.address || 'No address'}</span>
                                    <span className="flex items-center gap-1.5">{issue.latitude && issue.longitude ? `${issue.latitude}, ${issue.longitude}` : 'Coordinates not available'}</span>
                                    <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {formatStatus(task.status)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between md:justify-end gap-6 md:w-72">
                                <div className="flex flex-col items-start md:items-end">
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Due</span>
                                  <span className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                    <Clock className="w-3.5 h-3.5" /> {formatDateTime(task.due_at)}
                                  </span>
                                </div>
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? '!bg-slate-800/80 text-slate-400 group-hover:!bg-orange-600 group-hover:text-white' : '!bg-slate-100 text-slate-600 group-hover:!bg-orange-600 group-hover:text-white'}`}>
                                  <ChevronRight className="w-5 h-5" />
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className={`border rounded-[2rem] p-10 text-center ${isDark ? '!bg-slate-900/50 border-slate-800 text-slate-400' : '!bg-white/70 border-slate-200/60 text-slate-500'}`}>
                        No tasks assigned yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className={`border rounded-[2.5rem] p-8 shadow-xl ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Bell className={`${isDark ? 'text-orange-400' : 'text-orange-600'} w-5 h-5`} /> Recent Alerts
                  </h3>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((note) => (
                      <div key={note.id} className={`p-4 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-1 gap-4">
                          <h4 className={`font-bold text-sm ${notificationClasses[note.type] || 'text-blue-500'}`}>{note.title}</h4>
                          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{formatDateTime(note.created_at)}</span>
                        </div>
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{note.body}</p>
                      </div>
                    ))}
                    {!notifications.length ? (
                      <div className={`p-4 rounded-2xl border text-sm ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-400' : '!bg-slate-50/80 border-slate-200 text-slate-500'}`}>
                        No notifications yet.
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;
