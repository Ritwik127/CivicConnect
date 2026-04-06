import React, { useEffect, useMemo, useState } from 'react';
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
  Check,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  Settings,
  LogOut,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';
import { fetchUserReportDetails, getReadableErrorMessage } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const CATEGORY_ICONS = {
  pothole: { icon: AlertTriangle, color: 'text-orange-500', bg: '!bg-orange-500/10' },
  garbage: { icon: Camera, color: 'text-emerald-500', bg: '!bg-emerald-500/10' },
  streetlight: { icon: AlertCircle, color: 'text-yellow-500', bg: '!bg-yellow-500/10' },
  waterleak: { icon: MapPin, color: 'text-cyan-500', bg: '!bg-cyan-500/10' },
};

function normalizeCategory(category) {
  return String(category || '').toLowerCase().replaceAll('-', '').replaceAll(' ', '');
}

function formatDate(value) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function buildStatusTracker(issue) {
  const normalizedStatus = String(issue?.status || 'open').toLowerCase();
  const history = Array.isArray(issue?.history) ? issue.history : [];
  const latestAssignment = issue?.latest_assignment || {};
  const latestTask = issue?.latest_task || {};

  const hasWorker = Boolean(latestTask.worker_name || latestTask.worker_id);
  const assignedDeptLabel = latestAssignment.department_name || issue?.department || latestTask.department_name || 'Pending department assignment';
  const assignedWorkerLabel = latestTask.worker_name || latestAssignment.assigned_to_user_name || 'Pending worker assignment';

  // Determine the current step index (0-7)
  let currentStepIndex = 0;
  if (normalizedStatus === 'in_progress') {
    currentStepIndex = 4; // In Progress
  } else if (latestTask.submitted_at) {
    currentStepIndex = 5; // Completed
  } else if (latestTask.started_at) {
    currentStepIndex = 3; // Work Started
  } else if (hasWorker) {
    currentStepIndex = 2; // Assigned to Worker
  } else if (assignedDeptLabel && assignedDeptLabel !== 'Pending department assignment') {
    currentStepIndex = 1; // Assigned to Department
  }

  const timeline = [
    {
      key: 'open',
      label: 'Submitted',
      detail: issue?.created_at ? formatDate(issue.created_at) : 'Awaiting report creation',
      active: currentStepIndex === 0,
      completed: currentStepIndex > 0,
    },
    {
      key: 'acknowledged',
      label: 'Assigned to Department',
      detail: assignedDeptLabel,
      active: currentStepIndex === 1,
      completed: currentStepIndex > 1,
    },
    {
      key: 'assigned_worker',
      label: 'Assigned to Worker',
      detail: assignedWorkerLabel,
      active: currentStepIndex === 2,
      completed: currentStepIndex > 2,
    },
    {
      key: 'work_started',
      label: 'Work Started',
      detail: latestTask.started_at ? formatDate(latestTask.started_at) : 'Pending work start',
      active: currentStepIndex === 3,
      completed: currentStepIndex > 3,
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      detail: normalizedStatus === 'in_progress' ? 'Work is currently underway' : 'Pending field action',
      active: currentStepIndex === 4,
      completed: currentStepIndex > 4,
    },
    {
      key: 'completed',
      label: 'Completed',
      detail: latestTask.submitted_at ? formatDate(latestTask.submitted_at) : 'Pending task completion',
      active: currentStepIndex === 5,
      completed: currentStepIndex > 5,
    },
    {
      key: 'pending_verification',
      label: 'Pending Verification',
      detail: latestTask.approved_at ? 'Verification completed' : 'Waiting for supervisor verification',
      active: currentStepIndex === 6,
      completed: currentStepIndex > 6,
    },
    {
      key: 'resolved',
      label: 'Resolved',
      detail: issue?.resolved_at
        ? formatDate(issue.resolved_at)
        : normalizedStatus === 'closed'
          ? 'Report closed by the department'
          : 'Pending resolution',
      active: currentStepIndex === 7,
      completed: currentStepIndex > 7 || normalizedStatus === 'resolved' || normalizedStatus === 'closed',
    },
  ];

  return timeline;
}

const StatusBadge = ({ status }) => {
  const styles = {
    resolved: '!bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    closed: '!bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
    in_progress: '!bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    open: '!bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    acknowledged: '!bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  const normalized = String(status || 'open').toLowerCase();

  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border opacity-90 ${styles[normalized] || styles.open}`}>
      {normalized.replaceAll('_', '-')}
    </span>
  );
};

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [issue, setIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;

    async function loadIssue() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchUserReportDetails(id);
        if (isActive) {
          setIssue(data);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(getReadableErrorMessage(error, 'Unable to load this issue.'));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadIssue();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'citizen' } });
  };

  const userName = user?.full_name || 'Citizen';
  const initials = useMemo(
    () =>
      userName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [userName],
  );

  const categoryKey = normalizeCategory(issue?.category || issue?.title);
  const CatStyle = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.pothole;
  const MainIcon = CatStyle.icon;
  const normalizedStatus = String(issue?.status || 'open').toLowerCase();
  const timelineEntries = buildStatusTracker(issue);

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-orange-400/10 rounded-full blur-[100px]"></div>
      </div>

      <aside className={`hidden lg:flex flex-col w-64 border-r h-full shrink-0 relative z-20 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800 shadow-lg shadow-black/20' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <span className="font-bold text-xl text-white">C</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>CivicUser</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/user/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => navigate('/user/report-issue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left transition-all ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
            <FileText className="w-5 h-5" /> My Reports
          </button>
          <button onClick={() => navigate('/user/notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </nav>

        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/user/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 transition-all text-left ${isDark ? '!bg-blue-500/10 hover:!bg-rose-500/10' : '!bg-blue-50 hover:!bg-rose-50 hover:shadow-sm'}`}>
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl transition-all duration-300 ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/user/my-reports')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Issue Details</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => navigate('/user/notifications')} className={`p-2.5 rounded-xl border relative transition-all shadow-sm ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:!bg-slate-800' : '!bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:!bg-slate-50'}`}>
              <Bell className="w-5 h-5" />
            </button>

            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Citizen</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20">
                {initials || 'CU'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/user/my-reports')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl group transition-all border shadow-sm ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700 hover:border-slate-500' : '!bg-white text-slate-600 hover:text-blue-700 border-slate-200 hover:border-blue-300'}`}>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">Back to Reports</span>
              </button>
              <button onClick={() => navigate('/user/dashboard')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isDark ? '!bg-blue-500/10 text-slate-500 hover:text-white' : '!bg-blue-50 text-slate-500 hover:text-slate-900'}`}>
                Citizen Dashboard
              </button>
            </div>

            {errorMessage ? (
              <div className={`rounded-[2rem] border px-6 py-5 text-sm ${isDark ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className={`rounded-[2rem] border p-12 flex items-center justify-center gap-3 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white border-slate-200'}`}>
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span>Loading issue details...</span>
              </div>
            ) : null}

            {!isLoading && issue ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className={`border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-xl shadow-slate-200/50'}`}>
                    <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 pb-8 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${CatStyle.bg} ${CatStyle.color}`}>
                          <MainIcon className="w-8 h-8" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-black tracking-tight">{issue.category || issue.title}</h1>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">
                            Report ID: <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{issue.tracking_code}</span>
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-10">
                      <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Location Address</p>
                        <p className={`font-bold flex items-center gap-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><MapPin className="w-5 h-5 text-blue-500" /> {issue.address || 'Address unavailable'}</p>
                      </div>
                      <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Reported On</p>
                        <p className={`font-bold flex items-center gap-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><Calendar className="w-5 h-5 text-blue-500" /> {formatDate(issue.created_at)}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-10">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</h3>
                      <div className={`w-full border rounded-3xl p-6 min-h-[120px] leading-relaxed text-base font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>
                        {issue.description || 'No description provided.'}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Evidence Attached</h3>
                      <div className={`relative group rounded-[2.5rem] overflow-hidden border aspect-[21/9] flex items-center justify-center shadow-md transition-all ${isDark ? '!bg-slate-950 border-slate-800' : '!bg-slate-100 border-slate-200'}`}>
                        <div className={`absolute inset-0 !bg-gradient-to-br opacity-80 ${isDark ? 'from-slate-900 via-slate-900/80 to-slate-950' : 'from-slate-100 via-slate-100/80 to-slate-200'}`}></div>
                        <div className="relative z-10 text-center space-y-3 px-6">
                          <div className="w-16 h-16 !bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <ImageIcon className="w-8 h-8 text-blue-500" />
                          </div>
                          <p className="font-bold text-blue-500 text-sm drop-shadow-md">No media available yet</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">The current backend does not return uploaded evidence.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`border p-8 rounded-[2.5rem] backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                    <h3 className={`text-xl font-black tracking-tight mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Status Tracker</h3>
                    <div className="relative ml-6 space-y-0">
                      
                      {timelineEntries.map((entry, idx) => {
                        const isActive = entry.active;
                        const isCompleted = entry.completed;
                        
                        return (
                          <div key={entry.label} className="relative pl-16 py-5">
                            {/* Connecting line segment */}
                            {idx < timelineEntries.length - 1 && (
                              <div
                                className={`absolute -left-[3px] top-8 w-1.5 h-full z-0 transition-colors duration-300 ${
                                  isCompleted ? '!bg-blue-600' : (isDark ? '!bg-slate-800' : '!bg-slate-200')
                                }`}
                              />
                            )}

                            {/* Large checkpoint circle */}
                            <div className={`absolute -left-5 top-3 w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center z-10 ${
                              isCompleted
                                ? '!bg-blue-600 border-blue-600'
                                : isActive
                                ? `border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] ${isDark ? '!bg-slate-900' : '!bg-white'}`
                                : `${isDark ? '!bg-slate-900 border-slate-700' : '!bg-white border-slate-300'}`
                            }`}>
                              {isCompleted ? (
                                <Check className="w-5 h-5 text-white font-bold" />
                              ) : isActive ? (
                                <div className="w-3 h-3 !bg-blue-600 rounded-full animate-pulse" />
                              ) : null}
                            </div>
                            
                            {/* Label and detail */}
                            <div>
                              <h4 className={`font-bold text-base transition-colors ${isActive || isCompleted ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>{entry.label}</h4>
                              <p className={`text-[10px] font-black mt-1 uppercase tracking-[0.2em] ${entry.key === 'resolved' && issue.resolved_at ? 'text-emerald-500' : 'text-slate-500'}`}>
                                {entry.detail}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={`border p-8 rounded-[2.5rem] space-y-8 backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-xl shadow-black/20' : '!bg-white/90 border-slate-200/60 shadow-lg shadow-slate-200/50'}`}>
                    <div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Assigned Department</h3>
                      <div className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm transition-colors ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="w-12 h-12 !bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{issue.department || 'Department pending'}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{issue.zone || 'Zone pending'}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Case Summary</h3>
                      <div className="space-y-4">
                        <div className={`border p-5 rounded-2xl relative shadow-sm ${isDark ? '!bg-blue-950/20 border-blue-900/40' : '!bg-blue-50/80 border-blue-100'}`}>
                          <p className={`text-[10px] font-black tracking-[0.2em] uppercase mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Tracking Code</p>
                          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{issue.tracking_code}</p>
                        </div>
                        <div className={`border p-5 rounded-2xl relative shadow-sm ${isDark ? '!bg-blue-950/20 border-blue-900/40' : '!bg-blue-50/80 border-blue-100'}`}>
                          <p className={`text-[10px] font-black tracking-[0.2em] uppercase mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Coordinates</p>
                          <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {typeof issue.latitude === 'number' && typeof issue.longitude === 'number'
                              ? `${issue.latitude.toFixed(5)}, ${issue.longitude.toFixed(5)}`
                              : 'Coordinates not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {normalizedStatus === 'resolved' ? (
                    <button onClick={() => navigate(`/feedback/${issue.id}`)} className={`w-full font-bold text-lg px-10 py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 ${isDark ? '!bg-emerald-600 hover:!bg-emerald-500 text-white shadow-emerald-900/20' : '!bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-600/30'}`}>
                      <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" /> Provide Feedback
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default IssueDetails;
