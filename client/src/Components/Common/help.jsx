export const TrackIssue = ({ onNavigateHome, isDark, toggleTheme }) => {
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [issueData, setIssueData] = useState(null);
  const [error, setError] = useState(false);

  // Robust Local Storage Theme Logic
  const [localIsDark, setLocalIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const isDarkMode = typeof isDark === 'boolean' ? isDark : localIsDark;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('civic_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    if (toggleTheme) toggleTheme();
    else setLocalIsDark(!localIsDark);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setError(false);
    
    setTimeout(() => {
      setIsSearching(false);
      if (searchId.toUpperCase() === 'CIVIC-123456' || searchId.toUpperCase().startsWith('CIVIC')) {
        setIssueData({
          id: searchId.toUpperCase(),
          category: 'Pothole',
          location: 'Sector 5, Civic Plaza, New Delhi',
          dateReported: 'Oct 24, 2023',
          status: 'in_progress', 
          updates: [
            { id: 1, date: 'Oct 24, 2023 - 10:30 AM', title: 'Report Logged', desc: 'Issue has been successfully logged into the system.', completed: true },
            { id: 2, date: 'Oct 25, 2023 - 09:15 AM', title: 'Acknowledged', desc: 'Assigned to Public Works Department for review.', completed: true },
            { id: 3, date: 'Oct 26, 2023 - 02:00 PM', title: 'In Progress', desc: 'Maintenance team dispatched to the location for repairs.', completed: true },
            { id: 4, date: 'Pending', title: 'Resolved', desc: 'Issue fixed and verified by field agent.', completed: false },
          ]
        });
      } else {
        setError(true);
        setIssueData(null);
      }
    }, 1000);
  };

  const autofillDemoId = () => {
    setSearchId('CIVIC-123456');
    setError(false);
  };

  return (
    <div className={`flex flex-col min-h-screen w-full overflow-hidden transition-colors duration-500 relative ${isDarkMode ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-300/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className={`h-20 border-b px-6 sm:px-12 flex items-center justify-between shrink-0 backdrop-blur-xl z-20 transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]/80 border-slate-800/50' : 'bg-white/80 border-slate-200/50'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onNavigateHome} className={`p-2.5 -ml-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Track Issue</h1>
        </div>
        <button onClick={handleThemeToggle} className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'}`}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-8 mt-4 sm:mt-8">
          
          {/* Search Box */}
          <div className={`rounded-[2rem] p-6 sm:p-10 backdrop-blur-2xl transition-all duration-500 border ${isDarkMode ? 'bg-slate-900/60 border-slate-800 shadow-xl shadow-black/40' : 'bg-white/80 border-white shadow-lg shadow-slate-200/50'}`}>
            <h2 className="text-2xl font-black mb-2 tracking-tight">Enter Tracking ID</h2>
            <p className={`mb-6 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Use the unique ID provided when you submitted your report.</p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="e.g. CIVIC-123456"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className={`w-full pl-14 pr-4 py-4 rounded-2xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-mono text-lg font-bold uppercase ${isDarkMode ? 'bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-700 focus:border-blue-500' : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-blue-400 focus:bg-white shadow-inner'}`}
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
            
            {/* Demo ID Helper */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Don't have an ID?</span>
              <button onClick={autofillDemoId} className={`text-sm font-bold px-3 py-1 rounded-lg transition-colors ${isDarkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                Try Demo ID: CIVIC-123456
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-500">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">Tracking ID not found. Please verify the ID and try again.</p>
              </div>
            )}
          </div>

          {/* Results Area */}
          {issueData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Info Card */}
              <div className={`rounded-[2rem] p-6 sm:p-8 border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      In Progress
                    </span>
                    <h3 className="text-3xl font-black font-mono tracking-wider">{issueData.id}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Category</p>
                    <p className="font-bold text-lg">{issueData.category}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Date Reported</p>
                    <p className="font-bold text-lg">{issueData.dateReported}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Location</p>
                    <p className="font-bold text-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {issueData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div className={`rounded-[2rem] p-6 sm:p-10 border ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                <h3 className="text-xl font-black mb-8 tracking-tight">Resolution Journey</h3>
                
                <div className="space-y-0 relative">
                  {/* Vertical Line */}
                  <div className={`absolute top-4 bottom-8 left-6 w-0.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                  {issueData.updates.map((update, index) => {
                    const isLast = index === issueData.updates.length - 1;
                    return (
                      <div key={update.id} className="relative flex items-start gap-6 pb-10 last:pb-0">
                        
                        {/* Status Icon */}
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0 transition-all duration-300 ${update.completed ? 'bg-blue-500 border-blue-100 dark:border-blue-900 text-white shadow-lg shadow-blue-500/30' : (isDarkMode ? 'bg-slate-800 border-slate-900 text-slate-500' : 'bg-slate-100 border-white text-slate-400')}`}>
                          {update.completed ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pt-1 ${!update.completed && 'opacity-60'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <span className={`text-lg font-black ${update.completed ? (isDarkMode ? 'text-white' : 'text-slate-900') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                              {update.title}
                            </span>
                            <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              {update.date}
                            </span>
                          </div>
                          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {update.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};