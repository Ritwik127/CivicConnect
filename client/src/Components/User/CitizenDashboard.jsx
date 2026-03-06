import React, { useState } from 'react';
import { useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Settings, 
  LogOut, 
  ChevronRight,
  FileText,
  MapPin,
  Camera,
  LayoutDashboard
} from 'lucide-react';

const CitizenDashboardContent = () => {
  const navigate = useNavigate();
  const [userName] = useState("John Doe");

  const stats = [
    { label: 'Open', count: 4, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'In-Progress', count: 2, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Resolved', count: 12, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const recentReports = [
    { id: 'R-8429', type: 'Pothole', location: 'Oxford Street', status: 'IN-PROGRESS', date: '2 hours ago' },
    { id: 'R-8425', type: 'Garbage', location: 'Park Avenue', status: 'OPEN', date: '5 hours ago' },
    { id: 'R-8412', type: 'Streetlight', location: 'Baker St', status: 'RESOLVED', date: 'Yesterday' },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white font-sans overflow-hidden">
      
      {/* Sidebar - Full height fixed */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] border-r border-slate-800 h-full shrink-0">
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <span className="font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-blue-500">CivicConnect</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-left">
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left">
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button
             onClick={() => navigate('/notifications')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left">
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left">
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
        
        {/* Header - Aligned to Sidebar */}
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black tracking-tight">Citizen Dashboard</h1>
          
          <div className="flex items-center gap-6">
            <button
            onClick={() => navigate('/notifications')}
            className="p-2.5 !bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0f172a]"></span>
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
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Greeting & Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">Hello, {userName.split(' ')[0]}! 👋</h2>
                <p className="text-slate-400 mt-1">Check the status of your reports and neighborhood updates.</p>
              </div>
              <button 
                onClick={() => navigate('/report-issue')}
                className="!bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                Report New Issue
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, i) => {
                const IconComp = stat.icon;
                return (
                  <div key={i} className="bg-slate-900/50 border border-slate-800 p-7 rounded-3xl flex items-center gap-6 hover:bg-slate-900 transition-all group">
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-black mt-1">{stat.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Reports Table */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold">My Recent Reports</h3>
                  <button className="text-sm font-bold text-blue-500 !bg-blue-500/10 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-all">View All</button>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-800/30 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                        <tr>
                          <th className="px-8 py-5">Issue</th>
                          <th className="px-8 py-5">Location</th>
                          <th className="px-8 py-5 text-center">Status</th>
                          <th className="px-8 py-5 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {recentReports.map((report) => (
                          <tr key={report.id} className="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                                  {report.type === 'Pothole' ? <MapPin className="w-5 h-5 text-rose-400" /> : 
                                   report.type === 'Garbage' ? <Camera className="w-5 h-5 text-emerald-400" /> : 
                                   <AlertCircle className="w-5 h-5 text-amber-400" />}
                                </div>
                                <div>
                                  <p className="font-bold">{report.type}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase">ID: {report.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-400 font-medium">{report.location}</td>
                            <td className="px-8 py-6 text-center">
                              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest border border-current opacity-80 ${
                                report.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                report.status === 'IN-PROGRESS' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-rose-500/10 text-rose-500'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right text-xs text-slate-500 font-bold">
                              <div className="flex items-center justify-end gap-2 group-hover:text-slate-300">
                                 {report.date} <ChevronRight className="w-4 h-4 opacity-30" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Sidebar Content (Notifications) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-bold">Notifications</h3>
                  <button className="text-xs font-bold text-blue-500 !bg-blue-500/10 hover:text-white uppercase tracking-widest">Clear All</button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 1, title: 'Issue Resolved!', desc: 'Your report #R-8412 has been marked as resolved.', time: '1h ago', type: 'success' },
                    { id: 2, title: 'Worker Assigned', desc: 'A field worker is heading to Oxford Street.', time: '3h ago', type: 'info' }
                  ].map((note) => (
                    <div key={note.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-sm font-bold ${note.type === 'success' ? 'text-emerald-400' : 'text-blue-400'}`}>{note.title}</h4>
                        <span className="text-[10px] font-bold text-slate-500">{note.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{note.desc}</p>
                    </div>
                  ))}
                  
                  <button className="w-full py-4 text-[10px] font-black  text-blue-500 !bg-blue-500/10 hover:text-white uppercase tracking-[0.3em] border border-dashed border-slate-800 rounded-2xl transition-all">
                    Load Older Notifications
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

const CitizenDashboard = () => {
  let inRouter;
  try {
    inRouter = useInRouterContext();
  } catch (e) {
    inRouter = false;
  }
  
  if (!inRouter) {
    return (
      <BrowserRouter>
        <CitizenDashboardContent />
      </BrowserRouter>
    );
  }
  
  return <CitizenDashboardContent />;
};

export default CitizenDashboard;