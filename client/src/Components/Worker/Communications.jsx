import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  ArrowLeft,
  Sun,
  Moon,
  Send,
  UserCircle2,
  CheckCircle2,
  MoreVertical,
  Paperclip
} from 'lucide-react';

const MOCK_CONTACTS = [
  { id: 1, name: 'Sarah Jenkins', role: 'Supervisor', lastMessage: 'Make sure to bring the heavy-duty mix.', time: '10:45 AM', unread: 2, online: true },
  { id: 2, name: 'Central Dispatch', role: 'System', lastMessage: 'Task TSK-9042 assigned to you.', time: '09:15 AM', unread: 0, online: true },
  { id: 3, name: 'Team Beta', role: 'Field Team', lastMessage: 'We cleared the intersection.', time: 'Yesterday', unread: 0, online: false },
];

const MOCK_CHAT = [
  { id: 1, sender: 'Sarah Jenkins', text: 'Hi Mike, regarding TSK-9042, ensure you clear the debris before filling the pothole.', time: '10:45 AM', isMe: false },
  { id: 2, sender: 'Mike Reynolds', text: 'Got it. Arriving at the location now.', time: '10:50 AM', isMe: true },
  { id: 3, sender: 'Sarah Jenkins', text: 'Great, upload the before pictures as soon as you secure the area.', time: '10:52 AM', isMe: false },
];

const Communications = () => {
  const navigate = useNavigate();
  const [workerName] = useState("Mike Reynolds");
  const [activeContact, setActiveContact] = useState(MOCK_CONTACTS[0]);
  const [chatMessage, setChatMessage] = useState("");
  
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-orange-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-amber-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-orange-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-amber-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Worker Sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 border-r h-full shrink-0 relative z-20 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button onClick={() => navigate('/worker/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <ListTodo className="w-5 h-5" /> My Tasks
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}>
            <MessageSquare className="w-5 h-5" /> Communications
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-orange-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-orange-50 text-slate-600 hover:!bg-white hover:text-orange-700 hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={() => navigate('/login')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-orange-500/10 hover:!bg-rose-500/10' : '!bg-orange-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/dashboard')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Communications</h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button onClick={() => navigate('/worker/notifications')} className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
              <span className={`absolute top-2 right-2 w-2 h-2 !bg-orange-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span>
            </button>
            
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>Team Alpha</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-900/20">
                MR
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 sm:p-8 flex items-center justify-center">
          <div className={`w-full max-w-6xl h-full max-h-[800px] border rounded-[2.5rem] flex overflow-hidden shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
            
            {/* Contacts Sidebar */}
            <div className={`w-full md:w-80 border-r flex flex-col shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'} hidden md:flex`}>
              <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className="text-xl font-black tracking-tight">Messages</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {MOCK_CONTACTS.map((contact) => (
                  <button 
                    key={contact.id}
                    onClick={() => setActiveContact(contact)}
                    className={`w-full p-4 rounded-2xl flex items-start gap-4 transition-all text-left ${activeContact.id === contact.id ? (isDark ? '!bg-slate-700 shadow-inner' : '!bg-orange-200 border border-orange-200/50 shadow-sm') : (isDark ? '!bg-slate-800 hover:!bg-slate-800/50' : '!bg-orange-50 hover:!bg-slate-50')}`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? '!bg-slate-700 text-slate-300' : '!bg-white shadow-sm border border-slate-100 text-slate-600'}`}>
                        <UserCircle2 className="w-6 h-6" />
                      </div>
                      {contact.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 !bg-emerald-500 border-2 rounded-full shadow-sm"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className={`font-bold text-sm truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{contact.name}</h4>
                        <span className="text-[10px] font-bold text-slate-500">{contact.time}</span>
                      </div>
                      <p className={`text-xs truncate font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{contact.lastMessage}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-1">{contact.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat Header */}
              <div className={`h-20 border-b px-6 flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? '!bg-slate-800 text-slate-300' : '!bg-white shadow-sm border border-slate-100 text-slate-600'}`}>
                    <UserCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{activeContact.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full !bg-emerald-500"></span> {activeContact.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <button className={`p-2.5 rounded-xl transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-slate-400 hover:text-white' : '!bg-white hover:!bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'}`}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {MOCK_CHAT.map((msg) => (
                  <div key={msg.id} className={`flex flex-col gap-1.5 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-slate-500 mx-2">{msg.sender} • {msg.time}</span>
                    <div className={`p-4 rounded-[1.5rem] text-sm font-medium shadow-md max-w-[85%] sm:max-w-[70%] leading-relaxed ${
                      msg.isMe 
                        ? (isDark ? '!bg-orange-600 text-white rounded-tr-sm' : '!bg-orange-500 text-white rounded-tr-sm') 
                        : (isDark ? '!bg-slate-800 text-slate-200 rounded-tl-sm' : '!bg-white border border-slate-200/60 text-slate-800 rounded-tl-sm')
                    }`}>
                      {msg.text}
                    </div>
                    {msg.isMe && <span className="text-[10px] font-bold flex items-center gap-1 text-slate-500 mr-2">Read <CheckCircle2 className="w-3 h-3 text-emerald-500" /></span>}
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className={`p-6 border-t shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/50'}`}>
                <div className={`relative flex items-center rounded-[1.5rem] border shadow-inner transition-all focus-within:ring-4 ${isDark ? '!bg-slate-950/50 border-slate-700 focus-within:border-orange-500 focus-within:ring-orange-500/10' : '!bg-white border-slate-300 focus-within:border-orange-500 focus-within:ring-orange-500/10'}`}>
                  <button className={`p-4 !bg-transparent border-0 hover:border-transparent transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here..." 
                    className={`flex-1 bg-transparent py-4 outline-none font-medium text-sm ${isDark ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-500'}`}
                  />
                  <button 
                    disabled={!chatMessage}
                    className={`m-2 p-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-100 disabled:cursor-not-allowed ${isDark ? '!bg-orange-500 hover:!bg-orange-600 text-white' : '!bg-orange-500 hover:!bg-orange-600 text-white'}`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Communications;