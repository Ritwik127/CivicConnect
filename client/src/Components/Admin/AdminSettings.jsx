import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  ShieldCheck,
  BellRing,
  Blocks,
  Power,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Smartphone,
  Mail,
  Key,
  Database,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [activeTab, setActiveTab] = useState('auth');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  // Mock Settings State
  const [settings, setSettings] = useState({
    mfaRequired: true,
    complexPasswords: true,
    sessionTimeout: '30',
    emailGateway: 'smtp.sendgrid.net',
    smsGateway: 'Twilio',
    globalAlerts: true,
    maintenanceMode: false,
    maintenanceMsg: 'The CivicConnect admin portal is currently undergoing scheduled maintenance. Please check back in 2 hours.'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("System settings successfully updated.");
  };

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds (Purple theme for Admin) */}
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
          <button onClick={() => navigate('/admin/issues')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
            <h1 className="text-2xl font-black tracking-tight sm:block">Command Center</h1>
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
            
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-black tracking-tight">System Settings & Security</h2>
              <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure global platform policies, integrations, and operational modes.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Settings Nav Sidebar */}
              <div className="w-full lg:w-72 shrink-0 space-y-2">
                <button 
                  onClick={() => setActiveTab('auth')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'auth' ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-white shadow-sm text-purple-700') : (isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-900/50 hover:text-slate-200' : '!bg-white text-slate-600 hover:!bg-white hover:text-slate-900')}`}
                >
                  <ShieldCheck className={`w-5 h-5 ${activeTab === 'auth' ? (isDark ? 'text-purple-400' : 'text-purple-600') : ''}`} /> Auth & Security
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'notifications' ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-white shadow-sm text-purple-700') : (isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-900/50 hover:text-slate-200' : '!bg-white text-slate-600 hover:!bg-white hover:text-slate-900')}`}
                >
                  <BellRing className={`w-5 h-5 ${activeTab === 'notifications' ? (isDark ? 'text-purple-400' : 'text-purple-600') : ''}`} /> Notification Rules
                </button>
                <button 
                  onClick={() => setActiveTab('integrations')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'integrations' ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-white shadow-sm text-purple-700') : (isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-900/50 hover:text-slate-200' : '!bg-white text-slate-600 hover:!bg-white hover:text-slate-900')}`}
                >
                  <Blocks className={`w-5 h-5 ${activeTab === 'integrations' ? (isDark ? 'text-purple-400' : 'text-purple-600') : ''}`} /> Integrations & APIs
                </button>
                <div className={`h-px w-full my-4 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                <button 
                  onClick={() => setActiveTab('maintenance')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'maintenance' ? (isDark ? '!bg-rose-500/10 text-rose-500 border border-rose-500/20' : '!bg-rose-50 text-rose-600 border border-rose-200') : (isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-rose-500/5 hover:text-rose-400' : '!bg-rose-50 text-rose-600 hover:!bg-rose-100')}`}
                >
                  <Power className="w-5 h-5" /> Maintenance Mode
                </button>
              </div>

              {/* Settings Content Area */}
              <div className={`flex-1 border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl min-h-[600px] transition-all duration-500 ${isDark ? '!bg-slate-900/40 border-slate-800/80 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                
                {/* --- TAB: AUTH POLICIES --- */}
                {activeTab === 'auth' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        <ShieldCheck className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Authentication Policies
                      </h3>
                      <p className={`mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage login security requirements for all government user accounts.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Toggle: MFA */}
                      <div className={`flex items-center justify-between p-6 border rounded-[2rem] transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? '!bg-purple-500/10 text-purple-400' : '!bg-purple-100 text-purple-600'}`}>
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Enforce Two-Factor Authentication (2FA)</h4>
                            <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Require all admins and department heads to use an authenticator app.</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleToggle('mfaRequired')} className={`w-14 h-8 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner ${settings.mfaRequired ? '!bg-purple-500' : (isDark ? '!bg-slate-700' : '!bg-slate-300')}`}>
                          <div className={`w-6 h-6 !bg-white rounded-full transition-transform absolute shadow-md ${settings.mfaRequired ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                      </div>

                      {/* Toggle: Complex Passwords */}
                      <div className={`flex items-center justify-between p-6 border rounded-[2rem] transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? '!bg-blue-500/10 text-blue-400' : '!bg-blue-100 text-blue-600'}`}>
                            <Key className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Require Complex Passwords</h4>
                            <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Enforce passwords with min 12 chars, symbols, and alphanumeric combo.</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => handleToggle('complexPasswords')} className={`w-14 h-8 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner ${settings.complexPasswords ? '!bg-blue-500' : (isDark ? '!bg-slate-700' : '!bg-slate-300')}`}>
                          <div className={`w-6 h-6 !bg-white rounded-full transition-transform absolute shadow-md ${settings.complexPasswords ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                      </div>

                      {/* Select: Session Timeout */}
                      <div className={`p-6 border rounded-[2rem] space-y-4 transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="flex items-center gap-2">
                          <Clock className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          <h4 className="font-bold text-lg">Idle Session Timeout</h4>
                        </div>
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Automatically log out users after a period of inactivity.</p>
                        <select 
                          value={settings.sessionTimeout}
                          onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                          className={`w-full md:w-1/2 appearance-none border rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all shadow-sm ${isDark ? '!bg-slate-900 border-slate-700 focus:border-purple-500 text-white' : '!bg-white border-slate-300 focus:border-purple-600 text-slate-900'}`}
                        >
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="60">1 Hour</option>
                          <option value="never">Never (Not Recommended)</option>
                        </select>
                      </div>
                    </div>

                    <div className={`pt-6 flex justify-end border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button type="submit" className={`px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-[#a855f7] hover:!bg-[#9333ea] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                        <Save className="w-5 h-5" /> Save Policies
                      </button>
                    </div>
                  </form>
                )}

                {/* --- TAB: NOTIFICATION RULES --- */}
                {activeTab === 'notifications' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`border-b pb-6 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        <BellRing className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Notification Rules
                      </h3>
                      <p className={`mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure system-wide alert thresholds and delivery gateways.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email SMTP Gateway</label>
                        <div className="relative group shadow-sm rounded-2xl">
                          <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                          <input 
                            type="text" 
                            value={settings.emailGateway}
                            onChange={(e) => setSettings({...settings, emailGateway: e.target.value})}
                            className={`w-full border rounded-[1.5rem] py-3.5 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">SMS Provider</label>
                        <div className="relative group shadow-sm rounded-2xl">
                          <Smartphone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                          <input 
                            type="text" 
                            value={settings.smsGateway}
                            onChange={(e) => setSettings({...settings, smsGateway: e.target.value})}
                            className={`w-full border rounded-[1.5rem] py-3.5 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Toggle: Global SLA Alerts */}
                    <div className={`flex items-center justify-between p-6 border rounded-[2rem] transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? '!bg-amber-500/10 text-amber-400' : '!bg-amber-100 text-amber-600'}`}>
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Global SLA Breach Alerts</h4>
                          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Automatically notify City Admin and Dept Head when any ticket breaches its SLA.</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleToggle('globalAlerts')} className={`w-14 h-8 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner ${settings.globalAlerts ? '!bg-amber-500' : (isDark ? '!bg-slate-700' : '!bg-slate-300')}`}>
                        <div className={`w-6 h-6 !bg-white rounded-full transition-transform absolute shadow-md ${settings.globalAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </button>
                    </div>

                    <div className={`pt-6 flex justify-end border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <button type="submit" className={`px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-[#a855f7] hover:!bg-[#9333ea] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                        <Save className="w-5 h-5" /> Save Rules
                      </button>
                    </div>
                  </form>
                )}

                {/* --- TAB: INTEGRATIONS --- */}
                {activeTab === 'integrations' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`border-b pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                          <Blocks className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Integrations & APIs
                        </h3>
                        <p className={`mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage external services connected to CivicConnect.</p>
                      </div>
                      <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-white border border-slate-200/60 hover:!bg-slate-50 text-slate-700'}`}>
                        Add Webhook
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Integration Card 1 */}
                      <div className={`border rounded-[2rem] p-6 flex flex-col h-full relative overflow-hidden group transition-all shadow-sm hover:shadow-md ${isDark ? '!bg-slate-950/50 border-slate-800 hover:border-slate-700' : '!bg-white border-slate-200 hover:border-blue-300'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isDark ? '!bg-slate-900 border-slate-700' : '!bg-slate-50 border-slate-200'}`}>
                              <Globe className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <h4 className="font-bold text-lg">Google Maps API</h4>
                          </div>
                          <span className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm ${isDark ? '!bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : '!bg-emerald-50 text-emerald-600 border-emerald-200'}`}>Connected</span>
                        </div>
                        <p className={`text-sm mb-6 flex-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Provides geospatial mapping for issue location tagging and admin heatmaps.</p>
                        <button className={`w-full py-3 border rounded-xl text-sm font-bold transition-all ${isDark ? '!bg-slate-900 hover:!bg-slate-800 border-slate-700 text-slate-300' : '!bg-slate-50 hover:!bg-slate-100 border-slate-200 text-slate-700'}`}>
                          Configure API Keys
                        </button>
                      </div>

                      {/* Integration Card 2 */}
                      <div className={`border rounded-[2rem] p-6 flex flex-col h-full relative overflow-hidden group transition-all shadow-sm hover:shadow-md ${isDark ? '!bg-slate-950/50 border-slate-800 hover:border-slate-700' : '!bg-white border-slate-200 hover:border-orange-300'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isDark ? '!bg-slate-900 border-slate-700' : '!bg-slate-50 border-slate-200'}`}>
                              <Database className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                            </div>
                            <h4 className="font-bold text-lg">AWS S3 Storage</h4>
                          </div>
                          <span className={`px-2.5 py-1 border text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm ${isDark ? '!bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : '!bg-emerald-50 text-emerald-600 border-emerald-200'}`}>Connected</span>
                        </div>
                        <p className={`text-sm mb-6 flex-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Secure cloud storage for all citizen-uploaded evidence and worker resolution proofs.</p>
                        <button className={`w-full py-3 border rounded-xl text-sm font-bold transition-all ${isDark ? '!bg-slate-900 hover:!bg-slate-800 border-slate-700 text-slate-300' : '!bg-slate-50 hover:!bg-slate-100 border-slate-200 text-slate-700'}`}>
                          Manage Buckets
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB: MAINTENANCE MODE --- */}
                {activeTab === 'maintenance' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`border-b pb-6 ${isDark ? 'border-rose-900/50' : 'border-rose-200'}`}>
                      <h3 className="text-2xl font-bold tracking-tight text-rose-500 flex items-center gap-3">
                        <Power className="w-6 h-6" /> System Maintenance
                      </h3>
                      <p className={`mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>DANGER ZONE: Temporarily take the citizen portal offline for upgrades.</p>
                    </div>

                    <div className={`p-8 border rounded-[2rem] space-y-8 ${isDark ? '!bg-rose-500/5 border-rose-500/20' : '!bg-rose-50/50 border-rose-200'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                          <h4 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Enable Maintenance Mode</h4>
                          <p className={`text-sm mt-1 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>When enabled, citizens will not be able to submit new issues or log in. Existing admin sessions will remain active.</p>
                        </div>
                        <button type="button" onClick={() => handleToggle('maintenanceMode')} className={`w-20 h-10 rounded-full transition-colors relative flex items-center shrink-0 shadow-inner ${settings.maintenanceMode ? '!bg-rose-600' : (isDark ? '!bg-slate-700' : '!bg-slate-300')}`}>
                          <div className={`w-8 h-8 !bg-white rounded-full transition-transform absolute shadow-md ${settings.maintenanceMode ? 'translate-x-11' : 'translate-x-1'}`}></div>
                        </button>
                      </div>

                      {settings.maintenanceMode && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                          <label className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] ml-1">Custom Offline Message for Citizens</label>
                          <textarea 
                            value={settings.maintenanceMsg}
                            onChange={(e) => setSettings({...settings, maintenanceMsg: e.target.value})}
                            className={`w-full border rounded-[1.5rem] p-5 min-h-[120px] outline-none transition-all font-medium resize-none shadow-inner ${isDark ? '!bg-slate-950 border-rose-500/30 focus:border-rose-500 text-slate-200' : '!bg-white border-rose-200 focus:border-rose-400 text-slate-800 focus:ring-4 focus:ring-rose-500/10'}`}
                          />
                        </div>
                      )}
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button type="submit" className={`px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-rose-600 hover:!bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]' : '!bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-xl shadow-rose-500/30'}`}>
                        <CheckCircle2 className="w-5 h-5" /> Apply Maintenance Status
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

export default AdminSettingsPage;