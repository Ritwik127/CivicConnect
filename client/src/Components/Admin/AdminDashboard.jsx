import React, { useState, useEffect } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  LayoutDashboard, ListTodo, Building2, Users, BarChart3, ClipboardList, 
  Settings, LogOut, Bell, AlertOctagon, Clock, CheckCircle2,
  HardHat, Map as MapIcon, TrendingUp, AlertTriangle, ChevronRight, ArrowLeft, Filter,
  Sun, Moon
} from 'lucide-react';

const KPI_DATA = [
  { label: 'Active Issues', value: '1,284', trend: '+12%', trendUp: false, icon: AlertTriangle, color: 'text-rose-500', bg: '!bg-rose-500/10' },
  { label: 'SLA Compliance', value: '94.2%', trend: '+2.4%', trendUp: true, icon: CheckCircle2, color: 'text-emerald-500', bg: '!bg-emerald-500/10' },
  { label: 'Avg Resolution Time', value: '28 hrs', trend: '-4 hrs', trendUp: true, icon: Clock, color: 'text-blue-500', bg: '!bg-blue-500/10' },
  { label: 'Active Field Workers', value: '342', trend: '+18 today', trendUp: true, icon: HardHat, color: 'text-amber-500', bg: '!bg-amber-500/10' },
];

const CRITICAL_ALERTS = [
  { id: 1, title: 'Severe Water Logging', desc: 'Multiple reports in Sector 7. Immediate dispatch required.', time: '10 mins ago', type: 'critical' },
  { id: 2, title: 'SLA Breach Warning', desc: '15 Pothole tickets exceeding 48hr resolution window.', time: '1 hr ago', type: 'warning' },
  { id: 3, title: 'System Alert', desc: 'Traffic camera feed API disconnected in Downtown zone.', time: '2 hrs ago', type: 'system' },
];

const DEPT_SLA = [
  { id: 1, name: 'Roads & Transport', open: 420, resolved: 1850, compliance: 88, color: '!bg-orange-500' },
  { id: 2, name: 'Sanitation Dept', open: 215, resolved: 3100, compliance: 96, color: '!bg-emerald-500' },
  { id: 3, name: 'Electrical Division', open: 180, resolved: 950, compliance: 92, color: '!bg-yellow-500' },
  { id: 4, name: 'Water & Sewage', open: 350, resolved: 1200, compliance: 84, color: '!bg-blue-500' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
            <button className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <LayoutDashboard className="w-5 h-5" />
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
                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-black uppercase tracking-widest">City Administrator</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/20">
                SJ
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight">City Overview</h2>
                <p className={`mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time metrics and operational status.</p>
              </div>
              <button className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800/80 border-slate-700 hover:!bg-slate-700 text-white' : '!bg-white border-slate-200/60 hover:!bg-slate-50 text-slate-700'}`}>
                <Filter className="w-4 h-4 text-slate-400" />
                Last 30 Days
              </button>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {KPI_DATA.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className={`border p-6 rounded-[2rem] transition-all duration-300 group hover:-translate-y-1 backdrop-blur-xl ${isDark ? '!bg-slate-900/80 border-slate-800 hover:border-slate-600 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-slate-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${kpi.bg} ${kpi.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${kpi.trendUp ? '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : '!bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                        {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                        {kpi.trend}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</h3>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1">{kpi.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Heatmap & Alerts Section */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Heatmap (Col Span 2) */}
              <div className={`lg:col-span-2 border rounded-[2.5rem] p-8 shadow-sm flex flex-col backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Live Incident Heatmap</h3>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Geospatial distribution of active reports.</p>
                  </div>
                  <button className="text-sm font-bold !bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:opacity-80 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                    Expand Map <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className={`relative flex-1 min-h-[300px] rounded-3xl border overflow-hidden group shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                  <div className={`absolute inset-0 !bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-center bg-no-repeat bg-cover ${isDark ? 'opacity-30 invert' : 'opacity-20'}`}></div>
                  <div className={`absolute inset-0 !bg-gradient-to-t to-transparent ${isDark ? 'from-[#0b1426] via-transparent' : 'from-slate-50 via-transparent'}`}></div>

                  <div className="absolute top-[30%] left-[40%] w-24 h-24 !bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className={`absolute top-[32%] left-[42%] w-4 h-4 !bg-rose-500 rounded-full border-2 shadow-[0_0_15px_rgba(244,63,94,0.8)] ${isDark ? 'border-slate-950' : 'border-white'}`}></div>

                  <div className="absolute top-[60%] left-[70%] w-32 h-32 !bg-amber-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className={`absolute top-[62%] left-[72%] w-4 h-4 !bg-amber-500 rounded-full border-2 shadow-[0_0_15px_rgba(245,158,11,0.8)] ${isDark ? 'border-slate-950' : 'border-white'}`}></div>

                  <div className="absolute top-[45%] left-[20%] w-20 h-20 !bg-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                  <div className={`absolute top-[47%] left-[22%] w-4 h-4 !bg-blue-500 rounded-full border-2 shadow-[0_0_15px_rgba(59,130,246,0.8)] ${isDark ? 'border-slate-950' : 'border-white'}`}></div>

                  <div className={`absolute bottom-4 left-4 backdrop-blur-xl border p-3 rounded-xl flex items-center gap-4 text-xs font-bold shadow-lg ${isDark ? '!bg-slate-900/90 border-slate-800 text-slate-300' : '!bg-white/90 border-slate-200 text-slate-700'}`}>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full !bg-rose-500"></div> High Density</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full !bg-amber-500"></div> Medium</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full !bg-blue-500"></div> Low</div>
                  </div>
                </div>
              </div>

              {/* Critical Alerts Panel */}
              <div className={`border rounded-[2.5rem] p-8 shadow-sm flex flex-col backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className={`text-xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <AlertOctagon className="w-5 h-5 text-rose-500" /> Critical Alerts
                    </h3>
                  </div>
                  <span className="!bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">3 NEW</span>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {CRITICAL_ALERTS.map(alert => (
                    <div key={alert.id} className={`p-4 border rounded-[1.5rem] transition-all cursor-pointer relative overflow-hidden group hover:-translate-y-0.5 shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800 hover:border-slate-700' : '!bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:!bg-white'}`}>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.type === 'critical' ? '!bg-rose-500' : alert.type === 'warning' ? '!bg-amber-500' : '!bg-blue-500'}`}></div>
                      <div className="flex justify-between items-start mb-1.5 pl-2">
                        <h4 className={`font-bold text-sm transition-colors ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{alert.title}</h4>
                        <span className="text-[10px] font-bold text-slate-500">{alert.time}</span>
                      </div>
                      <p className={`text-xs leading-relaxed pl-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{alert.desc}</p>
                    </div>
                  ))}
                </div>
                
                <button className={`w-full mt-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-slate-300' : '!bg-slate-100 hover:!bg-slate-200 text-slate-600'}`}>
                  View All Alerts
                </button>
              </div>
            </div>

            {/* SLA Overview Table */}
            <div className={`border rounded-[2.5rem] p-8 shadow-sm backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Department SLA Overview</h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Resolution compliance rate by department.</p>
                </div>
                <button className={`text-sm font-bold !bg-purple-600/10 transition-colors flex items-center gap-1 px-4 py-2 rounded-lg ${isDark ? 'text-purple-400 hover:text-white' : 'text-purple-700 hover:text-purple-800'}`}>
                  Export Report <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className={`overflow-x-auto border rounded-[1.5rem] shadow-sm ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <table className="w-full text-left">
                  <thead className={`text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] border-b ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                    <tr>
                      <th className="px-6 py-4 rounded-tl-[1.5rem]">Department</th>
                      <th className="px-6 py-4">Open Issues</th>
                      <th className="px-6 py-4">Resolved (30d)</th>
                      <th className="px-6 py-4 rounded-tr-[1.5rem]">SLA Compliance Rate</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                    {DEPT_SLA.map((dept) => (
                      <tr key={dept.id} className={`transition-colors group ${isDark ? 'hover:!bg-slate-800/40' : 'hover:!bg-blue-50/30'}`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${dept.color}`}></div>
                            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{dept.name}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{dept.open}</td>
                        <td className={`px-6 py-5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{dept.resolved}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`flex-1 h-2 rounded-full overflow-hidden shadow-inner ${isDark ? '!bg-slate-800' : '!bg-slate-200'}`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  dept.compliance >= 90 ? '!bg-emerald-500' : dept.compliance >= 85 ? '!bg-amber-500' : '!bg-rose-500'
                                }`} 
                                style={{ width: `${dept.compliance}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-bold min-w-[3ch] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{dept.compliance}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;