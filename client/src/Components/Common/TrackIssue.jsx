import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  Loader2,
  Sun,
  Moon,
  ArrowLeft,
  Clock,
  Check,
  Search,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackIssue = () => {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [issueData, setIssueData] = useState(null);
  const [error, setError] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const buildMockIssue = (rawId) => ({
    id: rawId.toUpperCase(),
    category: 'Pothole',
    location: 'Sector 5, Civic Plaza, New Delhi',
    dateReported: 'Oct 24, 2023',
    status: 'in_progress',
    updates: [
      { id: 1, date: 'Oct 24, 2023 - 10:30 AM', title: 'Report Logged', desc: 'Issue has been successfully logged into the system.', completed: true },
      { id: 2, date: 'Oct 25, 2023 - 09:15 AM', title: 'Acknowledged', desc: 'Assigned to Public Works Department for review.', completed: true },
      { id: 3, date: 'Oct 26, 2023 - 02:00 PM', title: 'In Progress', desc: 'Maintenance team dispatched to the location for repairs.', completed: true },
      { id: 4, date: 'Pending', title: 'Resolved', desc: 'Issue fixed and verified by field agent.', completed: false }
    ]
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setError(false);
    
    // Simulate API search
    setTimeout(() => {
      setIsSearching(false);
      // Mock successful response for any ID that starts with CIVIC
      if (searchId.toUpperCase().startsWith('CIVIC')) {
        setIssueData(buildMockIssue(searchId));
      } else {
        setError(true);
        setIssueData(null);
      }
    }, 1200);
  };

  const showDemoResult = () => {
    const demoId = 'CIVIC-123456';
    setSearchId(demoId);
    setError(false);
    setIssueData(null);
  };

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-hidden transition-colors duration-500 relative ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-300/20 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Header */}
      <header className={`border-b px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4 shrink-0 backdrop-blur-xl z-20 transition-all duration-300 ${isDark ? 'bg-[#0f172a]/80 border-slate-800/50' : 'bg-white/80 border-slate-200/50'}`}>
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button 
            onClick={() => navigate('/')} 
            className={`p-2.5 -ml-2 rounded-xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight truncate">Track Issue</h1>
              <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-black tracking-wider uppercase ${isDark ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                <ShieldCheck className="w-3 h-3" />
                Live Status
              </span>
            </div>
            <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Municipal Service Tracker for registered complaints
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 xl:gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800/70 text-slate-300 border border-slate-700' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
            <Timer className="w-4 h-4 text-blue-500" />
            Avg update: 18h
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isDark ? 'bg-slate-800/70 text-slate-300 border border-slate-700' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Dept: Public Works
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/anonymousreport')}
            className={`hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'}`}
          >
            Report New
          </button>
          <button 
            onClick={() => setIsDark(!isDark)} 
            className={`p-2.5 rounded-xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8 mt-4 sm:mt-8">
          
          {/* Search Box */}
          <div className={`rounded-[2rem] p-6 sm:p-10 backdrop-blur-2xl transition-all duration-500 border ${isDark ? 'bg-slate-900/60 border-slate-800 shadow-xl shadow-black/40' : 'bg-white/80 border-white shadow-lg shadow-slate-200/50'}`}>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Enter Tracking ID</h2>
            <p className={`mb-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Use the unique ID provided when you submitted your report.</p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. CIVIC-123456"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className={`w-full pl-14 pr-4 py-4 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-mono text-lg font-bold uppercase ${isDark ? 'bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-700 focus:border-blue-500' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-blue-400 focus:bg-white shadow-inner'}`}
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching || !searchId.trim()}
                className="py-4 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:text-slate-400 text-white font-bold rounded-2xl transition-all flex items-center justify-center min-w-[140px] shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Don't have an ID?</span>
              <button
                onClick={showDemoResult}
                className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors ${isDark ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                Use Demo ID: CIVIC-123456
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-500">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm font-medium">Tracking ID not found. Please verify the ID and try again.</p>
              </div>
            )}
          </div>

          {/* Results Area */}
          {issueData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Info Card */}
              <div className={`rounded-[2rem] p-6 sm:p-8 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      In Progress
                    </span>
                    <h3 className="text-3xl font-black font-mono tracking-wider">{issueData.id}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl ${isDark ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Category</p>
                    <p className="font-bold text-lg">{issueData.category}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Date Reported</p>
                    <p className="font-bold text-lg">{issueData.dateReported}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Location</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {issueData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className={`rounded-[2rem] p-6 sm:p-10 border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <h3 className="text-xl font-black mb-8 tracking-tight">Resolution Journey</h3>
                
                <div className="space-y-0 relative">
                  <div className={`absolute top-4 bottom-8 left-6 w-0.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                  {issueData.updates.map((update, index) => (
                    <div key={update.id} className="relative flex items-start gap-6 pb-10 last:pb-0">
                      
                      {/* Icon Indicator */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0 transition-all duration-300 ${update.completed ? 'bg-blue-500 border-blue-100 dark:border-blue-900 text-white shadow-lg shadow-blue-500/30' : (isDark ? 'bg-slate-800 border-slate-900 text-slate-500' : 'bg-slate-100 border-white text-slate-400')}`}>
                        {update.completed ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>

                      {/* Content Card */}
                      <div className={`flex-1 pt-1 ${!update.completed ? 'opacity-60' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <span className={`text-lg font-black ${update.completed ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
                            {update.title}
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {update.date}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{update.desc}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default TrackIssue;