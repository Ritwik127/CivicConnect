import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Building2, 
  Users, 
  BarChart3, 
  ClipboardList, 
  Settings, 
  LogOut,
  ArrowLeft,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  User,
  Image as ImageIcon,
  History,
  ShieldCheck,
  ChevronRight,
  HardHat,
  Edit,
  X,
  Save,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_ISSUE = { 
  id: 'ISS-9042', 
  category: 'Pothole', 
  desc: 'Large pothole in the middle lane causing significant traffic slowdowns. It has grown larger after the recent rain.',
  location: 'Oxford Street, Downtown', 
  coordinates: 'Lat: 28.6139, Lng: 77.2090',
  reporter: { name: 'John Doe', id: 'USR-844', phone: '+1 (555) 019-2834' },
  aiAnalysis: {
    confidence: 98,
    detectedTags: ['Road Damage', 'Hazard', 'Asphalt'],
    recommendedPriority: 'High',
    autoRoutedTo: 'Roads & Transport'
  },
  dept: 'Roads & Transport', 
  assignedTeam: 'Field Team Alpha',
  assignedWorker: 'Mike Reynolds (WK-294)',
  priority: 'High', 
  status: 'IN-PROGRESS', 
  date: 'Oct 24, 10:30 AM',
  sla: {
    targetResolution: 'Oct 26, 10:30 AM',
    timeElapsed: '24h 15m',
    timeRemaining: '23h 45m',
    status: 'ON-TRACK'
  },
  history: [
    { date: 'Oct 24, 10:30 AM', action: 'Issue Reported by Citizen (USR-844)', system: false },
    { date: 'Oct 24, 10:31 AM', action: 'AI Assessment Completed (98% Confidence)', system: true },
    { date: 'Oct 24, 10:31 AM', action: 'Auto-routed to Roads & Transport Dept', system: true },
    { date: 'Oct 24, 11:15 AM', action: 'Acknowledged by Dept Admin', system: false },
    { date: 'Oct 24, 01:20 PM', action: 'Assigned to Field Team Alpha (Mike Reynolds)', system: false },
    { date: 'Oct 25, 09:00 AM', action: 'Worker Checked-In at Location', system: false },
  ]
};

const PriorityBadge = ({ priority, isDark }) => {
  const styles = {
    'Critical': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    'High': '!bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'Medium': '!bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    'Low': '!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };
  return (
    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border shadow-sm ${styles[priority] || styles['Medium']}`}>
      {priority} Priority
    </span>
  );
};

const StatusBadge = ({ status, isDark }) => {
  const styles = {
    'RESOLVED': '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'IN-PROGRESS': '!bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'OPEN': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };
  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border opacity-90 shadow-sm ${styles[status] || styles['OPEN']}`}>
      {status}
    </span>
  );
};

const AdminIssueDetails = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);
  
  // Issue State
  const [issue, setIssue] = useState(INITIAL_ISSUE);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '', priority: '', dept: '', assignedWorker: '', adminNote: ''
  });

  const openEditModal = () => {
    setEditForm({
      status: issue.status,
      priority: issue.priority,
      dept: issue.dept,
      assignedWorker: issue.assignedWorker,
      adminNote: ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const newHistoryEntry = {
      date: 'Just Now',
      action: `Admin updated issue. ${editForm.adminNote ? `Note: "${editForm.adminNote}"` : ''}`,
      system: false
    };

    setIssue(prev => ({
      ...prev,
      status: editForm.status,
      priority: editForm.priority,
      dept: editForm.dept,
      assignedWorker: editForm.assignedWorker,
      history: [...prev.history, newHistoryEntry]
    }));
    
    setIsEditModalOpen(false);
  };

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-purple-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-indigo-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Admin Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 border-r h-full shrink-0 relative z-20 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-xl shadow-lg shadow-purple-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>CivicAdmin</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => navigate('/admin/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/admin/issues')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
            <ListTodo className="w-5 h-5" /> Issue Management
          </button>
          <button onClick={() => navigate('/admin/departments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <Building2 className="w-5 h-5" /> Departments
          </button>
          <button onClick={() => navigate('/admin/users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <Users className="w-5 h-5" /> Users & Roles
          </button>
          <button onClick={() => navigate('/admin/analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <BarChart3 className="w-5 h-5" /> Analytics
          </button>
          <button onClick={() => navigate('/admin/auditlogs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <ClipboardList className="w-5 h-5" /> Audit Logs
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/admin/adminsettings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> System Settings
          </button>
          <button onClick={() => navigate('/login')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-purple-500/10 hover:!bg-rose-500/10' : '!bg-purple-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* Header */}
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/issues')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Command Center</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{adminName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>City Administrator</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/20">
                SJ
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Contextual Nav & Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/admin/issues')} 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border shadow-sm w-max ${isDark ? '!bg-purple-600/10 text-purple-400 hover:text-purple-300 hover:!bg-purple-600/20 border-purple-500/20' : '!bg-white text-purple-700 hover:!bg-purple-50 border-purple-200'}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-bold text-sm">Back to Issues</span>
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black tracking-tight">Issue {issue.id}</h2>
                  <StatusBadge status={issue.status} isDark={isDark} />
                  <PriorityBadge priority={issue.priority} isDark={isDark} />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={openEditModal}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl flex items-center gap-2 whitespace-nowrap ${isDark ? '!bg-purple-600 hover:!bg-purple-500 text-white shadow-purple-900/20' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}
                >
                  <Edit className="w-4 h-4" /> Edit Issue
                </button>
              </div>
            </div>

            {/* Grid Layout Top */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Main Issue Info (Spans 2 columns) */}
              <div className="lg:col-span-2 space-y-8">
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl h-full transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Core Details
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div className={`p-5 rounded-2xl border shadow-inner transition-colors ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Category</p>
                      <p className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.category}</p>
                    </div>
                    <div className={`p-5 rounded-2xl border shadow-inner transition-colors ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Reported Date</p>
                      <p className={`font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><Calendar className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> {issue.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Citizen Description</p>
                    <div className={`w-full border rounded-2xl p-6 leading-relaxed text-sm shadow-inner font-medium ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>
                      "{issue.desc}"
                    </div>
                  </div>

                  <div className={`grid sm:grid-cols-2 gap-6 pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Location Details</p>
                      <div className="flex flex-col gap-1.5">
                        <p className={`font-bold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><MapPin className={`w-4 h-4 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} /> {issue.location}</p>
                        <p className="text-xs text-slate-500 font-mono ml-6">{issue.coordinates}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Reporter Information</p>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? '!bg-blue-500/10 text-blue-400' : '!bg-blue-100 text-blue-600'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.reporter.name} <span className="text-slate-500 font-normal">({issue.reporter.id})</span></p>
                          <p className="text-xs text-slate-500">{issue.reporter.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI & SLA Column */}
              <div className="space-y-8">
                
                {/* AI Processing Results */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Sparkles className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> AI Classification
                    </h3>
                    <span className={`border px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200'}`}>Automated</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence Score</p>
                        <p className={`text-xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{issue.aiAnalysis.confidence}%</p>
                      </div>
                      <div className={`h-2 w-full rounded-full overflow-hidden shadow-inner ${isDark ? '!bg-slate-800' : '!bg-slate-200'}`}>
                        <div className={`h-full rounded-full ${isDark ? '!bg-emerald-500' : '!bg-emerald-500'}`} style={{ width: `${issue.aiAnalysis.confidence}%` }}></div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Extracted Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {issue.aiAnalysis.detectedTags.map((tag, i) => (
                          <span key={i} className={`px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${isDark ? '!bg-slate-800 text-slate-300 border-slate-700' : '!bg-white text-slate-700 border-slate-200'}`}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Rec. Priority:</span>
                        <span className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{issue.aiAnalysis.recommendedPriority}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-500">Routed To:</span>
                        <span className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{issue.aiAnalysis.autoRoutedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SLA Timeline Overview */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Clock className={`w-5 h-5 ${isDark ? 'text-amber-500' : 'text-amber-600'}`} /> SLA Monitor
                    </h3>
                    {issue.sla.status === 'ON-TRACK' && <span className={`text-[10px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${isDark ? '!bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : '!bg-emerald-50 text-emerald-700 border-emerald-200'}`}>On Track</span>}
                    {issue.sla.status === 'BREACHED' && <span className={`text-[10px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${isDark ? '!bg-rose-500/10 text-rose-500 border-rose-500/20' : '!bg-rose-50 text-rose-700 border-rose-200'}`}>Breached</span>}
                  </div>

                  <div className="space-y-5">
                    <div className={`flex justify-between items-center border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Resolution</span>
                      <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{issue.sla.targetResolution}</span>
                    </div>
                    <div className={`flex justify-between items-center border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Elapsed</span>
                      <span className={`text-sm font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{issue.sla.timeElapsed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time Remaining</span>
                      <span className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{issue.sla.timeRemaining}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout Bottom */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Assignment & Proof of Work */}
              <div className="space-y-8">
                
                {/* Active Assignment */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Building2 className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Active Assignment
                    </h3>
                    <button 
                      onClick={openEditModal}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors uppercase tracking-widest shadow-sm ${isDark ? 'text-purple-400 !bg-purple-500/10 hover:!bg-purple-500/20 border-purple-500/20' : 'text-purple-700 !bg-purple-50 hover:!bg-purple-100 border-purple-200'}`}
                    >
                      Reassign
                    </button>
                  </div>
                  
                  <div className={`space-y-4 p-6 rounded-3xl border shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                    <div className={`flex items-center gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? '!bg-blue-500/10 text-blue-400' : '!bg-blue-100 text-blue-600'}`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Department & Team</p>
                        <p className={`font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.dept} <span className="text-slate-500 font-normal ml-1">({issue.assignedTeam})</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? '!bg-amber-500/10 text-amber-400' : '!bg-amber-100 text-amber-600'}`}>
                        <HardHat className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Field Worker</p>
                        <p className={`font-bold mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.assignedWorker || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Work Media */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <ShieldCheck className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} /> Media & Proof of Work
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Before Image */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex justify-between">
                        Reported Photo <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Available</span>
                      </p>
                      <div className={`relative group rounded-2xl overflow-hidden border aspect-square flex items-center justify-center shadow-md hover:border-blue-500/50 transition-all cursor-pointer ${isDark ? '!bg-slate-950 border-slate-800' : '!bg-slate-100 border-slate-200'}`}>
                        <div className={`absolute inset-0 opacity-80 ${isDark ? '!bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950' : '!bg-gradient-to-br from-slate-100 via-white to-slate-200'}`}></div>
                        <div className="relative z-10 text-center space-y-2">
                          <ImageIcon className={`w-8 h-8 mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                          <p className={`font-bold text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>citizen_upload.jpg</p>
                        </div>
                      </div>
                    </div>

                    {/* After Image */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex justify-between">
                        Resolution Proof <span className={issue.status === 'RESOLVED' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-amber-400' : 'text-amber-600')}>{issue.status === 'RESOLVED' ? 'Available' : 'Pending'}</span>
                      </p>
                      <div className={`relative rounded-2xl overflow-hidden border border-dashed aspect-square flex items-center justify-center ${isDark ? '!bg-slate-950/30 border-slate-700' : '!bg-slate-50 border-slate-300'}`}>
                        <div className="text-center space-y-2 opacity-60">
                          <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
                          <p className="font-bold text-slate-500 text-xs">{issue.status === 'RESOLVED' ? 'View Proof' : 'Awaiting Worker Upload'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Complete History Timeline */}
              <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl h-full transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <History className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} /> Complete Audit History
                </h3>
                
                <div className={`relative border-l-2 ml-4 space-y-8 pt-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  {issue.history.map((evt, idx) => {
                    return (
                      <div key={idx} className="relative pl-8">
                        {/* Timeline Node */}
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 ${isDark ? 'border-[#0f172a]' : 'border-white'} ${
                          evt.system ? '!bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : '!bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                        }`}></div>
                        
                        <div className={`p-4 rounded-2xl border transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800 hover:border-slate-700' : '!bg-slate-50/80 border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{evt.date}</span>
                            {evt.system && <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200'}`}>System Action</span>}
                          </div>
                          <h4 className={`font-bold text-sm leading-snug ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{evt.action}</h4>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Future Node Marker */}
                  {issue.status !== 'RESOLVED' && (
                    <div className="relative pl-8 opacity-50">
                      <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 ${isDark ? 'border-[#0f172a] !bg-slate-700' : 'border-white !bg-slate-300'}`}></div>
                      <div className={`bg-transparent p-4 rounded-2xl border border-dashed ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
                        <h4 className="font-bold text-sm text-slate-500 italic">Awaiting resolution...</h4>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* --- EDIT ISSUE OVERLAY MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${isDark ? '!bg-[#0f172a] border-slate-800' : '!bg-white border-slate-200'}`}>
            
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <div className="flex items-center gap-3">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Edit className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Edit Issue Details
                </h3>
                <span className={`text-[10px] font-black text-slate-500 tracking-widest uppercase px-2 py-1 rounded-md border ${isDark ? '!bg-slate-950 border-slate-800' : '!bg-white border-slate-300 shadow-sm'}`}>{issue.id}</span>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className={`p-2 rounded-xl transition-colors shadow-sm ${isDark ? 'text-slate-400 hover:text-white !bg-slate-800 hover:!bg-slate-700' : 'text-slate-600 hover:text-slate-900 !bg-white border border-slate-200 hover:!bg-slate-50'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="edit-issue-form" onSubmit={handleEditSubmit} className="space-y-8">
                
                {/* Triage Settings */}
                <div className="space-y-6">
                  <h4 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b pb-3 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'}`}>
                    <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} /> Status & Priority
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Status</label>
                      <div className="relative shadow-sm rounded-2xl">
                        <select 
                          value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                          className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN-PROGRESS">In-Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Priority Level</label>
                      <div className="relative shadow-sm rounded-2xl">
                        <select 
                          value={editForm.priority} onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                          className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment Settings */}
                <div className="space-y-6">
                  <h4 className={`text-sm font-bold uppercase tracking-widest flex items-center gap-2 border-b pb-3 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-200'}`}>
                    <Building2 className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} /> Assignment & Routing
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Department</label>
                      <div className="relative shadow-sm rounded-2xl">
                        <select 
                          value={editForm.dept} onChange={(e) => setEditForm({...editForm, dept: e.target.value})}
                          className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                        >
                          <option>Roads & Transport</option>
                          <option>Sanitation Dept</option>
                          <option>Water & Sewage</option>
                          <option>Electrical Division</option>
                          <option>Parks & Rec</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Assigned Worker (Optional)</label>
                      <div className="relative group shadow-sm rounded-2xl">
                        <HardHat className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                        <input 
                          type="text" 
                          value={editForm.assignedWorker} onChange={(e) => setEditForm({...editForm, assignedWorker: e.target.value})}
                          placeholder="e.g. Mike Reynolds"
                          className={`w-full border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Note */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Admin Note / Reason for Edit</label>
                  <textarea 
                    value={editForm.adminNote} onChange={(e) => setEditForm({...editForm, adminNote: e.target.value})}
                    placeholder="Briefly explain the changes made (Will appear in Audit Log)..."
                    className={`w-full border rounded-2xl p-5 min-h-[100px] outline-none transition-all font-medium resize-none shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                  />
                </div>

              </form>
            </div>
            
            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-3 p-6 border-t shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className={`px-5 py-3 font-bold transition-colors ${isDark ? '!bg-purple-500/10 text-slate-200 hover:text-white' : '!bg-purple-500/10 text-slate-600 hover:text-slate-900'}`}>
                Cancel
              </button>
              <button type="submit" form="edit-issue-form" className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-[#a855f7] hover:!bg-[#9333ea] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                <Save className="w-5 h-5" /> Save Updates
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminIssueDetails;