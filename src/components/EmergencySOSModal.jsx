import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Radio,
  Flame,
  Ambulance,
  BadgeAlert
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
    }, 900);
    return () => clearInterval(interval);
  }, [isOpen, isSirenActive]);

  if (!isOpen) return null;

  const handleTriggerVocalAlert = () => {
    sounds.playClick();
    speech.rate = 1.1;
    speech.speak(selectedSOS.text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Flashing strobe border effect */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-950 border-2 border-red-500 shadow-[0_0_80px_rgba(239,68,68,0.5)] p-6 sm:p-8 flex flex-col gap-6 text-left">
        
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-red-900/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-500 animate-pulse">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-red-400 tracking-widest uppercase">
                CRITICAL LIFE SAFETY HUD
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
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
            className="p-2.5 rounded-xl bg-slate-900 border border-red-500/40 text-slate-400 hover:text-white hover:bg-red-950/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Alert Hero Display Card for Bystanders / First Responders */}
        <div className="p-6 rounded-3xl bg-red-950/40 border border-red-500/60 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-red-300">
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 animate-ping" />
              BROADCASTING DISTRESS MESSAGE
            </span>
            <span>TRANSLATION: DEAF / MUTE EMERGENCY</span>
          </div>

          <div className="my-2">
            <span className="text-4xl">{selectedSOS.icon}</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-snug">
              "{selectedSOS.text}"
            </h3>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-red-900/40 text-xs text-red-300 font-mono">
            <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
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
                  sounds.playAlarm();
                  setSelectedSOS(sos);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  isSel
                    ? 'bg-red-600/30 border-red-500 text-white shadow-lg shadow-red-950/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-2xl">{sos.icon}</span>
                <span className="text-xs font-bold leading-tight mt-1">{sos.title}</span>
              </button>
            );
          })}
        </div>

        {/* Emergency Voice Output Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleTriggerVocalAlert}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-2xl shadow-red-600/40 active:scale-95 transition-all"
          >
            <Volume2 className="w-5 h-5 animate-bounce" />
            <span>Broadcast Emergency Vocal Siren</span>
          </button>

          <button
            onClick={() => setIsSirenActive(!isSirenActive)}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-2"
          >
            {isSirenActive ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isSirenActive ? 'Mute Audible Siren' : 'Enable Audible Siren'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
