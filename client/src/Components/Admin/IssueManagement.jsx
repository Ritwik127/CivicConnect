import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Building2, 
  Users, 
  BarChart3, 
  ClipboardList, 
  Settings, 
  LogOut,
  Filter,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';

const MOCK_ISSUES = [
  { id: 'ISS-9042', category: 'Pothole', aiConfidence: 98, location: 'Oxford Street', zone: 'Downtown', dept: 'Roads & Transport', priority: 'High', status: 'OPEN', date: 'Oct 24, 10:30 AM' },
  { id: 'ISS-9041', category: 'Garbage Overflow', aiConfidence: 85, location: 'Park Avenue, Gate 3', zone: 'North Sector', dept: 'Sanitation Dept', priority: 'Medium', status: 'IN-PROGRESS', date: 'Oct 24, 09:15 AM' },
  { id: 'ISS-9038', category: 'Fallen Tree', aiConfidence: 92, location: 'Central Park', zone: 'East Side', dept: 'Parks & Rec', priority: 'Critical', status: 'OPEN', date: 'Oct 24, 08:00 AM' },
  { id: 'ISS-9011', category: 'Broken Streetlight', aiConfidence: 78, location: 'Baker St', zone: 'Downtown', dept: 'Electrical', priority: 'Low', status: 'RESOLVED', date: 'Oct 23, 11:20 PM' },
  { id: 'ISS-8999', category: 'Water Leak', aiConfidence: 95, location: 'Market Square', zone: 'South District', dept: 'Water & Sewage', priority: 'High', status: 'IN-PROGRESS', date: 'Oct 23, 04:45 PM' },
];

const PriorityBadge = ({ priority, isDark }) => {
  const styles = {
    'Critical': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    'High': '!bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    'Medium': '!bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    'Low': '!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };
  return <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border shadow-sm ${styles[priority] || styles['Medium']}`}>{priority}</span>;
};

const StatusBadge = ({ status, isDark }) => {
  const styles = {
    'RESOLVED': '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'IN-PROGRESS': '!bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'OPEN': '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };
  return <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-widest uppercase border shadow-sm ${styles[status] || styles['OPEN']}`}>{status}</span>;
};

const IssueManagement = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [filter, setFilter] = useState('ALL');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const filteredIssues = MOCK_ISSUES.filter(issue => filter === 'ALL' || issue.status === filter);

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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
                <h2 className="text-3xl font-black tracking-tight">Issue Management</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Triage, route, and monitor all citizen reports globally.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 p-1.5 rounded-2xl w-max border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                  {['ALL', 'OPEN', 'IN-PROGRESS', 'RESOLVED'].map((f) => (
                    <button 
                      key={f} onClick={() => setFilter(f)} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${
                        filter === f 
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

            {/* Table Card */}
            <div className={`border rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/60 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDark ? '!bg-slate-950/50 text-slate-500 border-slate-800' : '!bg-slate-50/80 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th className="px-6 py-5 pl-8">Issue Details</th>
                      <th className="px-6 py-5">Location & Zone</th>
                      <th className="px-6 py-5">Routing & Status</th>
                      <th className="px-6 py-5 text-right pr-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id} className={`transition-colors group ${isDark ? 'hover:!bg-slate-800/30' : 'hover:!bg-blue-50/30'}`}>
                        
                        {/* Details Col */}
                        <td className="px-6 py-5 pl-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${isDark ? '!bg-slate-800 border-slate-700 text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/50' : '!bg-white border-slate-200 text-slate-500 group-hover:text-purple-600 group-hover:border-purple-300'}`}>
                              <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className={`font-bold text-sm mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.category}</p>
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <span>{issue.id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span className={`flex items-center gap-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                  <Sparkles className="w-3 h-3" /> AI {issue.aiConfidence}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location Col */}
                        <td className="px-6 py-5">
                          <p className={`text-sm font-medium flex items-center gap-2 mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <MapPin className="w-4 h-4 text-slate-400" /> {issue.location}
                          </p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-6">{issue.zone}</p>
                        </td>

                        {/* Routing Col */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-2 items-start">
                            <p className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              <Building2 className="w-4 h-4 text-slate-400" /> {issue.dept}
                            </p>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={issue.status} isDark={isDark} />
                              <PriorityBadge priority={issue.priority} isDark={isDark} />
                            </div>
                          </div>
                        </td>

                        {/* Actions Col */}
                        <td className="px-6 py-5 text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/admin/issuedetails/${issue.id}`)}
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-purple-600/20 text-slate-400 hover:text-purple-400 border border-slate-700 hover:border-purple-500/50' : '!bg-white hover:!bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-300'}`}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-slate-400 hover:text-white border border-slate-700' : '!bg-white hover:!bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'}`}
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination footer */}
              <div className={`p-6 flex items-center justify-between border-t ${isDark ? 'border-slate-800 !bg-slate-950/50' : 'border-slate-200 !bg-slate-50/80'}`}>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing 1 to 5 of 1,284 issues</span>
                <div className="flex items-center gap-2">
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 ${isDark ? '!bg-slate-800 text-slate-400 hover:!bg-slate-700' : '!bg-white text-slate-700 border border-slate-200 hover:!bg-slate-50'}`}>Prev</button>
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm ${isDark ? '!bg-slate-800 text-slate-200 hover:!bg-slate-700' : '!bg-white text-slate-700 border border-slate-200 hover:!bg-slate-50'}`}>Next</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default IssueManagement;