import React from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { computeAnalytics } from '../utils/rules';
import { 
  BarChart3, 
  TrendingUp, 
  AlertOctagon, 
  CheckCircle2, 
  Users, 
  ArrowUpRight,
  ShieldAlert,
  Percent,
  BedDouble
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { patients, config } = useMediTrack();
  const analytics = computeAnalytics(patients, config);

  const outcomePieData = [
    { name: 'Discharged (Recovered)', value: analytics.totalDischarged, color: '#10b981' },
    { name: 'Deceased', value: analytics.totalDeaths, color: '#f43f5e' },
  ];

  const censusPieData = [
    { name: 'Occupied Quarantine Beds', value: analytics.currentAdmitted, color: '#2563eb' },
    { name: 'Available Ready Beds', value: analytics.availableRooms, color: '#e2e8f0' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quarantine Analytics & Mortality Intelligence</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Statutory Reporting
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Statistical performance benchmarks, mortality threshold vigilance (&le;15%), recovery rates, and bed efficiency.
          </p>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {analytics.isMortalityCritical && (
        <div className="bg-rose-50 border-2 border-rose-500 p-5 rounded-2xl flex items-start space-x-4 shadow-sm animate-pulse-subtle">
          <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-md">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-rose-900">
              URGENT WARNING: FACILITY MORTALITY RATE ({analytics.mortalityRate}%) EXCEEDS 15% THRESHOLD
            </h2>
            <p className="text-sm text-rose-800 mt-1">
              Mortality has exceeded the national viral quarantine safety benchmark (&le; {config.mortalityAlertBenchmark}%).
              Total Deceased: {analytics.totalDeaths} out of {analytics.totalCompletedOutcomes} completed patient outcomes.
              Immediate case fatality audits and intensive medical interventions have been triggered.
            </p>
          </div>
        </div>
      )}

      {/* Benchmark Comparisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mortality Benchmark Card */}
        <div className={`p-6 rounded-2xl border shadow-sm ${analytics.isMortalityCritical ? 'bg-rose-50/50 border-rose-300' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mortality Rate vs Benchmark</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              analytics.isMortalityCritical ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {analytics.isMortalityCritical ? 'BREACHED ALERT' : 'COMPLIANT SAFE'}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className={`text-4xl font-black ${analytics.isMortalityCritical ? 'text-rose-600' : 'text-slate-900'}`}>
                {analytics.mortalityRate}%
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Actual Mortality ({analytics.totalDeaths} deaths / {analytics.totalCompletedOutcomes} completed)
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-400">15.0%</span>
              <span className="text-xs text-slate-400 block mt-1">Benchmark Limit</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  analytics.isMortalityCritical ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, (analytics.mortalityRate / 30) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0% Target</span>
              <span>15% Benchmark Threshold</span>
              <span>30%+ High Risk</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
            <strong>Formula Specification:</strong> (Total Deaths / Total Completed Outcomes) &times; 100. Currently admitted quarantine patients are strictly excluded from the denominator.
          </p>
        </div>

        {/* Recovery Success Benchmark Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recovery Success Rate vs Benchmark</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              analytics.successRate >= config.recoverySuccessBenchmark ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {analytics.successRate >= config.recoverySuccessBenchmark ? 'OPTIMAL PROTOCOL' : 'MONITORING'}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-emerald-600">
                {analytics.successRate}%
              </span>
              <span className="text-xs text-slate-500 block mt-1">
                Discharged Recovered ({analytics.totalDischarged} / {analytics.totalCompletedOutcomes} completed)
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-400">85.0%</span>
              <span className="text-xs text-slate-400 block mt-1">Benchmark Goal</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, analytics.successRate)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0%</span>
              <span>85% Benchmark Target</span>
              <span>100%</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
            <strong>Formula Specification:</strong> (Recovered Outcomes / Total Completed Outcomes) &times; 100. Represents patients successfully meeting 3 full afebrile days protocol.
          </p>
        </div>
      </div>

      {/* Outcome Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Outcomes Proportion */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Completed Outcomes Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Total closed case resolutions ({analytics.totalCompletedOutcomes} total cases)</p>

          <div className="h-64 w-full flex items-center justify-center">
            {analytics.totalCompletedOutcomes === 0 ? (
              <span className="text-xs text-slate-400">No completed outcomes yet</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {outcomePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quarantine Bed Utilization */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-2">Isolation Bed Utilization (Capacity: 74)</h3>
          <p className="text-xs text-slate-500 mb-4">Occupancy status of individual negative-pressure quarantine rooms</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={censusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {censusPieData.map((entry, index) => (
                    <Cell key={`cell-census-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

