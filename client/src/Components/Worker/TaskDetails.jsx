import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  LayoutDashboard,
  ListTodo,
  Loader2,
  LogOut,
  MapPin,
  MessageSquare,
  Moon,
  Navigation,
  Upload,
  Settings,
  Sun,
} from 'lucide-react';
import {
  fetchWorkerTaskDetails,
  getReadableErrorMessage,
  markWorkerTaskInProgress,
  startWorkerTask,
  submitWorkerResolutionNotes,
  submitWorkerTaskProof,
} from '../../lib/api';
import { useAuth } from '../../lib/auth';

function formatLabel(value) {
  return String(value || '').replaceAll('_', ' ');
}

function formatDateTime(value) {
  if (!value) return 'Not available';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function initialsFor(name) {
  return String(name || 'CW')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const TaskDetails = () => {
  const navigate = useNavigate();
  const { taskCode } = useParams();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isStartingTask, setIsStartingTask] = useState(false);
  const [isMarkingProgress, setIsMarkingProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    let isActive = true;
    async function loadTask() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await fetchWorkerTaskDetails(taskCode);
        if (isActive) {
          setTask(data);
          setResolutionNotes(data?.resolution_notes || '');
        }
      } catch (error) {
        if (isActive) setErrorMessage(getReadableErrorMessage(error, 'Unable to load task details.'));
      } finally {
        if (isActive) setIsLoading(false);
      }
    }
    loadTask();
    return () => {
      isActive = false;
    };
  }, [taskCode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true, state: { role: 'worker' } });
  };

  const workerName = user?.full_name || 'Worker';
  const workerInitials = useMemo(() => initialsFor(workerName), [workerName]);
  const issue = task?.issue || {};
  const latestProof = task?.proofs?.length ? task.proofs[task.proofs.length - 1] : null;
  const issuePhotos = task?.issue?.photos || [];

  const syncTaskFromResponse = (response, fallbackMessage) => {
    if (response?.task) {
      setTask(response.task);
      setResolutionNotes(response.task.resolution_notes || '');
    }
    setSubmitMessage(response?.message || fallbackMessage);
  };

  const handleStartTask = async () => {
    try {
      setIsStartingTask(true);
      setErrorMessage('');
      setSubmitMessage('');
      const response = await startWorkerTask(taskCode);
      syncTaskFromResponse(response, 'Task started.');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to start task.'));
    } finally {
      setIsStartingTask(false);
    }
  };

  const handleMarkTaskInProgress = async () => {
    try {
      setIsMarkingProgress(true);
      setErrorMessage('');
      setSubmitMessage('');
      const response = await markWorkerTaskInProgress(taskCode);
      syncTaskFromResponse(response, 'Task marked as in progress.');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to update task status.'));
    } finally {
      setIsMarkingProgress(false);
    }
  };

  const handleProofSubmit = async (event) => {
    event.preventDefault();
    if (!proofFile) {
      setErrorMessage('Please upload a proof photo or video before submitting proof.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSubmitMessage('');
      const response = await submitWorkerTaskProof(taskCode, {
        proofFile,
        notes: resolutionNotes,
      });
      setProofFile(null);
      syncTaskFromResponse(response, 'Proof submitted successfully.');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to submit proof.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolutionNotesSubmit = async (event) => {
    event.preventDefault();
    if (!resolutionNotes.trim()) {
      setErrorMessage('Please add resolution notes before submitting.');
      return;
    }

    try {
      setIsSavingNotes(true);
      setErrorMessage('');
      setSubmitMessage('');
      const response = await submitWorkerResolutionNotes(taskCode, resolutionNotes);
      syncTaskFromResponse(response, 'Resolution notes submitted successfully.');
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to submit resolution notes.'));
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className={`flex min-h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <aside className={`hidden lg:flex flex-col w-64 border-r h-screen shrink-0 relative z-20 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="!bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-orange-500/30"><span className="font-bold text-xl text-white">C</span></div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>CivicWorker</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/worker/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><LayoutDashboard className="w-5 h-5" /> Dashboard</button>
          <button onClick={() => navigate('/worker/tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left ${isDark ? '!bg-orange-500/10 text-orange-400 border-orange-500/20' : '!bg-orange-50 text-orange-700 border-orange-200 shadow-sm'}`}><ListTodo className="w-5 h-5" /> My Tasks</button>
          <button onClick={() => navigate('/worker/communications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><MessageSquare className="w-5 h-5" /> Communications</button>
        </nav>
        <div className={`p-4 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button onClick={() => navigate('/worker/settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Settings className="w-5 h-5" /> Settings</button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-rose-500"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        <header className={`h-20 border-b px-8 flex items-center justify-between shrink-0 backdrop-blur-xl ${isDark ? '!bg-[#0f172a]/80 border-slate-800' : '!bg-white/80 border-slate-200/80 shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/worker/tasks')} className={`p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 text-slate-400 border-slate-700' : '!bg-slate-100 text-slate-600 border-slate-200'}`}><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">Task Details</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}>{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</button>
            <button onClick={() => navigate('/worker/notifications')} className={`p-2.5 rounded-xl border ${isDark ? '!bg-slate-800/50 border-slate-700 text-slate-400' : '!bg-white border-slate-200 text-slate-600'}`}><Bell className="w-5 h-5" /></button>
            <div className={`flex items-center gap-3 pl-4 sm:pl-6 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{workerName}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{user?.department || 'Worker'}</p>
              </div>
              <div className="w-11 h-11 !bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white">{workerInitials}</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-8">
            {isLoading ? (
              <div className={`border rounded-[2.5rem] p-12 flex items-center justify-center gap-3 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60'}`}><Loader2 className="w-5 h-5 animate-spin text-orange-500" /><span className="font-medium">Loading task details...</span></div>
            ) : errorMessage ? (
              <div className={`border rounded-[2.5rem] p-8 flex items-start gap-3 ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}><AlertCircle className="w-5 h-5 mt-0.5" /><div><p className="font-bold">Unable to load task details</p><p className="text-sm mt-1">{errorMessage}</p></div></div>
            ) : (
              <>
                <div className={`border rounded-[2.5rem] p-8 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8 pb-6 border-b border-slate-200/20">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight">{issue.title || issue.category || task?.title}</h1>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Task Code: <span>{task?.task_code}</span></p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-orange-500">{formatLabel(task?.priority)} priority</p>
                      <p className="text-sm font-medium text-slate-500">{formatLabel(task?.status)}</p>
                      <button
                        type="button"
                        onClick={handleStartTask}
                        disabled={isStartingTask || task?.status === 'in_progress'}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isStartingTask ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                        {task?.status === 'in_progress' ? 'In Progress' : 'Start Task'}
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-5 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Address</p>
                      <p className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> {issue.address || 'No address available'}</p>
                      <p className="text-xs text-slate-500 mt-2">{issue.zone || 'Unknown zone'} / {issue.ward || 'Unknown ward'}</p>
                    </div>
                    <div className={`p-5 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Timeline</p>
                      <p className="font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Due {formatDateTime(task?.due_at)}</p>
                      <p className="text-xs text-slate-500 mt-2">Assigned {formatDateTime(task?.assigned_at)}</p>
                      <p className="text-xs text-slate-500 mt-1">Started {formatDateTime(task?.started_at)}</p>
                    </div>
                    <div className={`md:col-span-2 p-5 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Description</p>
                      <p className="text-sm leading-relaxed">{task?.description || issue.description || 'No description available.'}</p>
                    </div>
                    <div className={`p-5 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Coordinates</p>
                      <p className="text-sm">{issue.latitude && issue.longitude ? `${issue.latitude}, ${issue.longitude}` : 'No coordinates available'}</p>
                    </div>
                    <div className={`p-5 rounded-2xl border flex items-center justify-between ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Navigation</p>
                        <p className="text-sm text-slate-500">Open this issue in your maps app.</p>
                      </div>
                      <a href={issue.latitude && issue.longitude ? `https://www.google.com/maps?q=${issue.latitude},${issue.longitude}` : undefined} target="_blank" rel="noreferrer" className={`px-4 py-2 rounded-xl text-xs font-bold ${issue.latitude && issue.longitude ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500 pointer-events-none'}`}>
                        <span className="inline-flex items-center gap-2"><Navigation className="w-4 h-4" /> Navigate</span>
                      </a>
                    </div>
                    <div className={`md:col-span-2 p-5 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Assigned Supervisor</p>
                      <p className="text-sm font-bold">{task?.supervisor?.full_name || 'Not assigned'}</p>
                      <p className="text-xs text-slate-500 mt-1">{task?.supervisor?.email || 'No supervisor contact available'}</p>
                    </div>
                  </div>
                </div>

                <div className={`border rounded-[2.5rem] p-8 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Task Actions</h3>
                  {submitMessage ? (
                    <div className={`rounded-2xl border px-4 py-3 text-sm mb-4 ${isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                      {submitMessage}
                    </div>
                  ) : null}

                  <form onSubmit={handleProofSubmit} className="space-y-4">
                    <div className={`p-4 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Submit Proof</label>
                      <label className={`flex items-center gap-3 px-4 py-4 rounded-2xl border cursor-pointer ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
                        <Upload className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium flex-1">{proofFile ? proofFile.name : 'Choose proof photo or video'}</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(event) => setProofFile(event.target.files?.[0] || null)}
                        />
                      </label>
                      <div className="flex justify-end mt-3">
                        <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-600 flex items-center gap-2 disabled:opacity-60">
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Submit Proof
                        </button>
                      </div>
                    </div>
                  </form>

                  <form onSubmit={handleResolutionNotesSubmit} className="space-y-4 mt-4">
                    <div className={`p-4 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">Submit Resolution Notes</label>
                      <textarea
                        value={resolutionNotes}
                        onChange={(event) => setResolutionNotes(event.target.value)}
                        rows={5}
                        className={`w-full border rounded-[1.5rem] p-4 outline-none ${isDark ? '!bg-slate-900/70 border-slate-700 text-slate-200' : '!bg-white border-slate-200 text-slate-900'}`}
                        placeholder="Describe the work completed and any on-site notes."
                      />
                    </div>
                    <div className={`p-4 rounded-2xl border text-sm ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>
                      Resolution notes: {task?.resolution_notes || 'No resolution notes submitted yet.'}
                    </div>
                    {latestProof ? (
                      <div className={`p-4 rounded-2xl border text-sm ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-300' : '!bg-slate-50/80 border-slate-200 text-slate-700'}`}>
                        <div className="flex items-center gap-2 font-bold mb-2"><FileText className="w-4 h-4 text-orange-500" /> Latest Proof</div>
                        <a href={latestProof.file_url} target="_blank" rel="noreferrer" className="text-blue-500 underline break-all">{latestProof.file_url}</a>
                        <div className="mt-2 text-xs text-slate-500">Uploaded {formatDateTime(latestProof.uploaded_at)}</div>
                      </div>
                    ) : null}
                    <div className="flex justify-end">
                      <button type="submit" disabled={isSavingNotes} className="px-6 py-3 rounded-2xl font-bold text-white bg-emerald-600 flex items-center gap-2 disabled:opacity-60">
                        {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        Submit Resolution Notes
                      </button>
                    </div>
                  </form>
                </div>

                <div className={`border rounded-[2.5rem] p-8 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold mb-4">Issue Photos</h3>
                  {issuePhotos.length ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {issuePhotos.map((photoUrl) => (
                        <a key={photoUrl} href={photoUrl} target="_blank" rel="noreferrer" className={`block rounded-2xl border overflow-hidden ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <img src={photoUrl} alt="Issue evidence" className="w-full h-40 object-cover" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No issue photos available.</p>
                  )}
                </div>

                <div className={`border rounded-[2.5rem] p-8 ${isDark ? '!bg-slate-900/80 border-slate-800' : '!bg-white/90 border-slate-200/60 shadow-slate-200/50'}`}>
                  <h3 className="text-xl font-bold mb-4">Task History</h3>
                  <div className="space-y-3">
                    {(task?.history || []).map((item, index) => (
                      <div key={`${item.event_type}-${item.at}-${index}`} className={`p-4 rounded-2xl border ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-bold text-sm">{item.title}</p>
                          <p className="text-xs text-slate-500">{formatDateTime(item.at)}</p>
                        </div>
                        {item.note ? <p className="text-xs mt-1 text-slate-500">{item.note}</p> : null}
                      </div>
                    ))}
                    {!task?.history?.length ? (
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No history available for this task yet.</p>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDetails;
