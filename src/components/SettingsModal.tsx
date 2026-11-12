import React, { useState } from 'react';
import { useMediTrack } from '../context/MediTrackContext';
import { X, Sliders, ShieldCheck, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, currentUser } = useMediTrack();
  const [feverThreshold, setFeverThreshold] = useState(config.feverThreshold.toString());
  const [totalCapacity, setTotalCapacity] = useState(config.totalCapacity.toString());
  const [headDoctorApproval, setHeadDoctorApproval] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const parsedThreshold = parseFloat(feverThreshold);
    const parsedCapacity = parseInt(totalCapacity, 10);

    if (isNaN(parsedThreshold) || parsedThreshold < 36.0 || parsedThreshold > 41.0) {
      setFeedback({ success: false, message: 'Fever threshold must be between 36.0°C and 41.0°C.' });
      return;
    }

    const res = updateConfig(
      {
        feverThreshold: parsedThreshold,
        totalCapacity: parsedCapacity,
      },
      headDoctorApproval
    );

    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Clinical Protocol Configuration</h3>
              <p className="text-xs text-slate-400">Governance and threshold calibration</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs font-semibold ${
              feedback.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Fever Threshold (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              min="36.0"
              max="41.0"
              value={feverThreshold}
              onChange={(e) => setFeverThreshold(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Readings at or above this value reset a patient's consecutive fever-free count. Standard is 37.5°C.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Total Quarantine Capacity (Rooms)
            </label>
            <input
              type="number"
              disabled
              value={totalCapacity}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-bold cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">Fixed architectural specification (74 isolation beds).</p>
          </div>

          {/* Business rule: Head Doctor Approval checkbox */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <label className="flex items-start space-x-2 text-xs font-bold text-indigo-900 cursor-pointer">
              <input
                type="checkbox"
                checked={headDoctorApproval}
                onChange={(e) => setHeadDoctorApproval(e.target.checked)}
                className="mt-0.5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>I confirm approval from Chief Medical Officer / Head Doctor for threshold calibration</span>
            </label>
            <p className="text-[11px] text-indigo-700">
              Required by quarantine statutory requirements before clinical discharge criteria can be modified.
            </p>
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
              className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition"
            >
              Apply Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

