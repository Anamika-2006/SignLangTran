import React from 'react';
import { X, Sliders } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings
}) {
  if (!isOpen) return null;

  const handleChange = (key, val) => {
    sounds.playClick();
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Application Settings</h3>
              <p className="text-xs text-slate-500">Configure neural models and vision capture</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-5 text-sm">
          
          {/* Dialect */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Sign Language Regional Dialect:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ASL', label: 'ASL (American)' },
                { id: 'ISL', label: 'ISL (Indian)' },
                { id: 'BSL', label: 'BSL (British)' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleChange('dialect', item.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    settings.dialect === item.id
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Mirroring */}
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Mirror Camera Feed</p>
              <p className="text-xs text-slate-500">Flip webcam preview horizontally for natural selfie view</p>
            </div>
            <input
              type="checkbox"
              checked={settings.mirrorMode}
              onChange={(e) => handleChange('mirrorMode', e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded bg-slate-100"
            />
          </div>

          {/* Auto Speak on Gesture */}
          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <p className="font-semibold text-slate-800">Continuous Auto-Vocalize</p>
              <p className="text-xs text-slate-500">Speak words aloud immediately upon neural lock</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => handleChange('autoSpeak', e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded bg-slate-100"
            />
          </div>

          {/* Confidence Slider */}
          <div className="flex flex-col gap-2 py-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">Confidence Threshold</p>
                <p className="text-xs text-slate-500">Minimum certainty required before logging a sign</p>
              </div>
              <span className="font-mono text-sm font-bold text-indigo-600">
                {settings.confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              value={settings.confidenceThreshold}
              onChange={(e) => handleChange('confidenceThreshold', Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
}
