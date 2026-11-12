import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { ALL_ROOM_NUMBERS, getTodayDateString } from '../utils/rules';
import { X, BedDouble, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({ isOpen, onClose }) => {
  const { patients, config, registerPatient } = useMediTrack();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [admissionDate, setAdmissionDate] = useState(getTodayDateString());
  const [roomNumber, setRoomNumber] = useState('');
  const [diagnosisSummary, setDiagnosisSummary] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Find currently occupied rooms
  const occupiedRooms = new Set(
    patients.filter((p) => p.status === 'ADMITTED').map((p) => p.roomNumber.toUpperCase())
  );

  // Available room options
  const availableRooms = ALL_ROOM_NUMBERS.filter((r) => !occupiedRooms.has(r));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      setError('Please enter a valid patient age (0 - 120).');
      return;
    }

    if (!roomNumber) {
      setError('Please assign an isolation room.');
      return;
    }

    const res = registerPatient({
      name,
      age: parsedAge,
      gender,
      admissionDate,
      roomNumber,
      diagnosisSummary,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quarantine Patient Admission</h3>
              <p className="text-xs text-slate-400">Assign individual isolation bed (Capacity: 74)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jonathan Mercer"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age *
              </label>
              <input
                type="number"
                min="0"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="42"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admission Date *
              </label>
              <input
                type="date"
                required
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assign Isolation Room *
              </label>
              <select
                required
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold"
              >
                <option value="">-- Select Vacant Room --</option>
                {availableRooms.map((r) => (
                  <option key={r} value={r}>
                    {r} (Available)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Admission Diagnosis & Viral Variant Profile
            </label>
            <textarea
              rows={2}
              value={diagnosisSummary}
              onChange={(e) => setDiagnosisSummary(e.target.value)}
              placeholder="e.g. Acute viral fever, dry cough, symptomatic exposure day 3..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
            <div>&bull; Unique Patient ID (e.g. <code>PT-1011</code>) is automatically generated.</div>
            <div>&bull; Beds are strictly isolated; 1 patient per negative-pressure room.</div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
            >
              Confirm Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

