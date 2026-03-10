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
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

const TREND_METRICS = [
  { label: 'Total Issues Reported', value: '4,820', trend: '+15%', trendUp: true, desc: 'vs last month' },
  { label: 'Resolution Rate', value: '88.5%', trend: '+2.1%', trendUp: true, desc: 'vs last month' },
  { label: 'Avg Resolution Time', value: '34 Hrs', trend: '-12%', trendUp: true, desc: 'vs last month' },
  { label: 'Citizen Satisfaction', value: '4.2/5', trend: '-0.3', trendUp: false, desc: 'vs last month' },
];

const PREDICTIVE_INSIGHTS = [
  { 
    id: 1, 
    type: 'critical',
    title: 'Flood Risk Warning', 
    desc: 'AI predicts an 85% chance of severe water logging in Downtown based on current weather forecasts and historically slow drainage clearing.', 
    action: 'Pre-deploy Water & Sewage teams' 
  },
  { 
    id: 2, 
    type: 'warning',
    title: 'SLA Breach Trend', 
    desc: 'Sanitation Department is currently seeing a 40% spike in volume. At current staffing levels, SLA compliance is projected to drop below 80% by next week.', 
    action: 'Reallocate 5 field workers to North Sector' 
  },
  { 
    id: 3, 
    type: 'positive',
    title: 'Improved Lighting Compliance', 
    desc: 'Following the LED upgrade project, streetlighting complaints in the East Side have dropped by 60% compared to the previous quarter.', 
    action: 'View Impact Report' 
  }
];

const AnalyticsReport = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [activeRange, setActiveRange] = useState('30D');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-sm' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Analytics & Reports</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>City-wide performance trends, AI predictions, and operational data.</p>
              </div>
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl w-max border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                {['7D', '30D', '90D', 'YTD'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setActiveRange(range)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${
                      activeRange === range 
                        ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-slate-100 text-slate-900 shadow-sm') 
                        : (isDark ? '!bg-purple-600/10 text-slate-400 hover:text-slate-300 hover:!bg-slate-800/50' : '!bg-transparent text-slate-500 hover:text-slate-700 hover:!bg-slate-50')
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Trend Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TREND_METRICS.map((kpi, i) => (
                <div key={i} className={`border p-6 rounded-[1.5rem] shadow-sm transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl ${isDark ? '!bg-slate-900/40 border-slate-800/80 hover:!bg-slate-800/60 shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:!bg-white shadow-slate-200/50 hover:shadow-md'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{kpi.label}</p>
                    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${kpi.trendUp ? '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : '!bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                      <TrendingUp className={`w-3 h-3 ${!kpi.trendUp && 'rotate-180'}`} />
                      {kpi.trend}
                    </div>
                  </div>
                  <h3 className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{kpi.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Trends Chart Placeholder (Spans 2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                <div className={`border rounded-[2.5rem] p-8 shadow-xl flex flex-col h-full min-h-[400px] backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/40 border-slate-800/80 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold">Issue Volume vs Resolution Rate</h3>
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Comparing incoming reports against closed tickets over the active period.</p>
                    </div>
                  </div>
                  
                  {/* Simulated Chart Container */}
                  <div className={`flex-1 flex items-end justify-between gap-2 border-l border-b pb-2 pl-4 relative ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    {/* Y-Axis labels */}
                    <div className="absolute -left-10 bottom-0 h-full flex flex-col justify-between text-[10px] text-slate-500 font-mono py-2">
                      <span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
                    </div>

                    {/* Mock Bars */}
                    {[80, 60, 90, 45, 70, 100, 85, 65, 50, 75, 95, 60].map((h, i) => (
                      <div key={i} className="w-full flex justify-center group relative h-full items-end">
                        <div 
                          className={`w-full max-w-[24px] rounded-t-md transition-all duration-500 ${isDark ? '!bg-purple-600/50 group-hover:!bg-purple-500/80' : '!bg-purple-500/80 group-hover:!bg-purple-600'}`}
                          style={{ height: `${h}%` }}
                        ></div>
                        {/* Mock Line point */}
                        <div 
                          className={`absolute w-2 h-2 rounded-full shadow-lg ${isDark ? '!bg-emerald-400' : '!bg-emerald-500'}`}
                          style={{ bottom: `${h * 0.8 + 10}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 rounded bg-purple-500/50"></div> Reported Issues</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Resolution Trend</div>
                  </div>
                </div>
              </div>

              {/* AI Predictive Insights Column */}
              <div className="space-y-6">
                <div className={`border rounded-[2.5rem] p-8 shadow-xl flex flex-col h-full backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/40 border-slate-800/80 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-xl ${isDark ? '!bg-amber-500/10' : '!bg-amber-100'}`}>
                      <Lightbulb className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    </div>
                    <h3 className="text-xl font-bold">AI Predictive Insights</h3>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                    {PREDICTIVE_INSIGHTS.map(insight => (
                      <div key={insight.id} className={`p-5 rounded-2xl border transition-all ${isDark ? '!bg-slate-950/50 border-slate-800 hover:border-slate-700' : '!bg-slate-50/80 border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {insight.type === 'critical' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          {insight.type === 'warning' && <Clock className="w-4 h-4 text-amber-500" />}
                          {insight.type === 'positive' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                          <h4 className={`font-bold text-sm ${
                            insight.type === 'critical' ? (isDark ? 'text-rose-400' : 'text-rose-600') : 
                            insight.type === 'warning' ? (isDark ? 'text-amber-400' : 'text-amber-600') : 
                            (isDark ? 'text-emerald-400' : 'text-emerald-600')
                          }`}>{insight.title}</h4>
                        </div>
                        <p className={`text-xs leading-relaxed mb-4 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{insight.desc}</p>
                        <button className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-slate-300 border-slate-700' : '!bg-white hover:!bg-slate-50 text-slate-700 border-slate-200'}`}>
                          {insight.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Bottom Data Section */}
            <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/40 border-slate-800/80 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
              <h3 className="text-xl font-bold mb-6">Zone Performance Matrix</h3>
              <div className={`overflow-x-auto border rounded-2xl shadow-inner ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <table className="w-full text-left">
                  <thead className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDark ? '!bg-slate-950/50 text-slate-500 border-slate-800' : '!bg-slate-50/80 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th className="px-6 py-4">Geographic Zone</th>
                      <th className="px-6 py-4">Total Reports</th>
                      <th className="px-6 py-4">Resolved</th>
                      <th className="px-6 py-4">Escalated</th>
                      <th className="px-6 py-4">SLA Score</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/50 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                    {['Downtown', 'North Sector', 'East Side', 'South District', 'West End'].map((zone, i) => (
                      <tr key={zone} className={`transition-colors font-medium ${isDark ? 'hover:!bg-slate-800/30' : 'hover:!bg-blue-50/30'}`}>
                        <td className="px-6 py-4 font-bold flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> {zone}
                        </td>
                        <td className="px-6 py-4">{Math.floor(Math.random() * 500) + 100}</td>
                        <td className="px-6 py-4">{Math.floor(Math.random() * 400) + 50}</td>
                        <td className="px-6 py-4 text-rose-500">{Math.floor(Math.random() * 20)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border shadow-sm ${isDark ? '!bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : '!bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                            {90 + Math.floor(Math.random() * 8)}%
                          </span>
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

export default AnalyticsReport;