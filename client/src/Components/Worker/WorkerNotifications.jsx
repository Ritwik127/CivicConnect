import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  ArrowLeft,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Check
} from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New Task Assigned', desc: 'Traffic Light Fix at Main St has been added to your queue. Priority: Critical.', time: '10 mins ago', type: 'warning', read: false },
  { id: 2, title: 'Supervisor Message', desc: 'Sarah Jenkins: "Make sure to bring the heavy-duty asphalt mix for Oxford Street."', time: '1 hour ago', type: 'info', read: false },
  { id: 3, title: 'Task Approved', desc: 'Your proof of work for TSK-9011 has been verified and the task is closed.', time: 'Yesterday', type: 'success', read: true },
  { id: 4, title: 'SLA Warning', desc: 'Task TSK-8992 (Sewer Leak) is nearing its SLA deadline. 4 hours remaining.', time: 'Yesterday', type: 'warning', read: true },
];

const WorkerNotifications = () => {
  const navigate = useNavigate();
  const [workerName] = useState("Mike Reynolds");
  const [activeTab, setActiveTab] = useState('ALL');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const handleMarkAllRead = () => { setNotifications(notifications.map(n => ({ ...n, read: true }))); };
  const handleMarkRead = (id) => { setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n)); };
  const filteredNotifications = notifications.filter(n => activeTab === 'ALL' ? true : !n.read);

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-orange-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-amber-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Worker Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 border-r h-full shrink-0 relative z-20 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => navigate('/worker/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <ListTodo className="w-5 h-5" /> My Tasks
          </button>
          <button onClick={() => navigate('/worker/communications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <MessageSquare className="w-5 h-5" /> Communications
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={() => navigate('/login')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-orange-500/10 hover:!bg-rose-500/10' : '!bg-orange-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/dashboard')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Alerts & Notifications</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : '!bg-orange-50 border-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.1)]'}`}>
              <Bell className="w-5 h-5 text-orange-500" />
              {notifications.some(n => !n.read) && (
                <span className={`absolute top-2 right-2 w-2 h-2 !bg-orange-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span>
              )}
            </button>
            
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Team Alpha</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-900/20">
                MR
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Your Alerts</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Stay updated on dispatches and supervisor notes.</p>
              </div>
              
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                {['ALL', 'UNREAD'].map((f) => (
                  <button 
                    key={f} onClick={() => setActiveTab(f)} 
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
                      activeTab === f 
                        ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-slate-100 text-slate-900 shadow-sm') 
                        : (isDark ? '!bg-transparent text-slate-500 hover:text-slate-300 hover:!bg-slate-800/50' : '!bg-transparent text-slate-500 hover:text-slate-700 hover:!bg-slate-50')
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Showing {filteredNotifications.length} items
              </span>
              <button onClick={handleMarkAllRead} className={`text-xs font-bold transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? 'text-orange-400 hover:text-white !bg-slate-800' : 'text-orange-600 hover:text-orange-800 !bg-orange-50 hover:!bg-orange-100'}`}>
                <Check className="w-4 h-4" /> Mark all as read
              </button>
            </div>

            <div className="space-y-4">
              {filteredNotifications.map((note) => {
                const Icon = note.type === 'success' ? CheckCircle2 : note.type === 'warning' ? AlertCircle : Info;
                const colorClass = note.type === 'success' ? 'text-emerald-500' : note.type === 'warning' ? 'text-rose-500' : 'text-blue-500';
                const bgClass = note.type === 'success' ? '!bg-emerald-500/10' : note.type === 'warning' ? '!bg-rose-500/10' : '!bg-blue-500/10';

                return (
                  <div key={note.id} onClick={() => handleMarkRead(note.id)} className={`relative p-6 border rounded-[2rem] transition-all duration-300 cursor-pointer group backdrop-blur-xl ${!note.read ? (isDark ? 'border-orange-500/30 shadow-lg shadow-orange-900/10 !bg-slate-900/80 hover:!bg-slate-900' : 'border-orange-300 shadow-lg shadow-orange-100 !bg-white/90 hover:!bg-white') : (isDark ? '!bg-slate-900/40 border-slate-800 hover:!bg-slate-900/80' : '!bg-white/60 border-slate-200/60 hover:!bg-white hover:border-slate-300 shadow-sm')}`}>
                    {!note.read && (
                      <div className="absolute top-6 left-6 w-2 h-2 rounded-full !bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                    )}
                    
                    <div className="flex items-start gap-6 pl-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className={`font-bold text-lg ${!note.read ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
                            {note.title}
                          </h3>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" /> {note.time}
                          </span>
                        </div>
                        <p className={`leading-relaxed text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {note.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredNotifications.length === 0 && (
                <div className={`text-center py-24 rounded-[2.5rem] border border-dashed backdrop-blur-xl ${isDark ? '!bg-slate-900/30 border-slate-800' : '!bg-white/50 border-slate-300'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? '!bg-slate-800' : '!bg-slate-100'}`}>
                    <CheckCircle2 className={`w-8 h-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                  <p className={`font-bold text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>You're all caught up!</p>
                  <p className="text-slate-500 text-sm mt-1">No new notifications right now.</p>
                </div>
              )}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerNotifications;