import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { ALL_ROOM_NUMBERS, calculateFeverFreeDays, getTodayDateString } from '../utils/rules';
import { 
  Search, 
  Filter, 
  BedDouble, 
  Plus, 
  UserCheck, 
  Eye, 
  FileText, 
  Thermometer, 
  Calendar,
  AlertCircle,
  Skull
} from 'lucide-react';
import { Patient } from '../types';

interface PatientManagementProps {
  onOpenRegisterModal: () => void;
  onSelectPatient: (patient: Patient) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  onOpenRegisterModal,
  onSelectPatient,
}) => {
  const { patients, config, currentUser, markPatientDeceased } = useMediTrack();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ADMITTED' | 'DISCHARGED' | 'DECEASED'>('ADMITTED');

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const occupiedRooms = new Set(patients.filter((p) => p.status === 'ADMITTED').map((p) => p.roomNumber));
  const isCapacityFull = occupiedRooms.size >= config.totalCapacity;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Patient Registry & Bed Control</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
              {occupiedRooms.size}/{config.totalCapacity} Occupied
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Complete census of isolated individuals, room reservations, demographic data, and medical profiles.
          </p>
        </div>

        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={onOpenRegisterModal}
            disabled={isCapacityFull}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition ${
              !isCapacityFull
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Register & Assign Room</span>
          </button>
        )}
      </div>

      {/* Capacity Warning Banner if Full */}
      {isCapacityFull && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-amber-800 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm font-medium">
            <strong>Facility Full (74/74 beds occupied):</strong> Automated safeguards prevent new admissions until a current patient is discharged by Administration or marked deceased.
          </p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID (e.g. PT-1001), or Room Number (R-101)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <div className="inline-flex rounded-xl p-1 bg-slate-200/80 text-xs font-semibold text-slate-600">
            {(['ADMITTED', 'DISCHARGED', 'DECEASED', 'ALL'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === status
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Records' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Room</th>
                <th className="px-5 py-3.5">Admission Date</th>
                <th className="px-5 py-3.5">Fever-Free Progress</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const feverStatus = calculateFeverFreeDays(patient, config.feverThreshold, config.consecutiveFeverFreeDaysRequired);
                  const isAdmitted = patient.status === 'ADMITTED';

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {patient.gender === 'Female' ? 'F' : patient.gender === 'Male' ? 'M' : 'O'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{patient.name}</div>
                            <div className="text-xs text-slate-400">
                              {patient.id} &bull; {patient.age} yrs &bull; {patient.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {isAdmitted ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <BedDouble className="w-3.5 h-3.5" />
                            <span>{patient.roomNumber}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Released ({patient.roomNumber})
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-slate-600">
                        {patient.admissionDate}
                      </td>

                      <td className="px-5 py-4">
                        {isAdmitted ? (
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-bold ${
                                feverStatus.consecutiveDays === 3 ? 'text-emerald-600' : 'text-slate-700'
                              }`}>
                                {feverStatus.consecutiveDays} / {config.consecutiveFeverFreeDaysRequired} Days
                              </span>
                              {feverStatus.isEligibleForDoctorConfirmation && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                  Eligible
                                </span>
                              )}
                            </div>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  feverStatus.consecutiveDays === 3 ? 'bg-emerald-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${(feverStatus.consecutiveDays / 3) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">&mdash;</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          patient.status === 'ADMITTED'
                            ? 'bg-blue-100 text-blue-800'
                            : patient.status === 'DISCHARGED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {patient.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => onSelectPatient(patient)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          View Profile
                        </button>

                        {currentUser?.role === 'ADMIN' && isAdmitted && (
                          <button
                            onClick={() => {
                              const reason = window.prompt(`Record deceased outcome for ${patient.name}? Enter clinical justification:`);
                              if (reason) {
                                markPatientDeceased(patient.id, reason);
                              }
                            }}
                            className="p-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 transition"
                            title="Record Deceased Outcome"
                          >
                            <Skull className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

