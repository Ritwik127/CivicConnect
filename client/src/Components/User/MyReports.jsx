import React, { useState, useEffect } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  PlusCircle, MapPin, Calendar, ChevronRight, Filter, AlertTriangle, 
  Camera, AlertCircle, LayoutDashboard, FileText, Bell, Settings, 
  LogOut, ArrowLeft, Sun, Moon
} from 'lucide-react';

const MOCK_REPORTS = [
  { id: 'R-8429', category: 'Pothole', location: 'Oxford Street, Downtown', status: 'IN-PROGRESS', date: 'Oct 24, 2026' },
  { id: 'R-8425', category: 'Garbage', location: 'Park Avenue, Near Gate 3', status: 'OPEN', date: 'Oct 23, 2026' },
  { id: 'R-8412', category: 'Streetlight', location: 'Baker St, Block C', status: 'RESOLVED', date: 'Oct 20, 2026' },
];

const CATEGORY_ICONS = {
  'Pothole': { icon: AlertTriangle, color: 'text-orange-500', bg: '!bg-orange-500/10' },
  'Garbage': { icon: Camera, color: 'text-emerald-500', bg: '!bg-emerald-500/10' },
  'Streetlight': { icon: AlertCircle, color: 'text-yellow-500', bg: '!bg-yellow-500/10' },
};

const StatusBadge = ({ status }) => {
  const styles = {
    'RESOLVED': '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'IN-PROGRESS': '!bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'OPEN': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };
  return (
    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest border opacity-90 ${styles[status] || styles['OPEN']}`}>
      {status}
    </span>
  );
};

const MyReports = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [userName] = useState("John Doe");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const filteredReports = MOCK_REPORTS.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-orange-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar */}
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
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left transition-all ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
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
          <button onClick={() => navigate('/login')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-blue-500/10 hover:!bg-rose-500/10' : '!bg-blue-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/user/dashboard')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">My Reports</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => navigate('/user/notifications')} className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
              <span className={`absolute top-2 right-2 w-2 h-2 !bg-blue-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span>
            </button>
            
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Citizen</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Reports</h2>
                <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Track the status of your submitted civic issues.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/user/dashboard')} className={`px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:-translate-y-0.5 ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-white border border-slate-200/60 hover:!bg-slate-50 text-slate-700'}`}>
                  Dashboard
                </button>
                <button onClick={() => navigate('/user/report-issue')} className={`px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-blue-600 hover:!bg-blue-500 text-white shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-600/30'}`}>
                  <PlusCircle className="w-5 h-5" /> New Report
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl w-max border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
              {['ALL', 'OPEN', 'IN-PROGRESS', 'RESOLVED'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${filter === f ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-blue-100 text-slate-900 shadow-sm') : (isDark ? '!bg-slate-800 text-slate-500 hover:text-slate-300 hover:!bg-slate-800/50' : '!bg-slate-100 text-slate-500 hover:text-slate-700 hover:!bg-slate-50')}`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => {
                const CatStyle = CATEGORY_ICONS[report.category] || CATEGORY_ICONS['Pothole'];
                const Icon = CatStyle.icon;
                
                return (
                  <div key={report.id} onClick={() => navigate(`/user/issue/${report.id}`)} className={`border p-6 rounded-[2rem] transition-all duration-300 cursor-pointer group backdrop-blur-xl hover:-translate-y-1 ${isDark ? '!bg-slate-900/80 border-slate-800 hover:!bg-slate-800 hover:border-slate-600 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:!bg-white hover:border-blue-300 shadow-lg shadow-slate-200/50 hover:shadow-xl'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start md:items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${CatStyle.bg} ${CatStyle.color}`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg">{report.category}</h3>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {report.id}</span>
                          </div>
                          <div className={`flex flex-wrap items-center gap-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {report.location}</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {report.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 md:w-64 pl-14 md:pl-0">
                        <StatusBadge status={report.status} />
                        <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md group-hover:!bg-blue-600 group-hover:text-white ${isDark ? '!bg-slate-800/80 text-slate-400' : '!bg-slate-100 text-slate-600'}`}>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Empty State */}
              {filteredReports.length === 0 && (
                <div className={`text-center py-24 rounded-[2.5rem] border border-dashed backdrop-blur-xl ${isDark ? '!bg-slate-900/30 border-slate-800' : '!bg-white/50 border-slate-300'}`}>
                  <Filter className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className={`font-bold text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No reports found for "{filter}".</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyReports;