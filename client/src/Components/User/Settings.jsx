import React, { useState, useEffect } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  PlusCircle, LayoutDashboard, FileText, Bell, Settings as SettingsIcon, 
  LogOut, ArrowLeft, User, Mail, Phone, Lock, ShieldCheck, Smartphone, CheckCircle2,
  Sun, Moon
} from 'lucide-react';

const Settings= () => {
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState('profile'); 
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);
  
  const [formData, setFormData] = useState({
    name: 'John Doe', email: 'john.doe@example.com', phone: '+1 234 567 8900',
    emailAlerts: true, smsAlerts: false, pushAlerts: true
  });

  const handleToggle = (key) => setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  const handleSave = (e) => { e.preventDefault(); alert("Settings saved successfully!"); };

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
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button onClick={() => navigate('/user/notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/user/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left transition-all ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
            <SettingsIcon className="w-5 h-5" /> Settings
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
            <h1 className="text-2xl font-black tracking-tight">Account Settings</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => navigate('/user/notifications')} className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
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
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Settings Nav */}
              <div className="w-full md:w-64 shrink-0 space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'profile' ? (isDark ? '!bg-slate-800 text-white' : '!bg-white shadow-sm text-blue-700') : (isDark ? '!bg-slate-800 text-slate-400 hover:!bg-slate-800/80 hover:text-slate-200' : '!bg-white text-slate-600 hover:!bg-white hover:text-slate-900')}`}>
                  <User className="w-5 h-5" /> Personal Profile
                </button>
                <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'notifications' ? (isDark ? '!bg-slate-800 text-white' : '!bg-white shadow-sm text-blue-700') : (isDark ? '!bg-slate-800 text-slate-400 hover:!bg-slate-800/80 hover:text-slate-200' : '!bg-white text-slate-600 hover:!bg-white hover:text-slate-900')}`}>
                  <Bell className="w-5 h-5" /> Notifications
                </button>
                <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'security' ? (isDark ? '!bg-slate-800 text-white' : '!bg-white shadow-sm text-blue-700') : (isDark ? '!bg-slate-800 text-slate-400 hover:!bg-slate-800/80 hover:text-slate-200' : '!bg-white text-slate-600 hover:!bg-white hover:text-slate-900')}`}>
                  <ShieldCheck className="w-5 h-5" /> Security & Passwords
                </button>
              </div>

              {/* Settings Content Area */}
              <div className={`flex-1 border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-xl shadow-slate-200/50'}`}>
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">Personal Profile</h2>
                      <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your personal details and contact information.</p>
                    </div>

                    <div className={`flex items-center gap-6 pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="w-24 h-24 !bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center font-bold text-3xl text-white shadow-lg shadow-blue-900/20">
                        JD
                      </div>
                      <div className="space-y-2">
                        <button type="button" className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-white border border-slate-200/60 hover:!bg-slate-50 text-slate-700'}`}>Change Avatar</button>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Max file size 2MB</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900 focus:!bg-white'}`} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900 focus:!bg-white'}`} />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900 focus:!bg-white'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-xl ${isDark ? '!bg-blue-600 hover:!bg-blue-500 text-white shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-600/30'}`}>
                        <CheckCircle2 className="w-5 h-5" /> Save Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">Notification Preferences</h2>
                      <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Control how and when you receive alerts from CivicConnect.</p>
                    </div>

                    <div className="space-y-6">
                      {[{key: 'emailAlerts', icon: Mail, title: 'Email Alerts', desc: 'Receive updates directly to your inbox.', color: 'blue'},
                        {key: 'smsAlerts', icon: Smartphone, title: 'SMS Alerts', desc: 'Get text messages for critical status changes.', color: 'emerald'},
                        {key: 'pushAlerts', icon: Bell, title: 'Push Notifications', desc: 'In-app notifications and alerts.', color: 'purple'}].map(item => (
                        <div key={item.key} className={`flex items-center justify-between p-6 border rounded-[2rem] group transition-all duration-300 hover:-translate-y-1 shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800 hover:border-slate-700' : '!bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md'}`}>
                          <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 !bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400`}>
                              <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{item.title}</h4>
                              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                            </div>
                          </div>
                          <button onClick={() => handleToggle(item.key)} className={`w-14 h-8 rounded-full transition-colors relative flex items-center shadow-inner ${formData[item.key] ? `!bg-${item.color}-600` : (isDark ? '!bg-slate-800' : '!bg-slate-200')}`}>
                            <div className={`w-6 h-6 !bg-white rounded-full transition-transform absolute shadow-md ${formData[item.key] ? 'translate-x-7' : 'translate-x-1'}`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight mb-2">Security Settings</h2>
                      <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your password and secure your account.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input type="password" placeholder="••••••••" className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900 focus:!bg-white'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input type="password" placeholder="New secure password" className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900 focus:!bg-white'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input type="password" placeholder="Repeat new password" className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900 focus:!bg-white'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-xl ${isDark ? '!bg-blue-600 hover:!bg-blue-500 text-white shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-600/30'}`}>
                        Update Password
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;