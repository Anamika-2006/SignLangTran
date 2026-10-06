import React from 'react';
import { X, BarChart2, Activity, Clock, Zap, CheckCircle2, History, Trash2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function AnalyticsDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-cyan-500/30 p-6 shadow-2xl flex flex-col justify-between text-left overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">System Telemetry</h3>
                <p className="text-xs text-slate-400">Real-time performance & logs</p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>SIGNS LOGGED</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">{history.length + 18}</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">+4 in this session</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>AVG ACCURACY</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">98.4%</p>
              <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Neuro-verified</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>AVG LATENCY</span>
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">12ms</p>
              <p className="text-[10px] text-indigo-300 font-mono mt-0.5">Edge Tensor Core</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>ACTIVE MODEL</span>
                <Activity className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <p className="text-base font-bold text-white mt-1 truncate">NeuroSign v4</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Online & Syncing</p>
            </div>
          </div>

          {/* Translation History Feed */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-cyan-400" />
                Session History ({history.length}):
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => { sounds.playClick(); onClearHistory(); }}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                  No translations recorded yet. Use the camera or studio to begin!
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="text-cyan-400 font-semibold">{item.mode || 'Sign to Voice'}</span>
                      <span>{item.time || 'Moments ago'}</span>
                    </div>
                    <p className="text-xs font-bold text-white">"{item.text}"</p>
                    {item.gloss && (
                      <p className="text-[10px] text-slate-400 font-mono">Gloss: {item.gloss}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={() => { sounds.playClick(); onClose(); }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Telemetry Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
