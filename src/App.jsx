import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WebsiteHome from './components/WebsiteHome';
import CameraTranslator from './components/CameraTranslator';
import VoiceToSignStudio from './components/VoiceToSignStudio';
import SignAcademy from './components/SignAcademy';
import EmergencySOSModal from './components/EmergencySOSModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import AnalyticsDrawer from './components/AnalyticsDrawer';
import Footer from './components/Footer';
import { MOCK_HISTORY } from './data/signsData';
import { sounds } from './utils/soundEffects';
import { speech } from './utils/speechSynthesizer';
import { 
  Sparkles, 
  Check, 
  Cpu
} from 'lucide-react';

export default function App() {
  // Navigation & View States: 'home' is default SaaS website landing view
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'translator', 'reverse', 'academy'
  
  // UI Dialog States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // App Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settings, setSettings] = useState({
    dialect: 'ASL',
    mirrorMode: true,
    autoSpeak: false,
    confidenceThreshold: 90
  });

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // Translation Tokens & Session History
  const [sentenceTokens, setSentenceTokens] = useState(['HELLO', 'THANK-YOU']);
  const [history, setHistory] = useState(MOCK_HISTORY);

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Append new word to the active sentence stream
  const handleAppendWord = (word) => {
    setSentenceTokens(prev => [...prev, word]);
    showToast(`Added sign: "${word}" to sentence stream`, 'success');

    if (settings.autoSpeak) {
      speech.speak(word);
    }
  };

  // Clear current sentence stream
  const handleClearSentence = () => {
    setSentenceTokens([]);
    showToast('Sentence stream cleared', 'info');
  };

  // Save translation record to history
  const handleSaveToHistory = (item) => {
    const newItem = {
      id: `h_${Date.now()}`,
      text: item.text,
      gloss: item.gloss,
      mode: item.mode,
      time: 'Just now',
      confidence: 98.4
    };
    setHistory(prev => [newItem, ...prev]);
    showToast('Translation logged in Telemetry history', 'success');
  };

  // User Sign-in handler
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! Profile active.`, 'success');
  };

  // User Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of session', 'info');
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled(prev => {
          const next = !prev;
          sounds.enabled = next;
          return next;
        });
      } else if (e.key === 'Escape') {
        setIsAuthOpen(false);
        setIsSOSOpen(false);
        setIsSettingsOpen(false);
        setIsAnalyticsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification Floater */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xl shadow-slate-900/10 animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? (
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Professional Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8">
        
        {/* VIEW 0: FULL SAAS WEBSITE LANDING EXPERIENCE */}
        {activeTab === 'home' && (
          <div className="animate-in fade-in duration-300">
            <WebsiteHome
              onLaunchStudio={() => setActiveTab('translator')}
              onLaunchReverse={() => setActiveTab('reverse')}
              onLaunchAcademy={() => setActiveTab('academy')}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenSOS={() => setIsSOSOpen(true)}
            />
          </div>
        )}

        {/* VIEW 1: SIGN STUDIO (TRANSLATE CAMERA/GESTURES TO TEXT & SPEECH) */}
        {activeTab === 'translator' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            
            {/* Header Hero Banner */}
            <div className="text-left flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                    NEUROSIGN VISION ENGINE 4.2
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    EDGE TENSOR ACTIVE
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-2">
                  Sign Language to Speech <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">& Text Studio</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl mt-1">
                  Translate sign gestures instantly into natural fluent vocal speech, English prose, and Hindi with sub-15ms edge kinematics.
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span className="text-slate-500 font-mono">Mode:</span>
                <span className="text-slate-900 font-bold font-mono">{settings.dialect} Dialect</span>
              </div>
            </div>

            {/* Unified Direct Output Camera Studio */}
            <div className="w-full flex flex-col items-center">
              <CameraTranslator
                settings={settings}
                setSettings={setSettings}
                currentSentence={sentenceTokens}
                onAppendWord={handleAppendWord}
                onClearSentence={handleClearSentence}
                onSaveToHistory={handleSaveToHistory}
                onSignRecognized={() => {}}
              />
            </div>

          </div>
        )}

        {/* VIEW 2: VOICE TO SIGN REVERSE STUDIO */}
        {activeTab === 'reverse' && (
          <div className="animate-in fade-in duration-300">
            <VoiceToSignStudio />
          </div>
        )}

        {/* VIEW 3: SIGN ACADEMY LEARNING STUDIO */}
        {activeTab === 'academy' && (
          <div className="animate-in fade-in duration-300">
            <SignAcademy />
          </div>
        )}

      </main>

      {/* Enterprise Light Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      <AnalyticsDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />

    </div>
  );
}
