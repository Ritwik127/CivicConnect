import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  UserCircle2,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, getErrorMessage, getHomePath } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isDark, setIsDark] = useState(() => localStorage.getItem('civic_theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('civic_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const user = await register({
        ...formData,
        role: 'citizen',
      });
      navigate(getHomePath(user.role), { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Unable to create your account right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-screen h-screen font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 transition-colors group ${isDark ? '!bg-black text-slate-400 hover:text-white' : '!bg-white border text-slate-600 hover:text-slate-900 shadow-sm'}`}
        >
          <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 group-hover:!bg-slate-700' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium px-2">Back to Home</span>
        </button>
      </div>
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-50">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2.5 rounded-lg transition-colors border ${isDark ? '!bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : '!bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'}`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-xl relative z-10 mt-20 md:mt-0 max-h-[90vh] overflow-y-auto custom-scrollbar px-2">
        <div className="text-center mb-10 space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <span className="font-bold text-2xl text-white">C</span>
            </div>
            <span className={`font-bold text-2xl tracking-tight ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>CivicConnect</span>
          </div>
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Create a citizen account to report and track issues in your city</p>
        </div>

        <div className={`border p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`space-y-2 text-sm font-medium px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Currently registering as: <span className="text-blue-500 font-bold capitalize">citizen</span>
            </div>

            {errorMessage ? (
              <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {errorMessage}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? 'bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
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
                  className={`w-full border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium ${isDark ? 'bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl py-4 pl-12 pr-12 outline-none transition-all font-medium ${isDark ? 'bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
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

            <button type="submit" disabled={isSubmitting} className="w-full !bg-blue-600 hover:!bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group mt-4 disabled:opacity-70">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className={`mt-8 pt-8 border-t text-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Already have an account?{' '}
              <button onClick={() => navigate('/login', { state: { role: 'citizen' } })} className={`text-sm font-medium transition-colors hover:underline ${isDark ? '!bg-slate-800 text-blue-600 hover:text-white' : '!bg-slate-100 text-blue-600 hover:text-blue-600'}`}>Sign In</button>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center text-slate-500 text-xs">
          © 2026 CivicConnect. Secure Gateway • Encrypted Access
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
