import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Building2, MessageSquare, Image as ImageIcon,
  AlertTriangle, Camera, AlertCircle, CheckCircle2, LayoutDashboard,
  PlusCircle, FileText, Bell, Settings, LogOut, Sun, Moon
} from 'lucide-react';

const MOCK_REPORTS = [
  { id: 'R-8429', category: 'Pothole', location: 'Oxford Street, Downtown', status: 'IN-PROGRESS', date: 'Oct 24, 2026', desc: 'Large pothole in the middle lane causing significant traffic slowdowns. It has grown larger after the recent rain.', dept: 'Roads & Transport Dept', assignedTo: 'Field Team Alpha', updates: [{ date: 'Oct 24, 10:00 AM', msg: 'Issue reported by citizen.' }, { date: 'Oct 24, 11:30 AM', msg: 'Under review by Roads Department.' }, { date: 'Oct 24, 01:15 PM', msg: 'Field Worker (Team Alpha) dispatched to location for inspection.' }] }
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
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border opacity-90 ${styles[status] || styles['OPEN']}`}>
      {status}
    </span>
  );
};

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const issue = MOCK_REPORTS.find(r => r.id === id) || MOCK_REPORTS[0];
  const CatStyle = CATEGORY_ICONS[issue.category] || CATEGORY_ICONS['Pothole'];
  const MainIcon = CatStyle.icon;
  const statusMap = { 'OPEN': 0, 'IN-PROGRESS': 1, 'RESOLVED': 2 };
  const currentStepIdx = statusMap[issue.status] ?? 0;

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
            <button onClick={() => navigate('/user/my-reports')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Issue Details</h1>
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
          <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* Contextual Nav */}
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/user/my-reports')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl group transition-all border shadow-sm ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700 hover:border-slate-500' : '!bg-white text-slate-600 hover:text-blue-700 border-slate-200 hover:border-blue-300'}`}>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Back to Reports</span>
              </button>
              <button onClick={() => navigate('/user/dashboard')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? '!bg-blue-500/10 text-slate-500 hover:text-white' : '!bg-blue-50 text-slate-500 hover:text-slate-900'}`}>
                Citizen Dashboard
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className={`border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-xl shadow-slate-200/50'}`}>
                  
                  <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 pb-8 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${CatStyle.bg} ${CatStyle.color}`}>
                        <MainIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-black tracking-tight">{issue.category} Issue</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                          Report ID: <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{issue.id}</span>
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Location Address</p>
                      <p className={`font-bold flex items-center gap-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><MapPin className="w-5 h-5 text-blue-500" /> {issue.location}</p>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Reported On</p>
                      <p className={`font-bold flex items-center gap-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><Calendar className="w-5 h-5 text-blue-500" /> {issue.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-10">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</h3>
                    <div className={`w-full border rounded-3xl p-6 min-h-[120px] leading-relaxed text-base font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>
                      {issue.desc}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Evidence Attached</h3>
                    <div className={`relative group rounded-[2.5rem] overflow-hidden border aspect-[21/9] flex items-center justify-center shadow-md transition-all cursor-pointer ${isDark ? '!bg-slate-950 border-slate-800 hover:border-blue-500/50' : '!bg-slate-100 border-slate-200 hover:border-blue-400'}`}>
                      <div className={`absolute inset-0 !bg-gradient-to-br opacity-80 ${isDark ? 'from-slate-900 via-slate-900/80 to-slate-950' : 'from-slate-100 via-slate-100/80 to-slate-200'}`}></div>
                      <div className="relative z-10 text-center space-y-3">
                        <div className="w-16 h-16 !bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="font-bold text-blue-500 text-sm drop-shadow-md">evidence_photo_01.jpg</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">View Full Image</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tracking & Updates */}
              <div className="space-y-6">
                
                {/* Status Tracker */}
                <div className={`border p-8 rounded-[2.5rem] backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-black tracking-tight mb-8">Status Tracker</h3>
                  <div className={`relative border-l-2 ml-4 space-y-8 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    {['Submitted', 'Assigned', 'Resolved'].map((step, idx) => {
                      const isActive = idx <= currentStepIdx;
                      const isCompleted = idx < currentStepIdx;
                      return (
                        <div key={step} className="relative pl-8">
                          <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full border-4 transition-all flex items-center justify-center ${isDark ? 'border-[#0f172a]' : 'border-[#f8fafc]'} ${isActive ? '!bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : (isDark ? '!bg-slate-700' : '!bg-slate-300')}`}>
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <h4 className={`font-bold transition-colors ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>{step}</h4>
                            {idx === 0 && <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-[0.2em]">{issue.updates[0]?.date}</p>}
                            {idx === 1 && currentStepIdx >= 1 && <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-[0.2em]">{issue.updates[1]?.date}</p>}
                            {idx === 2 && currentStepIdx === 2 && <p className="text-[10px] font-black text-emerald-500 mt-1 uppercase tracking-[0.2em]">Completed on {issue.date}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Department Info */}
                <div className={`border p-8 rounded-[2.5rem] space-y-8 backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Assigned To</h3>
                    <div className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm transition-colors ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <div className="w-12 h-12 !bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.dept}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{issue.assignedTo}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Gov Updates Log</h3>
                    <div className="space-y-4">
                      {issue.updates.map((upd, i) => (
                        <div key={i} className={`border p-5 rounded-2xl relative shadow-sm ${isDark ? '!bg-blue-950/20 border-blue-900/40' : '!bg-blue-50/80 border-blue-100'}`}>
                          <div className={`absolute -left-1.5 top-6 w-3 h-3 rotate-45 border-l border-t z-0 ${isDark ? '!bg-[#0b1426] border-blue-900/40' : '!bg-blue-50 border-blue-100'}`}></div>
                          <p className={`text-[10px] font-black tracking-[0.2em] uppercase mb-2 relative z-10 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{upd.date}</p>
                          <p className={`text-sm font-medium leading-relaxed relative z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{upd.msg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {issue.status === 'RESOLVED' && (
                  <button onClick={() => navigate(`/feedback/${issue.id}`)} className={`w-full font-bold text-lg px-10 py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 ${isDark ? '!bg-emerald-600 hover:!bg-emerald-500 text-white shadow-emerald-900/20' : '!bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-600/30'}`}>
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> Provide Feedback
                  </button>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IssueDetails;