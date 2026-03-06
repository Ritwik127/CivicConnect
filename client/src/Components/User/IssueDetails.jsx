import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  MessageSquare, 
  Image as ImageIcon,
  AlertTriangle,
  Camera,
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';

// --- MOCK DATA & UTILS ---
const MOCK_REPORTS = [
  { 
    id: 'R-8429', category: 'Pothole', location: 'Oxford Street, Downtown', status: 'IN-PROGRESS', date: 'Oct 24, 2026',
    desc: 'Large pothole in the middle lane causing significant traffic slowdowns. It has grown larger after the recent rain.', 
    dept: 'Roads & Transport Dept', assignedTo: 'Field Team Alpha',
    updates: [
      { date: 'Oct 24, 10:00 AM', msg: 'Issue reported by citizen.' },
      { date: 'Oct 24, 11:30 AM', msg: 'Under review by Roads Department.' },
      { date: 'Oct 24, 01:15 PM', msg: 'Field Worker (Team Alpha) dispatched to location for inspection.' }
    ]
  },
  // Add other mock objects here as needed
];

const CATEGORY_ICONS = {
  'Pothole': { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  'Garbage': { icon: Camera, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'Streetlight': { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
};

const StatusBadge = ({ status }) => {
  const styles = {
    'RESOLVED': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'IN-PROGRESS': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'OPEN': 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };
  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border opacity-90 ${styles[status] || styles['OPEN']}`}>
      {status}
    </span>
  );
};

// --- COMPONENT ---
const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  
  // Find report by ID or fallback to the first one for preview
  const issue = MOCK_REPORTS.find(r => r.id === id) || MOCK_REPORTS[0];
  
  const CatStyle = CATEGORY_ICONS[issue.category] || CATEGORY_ICONS['Pothole'];
  const MainIcon = CatStyle.icon;

  // Status mapping for timeline progress
  const statusMap = { 'OPEN': 0, 'IN-PROGRESS': 1, 'RESOLVED': 2 };
  const currentStepIdx = statusMap[issue.status] ?? 0;

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] border-r border-slate-800 h-full shrink-0">
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <span className="font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-blue-500">CivicConnect</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-left"
          >
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-blue-400 font-bold border border-blue-500/20 text-left"
          >
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl !bg-blue-600/10 text-slate-400 hover:bg-slate-800/50 transition-all text-left">
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
        
        {/* Header */}
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/my-reports')}
              className="lg:hidden p-2.5 bg-slate-800/50 text-slate-400 hover:text-white rounded-xl border border-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Issue Details</h1>
          </div>
          
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
          <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 text-white">
            
            {/* Contextual Nav (Matched to ReportIssuePage) */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/my-reports')} 
                className="flex items-center gap-2 !bg-blue-600/10 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white group transition-colors border border-blue-500/10 hover:border-blue-500/30"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Back to Reports</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Citizen Dashboard
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column: Details (Matched to ReportIssuePage Main Card) */}
              <div className="lg:col-span-2 space-y-8">
                <div className="!bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                  
                  {/* Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 pb-8 border-b border-slate-800">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${CatStyle.bg} ${CatStyle.color} shadow-inner`}>
                        <MainIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight">{issue.category} Issue</h1>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                          Report ID: <span className="text-slate-400">{issue.id}</span>
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>

                  {/* Location & Date Grid */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 group hover:border-slate-700 transition-colors shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Location Address</p>
                      <p className="font-bold text-slate-200 flex items-center gap-3"><MapPin className="w-5 h-5 text-blue-500" /> {issue.location}</p>
                    </div>
                    <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 group hover:border-slate-700 transition-colors shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Reported On</p>
                      <p className="font-bold text-slate-200 flex items-center gap-3"><Calendar className="w-5 h-5 text-blue-500" /> {issue.date}</p>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-3 mb-10">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</h3>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 min-h-[120px] text-slate-300 leading-relaxed text-base shadow-inner">
                      {issue.desc}
                    </div>
                  </div>

                  {/* Evidence Attached (Matched to ReportIssuePage Upload Preview) */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Evidence Attached</h3>
                    <div className="relative group rounded-[2.5rem] overflow-hidden border border-slate-800 aspect-[21/9] bg-slate-950 flex items-center justify-center shadow-lg hover:border-blue-500/50 transition-all cursor-pointer">
                      {/* Visual placeholder for image context */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 opacity-80"></div>
                      <div className="relative z-10 text-center space-y-3">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                          <ImageIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="font-bold text-blue-400 text-sm drop-shadow-md">evidence_photo_01.jpg</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">View Full Image</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Right Column: Tracking & Updates */}
              <div className="space-y-6">
                
                {/* Status Tracker Card */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] shadow-xl backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-8">Status Tracker</h3>
                  <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
                    {['Submitted', 'Assigned', 'Resolved'].map((step, idx) => {
                      const isActive = idx <= currentStepIdx;
                      const isCompleted = idx < currentStepIdx;
                      return (
                        <div key={step} className="relative pl-8">
                          {/* Timeline Node */}
                          <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full border-4 border-[#0f172a] transition-all flex items-center justify-center ${
                            isActive ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-700'
                          }`}>
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <h4 className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>{step}</h4>
                            {idx === 0 && <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-[0.2em]">{issue.updates[0]?.date}</p>}
                            {idx === 1 && currentStepIdx >= 1 && <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-[0.2em]">{issue.updates[1]?.date}</p>}
                            {idx === 2 && currentStepIdx === 2 && <p className="text-[10px] font-black text-emerald-500 mt-1 uppercase tracking-[0.2em]">Completed on {issue.date}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Department Info & Gov Updates */}
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] space-y-8 shadow-xl backdrop-blur-sm">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Assigned To</h3>
                    <div className="flex items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-inner group hover:border-slate-700 transition-colors">
                      <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{issue.dept}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{issue.assignedTo}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Gov Updates Log</h3>
                    <div className="space-y-4">
                      {issue.updates.map((upd, i) => (
                        <div key={i} className="bg-blue-950/20 border border-blue-900/40 p-5 rounded-2xl relative shadow-sm">
                          {/* Decorative Pointer */}
                          <div className="absolute -left-1.5 top-6 w-3 h-3 bg-slate-950 rotate-45 border-l border-t border-blue-900/40 shadow-sm z-0"></div>
                          <p className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mb-2 relative z-10">{upd.date}</p>
                          <p className="text-sm font-medium text-slate-300 leading-relaxed relative z-10">{upd.msg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feedback Action (Only visible if resolved) */}
                {issue.status === 'RESOLVED' && (
                  <button 
                    onClick={() => navigate(`/feedback/${issue.id}`)}
                    className="w-full !bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Provide Feedback
                  </button>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IssueDetails;