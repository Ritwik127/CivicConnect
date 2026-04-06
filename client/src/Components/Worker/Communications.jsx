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
  MessageSquare,
  Moon,
  Send,
  Settings,
  Sun,
  UserCircle2,
} from 'lucide-react';
import { fetchWorkerCommunications, getReadableErrorMessage, sendWorkerCommunication } from '../../lib/api';
import { useAuth } from '../../lib/auth';

function formatDateTime(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function initialsFor(name) {
  return String(name || 'CW').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

const Communications = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [messages, setMessages] = useState([]);
  const [activeTask, setActiveTask] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;
    async function loadMessages() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchWorkerCommunications();
        if (isActive) {
          setMessages(data || []);
          const firstTaskId = data?.find((item) => item.task_id)?.task_id || '';
          setActiveTask(firstTaskId);
        }
      } catch (error) {
        if (isActive) setErrorMessage(getReadableErrorMessage(error, 'Unable to load communications.'));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadMessages();
    return () => {
      isActive = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map();
    for (const message of messages) {
      const key = message.task_id || message.channel || 'general';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(message);
    }
    return Array.from(groups.entries()).map(([key, value]) => ({ key, messages: value }));
  }, [messages]);

  const activeThread = grouped.find((group) => group.key === activeTask) || grouped[0] || null;

  const handleSend = async () => {
    const body = chatMessage.trim();
    if (!body || !activeThread?.messages?.[0]?.task_code) {
      return;
    }
    try {
      setIsSending(true);
      setErrorMessage('');
      const created = await sendWorkerCommunication({
        body,
        task_code: activeThread.messages[0].task_code,
      });
      setMessages((current) => [...current, created]);
      setChatMessage('');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to send message.'));
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'worker' } });
  };

  const workerName = user?.full_name || 'Worker';
  const workerInitials = initialsFor(workerName);

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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}><MessageSquare className="w-5 h-5" /> Communications</button>
        </nav>
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Settings className="w-5 h-5" /> Settings</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-rose-500"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/dashboard')} className={`lg:hidden p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 text-slate-400 border-slate-700' : '!bg-slate-100 text-slate-600 border-slate-200'}`}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Communications</h1>
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

        <main className="flex-1 p-4 sm:p-8 flex items-center justify-center">
          <div className={`w-full max-w-6xl h-full max-h-[800px] border rounded-[2.5rem] flex overflow-hidden ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
            <div className={`w-full md:w-80 border-r flex flex-col shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'} hidden md:flex`}>
              <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}><h3 className="text-xl font-black tracking-tight">Threads</h3></div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {isLoading ? (
                  <div className="p-4 flex items-center gap-2 text-sm text-slate-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading threads...</div>
                ) : grouped.map((group) => (
                  <button key={group.key} onClick={() => setActiveTask(group.key)} className={`w-full p-4 rounded-2xl text-left ${activeThread?.key === group.key ? (isDark ? '!bg-slate-700' : '!bg-orange-100 border border-orange-200') : (isDark ? '!bg-slate-800' : '!bg-orange-50')}`}>
                    <h4 className="font-bold text-sm truncate">{group.messages[0]?.task_code || group.messages[0]?.channel || 'Conversation'}</h4>
                    <p className="text-xs mt-1 text-slate-500 truncate">{group.messages[group.messages.length - 1]?.body}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2">{group.key === 'general' ? 'General' : 'Task linked'}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className={`h-20 border-b px-6 flex items-center justify-between shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/50'}`}>
                <div>
                  <h3 className="font-bold text-lg">{activeThread ? `Thread ${activeThread.messages[0]?.task_code || activeThread.key}` : 'Communications'}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">{activeThread ? `${activeThread.messages.length} messages` : 'No thread selected'}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? '!bg-slate-800 text-slate-300' : '!bg-white shadow-sm border border-slate-100 text-slate-600'}`}><UserCircle2 className="w-5 h-5" /></div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {errorMessage ? (
                  <div className="text-sm text-rose-500 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {errorMessage}</div>
                ) : activeThread ? (
                  activeThread.messages.map((message) => {
                    const isMe = message.sender_id === user?.id;
                    return (
                      <div key={message.id} className={`flex flex-col gap-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] font-bold text-slate-500 mx-2">{message.sender_name || message.channel} • {formatDateTime(message.created_at)}</span>
                        <div className={`p-4 rounded-[1.5rem] text-sm font-medium shadow-md max-w-[85%] sm:max-w-[70%] leading-relaxed ${isMe ? 'bg-orange-500 text-white rounded-tr-sm' : (isDark ? '!bg-slate-800 text-slate-200 rounded-tl-sm' : '!bg-white border border-slate-200/60 text-slate-800 rounded-tl-sm')}`}>{message.body}</div>
                        {isMe ? <span className="text-[10px] font-bold flex items-center gap-1 text-slate-500 mr-2">Synced <CheckCircle2 className="w-3 h-3 text-emerald-500" /></span> : null}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-slate-500">No communications found for this worker.</div>
                )}
              </div>

              <div className={`p-6 border-t shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/50'}`}>
                <div className={`relative flex items-center rounded-[1.5rem] border shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-700' : '!bg-white border-slate-300'}`}>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(event) => setChatMessage(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={activeThread?.messages?.[0]?.task_code ? 'Type your message here...' : 'Select a task-linked thread to send a message'}
                    className={`flex-1 bg-transparent py-4 px-4 outline-none font-medium text-sm ${isDark ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-500'}`}
                  />
                  <button onClick={handleSend} disabled={isSending || !chatMessage.trim() || !activeThread?.messages?.[0]?.task_code} className="m-2 p-3 rounded-xl bg-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
