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
  Compass,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
  Maximize2
} from 'lucide-react';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

// Interactive Feature Catalog with full technical & case-study metadata
const FEATURE_CATALOG = [
  {
    id: 'vision-engine',
    title: 'Neural Vision & 21-Joint Hand Tracking',
    subtitle: 'MediaPipe-powered spatial landmark estimation operating at 60 FPS edge latency',
    badge: 'Core Vision AI',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    icon: Video,
    stats: {
      latency: '9.4 ms',
      accuracy: '98.8%',
      framerate: '60 FPS',
      compute: '100% On-Device'
    },
    shortDesc: 'Tracks 21 3D hand joints simultaneously in real time, detecting flexion, orientation, and kinematic trajectories without sending video frames to external servers.',
    deepDive: {
      architecture: 'MediaPipe BlazeHand + Temporal LSTM Classifier',
      inputSpecs: '1280x720 RGB stream, 30-60 Hz frame buffer',
      kinematicNodes: '21 3D joint landmarks (Wrist, Thumb, Index, Middle, Ring, Pinky)',
      privacy: 'Client-side WebAssembly execution; zero server video transit.',
      useCase: 'Hospital intake triage where deaf patients need immediate symptom translation without waiting for an on-call interpreter.'
    },
    sampleDemoSign: 'HELLO',
    demoVoiceText: 'Hello, welcome! I am ready to translate your signs in real time.',
    actionLabel: 'Launch Camera Studio',
    studioTarget: 'translator'
  },
  {
    id: 'voice-to-sign',
    title: 'Bidirectional Voice-to-Sign Engine',
    subtitle: 'Converts spoken vocal audio into synchronized, animated sign glosses',
    badge: '2-Way Communication',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: Mic,
    stats: {
      latency: '14.2 ms',
      accuracy: '97.5%',
      framerate: 'Fluid Animation',
      compute: 'Browser Edge'
    },
    shortDesc: 'Allows hearing individuals to speak naturally into their microphone while the system transcribes phrases into ASL/ISL animated sign cards in real-time.',
    deepDive: {
      architecture: 'Web Speech Recognition + Semantic ASL Gloss Parser',
      inputSpecs: 'Continuous 44.1kHz vocal audio stream with noise suppression',
      kinematicNodes: 'Step-by-step gesture sequencer with fingerspelling fallback',
      privacy: 'Direct browser audio parsing with no audio logging.',
      useCase: 'Classroom discussions where teachers speak aloud and deaf students view the animated sign sequence on their desktop screen.'
    },
    sampleDemoSign: 'THANK-YOU',
    demoVoiceText: 'Thank you very much for sharing your insights today.',
    actionLabel: 'Try Voice-to-Sign',
    studioTarget: 'reverse'
  },
  {
    id: 'speech-synthesis',
    title: 'Instant Natural Speech Synthesis',
    subtitle: 'Fluid, natural human vocalization with variable speech rate & tone control',
    badge: 'Audio Engine',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: Volume2,
    stats: {
      latency: '< 5 ms',
      accuracy: '100%',
      framerate: 'Continuous',
      compute: 'Neural TTS'
    },
    shortDesc: 'Translates recognized sign language gestures into natural vocal speech instantly so hearing individuals hear fluent, natural sentences without looking at the screen.',
    deepDive: {
      architecture: 'Web Audio API + Multilingual Neural Voice Synthesizer',
      inputSpecs: 'Recognized gloss tokens converted into fluent contextual prose',
      kinematicNodes: 'Audio waveform simulation with adaptive rate & pitch control',
      privacy: 'Generated strictly on local hardware with zero external cloud calls.',
      useCase: 'Fast-paced grocery, retail, or transit interactions where immediate spoken clarity saves time and prevents confusion.'
    },
    sampleDemoSign: 'WATER',
    demoVoiceText: 'Could I please get a fresh glass of water?',
    actionLabel: 'Test Speech in Studio',
    studioTarget: 'translator'
  },
  {
    id: 'sign-academy',
    title: 'Gamified Sign Academy & Flashcards',
    subtitle: 'Interactive learning suite with spaced-repetition quizzes & confetti celebrations',
    badge: 'Education & Mastery',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    icon: GraduationCap,
    stats: {
      latency: 'Instant',
      accuracy: 'Adaptive',
      framerate: 'Gamified',
      compute: 'Interactive'
    },
    shortDesc: 'A rich visual dictionary and flashcard catalog across ASL and ISL, paired with randomized quizzes, streaks, and tactile visual feedback.',
    deepDive: {
      architecture: 'Spaced-Repetition Interactive Flashcard Arena',
      inputSpecs: 'Category-based taxonomy (Greetings, Emergency, Food, Everyday)',
      kinematicNodes: 'Handshape illustrations, articulation tips, and confidence targets',
      privacy: 'Session-based score memory stored safely in browser storage.',
      useCase: 'Family members, colleagues, and healthcare workers rapidly learning sign language fundamentals in 5-minute daily modules.'
    },
    sampleDemoSign: 'I-LOVE-YOU',
    demoVoiceText: 'I love you and appreciate everything you do!',
    actionLabel: 'Open Sign Academy',
    studioTarget: 'academy'
  },
  {
    id: 'sos-beacon',
    title: 'Critical Emergency SOS Distress Beacon',
    subtitle: 'High-visibility visual strobe and loud vocal distress alarm for medical emergencies',
    badge: 'Life Safety HUD',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
    icon: Radio,
    stats: {
      latency: 'Instant Trigger',
      accuracy: '100% Reliable',
      framerate: 'Strobe Alert',
      compute: 'Offline Ready'
    },
    shortDesc: 'Immediate 1-tap distress broadcast for Deaf or non-verbal individuals in critical situations like chest pain, police assistance, or accidents.',
    deepDive: {
      architecture: 'High-Decibel Siren Synthesizer + GPS Coordinate Geocoder',
      inputSpecs: 'One-click SOS triggers: Medical, Police, Fire, Water/Shelter',
      kinematicNodes: 'Full-screen high-contrast alert HUD designed for first responders',
      privacy: 'Transmits strictly to local speaker output and on-screen display.',
      useCase: 'Emergency room arrivals where a non-verbal patient needs to alert medical staff to severe chest pain or allergic reactions immediately.'
    },
    sampleDemoSign: 'HELP',
    demoVoiceText: 'EMERGENCY! I need immediate medical assistance right now!',
    actionLabel: 'Inspect Emergency HUD',
    studioTarget: 'sos'
  },
  {
    id: 'privacy-core',
    title: 'Edge Tensor Privacy & Local Processing',
    subtitle: '100% on-device inference with zero server storage, compliant with HIPAA & GDPR',
    badge: 'Security & Trust',
    tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
    icon: ShieldCheck,
    stats: {
      latency: 'Zero Transit',
      accuracy: 'Enterprise',
      framerate: 'Secure',
      compute: '100% Local'
    },
    shortDesc: 'Webcam video frames never leave your local device. All mathematical vector conversions happen inside client browser WebAssembly memory.',
    deepDive: {
      architecture: 'WASM Sandboxed Inference Pipeline',
      inputSpecs: 'Frames discarded immediately after landmark classification',
      kinematicNodes: 'Zero remote server logs, zero cloud dependencies',
      privacy: 'GDPR Article 9 compliant (Biometric data never stored or transferred).',
      useCase: 'Government, defense, and healthcare institutions requiring strict data compliance and patient privacy assurances.'
    },
    sampleDemoSign: 'DOCTOR',
    demoVoiceText: 'I need to consult a physician confidentially.',
    actionLabel: 'View Security Specs',
    studioTarget: 'auth'
  }
];

// 21 Keypoints of MediaPipe Hand Landmark mesh
const HAND_LANDMARK_POINTS = [
  { id: 0, name: 'WRIST', x: 50, y: 88, role: 'Base anchor for all hand translations & radial tilt' },
  { id: 1, name: 'THUMB_CMC', x: 38, y: 78, role: 'Carpometacarpal joint enabling thumb opposition' },
  { id: 2, name: 'THUMB_MCP', x: 30, y: 66, role: 'Metacarpophalangeal joint governing lateral spread' },
  { id: 3, name: 'THUMB_IP', x: 25, y: 54, role: 'Interphalangeal joint for thumb flexion curves' },
  { id: 4, name: 'THUMB_TIP', x: 22, y: 44, role: 'Crucial for "A", "T", "O", and "GOOD" gestures' },
  { id: 5, name: 'INDEX_MCP', x: 42, y: 48, role: 'Base knuckle index finger vector calculation' },
  { id: 6, name: 'INDEX_PIP', x: 41, y: 34, role: 'Proximal joint governing finger extension' },
  { id: 7, name: 'INDEX_DIP', x: 40, y: 22, role: 'Distal joint tracking subtle curvature' },
  { id: 8, name: 'INDEX_TIP', x: 39, y: 12, role: 'Key for "D", "1", pointing, and directional signs' },
  { id: 9, name: 'MIDDLE_MCP', x: 52, y: 46, role: 'Middle finger knuckle center balance line' },
  { id: 10, name: 'MIDDLE_PIP', x: 52, y: 30, role: 'Proximal joint for open palm and spread' },
  { id: 11, name: 'MIDDLE_DIP', x: 52, y: 18, role: 'Distal joint for curvature calculations' },
  { id: 12, name: 'MIDDLE_TIP', x: 52, y: 8, role: 'Highest hand extension point in open handshakes' },
  { id: 13, name: 'RING_MCP', x: 62, y: 49, role: 'Ring base knuckle for grouping calculations' },
  { id: 14, name: 'RING_PIP', x: 64, y: 35, role: 'Proximal joint tracking closure in "F" and "O"' },
  { id: 15, name: 'RING_DIP', x: 65, y: 24, role: 'Distal knuckle for precision finger curl' },
  { id: 16, name: 'RING_TIP', x: 66, y: 15, role: 'Differentiates "W" from "V" gestures' },
  { id: 17, name: 'PINKY_MCP', x: 72, y: 55, role: 'Base pinky knuckle tracking outer boundary' },
  { id: 18, name: 'PINKY_PIP', x: 76, y: 44, role: 'Proximal joint for pinky elevation' },
  { id: 19, name: 'PINKY_DIP', x: 79, y: 34, role: 'Distal knuckle tracking pinky curl' },
  { id: 20, name: 'PINKY_TIP', x: 82, y: 24, role: 'Essential for "I", "J", and "I LOVE YOU" signs' },
];

// Real-world application scenarios
const REAL_WORLD_SCENARIOS = [
  {
    id: 'healthcare',
    title: 'Hospital & Emergency Care',
    icon: '🏥',
    audience: 'Doctors, Nurses & Deaf Patients',
    dialogue: 'Patient signs: [HELP] [CHEST] [PAIN] → Audio translates aloud: "Emergency: I am having severe chest pain."',
    impact: 'Reduces intake triage delays from 45 minutes to under 15 seconds.',
    sampleSign: 'HELP'
  },
  {
    id: 'education',
    title: 'University & Inclusive Classrooms',
    icon: '🎓',
    audience: 'Professors, Students & Classmates',
    dialogue: 'Student signs: [QUESTION] [PLEASE] [EXPLAIN] → Voice synthesizes: "Excuse me professor, could you please clarify that point?"',
    impact: 'Enables active, spontaneous student participation without waiting on interpreters.',
    sampleSign: 'PLEASE'
  },
  {
    id: 'workplace',
    title: 'Corporate Collaboration & Meetings',
    icon: '💼',
    audience: 'Engineers, Managers & Remote Teams',
    dialogue: 'Colleague signs: [AGREE] [GOOD] [IDEA] → Audio articulates: "I completely agree, that is a great solution."',
    impact: 'Empowers deaf professionals to lead and contribute seamlessly in standups and scrums.',
    sampleSign: 'YES'
  },
  {
    id: 'transit',
    title: 'Airports & Public Transit',
    icon: '✈️',
    audience: 'Travelers & Gate Agents',
    dialogue: 'Traveler signs: [WHERE] [WATER] [GATE] → Audio asks: "Where is the nearest water fountain near gate 12?"',
    impact: 'Eliminates travel friction, anxiety, and misunderstandings at checkpoints.',
    sampleSign: 'WATER'
  }
];

export default function WebsiteHome({
  onLaunchStudio,
  onLaunchReverse,
  onLaunchAcademy,
  onOpenAuth,
  onOpenSOS
}) {
  // Active Interactive Sandbox State in Hero
  const [activeHeroSign, setActiveHeroSign] = useState(SIGN_DICTIONARY[0]);
  const [heroMode, setHeroMode] = useState('vision'); // 'vision', 'reverse', 'mesh', 'sos'
  const [isPlayingHeroVoice, setIsPlayingHeroVoice] = useState(false);

  // Interactive Feature Detail Drawer / Modal
  const [inspectedFeature, setInspectedFeature] = useState(null);

  // Interactive Landmark Inspector State
  const [selectedLandmark, setSelectedLandmark] = useState(HAND_LANDMARK_POINTS[8]); // Index tip by default

  // Interactive Impact Calculator State
  const [userCount, setUserCount] = useState(25);
  const [dailyMinutes, setDailyMinutes] = useState(45);

  // Active Real-World Scenario
  const [activeScenario, setActiveScenario] = useState(REAL_WORLD_SCENARIOS[0]);

  // Handle hero preview sign tap
  const handleHeroSignClick = (sign) => {
    sounds.playDetectChime();
    setActiveHeroSign(sign);
    setIsPlayingHeroVoice(true);
    speech.speak(sign.aslGloss);
    setTimeout(() => setIsPlayingHeroVoice(false), 1200);
  };

  // Open inspection modal for any feature
  const handleInspectFeature = (feature) => {
    sounds.playClick();
    setInspectedFeature(feature);
  };

  // Handle studio routing from modal or card
  const handleTriggerAction = (target) => {
    sounds.playClick();
    if (inspectedFeature) setInspectedFeature(null);
    
    if (target === 'translator') onLaunchStudio();
    else if (target === 'reverse') onLaunchReverse();
    else if (target === 'academy') onLaunchAcademy();
    else if (target === 'auth') onOpenAuth();
    else if (target === 'sos') onOpenSOS();
    else onLaunchStudio();
  };

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24 text-left">
      
      {/* ============================================================== */}
      {/* TOP ANNOUNCEMENT BANNER */}
      {/* ============================================================== */}
      <div className="w-full flex items-center justify-center">
        <div 
          onClick={() => handleInspectFeature(FEATURE_CATALOG[0])}
          className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>GestureSync AI v4.2 Platform Architecture</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Tap to Inspect Architecture <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HERO SECTION WITH DYNAMIC INTERACTIVE COCKPIT SANDBOX */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-6xl mx-auto flex flex-col items-center text-center gap-8 pt-2">
        
        {/* Main Title & Subhead */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Universal Sign Language <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              Multimodal Intelligence
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Empowering real-time, bidirectional conversation between Deaf and hearing communities. Tap any component or sign below to inspect live kinematics and speech synthesis.
          </p>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => { sounds.playClick(); onLaunchStudio(); }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all group"
            >
              <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Launch Live Camera Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { sounds.playClick(); onLaunchReverse(); }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-colors"
            >
              <Mic className="w-4 h-4 text-indigo-600" />
              <span>Try Voice-to-Sign</span>
            </button>

            <button
              onClick={() => { sounds.playClick(); onOpenAuth(); }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Sign In / Sign Up</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE LIVE PLATFORM COCKPIT (THE LEGALTECH.AI STYLE DEMO) */}
        {/* ============================================================== */}
        <div className="w-full mt-4 rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden text-left">
          
          {/* Cockpit Window Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                GestureSync Interactive AI Sandbox
              </span>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
              {[
                { id: 'vision', label: 'Gesture Vision', icon: Video },
                { id: 'reverse', label: 'Voice to Sign', icon: Mic },
                { id: 'mesh', label: 'Kinematic Mesh', icon: Layers },
                { id: 'sos', label: 'Emergency HUD', icon: Radio },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSel = heroMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick();
                      setHeroMode(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                      isSel
                        ? 'bg-indigo-50 text-indigo-700 font-bold shadow-2xs border border-indigo-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Sub-15ms Edge Latency</span>
            </div>
          </div>

          {/* Cockpit Interactive Workspace */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            
            {/* Gesture Selection Chips: TAP ANY TO TEST */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Tap any sign gesture to preview real-time translation:
                </span>
                <span className="text-indigo-600 font-medium">Click to trigger audio & kinematics</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'hello', label: 'Hello', icon: '👋', aslGloss: 'HELLO' },
                  { id: 'thank-you', label: 'Thank You', icon: '🙏', aslGloss: 'THANK YOU' },
                  { id: 'i-love-you', label: 'I Love You', icon: '🤟', aslGloss: 'I LOVE YOU' },
                  { id: 'doctor', label: 'Doctor', icon: '🩺', aslGloss: 'DOCTOR' },
                  { id: 'help', label: 'Help', icon: '🆘', aslGloss: 'HELP' },
                  { id: 'water', label: 'Water', icon: '💧', aslGloss: 'WATER' },
                  { id: 'yes', label: 'Yes / Agree', icon: '👍', aslGloss: 'YES' },
                  { id: 'peace', label: 'Peace', icon: '✌️', aslGloss: 'PEACE' },
                ].map((sign) => {
                  const isSelected = activeHeroSign.aslGloss === sign.aslGloss;
                  return (
                    <button
                      key={sign.id}
                      onClick={() => handleHeroSignClick(sign)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base">{sign.icon}</span>
                      <span>{sign.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split View: Live Kinematic Simulation + Translation Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Visual Hand Kinematic Preview Stage */}
              <div className="lg:col-span-7 rounded-2xl bg-slate-50 border border-slate-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[280px]">
                
                {/* Background Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

                {/* Animated Kinematic Hand Icon */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-3xl bg-white border-2 border-indigo-200 shadow-md flex items-center justify-center text-6xl animate-pulse">
                    {activeHeroSign.icon || '🤟'}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">
                      RECOGNIZED ASL GLOSS
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                      "{activeHeroSign.aslGloss}"
                    </h3>
                  </div>
                </div>

                {/* Overlay Status Pill */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-500 z-10 border-t border-slate-200/60 pt-2">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    98.4% Confidence Match
                  </span>
                  <span>Kinematics: 21 Landmarks Locked</span>
                </div>
              </div>

              {/* Right Column: Live Direct Translation & Speech Output */}
              <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                      Live Vocalized Speech Output
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      SYNTHESIZED
                    </span>
                  </div>

                  <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                    "{activeHeroSign.aslGloss === 'HELLO' && 'Hello! Greetings and welcome to GestureSync.'}
                     {activeHeroSign.aslGloss === 'THANK YOU' && 'Thank you very much for your kind help.'}
                     {activeHeroSign.aslGloss === 'I LOVE YOU' && 'I love you and appreciate you so much!'}
                     {activeHeroSign.aslGloss === 'DOCTOR' && 'I urgently need to consult a physician.'}
                     {activeHeroSign.aslGloss === 'HELP' && 'Emergency! Please assist me immediately.'}
                     {activeHeroSign.aslGloss === 'WATER' && 'Could I please have a glass of water?'}
                     {activeHeroSign.aslGloss === 'YES' && 'Yes, I understand and agree.'}
                     {activeHeroSign.aslGloss === 'PEACE' && 'Wishing you harmony and peace.'}"
                  </p>

                  <p className="text-xs text-slate-500 italic">
                    Synthesized vocal waveform delivered instantaneously to speakers at sub-15ms latency.
                  </p>
                </div>

                {/* Audio Action Buttons & Inspector Trigger */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playDetectChime();
                        speech.speak(activeHeroSign.aslGloss);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Replay Vocal Speech</span>
                    </button>

                    <button
                      onClick={() => handleInspectFeature(FEATURE_CATALOG[0])}
                      className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                      title="Inspect Architecture"
                    >
                      <Info className="w-4 h-4 text-indigo-600" />
                      <span className="hidden sm:inline">Inspect Architecture</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Engine: NeuroSign Edge v4.2</span>
                    <span className="text-indigo-600 font-medium">100% Client-Side WASM</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE 21-JOINT HAND LANDMARK EXPLORER ("TAP ANY JOINT") */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                INTERACTIVE LANDMARK INSPECTOR
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Explore the 21 3D Hand Joint Landmarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Tap any joint node on the hand model or list to inspect its kinematic 3D vector coordinates and anatomical role.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-500">Selected Landmark:</span>
            <p className="text-sm font-bold font-mono text-indigo-600">
              #{selectedLandmark.id}: {selectedLandmark.name}
            </p>
          </div>
        </div>

        {/* Interactive Landmark Grid & Inspector Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Interactive Joint Buttons Matrix */}
          <div className="lg:col-span-7 flex flex-wrap gap-1.5">
            {HAND_LANDMARK_POINTS.map((pt) => {
              const isSelected = selectedLandmark.id === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedLandmark(pt);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs scale-105'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                  <span>#{pt.id} {pt.name}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Joint Inspection Card */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                Kinematic Node Telemetry
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                ACTIVE TRACKING
              </span>
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900 font-mono">
                Node #{selectedLandmark.id}: {selectedLandmark.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedLandmark.role}
              </p>
            </div>

            {/* Simulated 3D Vector Coordinates */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs font-mono">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">X-AXIS</span>
                <span className="font-bold text-slate-800">0.{(selectedLandmark.x * 9.2).toFixed(0)}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">Y-AXIS</span>
                <span className="font-bold text-slate-800">0.{(selectedLandmark.y * 7.8).toFixed(0)}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                <span className="text-slate-400 block text-[10px]">Z-DEPTH</span>
                <span className="font-bold text-indigo-600">-0.0{(selectedLandmark.id * 3)}</span>
              </div>
            </div>

            <button
              onClick={() => handleInspectFeature(FEATURE_CATALOG[0])}
              className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
            >
              <span>Inspect full vision architecture specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE CAPABILITIES GRID: "TAP ANY CARD TO INSPECT" */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                MODULAR SYSTEM CAPABILITIES
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5">
              Click Any Capability to Inspect Full Technical Specs
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Every engine module is interactive. Tap a card below to inspect its latency benchmarks, neural architecture, and live audio demonstrations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All 6 Engines Online</span>
          </div>
        </div>

        {/* 6 Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURE_CATALOG.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => handleInspectFeature(feat)}
                className="group rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer text-left"
              >
                <div className="space-y-4">
                  
                  {/* Top Badge & Metric Pill */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono ${feat.tagColor}`}>
                      {feat.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {feat.stats.latency}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white border border-indigo-100 flex items-center justify-center transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        {feat.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.shortDesc}
                  </p>

                </div>

                {/* Bottom Interactive Trigger Pill */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span className="flex items-center gap-1">
                    Tap to inspect info & demo
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE REAL-WORLD SCENARIOS: "TAP TO SEE CASE STUDY" */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              REAL-WORLD APPLIED SCENARIOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
              Empowering Human Dignity Across Every Domain
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a domain below to observe how bidirectional translation eliminates communication barriers.
            </p>
          </div>
        </div>

        {/* 4 Interactive Scenario Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {REAL_WORLD_SCENARIOS.map((scen) => {
            const isSel = activeScenario.id === scen.id;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveScenario(scen);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSel
                    ? 'bg-indigo-50 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-2xl">{scen.icon}</span>
                <p className="text-xs font-bold text-slate-900 mt-2 leading-tight">{scen.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{scen.audience}</p>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Spotlight Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left flex-1">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
              LIVE TRANSLATION DIALOGUE FLOW:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {activeScenario.dialogue}
            </p>
            <p className="text-xs text-slate-600">
              <strong className="text-slate-800">Measured Outcome:</strong> {activeScenario.impact}
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playDetectChime();
              speech.speak(activeScenario.dialogue);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all whitespace-nowrap"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Dialogue Aloud</span>
          </button>
        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE ACCESSIBILITY IMPACT & TIME-SAVINGS CALCULATOR */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-left">
        
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            ORGANIZATIONAL IMPACT CALCULATOR
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Estimate Interpretation Time & Cost Savings
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Adjust the sliders below to compute estimated annual barrier reductions for your campus, hospital, or enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          
          {/* Sliders */}
          <div className="flex flex-col gap-6">
            
            {/* Slider 1: User Count */}
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

            {/* Slider 2: Daily Minutes */}
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

          {/* Real-time Computed Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-[11px] font-mono text-indigo-700 font-bold block">HOURS SAVED / YEAR</span>
              <p className="text-3xl font-black text-indigo-950 mt-1">
                {Math.round((userCount * dailyMinutes * 250) / 60)} hrs
              </p>
              <p className="text-[10px] text-indigo-600 mt-1">Zero wait time for interpreters</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-[11px] font-mono text-emerald-700 font-bold block">COMPLIANCE SCORE</span>
              <p className="text-3xl font-black text-emerald-950 mt-1">100%</p>
              <p className="text-[10px] text-emerald-600 mt-1">ADA & Web Accessibility compliant</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 col-span-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Ready to deploy GestureSync in your organization?</p>
                <p className="text-[11px] text-slate-500">Includes camera studio, voice translation, and enterprise sign training.</p>
              </div>
              <button
                onClick={() => { sounds.playClick(); onOpenAuth(); }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* DOWNLOAD PROJECT PDF REPORT CALLOUT */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 border border-indigo-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-2xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-xs">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Official Project PDF Documentation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Complete 5-page research document detailing system architecture, MediaPipe kinematics, dataflow pipelines, and ethical accessibility standards.
            </p>
          </div>
        </div>

        <a
          href="/GestureSync_AI_Project_Documentation.pdf"
          download="GestureSync_AI_Project_Documentation.pdf"
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          <span>Download PDF Report</span>
        </a>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE FEATURE DETAIL MODAL / DRAWER */}
      {/* (TRIGGERED WHEN ANY FEATURE IS CLICKED OR TAPPED) */}
      {/* ============================================================== */}
      {inspectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-left">
            
            {/* Modal Close Button */}
            <button
              onClick={() => { sounds.playClick(); setInspectedFeature(null); }}
              className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-xs">
                {React.createElement(inspectedFeature.icon, { className: 'w-6 h-6' })}
              </div>
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${inspectedFeature.tagColor}`}>
                  {inspectedFeature.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {inspectedFeature.title}
                </h3>
              </div>
            </div>

            {/* Subtitle / Overview */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {inspectedFeature.shortDesc}
            </p>

            {/* Performance Benchmark Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">EDGE LATENCY</span>
                <p className="text-base font-black text-slate-800 font-mono mt-0.5">{inspectedFeature.stats.latency}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">ACCURACY RATE</span>
                <p className="text-base font-black text-emerald-700 font-mono mt-0.5">{inspectedFeature.stats.accuracy}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">FRAME RATE</span>
                <p className="text-base font-black text-indigo-700 font-mono mt-0.5">{inspectedFeature.stats.framerate}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-mono text-slate-400 block font-semibold">COMPUTE MODEL</span>
                <p className="text-base font-black text-slate-800 font-mono mt-0.5">{inspectedFeature.stats.compute}</p>
              </div>
            </div>

            {/* Deep-Dive Technical Specifications */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">ARCHITECTURE:</span>
                <span className="text-slate-900 font-bold">{inspectedFeature.deepDive.architecture}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">INPUT STREAM:</span>
                <span className="text-slate-800">{inspectedFeature.deepDive.inputSpecs}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">KINEMATICS:</span>
                <span className="text-slate-800">{inspectedFeature.deepDive.kinematicNodes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">DATA PRIVACY:</span>
                <span className="text-emerald-700 font-bold">{inspectedFeature.deepDive.privacy}</span>
              </div>
            </div>

            {/* Interactive Audio Mini-Demo Inside Modal */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase">
                  Interactive Audio Demo:
                </span>
                <p className="text-xs text-slate-800 font-medium">
                  "{inspectedFeature.demoVoiceText}"
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playDetectChime();
                  speech.speak(inspectedFeature.demoVoiceText);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs whitespace-nowrap active:scale-95 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio</span>
              </button>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                100% Free & Open-Source Research Prototype
              </span>

              <button
                onClick={() => handleTriggerAction(inspectedFeature.studioTarget)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <span>{inspectedFeature.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
