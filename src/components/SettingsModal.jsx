import React from 'react';
import { X, Sliders, Eye, Volume2, Shield, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Application Settings</h3>
              <p className="text-xs text-slate-400">Configure neural models and vision capture</p>
            </div>
          </div>
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-5 text-sm">
          
          {/* Dialect */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-slate-400 uppercase">
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
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Camera Mirroring */}
          <div className="flex items-center justify-between py-2 border-t border-slate-800/80">
            <div>
              <p className="font-semibold text-white">Mirror Camera Feed</p>
              <p className="text-xs text-slate-400">Flip webcam preview horizontally for natural selfie view</p>
            </div>
            <input
              type="checkbox"
              checked={settings.mirrorMode}
              onChange={(e) => handleChange('mirrorMode', e.target.checked)}
              className="w-5 h-5 accent-cyan-500 rounded bg-slate-950"
            />
          </div>

          {/* Auto Speak on Gesture */}
          <div className="flex items-center justify-between py-2 border-t border-slate-800/80">
            <div>
              <p className="font-semibold text-white">Continuous Auto-Vocalize</p>
              <p className="text-xs text-slate-400">Speak words aloud immediately upon neural lock</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoSpeak}
              onChange={(e) => handleChange('autoSpeak', e.target.checked)}
              className="w-5 h-5 accent-cyan-500 rounded bg-slate-950"
            />
          </div>

          {/* Confidence Slider */}
          <div className="flex flex-col gap-2 py-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Minimum Confidence Threshold</span>
              <span className="text-cyan-400 font-mono font-bold text-xs">
                {settings.confidenceThreshold || 90}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              value={settings.confidenceThreshold || 90}
              onChange={(e) => handleChange('confidenceThreshold', parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

        </div>

        {/* Footer */}
        <button
          onClick={() => { sounds.playSuccess(); onClose(); }}
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md"
        >
          Save & Apply Preferences
        </button>

      </div>
    </div>
  );
}
