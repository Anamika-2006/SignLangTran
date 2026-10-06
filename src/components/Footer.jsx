import React from 'react';
import { Heart, GitPullRequest, Code, Shield, Sparkles, Keyboard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding & Mission */}
        <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-white">
              GESTURE<span className="text-cyan-400">SYNC</span> AI
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              ACCESSIBILITY FIRST
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Empowering frictionless, dignified communication across deaf, hard-of-hearing, and vocal worlds.
          </p>
        </div>

        {/* Center: Keyboard Shortcuts HUD */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hotkeys:</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 font-mono text-[10px]">Space</kbd> Video</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 font-mono text-[10px]">T</kbd> Speak</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 font-mono text-[10px]">M</kbd> Mute</span>
        </div>

        {/* Right: GitHub & Creator Link */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Anamika-2006/SignLangTran"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <GitPullRequest className="w-4 h-4 text-cyan-400" />
            <span>GitHub: Anamika-2006/SignLangTran</span>
          </a>
          <span className="text-slate-700">|</span>
          <p className="flex items-center gap-1 text-slate-500">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for humanity
          </p>
        </div>

      </div>
    </footer>
  );
}
