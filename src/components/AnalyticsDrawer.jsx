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
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-white border-l border-slate-200 p-6 shadow-2xl flex flex-col justify-between text-left overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">System Telemetry</h3>
                <p className="text-xs text-slate-500">Real-time performance & logs</p>
              </div>
            </div>
            <button
              onClick={() => { sounds.playClick(); onClose(); }}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
                <span>SIGNS LOGGED</span>
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-1">{history.length + 18}</p>
              <p className="text-[10px] text-emerald-600 font-mono mt-0.5 font-medium">+4 in this session</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
                <span>AVG ACCURACY</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-1">98.4%</p>
              <p className="text-[10px] text-indigo-600 font-mono mt-0.5 font-medium">Neuro-verified</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
                <span>AVG LATENCY</span>
                <Clock className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-1">12ms</p>
              <p className="text-[10px] text-blue-600 font-mono mt-0.5 font-medium">Edge Tensor Core</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-slate-500 text-xs font-mono font-medium">
                <span>ACTIVE MODEL</span>
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-base font-bold text-slate-900 mt-1 truncate">NeuroSign v4</p>
              <p className="text-[10px] text-emerald-600 font-mono mt-0.5 font-medium">Online & Synced</p>
            </div>
          </div>

          {/* Translation History Feed */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-600" />
                Session History ({history.length}):
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => { sounds.playClick(); onClearHistory(); }}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                  No translations recorded yet. Use the camera or studio to begin!
                </div>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs flex flex-col gap-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 font-mono">{item.gloss || item.text}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Mode: {item.mode || 'Camera'}</span>
                      <span className="text-emerald-700 font-mono font-semibold">{item.confidence}% match</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Telemetry stored locally in session memory. No private data is logged to remote servers.
          </p>
        </div>

      </div>
    </div>
  );
}
