import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { DEMO_USERS } from '../utils/mockData';
import { UserRole } from '../types';
import { 
  Activity, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck, 
  HeartPulse, 
  Stethoscope, 
  ArrowRight,
  Sparkles,
  UserPlus,
  LogIn,
  User as UserIcon,
  Briefcase
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (defaultTab: string) => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const { login, registerUser } = useMediTrack();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Login Form States
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('NURSE');
  const [regTitle, setRegTitle] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!emailOrUser.trim()) {
      setError('Please enter your email or username.');
      return;
    }

    if (!password) {
      setError('Please enter your clinical password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(emailOrUser, password);
      setIsLoading(false);

      if (res.success) {
        onLoginSuccess(res.defaultTab || 'ADMIN_DASHBOARD');
      } else {
        setError(res.message);
      }
    }, 200);
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setError('Please enter your full legal name.');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('Please enter a valid institutional email address.');
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        title: regTitle.trim() || undefined,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess(res.defaultTab || 'ADMIN_DASHBOARD');
        }, 600);
      } else {
        setError(res.message);
      }
    }, 250);
  };

  const handleQuickFill = (role: 'ADMIN' | 'NURSE' | 'DOCTOR') => {
    const user = DEMO_USERS.find((u) => u.role === role);
    if (user) {
      setEmailOrUser(user.email);
      setPassword(user.password || '');
      setError(null);
      setSuccessMsg(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6 relative">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="absolute left-0 top-1 text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 transition"
              title="Return to Public Landing Page"
            >
              <span>&larr;</span>
              <span>Landing Page</span>
            </button>
          )}

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/25 mb-3">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center space-x-2">
            <span>Medi</span>
            <span className="text-cyan-400">Track</span>
            <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 ml-2">
              v2.4
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Virus Quarantine & Treatment Management System
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Toggle between Sign In & Create Account */}
          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
                !isRegisterMode
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Staff Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 ${
                isRegisterMode
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Subheader */}
          <div className="mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">
              {isRegisterMode ? 'New Clinical Staff Registration' : 'Clinical Staff Sign In'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRegisterMode
                ? 'Register a personal staff account with role-based quarantine privileges.'
                : 'Enter your authorized credentials to access quarantine ward controls.'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs font-semibold flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs font-semibold flex items-start space-x-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* FORM: SIGN IN */}
          {!isRegisterMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Staff Email / Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={(e) => {
                      setEmailOrUser(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. admin@meditrack.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password *
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying...' : 'Authenticate & Enter'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* FORM: CREATE ACCOUNT */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Alex Mercer, MD"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Institutional Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex.mercer@hospital.org"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Assign Clinical Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                  >
                    <option value="NURSE">Nurse (Vitals Triage)</option>
                    <option value="DOCTOR">Doctor (Physician)</option>
                    <option value="ADMIN">Admin (Facility Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Professional Title (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regTitle}
                    onChange={(e) => setRegTitle(e.target.value)}
                    placeholder="e.g. Senior Infection Control Specialist"
                    className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Credentials Autofill */}
          {!isRegisterMode && (
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Demo Accounts (1-Click Fill)</span>
                </span>
                <span className="text-[10px] text-slate-500">Quick Test</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('ADMIN')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 text-left transition group"
                >
                  <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-xs mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">admin@meditrack.com</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Admin@123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('NURSE')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-left transition group"
                >
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs mb-0.5">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Nurse</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">nurse@meditrack.com</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Nurse@123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('DOCTOR')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-left transition group"
                >
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-bold text-xs mb-0.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Doctor</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">doctor@meditrack.com</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Doctor@123</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="text-center mt-5 text-xs text-slate-500 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Role-Based Access Control (RBAC) &bull; Session Protected</span>
        </div>
      </div>
    </div>
  );
};
