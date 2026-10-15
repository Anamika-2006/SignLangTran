import React from 'react';
import { 
  Sparkles, 
  Video, 
  Mic, 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Globe2, 
  Layers, 
  Volume2, 
  FileText, 
  Lock,
  Heart,
  Users,
  Cpu,
  Play
} from 'lucide-react';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

export default function WebsiteHome({
  onLaunchStudio,
  onLaunchReverse,
  onLaunchAcademy,
  onOpenAuth,
  onOpenSOS
}) {
  const handleQuickPreviewSign = (sign) => {
    sounds.playDetectChime();
    speech.speak(sign.aslGloss);
  };

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24 text-left">
      
      {/* Top Announcement Ribbon */}
      <div className="w-full flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs hover:bg-indigo-100/80 transition-colors cursor-pointer" onClick={onLaunchStudio}>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>GestureSync AI v4.2 Live Platform</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-600 font-bold flex items-center gap-1">
            Experience Live Studio <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-6 pt-2 pb-6">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
          Universal Sign Language <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600">
            Multimodal Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal">
          Empowering real-time, bidirectional conversation between Deaf and hearing communities. Translates natural hand gestures into fluent vocal speech and spoken voice into animated sign cards at sub-15ms edge latency.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onLaunchStudio();
            }}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all group"
          >
            <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Launch Camera Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onLaunchReverse();
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-colors"
          >
            <Mic className="w-4 h-4 text-indigo-600" />
            <span>Try Voice-to-Sign</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenAuth();
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-sm transition-colors"
          >
            <span>Sign In / Register</span>
          </button>
        </div>

        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-slate-200/80 mt-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600">99.4%</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Recognition Accuracy</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">&lt; 15ms</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Edge Inference Latency</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">60 FPS</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Real-Time CV Tracking</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">100%</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">On-Device Privacy</p>
          </div>
        </div>

      </section>

      {/* Interactive Live Gesture Preview Sandbox on Homepage */}
      <section className="w-full max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                INTERACTIVE PREVIEW
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Test Core Vocabulary in Real Time
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Click any sign below to test auditory vocal speech synthesis and gesture kinematics.
            </p>
          </div>

          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            <span>Open Full Camera Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Clickable Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SIGN_DICTIONARY.slice(0, 12).map((sign) => (
            <button
              key={sign.id}
              onClick={() => handleQuickPreviewSign(sign)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left flex flex-col justify-between transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl group-hover:scale-110 transition-transform">{sign.icon}</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <div className="mt-2">
                <p className="font-bold text-sm text-slate-900 leading-tight">{sign.aslGloss}</p>
                <p className="text-[11px] text-slate-500 truncate">{sign.name}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Modern Accessibility
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            A comprehensive suite uniting computer vision, natural language processing, and multimodal voice technology into one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                21-Point Hand Pose Mesh
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Utilizes high-speed MediaPipe computer vision to map all 21 hand joints per frame at 60 FPS directly inside the browser.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 cursor-pointer" onClick={onLaunchStudio}>
                Try Vision Studio &rarr;
              </span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Multimodal Speech Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Turns visual gestures into audible spoken voice out loud. Features Continuous Auto-Voice mode that speaks signs automatically.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 cursor-pointer" onClick={onLaunchStudio}>
                Explore Voice Synthesis &rarr;
              </span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Two-Way Reverse Studio
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A hearing person speaks into the mic and speech is immediately broken down into sequential animated sign flashcards for Deaf listeners.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 cursor-pointer" onClick={onLaunchReverse}>
                Start Two-Way Audio &rarr;
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-md flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono">
            3-STEP WORKFLOW
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How GestureSync AI Works
          </h2>
          <p className="text-slate-400 text-sm">
            Zero complex hardware or external sensors required. Operates seamlessly on standard laptop and smartphone cameras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">1</span>
            <h4 className="font-bold text-lg text-white">Enable Camera</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Activate your built-in webcam. The MediaPipe computer vision model immediately initializes client-side.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">2</span>
            <h4 className="font-bold text-lg text-white">Perform Natural Signs</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Show your hand gestures. The 21-point kinematic skeleton calculates Euclidean finger extensions in real time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col gap-3">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">3</span>
            <h4 className="font-bold text-lg text-white">Hear & Read Speech</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The direct output card displays the fluent text below the camera while the speech engine vocalizes the phrase aloud.
            </p>
          </div>
        </div>
      </section>

      {/* Official Documentation & PDF Section */}
      <section className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 border border-blue-200 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Download Official Project Report (PDF)
            </h3>
          </div>
          <p className="text-sm text-slate-600 max-w-xl">
            Complete technical specification covering system architecture, mathematical landmark topology, and operational workflows.
          </p>
        </div>

        <a
          href="/GestureSync_AI_Project_Documentation.pdf"
          download="GestureSync_AI_Project_Documentation.pdf"
          className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 whitespace-nowrap active:scale-95 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Download PDF Document</span>
        </a>
      </section>

      {/* Bottom CTA Banner */}
      <section className="w-full max-w-5xl mx-auto text-center py-8 flex flex-col items-center gap-5 border-t border-slate-200">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to Experience Real-Time Sign Translation?
        </h2>
        <p className="text-slate-600 max-w-xl text-sm">
          Join thousands of signers, certified interpreters, and students making communication universal.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchStudio}
            className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            Launch Camera Studio Now
          </button>
          <button
            onClick={onOpenAuth}
            className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-colors"
          >
            Create Free Account
          </button>
        </div>
      </section>

    </div>
  );
}
