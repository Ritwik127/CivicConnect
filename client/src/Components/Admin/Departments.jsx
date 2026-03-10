import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  PlusCircle, 
  Edit, 
  MapPin, 
  Clock,
  ChevronRight,
  Users,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  ArrowLeft,
  X,
  Save,
  Eye,
  Sun,
  Moon
} from 'lucide-react';

const INITIAL_DEPTS = [
  { id: 'D-01', name: 'Roads & Transport', head: 'Marcus Thorne', zones: ['Downtown', 'North Sector'], sla: '48 Hours', activeIssues: 420, color: 'text-orange-500', bg: '!bg-orange-500/10' },
  { id: 'D-02', name: 'Sanitation Dept', head: 'Elena Rodriguez', zones: ['All Zones'], sla: '24 Hours', activeIssues: 215, color: 'text-emerald-500', bg: '!bg-emerald-500/10' },
  { id: 'D-03', name: 'Water & Sewage', head: 'David Chen', zones: ['West End', 'South District'], sla: '12 Hours', activeIssues: 350, color: 'text-blue-500', bg: '!bg-blue-500/10' },
  { id: 'D-04', name: 'Electrical Division', head: 'Sarah Jenkins', zones: ['Downtown', 'East Side'], sla: '24 Hours', activeIssues: 180, color: 'text-yellow-500', bg: '!bg-yellow-500/10' },
  { id: 'D-05', name: 'Parks & Recreation', head: 'Michael Chang', zones: ['North Sector', 'East Side'], sla: '72 Hours', activeIssues: 45, color: 'text-purple-500', bg: '!bg-purple-500/10' },
];

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const [departments, setDepartments] = useState(INITIAL_DEPTS);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const openAddModal = () => {
    setEditingDept({ id: `D-0${departments.length + 1}`, name: '', head: '', zones: [], sla: '48 Hours', activeIssues: 0, color: 'text-purple-500', bg: '!bg-purple-500/10' });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const exists = departments.find(d => d.id === editingDept.id);
    if (exists) setDepartments(departments.map(d => d.id === editingDept.id ? editingDept : d));
    else setDepartments([...departments, editingDept]);
    setIsEditModalOpen(false);
  };

  const toggleZone = (zone) => {
    if (editingDept.zones.includes(zone)) {
      setEditingDept({...editingDept, zones: editingDept.zones.filter(z => z !== zone)});
    } else {
      setEditingDept({...editingDept, zones: [...editingDept.zones, zone]});
    }
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
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
                <h2 className="text-3xl font-black tracking-tight">Department Management</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage civic departments, SLAs, and operating zones.</p>
              </div>
              <button onClick={openAddModal} className={`px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-purple-600 hover:!bg-purple-500 text-white shadow-purple-900/20' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                <PlusCircle className="w-5 h-5" /> Add Department
              </button>
            </div>

            {/* Departments Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <div key={dept.id} className={`border rounded-[2rem] p-6 flex flex-col transition-all duration-300 group hover:-translate-y-1 backdrop-blur-xl shadow-sm ${isDark ? '!bg-slate-900/60 border-slate-800 hover:border-slate-600 shadow-black/20' : '!bg-white/90 border-slate-200/60 hover:!bg-white hover:border-purple-300 hover:shadow-lg'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${dept.bg} ${dept.color}`}>
                      <Building2 className="w-7 h-7" />
                    </div>
                    <button 
                      onClick={() => navigate(`/admin/deptdetails/${dept.id}`)}
                      className={`p-2.5 rounded-xl border transition-colors shadow-sm ${isDark ? '!bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:!bg-slate-700' : '!bg-slate-50 text-slate-600 hover:text-purple-700 border-slate-200 hover:!bg-purple-50'}`}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-6 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl tracking-tight">{dept.name}</h3>
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Dept ID: {dept.id}</p>
                    
                    <div className="mt-4 space-y-2">
                      <p className={`text-sm flex items-center gap-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Users className="w-4 h-4 text-slate-400" /> Head: {dept.head || 'Unassigned'}
                      </p>
                      <p className={`text-sm flex items-center gap-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Clock className="w-4 h-4 text-slate-400" /> SLA: {dept.sla}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-5 border-t space-y-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Operating Zones</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.zones.map((zone, i) => (
                          <span key={i} className={`px-2.5 py-1 text-xs font-bold rounded-lg border shadow-sm ${isDark ? '!bg-slate-800 text-slate-300 border-slate-700' : '!bg-slate-100 text-slate-700 border-slate-200'}`}>{zone}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 rounded-xl border shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Issues</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black">{dept.activeIssues}</span>
                        <div className="w-2 h-2 rounded-full !bg-rose-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${isDark ? '!bg-[#0f172a] border-slate-800' : '!bg-white border-slate-200'}`}>
            
            <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Building2 className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> Add New Department
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
                    value={editingDept.name} onChange={(e) => setEditingDept({...editingDept, name: e.target.value})}
                    placeholder="e.g. Traffic Management"
                    className={`w-full border rounded-2xl py-3.5 pl-4 pr-4 outline-none transition-all font-medium shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Department Head (Optional)</label>
                  <input 
                    type="text" 
                    value={editingDept.head} onChange={(e) => setEditingDept({...editingDept, head: e.target.value})}
                    placeholder="e.g. Jane Smith"
                    className={`w-full border rounded-2xl py-3.5 pl-4 pr-4 outline-none transition-all font-medium shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Target SLA (Resolution Time)</label>
                  <select 
                    value={editingDept.sla} onChange={(e) => setEditingDept({...editingDept, sla: e.target.value})}
                    className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-4 outline-none transition-all font-medium shadow-inner ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                  >
                    <option>12 Hours</option>
                    <option>24 Hours</option>
                    <option>48 Hours</option>
                    <option>72 Hours</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Operating Zones</label>
                  <div className="flex flex-wrap gap-2">
                    {['Downtown', 'North Sector', 'South District', 'East Side', 'West End', 'All Zones'].map(zone => {
                      const isSelected = editingDept.zones.includes(zone);
                      return (
                        <button 
                          key={zone} type="button"
                          onClick={() => toggleZone(zone)}
                          className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all flex items-center gap-2 ${
                            isSelected 
                              ? (isDark ? '!bg-purple-600/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : '!bg-purple-50 border-purple-500 text-purple-700 shadow-sm') 
                              : (isDark ? '!bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600' : '!bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm')
                          }`}
                        >
                          {zone}
                          {isSelected && <div className={`w-2 h-2 rounded-full ${isDark ? '!bg-purple-400' : '!bg-purple-600'}`}></div>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </form>
            </div>

            <div className={`flex items-center justify-end gap-3 p-6 border-t shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className={`px-5 py-3 font-bold transition-colors ${isDark ? '!bg-purple-500/10 text-slate-200 hover:text-white' : '!bg-purple-500/10 text-slate-600 hover:text-slate-900'}`}>
                Cancel
              </button>
              <button type="submit" form="edit-dept-form" disabled={!editingDept.name || !editingDept.sla || editingDept.zones.length === 0} className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-[#a855f7] hover:!bg-[#9333ea] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                <Save className="w-5 h-5" /> Save Department
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentsPage;