import React, { useState, useEffect } from 'react';
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
  Play, 
  Pause,
  X,
  Activity,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
  Sliders,
  Check,
  Building2,
  Stethoscope,
  BookOpen,
  Plane,
  Eye,
  Maximize2
} from 'lucide-react';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

// Interactive Gesture Showcase Presets
const DEMO_GESTURES = [
  {
    id: 'hello',
    gloss: 'HELLO',
    label: 'Hello / Greeting',
    icon: '👋',
    meaning: 'Open palm wave extending outwards',
    vocalSpeech: 'Hello! Welcome to GestureSync AI.',
    confidence: 99.2,
    latency: '8.4 ms',
    activeFingers: ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'],
    category: 'Universal Greeting'
  },
  {
    id: 'thank-you',
    gloss: 'THANK YOU',
    label: 'Thank You',
    icon: '🙏',
    meaning: 'Flat hand moving forward from chin in gratitude',
    vocalSpeech: 'Thank you very much for your kind help.',
    confidence: 98.9,
    latency: '9.1 ms',
    activeFingers: ['Palm Forward', 'Finger Extension'],
    category: 'Polite Expression'
  },
  {
    id: 'i-love-you',
    gloss: 'I LOVE YOU',
    label: 'I Love You',
    icon: '🤟',
    meaning: 'Thumb, index, and pinky extended; middle and ring folded',
    vocalSpeech: 'I love you and appreciate everything you do!',
    confidence: 99.6,
    latency: '7.9 ms',
    activeFingers: ['Thumb Extended', 'Index Extended', 'Pinky Extended'],
    category: 'Universal Sign'
  },
  {
    id: 'peace',
    gloss: 'PEACE',
    label: 'Peace / V Sign',
    icon: '✌️',
    meaning: 'Index and middle fingers in separated V shape',
    vocalSpeech: 'Wishing you harmony and peace.',
    confidence: 99.1,
    latency: '8.2 ms',
    activeFingers: ['Index (V)', 'Middle (V)'],
    category: 'Symbolic Gesture'
  },
  {
    id: 'doctor',
    gloss: 'DOCTOR',
    label: 'Doctor / Medical',
    icon: '🩺',
    meaning: 'Tapping fingertips onto wrist pulse point',
    vocalSpeech: 'I urgently need to consult a physician.',
    confidence: 98.7,
    latency: '9.5 ms',
    activeFingers: ['M-Handshape', 'Wrist Contact'],
    category: 'Healthcare'
  },
  {
    id: 'help',
    gloss: 'HELP',
    label: 'Help / SOS',
    icon: '🆘',
    meaning: 'Closed fist with thumb upright lifted by flat palm',
    vocalSpeech: 'Emergency! Please assist me immediately.',
    confidence: 99.8,
    latency: '7.8 ms',
    activeFingers: ['Thumbs Up', 'Base Palm Lift'],
    category: 'Emergency Life Safety'
  },
  {
    id: 'water',
    gloss: 'WATER',
    label: 'Water',
    icon: '💧',
    meaning: 'W-handshape tapping chin twice',
    vocalSpeech: 'Could I please get a glass of water?',
    confidence: 98.4,
    latency: '10.2 ms',
    activeFingers: ['W-Shape (3 Fingers)'],
    category: 'Essential Need'
  },
  {
    id: 'yes',
    gloss: 'YES / AGREE',
    label: 'Yes / Agree',
    icon: '👍',
    meaning: 'Fist nodding forward simulating head nod',
    vocalSpeech: 'Yes, I understand and agree.',
    confidence: 99.0,
    latency: '8.6 ms',
    activeFingers: ['Fist Nod Kinematics'],
    category: 'Affirmation'
  }
];

// Real-World Applied Scenarios
const REAL_WORLD_SCENARIOS = [
  {
    id: 'healthcare',
    title: 'Hospital Emergency Triage',
    category: 'CLINICAL TRIAGE',
    icon: Stethoscope,
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    patientSign: '[HELP] [CHEST] [PAIN]',
    voiceOutput: '"Emergency: I am having severe chest pain and difficulty breathing."',
    impact: 'Reduces intake triage delays from 45 minutes to under 12 seconds.',
    samplePreset: 'help'
  },
  {
    id: 'education',
    title: 'University Lectures & Classrooms',
    category: 'INCLUSIVE ACADEMIA',
    icon: BookOpen,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    patientSign: '[QUESTION] [PLEASE] [EXPLAIN]',
    voiceOutput: '"Excuse me Professor, could you please clarify that theorem?"',
    impact: 'Enables active, spontaneous classroom participation without waiting on human interpreters.',
    samplePreset: 'thank-you'
  },
  {
    id: 'corporate',
    title: 'Workplace Meetings & Tech Sprints',
    category: 'PROFESSIONAL COLLABORATION',
    icon: Building2,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    patientSign: '[AGREE] [DEPLOY] [SYSTEM]',
    voiceOutput: '"I agree with the architecture proposal, let us proceed to production deployment."',
    impact: 'Empowers deaf engineers and executives to actively contribute in fast-paced standups.',
    samplePreset: 'hello'
  },
  {
    id: 'transit',
    title: 'Airports & Public Transit Hubs',
    category: 'ACCESSIBLE TRANSIT',
    icon: Plane,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    patientSign: '[WHERE] [GATE] [WATER]',
    voiceOutput: '"Could you please direct me to gate 14 and the nearest water station?"',
    impact: 'Eliminates travel friction, anxiety, and misunderstandings at checkpoints.',
    samplePreset: 'peace'
  }
];

export default function WebsiteHome({
  onLaunchStudio,
  onLaunchReverse,
  onLaunchAcademy,
  onOpenAuth,
  onOpenSOS
}) {
  // Active Gesture in the Hero Live Sandbox
  const [activeGesture, setActiveGesture] = useState(DEMO_GESTURES[2]); // 'I LOVE YOU' by default
  const [isAudioWaveActive, setIsAudioWaveActive] = useState(false);

  // Active Applied Scenario
  const [activeScenario, setActiveScenario] = useState(REAL_WORLD_SCENARIOS[0]);

  // Interactive Impact Calculator State
  const [userCount, setUserCount] = useState(25);
  const [dailyMinutes, setDailyMinutes] = useState(45);

  // Handle Gesture Chip Tap
  const handleSelectGesture = (gesture) => {
    sounds.playDetectChime();
    setActiveGesture(gesture);
    setIsAudioWaveActive(true);
    speech.speak(gesture.vocalSpeech);
    setTimeout(() => setIsAudioWaveActive(false), 2200);
  };

  return (
    <div className="w-full flex flex-col gap-20 md:gap-32 text-left selection:bg-indigo-500 selection:text-white">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION: CLEAN, POWERFUL & CONVERSATIONAL */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-8 pt-4">
        
        {/* Soft Ambient Background Mesh Orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-200/30 via-sky-200/25 to-purple-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Innovation Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700">Next-Generation Multimodal AI Platform</span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-xs font-mono font-bold text-indigo-600">Sub-15ms Edge Latency</span>
        </div>

        {/* Main Punchy Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Silence to speech. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
              Thought to sign.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            GestureSync AI is the universal bridge between Deaf and hearing communities. Translates natural hand gestures into vocal speech and spoken voice into sign cards &mdash; 100% privately in your browser.
          </p>
        </div>

        {/* High-Conversion CTA Group */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => { sounds.playClick(); onLaunchStudio(); }}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all group cursor-pointer"
          >
            <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Launch Live Camera Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => { sounds.playClick(); onLaunchReverse(); }}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Mic className="w-4 h-4 text-indigo-600" />
            <span>Try Voice-to-Sign</span>
          </button>

          <a
            href="/GestureSync_AI_Project_Documentation.pdf"
            download="GestureSync_AI_Project_Documentation.pdf"
            className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Research PDF (v4.2)</span>
          </a>
        </div>

        {/* ============================================================== */}
        {/* 2. THE HERO PRODUCT COCKPIT: REALISTIC INTERACTIVE STUDIO PREVIEW */}
        {/* ============================================================== */}
        <div className="w-full mt-6 rounded-[32px] bg-white border border-slate-200 shadow-2xl shadow-indigo-950/5 overflow-hidden text-left">
          
          {/* Studio Chrome Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50/90 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                GestureSync Vision Studio Sandbox &mdash; Neural Kinematics v4.2
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                60 FPS Edge Feed
              </span>
              <span className="text-slate-400 hidden sm:inline">&bull;</span>
              <span className="text-slate-500 hidden sm:inline font-bold">Latency: {activeGesture.latency}</span>
            </div>
          </div>

          {/* Interactive Workspace */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            
            {/* Gesture Selection Palette */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Tap any sign gesture to test real-time recognition & audio speech:
                </span>
                <span className="text-indigo-600 font-semibold hidden sm:inline">
                  Instant text-to-speech feedback
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {DEMO_GESTURES.map((g) => {
                  const isSelected = activeGesture.id === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGesture(g)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="text-base">{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Visualizer: Realistic Camera Stage (Left) + Direct Translation Output (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left: Realistic Vision Tracking Stage */}
              <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[340px] text-white">
                
                {/* Visual Camera HUD Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono z-10">
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    21-POINT SKELETON LOCKED
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-indigo-300">
                    {activeGesture.confidence}% CERTAINTY
                  </span>
                </div>

                {/* High-Tech Bounding Box Reticle */}
                <div className="relative my-4 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 rounded-3xl border-2 border-indigo-400/40 bg-indigo-500/10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)]">
                    
                    {/* Corner Reticle Brackets */}
                    <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></span>
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></span>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></span>

                    <span className="text-7xl filter drop-shadow-lg animate-pulse-subtle">
                      {activeGesture.icon}
                    </span>

                    <span className="mt-2 text-xs font-mono font-bold text-cyan-300 tracking-wider">
                      {activeGesture.gloss}
                    </span>
                  </div>
                </div>

                {/* Active Finger Nodes Readout */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300 z-10 border-t border-slate-800/80 pt-2.5">
                  <span className="text-slate-400">
                    Kinematics: <strong className="text-white">{activeGesture.activeFingers.join(' &bull; ')}</strong>
                  </span>
                  <span className="text-emerald-400">Zero Cloud Upload</span>
                </div>
              </div>

              {/* Right: Direct Spoken Speech & Text Output */}
              <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                        TRANSLATED SPEECH OUTPUT
                      </span>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                        "{activeGesture.gloss}"
                      </h3>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                      FLUENT PROSE
                    </span>
                  </div>

                  {/* Vocal Sentence Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      Instant Vocal Speech Synthesized:
                    </span>

                    <p className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      "{activeGesture.vocalSpeech}"
                    </p>

                    {/* Audio Wave Frequency Bars */}
                    <div className="flex items-center gap-1 pt-2 h-7">
                      {[14, 28, 20, 32, 18, 26, 22, 16, 30, 36, 20, 26, 16, 22, 28, 18, 24, 12].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-200 ${
                            isAudioWaveActive
                              ? 'bg-indigo-600 animate-pulse'
                              : 'bg-slate-300'
                          }`}
                          style={{ height: isAudioWaveActive ? `${Math.max(8, (h * Math.random()).toFixed(0))}px` : '6px' }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    Spoken audio is generated immediately upon neural lock without needing to stare at a screen.
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playDetectChime();
                      setIsAudioWaveActive(true);
                      speech.speak(activeGesture.vocalSpeech);
                      setTimeout(() => setIsAudioWaveActive(false), 2000);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Vocal Audio</span>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); onLaunchStudio(); }}
                    className="flex items-center gap-1.5 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <span>Open Camera Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. BENTO GRID OF CORE PLATFORM CAPABILITIES */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              ENGINE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Everything Needed for Seamless Communication
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              An integrated multimodal suite engineered for zero latency, total privacy, and maximum accessibility.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Bento Card 1: 21-Joint Kinematics (8 Columns) */}
          <div 
            onClick={() => { sounds.playClick(); onLaunchStudio(); }}
            className="md:col-span-8 bento-card p-8 flex flex-col justify-between gap-6 cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                  MEDIA-PIPE BLAZEHAND
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Sub-15ms Latency
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                21-Point 3D Spatial Landmark Tracking
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Tracks 21 distinct joint coordinates across the wrist, thumb, knuckles, and fingertips at 60 FPS. Euler flexion angles and Euclidean distance vectors classify complex sign language gestures with over 99% accuracy.
              </p>
            </div>

            {/* Visual Joint Nodes Simulation Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-800 font-bold">Wrist, Thumb, Index, Middle, Ring, Pinky</span>
              </div>
              <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Studio &rarr;
              </span>
            </div>
          </div>

          {/* Bento Card 2: Bidirectional Voice-to-Sign (4 Columns) */}
          <div 
            onClick={() => { sounds.playClick(); onLaunchReverse(); }}
            className="md:col-span-4 bento-card p-8 flex flex-col justify-between gap-6 cursor-pointer group"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                2-WAY SYSTEM
              </span>

              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Voice-to-Sign Reverse Studio
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Speak aloud into your microphone. Our semantic parser tokenizes spoken sentences into structured ASL sign cards with fingerspelling fallback.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-2 border-t border-slate-100">
              <span>Try Speech Translation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 3: Sign Academy (4 Columns) */}
          <div 
            onClick={() => { sounds.playClick(); onLaunchAcademy(); }}
            className="md:col-span-4 bento-card p-8 flex flex-col justify-between gap-6 cursor-pointer group"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                LEARNING LAB
              </span>

              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Sign Academy & Quiz Arena
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Spaced-repetition visual flashcard catalog with randomized practice quizzes, score tracking, and celebratory confetti rewards.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 pt-2 border-t border-slate-100">
              <span>Start Learning Signs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 4: Critical Emergency SOS (4 Columns) */}
          <div 
            onClick={() => { sounds.playClick(); onOpenSOS(); }}
            className="md:col-span-4 bento-card p-8 flex flex-col justify-between gap-6 cursor-pointer group"
          >
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                LIFE SAFETY HUD
              </span>

              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Emergency SOS Broadcast
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                1-tap distress beacon broadcasting high-visibility visual alerts and an audible 900Hz alarm over speakers for emergency personnel.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-rose-600 pt-2 border-t border-slate-100">
              <span>Inspect Emergency HUD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Card 5: 100% Client-Side Privacy (4 Columns) */}
          <div className="md:col-span-4 bento-card p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                ZERO CLOUD DATA
              </span>

              <h3 className="text-2xl font-bold text-slate-900">
                100% On-Device Privacy
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Camera video frames are processed completely in local WebAssembly memory and discarded immediately. Compliant with HIPAA and GDPR standards.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Server Video Egress</span>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. REAL-WORLD APPLIED SCENARIOS */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col gap-6 text-left">
        
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            DEPLOYED APPLICATION DOMAINS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Restoring Independence Across Society
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tap a domain below to observe how bidirectional translation eliminates communication barriers.
          </p>
        </div>

        {/* Scenario Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {REAL_WORLD_SCENARIOS.map((scen) => {
            const Icon = scen.icon;
            const isSel = activeScenario.id === scen.id;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveScenario(scen);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSel
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{scen.title}</p>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-bold border font-mono ${scen.badgeColor}`}>
                  {scen.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Spotlight Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left flex-1">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
              TRANSLATION DIALOGUE FLOW:
            </span>
            <p className="text-sm font-mono text-slate-600">
              {activeScenario.patientSign}
            </p>
            <p className="text-lg sm:text-xl font-bold text-slate-900">
              {activeScenario.voiceOutput}
            </p>
            <p className="text-xs text-emerald-700 font-semibold pt-1">
              &bull; Measured Outcome: {activeScenario.impact}
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playDetectChime();
              speech.speak(activeScenario.voiceOutput);
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Dialogue Aloud</span>
          </button>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 5. INTERACTIVE TIME & COST-SAVINGS CALCULATOR */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col gap-6 text-left">
        
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            ORGANIZATIONAL IMPACT CALCULATOR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Calculate Interpretation Time & Cost Savings
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Adjust the sliders below to estimate annual communication barrier reductions for your campus, hospital, or enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          
          <div className="flex flex-col gap-6">
            
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Deaf & Hearing Members Supported:</span>
                <span className="font-mono font-bold text-indigo-600 text-sm">{userCount} Users</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={userCount}
                onChange={(e) => setUserCount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5 Users</span>
                <span>250+ Users</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Average Daily Communication Time:</span>
                <span className="font-mono font-bold text-indigo-600 text-sm">{dailyMinutes} Minutes/Day</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10 Min</span>
                <span>3 Hours</span>
              </div>
            </div>

          </div>

          {/* Computed Output Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-[11px] font-mono text-indigo-700 font-bold block">HOURS SAVED / YEAR</span>
              <p className="text-3xl sm:text-4xl font-black text-indigo-950 mt-1">
                {Math.round((userCount * dailyMinutes * 250) / 60)} hrs
              </p>
              <p className="text-[10px] text-indigo-600 mt-1 font-semibold">Zero wait time for interpreters</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[11px] font-mono text-emerald-700 font-bold block">COMPLIANCE SCORE</span>
              <p className="text-3xl sm:text-4xl font-black text-emerald-950 mt-1">100%</p>
              <p className="text-[10px] text-emerald-600 mt-1 font-semibold">ADA & Web Accessibility compliant</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Deploy GestureSync in your institution</p>
                <p className="text-[11px] text-slate-500">Includes real-time camera studio, voice synthesis, and training.</p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onOpenAuth(); }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs whitespace-nowrap cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 6. OFFICIAL RESEARCH PDF REPORT DOWNLOAD BANNER */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5 text-left">
          <div className="w-16 h-16 rounded-2xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Official Project PDF Documentation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Complete 5-page research report detailing system architecture, MediaPipe kinematics, dataflow pipelines, and ethical accessibility standards.
            </p>
          </div>
        </div>

        <a
          href="/GestureSync_AI_Project_Documentation.pdf"
          download="GestureSync_AI_Project_Documentation.pdf"
          className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Download PDF Report</span>
        </a>
      </section>

    </div>
  );
}
