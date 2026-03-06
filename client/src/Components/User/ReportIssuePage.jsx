import React, { useState, useRef } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  ArrowLeft, 
  AlertTriangle, 
  Camera, 
  Activity, 
  Search, 
  MapPin, 
  Map as MapIcon, 
  Upload, 
  X, 
  CheckCircle2, 
  Loader2, 
  Info,
  ChevronRight
} from 'lucide-react';

const ReportIssueContent = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [userName] = useState("John Doe");
  
  // State Management
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    coordinates: null,
    media: null
  });

  const categories = [
    { id: 'pothole', label: 'Pothole', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'garbage', label: 'Garbage', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'water', label: 'Water Leak', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'light', label: 'Streetlight', icon: Search, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 'other', label: 'Other', icon: Info, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  ];

  // Handlers
  const handleCategorySelect = (id) => {
    setFormData(prev => ({ ...prev, category: id }));
    setStep(2);
  };

  const detectLocation = () => {
    setLocationLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        location: "Sector 5, Civic Plaza, New Delhi",
        coordinates: { lat: 28.6139, lng: 77.2090 }
      }));
      setLocationLoading(false);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, media: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white font-sans overflow-hidden">
      
      {/* Sidebar - Identical to Dashboard */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] border-r border-slate-800 h-full shrink-0">
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <span className="font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-blue-500">CivicConnect</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-left">
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button
           onClick={() => navigate('/my-reports')}
           className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left">
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button
          onClick={() => navigate('/notifications')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left">
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 transition-all text-left">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-rose-500 hover:bg-rose-500/10 transition-all text-left"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area - flex-1 ensures it fills the remaining width */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Header - Identical to Dashboard */}
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="lg:hidden p-2.5 bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Report New Issue</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button
            onClick={() => navigate('/notifications')}
            className="p-2.5 !bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Citizen</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            
            {/* Contextual Nav */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="flex items-center gap-2 !bg-blue-600/10 text-slate-500 hover:text-white group transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Return to Dashboard</span>
              </button>
            </div>

            {/* Main Form Card - Centered within the wide container */}
            <div className="max-w-4xl mx-auto !bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
              
              {/* Stepper */}
              <div className="flex items-center gap-4 mb-12">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-4 flex-1 last:flex-none">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step > s ? 'bg-blue-600' : 'bg-slate-800'}`}></div>}
                  </div>
                ))}
              </div>

              {/* Step 1: Category */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">What's the problem?</h2>
                    <p className="text-slate-400 text-lg">Select a category that best describes the civic issue.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${
                            formData.category === cat.id 
                              ? '!bg-blue-600/10 border-blue-600 shadow-inner' 
                              : '!bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/60'
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform ${cat.color} ${cat.bg}`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <span className="font-bold text-lg">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Description & Location */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Details & Location</h2>
                    <p className="text-slate-400 text-lg">Help us understand where and what the issue is.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Explain the situation in detail..." 
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[160px] focus:border-blue-500 outline-none text-slate-200 transition-all placeholder:text-slate-700 ring-offset-slate-950 focus:ring-2 focus:ring-blue-500/20" 
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Location Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text" 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Tag your location..." 
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-14 pr-40 focus:border-blue-500 outline-none text-slate-200 transition-all ring-offset-slate-950 focus:ring-2 focus:ring-blue-500/20 font-medium" 
                        />
                        <button 
                          onClick={detectLocation}
                          disabled={locationLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 !bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white disabled:opacity-50"
                        >
                          {locationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapIcon className="w-3.5 h-3.5" />}
                          {locationLoading ? 'Detecting' : 'Use GPS'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setStep(1)} className="flex-1 py-5 !bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all">Back</button>
                    <button 
                      disabled={!formData.description || !formData.location}
                      onClick={() => setStep(3)} 
                      className="flex-[2] py-5 !bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/10"
                    >
                      Continue to Upload
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Evidence */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Upload Evidence</h2>
                    <p className="text-slate-400 text-lg">Add a photo to help verify the report.</p>
                  </div>

                  {!formData.media ? (
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-2 border-dashed border-slate-700 rounded-[2.5rem] p-16 flex flex-col items-center text-center space-y-4 bg-slate-950/30 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-pointer group"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileUpload} 
                      />
                      <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Upload className="w-8 h-8 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-xl">Capture or Upload Photo</p>
                        <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-black">Tap to select</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group rounded-[2.5rem] overflow-hidden border border-slate-800 aspect-video bg-slate-950 flex items-center justify-center">
                      <div className="text-center space-y-2">
                         <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                           <FileText className="w-10 h-10 text-blue-400" />
                         </div>
                         <p className="font-bold text-blue-400 text-lg">{formData.media.name}</p>
                         <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{(formData.media.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button 
                        onClick={() => setFormData({...formData, media: null})}
                        className="absolute top-6 right-6 p-3 bg-rose-500 hover:bg-rose-600 rounded-full shadow-lg transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setStep(2)} className="flex-1 py-5 !bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all">Back</button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting}
                      className="flex-[2] py-5 !bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-2xl font-bold transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                      {isSubmitting ? 'Processing...' : 'Submit Final Report'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Utility Links */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-10 text-slate-500">
               <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black hover:text-white !bg-blue-600/10 transition-all flex items-center gap-2 uppercase tracking-[0.3em]">
                 <LayoutDashboard className="w-4 h-4" /> My Dashboard
               </button>
               <div className="hidden md:block w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
               <button onClick={() => {}} className="text-[10px] font-black hover:text-white !bg-blue-600/10 transition-all flex items-center gap-2 uppercase tracking-[0.3em]">
                 <Search className="w-4 h-4" /> Recent Activity
               </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ReportIssue = () => {
  let inRouter;
  try {
    inRouter = useInRouterContext();
  } catch (e) {
    inRouter = false;
  }
  
  if (!inRouter) {
    return (
      <BrowserRouter>
        <ReportIssueContent />
      </BrowserRouter>
    );
  }
  
  return <ReportIssueContent />;
};

export default ReportIssue;