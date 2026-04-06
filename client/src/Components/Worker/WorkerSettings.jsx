import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Phone,
  Settings as SettingsIcon,
  ShieldCheck,
  Smartphone,
  Sun,
  User,
} from 'lucide-react';
import { fetchWorkerSettings, getReadableErrorMessage, updateWorkerSettings } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  emailAlerts: false,
  smsAlerts: false,
  pushAlerts: false,
};

function initialsFor(name) {
  return String(name || 'CW').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

const WorkerSettings = () => {
  const navigate = useNavigate();
  const { user, logout, refreshSession } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;
    async function loadSettings() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchWorkerSettings();
        if (!isActive) return;
        setFormData({
          name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          emailAlerts: Boolean(data.email_alerts),
          smsAlerts: Boolean(data.sms_alerts),
          pushAlerts: Boolean(data.push_alerts),
        });
      } catch (error) {
        if (isActive) setErrorMessage(getReadableErrorMessage(error, 'Unable to load worker settings.'));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadSettings();
    return () => {
      isActive = false;
    };
  }, []);

  const workerName = formData.name || user?.full_name || 'Worker';
  const workerInitials = useMemo(() => initialsFor(workerName), [workerName]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'worker' } });
  };

  const handleToggle = (key) => {
    setFormData((current) => ({ ...current, [key]: !current[key] }));
    setSaveMessage('');
    setErrorMessage('');
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      setErrorMessage('Unable to identify the current worker.');
      return;
    }
    try {
      setIsSaving(true);
      setSaveMessage('');
      setErrorMessage('');
      const response = await updateWorkerSettings(user.id, { full_name: formData.name, phone: formData.phone || null });
      if (response?.user) {
        setFormData((current) => ({
          ...current,
          name: response.user.full_name || current.name,
          email: response.user.email || current.email,
          phone: response.user.phone || '',
        }));
      }
      await refreshSession();
      setSaveMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to save worker profile.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user?.id) {
      setErrorMessage('Unable to identify the current worker.');
      return;
    }
    try {
      setIsSaving(true);
      setSaveMessage('');
      setErrorMessage('');
      const response = await updateWorkerSettings(user.id, {
        email_alerts: formData.emailAlerts,
        sms_alerts: formData.smsAlerts,
        push_alerts: formData.pushAlerts,
      });
      if (response?.user) {
        setFormData((current) => ({
          ...current,
          emailAlerts: Boolean(response.user.email_alerts),
          smsAlerts: Boolean(response.user.sms_alerts),
          pushAlerts: Boolean(response.user.push_alerts),
        }));
      }
      await refreshSession();
      setSaveMessage('Notification preferences updated.');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to save notification preferences.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex min-h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <aside className={`hidden lg:flex flex-col w-64 border-r h-screen shrink-0 relative z-20 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30"><span className="font-bold text-xl text-white">C</span></div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/worker/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><ListTodo className="w-5 h-5" /> My Tasks</button>
          <button onClick={() => navigate('/worker/communications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><MessageSquare className="w-5 h-5" /> Communications</button>
        </nav>
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}><SettingsIcon className="w-5 h-5" /> Settings</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-rose-500"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/dashboard')} className={`lg:hidden p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 text-slate-400 border-slate-700' : '!bg-slate-100 text-slate-600 border-slate-200'}`}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Account Settings</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => navigate('/worker/notifications')} className={`p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}><Bell className="w-5 h-5" /></button>
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.department || 'Worker'}</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white">{workerInitials}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 shrink-0 space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold ${activeTab === 'profile' ? (isDark ? '!bg-slate-800 text-white' : '!bg-white shadow-sm text-orange-600') : (isDark ? '!bg-slate-800 text-slate-400' : '!bg-orange-50 text-slate-600')}`}><User className="w-5 h-5" /> Personal Profile</button>
                <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold ${activeTab === 'notifications' ? (isDark ? '!bg-slate-800 text-white' : '!bg-white shadow-sm text-orange-600') : (isDark ? '!bg-slate-800 text-slate-400' : '!bg-orange-50 text-slate-600')}`}><Bell className="w-5 h-5" /> Notifications</button>
                <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold ${activeTab === 'security' ? (isDark ? '!bg-slate-800 text-white' : '!bg-white shadow-sm text-orange-600') : (isDark ? '!bg-slate-800 text-slate-400' : '!bg-orange-50 text-slate-600')}`}><ShieldCheck className="w-5 h-5" /> Security</button>
              </div>

              <div className={`flex-1 border rounded-[2.5rem] p-8 md:p-12 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                {isLoading ? (
                  <div className="flex items-center gap-3 text-sm"><Loader2 className="w-5 h-5 animate-spin text-orange-500" /> Loading settings...</div>
                ) : errorMessage ? (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{errorMessage}</div>
                ) : (
                  <>
                    {saveMessage ? <div className={`rounded-2xl border px-4 py-3 text-sm mb-6 ${isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{saveMessage}</div> : null}

                    {activeTab === 'profile' ? (
                      <form onSubmit={handleSaveProfile} className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-black tracking-tight mb-2">Personal Profile</h2>
                          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your contact information for dispatch communication.</p>
                        </div>
                        <div className={`flex items-center gap-6 pb-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <div className="w-24 h-24 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center font-bold text-3xl text-white">{workerInitials}</div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input type="text" value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900'}`} /></div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input type="email" value={formData.email} readOnly className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-400' : '!bg-slate-100 border-slate-200 text-slate-500'}`} /></div>
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                            <div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" /><input type="tel" value={formData.phone} onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))} className={`w-full border rounded-[1.5rem] py-4 pl-12 pr-4 ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200' : '!bg-slate-50/80 border-slate-200 text-slate-900'}`} /></div>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end"><button type="submit" disabled={isSaving} className="px-8 py-4 rounded-2xl font-bold text-white bg-orange-600 flex items-center gap-2 disabled:opacity-60">{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Save Changes</button></div>
                      </form>
                    ) : null}

                    {activeTab === 'notifications' ? (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-black tracking-tight mb-2">Notification Preferences</h2>
                          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Control how dispatch sends task updates.</p>
                        </div>
                        <div className="space-y-6">
                          {[
                            { key: 'emailAlerts', icon: Mail, title: 'Email Alerts', desc: 'Receive task summaries to your inbox.' },
                            { key: 'smsAlerts', icon: Smartphone, title: 'SMS Alerts', desc: 'Receive text messages for urgent dispatches.' },
                            { key: 'pushAlerts', icon: Bell, title: 'Push Notifications', desc: 'See in-app alerts while working.' },
                          ].map((item) => (
                            <div key={item.key} className={`flex items-center justify-between p-6 border rounded-[2rem] ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-500/10 text-orange-500"><item.icon className="w-6 h-6" /></div>
                                <div>
                                  <h4 className="font-bold text-lg">{item.title}</h4>
                                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                                </div>
                              </div>
                              <button onClick={() => handleToggle(item.key)} className={`w-14 h-8 rounded-full relative flex items-center shadow-inner ${formData[item.key] ? '!bg-orange-500' : (isDark ? '!bg-slate-800' : '!bg-slate-200')}`}><div className={`w-6 h-6 !bg-white rounded-full absolute shadow-md transition-transform ${formData[item.key] ? 'translate-x-7' : 'translate-x-1'}`}></div></button>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 flex justify-end"><button type="button" onClick={handleSaveNotifications} disabled={isSaving} className="px-8 py-4 rounded-2xl font-bold text-white bg-orange-600 flex items-center gap-2 disabled:opacity-60">{isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Save Preferences</button></div>
                      </div>
                    ) : null}

                    {activeTab === 'security' ? (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-black tracking-tight mb-2">Security</h2>
                          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Password management is not wired yet because the backend does not expose a worker password-update endpoint.</p>
                        </div>
                        <div className={`rounded-2xl border px-4 py-4 text-sm ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>Once a password update API is added, this tab can be wired the same way as the live profile and notification settings above.</div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerSettings;
