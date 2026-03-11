import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  PlusCircle, LayoutDashboard, FileText, Bell, Settings, LogOut,
  ArrowLeft, AlertTriangle, Camera, Activity, Search, MapPin, 
  Map as MapIcon, Upload, X, CheckCircle2, Loader2, Info, ChevronRight, Sun, Moon, Shield
} from 'lucide-react';

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [userName] = useState("John Doe");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [formData, setFormData] = useState({ category: '', description: '', location: '', coordinates: null, media: null });

  const categories = [
    { id: 'pothole', label: 'Pothole', icon: AlertTriangle, color: 'text-orange-500', bg: '!bg-orange-500/10', hover: 'hover:border-orange-400/70 hover:!bg-orange-500/5' },
    { id: 'garbage', label: 'Garbage', icon: Camera, color: 'text-emerald-500', bg: '!bg-emerald-500/10', hover: 'hover:border-emerald-400/70 hover:!bg-emerald-500/5' },
    { id: 'street-light', label: 'Street Light', icon: Activity, color: 'text-yellow-500', bg: '!bg-yellow-500/10', hover: 'hover:border-yellow-400/70 hover:!bg-yellow-500/5' },
    { id: 'water', label: 'Water Leak', icon: MapPin, color: 'text-cyan-500', bg: '!bg-cyan-500/10', hover: 'hover:border-cyan-400/70 hover:!bg-cyan-500/5' },
    { id: 'vandalism', label: 'Vandalism', icon: Shield, color: 'text-rose-500', bg: '!bg-rose-500/10', hover: 'hover:border-rose-400/70 hover:!bg-rose-500/5' },
    { id: 'other', label: 'Other', icon: Info, color: 'text-slate-400', bg: '!bg-slate-400/10', hover: 'hover:border-slate-400/70 hover:!bg-slate-500/5' },
  ];

  const handleCategorySelect = (id) => { setFormData(prev => ({ ...prev, category: id })); setStep(2); };
  const detectLocation = () => {
    setLocationLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, location: "Sector 5, Civic Plaza, New Delhi", coordinates: { lat: 28.6139, lng: 77.2090 } }));
      setLocationLoading(false);
    }, 1500);
  };
  const handleFileUpload = (e) => { const file = e.target.files[0]; if (file) setFormData(prev => ({ ...prev, media: file })); };
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    setIsSubmitting(true); 
    setTimeout(() => { 
      const id = '#' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setTrackingId(id);
      setIsSubmitting(false); 
      setStep(4);
    }, 2000); 
  };

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[12%] right-[10%] w-[46%] h-[46%] !bg-blue-300/12 rounded-full blur-[110px]"></div>
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
          <button onClick={() => navigate('/user/report-issue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left transition-all ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
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
            <h1 className="text-2xl font-black tracking-tight">Report New Issue</h1>
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
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full space-y-4">

            <div className="max-w-4xl mx-auto w-full pt-8 pb-1 transition-all duration-500">
              
              {/* Stepper */}
              {step < 4 && (
              <div className="flex items-center gap-3 mb-7">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-4 flex-1 last:flex-none">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? '!bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : (isDark ? '!bg-slate-800 text-slate-500' : '!bg-slate-100 text-slate-400')}`}>
                      {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step > s ? '!bg-blue-600 shadow-sm shadow-blue-600/20' : (isDark ? '!bg-slate-800' : '!bg-slate-100')}`}></div>}
                  </div>
                ))}
              </div>
              )}

              {/* Step 1: Category */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">What's the problem?</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select a category that best describes the civic issue.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`p-5 rounded-[1.4rem] border-2 transition-all flex flex-col items-center gap-2.5 group relative overflow-hidden ${formData.category === cat.id ? '!bg-blue-600/10 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_10px_24px_rgba(59,130,246,0.12)]' : (isDark ? `!bg-slate-800/40 border-slate-700 ${cat.hover}` : `!bg-white border-slate-200/60 ${cat.hover} hover:shadow-lg shadow-sm`)} hover:-translate-y-1`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${cat.color} ${cat.bg} ${isDark ? '!bg-slate-900' : '!bg-slate-50'}`}>
                            <Icon className="w-6.5 h-6.5" />
                          </div>
                          <div className="text-center">
                            <span className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.label}</span>
                            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tap to continue</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-all ${formData.category === cat.id ? 'opacity-100 translate-x-0 text-blue-500' : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Description & Location */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Details & Location</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Help us understand where and what the issue is.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
                      <textarea 
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Explain the situation in detail..." 
                        className={`w-full border rounded-[1.2rem] p-4 min-h-[128px] focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`} 
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Location Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Tag your location..." 
                          className={`w-full border rounded-[1.2rem] py-4 pl-12 pr-36 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`} 
                        />
                        <button 
                          onClick={detectLocation} disabled={locationLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 !bg-blue-600 hover:!bg-blue-500 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white disabled:opacity-50 shadow-md"
                        >
                          {locationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapIcon className="w-3.5 h-3.5" />}
                          {locationLoading ? 'Detecting' : 'Use GPS'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button onClick={() => setStep(1)} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-slate-100 hover:!bg-slate-200 text-slate-700'}`}>Back</button>
                    <button onClick={() => setStep(3)} disabled={!formData.description || !formData.location} className={`flex-[2] py-4 disabled:opacity-50 text-white disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-blue-600 hover:!bg-blue-500 shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/30'}`}>
                      Continue to Upload
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Evidence */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Upload Evidence</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add a photo to help verify the report.</p>
                  </div>

                  {!formData.media ? (
                    <div onClick={() => fileInputRef.current.click()} className={`border-2 border-dashed rounded-[2rem] h-56 flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer group ${isDark ? 'border-slate-700 !bg-slate-950/30 hover:border-blue-500/50 hover:!bg-blue-500/5' : 'border-slate-300 !bg-slate-50/50 hover:border-blue-400 hover:!bg-blue-50'}`}>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${isDark ? '!bg-slate-900' : '!bg-white'}`}>
                        <Upload className="w-7 h-7 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Capture or Upload Photo</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">Tap to select</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`relative group rounded-[2rem] overflow-hidden border h-56 flex items-center justify-center shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <div className="text-center space-y-2">
                         <div className="w-16 h-16 !bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                           <FileText className="w-8 h-8 text-blue-500" />
                         </div>
                         <p className="font-bold text-blue-500 text-base">{formData.media.name}</p>
                         <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{(formData.media.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => setFormData({...formData, media: null})} className="absolute top-4 right-4 p-2.5 !bg-rose-500 hover:!bg-rose-600 text-white rounded-full shadow-lg transition-colors hover:scale-110">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button onClick={() => setStep(2)} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-slate-100 hover:!bg-slate-200 text-slate-700'}`}>Back</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className={`flex-[2] py-4 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-emerald-600 hover:!bg-emerald-500 shadow-emerald-900/20' : '!bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-600/30'}`}>
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      {isSubmitting ? 'Processing...' : 'Submit Final Report'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="relative">
                      <div className="absolute inset-0 !bg-blue-500/20 rounded-full blur-[40px]"></div>
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center relative shadow-2xl ${isDark ? '!bg-blue-600/20 shadow-blue-900/50' : '!bg-blue-50 shadow-blue-200'}`}>
                        <CheckCircle2 className="w-14 h-14 text-blue-600" />
                      </div>
                    </div>

                    <div className="text-center space-y-3 max-w-md">
                      <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Report Submitted!</h2>
                      <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your civic issue has been successfully reported and is now being reviewed by our team.</p>
                    </div>

                    <div className={`w-full max-w-md p-6 rounded-2xl border-2 space-y-2 ${isDark ? '!bg-slate-800/50 border-slate-700' : '!bg-blue-50 border-blue-200'}`}>
                      <p className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your Tracking ID</p>
                      <p className="text-2xl font-black tracking-tight text-blue-600">{trackingId}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Use this ID to track your report status anytime.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => navigate(`/user/issue/${trackingId}`)} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 text-white !bg-blue-600 hover:!bg-blue-700`}>
                      View Report
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportIssuePage;