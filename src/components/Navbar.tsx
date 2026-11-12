import React from 'react';
import { UserRole } from '../types';
import { useMediTrack } from '../context/MediTrackContext';
import { 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  HeartPulse, 
  RotateCcw,
  Sliders,
  LogOut,
  Sparkles,
  Bell
} from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onLogout }) => {
  const { currentUser, switchUser, resetAllData, isDemoMode, setIsDemoMode } = useMediTrack();

  if (!currentUser) return null;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-base tracking-tight text-white">
                Medi<span className="text-cyan-400">Track</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide uppercase hidden sm:inline">
                Clinical Quarantine Platform
              </span>
            </div>
          </div>

          {/* Right: Operational controls, notifications, persona badge, profile, logout */}
          <div className="flex items-center space-x-3">
            {/* Demo Mode Toggle */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                isDemoMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Demo Mode for fast role switching"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Demo Mode:</span>
              <span className="font-semibold">{isDemoMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Quick Role Switcher (Visible when Demo Mode is ON) */}
            {isDemoMode && (
              <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-amber-500/30">
                <button
                  onClick={() => switchUser('ADMIN')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    currentUser.role === 'ADMIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => switchUser('NURSE')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    currentUser.role === 'NURSE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Nurse
                </button>
                <button
                  onClick={() => switchUser('DOCTOR')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    currentUser.role === 'DOCTOR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Doctor
                </button>
              </div>
            )}

            {/* Parameter Settings */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Clinical Facility Parameters"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={() => {
                if (window.confirm('Reset all quarantine data to initial demonstration state?')) {
                  resetAllData();
                }
              }}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Notification Bell Indicator */}
            <div className="relative p-1.5 text-slate-400 hover:text-white transition cursor-pointer" title="Ward Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
            </div>

            <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block"></div>

            {/* User Profile Pill */}
            <div className="flex items-center space-x-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full border border-slate-700 object-cover"
              />
              <div className="hidden lg:block text-left text-xs leading-none">
                <div className="font-medium text-slate-200">{currentUser.name.split(',')[0]}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                    currentUser.role === 'ADMIN' ? 'bg-blue-400' : currentUser.role === 'NURSE' ? 'bg-emerald-400' : 'bg-indigo-400'
                  }`}></span>
                  <span className="font-semibold text-slate-300">{currentUser.role}</span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition border border-slate-800"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
