import React from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { History, Shield, Calendar, Clock, User } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useMediTrack();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit & Compliance Log</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
              Immutable Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-evident chronological log of admissions, vitals recording, doctor clearances, and administrative room releases.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Authorized User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Audit Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-800 font-sans font-medium whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="px-5 py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.userRole === 'ADMIN'
                          ? 'bg-blue-100 text-blue-800'
                          : log.userRole === 'DOCTOR'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.userRole}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-sans">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

