import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users,
  LayoutDashboard,
  ListTodo,
  BarChart3,
  ClipboardList,
  Settings,
  LogOut,
  Filter,
  ChevronDown,
  ShieldCheck,
  HardHat,
  UserCircle2,
  UserCheck,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Mail,
  User,
  Save,
  ArrowLeft,
  PlusCircle,
  Sun,
  Moon
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 'USR-1042', name: 'Marcus Thorne', email: 'm.thorne@civic.gov', role: 'Dept Head', dept: 'Roads & Transport', zone: 'All Zones', status: 'Active' },
  { id: 'USR-1089', name: 'Mike Reynolds', email: 'm.reynolds@civic.gov', role: 'Field Worker', dept: 'Roads & Transport', zone: 'Downtown', status: 'Active' },
  { id: 'USR-1102', name: 'Anita Patel', email: 'a.patel@civic.gov', role: 'Supervisor', dept: 'Sanitation Dept', zone: 'North Sector', status: 'Active' },
  { id: 'USR-1155', name: 'James Wilson', email: 'j.wilson@civic.gov', role: 'Field Worker', dept: 'Sanitation Dept', zone: 'South District', status: 'Suspended' },
  { id: 'USR-0992', name: 'Sarah Jenkins', email: 's.jenkins@civic.gov', role: 'System Admin', dept: 'All Departments', zone: 'Global', status: 'Active' },
];

const RoleIcon = ({ role, isDark }) => {
  if (role === 'System Admin') return <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />;
  if (role === 'Dept Head') return <UserCheck className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />;
  if (role === 'Supervisor') return <UserCircle2 className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />;
  return <HardHat className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />;
};

const UserRoleManagement = () => {
  const navigate = useNavigate();
  const [adminName] = useState("Sarah Jenkins");
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [filterRole, setFilterRole] = useState('ALL');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = usersList.filter(u => filterRole === 'ALL' || u.role.includes(filterRole));

  const openAddModal = () => {
    setEditingUser({ id: `USR-${Math.floor(1000 + Math.random() * 9000)}`, name: '', email: '', role: 'Field Worker', dept: 'Roads & Transport', zone: 'Downtown', status: 'Active' });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const exists = usersList.find(u => u.id === editingUser.id);
    if (exists) setUsersList(usersList.map(u => u.id === editingUser.id ? editingUser : u));
    else setUsersList([editingUser, ...usersList]);
    setIsEditModalOpen(false);
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
          <button onClick={() => navigate('/admin/departments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-purple-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-purple-50 text-slate-600 hover:!bg-white hover:text-purple-700 hover:shadow-sm'}`}>
            <Building2 className="w-5 h-5" /> Departments
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border transition-all text-left ${isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-700 border-purple-200 shadow-sm'}`}>
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
                <h2 className="text-3xl font-black tracking-tight">Users & Roles</h2>
                <p className={`mt-1.5 text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage system access, worker assignments, and role permissions.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 p-1.5 rounded-2xl w-max border shadow-sm ${isDark ? '!bg-slate-900/50 border-slate-800' : '!bg-white border-slate-200/60'}`}>
                  {['ALL', 'Admin', 'Dept Head', 'Worker'].map((f) => (
                    <button 
                      key={f} onClick={() => setFilterRole(f)} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${
                        filterRole === f 
                          ? (isDark ? '!bg-slate-800 text-white shadow-md' : '!bg-slate-100 text-slate-900 shadow-sm') 
                          : (isDark ? '!bg-transparent text-slate-500 hover:text-slate-300 hover:!bg-slate-800/50' : '!bg-transparent text-slate-500 hover:text-slate-700 hover:!bg-slate-50')
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button onClick={openAddModal} className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 whitespace-nowrap ${isDark ? '!bg-purple-600 hover:!bg-purple-500 text-white shadow-purple-900/20' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                  <PlusCircle className="w-4 h-4" /> Add User
                </button>
              </div>
            </div>

            {/* Users Table Card */}
            <div className={`border rounded-[2.5rem] shadow-xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/60 border-slate-800 shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className={`text-[10px] font-black uppercase tracking-[0.2em] border-b ${isDark ? '!bg-slate-950/50 text-slate-500 border-slate-800' : '!bg-slate-50/80 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th className="px-6 py-5 pl-8">Personnel</th>
                      <th className="px-6 py-5">Role & Department</th>
                      <th className="px-6 py-5">Assignment Zone</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5 text-right pr-8">Manage</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className={`transition-colors group ${isDark ? 'hover:!bg-slate-800/30' : 'hover:!bg-blue-50/30'}`}>
                        
                        <td className="px-6 py-5 pl-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${isDark ? '!bg-slate-800 border-slate-700 text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/50' : '!bg-white border-slate-200 text-slate-500 group-hover:text-purple-600 group-hover:border-purple-300'}`}>
                              <UserCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user.name}</p>
                              <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest shadow-sm ${
                              user.role === 'System Admin' ? (isDark ? '!bg-purple-500/10 text-purple-400 border-purple-500/20' : '!bg-purple-50 text-purple-600 border-purple-200') :
                              user.role === 'Dept Head' ? (isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-600 border-blue-200') :
                              (isDark ? '!bg-amber-500/10 text-amber-400 border-amber-500/20' : '!bg-amber-50 text-amber-600 border-amber-200')
                            }`}>
                              <RoleIcon role={user.role} isDark={isDark} /> {user.role}
                            </span>
                            <span className={`text-sm font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              <Building2 className="w-3.5 h-3.5 text-slate-400" /> {user.dept}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{user.zone}</span>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border shadow-sm w-max ${
                            user.status === 'Active' 
                              ? (isDark ? '!bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : '!bg-emerald-50 text-emerald-600 border-emerald-200')
                              : (isDark ? '!bg-rose-500/10 text-rose-400 border-rose-500/20' : '!bg-rose-50 text-rose-600 border-rose-200')
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? '!bg-emerald-500' : '!bg-rose-500'}`}></div>
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => {setEditingUser(user); setIsEditModalOpen(true);}}
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-purple-600/20 text-slate-400 hover:text-purple-400 border border-slate-700 hover:border-purple-500/50' : '!bg-white hover:!bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-300'}`}
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className={`p-2.5 rounded-xl transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50' : '!bg-white hover:!bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-300'}`}
                              title="Delete/Suspend"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className={`p-6 flex items-center justify-between border-t ${isDark ? 'border-slate-800 !bg-slate-950/50' : 'border-slate-200 !bg-slate-50/80'}`}>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing {filteredUsers.length} Users</span>
                <div className="flex items-center gap-2">
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 ${isDark ? '!bg-slate-800 text-slate-400 hover:!bg-slate-700' : '!bg-white text-slate-700 border border-slate-200 hover:!bg-slate-50'}`}>Prev</button>
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm ${isDark ? '!bg-slate-800 text-slate-200 hover:!bg-slate-700' : '!bg-white text-slate-700 border border-slate-200 hover:!bg-slate-50'}`}>Next</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${isDark ? '!bg-[#0f172a] border-slate-800' : '!bg-white border-slate-200'}`}>
            
            <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <div className="flex items-center gap-3">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {editingUser.name ? <Edit className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} /> : <User className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />} 
                  {editingUser.name ? 'Edit User Profile' : 'Add New User'}
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className={`p-2 rounded-xl transition-colors shadow-sm ${isDark ? 'text-slate-400 hover:text-white !bg-slate-800 hover:!bg-slate-700' : 'text-slate-600 hover:text-slate-900 !bg-white border border-slate-200 hover:!bg-slate-50'}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="edit-user-form" onSubmit={handleEditSubmit} className="space-y-6">
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative group shadow-sm rounded-2xl">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                      <input 
                        type="text" required
                        value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                        className={`w-full border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group shadow-sm rounded-2xl">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-purple-400' : 'text-slate-400 group-focus-within:text-purple-600'}`} />
                      <input 
                        type="email" required
                        value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                        className={`w-full border rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`} 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">System Role</label>
                    <div className="relative shadow-sm rounded-2xl">
                      <select 
                        value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                        className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                      >
                        <option>System Admin</option>
                        <option>Dept Head</option>
                        <option>Supervisor</option>
                        <option>Field Worker</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Department</label>
                    <div className="relative shadow-sm rounded-2xl">
                      <select 
                        value={editingUser.dept} onChange={(e) => setEditingUser({...editingUser, dept: e.target.value})}
                        className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                      >
                        <option>All Departments</option>
                        <option>Roads & Transport</option>
                        <option>Sanitation Dept</option>
                        <option>Water & Sewage</option>
                        <option>Electrical</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Status</label>
                    <div className="relative shadow-sm rounded-2xl">
                      <select 
                        value={editingUser.status} onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                        className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                      >
                        <option>Active</option>
                        <option>Suspended</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Assigned Zone</label>
                    <div className="relative shadow-sm rounded-2xl">
                      <select 
                        value={editingUser.zone} onChange={(e) => setEditingUser({...editingUser, zone: e.target.value})}
                        className={`w-full appearance-none border rounded-2xl py-3.5 pl-4 pr-10 outline-none transition-all font-medium ${isDark ? '!bg-slate-950 border-slate-800 focus:border-purple-500 text-slate-200' : '!bg-slate-50 border-slate-200 focus:border-purple-600 text-slate-900 focus:!bg-white'}`}
                      >
                        <option>Downtown</option>
                        <option>North Sector</option>
                        <option>West End</option>
                        <option>South District</option>
                        <option>All Zones</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className={`flex items-center justify-end gap-3 p-6 border-t shrink-0 ${isDark ? 'border-slate-800 !bg-slate-900/50' : 'border-slate-200 !bg-slate-50/80'}`}>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className={`px-5 py-3 font-bold transition-colors ${isDark ? '!bg-purple-500/10 text-slate-200 hover:text-white' : '!bg-purple-500/10 text-slate-600 hover:text-slate-900'}`}>
                Cancel
              </button>
              <button type="submit" form="edit-user-form" className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-[#a855f7] hover:!bg-[#9333ea] text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' : '!bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-purple-600/30'}`}>
                <Save className="w-5 h-5" /> Save User Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UserRoleManagement;