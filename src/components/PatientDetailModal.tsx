import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { calculateFeverFreeDays } from '../utils/rules';
import { 
  X, 
  BedDouble, 
  Thermometer, 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  ShieldCheck,
  History,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Patient } from '../types';

interface PatientDetailModalProps {
  patient: Patient | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose }) => {
  const { config, updatePatientNotes } = useMediTrack();
  const [activeTab, setActiveTab] = useState<'VITALS' | 'VISITS' | 'AUDIT'>('VITALS');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  if (!patient) return null;

  const feverStatus = calculateFeverFreeDays(patient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);

  const handleSaveNotes = () => {
    updatePatientNotes(patient.id, notesDraft);
    setIsEditingNotes(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-black text-xl text-cyan-400">
              {patient.roomNumber}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white">{patient.name}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {patient.id}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  patient.status === 'ADMITTED' ? 'bg-blue-600 text-white' : patient.status === 'DISCHARGED' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}>
                  {patient.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {patient.gender} &bull; {patient.age} years old &bull; Admitted on {patient.admissionDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Day Rule Quick Progress Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-700">3-Day Afebrile Discharge Status:</span>
            <span className="text-xs font-extrabold text-blue-700">
              {feverStatus.consecutiveDays} / {config.consecutiveFeverFreeDaysRequired} Days Met
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Doctor Clearance:</span>
            {patient.dischargeApproval.doctorApproved ? (
              <span className="text-xs font-bold text-emerald-600">✓ Signed</span>
            ) : (
              <span className="text-xs font-medium text-slate-400">Pending</span>
            )}
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Admin Release:</span>
            {patient.dischargeApproval.adminApproved ? (
              <span className="text-xs font-bold text-emerald-600">✓ Completed</span>
            ) : (
              <span className="text-xs font-medium text-slate-400">Pending</span>
            )}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('VITALS')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'VITALS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>Temperature History ({patient.temperatureRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('VISITS')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'VISITS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Examinations ({patient.doctorVisits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition ${
              activeTab === 'AUDIT'
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail & Records ({patient.auditLogs.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: VITALS & CHART */}
          {activeTab === 'VITALS' && (
            <div className="space-y-6">
              {/* Temperature Trend Chart */}
              {patient.temperatureRecords.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-700">Temperature Progression Curve</span>
                    <span className="text-xs text-rose-500 font-semibold">Fever Line: &ge; {config.feverThreshold}°C</span>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={patient.temperatureRecords}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis domain={[35, 41]} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <ReferenceLine y={config.feverThreshold} stroke="#ef4444" strokeDasharray="3 3" />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Records Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Daily Canonical Temperature Entries
                </h4>
                {patient.temperatureRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No temperatures recorded yet.</p>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Date & Time</th>
                          <th className="px-4 py-2.5">Temperature</th>
                          <th className="px-4 py-2.5">Fever Evaluation</th>
                          <th className="px-4 py-2.5">Recording Nurse</th>
                          <th className="px-4 py-2.5">Observations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patient.temperatureRecords.map((r) => {
                          const hasFever = r.temperature >= config.feverThreshold;
                          return (
                            <tr key={r.id}>
                              <td className="px-4 py-2.5 font-medium">{r.date} &bull; {r.time}</td>
                              <td className="px-4 py-2.5 font-bold text-slate-900">{r.temperature}°C</td>
                              <td className="px-4 py-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  hasFever ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {hasFever ? 'FEVER (Reset)' : 'Afebrile'}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-slate-600">{r.nurseName}</td>
                              <td className="px-4 py-2.5 text-slate-500">{r.notes || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DOCTOR VISITS */}
          {activeTab === 'VISITS' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Physician Examinations & Daily Rounds
              </h4>
              {patient.doctorVisits.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No doctor examinations recorded yet.</p>
              ) : (
                patient.doctorVisits.map((v) => (
                  <div key={v.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{v.doctorName}</span>
                        <span className="text-[11px] text-slate-400">&bull; {v.date} at {v.time}</span>
                      </div>
                      {v.isEmergencyOverride && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Emergency Override
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-800">
                      <strong>Diagnosis:</strong> {v.diagnosis}
                    </div>
                    <div className="text-xs text-slate-600">
                      <strong>Treatment Plan:</strong> {v.treatmentNotes}
                    </div>
                    {v.overrideReason && (
                      <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        <strong>Override Rationale:</strong> {v.overrideReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Patient Regulatory Audit Trail
              </h4>
              {patient.auditLogs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No specific audit logs recorded for this patient.</p>
              ) : (
                <div className="space-y-2">
                  {patient.auditLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-white text-xs flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-800">{log.action}</div>
                        <div className="text-slate-600 mt-0.5">{log.details}</div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 shrink-0 ml-4">
                        <div>{log.userName}</div>
                        <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition"
          >
            Close Chart
          </button>
        </div>
      </div>
    </div>
  );
};

