import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings as SettingsIcon, 
  LogOut,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState('profile'); // profile, notifications, security
  
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true
  });

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate save
    alert("Settings saved successfully!");
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
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
          <button 
            onClick={() => navigate('/report-issue')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left"
          >
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button 
            onClick={() => navigate('/my-reports')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left"
          >
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button 
            onClick={() => navigate('/notifications')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left"
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-left"
          >
            <SettingsIcon className="w-5 h-5" /> Settings
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-rose-500 hover:bg-rose-500/10 transition-all text-left"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="lg:hidden p-2.5 bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Account Settings</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/notifications')} className="p-2.5 !bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700 relative">
              <Bell className="w-5 h-5" />
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
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* Settings Nav */}
              <div className="w-full md:w-64 shrink-0 space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <User className="w-5 h-5" /> Personal Profile
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'notifications' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <Bell className="w-5 h-5" /> Notifications
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold ${activeTab === 'security' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                >
                  <ShieldCheck className="w-5 h-5" /> Security & Passwords
                </button>
              </div>

              {/* Settings Content Area */}
              <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-2">Personal Profile</h2>
                      <p className="text-slate-400">Update your personal details and contact information.</p>
                    </div>

                    <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center font-bold text-3xl text-white shadow-lg shadow-blue-900/20">
                        JD
                      </div>
                      <div className="space-y-2">
                        <button type="button" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition-colors">Change Avatar</button>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Max file size 2MB</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none text-slate-200 transition-all font-medium" 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none text-slate-200 transition-all font-medium" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none text-slate-200 transition-all font-medium" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="!bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Save Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-2">Notification Preferences</h2>
                      <p className="text-slate-400">Control how and when you receive alerts from CivicConnect.</p>
                    </div>

                    <div className="space-y-6">
                      {/* Toggle Item */}
                      <div className="flex items-center justify-between p-6 bg-slate-950/50 border border-slate-800 rounded-3xl group hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                            <Mail className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Email Alerts</h4>
                            <p className="text-sm text-slate-400">Receive updates directly to your inbox.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('emailAlerts')}
                          className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${formData.emailAlerts ? 'bg-blue-600' : 'bg-slate-700'}`}
                        >
                          <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute ${formData.emailAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                      </div>

                      {/* Toggle Item */}
                      <div className="flex items-center justify-between p-6 bg-slate-950/50 border border-slate-800 rounded-3xl group hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">SMS Alerts</h4>
                            <p className="text-sm text-slate-400">Get text messages for critical status changes.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('smsAlerts')}
                          className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${formData.smsAlerts ? 'bg-emerald-500' : 'bg-slate-700'}`}
                        >
                          <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute ${formData.smsAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                      </div>

                      {/* Toggle Item */}
                      <div className="flex items-center justify-between p-6 bg-slate-950/50 border border-slate-800 rounded-3xl group hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                            <Bell className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Push Notifications</h4>
                            <p className="text-sm text-slate-400">In-app notifications and alerts.</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggle('pushAlerts')}
                          className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${formData.pushAlerts ? 'bg-purple-500' : 'bg-slate-700'}`}
                        >
                          <div className={`w-6 h-6 bg-white rounded-full transition-transform absolute ${formData.pushAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-2">Security Settings</h2>
                      <p className="text-slate-400">Update your password and secure your account.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Current Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none text-slate-200 transition-all font-medium" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="password" 
                            placeholder="New secure password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none text-slate-200 transition-all font-medium" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          <input 
                            type="password" 
                            placeholder="Repeat new password"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none text-slate-200 transition-all font-medium" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="!bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
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
