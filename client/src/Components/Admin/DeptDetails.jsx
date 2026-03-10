import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Edit,
  UserCircle2,
  HardHat,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  X,
  Save,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';

const MOCK_DEPT_DETAILS = {
  'D-01': { 
    id: 'D-01', name: 'Roads & Transport', head: 'Marcus Thorne', headEmail: 'm.thorne@civic.gov',
    zones: ['Downtown', 'North Sector'], sla: '48 Hours', color: 'text-orange-500', bg: '!bg-orange-500/10',
    stats: { activeIssues: 420, resolvedThisMonth: 1850, slaCompliance: 88, avgResolutionTime: '36h' },
    staff: [
      { id: 'WK-102', name: 'Mike Reynolds', role: 'Field Worker', status: 'Active' },
      { id: 'WK-145', name: 'Sarah Connor', role: 'Supervisor', status: 'Active' },
      { id: 'WK-188', name: 'James Wilson', role: 'Field Worker', status: 'Off-Duty' },
    ]
  }
};

const DeptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const dept = MOCK_DEPT_DETAILS[id] || MOCK_DEPT_DETAILS['D-01'];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({...dept});

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
  };

  const handleDeleteDept = () => {
    navigate('/admin/departments');
  };

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
          <button onClick={() => navigate('/admin/departments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
            <button onClick={() => navigate('/admin/departments')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
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
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/admin/departments')} 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border shadow-sm w-max ${isDark ? '!bg-purple-600/10 text-purple-400 hover:text-purple-300 hover:!bg-purple-600/20 border-purple-500/20' : '!bg-white text-purple-700 hover:!bg-purple-50 border-purple-200'}`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-bold text-sm">Back to Departments</span>
                </button>
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${dept.bg} ${dept.color}`}>
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight">{dept.name}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">ID: {dept.id}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-purple-600 hover:!bg-purple-500 text-white shadow-purple-900/20' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}
                >
                  <Edit className="w-4 h-4" /> Edit Configuration
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Col - Overview */}
              <div className="space-y-8">
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold mb-6">Profile & Operations</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Department Head</p>
                      <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? '!bg-slate-800 text-slate-400' : '!bg-white shadow-sm text-slate-600'}`}>
                          <UserCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{dept.head}</p>
                          <p className="text-xs text-slate-500">{dept.headEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Assigned SLA</p>
                      <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? '!bg-amber-500/10 text-amber-400' : '!bg-amber-100 text-amber-600'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{dept.sla} Resolution Target</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Active Zones</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.zones.map((z, i) => (
                          <span key={i} className={`px-3 py-1.5 text-xs font-bold rounded-xl border shadow-sm flex items-center gap-1.5 ${isDark ? '!bg-slate-800 text-slate-300 border-slate-700' : '!bg-white text-slate-700 border-slate-200'}`}>
                            <MapPin className="w-3 h-3 text-slate-500" /> {z}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle & Right Col - Stats & Roster */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Metrics */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className={`border p-6 rounded-[2.5rem] shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-2xl ${isDark ? '!bg-rose-500/10 text-rose-400' : '!bg-rose-100 text-rose-600'}`}>
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Issues</p>
                    </div>
                    <p className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{dept.stats.activeIssues}</p>
                  </div>
                  
                  <div className={`border p-6 rounded-[2.5rem] shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-2xl ${isDark ? '!bg-emerald-500/10 text-emerald-400' : '!bg-emerald-100 text-emerald-600'}`}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">SLA Compliance</p>
                    </div>
                    <div className="flex items-end gap-3">
                      <p className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{dept.stats.slaCompliance}%</p>
                      <p className="text-sm font-bold text-emerald-500 pb-1">Above target</p>
                    </div>
                  </div>
                </div>

                {/* Staff Roster */}
                <div className={`border rounded-[2.5rem] p-8 shadow-xl backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} /> Field Staff & Supervisors
                    </h3>
                    <button className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors border shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white border-slate-700' : '!bg-white hover:!bg-slate-50 text-slate-700 border-slate-200'}`}>
                      View Full Roster
                    </button>
                  </div>

                  <div className={`border rounded-2xl overflow-hidden shadow-inner ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <table className="w-full text-left">
                      <thead className={`text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] border-b ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <tr>
                          <th className="px-6 py-4">Worker Info</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                        {dept.staff.map((worker) => (
                          <tr key={worker.id} className={`transition-colors group ${isDark ? 'hover:!bg-slate-800/30' : 'hover:!bg-blue-50/30'}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? '!bg-slate-800' : '!bg-white shadow-sm'}`}>
                                  <HardHat className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                                </div>
                                <div>
                                  <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{worker.name}</p>
                                  <p className="text-[10px] text-slate-500 font-bold tracking-widest">{worker.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{worker.role}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                worker.status === 'Active' 
                                  ? (isDark ? '!bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : '!bg-emerald-50 text-emerald-600 border-emerald-200')
                                  : (isDark ? '!bg-slate-800 text-slate-400 border-slate-700' : '!bg-slate-100 text-slate-600 border-slate-200')
                              }`}>
                                {worker.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${isDark ? '!bg-[#0f172a] border-slate-800' : '!bg-white border-slate-200'}`}>
            
            <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Edit className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Edit Configuration
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className={`p-2 rounded-xl transition-colors shadow-sm ${isDark ? 'text-slate-400 hover:text-white !bg-slate-800 hover:!bg-slate-700' : 'text-slate-600 hover:text-slate-900 !bg-white border border-slate-200 hover:!bg-slate-50'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="edit-dept-form" onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Department Name</label>
                  <input 
                    type="text" required
                    value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className={`w-full border rounded-2xl py-3.5 pl-4 pr-4 outline-none transition-all font-medium shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Department Head</label>
                  <input 
                    type="text" 
                    value={editForm.head} onChange={(e) => setEditForm({...editForm, head: e.target.value})}
                    className={`w-full border rounded-2xl py-3.5 pl-4 pr-4 outline-none transition-all font-medium shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Target SLA</label>
                  <select 
                    value={editForm.sla} onChange={(e) => setEditForm({...editForm, sla: e.target.value})}
                    className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-4 outline-none transition-all font-medium shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                  >
                    <option>12 Hours</option>
                    <option>24 Hours</option>
                    <option>48 Hours</option>
                    <option>72 Hours</option>
                  </select>
                </div>
              </form>
            </div>

            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <button 
                type="button" 
                onClick={handleDeleteDept} 
                className={`w-full sm:w-auto px-5 py-3 font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${isDark ? 'text-rose-400 hover:!bg-rose-500/10 border border-rose-500/20' : 'text-rose-600 hover:!bg-rose-50 border border-rose-200 !bg-white'}`}
              >
                <Trash2 className="w-4 h-4" /> Delete Department
              </button>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className={`flex-1 sm:flex-none px-5 py-3 font-bold transition-colors ${isDark ? '!bg-purple-500/10 text-slate-200 hover:text-white' : '!bg-purple-500/10 text-slate-600 hover:text-slate-900'}`}>
                  Cancel
                </button>
                <button type="submit" form="edit-dept-form" disabled={!editForm.name || !editForm.sla} className={`flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-[#a855f7] hover:!bg-[#9333ea] shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-600/30'}`}>
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DeptDetails;