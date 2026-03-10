import React, { useState, useEffect } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  MapPin, 
  Clock,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  HardHat,
  Camera,
  Activity,
  Sun,
  Moon
} from 'lucide-react';

const MOCK_TASKS = [
  { 
    id: 'TSK-9042', 
    issueId: 'ISS-9042',
    category: 'Pothole Repair', 
    location: 'Oxford Street, Downtown', 
    priority: 'High', 
    status: 'ASSIGNED', 
    slaDeadline: 'Today, 2:00 PM',
    distance: '1.2 km away'
  },
  { 
    id: 'TSK-9045', 
    issueId: 'ISS-9045',
    category: 'Traffic Light Fix', 
    location: 'Main St & 5th Ave', 
    priority: 'Critical', 
    status: 'IN-PROGRESS', 
    slaDeadline: 'Today, 12:30 PM',
    distance: '0.8 km away'
  },
  { 
    id: 'TSK-9011', 
    issueId: 'ISS-9011',
    category: 'Fallen Tree Removal', 
    location: 'Central Park North', 
    priority: 'Medium', 
    status: 'RESOLVED', 
    slaDeadline: 'Completed',
    distance: '3.5 km away'
  },
];

const PriorityBadge = ({ priority, isDark }) => {
  const styles = {
    'Critical': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    'High': '!bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'Medium': '!bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    'Low': '!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };
  return <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border shadow-sm ${styles[priority] || styles['Medium']}`}>{priority}</span>;
};

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [workerName] = useState("Mike Reynolds");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const activeTasksCount = MOCK_TASKS.filter(t => t.status !== 'RESOLVED').length;

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds (Orange theme for Worker) */}
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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}>
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
            <h1 className="text-2xl font-black tracking-tight sm:block">Field Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => navigate('/worker/notifications')} className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
              <span className={`absolute top-2 right-2 w-2 h-2 !bg-orange-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span>
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
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Top Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Today's Schedule</h2>
                <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>You have {activeTasksCount} active tasks requiring your attention.</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={`border p-6 rounded-[2rem] flex items-center gap-6 transition-all duration-300 group hover:-translate-y-1 backdrop-blur-xl ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20 hover:border-slate-600' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300'}`}>
                <div className={`w-14 h-14 !bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <HardHat className="w-7 h-7" />
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Tasks</p>
                  <p className="text-3xl font-black mt-1 tracking-tight">{activeTasksCount}</p>
                </div>
              </div>

              <div className={`border p-6 rounded-[2rem] flex items-center gap-6 transition-all duration-300 group hover:-translate-y-1 backdrop-blur-xl ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20 hover:border-slate-600' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300'}`}>
                <div className={`w-14 h-14 !bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <p className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Resolved Today</p>
                  <p className="text-3xl font-black mt-1 tracking-tight">1</p>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-6">
              <h3 className="text-xl font-black tracking-tight">Assigned Tasks</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {MOCK_TASKS.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => navigate(`/worker/taskdetails/${task.id}`)}
                    className={`border p-6 rounded-[2rem] transition-all duration-300 cursor-pointer group backdrop-blur-xl hover:-translate-y-1 ${isDark ? '!bg-slate-900/80 border-slate-800 hover:!bg-slate-800 hover:border-slate-600 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:!bg-white hover:border-orange-300 shadow-lg shadow-slate-200/50 hover:shadow-xl'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      <div className="flex items-start md:items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                          task.status === 'RESOLVED' ? '!bg-emerald-500/10 text-emerald-500' : '!bg-orange-500/10 text-orange-500'
                        }`}>
                          {task.status === 'RESOLVED' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">{task.category}</h3>
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{task.id}</span>
                            <PriorityBadge priority={task.priority} isDark={isDark} />
                          </div>
                          <div className={`flex flex-wrap items-center gap-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {task.location}</span>
                            {task.status !== 'RESOLVED' && (
                              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {task.distance}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 md:w-64 pl-14 md:pl-0">
                        <div className="flex flex-col items-start md:items-end">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SLA Deadline</span>
                          <span className={`text-sm font-bold flex items-center gap-1.5 ${task.status === 'RESOLVED' ? 'text-emerald-500' : (isDark ? 'text-amber-400' : 'text-amber-600')}`}>
                            <Clock className="w-3.5 h-3.5" /> {task.slaDeadline}
                          </span>
                        </div>
                        <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md group-hover:!bg-orange-600 group-hover:text-white ${isDark ? '!bg-slate-800/80 text-slate-400' : '!bg-slate-100 text-slate-600'}`}>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Bell className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} /> Recent Alerts
              </h3>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold text-sm ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>New Task Assigned</h4>
                    <span className="text-[10px] font-bold text-slate-500">10 mins ago</span>
                  </div>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Traffic Light Fix at Main St has been added to your queue. Priority: Critical.</p>
                </div>
                
                <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-bold text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Supervisor Message</h4>
                    <span className="text-[10px] font-bold text-slate-500">1 hour ago</span>
                  </div>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>"Make sure to bring the heavy-duty asphalt mix for the Oxford Street pothole."</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;