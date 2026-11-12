import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { getTodayDateString, getCurrentTimeString, isFever } from '../utils/rules';
import { 
  Thermometer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search, 
  Calendar,
  History,
  Info,
  ShieldAlert
} from 'lucide-react';
import { Patient } from '../types';

export const NurseDashboard: React.FC<{ onSelectPatient: (p: Patient) => void }> = ({ onSelectPatient }) => {
  const { patients, config, currentUser, recordTemperature } = useMediTrack();
  
  const todayStr = getTodayDateString();
  const admittedPatients = patients.filter((p) => p.status === 'ADMITTED');

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('36.6');
  const [recordDate, setRecordDate] = useState<string>(todayStr);
  const [recordTime, setRecordTime] = useState<string>(getCurrentTimeString());
  const [notes, setNotes] = useState<string>('');
  
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdmitted = admittedPatients.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatient = admittedPatients.find((p) => p.id === selectedPatientId);

  const handleSaveTemperature = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (!selectedPatientId) {
      setNotification({ type: 'error', message: 'Please select a patient from the quarantine list.' });
      return;
    }

    const tempVal = parseFloat(temperature);
    if (isNaN(tempVal)) {
      setNotification({ type: 'error', message: 'Please enter a valid temperature.' });
      return;
    }

    const res = recordTemperature({
      patientId: selectedPatientId,
      temperature: tempVal,
      date: recordDate,
      time: recordTime,
      notes,
    });

    if (res.success) {
      setNotification({ type: 'success', message: res.message });
      setNotes('');
      // reset selected if needed or keep for view
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nurse Clinical Vitals Station</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Triage
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Daily temperature surveillance for virus containment. Mandatory 1 canonical record per calendar day.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-slate-600">
            Fever Threshold: <strong className="text-slate-900">&ge; {config.feverThreshold}°C</strong> (Dr. Approval required to alter)
          </span>
        </div>
      </div>

      {/* Main Grid: Form + Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Temperature Entry Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">Record Daily Temperature</h2>
                <p className="text-xs text-slate-400">Validated clinical entry</p>
              </div>
            </div>

            {/* Notification alert */}
            {notification && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-medium flex items-start space-x-2.5 ${
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

            <form onSubmit={handleSaveTemperature} className="mt-4 space-y-4">
              {/* Patient Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Admitted Patient *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    setSelectedPatientId(e.target.value);
                    setNotification(null);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {admittedPatients.map((p) => {
                    const doneToday = p.temperatureRecords.some((r) => r.date === todayStr);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.roomNumber} - {p.name} ({p.id}) {doneToday ? '✓ Done Today' : '⚡ Pending Today'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Temperature in Celsius */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Temperature (°C) *
                  </label>
                  <span className="text-[11px] text-slate-400">Range: 32.0°C - 44.0°C</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="32"
                    max="44"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-3 py-2.5 text-base font-bold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="36.8"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 font-bold text-slate-400 text-sm">°C</span>
                </div>
                {/* Fever warning indicator */}
                {parseFloat(temperature) >= config.feverThreshold && (
                  <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Warning: Fever condition (&ge;{config.feverThreshold}°C). Resets consecutive fever-free count!</span>
                  </p>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={recordTime}
                    onChange={(e) => setRecordTime(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Observations (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Diaphoresis, chills, patient comfortable, vitals taken post-hydration..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              {/* Nurse Signature Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Signing Staff:</span> {currentUser?.name || 'Authorized Nurse'} ({currentUser?.id || 'NUR'})
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Save & Update Vitals
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Patients Vitals Roster */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Showing <strong>{filteredAdmitted.length}</strong> admitted patients
            </div>
          </div>

          {/* Roster Cards */}
          <div className="space-y-3">
            {filteredAdmitted.map((p) => {
              const todayRecord = p.temperatureRecords.find((r) => r.date === todayStr);
              const isDone = !!todayRecord;
              const hasFever = isDone && isFever(todayRecord.temperature, config.feverThreshold);

              return (
                <div
                  key={p.id}
                  className={`bg-white p-4 rounded-2xl border transition shadow-sm ${
                    isDone ? 'border-slate-200' : 'border-amber-300 ring-1 ring-amber-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="px-3 py-2 bg-slate-100 rounded-xl font-black text-slate-800 text-sm border border-slate-200">
                        {p.roomNumber}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                          <span className="text-xs text-slate-400 font-mono">({p.id})</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.age} yrs &bull; {p.gender} &bull; Admitted {p.admissionDate}
                        </p>
                      </div>
                    </div>

                    {/* Today's Temperature Status */}
                    <div className="flex items-center space-x-3">
                      {isDone ? (
                        <div className="text-right">
                          <div className="flex items-center space-x-1.5 justify-end">
                            <span className={`text-base font-extrabold ${hasFever ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {todayRecord.temperature}°C
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              hasFever ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {hasFever ? 'Fever' : 'Normal'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            Logged at {todayRecord.time} by {todayRecord.nurseName.split(' ')[0]}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Today</span>
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setRecordDate(todayStr);
                          setRecordTime(getCurrentTimeString());
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                      >
                        {isDone ? 'View / Recheck' : 'Record Temp'}
                      </button>

                      <button
                        onClick={() => onSelectPatient(p)}
                        className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="View Full History"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Temperature history miniature strip */}
                  {p.temperatureRecords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center space-x-2 text-xs overflow-x-auto">
                      <span className="text-[11px] font-semibold text-slate-400 shrink-0">Recent Readings:</span>
                      {p.temperatureRecords.slice(-5).map((r) => (
                        <span
                          key={r.id}
                          className={`px-2 py-0.5 rounded text-[11px] font-mono shrink-0 border ${
                            r.temperature >= config.feverThreshold
                              ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                          title={`${r.date} ${r.time} - ${r.notes || 'No notes'}`}
                        >
                          {r.date.slice(5)}: {r.temperature}°C
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

