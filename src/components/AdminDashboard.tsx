import React from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { computeAnalytics } from '../utils/rules';
import { 
  Users, 
  BedDouble, 
  Clock, 
  AlertOctagon,
  LogOut,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
  onOpenRegisterModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab, onOpenRegisterModal }) => {
  const { patients, config, currentUser } = useMediTrack();
  const analytics = computeAnalytics(patients, config);

  return (
    <div className="space-y-5 max-w-[1536px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quarantine Command Center</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Ward Status
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time viral containment census, bed allocation, protocol compliance, and discharge orchestration.
          </p>
        </div>

        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={onOpenRegisterModal}
            disabled={analytics.availableRooms === 0}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-semibold text-xs shadow-sm transition shrink-0 ${
              analytics.availableRooms > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <BedDouble className="w-4 h-4 text-cyan-400" />
            <span>Admit New Patient</span>
          </button>
        )}
      </div>

      {/* Prominent Warning if Mortality Exceeds 15% Benchmark */}
      {analytics.isMortalityCritical && (
        <div className="bg-rose-50/90 border border-rose-300 p-4 rounded-xl flex items-start space-x-3 shadow-sm">
          <div className="p-1.5 bg-rose-600 text-white rounded-lg shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-rose-900">
                CRITICAL MORTALITY BENCHMARK ALERT: {analytics.mortalityRate}%
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-200/80 text-rose-900">
                Limit: &le; {config.mortalityAlertBenchmark}%
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              Quarantine facility mortality rate has breached the 15% safety threshold among completed outcomes. Immediate clinical review of viral triage, anti-viral intervention timing, and physician escalation protocol is required.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Admitted & Capacity */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Facility Occupancy</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className="text-2xl font-bold text-slate-900">{analytics.currentAdmitted}</span>
              <span className="text-xs text-slate-500">/ {analytics.totalCapacity} Beds</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>{analytics.availableRooms} rooms free</span>
              <span className="font-bold text-slate-800">{analytics.occupancyRate}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  analytics.occupancyRate > 90 ? 'bg-rose-500' : analytics.occupancyRate > 70 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, analytics.occupancyRate)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Temperature Checks */}
        <div 
          onClick={() => onNavigateTab('NURSE_TEMPERATURES')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm hover:border-amber-400/80 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Pending Temp Checks</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className={`text-2xl font-bold ${analytics.pendingTempChecksToday > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                {analytics.pendingTempChecksToday}
              </span>
              <span className="text-xs text-slate-500">of {analytics.currentAdmitted} today</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Daily morning vitals</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Pending Doctor Visits */}
        <div 
          onClick={() => onNavigateTab('DOCTOR_EXAMINATIONS')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm hover:border-indigo-400/80 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Pending Doctor Visits</span>
              <Stethoscope className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-1.5">
              <span className={`text-2xl font-bold ${analytics.pendingDoctorVisitsToday > 0 ? 'text-indigo-600' : 'text-slate-900'}`}>
                {analytics.pendingDoctorVisitsToday}
              </span>
              <span className="text-xs text-slate-500">awaiting round</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Daily clinical review</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* Discharge Queue */}
        <div 
          onClick={() => onNavigateTab('DISCHARGE_CENTER')}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm hover:border-emerald-400/80 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Discharge Pipeline</span>
              <LogOut className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-3">
              <div>
                <span className="text-2xl font-bold text-emerald-600">{analytics.adminDischargePendingCount}</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Admin Action</span>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <span className="text-lg font-bold text-indigo-600">{analytics.doctorDischargeEligibleCount}</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Doctor Review</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>3 full days afebrile</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Benchmark Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Mortality KPI Box */}
        <div className={`p-4 rounded-xl border ${analytics.isMortalityCritical ? 'bg-rose-50/60 border-rose-300' : 'bg-white border-slate-200/90'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Mortality Benchmark</span>
            <span className="text-xs font-bold text-slate-600">Standard: &le; 15%</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-black ${analytics.isMortalityCritical ? 'text-rose-600' : 'text-slate-900'}`}>
              {analytics.mortalityRate}%
            </span>
            <span className="text-xs text-slate-500">({analytics.totalDeaths} of {analytics.totalCompletedOutcomes} completed)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Formula: (Deaths / Completed Outcomes) &times; 100. Active admitted cases excluded.
          </p>
        </div>

        {/* Recovery Success KPI Box */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Recovery Success Rate</span>
            <span className="text-xs font-bold text-emerald-600">Standard: &ge; 85%</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-600">
              {analytics.successRate}%
            </span>
            <span className="text-xs text-slate-500">({analytics.totalDischarged} of {analytics.totalCompletedOutcomes} completed)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Patient recoveries discharged after completing 3 consecutive afebrile days protocol.
          </p>
        </div>

        {/* Total Completed Outcomes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-500">Completed Case Resolution</span>
            <div className="mt-2 flex items-center space-x-3">
              <div>
                <span className="text-xl font-bold text-slate-900">{analytics.totalDischarged}</span>
                <span className="text-[10px] text-slate-500 block">Recovered</span>
              </div>
              <div className="text-slate-300 text-lg font-light">/</div>
              <div>
                <span className="text-xl font-bold text-rose-600">{analytics.totalDeaths}</span>
                <span className="text-[10px] text-slate-500 block">Deceased</span>
              </div>
              <div className="text-slate-300 text-lg font-light">=</div>
              <div>
                <span className="text-xl font-bold text-blue-600">{analytics.totalCompletedOutcomes}</span>
                <span className="text-[10px] text-slate-500 block">Total Closed</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Isolation beds released immediately upon case resolution and available for allocation.
          </p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Epidemic Curve */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Epidemic Admissions & Discharge Curve</h3>
              <p className="text-xs text-slate-400">Intake versus clinical discharges across quarantine timeline</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.admissionsByDate}>
                <defs>
                  <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorAdm)" />
                <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorDis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Isolation Capacity Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Isolation Capacity & Bed Allocation</h3>
                <p className="text-xs text-slate-400">Total 74 individual negative-pressure quarantine rooms</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                {analytics.availableRooms} Available
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1 text-slate-700">
                  <span>Occupied Beds ({analytics.currentAdmitted})</span>
                  <span className="font-bold">{analytics.occupancyRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${analytics.occupancyRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1 text-slate-700">
                  <span>Available Beds ({analytics.availableRooms})</span>
                  <span className="font-bold">{(100 - analytics.occupancyRate).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${100 - analytics.occupancyRate}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600 space-y-1.5 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Isolation Protocol:</span>
              <span className="text-slate-800 font-semibold">Strict 1 Patient per Room</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Max Facility Limit:</span>
              <span className="text-slate-800 font-bold">74 Rooms Fixed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Admission Guard:</span>
              <span className={`font-semibold ${analytics.availableRooms === 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
                {analytics.availableRooms === 0 ? 'LOCKED (Zero Vacancy)' : 'ACTIVE (Conflict checked)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
