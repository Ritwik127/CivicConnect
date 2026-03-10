import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Clock,
  Users,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  ArrowLeft,
  Filter,
  ChevronDown,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Activity,
  Server,
  User,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

const MOCK_LOGS = [
  { 
    id: 'LOG-88492', timestamp: 'Oct 24, 2026 14:32:01', 
    user: 'Sarah Jenkins', role: 'Admin', dept: 'System Admin',
    action: 'UPDATE', target: 'Dept: Sanitation', 
    detail: 'Modified SLA target from 48 Hours to 24 Hours.', 
    status: 'Success', ip: '192.168.1.42' 
  },
  { 
    id: 'LOG-88491', timestamp: 'Oct 24, 2026 14:15:22', 
    user: 'System AI', role: 'System', dept: 'Automated',
    action: 'ROUTING', target: 'Issue: ISS-9042', 
    detail: 'Auto-routed Pothole issue to Roads & Transport with 98% confidence.', 
    status: 'Success', ip: 'Internal Server' 
  },
  { 
    id: 'LOG-88490', timestamp: 'Oct 24, 2026 13:45:00', 
    user: 'Mike Reynolds', role: 'Field Worker', dept: 'Roads & Transport',
    action: 'STATUS_CHANGE', target: 'Issue: ISS-9011', 
    detail: 'Uploaded resolution proof. Status changed to RESOLVED.', 
    status: 'Pending Verification', ip: '10.0.4.115' 
  },
  { 
    id: 'LOG-88489', timestamp: 'Oct 24, 2026 12:30:15', 
    user: 'Unknown User', role: 'None', dept: 'External',
    action: 'LOGIN_ATTEMPT', target: 'Admin Portal', 
    detail: 'Failed login attempt with invalid credentials (3rd attempt).', 
    status: 'Failed', ip: '203.0.113.45' 
  },
  { 
    id: 'LOG-88488', timestamp: 'Oct 24, 2026 11:20:05', 
    user: 'Marcus Thorne', role: 'Dept Head', dept: 'Roads & Transport',
    action: 'REASSIGN', target: 'Issue: ISS-8999', 
    detail: 'Reassigned from Team Beta to Team Alpha.', 
    status: 'Success', ip: '192.168.1.88' 
  },
];

const AuditLogs = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [filterType, setFilterType] = useState('ALL');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const filteredLogs = MOCK_LOGS.filter(log => {
    if (filterType === 'ALL') return true;
    if (filterType === 'SYSTEM') return log.role === 'System';
    if (filterType === 'SECURITY') return log.action.includes('LOGIN');
    if (filterType === 'USER') return log.role !== 'System' && !log.action.includes('LOGIN');
    return true;
  });

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Ambient Backgrounds */}
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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
            <ClipboardList className="w-5 h-5" /> Audit Logs
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/admin/adminsettings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> System Settings
          </button>
          <button onClick={() => navigate('/login')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-purple-500/10 hover:!bg-rose-500/10' : '!bg-purple-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Command Center</h1>
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
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
              <div>
                <h2 className="text-3xl font-black tracking-tight">System Audit Logs</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Immutable record of all system events, actions, and changes.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 p-1.5 rounded-2xl w-max border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                  {['ALL', 'SYSTEM', 'USER', 'SECURITY'].map((f) => (
                    <button 
                      key={f} onClick={() => setFilterType(f)} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${
                        filterType === f 
                          ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-slate-100 text-slate-900 shadow-sm') 
                          : (isDark ? '!bg-transparent text-slate-500 hover:text-slate-300 hover:!bg-slate-800/50' : '!bg-transparent text-slate-500 hover:text-slate-700 hover:!bg-slate-50')
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800 hover:!bg-slate-800 text-white' : '!bg-white border-slate-200/60 hover:!bg-slate-50 text-slate-700'}`}>
                  <Filter className="w-4 h-4 text-slate-400" /> Filter
                </button>
              </div>
            </div>

            {/* Logs Table Card */}
            <div className={`border rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/60 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDark ? '!bg-slate-950/50 text-slate-500 border-slate-800' : '!bg-slate-50/80 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th className="px-6 py-5 pl-8">Timestamp & Event ID</th>
                      <th className="px-6 py-5">Actor</th>
                      <th className="px-6 py-5">Action & Target</th>
                      <th className="px-6 py-5">Details</th>
                      <th className="px-6 py-5 pr-8">Status & Network</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className={`transition-colors group ${isDark ? 'hover:!bg-slate-800/30' : 'hover:!bg-blue-50/30'}`}>
                        
                        <td className="px-6 py-5 pl-8">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full ${
                               log.action.includes('LOGIN') ? '!bg-amber-500' : 
                               log.role === 'System' ? '!bg-purple-500' : '!bg-blue-500'
                            }`}></div>
                            <div>
                              <p className={`font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{log.timestamp}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">{log.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border shadow-sm ${
                              log.role === 'System' ? (isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-600 border-purple-200') : 
                              (isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-600 border-blue-200')
                            }`}>
                              {log.role === 'System' ? <Server className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{log.user}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{log.role}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className={`w-max px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-widest shadow-sm ${
                              log.action === 'UPDATE' || log.action === 'REASSIGN' ? (isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-600 border-blue-200') :
                              log.action.includes('LOGIN') ? (isDark ? '!bg-amber-500/10 text-amber-400 border-amber-500/20' : '!bg-amber-50 text-amber-600 border-amber-200') :
                              (isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-600 border-purple-200')
                            }`}>
                              {log.action}
                            </span>
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{log.target}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className={`text-xs leading-relaxed max-w-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{log.detail}</p>
                        </td>

                        <td className="px-6 py-5 pr-8">
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center justify-end gap-1.5 min-w-[10.5rem]">
                              {log.status === 'Success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                               log.status === 'Failed' ? <XCircle className="w-4 h-4 text-rose-500" /> : 
                               <Activity className="w-4 h-4 text-amber-500" />}
                              <span className={`font-bold text-sm ${
                                log.status === 'Success' ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : 
                                log.status === 'Failed' ? (isDark ? 'text-rose-400' : 'text-rose-600') : 
                                (isDark ? 'text-amber-400' : 'text-amber-600')
                              }`}>
                                {log.status}
                              </span>
                            </div>
                            <span className={`text-[10px] font-mono tracking-widest px-2 py-0.5 rounded border shadow-sm ${isDark ? 'text-slate-500 !bg-slate-950 border-slate-800' : 'text-slate-500 !bg-white border-slate-200'}`}>
                              {log.ip}
                            </span>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 flex justify-between items-center text-xs font-bold border-t ${isDark ? 'border-slate-800 !bg-slate-950/50 text-slate-500' : 'border-slate-200 !bg-slate-50/80 text-slate-500'}`}>
                <span>Showing {filteredLogs.length} Audit Events</span>
                <div className="flex gap-2">
                  <button className={`px-3 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-white hover:!bg-slate-50 text-slate-700 border border-slate-200'}`}>Prev</button>
                  <button className={`px-3 py-1.5 rounded-lg transition-colors shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-white hover:!bg-slate-50 text-slate-700 border border-slate-200'}`}>Next</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLogs;