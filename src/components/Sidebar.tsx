import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Thermometer, 
  Stethoscope, 
  LogOut, 
  BarChart3, 
  History,
  BedDouble,
  ChevronRight
} from 'lucide-react';
import { useMediTrack } from '../context/MediTrackContext';

export type TabType = 
  | 'ADMIN_DASHBOARD'
  | 'PATIENT_MANAGEMENT'
  | 'NURSE_TEMPERATURES'
  | 'DOCTOR_EXAMINATIONS'
  | 'DISCHARGE_CENTER'
  | 'ANALYTICS'
  | 'AUDIT_LOGS';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingTempCount: number;
  pendingExamCount: number;
  dischargeReadyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingTempCount,
  pendingExamCount,
  dischargeReadyCount,
}) => {
  const { currentUser } = useMediTrack();
  const role = currentUser?.role || 'ADMIN';

  const navItems = [
    {
      id: 'ADMIN_DASHBOARD' as TabType,
      label: 'Command Center',
      sublabel: 'Ward census & KPIs',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'NURSE', 'DOCTOR'],
      badge: null,
    },
    {
      id: 'PATIENT_MANAGEMENT' as TabType,
      label: 'Patient Registry',
      sublabel: 'Bed assignment & intake',
      icon: BedDouble,
      roles: ['ADMIN'],
      badge: null,
    },
    {
      id: 'NURSE_TEMPERATURES' as TabType,
      label: 'Vitals & Temperatures',
      sublabel: 'Daily morning checks',
      icon: Thermometer,
      roles: ['ADMIN', 'NURSE'],
      badge: pendingTempCount > 0 ? { count: pendingTempCount, color: 'bg-amber-500' } : null,
    },
    {
      id: 'DOCTOR_EXAMINATIONS' as TabType,
      label: 'Doctor Examinations',
      sublabel: 'Rounds & evaluations',
      icon: Stethoscope,
      roles: ['ADMIN', 'DOCTOR'],
      badge: pendingExamCount > 0 ? { count: pendingExamCount, color: 'bg-indigo-500' } : null,
    },
    {
      id: 'DISCHARGE_CENTER' as TabType,
      label: 'Discharge Center',
      sublabel: '3-Day Afebrile gate',
      icon: LogOut,
      roles: ['ADMIN', 'DOCTOR', 'NURSE'],
      badge: dischargeReadyCount > 0 ? { count: dischargeReadyCount, color: 'bg-emerald-500' } : null,
    },
    {
      id: 'ANALYTICS' as TabType,
      label: 'Mortality & Analytics',
      sublabel: '15% Benchmark tracking',
      icon: BarChart3,
      roles: ['ADMIN', 'DOCTOR'],
      badge: null,
    },
    {
      id: 'AUDIT_LOGS' as TabType,
      label: 'Audit Trail',
      sublabel: 'Regulatory compliance',
      icon: History,
      roles: ['ADMIN'],
      badge: null,
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-3.5rem)] text-slate-700">
      <div className="p-3 space-y-4">
        {/* Active Workspace Pill */}
        <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Active Workspace</div>
          <div className="text-xs font-bold text-slate-900 flex items-center justify-between mt-0.5">
            <span>{role === 'ADMIN' ? 'Facility Administration' : role === 'NURSE' ? 'Nursing Care Unit' : 'Medical Staff Unit'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-0.5">
          <div className="px-2 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400">
            Quarantine Modules
          </div>
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full shrink-0 ${item.badge.color}`}
                    >
                      {item.badge.count}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Footer System Specs */}
      <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400 bg-slate-50/60 space-y-1">
        <div className="flex justify-between items-center">
          <span>Bed Capacity</span>
          <span className="font-semibold text-slate-700">74 Rooms</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Discharge Standard</span>
          <span className="font-semibold text-emerald-600">3 Days &lt;37.5°C</span>
        </div>
      </div>
    </aside>
  );
};
