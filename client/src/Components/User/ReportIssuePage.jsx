import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  LayoutDashboard,
  FileText,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  AlertTriangle,
  Camera,
  Activity,
  MapPin,
  Map as MapIcon,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Shield,
  Building2,
  Trash2,
  Droplets,
  Zap,
  Trees,
  PawPrint,
  Waves,
  CarFront,
} from 'lucide-react';
import { createCitizenReport, getReadableErrorMessage } from '../../lib/api';
import { useAuth } from '../../lib/auth';

const departmentOptions = [
  {
    id: 'ROADS',
    label: 'Roads',
    icon: AlertTriangle,
    color: 'text-orange-500',
    bg: '!bg-orange-500/10',
    hover: 'hover:border-orange-400/70 hover:!bg-orange-500/5',
    issues: [
      { id: 'pothole', label: 'Pothole', icon: AlertTriangle },
      { id: 'road-damage', label: 'Road Damage', icon: AlertTriangle },
      { id: 'footpath-damage', label: 'Footpath Damage', icon: AlertTriangle },
      { id: 'road-sinking', label: 'Road Sinking', icon: AlertTriangle },
      { id: 'road-markings', label: 'Road Markings', icon: AlertTriangle },
      { id: 'speed-breaker', label: 'Speed Breaker', icon: AlertTriangle },
    ],
  },
  {
    id: 'SWM',
    label: 'SWM',
    icon: Trash2,
    color: 'text-emerald-500',
    bg: '!bg-emerald-500/10',
    hover: 'hover:border-emerald-400/70 hover:!bg-emerald-500/5',
    issues: [
      { id: 'garbage-overflow', label: 'Garbage Overflow', icon: Trash2 },
      { id: 'missed-garbage', label: 'Missed Garbage', icon: Trash2 },
      { id: 'illegal-dumping', label: 'Illegal Dumping', icon: Trash2 },
      { id: 'street-cleaning', label: 'Street Cleaning', icon: Trash2 },
      { id: 'dead-animal', label: 'Dead Animal', icon: Trash2 },
    ],
  },
  {
    id: 'WATER',
    label: 'Water',
    icon: Droplets,
    color: 'text-cyan-500',
    bg: '!bg-cyan-500/10',
    hover: 'hover:border-cyan-400/70 hover:!bg-cyan-500/5',
    issues: [
      { id: 'water-leak', label: 'Water Leak', icon: Droplets },
      { id: 'no-water', label: 'No Water', icon: Droplets },
      { id: 'sewer-overflow', label: 'Sewer Overflow', icon: Droplets },
      { id: 'drain-blockage', label: 'Drain Blockage', icon: Droplets },
      { id: 'dirty-water', label: 'Dirty Water', icon: Droplets },
    ],
  },
  {
    id: 'ELECTRIC',
    label: 'Electric',
    icon: Zap,
    color: 'text-yellow-500',
    bg: '!bg-yellow-500/10',
    hover: 'hover:border-yellow-400/70 hover:!bg-yellow-500/5',
    issues: [
      { id: 'streetlight-off', label: 'Streetlight Off', icon: Zap },
      { id: 'pole-damage', label: 'Pole Damage', icon: Zap },
      { id: 'loose-wire', label: 'Loose Wire', icon: Zap },
      { id: 'transformer-fault', label: 'Transformer Fault', icon: Zap },
    ],
  },
  {
    id: 'PARKS',
    label: 'Parks',
    icon: Trees,
    color: 'text-lime-500',
    bg: '!bg-lime-500/10',
    hover: 'hover:border-lime-400/70 hover:!bg-lime-500/5',
    issues: [
      { id: 'fallen-tree', label: 'Fallen Tree', icon: Trees },
      { id: 'tree-block', label: 'Tree Block', icon: Trees },
      { id: 'park-damage', label: 'Park Damage', icon: Trees },
      { id: 'overgrowth', label: 'Overgrowth', icon: Trees },
    ],
  },
  {
    id: 'ANIMAL',
    label: 'Animal',
    icon: PawPrint,
    color: 'text-rose-500',
    bg: '!bg-rose-500/10',
    hover: 'hover:border-rose-400/70 hover:!bg-rose-500/5',
    issues: [
      { id: 'stray-dogs', label: 'Stray Dogs', icon: PawPrint },
      { id: 'dog-bite', label: 'Dog Bite', icon: PawPrint },
      { id: 'injured-animal', label: 'Injured Animal', icon: PawPrint },
      { id: 'animal-nuisance', label: 'Animal Nuisance', icon: PawPrint },
    ],
  },
  {
    id: 'TOWN',
    label: 'Town',
    icon: Building2,
    color: 'text-violet-500',
    bg: '!bg-violet-500/10',
    hover: 'hover:border-violet-400/70 hover:!bg-violet-500/5',
    issues: [
      { id: 'illegal-building', label: 'Illegal Building', icon: Building2 },
      { id: 'encroachment', label: 'Encroachment', icon: Building2 },
      { id: 'unsafe-building', label: 'Unsafe Building', icon: Building2 },
    ],
  },
  {
    id: 'DRAIN',
    label: 'Drain',
    icon: Waves,
    color: 'text-sky-500',
    bg: '!bg-sky-500/10',
    hover: 'hover:border-sky-400/70 hover:!bg-sky-500/5',
    issues: [
      { id: 'water-logging', label: 'Water Logging', icon: Waves },
      { id: 'drain-overflow', label: 'Drain Overflow', icon: Waves },
      { id: 'storm-block', label: 'Storm Block', icon: Waves },
    ],
  },
  {
    id: 'ENFORCE',
    label: 'Enforce',
    icon: CarFront,
    color: 'text-blue-500',
    bg: '!bg-blue-500/10',
    hover: 'hover:border-blue-400/70 hover:!bg-blue-500/5',
    issues: [
      { id: 'illegal-parking', label: 'Illegal Parking', icon: CarFront },
      { id: 'obstruction', label: 'Obstruction', icon: CarFront },
      { id: 'nuisance', label: 'Nuisance', icon: CarFront },
    ],
  },
];

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    department: '',
    category: '',
    description: '',
    location: '',
    coordinates: null,
    media: null,
  });

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (step === 3 && !formData.coordinates && !locationLoading) {
      detectLocation();
    }
  }, [step, formData.coordinates, locationLoading]);

  const formatCoordinateLabel = (latitude, longitude) =>
    `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

  const resolveAddressFromCoordinates = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed.');
    }

    const payload = await response.json();
    return payload?.display_name || formatCoordinateLabel(latitude, longitude);
  };

  const selectedDepartment = departmentOptions.find((department) => department.id === formData.department);
  const selectedIssue = selectedDepartment?.issues.find((issue) => issue.id === formData.category);

  const handleDepartmentSelect = (departmentId) => {
    setFormData((prev) => ({
      ...prev,
      department: departmentId,
      category: '',
    }));
    setErrorMessage('');
    setStep(2);
  };

  const handleIssueSelect = (issueId) => {
    setFormData((prev) => ({ ...prev, category: issueId }));
    setErrorMessage('');
    setStep(3);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported in this browser.');
      return;
    }

    setLocationLoading(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const resolvedAddress = await resolveAddressFromCoordinates(latitude, longitude);
          setFormData((prev) => ({
            ...prev,
            location: resolvedAddress,
            coordinates: {
              lat: latitude,
              lng: longitude,
            },
          }));
        } catch {
          setFormData((prev) => ({
            ...prev,
            location: formatCoordinateLabel(latitude, longitude),
            coordinates: {
              lat: latitude,
              lng: longitude,
            },
          }));
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        setErrorMessage('Unable to access your location. You can still enter the address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, media: file }));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await createCitizenReport({
        category: formData.category,
        description: formData.description,
        address: formData.location,
        latitude: formData.coordinates?.lat,
        longitude: formData.coordinates?.lng,
      });

      setTrackingId(response.issue.tracking_code);
      setSubmissionMessage(
        formData.media
          ? 'Report submitted successfully. The current API saved the report details, but does not yet store photo uploads.'
          : 'Your issue has been submitted successfully.',
      );
      setStep(5);
    } catch (error) {
      setErrorMessage(getReadableErrorMessage(error, 'Unable to submit your report.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName = user?.full_name || 'Citizen';

  return (
    <div className={`flex h-screen w-screen font-sans overflow-hidden transition-colors duration-500 relative ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-800'}`}>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] !bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 z-0 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] !bg-blue-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[12%] right-[10%] w-[46%] h-[46%] !bg-blue-300/12 rounded-full blur-[110px]"></div>
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
          <button onClick={() => navigate('/user/report-issue')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border text-left transition-all ${isDark ? '!bg-blue-500/10 text-blue-400 border-blue-500/20' : '!bg-blue-50 text-blue-700 border-blue-200 shadow-sm'}`}>
            <PlusCircle className="w-5 h-5" /> Report Issue
          </button>
          <button onClick={() => navigate('/user/my-reports')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${isDark ? '!bg-blue-500/10 text-slate-400 hover:!bg-slate-800/80 hover:text-white' : '!bg-blue-50 text-slate-600 hover:!bg-white hover:text-blue-700 hover:shadow-sm'}`}>
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
            <button onClick={() => navigate('/user/dashboard')} className={`lg:hidden p-2.5 rounded-xl border transition-all ${isDark ? '!bg-slate-800/50 text-slate-400 hover:text-white border-slate-700' : '!bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'}`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-black tracking-tight">Report New Issue</h1>
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
                {userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <div className="max-w-4xl mx-auto w-full pt-8 pb-1 transition-all duration-500">
              {step < 5 ? (
                <div className="flex items-center gap-3 mb-7">
                  {[1, 2, 3, 4].map((value) => (
                    <div key={value} className="flex items-center gap-4 flex-1 last:flex-none">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= value ? '!bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : (isDark ? '!bg-slate-800 text-slate-500' : '!bg-slate-100 text-slate-400')}`}>
                        {step > value ? <CheckCircle2 className="w-5 h-5" /> : value}
                      </div>
                      {value < 4 ? <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step > value ? '!bg-blue-600 shadow-sm shadow-blue-600/20' : (isDark ? '!bg-slate-800' : '!bg-slate-100')}`}></div> : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {errorMessage ? (
                <div className={`mb-6 rounded-[1.5rem] border px-5 py-4 text-sm ${isDark ? 'border-rose-500/20 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                  {errorMessage}
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Choose Department</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select the department responsible for this civic issue.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {departmentOptions.map((department) => {
                      const Icon = department.icon;
                      return (
                        <button key={department.id} onClick={() => handleDepartmentSelect(department.id)} className={`p-5 rounded-[1.4rem] border-2 transition-all flex flex-col items-center gap-2.5 group relative overflow-hidden ${formData.department === department.id ? '!bg-blue-600/10 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_10px_24px_rgba(59,130,246,0.12)]' : (isDark ? `!bg-slate-800/40 border-slate-700 ${department.hover}` : `!bg-white border-slate-200/60 ${department.hover} hover:shadow-lg shadow-sm`)} hover:-translate-y-1`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${department.color} ${department.bg} ${isDark ? '!bg-slate-900' : '!bg-slate-50'}`}>
                            <Icon className="w-6.5 h-6.5" />
                          </div>
                          <div className="text-center">
                            <span className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{department.label}</span>
                            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tap to continue</p>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-all ${formData.department === department.id ? 'opacity-100 translate-x-0 text-blue-500' : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Select Issue Category</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {selectedDepartment ? `Choose the issue type under ${selectedDepartment.label}.` : 'Choose the issue type.'}
                    </p>
                  </div>

                  {selectedDepartment ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedDepartment.issues.map((issue) => {
                        const Icon = issue.icon;
                        return (
                          <button
                            key={issue.id}
                            onClick={() => handleIssueSelect(issue.id)}
                            className={`p-5 rounded-[1.4rem] border-2 transition-all flex items-center gap-4 group relative overflow-hidden text-left ${formData.category === issue.id ? '!bg-blue-600/10 border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.2),0_10px_24px_rgba(59,130,246,0.12)]' : (isDark ? `!bg-slate-800/40 border-slate-700 ${selectedDepartment.hover}` : `!bg-white border-slate-200/60 ${selectedDepartment.hover} hover:shadow-lg shadow-sm`)} hover:-translate-y-1`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${selectedDepartment.color} ${selectedDepartment.bg} ${isDark ? '!bg-slate-900' : '!bg-slate-50'}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <span className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{issue.label}</span>
                              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Slug: {issue.id}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-all ${formData.category === issue.id ? 'opacity-100 translate-x-0 text-blue-500' : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`} />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="flex gap-3 pt-3">
                    <button onClick={() => setStep(1)} type="button" className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-slate-100 hover:!bg-slate-200 text-slate-700'}`}>Back</button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Details &amp; Location</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add description and confirm the GPS-tagged location for {selectedIssue?.label || 'this issue'}.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="Explain the situation in detail..."
                        className={`w-full border rounded-[1.2rem] p-4 min-h-[128px] focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Location Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                          placeholder="Tag your location..."
                          className={`w-full border rounded-[1.2rem] py-4 pl-12 pr-36 focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-medium shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`}
                        />
                        <button
                          onClick={detectLocation}
                          type="button"
                          disabled={locationLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 !bg-blue-600 hover:!bg-blue-500 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 text-white disabled:opacity-50 shadow-md"
                        >
                          {locationLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapIcon className="w-3.5 h-3.5" />}
                          {locationLoading ? 'Detecting' : 'Retag GPS'}
                        </button>
                      </div>
                      {formData.coordinates ? (
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          GPS location tagged automatically: {formData.coordinates.lat.toFixed(5)}, {formData.coordinates.lng.toFixed(5)}
                        </p>
                      ) : locationLoading ? (
                        <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Detecting your current GPS location...
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button onClick={() => setStep(2)} type="button" className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-slate-100 hover:!bg-slate-200 text-slate-700'}`}>Back</button>
                    <button onClick={() => setStep(4)} type="button" disabled={!formData.description || !formData.location} className={`flex-[2] py-4 disabled:opacity-50 text-white disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-blue-600 hover:!bg-blue-500 shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-600/30'}`}>
                      Continue to Upload
                    </button>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Upload Evidence</h2>
                    <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Review your selected department and issue category, then attach a photo if you have one.</p>
                  </div>

                  <div className={`rounded-[1.5rem] border px-5 py-4 text-sm ${isDark ? 'border-slate-700 bg-slate-900/40 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                    <div className="flex flex-wrap gap-3">
                      <span><span className="font-black uppercase tracking-widest text-[10px] text-slate-500">Department</span> <span className="font-semibold ml-2">{selectedDepartment?.label || '-'}</span></span>
                      <span><span className="font-black uppercase tracking-widest text-[10px] text-slate-500">Issue</span> <span className="font-semibold ml-2">{selectedIssue?.label || '-'}</span></span>
                    </div>
                  </div>

                  {!formData.media ? (
                    <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-[2rem] h-56 flex flex-col items-center justify-center text-center space-y-3 transition-all cursor-pointer group ${isDark ? 'border-slate-700 !bg-slate-950/30 hover:border-blue-500/50 hover:!bg-blue-500/5' : 'border-slate-300 !bg-slate-50/50 hover:border-blue-400 hover:!bg-blue-50'}`}>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${isDark ? '!bg-slate-900' : '!bg-white'}`}>
                        <Upload className="w-7 h-7 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Capture or Upload Photo</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-black">Optional</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`relative group rounded-[2rem] overflow-hidden border h-56 flex items-center justify-center shadow-inner ${isDark ? '!bg-slate-950/50 border-slate-800' : '!bg-slate-50/80 border-slate-200'}`}>
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 !bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="font-bold text-blue-500 text-base">{formData.media.name}</p>
                        <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{(formData.media.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={() => setFormData((prev) => ({ ...prev, media: null }))} type="button" className="absolute top-4 right-4 p-2.5 !bg-rose-500 hover:!bg-rose-600 text-white rounded-full shadow-lg transition-colors hover:scale-110">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className={`rounded-[1.5rem] border px-5 py-4 text-sm ${isDark ? 'border-blue-500/20 bg-blue-500/10 text-blue-100' : 'border-blue-100 bg-blue-50 text-blue-700'}`}>
                    The report submission is fully live. Photo upload UI is included here, but the current backend endpoint only stores report details and location data.
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button onClick={() => setStep(3)} type="button" className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-slate-100 hover:!bg-slate-200 text-slate-700'}`}>Back</button>
                    <button type="submit" disabled={isSubmitting} className={`flex-[2] py-4 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 hover:-translate-y-0.5 active:scale-95 ${isDark ? '!bg-emerald-600 hover:!bg-emerald-500 shadow-emerald-900/20' : '!bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-600/30'}`}>
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                      {isSubmitting ? 'Submitting...' : 'Submit Final Report'}
                    </button>
                  </div>
                </form>
              ) : null}

              {step === 5 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="relative">
                      <div className="absolute inset-0 !bg-blue-500/20 rounded-full blur-[40px]"></div>
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center relative shadow-2xl ${isDark ? '!bg-blue-600/20 shadow-blue-900/50' : '!bg-blue-50 shadow-blue-200'}`}>
                        <CheckCircle2 className="w-14 h-14 text-blue-600" />
                      </div>
                    </div>

                    <div className="text-center space-y-3 max-w-md">
                      <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Report Submitted!</h2>
                      <p className={`text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{submissionMessage}</p>
                    </div>

                    <div className={`w-full max-w-md p-6 rounded-2xl border-2 space-y-2 ${isDark ? '!bg-slate-800/50 border-slate-700' : '!bg-blue-50 border-blue-200'}`}>
                      <p className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your Tracking ID</p>
                      <p className="text-2xl font-black tracking-tight text-blue-600">{trackingId}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Use this ID to track your report status anytime.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => navigate('/trackissue', { state: { trackingCode: trackingId } })} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 text-white !bg-blue-600 hover:!bg-blue-700`}>
                      View Report
                    </button>
                    <button onClick={() => navigate('/user/my-reports')} className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-sm ${isDark ? '!bg-slate-800 hover:!bg-slate-700 text-white' : '!bg-slate-100 hover:!bg-slate-200 text-slate-700'}`}>
                      My Reports
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportIssuePage;
