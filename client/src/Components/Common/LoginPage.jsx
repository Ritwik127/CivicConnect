import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useInRouterContext, BrowserRouter } from 'react-router-dom';
import { 
  UserCircle2, Building2, HardHat, Mail, Lock, 
  ArrowLeft, Eye, EyeOff, ChevronRight, Sun, Moon
} from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialRole = location.state?.role || 'citizen';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Theme Sync
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark'); 
  useEffect(() => { localStorage.setItem('civic_theme', isDark ? 'dark' : 'light'); }, [isDark]);

  useEffect(() => {
    if (location.state?.role) {
      setSelectedRole(location.state.role);
    }
  }, [location.state?.role]);

  const roles = [
    { id: 'citizen', title: 'Citizen', icon: UserCircle2, color: 'blue', desc: 'Report and track issues in your neighborhood' },
    { id: 'admin', title: 'Government', icon: Building2, color: 'purple', desc: 'Official portal for department and zone management' },
    { id: 'worker', title: 'Field Worker', icon: HardHat, color: 'orange', desc: 'Access tasks and submit proof-of-work' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Logging in as ${selectedRole}:`, formData);
  };

  return (
    <div className={`w-screen h-screen font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${isDark ? '!bg-[#0f172a] text-white' : '!bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Background Decorative Elements */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] !bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] !bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] !bg-blue-400/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] !bg-orange-400/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Top Navigation & Theme Toggle */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 transition-all group rounded-xl pr-3 shadow-sm ${isDark ? '!bg-black/50 text-slate-400 hover:text-white border border-slate-800' : '!bg-white/80 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-slate-200/50'}`}
        >
          <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 group-hover:!bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold px-1">Back to Home</span>
        </button>
      </div>
      
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-50">
        <button 
          onClick={() => setIsDark(!isDark)}
          className={`p-2.5 rounded-xl transition-all border shadow-sm ${isDark ? '!bg-slate-800/80 border-slate-700 text-slate-300 hover:!bg-slate-700' : '!bg-white/80 border-slate-200 text-slate-700 hover:!bg-slate-100 shadow-slate-200/50'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Login Container */}
      <div className="w-full max-w-xl relative z-10 mt-16 md:mt-0 max-h-[90vh] overflow-y-auto custom-scrollbar px-2">
        <div className="text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="!bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg shadow-blue-500/30">
              <span className="font-bold text-2xl text-white">C</span>
            </div>
            <span className={`font-bold text-2xl tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>CivicConnect</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
          <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Please select your role and sign in to your portal</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                  ? (isDark ? `!bg-slate-800 border-${role.color}-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] transform scale-105` : `!bg-white border-${role.color}-400 shadow-lg shadow-${role.color}-500/10 transform scale-105`)
                  : (isDark ? '!bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:!bg-slate-800/80' : '!bg-white/60 border-slate-200 hover:border-slate-300 hover:!bg-white')
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 transition-colors ${
                  isActive ? `!bg-${role.color}-500/20 text-${role.color}-500` : (isDark ? '!bg-slate-800 text-slate-500' : '!bg-slate-100 text-slate-500')
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-bold ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                  {role.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form Card */}
        <div className={`border p-8 rounded-[2.5rem] backdrop-blur-xl transition-all duration-500 ${isDark ? '!bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/50' : '!bg-white/90 border-slate-200/60 shadow-2xl shadow-blue-900/5'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`space-y-2 text-sm font-medium px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Currently logging in as: <span className="text-blue-500 font-bold capitalize">{selectedRole}</span>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className={`text-sm font-bold ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                <button type="button" className={`text-sm font-medium transition-colors hover:underline ${isDark ? '!bg-slate-800 text-slate-400 hover:text-white' : '!bg-slate-100 text-slate-600 hover:text-blue-600'}`}>Forgot Password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium ${isDark ? '!bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : '!bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:!bg-white'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? '!bg-slate-800 text-slate-500 hover:text-white' : '!bg-slate-200 text-slate-400 hover:text-slate-700'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 group mt-4 ${isDark ? '!bg-blue-600 hover:!bg-blue-500 text-white shadow-blue-900/20' : '!bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-600/20 hover:-translate-y-0.5'}`}
            >
              Sign In to Dashboard
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className={`mt-8 pt-8 border-t text-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className={`text-sm font-medium transition-colors hover:underline ${isDark ? '!bg-slate-800 text-blue-600 hover:text-white' : '!bg-slate-100 text-blue-600 hover:text-blue-600'}`}>Register now</button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-slate-500 text-xs font-medium">
          © 2026 CivicConnect. Secure Gateway • Encrypted Access
        </div>
      </div>
    </div>
  );
};

export default LoginPage;