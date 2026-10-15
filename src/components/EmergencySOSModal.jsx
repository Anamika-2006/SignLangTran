import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Radio
} from 'lucide-react';
import { SOS_PRESETS } from '../data/signsData';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

export default function EmergencySOSModal({ isOpen, onClose }) {
  const [selectedSOS, setSelectedSOS] = useState(SOS_PRESETS[0]);
  const [isSirenActive, setIsSirenActive] = useState(true);

  // Siren effect loop when open
  useEffect(() => {
    if (!isOpen || !isSirenActive) return;
    const interval = setInterval(() => {
      sounds.playAlarm();
    }, 1200);
    return () => clearInterval(interval);
  }, [isOpen, isSirenActive]);

  if (!isOpen) return null;

  const handleTriggerVocalAlert = () => {
    sounds.playClick();
    speech.rate = 1.1;
    speech.speak(selectedSOS.text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Main Alert Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border-2 border-red-500 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-left">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-red-600 tracking-wider uppercase">
                CRITICAL LIFE SAFETY HUD
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Emergency SOS Broadcast
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              speech.stop();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Alert Hero Display Card for Bystanders / First Responders */}
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-red-700">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-ping text-red-600" />
              BROADCASTING DISTRESS MESSAGE
            </span>
            <span>TRANSLATION: DEAF / MUTE EMERGENCY</span>
          </div>

          <div className="my-2">
            <span className="text-4xl">{selectedSOS.icon}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-red-950 mt-2 leading-snug">
              "{selectedSOS.text}"
            </h3>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-red-200 text-xs text-red-700 font-mono">
            <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>GEO-COORDINATES: Lat 28.6139° N, Lon 77.2090° E (Accuracy &plusmn; 4m)</span>
          </div>
        </div>

        {/* SOS Preset Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SOS_PRESETS.map((sos) => {
            const isSel = selectedSOS.id === sos.id;
            return (
              <button
                key={sos.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedSOS(sos);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  isSel
                    ? 'bg-red-600 text-white border-red-600 shadow-md font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <span className="text-2xl">{sos.icon}</span>
                <span className="text-xs font-bold leading-tight mt-1">{sos.label}</span>
                <span className={`text-[10px] ${isSel ? 'text-red-100' : 'text-slate-500'}`}>
                  {sos.type}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setIsSirenActive(!isSirenActive)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            {isSirenActive ? <Volume2 className="w-4 h-4 text-red-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{isSirenActive ? 'Siren Tone Active (Mute)' : 'Siren Muted (Activate)'}</span>
          </button>

          <button
            onClick={handleTriggerVocalAlert}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>Speak Distress Aloud Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
