import React from 'react';
import { Heart, GitPullRequest, Keyboard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-500 text-xs shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding & Mission */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-black text-slate-900">
              Gesture<span className="text-indigo-600">Sync</span> AI
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-semibold">
              ACCESSIBILITY FIRST
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Empowering frictionless, dignified communication across deaf, hard-of-hearing, and vocal worlds.
          </p>
        </div>

        {/* Center: Keyboard Shortcuts HUD */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Keyboard className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hotkeys:</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px] shadow-2xs">Space</kbd> Video</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px] shadow-2xs">T</kbd> Speak</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px] shadow-2xs">M</kbd> Mute</span>
        </div>

        {/* Right: GitHub & Creator Link */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Anamika-2006/SignLangTran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
          >
            <GitPullRequest className="w-4 h-4 text-indigo-600" />
            <span>GitHub: Anamika-2006/SignLangTran</span>
          </a>
          <span className="text-slate-300">|</span>
          <p className="flex items-center gap-1 text-slate-500">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for humanity
          </p>
        </div>

      </div>
    </footer>
  );
}
