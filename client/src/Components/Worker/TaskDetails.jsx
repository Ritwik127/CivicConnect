import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MapPin, 
  Clock,
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Settings,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  HardHat,
  ArrowLeft,
  Navigation,
  Upload,
  X,
  FileText,
  Send,
  UserCircle2,
  Camera,
  Bell,
  Sun,
  Moon
} from 'lucide-react';

const MOCK_TASKS = [
  { 
    id: 'TSK-9042', issueId: 'ISS-9042', category: 'Pothole Repair', 
    description: 'Deep pothole reported in the middle lane. Requires immediate asphalt filling to prevent vehicle damage.',
    location: 'Oxford Street, Downtown', coordinates: 'Lat: 28.6139, Lng: 77.2090',
    priority: 'High', status: 'IN-PROGRESS', slaDeadline: 'Today, 2:00 PM', timeRemaining: '3h 15m', distance: '1.2 km away',
    reportedImg: 'https://via.placeholder.com/400x300?text=Pothole+Before'
  },
  { 
    id: 'TSK-9045', issueId: 'ISS-9045', category: 'Traffic Light Fix', 
    description: 'Traffic signal at intersection is completely off. High risk of accidents.',
    location: 'Main St & 5th Ave', coordinates: 'Lat: 28.6210, Lng: 77.2150',
    priority: 'Critical', status: 'IN-PROGRESS', slaDeadline: 'Today, 12:30 PM', timeRemaining: '1h 45m', distance: '0.8 km away',
    reportedImg: 'https://via.placeholder.com/400x300?text=Traffic+Light+Issue'
  },
  { 
    id: 'TSK-9011', issueId: 'ISS-9011', category: 'Fallen Tree Removal', 
    description: 'Large tree branch blocking the pedestrian walkway and part of the bike lane.',
    location: 'Central Park North', coordinates: 'Lat: 28.6300, Lng: 77.2200',
    priority: 'Medium', status: 'RESOLVED', slaDeadline: 'Completed', timeRemaining: '0h 0m', distance: '3.5 km away',
    reportedImg: 'https://via.placeholder.com/400x300?text=Tree+Before'
  },
  { 
    id: 'TSK-8992', issueId: 'ISS-8992', category: 'Sewer Leak', 
    description: 'Minor sewage overflow near the residential complex gate.',
    location: 'West End Blvd', coordinates: 'Lat: 28.6100, Lng: 77.2000',
    priority: 'High', status: 'ASSIGNED', slaDeadline: 'Tomorrow, 10:00 AM', timeRemaining: '20h 30m', distance: '4.1 km away',
    reportedImg: 'https://via.placeholder.com/400x300?text=Sewer+Leak+Before'
  }
];

const REPORTED_PHOTO_FALLBACK = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" fill="none">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f1f5f9"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>
    <circle cx="280" cy="160" r="110" fill="#fdba74" fill-opacity="0.35"/>
    <circle cx="930" cy="520" r="140" fill="#fbbf24" fill-opacity="0.25"/>
    <rect x="390" y="190" width="420" height="295" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="8"/>
    <circle cx="525" cy="305" r="44" fill="#94a3b8"/>
    <path d="M445 430l95-92a24 24 0 0134 0l52 51a24 24 0 0034 0l44-44a24 24 0 0134 0l72 85H445z" fill="#cbd5e1"/>
    <text x="600" y="560" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#475569">Reported Photo Unavailable</text>
  </svg>`
)}`;

const PriorityBadge = ({ priority }) => {
  const styles = {
    'Critical': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    'High': '!bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'Medium': '!bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    'Low': '!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };
  return <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border shadow-sm ${styles[priority] || styles['Medium']}`}>{priority} Priority</span>;
};

const TaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieves ID from route, e.g., /worker/taskdetails/TSK-9042
  
  const currentTask = MOCK_TASKS.find(t => t.id === id) || MOCK_TASKS[0]; // Fallback to first if not found

  const fileInputRef = useRef(null);
  const [workerName] = useState("Mike Reynolds");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const [proofFile, setProofFile] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [reportedImageSrc, setReportedImageSrc] = useState(currentTask.reportedImg || REPORTED_PHOTO_FALLBACK);

  useEffect(() => {
    setReportedImageSrc(currentTask.reportedImg || REPORTED_PHOTO_FALLBACK);
  }, [currentTask.id]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProofFile(file);
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    alert("Proof of Work submitted for supervisor verification!");
    navigate('/worker/tasks');
  };

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
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}>
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
            <button onClick={() => navigate('/worker/tasks')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Task Execution</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell included as requested */}
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
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* Contextual Nav */}
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/worker/tasks')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl group transition-all border shadow-sm ${isDark ? '!bg-orange-600/10 text-orange-400 hover:text-white border-orange-500/20 hover:border-orange-500/40' : '!bg-white text-orange-700 hover:!bg-orange-50 border-orange-200 hover:border-orange-300'}`}>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Back to Queue</span>
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column: Task Overview & Proof of Work */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Task Header Card */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${isDark ? '!bg-orange-500/10 text-orange-400' : '!bg-orange-100 text-orange-600'}`}>
                        <AlertTriangle className="w-8 h-8" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-black tracking-tight">{currentTask.category}</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                          Task ID: <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{currentTask.id}</span>
                        </p>
                      </div>
                    </div>
                    <PriorityBadge priority={currentTask.priority} />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Location Address</p>
                      <div className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between gap-4 ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="flex flex-col gap-1">
                          <p className={`font-bold flex items-center gap-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            <MapPin className="w-5 h-5 text-orange-500" /> {currentTask.location}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono ml-8">{currentTask.coordinates}</p>
                        </div>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 ${isDark ? '!bg-blue-600 hover:!bg-blue-500 text-white' : '!bg-blue-600 hover:!bg-blue-700 text-white'}`}>
                          <Navigation className="w-4 h-4" /> Navigate
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Issue Description</p>
                      <p className={`p-5 rounded-2xl border shadow-inner font-medium text-sm leading-relaxed ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>
                        {currentTask.description}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Reported Photo</p>
                        <div className={`aspect-video rounded-2xl border flex items-center justify-center overflow-hidden relative shadow-sm ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <img
                            src={reportedImageSrc}
                            alt="Reported issue"
                            onError={() => {
                              if (reportedImageSrc !== REPORTED_PHOTO_FALLBACK) {
                                setReportedImageSrc(REPORTED_PHOTO_FALLBACK);
                              }
                            }}
                            className="w-full h-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-black/50 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md">View Original</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className={`p-4 rounded-2xl border shadow-sm h-full flex flex-col justify-center ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                          <div className="flex items-center gap-3 text-amber-500 mb-2">
                            <Clock className="w-5 h-5" />
                            <span className="font-bold uppercase tracking-wider text-xs">SLA Time Remaining</span>
                          </div>
                          <p className="text-3xl font-black">{currentTask.timeRemaining}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Target: {currentTask.slaDeadline}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof of Work Submission Tab */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} /> Complete Task & Submit Proof
                  </h3>

                  <form onSubmit={handleSubmitProof} className="space-y-6">
                    {!proofFile ? (
                      <div onClick={() => fileInputRef.current.click()} className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center text-center space-y-4 transition-all cursor-pointer group ${isDark ? 'border-slate-700 !bg-slate-950/30 hover:border-emerald-500/50 hover:!bg-emerald-500/5' : 'border-slate-300 !bg-slate-50/50 hover:border-emerald-400 hover:!bg-emerald-50'}`}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm ${isDark ? '!bg-slate-800 text-emerald-400' : '!bg-white text-emerald-600'}`}>
                          <Camera className="w-8 h-8" />
                        </div>
                        <div>
                          <p className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Capture "After" Photo/Video</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Clear evidence is required to close this task.</p>
                        </div>
                      </div>
                    ) : (
                      <div className={`relative group rounded-[2rem] overflow-hidden border aspect-[21/9] flex items-center justify-center shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="text-center space-y-2">
                           <div className="w-16 h-16 !bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                             <FileText className="w-8 h-8 text-emerald-500" />
                           </div>
                           <p className="font-bold text-emerald-500 text-sm">{proofFile.name}</p>
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Ready for upload</p>
                        </div>
                        <button type="button" onClick={() => setProofFile(null)} className="absolute top-4 right-4 p-2 !bg-rose-500 hover:!bg-rose-600 text-white rounded-full shadow-lg transition-colors hover:scale-110">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Resolution Notes (Required)</label>
                      <textarea 
                        required
                        value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Detail the work done, materials used, etc..." 
                        className={`w-full border rounded-[1.5rem] p-5 min-h-[120px] focus:border-emerald-500 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`} 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={!proofFile || !resolutionNotes}
                      className={`w-full py-4 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${isDark ? '!bg-emerald-600 hover:!bg-emerald-500 shadow-emerald-900/20' : '!bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-600/30'}`}
                    >
                      <CheckCircle2 className="w-5 h-5" /> Submit for Supervisor Approval
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Communication */}
              <div className="space-y-8">
                <div className={`border rounded-[2.5rem] p-6 shadow-xl flex flex-col h-full backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className={`flex items-center gap-3 border-b pb-4 mb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? '!bg-blue-500/10 text-blue-400' : '!bg-blue-100 text-blue-600'}`}>
                      <UserCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Supervisor Chat</h3>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full !bg-emerald-500"></span> Online
                      </p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-[300px]">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[10px] font-bold text-slate-500 ml-2">Supervisor • 10:45 AM</span>
                      <div className={`p-3 rounded-2xl rounded-tl-sm text-sm font-medium shadow-sm max-w-[85%] ${isDark ? '!bg-slate-800 text-slate-200' : '!bg-slate-100 text-slate-800'}`}>
                        Hi Mike, ensure you clear the debris before filling the pothole for {currentTask.id}.
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] font-bold text-slate-500 mr-2">You • 10:50 AM</span>
                      <div className={`p-3 rounded-2xl rounded-tr-sm text-sm font-medium shadow-sm text-white max-w-[85%] ${isDark ? '!bg-orange-600' : '!bg-orange-500'}`}>
                        Got it. Arriving at the location now.
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="mt-4 pt-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type message..." 
                        className={`w-full border rounded-full py-3 pl-4 pr-12 text-sm outline-none transition-all shadow-inner font-medium ${isDark ? '!bg-slate-950/50 border-slate-800 focus:border-orange-500 text-slate-200' : '!bg-slate-50/80 border-slate-200 focus:border-orange-500 text-slate-900 focus:!bg-white'}`}
                      />
                      <button 
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full !bg-transparent hover:!bg-transparent transition-colors ${isDark ? 'text-orange-400' : 'text-orange-500'}`}
                        onClick={() => setChatMessage("")}
                        disabled={!chatMessage}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;