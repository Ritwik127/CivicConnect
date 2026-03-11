import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, Camera, Activity, MapPin, 
  Map as MapIcon, Upload, X, CheckCircle2, Loader2, Info, 
  Sun, Moon, ArrowLeft, Copy, Clock, Check, Shield, Search, FileText, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnonymousReport = ({ onNavigateToTrack, onNavigateHome, isDark: propIsDark, toggleTheme: propToggleTheme }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [localIsDark, setLocalIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [formData, setFormData] = useState({ category: '', description: '', location: '', coordinates: null, media: null });
  
  const isDark = typeof propIsDark === 'boolean' ? propIsDark : localIsDark;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    setTimeout(() => setShowLoginPopup(true), 300);
  }, []);

  const categories = [
    { id: 'pothole', label: 'Pothole', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', hover: 'hover:border-orange-400/70 hover:bg-orange-500/5' },
    { id: 'garbage', label: 'Garbage', icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-500/10', hover: 'hover:border-emerald-400/70 hover:bg-emerald-500/5' },
    { id: 'street-light', label: 'Street Light', icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10', hover: 'hover:border-yellow-400/70 hover:bg-yellow-500/5' },
    { id: 'water', label: 'Water Leak', icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-500/10', hover: 'hover:border-cyan-400/70 hover:bg-cyan-500/5' },
    { id: 'vandalism', label: 'Vandalism', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-500/10', hover: 'hover:border-rose-400/70 hover:bg-rose-500/5' },
    { id: 'other', label: 'Other Issue', icon: Info, color: 'text-slate-400', bg: 'bg-slate-400/10', hover: 'hover:border-slate-400/70 hover:bg-slate-400/5' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, media: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({ 
            ...formData, 
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude },
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
          });
          setLocationLoading(false);
        },
        () => setLocationLoading(false)
      );
    } else {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    const randomId = "ANON-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    setTrackingId(randomId);
    setIsSubmitting(false);
    setStep(4);
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = trackingId;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const handleNavigateToTrack = () => {
    if (onNavigateToTrack) onNavigateToTrack();
    else navigate('/track-status');
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) onNavigateHome();
    else navigate('/');
  };

  const steps = [
    { num: 1, label: 'Category' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Evidence' }
  ];

  return (
    <div className={`h-screen flex flex-col transition-colors duration-300 overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <nav className={`shrink-0 z-50 border-b ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-xl`}>
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleNavigateHome}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all font-bold text-sm ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </button>
            <div className={`h-6 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'} hidden md:block`} />
            <div className="hidden md:block">
              <h1 className="text-sm font-bold leading-none mb-1">Anonymous Report</h1>
              <p className={`text-[10px] ${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>End-to-End Encrypted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Shield className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Identity Hidden</span>
             </div>
             <button 
              onClick={propToggleTheme || (() => setLocalIsDark(!isDark))}
              className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 overflow-hidden">
        <div className="w-full max-w-3xl flex flex-col h-full max-h-[750px]">
          
          {/* Progress Indicator - Horizontal Top */}
          {step < 4 && (
            <div className="mb-6 shrink-0">
              <div className="flex items-center justify-between mb-2">
                {steps.map((s, idx) => (
                  <React.Fragment key={s.num}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all border-2 ${
                        step >= s.num 
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
                          : (isDark ? 'bg-slate-900 text-slate-500 border-slate-800' : 'bg-white text-slate-400 border-slate-200')
                      }`}>
                        {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline ${step >= s.num ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 rounded-full ${step > s.num ? 'bg-emerald-500' : (isDark ? 'bg-slate-800' : 'bg-slate-200')}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1">
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight">Select Report Type</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Choose a category to begin your encrypted submission.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setFormData({ ...formData, category: cat.id }); setStep(2); }}
                      className={`group p-[1.375rem] sm:p-[1.625rem] rounded-[1.6rem] border-2 transition-all active:scale-95 flex flex-col items-center gap-[0.875rem] relative overflow-hidden hover:-translate-y-1 ${
                        formData.category === cat.id 
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_12px_30px_rgba(16,185,129,0.15)]' 
                          : (isDark ? `border-slate-800 bg-slate-900/60 ${cat.hover}` : `border-slate-200 bg-white ${cat.hover} hover:shadow-lg`)
                      }`}
                    >
                      <div className={`w-[3.25rem] h-[3.25rem] rounded-[0.85rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${cat.bg} ${cat.color} ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                        <cat.icon className="w-[1.625rem] h-[1.625rem]" />
                      </div>
                      <div className="relative z-10 text-center">
                        <h3 className="font-bold text-base sm:text-lg tracking-tight">{cat.label}</h3>
                        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tap to continue</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-all ${formData.category === cat.id ? 'opacity-100 translate-x-0 text-emerald-500' : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Description & Location */}
            {step === 2 && (
              <div className="space-y-6.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-1 tracking-tight">Provide Context</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Details help authorities respond effectively.</p>
                </div>

                <div className="space-y-4.5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Description</label>
                    <textarea
                      placeholder="What's happening? Be as specific as possible..."
                      className={`w-full h-36 p-[1.05rem] rounded-2xl border-2 transition-all resize-none focus:border-emerald-500 outline-none text-sm ${
                        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Street address or vicinity..."
                        className={`w-full py-[1.05rem] pl-4 pr-12 rounded-2xl border-2 transition-all focus:border-emerald-500 outline-none text-sm ${
                          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'
                        }`}
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                      <button 
                        onClick={getLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                      >
                        {locationLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <MapIcon className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}>Back</button>
                    <button 
                      onClick={() => setStep(3)} 
                      disabled={!formData.description || !formData.location}
                      className={`flex-[2] py-4 text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-sm transition-all disabled:opacity-50`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Media Upload */}
            {step === 3 && (
              <div className="space-y-6.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-center">
                  <h2 className="text-3xl font-black mb-1 tracking-tight">Visual Evidence</h2>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Photos greatly assist in verification.</p>
                </div>

                {!formData.media ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all group ${
                      isDark ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm'
                    }`}
                  >
                    <div className="w-[3.25rem] h-[3.25rem] bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Camera className="w-6.5 h-6.5 text-emerald-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-base">Upload Photo</p>
                      <p className="text-[10px] text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </div>
                ) : (
                  <div className="relative h-[17rem] rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500/20">
                    <img src={formData.media} alt="Upload" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setFormData({...formData, media: null})} 
                      className="absolute top-3 right-3 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}>Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting} 
                    className={`flex-[2] py-4 text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2`}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
              <div className="animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col justify-center">
                <div className={`p-8 sm:p-12 rounded-[32px] text-center space-y-8 relative overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
                  <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 rotate-3">
                      <CheckCircle2 className="w-8 h-8 text-white -rotate-3" />
                    </div>
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Report Filed!</h2>
                    <p className={`max-w-xs mx-auto text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Your report is being processed. Save your Tracking ID below.
                    </p>
                  </div>

                  <div className={`max-w-sm mx-auto p-6 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Tracking ID</span>
                     <div className="text-2xl font-mono font-black tracking-wider text-emerald-500">
                        {trackingId}
                     </div>
                     <button 
                        onClick={copyToClipboard}
                        className="mt-1 flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-500/20 transition-all"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                    <button 
                      onClick={handleNavigateToTrack}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Track Progress
                    </button>
                    <button 
                      onClick={() => { setStep(1); setTrackingId(null); setFormData({ category: '', description: '', location: '', coordinates: null, media: null }); }}
                      className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Security Note */}
          {step < 4 && (
             <div className="shrink-0 pt-4 flex items-center justify-center gap-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
                <div className="flex items-center gap-1.5 opacity-50">
                   <Shield className="w-3 h-3" />
                   <span className="text-[10px] font-bold uppercase tracking-tighter">Zero-Knowledge encryption</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-400 opacity-30" />
                <div className="flex items-center gap-1.5 opacity-50">
                   <Activity className="w-3 h-3" />
                   <span className="text-[10px] font-bold uppercase tracking-tighter">Proxied Node active</span>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* Login Popup Modal */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm p-8 rounded-3xl border-2 space-y-6 animate-in fade-in zoom-in-95 duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-2xl'}`}>
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-black tracking-tight">Keep Track of Your Reports</h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Login to monitor all your reports in real-time and get instant updates on their resolution status.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  navigate('/login', { state: { role: 'citizen' } });
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                Login Now
              </button>
              <button 
                onClick={() => setShowLoginPopup(false)}
                className={`w-full py-3 font-bold rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                Report Anonymously
              </button>
            </div>

            <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              You can always login later to track your reports.
            </p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
      `}} />
    </div>
  );
};

export default AnonymousReport;