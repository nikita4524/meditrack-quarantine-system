import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { calculateFeverFreeDays } from '../utils/rules';
import { 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  BedDouble, 
  FileText,
  UserCheck,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { Patient } from '../types';

export const DischargeCenter: React.FC<{ onSelectPatient: (p: Patient) => void }> = ({ onSelectPatient }) => {
  const { 
    patients, 
    config, 
    currentUser, 
    confirmDoctorDischargeEligibility, 
    revokeDoctorDischargeEligibility, 
    finalizeDischarge 
  } = useMediTrack();

  const [dischargeNotes, setDischargeNotes] = useState<string>('');
  const [activeModalPatient, setActiveModalPatient] = useState<Patient | null>(null);
  const [modalType, setModalType] = useState<'DOCTOR_CONFIRM' | 'ADMIN_DISCHARGE' | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const admittedPatients = patients.filter((p) => p.status === 'ADMITTED');

  // Compute status for all admitted patients
  const evaluatedPatients = admittedPatients.map((patient) => {
    const feverStatus = calculateFeverFreeDays(patient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);
    const has3Days = feverStatus.isEligibleForDoctorConfirmation;
    const isDoctorApproved = patient.dischargeApproval.doctorApproved;
    const isAdminApproved = patient.dischargeApproval.adminApproved;

    let stage: 'PROGRESSING' | 'AWAITING_DOCTOR' | 'READY_FOR_ADMIN' = 'PROGRESSING';
    if (has3Days) {
      if (!isDoctorApproved) {
        stage = 'AWAITING_DOCTOR';
      } else {
        stage = 'READY_FOR_ADMIN';
      }
    }

    return {
      patient,
      feverStatus,
      has3Days,
      isDoctorApproved,
      isAdminApproved,
      stage,
    };
  });

  const readyForAdmin = evaluatedPatients.filter((ep) => ep.stage === 'READY_FOR_ADMIN');
  const awaitingDoctor = evaluatedPatients.filter((ep) => ep.stage === 'AWAITING_DOCTOR');
  const progressing = evaluatedPatients.filter((ep) => ep.stage === 'PROGRESSING');

  const handleActionClick = (patient: Patient, type: 'DOCTOR_CONFIRM' | 'ADMIN_DISCHARGE') => {
    setActiveModalPatient(patient);
    setModalType(type);
    setDischargeNotes('');
    setNotification(null);
  };

  const handleExecuteModal = () => {
    if (!activeModalPatient || !modalType) return;

    if (modalType === 'DOCTOR_CONFIRM') {
      const res = confirmDoctorDischargeEligibility(
        activeModalPatient.id,
        dischargeNotes || 'Patient has achieved 3 full fever-free days with afebrile trend and negative viral PCR. Medically cleared.'
      );
      if (res.success) {
        setNotification({ type: 'success', message: res.message });
        setActiveModalPatient(null);
      } else {
        setNotification({ type: 'error', message: res.message });
      }
    } else if (modalType === 'ADMIN_DISCHARGE') {
      const res = finalizeDischarge(
        activeModalPatient.id,
        dischargeNotes || 'Discharge certificate signed. Quarantine room cleared and sanitized.'
      );
      if (res.success) {
        setNotification({ type: 'success', message: res.message });
        setActiveModalPatient(null);
      } else {
        setNotification({ type: 'error', message: res.message });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discharge Protocol Center</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              3-Day Rule Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Enforces strict viral containment policy: 3 full consecutive afebrile days &rarr; Doctor medical signoff &rarr; Admin room release.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="text-slate-600">
            <strong>Rule Logic:</strong> A fever (&ge;{config.feverThreshold}°C) immediately resets the streak to 0. A missed daily check also resets consecutive continuity.
          </div>
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
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">{notification.message}</div>
        </div>
      )}

      {/* Stage 1: Ready for Administrative Discharge (Green Header) */}
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1. Ready for Final Admin Discharge ({readyForAdmin.length})
              </h2>
              <p className="text-xs text-emerald-800">
                Criteria Met: 3/3 Afebrile Days + Doctor Signed Clearance. Admin confirmation releases the bed.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-lg">
            Final Clearance Gate
          </span>
        </div>

        <div className="p-6">
          {readyForAdmin.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">
              No patients currently awaiting final administrative discharge.
            </p>
          ) : (
            <div className="space-y-4">
              {readyForAdmin.map(({ patient, feverStatus }) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{patient.roomNumber}</span>
                      <span className="font-bold text-slate-800 text-sm">&bull; {patient.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({patient.id})</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Doctor Clearance: <strong className="text-emerald-700">{patient.dischargeApproval.doctorName || 'Dr. Evelyn Reed'}</strong>
                      {patient.dischargeApproval.doctorNotes && ` &mdash; "${patient.dischargeApproval.doctorNotes}"`}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Chart
                    </button>

                    {currentUser?.role === 'ADMIN' ? (
                      <button
                        onClick={() => handleActionClick(patient, 'ADMIN_DISCHARGE')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                      >
                        Approve Final Discharge & Release Room
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        (Awaiting Admin Persona Action)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stage 2: Awaiting Doctor Clinical Confirmation (Indigo Header) */}
      <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. Awaiting Doctor Medical Review ({awaitingDoctor.length})
              </h2>
              <p className="text-xs text-indigo-800">
                Criteria Met: 3/3 Afebrile Days completed. Awaiting physician examination and medical clearance.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-lg">
            Physician Review Gate
          </span>
        </div>

        <div className="p-6">
          {awaitingDoctor.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">
              No patients currently waiting for physician clearance.
            </p>
          ) : (
            <div className="space-y-4">
              {awaitingDoctor.map(({ patient, feverStatus }) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm">{patient.roomNumber}</span>
                      <span className="font-bold text-slate-800 text-sm">&bull; {patient.name}</span>
                      <span className="text-xs text-slate-400 font-mono">({patient.id})</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Fever-Free Streak: <strong className="text-emerald-600">3 of 3 Full Days Complete</strong>
                      &bull; Admitted {patient.admissionDate}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    >
                      View Chart
                    </button>

                    {currentUser?.role === 'DOCTOR' ? (
                      <button
                        onClick={() => handleActionClick(patient, 'DOCTOR_CONFIRM')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
                      >
                        Grant Medical Discharge Clearance
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium italic">
                        (Awaiting Doctor Persona Review)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stage 3: Patients In-Progress (0/3, 1/3, 2/3) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3. In-Progress Quarantine Surveillance ({progressing.length})
            </h2>
            <p className="text-xs text-slate-400">
              Active observation. Discharge criteria not yet satisfied.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {progressing.map(({ patient, feverStatus }) => (
            <div key={patient.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg text-xs">
                  {patient.roomNumber}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-800">{patient.name}</div>
                  <div className="text-xs text-slate-400">{patient.id} &bull; Admitted {patient.admissionDate}</div>
                </div>
              </div>

              {/* Progress Display */}
              <div className="flex items-center space-x-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span>Consecutive Afebrile:</span>
                    <span className="text-blue-600 font-bold">{feverStatus.consecutiveDays} / 3 Days</span>
                  </div>
                  <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${(feverStatus.consecutiveDays / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPatient(patient)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {activeModalPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {modalType === 'DOCTOR_CONFIRM'
                  ? 'Confirm Medical Discharge Eligibility'
                  : 'Approve Final Facility Discharge'}
              </h3>
              <button
                onClick={() => setActiveModalPatient(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div><span className="text-slate-500">Patient:</span> <strong>{activeModalPatient.name} ({activeModalPatient.id})</strong></div>
                <div><span className="text-slate-500">Room:</span> <strong>{activeModalPatient.roomNumber}</strong></div>
                <div><span className="text-slate-500">Afebrile Status:</span> <strong className="text-emerald-600">3/3 Consecutive Days Completed</strong></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {modalType === 'DOCTOR_CONFIRM' ? 'Clinical Signoff Notes *' : 'Administrative Discharge Notes *'}
                </label>
                <textarea
                  rows={3}
                  value={dischargeNotes}
                  onChange={(e) => setDischargeNotes(e.target.value)}
                  placeholder={
                    modalType === 'DOCTOR_CONFIRM'
                      ? 'Confirm clinical stability, negative swabs, afebrile temperature trend...'
                      : 'Confirm isolation period complete, post-discharge instructions delivered, room release...'
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="text-[11px] text-slate-500">
                Authorized By: <strong>{currentUser?.name || 'Authorized Staff'}</strong> ({currentUser?.role || 'CLINICAL'})
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveModalPatient(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteModal}
                className={`px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md transition ${
                  modalType === 'DOCTOR_CONFIRM'
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {modalType === 'DOCTOR_CONFIRM' ? 'Sign & Confirm Eligibility' : 'Confirm Discharge & Free Bed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

