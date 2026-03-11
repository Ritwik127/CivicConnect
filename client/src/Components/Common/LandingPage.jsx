import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, MapPin, ShieldCheck, ArrowRight, BarChart3, 
  Users, UserCircle2, Building2, HardHat, CheckCircle2,
  Activity, AlertTriangle, Search, ChevronRight, Sun, Moon
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  // Sync state with localStorage for consistency across pages
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogin = (role = 'citizen') => {
    navigate('/login', { state: { role } });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className={`w-full min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500 ${isDark ? '!bg-[#0f172a] text-white' : '!bg-slate-50 text-slate-800'}`}>
        
        {/* Fixed Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-6 py-4 transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 rounded-lg shadow-lg shadow-blue-500/30">
                <span className="font-bold text-xl text-white">C</span>
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>CivicConnect</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 !bg-transparent">
              <button onClick={() => scrollToSection('home')} className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${isDark ? '!bg-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : '!bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>Home</button>
              <button onClick={() => scrollToSection('how-it-works')} className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${isDark ? '!bg-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : '!bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>How It Works</button>
              <button onClick={() => scrollToSection('about')} className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${isDark ? '!bg-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : '!bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>About</button>
              <button onClick={() => navigate('/trackissue')} className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all ${isDark ? '!bg-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : '!bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'}`}>Track Issue</button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl transition-all border ${isDark ? '!bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : '!bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'}`}
                aria-label="Toggle Dark Mode"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => handleLogin('citizen')}
                className={`text-sm font-bold px-5 py-2.5 rounded-xl hidden sm:block transition-all ${isDark ? '!bg-slate-800 text-white hover:bg-slate-700' : '!bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Login
              </button>
              <button onClick={() => navigate('/anonymousreport')} className={`text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg ${isDark ? '!bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20' : '!bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5'}`}>
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Report Issue</span>
                <span className="sm:hidden">Report</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content Wrapper (Add padding for fixed nav) */}
        <main className="pt-10">
          
          {/* Hero Section */}
          <section id="home" className="relative overflow-hidden pt-16 pb-16 pl-6 pr-6">
            {/* Ambient Backgrounds for Light/Dark Mode */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] !bg-blue-600/20 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] !bg-purple-600/20 rounded-full blur-[120px]"></div>
            </div>
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] !bg-orange-400/10 rounded-full blur-[120px]"></div>
              <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] !bg-purple-400/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-6 text-center lg:text-left -mt-4 lg:-mt-6">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mx-auto lg:mx-0 shadow-sm ${isDark ? '!bg-blue-500/10 border-blue-500/20 text-blue-400' : '!bg-white border-blue-200 text-blue-700'}`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full !bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 !bg-blue-500"></span>
                  </span>
                  AI-Powered Civic Management
                </div>
                <h1 className={`text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Report Issues. <br />
                  <span className={`bg-clip-text text-transparent !bg-gradient-to-r ${isDark ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>Track Resolution.</span> <br />
                  Improve City.
                </h1>
                <p className={`text-lg max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  A transparent, AI-driven platform connecting citizens with the government to solve urban problems like potholes, waste, and lighting in real-time.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-1">
                  <button onClick={() => navigate('/anonymousreport')} className={`text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg ${isDark ? '!bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20' : '!bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5'}`}>
                    <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Report an Issue
                  </button>
                  <button onClick={() => navigate('/trackissue')} className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all group border shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white' : '!bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700'}`}>
                    <Search className={`w-5 h-5 transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                    Track Complaint
                  </button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-[92%] perspective-1000">
                <div className={`border rounded-[2.5rem] p-8 backdrop-blur-md transition-all duration-500 transform hover:scale-[1.02] ${isDark ? '!bg-slate-800/40 border-slate-700 shadow-2xl shadow-black/40' : '!bg-white/80 border-slate-200/60 shadow-2xl shadow-blue-900/5'}`}>
                  <div className="flex justify-between items-start mb-12">
                    <div className={`border p-4 rounded-2xl flex items-center gap-4 animate-pulse shadow-sm ${isDark ? '!bg-white/5 border-white/10' : '!bg-white border-slate-100 shadow-emerald-500/5'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? '!bg-emerald-500/20' : '!bg-emerald-100'}`}>
                        <CheckCircle2 className={`w-6 h-6 ${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} />
                      </div>
                      <div>
                        <div className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</div>
                        <div className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Pothole Repaired</div>
                      </div>
                    </div>
                  </div>
                  <div className={`w-[98%] mx-auto aspect-video rounded-3xl border flex items-center justify-center mb-8 transition-colors duration-300 relative overflow-hidden ${isDark ? '!bg-slate-900/50 border-slate-700' : '!bg-slate-100/50 border-slate-200'}`}>
                     <div className={`absolute inset-0 !bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] !bg-center !bg-cover opacity-20 ${isDark ? 'invert' : ''}`}></div>
                     <MapPin className={`w-16 h-16 relative z-10 ${isDark ? 'text-slate-700 opacity-50' : 'text-blue-200 opacity-80'}`} />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 !bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,1)] animate-ping"></div>
                  </div>
                  <div className="flex justify-end">
                    <div className={`border p-4 rounded-2xl flex items-center gap-4 shadow-sm ${isDark ? '!bg-white/5 border-white/10' : '!bg-white border-slate-100 shadow-orange-500/5'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? '!bg-orange-500/20' : '!bg-orange-100'}`}>
                        <Activity className={`w-6 h-6 ${isDark ? 'text-orange-500' : 'text-orange-600'}`} />
                      </div>
                      <div>
                        <div className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Avg Response</div>
                        <div className={`font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>24 Hours</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Soft gradient fade at bottom */}
            <div className={`absolute bottom-0 left-0 w-full h-40 !bg-gradient-to-t to-transparent transition-colors duration-300 pointer-events-none ${isDark ? 'from-[#0f172a]' : 'from-slate-50'}`}></div>
          </section>

          {/* Why This System Needed */}
          <section className="pt-10 pb-24 pl-6 pr-6 relative">
            <div>
              <div className="text-center space-y-4 mb-16">
                <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Why This System is Needed?</h2>
                <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Traditional reporting is slow, opaque, and uncoordinated. We tackle the most common civic issues head-on with transparency.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Potholes', desc: 'Prevent accidents and traffic blocks.', darkColor: 'text-orange-500', lightColor: 'text-orange-600', darkBg: '!bg-orange-500/10', lightBg: '!bg-orange-100' },
                  { title: 'Garbage Overflow', desc: 'Maintain hygiene and city aesthetics.', darkColor: 'text-emerald-500', lightColor: 'text-emerald-600', darkBg: '!bg-emerald-500/10', lightBg: '!bg-emerald-100' },
                  { title: 'Water Logging', desc: 'Clear storm drains rapidly.', darkColor: 'text-blue-500', lightColor: 'text-blue-600', darkBg: '!bg-blue-500/10', lightBg: '!bg-blue-100' },
                  { title: 'Streetlights', desc: 'Keep neighborhoods safe at night.', darkColor: 'text-yellow-500', lightColor: 'text-yellow-600', darkBg: '!bg-yellow-500/10', lightBg: '!bg-yellow-100' },
                ].map((item, i) => (
                  <div key={i} className={`p-8 rounded-[2rem] text-center group transition-all duration-300 ${isDark ? '!bg-slate-800/40 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/80' : '!bg-white border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-2 hover:border-blue-200'}`}>
                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isDark ? item.darkBg : item.lightBg}`}>
                      <div className={`w-8 h-1.5 !bg-current rounded-full ${isDark ? item.darkColor : item.lightColor}`}></div>
                    </div>
                    <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className={`py-24 pl-6 pr-6 relative overflow-hidden transition-colors duration-300 ${isDark ? '!bg-slate-900/30 border-y border-slate-800' : '!bg-blue-50/50 border-y border-blue-100/50'}`}>
            <div>
              <div className="text-center space-y-4 mb-20">
                <span className={`font-black text-xs uppercase tracking-widest ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>Workflow</span>
                <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>How It Works</h2>
              </div>
              
              <div className="relative">
                <div className={`hidden lg:block absolute top-10 left-[10%] w-[80%] h-1 rounded-full transition-colors duration-300 ${isDark ? '!bg-slate-800' : '!bg-blue-100'}`}></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 text-center relative z-10">
                  {[
                    { id: '01', icon: Camera, title: 'Report', desc: 'Citizen snaps a photo & tags location.' },
                    { id: '02', icon: Activity, title: 'AI Routing', desc: 'System classifies & assigns department.' },
                    { id: '03', icon: UserCircle2, title: 'Assignment', desc: 'Field worker gets the task on app.' },
                    { id: '04', icon: CheckCircle2, title: 'Resolution', desc: 'Worker uploads "After" photo proof.' },
                    { id: '05', icon: AlertTriangle, title: 'Notification', desc: 'Citizen gets alerted of fix.' },
                  ].map((step, i) => (
                    <div key={i} className="space-y-6 relative group">
                      <div className="relative inline-block">
                        <div className="absolute -top-3 -right-3 w-8 h-8 !bg-blue-600 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg shadow-blue-600/30 z-10 group-hover:scale-110 transition-transform">
                          {step.id}
                        </div>
                        <div className={`w-20 h-20 border-2 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:-translate-y-2 ${isDark ? '!bg-slate-800 border-slate-700 text-blue-400 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' : '!bg-white border-blue-100 text-blue-600 shadow-xl shadow-blue-100 group-hover:border-blue-300'}`}>
                          <step.icon className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                        <p className={`text-sm leading-relaxed px-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Built for Transparency */}
          <section className="py-24 pl-6 pr-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <h2 className={`text-4xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Built for Transparency & Speed</h2>
                <div className="space-y-8">
                  {[
                    { title: 'AI-Based Classification', desc: 'Automatically detects issue type from images using Computer Vision.' },
                    { title: 'Real-Time Tracking', desc: 'Track the exact status of your complaint from submission to closure.' },
                    { title: 'Proof-of-Work', desc: 'Mandatory before/after photos ensure the work is actually done.' },
                    { title: 'Department Dashboards', desc: 'Dedicated analytics for government officials to monitor performance.' },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="mt-1">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDark ? '!bg-blue-500/20 group-hover:bg-blue-500/40' : '!bg-blue-100 group-hover:bg-blue-200'}`}>
                          <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h4 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h4>
                        <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6 mt-12">
                  <div className={`border p-8 rounded-[2rem] space-y-4 transition-all duration-300 hover:-translate-y-1 ${isDark ? '!bg-slate-800/40 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80' : '!bg-white border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-blue-200'}`}>
                    <BarChart3 className={`w-10 h-10 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                    <div>
                      <div className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>85%</div>
                      <div className={`text-xs uppercase tracking-widest font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Faster Resolution</div>
                    </div>
                  </div>
                  <div className={`border p-8 rounded-[2rem] space-y-4 transition-all duration-300 hover:-translate-y-1 ${isDark ? '!bg-slate-800/40 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800/80' : '!bg-white border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-purple-200'}`}>
                    <Users className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                    <div>
                      <div className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>50k+</div>
                      <div className={`text-xs uppercase tracking-widest font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Citizens</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={`border p-8 rounded-[2rem] space-y-4 transition-all duration-300 hover:-translate-y-1 ${isDark ? '!bg-slate-800/40 border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80' : '!bg-white border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-emerald-200'}`}>
                    <ShieldCheck className={`w-10 h-10 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <div>
                      <div className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>100%</div>
                      <div className={`text-xs uppercase tracking-widest font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Fixes</div>
                    </div>
                  </div>
                  <div className={`border p-8 rounded-[2rem] space-y-4 transition-all duration-300 hover:-translate-y-1 ${isDark ? '!bg-slate-800/40 border-slate-700 hover:border-rose-500/50 hover:bg-slate-800/80' : '!bg-white border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-rose-200'}`}>
                    <MapPin className={`w-10 h-10 ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
                    <div>
                      <div className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>12k</div>
                      <div className={`text-xs uppercase tracking-widest font-bold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Issues Solved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Who is this for? */}
          <section className={`py-24 pl-6 pr-6 relative transition-colors duration-300 ${isDark ? '!bg-slate-900/30 border-y border-slate-800' : '!bg-slate-100/50 border-y border-slate-200/80'}`}>
            <div>
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Who is this for?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    roleId: 'citizen',
                    icon: UserCircle2, 
                    title: 'Citizens', 
                    desc: 'Report issues, track status, and rate the resolution quality.', 
                    btn: 'Login as Citizen', 
                    darkColor: 'text-blue-400', 
                    lightColor: 'text-blue-600', 
                    darkBg: '!bg-blue-500/10',
                    lightBg: '!bg-blue-50'
                  },
                  { 
                    roleId: 'admin',
                    icon: Building2, 
                    title: 'Government', 
                    desc: 'Manage departments, view analytics, and oversee zone performance.', 
                    btn: 'Official Login', 
                    darkColor: 'text-purple-400', 
                    lightColor: 'text-purple-600', 
                    darkBg: '!bg-purple-500/10',
                    lightBg: '!bg-purple-50'
                  },
                  { 
                    roleId: 'worker',
                    icon: HardHat, 
                    title: 'Field Workers', 
                    desc: 'Receive tasks, navigate to locations, and upload proof of work.', 
                    btn: 'Worker Login', 
                    darkColor: 'text-orange-400', 
                    lightColor: 'text-orange-600', 
                    darkBg: '!bg-orange-500/10',
                    lightBg: '!bg-orange-50'
                  },
                ].map((role, i) => (
                  <div key={i} className={`border p-10 rounded-[2.5rem] text-center space-y-6 transition-all duration-300 flex flex-col items-center group hover:-translate-y-2 hover:shadow-xl ${isDark ? '!bg-slate-800/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800/80' : '!bg-white border-slate-200/60 shadow-lg shadow-slate-200/40 hover:border-slate-300'}`}>
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isDark ? role.darkBg : role.lightBg} ${isDark ? role.darkColor : role.lightColor}`}>
                      <role.icon className="w-10 h-10" />
                    </div>
                    <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{role.title}</h3>
                    <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {role.desc}
                    </p>
                    <button 
                      onClick={() => handleLogin(role.roleId)}
                      className={`text-sm font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 group/btn mt-auto ${isDark ? '!bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-700' : '!bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'}`}
                    >
                      {role.btn}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-32 pl-6 pr-6 relative overflow-hidden">
            <div className={`absolute inset-0 ${isDark ? '!bg-blue-900' : '!bg-blue-600'}`}>
               <div className="absolute inset-0 opacity-10 !bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px]"></div>
            </div>
            <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
                Be a Responsible Citizen. <br /> Help Improve Your City.
              </h2>
              <p className="text-blue-100 text-xl font-medium max-w-2xl mx-auto">
                Join thousands of others making a difference today. It only takes a minute to report.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button onClick={() => navigate('/user/anonymousreport')} className={`text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg ${isDark ? '!bg-orange-500 text-white border border-orange-500/20 hover:bg-orange-500/20' : '!bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5'}`}>
                  Report an Issue Now
                </button>
                <button 
                  onClick={() => handleLogin('citizen')}
                  className={`px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 border ${isDark ? '!bg-slate-900 border-slate-800 text-white hover:bg-slate-800' : '!bg-blue-700 border-blue-600 text-white hover:bg-blue-800'}`}
                >
                  Login to Dashboard
                </button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className={`py-24 pl-6 pr-6 transition-colors duration-300 ${isDark ? '!bg-[#0f172a]' : '!bg-white'}`}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="w-16 h-1.5 !bg-blue-600 mx-auto rounded-full"></div>
              <h2 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>About The Initiative</h2>
              <p className={`leading-relaxed text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                The <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Crowdsourced Civic Issue Reporting & Resolution System</span> is a digital initiative aimed at bridging the gap between municipal bodies and citizens. By leveraging Artificial Intelligence, Cloud Computing, and Geo-tagging, we ensure that no civic grievance goes unheard. Our mission is to build cleaner, safer, and smarter cities through transparency and community participation.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className={`border-t pt-20 pb-10 pl-6 pr-6 transition-colors duration-300 ${isDark ? '!bg-[#0f172a] border-slate-800' : '!bg-slate-50 border-slate-200'}`}>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-1.5 rounded-lg">
                      <span className="font-bold text-xl text-white">C</span>
                    </div>
                    <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>CivicConnect</span>
                  </div>
                  <p className={`leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Empowering citizens to build better cities, one report at a time.
                  </p>
                </div>

                <div className="space-y-6">
                  <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick Links</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => scrollToSection('home')} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>Home</button></li>
                    <li><button onClick={() => navigate('/anonymousreport')} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>Report Issue</button></li>
                    <li><button onClick={() => navigate('/trackissue')} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>Track Status</button></li>
                    <li><button onClick={() => handleLogin('citizen')} className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>Login</button></li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
                  <ul className="space-y-4">
                    <li><button
                    onClick={() => navigate('/user/dashboard')}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>Privacy Policy</button></li>
                    <li><button
                    onClick={() => navigate('/admin/dashboard')}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>Terms of Use</button></li>
                    <li><button
                    onClick={() => navigate('/worker/dashboard')}
                    className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'}`}>SLA Guidelines</button></li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Contact</h4>
                  <ul className={`space-y-4 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <li className="flex items-start gap-3">
                      <MapPin className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span>Municipal Corp HQ, City Center</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Activity className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span>Helpline: 1800-CIVIC-FIX</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className={`pt-10 border-t text-center text-sm font-medium ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                © 2026 CivicConnect Initiative. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;