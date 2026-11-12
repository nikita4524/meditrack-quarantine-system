import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { calculateFeverFreeDays, getTodayDateString, getCurrentTimeString } from '../utils/rules';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  LineChart as ChartIcon, 
  FileText, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { Patient } from '../types';

export const DoctorDashboard: React.FC<{ onSelectPatient: (p: Patient) => void }> = ({ onSelectPatient }) => {
  const { 
    patients, 
    config, 
    currentUser, 
    recordDoctorVisit, 
    confirmDoctorDischargeEligibility,
    revokeDoctorDischargeEligibility 
  } = useMediTrack();

  const todayStr = getTodayDateString();
  const admittedPatients = patients.filter((p) => p.status === 'ADMITTED');

  const [selectedPatientId, setSelectedPatientId] = useState<string>(admittedPatients[0]?.id || '');
  
  // Visit Form State
  const [examDate, setExamDate] = useState<string>(todayStr);
  const [examTime, setExamTime] = useState<string>(getCurrentTimeString());
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [treatmentNotes, setTreatmentNotes] = useState<string>('');
  const [isEmergencyOverride, setIsEmergencyOverride] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');

  const [dischargeNotes, setDischargeNotes] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedPatient = admittedPatients.find((p) => p.id === selectedPatientId);

  // Check if today's temperature is recorded
  const hasTempToday = selectedPatient ? selectedPatient.temperatureRecords.some((r) => r.date === examDate) : false;
  const feverStatus = selectedPatient 
    ? calculateFeverFreeDays(selectedPatient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired)
    : null;

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!selectedPatientId) {
      setNotification({ type: 'error', message: 'Please select a patient.' });
      return;
    }

    if (!hasTempToday && !isEmergencyOverride) {
      setNotification({
        type: 'error',
        message: 'Clinical Warning: Temperature check has not yet been recorded for today by nursing. Enable Emergency Override with justification to proceed.',
      });
      return;
    }

    const res = recordDoctorVisit({
      patientId: selectedPatientId,
      date: examDate,
      time: examTime,
      diagnosis,
      treatmentNotes,
      isEmergencyOverride,
      overrideReason: isEmergencyOverride ? overrideReason : undefined,
    });

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setDiagnosis('');
      setTreatmentNotes('');
      setIsEmergencyOverride(false);
      setOverrideReason('');
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleDoctorDischargeConfirm = () => {
    if (!selectedPatient) return;
    setNotification(null);

    const res = confirmDoctorDischargeEligibility(
      selectedPatient.id,
      dischargeNotes || 'Patient has successfully completed 3 full consecutive fever-free days. Pulmonary vitals stabilized and negative viral tests. Medically cleared for administrative discharge.'
    );

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setDischargeNotes('');
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Physician Examination & Clearance Suite</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Dr. Evelyn Reed, MD
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Clinical daily evaluation, temperature trend analysis, and statutory 3-day afebrile discharge certification.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Fever Standard: &lt; {config.feverThreshold}°C</span>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-start space-x-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{notification.message}</div>
        </div>
      )}

      {/* Main Layout: Patient List / Chart & Exam Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Examination Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Admitted Quarantine Cohort ({admittedPatients.length})
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {admittedPatients.map((patient) => {
              const isSelected = patient.id === selectedPatientId;
              const hasVisitToday = patient.doctorVisits.some((v) => v.date === todayStr);
              const pFever = calculateFeverFreeDays(patient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);

              return (
                <div
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatientId(patient.id);
                    setNotification(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{patient.roomNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      hasVisitToday ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {hasVisitToday ? 'Visited Today' : 'Awaiting Exam'}
                    </span>
                  </div>

                  <div className="font-bold text-slate-800 text-sm mt-1">{patient.name}</div>
                  <div className="text-xs text-slate-400">
                    {patient.id} &bull; {patient.age} yrs &bull; {patient.gender}
                  </div>

                  {/* Fever status indicator */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Afebrile Count:</span>
                    <span className={`font-bold ${
                      pFever.consecutiveDays === 3 ? 'text-emerald-600' : 'text-slate-700'
                    }`}>
                      {pFever.consecutiveDays} / 3 Days
                    </span>
                  </div>

                  {pFever.isEligibleForDoctorConfirmation && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <span>✓ 3/3 Afebrile - Review Clearance</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Clinical Focus Area (8 cols) */}
        {selectedPatient ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Patient Header Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-extrabold text-sm">
                      {selectedPatient.roomNumber}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h2>
                    <span className="text-xs font-mono text-slate-400">({selectedPatient.id})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Admitted: {selectedPatient.admissionDate} &bull; Age: {selectedPatient.age} &bull; Diagnosis: {selectedPatient.diagnosisSummary}
                  </p>
                </div>

                <button
                  onClick={() => onSelectPatient(selectedPatient)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  Complete Medical Chart
                </button>
              </div>

              {/* 3-Day Rule Status Box */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Discharge Criterion Assessment:
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {feverStatus?.consecutiveDays} of {config.consecutiveFeverFreeDaysRequired} Full Consecutive Fever-Free Days
                    </div>
                  </div>

                  {feverStatus?.isEligibleForDoctorConfirmation ? (
                    selectedPatient.dischargeApproval.doctorApproved ? (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Doctor Clearance Approved
                      </span>
                    ) : (
                      <button
                        onClick={handleDoctorDischargeConfirm}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                      >
                        Confirm Medical Clearance (3/3 Met)
                      </button>
                    )
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-200 text-slate-600">
                      Ineligible ({feverStatus?.consecutiveDays}/3 Days)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Temperature Trend Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ChartIcon className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Temperature History & Trend</h3>
                </div>
                <span className="text-xs text-slate-400">
                  Threshold Reference: <strong className="text-rose-500">{config.feverThreshold}°C</strong>
                </span>
              </div>

              {selectedPatient.temperatureRecords.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No temperature records logged yet for this patient.
                </div>
              ) : (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedPatient.temperatureRecords}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={[35, 41]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <ReferenceLine y={config.feverThreshold} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: `Fever Line (${config.feverThreshold}°C)`, fill: '#f43f5e', fontSize: 10, position: 'top' }} />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        name="Body Temp (°C)"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#4f46e5' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Doctor Examination Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Record Clinical Visit & Progress Notes</h3>
                  <p className="text-xs text-slate-400">Physician consultation and prescription order</p>
                </div>
              </div>

              {/* Warning if no temp recorded today */}
              {!hasTempToday && (
                <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong>Routine Check Warning:</strong> No daily morning temperature has been recorded for today by nursing. Routine rounds should follow vitals triage.
                    To examine the patient immediately, you must check the Emergency Override box below with medical rationale.
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveVisit} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Exam Date *
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Exam Time *
                    </label>
                    <input
                      type="time"
                      value={examTime}
                      onChange={(e) => setExamTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Diagnosis & Physical Findings *
                  </label>
                  <textarea
                    rows={2}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Auscultation, respiratory rate, lung sounds, viral symptomatology..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Treatment Plan & Medication Directives *
                  </label>
                  <textarea
                    rows={2}
                    value={treatmentNotes}
                    onChange={(e) => setTreatmentNotes(e.target.value)}
                    placeholder="Antiviral dosing, hydration therapy, oxygenation, discharge outlook..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  ></textarea>
                </div>

                {/* Emergency Override Option */}
                {!hasTempToday && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-amber-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isEmergencyOverride}
                        onChange={(e) => setIsEmergencyOverride(e.target.checked)}
                        className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Enable Emergency Clinical Override (Bypass Pending Temp Requirement)</span>
                    </label>

                    {isEmergencyOverride && (
                      <div>
                        <label className="block text-[11px] font-bold text-amber-900 mb-1">
                          Mandatory Clinical Justification (min 5 chars) *
                        </label>
                        <input
                          type="text"
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          placeholder="e.g. Acute dyspnea escalation, urgent physician assessment required"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Complete & Save Doctor Examination
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
            Select a patient from the queue to review history and conduct examination.
          </div>
        )}
      </div>
    </div>
  );
};

