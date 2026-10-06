import React from 'react';
import { 
  Sparkles, 
  Video, 
  Mic, 
  GraduationCap, 
  BarChart2, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  User, 
  SlidersHorizontal,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Navbar({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onOpenSOS,
  onOpenSettings,
  onOpenAuth,
  currentUser,
  onLogout,
  onOpenAnalytics
}) {
  const navItems = [
    { id: 'translator', label: 'Sign Studio', icon: Video, badge: 'Live AI' },
    { id: 'reverse', label: 'Voice to Sign', icon: Mic, badge: '2-Way' },
    { id: 'academy', label: 'Sign Academy', icon: GraduationCap, badge: 'Learn' },
    { id: 'analytics', label: 'Telemetry', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('translator')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-600 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 group">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <span className="text-2xl filter drop-shadow">🤟</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  GESTURE<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">SYNC</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v4.2 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Neural Sign Language & Multimodal Vocal Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    if (item.id === 'analytics') {
                      onOpenAnalytics();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Emergency SOS button */}
            <button
              onClick={() => {
                sounds.playAlarm();
                onOpenSOS();
              }}
              title="Emergency SOS Mode"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline font-mono">SOS</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                sounds.enabled = !soundEnabled;
                if (!soundEnabled) sounds.playClick();
              }}
              title={soundEnabled ? 'Mute Interface Audio' : 'Enable Interface Audio'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Settings Dialog Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSettings();
              }}
              title="Application Settings"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-white font-semibold text-xs leading-none truncate max-w-[90px]">{currentUser.name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono leading-tight">{currentUser.role || 'Member'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onLogout();
                  }}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenAuth();
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-900">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  if (item.id === 'analytics') {
                    onOpenAnalytics();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
