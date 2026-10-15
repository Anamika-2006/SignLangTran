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
  FileText,
  Home
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
    { id: 'home', label: 'Home', icon: Home },
    { id: 'translator', label: 'Camera Studio', icon: Video, badge: 'Live AI' },
    { id: 'reverse', label: 'Voice to Sign', icon: Mic, badge: '2-Way' },
    { id: 'academy', label: 'Sign Academy', icon: GraduationCap, badge: 'Learn' },
    { id: 'analytics', label: 'Telemetry', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 p-[2px] shadow-sm group">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center group-hover:bg-indigo-50/50 transition-colors">
                <span className="text-2xl filter drop-shadow-xs">🤟</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  Gesture<span className="text-indigo-600">Sync</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  PRO AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Multimodal Sign Language & Speech Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200">
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
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
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
            
            {/* Download Project PDF Report */}
            <a
              href="/GestureSync_AI_Project_Documentation.pdf"
              download="GestureSync_AI_Project_Documentation.pdf"
              title="Download Official Project PDF Report"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>PDF Report</span>
            </a>

            {/* Emergency SOS button */}
            <button
              onClick={() => {
                sounds.playAlarm();
                onOpenSOS();
              }}
              title="Emergency SOS Mode"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
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
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Settings Dialog Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenSettings();
              }}
              title="Application Settings"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* User Account / Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-slate-900 font-semibold text-xs leading-none truncate max-w-[90px]">{currentUser.name}</p>
                    <p className="text-[10px] text-indigo-600 font-medium leading-tight">{currentUser.role || 'Member'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onLogout();
                  }}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-red-600 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all transform active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Sign Up</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200">
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
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
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
