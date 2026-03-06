import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
  Check
} from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Issue Resolved!', desc: 'Your report #R-8412 (Streetlight) has been successfully resolved. Please leave feedback.', time: '1h ago', type: 'success', read: false },
  { id: 2, title: 'Worker Assigned', desc: 'A field worker (Team Alpha) is heading to Oxford Street to inspect your report #R-8429.', time: '3h ago', type: 'info', read: false },
  { id: 3, title: 'New Area Alert', desc: 'Heavy water logging reported in Sector 5. Please take alternate routes.', time: 'Yesterday', type: 'warning', read: true },
  { id: 4, title: 'Issue Under Review', desc: 'Your garbage complaint #R-8425 is now under review by the Sanitation Dept.', time: '2 days ago', type: 'info', read: true },
  { id: 5, title: 'Welcome to CivicConnect', desc: 'Thank you for joining. Start reporting issues to improve your city!', time: '1 week ago', type: 'success', read: true },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState('ALL');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifications = notifications.filter(n => 
    activeTab === 'ALL' ? true : !n.read
  );

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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-left"
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left"
          >
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
            <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2.5 !bg-slate-800/50 text-white rounded-xl border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] relative">
              <Bell className="w-5 h-5 text-blue-400" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
              )}
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
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Your Alerts</h2>
                <p className="text-slate-400 mt-1 text-lg">Stay updated on your reports and neighborhood issues.</p>
              </div>
              
              {/* Tabs */}
              <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
                {['ALL', 'UNREAD'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveTab(f)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                      activeTab === f 
                        ? 'bg-slate-800 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Showing {filteredNotifications.length} items
              </span>
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Mark all as read
              </button>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
              {filteredNotifications.map((note) => {
                const Icon = note.type === 'success' ? CheckCircle2 : note.type === 'warning' ? AlertCircle : Info;
                const colorClass = note.type === 'success' ? 'text-emerald-500' : note.type === 'warning' ? 'text-rose-500' : 'text-blue-500';
                const bgClass = note.type === 'success' ? 'bg-emerald-500/10' : note.type === 'warning' ? 'bg-rose-500/10' : 'bg-blue-500/10';

                return (
                  <div 
                    key={note.id} 
                    onClick={() => handleMarkRead(note.id)}
                    className={`relative p-6 bg-slate-900/50 border rounded-3xl transition-all cursor-pointer group hover:bg-slate-900 ${
                      !note.read ? 'border-blue-500/30 shadow-lg shadow-blue-900/10' : 'border-slate-800'
                    }`}
                  >
                    {!note.read && (
                      <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    )}
                    
                    <div className="flex items-start gap-6 pl-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h3 className={`font-bold text-lg ${!note.read ? 'text-white' : 'text-slate-300'}`}>
                            {note.title}
                          </h3>
                          <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" /> {note.time}
                          </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed text-sm">
                          {note.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredNotifications.length === 0 && (
                <div className="text-center py-24 bg-slate-900/30 rounded-[2.5rem] border border-dashed border-slate-800">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-bold text-lg">You're all caught up!</p>
                  <p className="text-slate-500 text-sm mt-1">No new notifications right now.</p>
                </div>
              )}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
