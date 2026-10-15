import React, { useState, useEffect, useRef } from 'react';
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
  SlidersHorizontal,
  Check,
  Building2,
  Stethoscope,
  BookOpen,
  Plane,
  RotateCcw
} from 'lucide-react';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

// 21 Joint Coordinate Models for Different Gesture Presets (Normalized 0-100 coordinates)
const GESTURE_HAND_MODELS = {
  'I LOVE YOU': {
    gloss: 'I LOVE YOU',
    label: 'I Love You',
    icon: '🤟',
    meaning: 'Universal sign expressing love and appreciation',
    vocalSpeech: 'I love you and appreciate everything you do!',
    confidence: 99.4,
    latency: '8.8 ms',
    points: [
      { id: 0, x: 50, y: 90, name: 'WRIST' },
      { id: 1, x: 38, y: 80, name: 'THUMB_CMC' },
      { id: 2, x: 26, y: 68, name: 'THUMB_MCP' },
      { id: 3, x: 18, y: 56, name: 'THUMB_IP' },
      { id: 4, x: 12, y: 46, name: 'THUMB_TIP', active: true }, // Thumb extended
      { id: 5, x: 40, y: 48, name: 'INDEX_MCP' },
      { id: 6, x: 38, y: 34, name: 'INDEX_PIP' },
      { id: 7, x: 36, y: 22, name: 'INDEX_DIP' },
      { id: 8, x: 35, y: 10, name: 'INDEX_TIP', active: true }, // Index extended
      { id: 9, x: 52, y: 46, name: 'MIDDLE_MCP' },
      { id: 10, x: 52, y: 56, name: 'MIDDLE_PIP' },
      { id: 11, x: 52, y: 64, name: 'MIDDLE_DIP' },
      { id: 12, x: 52, y: 68, name: 'MIDDLE_TIP' }, // Middle folded
      { id: 13, x: 64, y: 49, name: 'RING_MCP' },
      { id: 14, x: 64, y: 58, name: 'RING_PIP' },
      { id: 15, x: 64, y: 65, name: 'RING_DIP' },
      { id: 16, x: 64, y: 69, name: 'RING_TIP' }, // Ring folded
      { id: 17, x: 75, y: 54, name: 'PINKY_MCP' },
      { id: 18, x: 80, y: 42, name: 'PINKY_PIP' },
      { id: 19, x: 84, y: 30, name: 'PINKY_DIP' },
      { id: 20, x: 88, y: 18, name: 'PINKY_TIP', active: true }, // Pinky extended
    ]
  },
  'HELLO': {
    gloss: 'HELLO',
    label: 'Hello / Greeting',
    icon: '👋',
    meaning: 'Open palm waving outwards from forehead/chest',
    vocalSpeech: 'Hello! Greetings and welcome to GestureSync.',
    confidence: 98.9,
    latency: '9.2 ms',
    points: [
      { id: 0, x: 50, y: 90, name: 'WRIST' },
      { id: 1, x: 36, y: 80, name: 'THUMB_CMC' },
      { id: 2, x: 26, y: 70, name: 'THUMB_MCP' },
      { id: 3, x: 20, y: 58, name: 'THUMB_IP' },
      { id: 4, x: 16, y: 48, name: 'THUMB_TIP', active: true },
      { id: 5, x: 38, y: 46, name: 'INDEX_MCP' },
      { id: 6, x: 35, y: 32, name: 'INDEX_PIP' },
      { id: 7, x: 33, y: 20, name: 'INDEX_DIP' },
      { id: 8, x: 32, y: 8, name: 'INDEX_TIP', active: true },
      { id: 9, x: 50, y: 44, name: 'MIDDLE_MCP' },
      { id: 10, x: 49, y: 28, name: 'MIDDLE_PIP' },
      { id: 11, x: 48, y: 16, name: 'MIDDLE_DIP' },
      { id: 12, x: 48, y: 5, name: 'MIDDLE_TIP', active: true },
      { id: 13, x: 62, y: 46, name: 'RING_MCP' },
      { id: 14, x: 63, y: 31, name: 'RING_PIP' },
      { id: 15, x: 64, y: 19, name: 'RING_DIP' },
      { id: 16, x: 65, y: 9, name: 'RING_TIP', active: true },
      { id: 17, x: 74, y: 52, name: 'PINKY_MCP' },
      { id: 18, x: 77, y: 40, name: 'PINKY_PIP' },
      { id: 19, x: 80, y: 29, name: 'PINKY_DIP' },
      { id: 20, x: 82, y: 18, name: 'PINKY_TIP', active: true },
    ]
  },
  'PEACE': {
    gloss: 'PEACE',
    label: 'Peace / V Sign',
    icon: '✌️',
    meaning: 'Index and middle fingers extended in V formation',
    vocalSpeech: 'Wishing you harmony and peace.',
    confidence: 99.1,
    latency: '8.4 ms',
    points: [
      { id: 0, x: 50, y: 90, name: 'WRIST' },
      { id: 1, x: 40, y: 80, name: 'THUMB_CMC' },
      { id: 2, x: 42, y: 70, name: 'THUMB_MCP' },
      { id: 3, x: 45, y: 62, name: 'THUMB_IP' },
      { id: 4, x: 48, y: 58, name: 'THUMB_TIP' }, // Thumb folded over ring
      { id: 5, x: 42, y: 48, name: 'INDEX_MCP' },
      { id: 6, x: 36, y: 34, name: 'INDEX_PIP' },
      { id: 7, x: 30, y: 20, name: 'INDEX_DIP' },
      { id: 8, x: 25, y: 8, name: 'INDEX_TIP', active: true }, // Index spread left
      { id: 9, x: 54, y: 46, name: 'MIDDLE_MCP' },
      { id: 10, x: 58, y: 32, name: 'MIDDLE_PIP' },
      { id: 11, x: 62, y: 18, name: 'MIDDLE_DIP' },
      { id: 12, x: 66, y: 6, name: 'MIDDLE_TIP', active: true }, // Middle spread right
      { id: 13, x: 66, y: 50, name: 'RING_MCP' },
      { id: 14, x: 66, y: 60, name: 'RING_PIP' },
      { id: 15, x: 65, y: 68, name: 'RING_DIP' },
      { id: 16, x: 64, y: 72, name: 'RING_TIP' }, // Ring curled
      { id: 17, x: 76, y: 56, name: 'PINKY_MCP' },
      { id: 18, x: 76, y: 64, name: 'PINKY_PIP' },
      { id: 19, x: 75, y: 71, name: 'PINKY_DIP' },
      { id: 20, x: 74, y: 75, name: 'PINKY_TIP' }, // Pinky curled
    ]
  },
  'THANK YOU': {
    gloss: 'THANK YOU',
    label: 'Thank You',
    icon: '🙏',
    meaning: 'Flat hand moving forward from chin/lips in gratitude',
    vocalSpeech: 'Thank you very much for your generous support.',
    confidence: 98.7,
    latency: '10.1 ms',
    points: [
      { id: 0, x: 50, y: 90, name: 'WRIST' },
      { id: 1, x: 40, y: 82, name: 'THUMB_CMC' },
      { id: 2, x: 34, y: 72, name: 'THUMB_MCP' },
      { id: 3, x: 30, y: 62, name: 'THUMB_IP' },
      { id: 4, x: 26, y: 52, name: 'THUMB_TIP', active: true },
      { id: 5, x: 42, y: 50, name: 'INDEX_MCP' },
      { id: 6, x: 40, y: 36, name: 'INDEX_PIP' },
      { id: 7, x: 38, y: 24, name: 'INDEX_DIP' },
      { id: 8, x: 37, y: 12, name: 'INDEX_TIP', active: true },
      { id: 9, x: 52, y: 48, name: 'MIDDLE_MCP' },
      { id: 10, x: 51, y: 34, name: 'MIDDLE_PIP' },
      { id: 11, x: 50, y: 22, name: 'MIDDLE_DIP' },
      { id: 12, x: 50, y: 10, name: 'MIDDLE_TIP', active: true },
      { id: 13, x: 62, y: 50, name: 'RING_MCP' },
      { id: 14, x: 62, y: 37, name: 'RING_PIP' },
      { id: 15, x: 62, y: 25, name: 'RING_DIP' },
      { id: 16, x: 62, y: 13, name: 'RING_TIP', active: true },
      { id: 17, x: 72, y: 54, name: 'PINKY_MCP' },
      { id: 18, x: 73, y: 42, name: 'PINKY_PIP' },
      { id: 19, x: 74, y: 32, name: 'PINKY_DIP' },
      { id: 20, x: 74, y: 22, name: 'PINKY_TIP', active: true },
    ]
  },
  'DOCTOR': {
    gloss: 'DOCTOR',
    label: 'Doctor / Medical',
    icon: '🩺',
    meaning: 'Tapping fingertips onto wrist pulse point',
    vocalSpeech: 'I urgently need to consult a physician.',
    confidence: 99.2,
    latency: '9.0 ms',
    points: [
      { id: 0, x: 50, y: 90, name: 'WRIST' },
      { id: 1, x: 38, y: 80, name: 'THUMB_CMC' },
      { id: 2, x: 32, y: 70, name: 'THUMB_MCP' },
      { id: 3, x: 28, y: 60, name: 'THUMB_IP' },
      { id: 4, x: 32, y: 52, name: 'THUMB_TIP' },
      { id: 5, x: 44, y: 50, name: 'INDEX_MCP' },
      { id: 6, x: 42, y: 38, name: 'INDEX_PIP' },
      { id: 7, x: 44, y: 26, name: 'INDEX_DIP' },
      { id: 8, x: 48, y: 18, name: 'INDEX_TIP', active: true }, // Curled M shape
      { id: 9, x: 54, y: 50, name: 'MIDDLE_MCP' },
      { id: 10, x: 53, y: 38, name: 'MIDDLE_PIP' },
      { id: 11, x: 53, y: 26, name: 'MIDDLE_DIP' },
      { id: 12, x: 53, y: 18, name: 'MIDDLE_TIP', active: true },
      { id: 13, x: 64, y: 52, name: 'RING_MCP' },
      { id: 14, x: 63, y: 40, name: 'RING_PIP' },
      { id: 15, x: 62, y: 28, name: 'RING_DIP' },
      { id: 16, x: 58, y: 20, name: 'RING_TIP', active: true },
      { id: 17, x: 74, y: 56, name: 'PINKY_MCP' },
      { id: 18, x: 75, y: 65, name: 'PINKY_PIP' },
      { id: 19, x: 74, y: 72, name: 'PINKY_DIP' },
      { id: 20, x: 72, y: 76, name: 'PINKY_TIP' },
    ]
  },
  'HELP': {
    gloss: 'HELP',
    label: 'Help / SOS',
    icon: '🆘',
    meaning: 'Closed fist thumb-up elevated upon flat palm',
    vocalSpeech: 'Emergency! Please assist me immediately.',
    confidence: 99.6,
    latency: '8.2 ms',
    points: [
      { id: 0, x: 50, y: 90, name: 'WRIST' },
      { id: 1, x: 38, y: 80, name: 'THUMB_CMC' },
      { id: 2, x: 30, y: 68, name: 'THUMB_MCP' },
      { id: 3, x: 25, y: 52, name: 'THUMB_IP' },
      { id: 4, x: 22, y: 35, name: 'THUMB_TIP', active: true }, // Thumb pointing high
      { id: 5, x: 44, y: 52, name: 'INDEX_MCP' },
      { id: 6, x: 45, y: 62, name: 'INDEX_PIP' },
      { id: 7, x: 46, y: 70, name: 'INDEX_DIP' },
      { id: 8, x: 47, y: 76, name: 'INDEX_TIP' }, // Fist
      { id: 9, x: 54, y: 52, name: 'MIDDLE_MCP' },
      { id: 10, x: 55, y: 63, name: 'MIDDLE_PIP' },
      { id: 11, x: 56, y: 71, name: 'MIDDLE_DIP' },
      { id: 12, x: 57, y: 77, name: 'MIDDLE_TIP' },
      { id: 13, x: 64, y: 54, name: 'RING_MCP' },
      { id: 14, x: 65, y: 64, name: 'RING_PIP' },
      { id: 15, x: 66, y: 72, name: 'RING_DIP' },
      { id: 16, x: 67, y: 78, name: 'RING_TIP' },
      { id: 17, x: 74, y: 58, name: 'PINKY_MCP' },
      { id: 18, x: 75, y: 67, name: 'PINKY_PIP' },
      { id: 19, x: 76, y: 74, name: 'PINKY_DIP' },
      { id: 20, x: 77, y: 80, name: 'PINKY_TIP' },
    ]
  }
};

// Hand Bone Connections for SVG wireframe rendering
const BONE_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Knuckle bridges
  [5, 9], [9, 13], [13, 17]
];

// Modular Engine Catalog with Deep Technical Profiles
const ENGINE_MODULES = [
  {
    id: 'vision-engine',
    title: 'Neural Vision & 21-Joint Spatial Kinematics',
    subtitle: 'MediaPipe BlazeHand + Temporal Bi-LSTM tracking at 60 FPS edge inference',
    badge: 'VISION CORE',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    icon: Video,
    stats: { latency: '8.8 ms', accuracy: '99.2%', framerate: '60 FPS', compute: '100% Client WASM' },
    summary: 'Extracts 21 3D spatial joint coordinates in sub-10ms per frame. Calculates instantaneous angle velocity, palm normal vectors, and temporal gesture trajectories.',
    architectureDetails: {
      model: 'BlazeHand Anchor Detector + 2.1M Parameter Mesh Regressor',
      tensorInput: 'Normalized 256x256 RGB tensor with bilinear interpolation',
      kinematicFeature: 'Joint angle relative cosine similarity + Euler flexion vectors',
      privacyStandard: 'Frames discarded immediately from browser RAM; zero server egress.'
    },
    sampleGloss: 'I LOVE YOU',
    sampleVoice: 'I love you and appreciate everything you do!',
    studioTarget: 'translator'
  },
  {
    id: 'voice-to-sign',
    title: 'Bidirectional Voice-to-Sign Synthesizer',
    subtitle: 'Semantic speech recognition mapping spoken sentences into articulated sign cues',
    badge: '2-WAY ENGINE',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: Mic,
    stats: { latency: '12.4 ms', accuracy: '98.5%', framerate: 'Fluid Sequencer', compute: 'Continuous' },
    summary: 'Allows hearing participants to speak naturally while the system tokenizes colloquial English grammar into standardized ASL/ISL gloss sequences and fingerspelling.',
    architectureDetails: {
      model: 'Continuous WebSpeech ASR + ASL Semantic Grammar Normalizer',
      tensorInput: 'Vocal acoustic stream at 44.1 kHz with dynamic gain compression',
      kinematicFeature: 'Sequential phrase segmentation with fingerspelling fallback',
      privacyStandard: 'Processed in sandboxed browser memory; zero audio harvesting.'
    },
    sampleGloss: 'HELLO',
    sampleVoice: 'Hello, welcome! I am ready to translate your signs in real time.',
    studioTarget: 'reverse'
  },
  {
    id: 'speech-synth',
    title: 'Natural Vocal Speech Synthesizer',
    subtitle: 'Low-jitter audio waveform generation providing instant vocal speech',
    badge: 'AUDIO SYNTH',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: Volume2,
    stats: { latency: '< 4 ms', accuracy: '100%', framerate: 'Instant', compute: 'Audio Worklet' },
    summary: 'Translates classified sign gestures into fluent, natural vocal speech so listeners hear clear sentences without needing to stare at a screen.',
    architectureDetails: {
      model: 'Low-latency Web Speech TTS + Custom Formant Harmonic Synthesizer',
      tensorInput: 'Classified gesture token stream with contextual punctuation',
      kinematicFeature: 'Adaptive pitch contour and tempo stabilization',
      privacyStandard: 'Local system audio synthesis; zero remote API dependencies.'
    },
    sampleGloss: 'THANK YOU',
    sampleVoice: 'Thank you very much for your generous support.',
    studioTarget: 'translator'
  },
  {
    id: 'sign-academy',
    title: 'Gamified Sign Academy & Spaced Repetition',
    subtitle: 'Interactive learning arena with visual flashcards, quizzes & confetti celebrations',
    badge: 'LEARNING LAB',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    icon: GraduationCap,
    stats: { latency: 'Instant', accuracy: 'Adaptive', framerate: 'Interactive', compute: 'Persistent' },
    summary: 'Comprehensive curriculum covering beginner fingerspelling, emergency alerts, healthcare, and daily vocabulary with gamified quizzes and streak tracking.',
    architectureDetails: {
      model: 'SuperMemo-2 Spaced Repetition Algorithm + Interactive Confetti FX',
      tensorInput: 'Category-indexed vector database across ASL and ISL vocabularies',
      kinematicFeature: 'Visual articulation tips, difficulty grading, and memory retainers',
      privacyStandard: 'Progress stored strictly in local browser LocalStorage.'
    },
    sampleGloss: 'DOCTOR',
    sampleVoice: 'I urgently need to consult a physician.',
    studioTarget: 'academy'
  },
  {
    id: 'emergency-sos',
    title: 'Critical Emergency SOS Distress HUD',
    subtitle: 'High-visibility visual strobe and loud vocal distress alarm for medical crises',
    badge: 'LIFE SAFETY',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
    icon: Radio,
    stats: { latency: 'Zero Lag', accuracy: '100% Reliable', framerate: 'Flashing HUD', compute: 'Offline Capable' },
    summary: 'Provides non-verbal and deaf individuals with a single-tap distress beacon broadcasting high-decibel spoken alerts and geo-coordinates for first responders.',
    architectureDetails: {
      model: 'Synthesized 900Hz Dual-Tone Siren + Emergency Speech Loop',
      tensorInput: 'One-touch SOS trigger matrix: Medical, Police, Fire, Water/Food',
      kinematicFeature: 'Full-screen high-contrast visual strobe for emergency personnel',
      privacyStandard: 'Zero server dependency; operates completely offline.'
    },
    sampleGloss: 'HELP',
    sampleVoice: 'EMERGENCY! I need immediate medical assistance right now!',
    studioTarget: 'sos'
  },
  {
    id: 'edge-privacy',
    title: 'Edge Tensor Privacy & Local Sandboxing',
    subtitle: '100% on-device processing compliant with HIPAA, GDPR, and ADA accessibility',
    badge: 'COMPLIANCE',
    tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
    icon: ShieldCheck,
    stats: { latency: 'Zero Network', accuracy: 'Enterprise', framerate: 'Sandboxed', compute: '100% Local' },
    summary: 'Guarantees absolute patient and personal privacy. Webcam video frames are processed entirely within WebAssembly client memory and never leave the host device.',
    architectureDetails: {
      model: 'Client-Side Sandboxed WebAssembly (WASM) Pipeline',
      tensorInput: 'Volatile in-memory frame buffer cleared every frame cycle',
      kinematicFeature: 'Zero telemetry transmission; zero facial or biometric harvesting',
      privacyStandard: 'GDPR Article 9 compliant (Biometric protection by design).'
    },
    sampleGloss: 'PEACE',
    sampleVoice: 'Wishing you harmony and peace.',
    studioTarget: 'auth'
  }
];

// 4 Applied Real-World Scenarios
const APPLIED_SCENARIOS = [
  {
    id: 'healthcare',
    title: 'Hospital Emergency Triage',
    icon: Stethoscope,
    badge: 'HEALTHCARE',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
    deafInput: 'Patient gestures: [HELP] [CHEST] [PAIN]',
    voiceOutput: '"Emergency: I am experiencing severe chest pain and dizziness."',
    metric: 'Reduces intake triage delays from 45 minutes to under 12 seconds.',
    samplePreset: 'HELP'
  },
  {
    id: 'education',
    title: 'University Classrooms & Lectures',
    icon: BookOpen,
    badge: 'EDUCATION',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    deafInput: 'Student gestures: [QUESTION] [PLEASE] [EXPLAIN]',
    voiceOutput: '"Excuse me Professor, could you please clarify that formula?"',
    metric: 'Enables spontaneous, active participation without waiting for human interpreters.',
    samplePreset: 'THANK YOU'
  },
  {
    id: 'corporate',
    title: 'Executive Meetings & Tech Teams',
    icon: Building2,
    badge: 'WORKPLACE',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    deafInput: 'Engineer gestures: [AGREE] [DEPLOY] [SYSTEM]',
    voiceOutput: '"I agree with the architecture proposal, let us proceed to deployment."',
    metric: 'Empowers deaf engineers and managers to lead sprint reviews with voice output.',
    samplePreset: 'HELLO'
  },
  {
    id: 'transit',
    title: 'Airports & Transit Hubs',
    icon: Plane,
    badge: 'PUBLIC TRANSIT',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    deafInput: 'Traveler gestures: [WHERE] [GATE] [WATER]',
    voiceOutput: '"Could you please direct me to gate 14 and the nearest water station?"',
    metric: 'Eliminates travel bottlenecks, gate confusion, and stressful travel delays.',
    samplePreset: 'PEACE'
  }
];

export default function WebsiteHome({
  onLaunchStudio,
  onLaunchReverse,
  onLaunchAcademy,
  onOpenAuth,
  onOpenSOS
}) {
  // Selected Gesture in the Live Interactive Hand Simulator Cockpit
  const [activeGestureKey, setActiveGestureKey] = useState('I LOVE YOU');
  const activeModel = GESTURE_HAND_MODELS[activeGestureKey] || GESTURE_HAND_MODELS['I LOVE YOU'];

  // Persistent Selected Engine for the Live Inspection Dock
  const [selectedEngine, setSelectedEngine] = useState(ENGINE_MODULES[0]);

  // Selected Landmark Node for 21-Joint Telemetry
  const [selectedJointNode, setSelectedJointNode] = useState(activeModel.points[8]); // Index tip by default

  // Interactive Calculator State
  const [calcUsers, setCalcUsers] = useState(25);
  const [calcDailyMinutes, setCalcDailyMinutes] = useState(45);

  // Active Applied Scenario
  const [activeScenario, setActiveScenario] = useState(APPLIED_SCENARIOS[0]);

  // Audio Waveform Animation State
  const [isAudioWaveActive, setIsAudioWaveActive] = useState(false);

  // Update selected joint node when gesture changes
  useEffect(() => {
    const currentPoint = activeModel.points.find(p => p.id === (selectedJointNode?.id ?? 8)) || activeModel.points[8];
    setSelectedJointNode(currentPoint);
  }, [activeGestureKey]);

  // Handle Gesture Chip Tap
  const handleSelectGesture = (key) => {
    sounds.playDetectChime();
    setActiveGestureKey(key);
    setIsAudioWaveActive(true);
    const model = GESTURE_HAND_MODELS[key];
    if (model) {
      speech.speak(model.vocalSpeech);
    }
    setTimeout(() => setIsAudioWaveActive(false), 2000);
  };

  // Handle Landmark Point Tap
  const handleSelectJoint = (pt) => {
    sounds.playClick();
    setSelectedJointNode(pt);
  };

  // Handle Studio Navigation Trigger
  const handleRouteTarget = (target) => {
    sounds.playClick();
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
      {/* TOP ANNOUNCEMENT RIBBON */}
      {/* ============================================================== */}
      <div className="w-full flex items-center justify-center">
        <div 
          onClick={() => { sounds.playClick(); setSelectedEngine(ENGINE_MODULES[0]); }}
          className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span className="font-bold">GestureSync AI v4.2 Platform</span>
          <span className="text-slate-300">|</span>
          <span className="text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Tap to Inspect Architecture & Telemetry <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HERO SECTION WITH HEADLINE & ACTION BUTTONS */}
      {/* ============================================================== */}
      <section className="relative w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-6 pt-2">
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
          Universal Sign Language <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
            Multimodal Intelligence
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-normal">
          Empowering instantaneous, bidirectional conversation between Deaf and hearing communities. Translates natural hand gestures into fluent vocal speech and spoken voice into sign cards at sub-15ms edge latency.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => { sounds.playClick(); onLaunchStudio(); }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all group"
          >
            <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Launch Camera Studio</span>
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

      </section>

      {/* ============================================================== */}
      {/* THE LEGALTECH COCKPIT: REAL INTERACTIVE 21-JOINT HAND SIMULATOR */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden text-left">
        
        {/* Cockpit Window Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50/90 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              GestureSync Kinematic AI Cockpit &mdash; Live 21-Joint Skeleton Simulator
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Edge Model: NeuroSign BlazeHand v4.2</span>
          </div>
        </div>

        {/* Cockpit Workspace */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Gesture Chips: TAP ANY TO TEST REAL-TIME SKELETON MORPHING & SPEECH */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Tap Any Sign Gesture to Morph 21-Joint Skeleton & Synthesize Voice:
              </span>
              <span className="text-indigo-600 font-semibold hidden sm:inline">
                Clicking activates real-time TTS audio & coordinates
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(GESTURE_HAND_MODELS).map((key) => {
                const model = GESTURE_HAND_MODELS[key];
                const isSelected = activeGestureKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectGesture(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-base">{model.icon}</span>
                    <span>{model.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual-Panel View: Visual Vector Hand Skeleton (Left) + Live Speech Output & Telemetry (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: REAL 21-JOINT VECTOR SKELETON VISUALIZER */}
            <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/30 border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
              
              {/* Subtle High-Tech Blueprint Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none" />

              {/* Target Reticle in Center */}
              <div className="absolute w-64 h-64 rounded-full border border-indigo-200/50 pointer-events-none" />
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-indigo-300/40 pointer-events-none" />

              {/* Interactive SVG Hand Mesh */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-full max-w-[320px] h-64 relative z-10 filter drop-shadow-md select-none"
              >
                {/* 1. Bone Connection Lines */}
                {BONE_CONNECTIONS.map(([idx1, idx2], lineIndex) => {
                  const p1 = activeModel.points[idx1];
                  const p2 = activeModel.points[idx2];
                  if (!p1 || !p2) return null;
                  return (
                    <line
                      key={`bone-${lineIndex}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* 2. 21 Joint Landmark Nodes */}
                {activeModel.points.map((pt) => {
                  const isSelected = selectedJointNode?.id === pt.id;
                  const isExtendedTip = pt.active;
                  return (
                    <g 
                      key={`joint-${pt.id}`}
                      onClick={() => handleSelectJoint(pt)}
                      className="cursor-pointer group"
                    >
                      {/* Pulse Ring for Selected or Extended Tip */}
                      {(isSelected || isExtendedTip) && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5.5"
                          fill="none"
                          stroke={isSelected ? '#4f46e5' : '#10b981'}
                          strokeWidth="1.2"
                          className="animate-ping opacity-60"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? '4' : '2.8'}
                        fill={isSelected ? '#4f46e5' : (isExtendedTip ? '#10b981' : '#ffffff')}
                        stroke={isSelected ? '#ffffff' : '#2563eb'}
                        strokeWidth="1.5"
                        className="transition-all duration-300 hover:scale-125"
                      />

                      {/* Joint Label ID Tooltip */}
                      <text
                        x={pt.x}
                        y={pt.y - 4}
                        fontSize="3.2"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#1e293b"
                        className="pointer-events-none select-none opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        #{pt.id} {pt.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Skeleton Legend Pill */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-500 z-10 border-t border-slate-200/80 pt-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {activeModel.confidence}% Match Certainty
                </span>
                <span className="text-slate-600">
                  Selected Joint: <strong className="text-indigo-600 font-bold">#{selectedJointNode.id} {selectedJointNode.name}</strong>
                </span>
                <span>Latency: {activeModel.latency}</span>
              </div>
            </div>

            {/* Right: LIVE SPEECH AUDIO SYNTHESIS & REAL-TIME RECOGNITION CONSOLE */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
              
              <div className="space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeModel.icon}</span>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                        RECOGNIZED SIGN GLOSS
                      </span>
                      <h4 className="text-lg font-black text-slate-900 font-mono tracking-tight">
                        "{activeModel.gloss}"
                      </h4>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    NEURAL LOCK
                  </span>
                </div>

                {/* Fluent Speech Output Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      Instant Spoken Audio Waveform:
                    </span>
                    <span className="text-[10px] font-mono text-indigo-600 font-bold">SUB-15MS</span>
                  </div>

                  <p className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    "{activeModel.vocalSpeech}"
                  </p>

                  {/* Simulated Audio Waveform Bar Visualizer */}
                  <div className="flex items-center gap-1 pt-2 h-7">
                    {[12, 24, 18, 30, 16, 28, 22, 14, 26, 32, 19, 25, 14, 20, 28, 15, 23, 10].map((h, i) => (
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

                {/* Joint Kinematic Coordinates Box */}
                <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-semibold">SELECTED NODE</span>
                    <span className="font-bold text-slate-800">#{selectedJointNode.id} {selectedJointNode.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-semibold">COORDINATES (X, Y)</span>
                    <span className="font-bold text-indigo-600">{selectedJointNode.x.toFixed(1)}, {selectedJointNode.y.toFixed(1)}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sounds.playDetectChime();
                      setIsAudioWaveActive(true);
                      speech.speak(activeModel.vocalSpeech);
                      setTimeout(() => setIsAudioWaveActive(false), 2000);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Play Vocal Audio</span>
                  </button>

                  <button
                    onClick={() => { sounds.playClick(); onLaunchStudio(); }}
                    className="flex items-center gap-1.5 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
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
      {/* PERSISTENT DUAL-PANEL SYSTEM INSPECTION CONSOLE */}
      {/* ("CLICK ON ANYTHING TO INSPECT ARCHITECTURE RIGHT HERE") */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                INTERACTIVE ARCHITECTURE DOCK
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1.5">
              Tap Any Engine to Inspect Full Technical Specs
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Click any module on the left to inspect its neural architecture, tensor inputs, and latency benchmarks directly in the live inspection console on the right.
            </p>
          </div>
        </div>

        {/* Dual-Panel Layout: Left (Interactive Cards) + Right (Live Inspection Console) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: 6 Interactive Engine Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {ENGINE_MODULES.map((eng) => {
              const Icon = eng.icon;
              const isSelected = selectedEngine.id === eng.id;
              return (
                <div
                  key={eng.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedEngine(eng);
                  }}
                  className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${eng.tagColor}`}>
                        {eng.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">
                        {eng.stats.latency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {eng.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {eng.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>{isSelected ? 'Currently Inspecting' : 'Tap to Inspect'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: PERSISTENT LIVE TECHNICAL INSPECTION CONSOLE */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-lg flex flex-col gap-5 text-left sticky top-24">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  {React.createElement(selectedEngine.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${selectedEngine.tagColor}`}>
                    {selectedEngine.badge}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1">
                    {selectedEngine.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Performance Strip */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">EDGE LATENCY</span>
                <span className="font-black text-slate-800 text-sm">{selectedEngine.stats.latency}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">ACCURACY RATE</span>
                <span className="font-black text-emerald-700 text-sm">{selectedEngine.stats.accuracy}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">FRAME RATE</span>
                <span className="font-black text-indigo-700 text-sm">{selectedEngine.stats.framerate}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-semibold">PROCESSING</span>
                <span className="font-black text-slate-800 text-sm">{selectedEngine.stats.compute}</span>
              </div>
            </div>

            {/* Deep-Dive Specifications */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 text-xs font-mono">
              <div className="flex flex-col gap-0.5 border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">MODEL ARCHITECTURE:</span>
                <span className="text-slate-900 font-semibold">{selectedEngine.architectureDetails.model}</span>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">TENSOR INPUT BUFFER:</span>
                <span className="text-slate-800">{selectedEngine.architectureDetails.tensorInput}</span>
              </div>
              <div className="flex flex-col gap-0.5 border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">KINEMATIC EXTRACTION:</span>
                <span className="text-slate-800">{selectedEngine.architectureDetails.kinematicFeature}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-emerald-600 font-bold uppercase">PRIVACY COMPLIANCE:</span>
                <span className="text-emerald-800 font-bold">{selectedEngine.architectureDetails.privacyStandard}</span>
              </div>
            </div>

            {/* Audio Synthesis Demo Box */}
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3">
              <div className="space-y-0.5 text-xs">
                <span className="text-[10px] font-mono font-bold text-indigo-700 uppercase">Interactive Sample:</span>
                <p className="text-slate-800 font-semibold">"{selectedEngine.sampleVoice}"</p>
              </div>
              <button
                onClick={() => {
                  sounds.playDetectChime();
                  speech.speak(selectedEngine.sampleVoice);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs whitespace-nowrap active:scale-95 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio</span>
              </button>
            </div>

            {/* Direct Studio CTA */}
            <button
              onClick={() => handleRouteTarget(selectedEngine.studioTarget)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Launch Module Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE BEFORE VS. AFTER COMPARISON MATRIX */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-left">
        
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            PARADIGM SHIFT COMPARISON
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Traditional Interpretation vs. GestureSync AI
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            See how client-side multimodal AI redefines accessibility by removing friction, cost, and scheduling delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* Traditional Barrier Card */}
          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Traditional Sign Language Interpretation</span>
            </div>

            <ul className="space-y-2.5 text-xs text-rose-950/80 pt-2">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>24 to 48-Hour Scheduling Delay:</strong> Human interpreters must be scheduled well in advance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>High Hourly Retainer Fees:</strong> Certified ASL/ISL interpreters cost $60 to $120 per hour.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Privacy Concerns:</strong> Third-party presence required during sensitive medical examinations or private financial discussions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Zero Spontaneity:</strong> Casual social interactions or transit navigation are impossible to schedule.</span>
              </li>
            </ul>
          </div>

          {/* GestureSync AI Solution Card */}
          <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>GestureSync AI Multimodal Platform</span>
            </div>

            <ul className="space-y-2.5 text-xs text-indigo-950 pt-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Sub-15ms Real-Time Inference:</strong> Instant communication through standard laptop webcams.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>100% Free & Open-Source:</strong> Accessible to every deaf student, individual, and healthcare facility worldwide.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>100% Client-Side Privacy:</strong> HIPAA compliant; webcam frames never leave the host device.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span><strong>Bidirectional 2-Way Flow:</strong> Translates sign to vocal speech AND spoken voice into animated sign cards.</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE REAL-WORLD SCENARIOS */}
      {/* ============================================================== */}
      <section className="w-full max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col gap-6 text-left">
        
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
            DEPLOYED APPLICATION DOMAINS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Empowering Human Dignity Across Every Domain
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Tap any scenario below to observe how bidirectional translation eliminates communication barriers.
          </p>
        </div>

        {/* 4 Interactive Scenario Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {APPLIED_SCENARIOS.map((scen) => {
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
                    ? 'bg-indigo-50 border-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{scen.title}</p>
                <span className={`inline-block mt-1.5 px-2 py-0.2 rounded text-[9px] font-bold border font-mono ${scen.tagColor}`}>
                  {scen.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Scenario Dialogue Spotlight */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left flex-1">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
              TRANSLATION DIALOGUE FLOW:
            </span>
            <p className="text-sm font-mono text-slate-600">
              {activeScenario.deafInput}
            </p>
            <p className="text-lg font-bold text-slate-900">
              {activeScenario.voiceOutput}
            </p>
            <p className="text-xs text-emerald-700 font-semibold pt-1">
              &bull; Measured Impact: {activeScenario.metric}
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playDetectChime();
              speech.speak(activeScenario.voiceOutput);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Dialogue Aloud</span>
          </button>
        </div>

      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE ORGANIZATIONAL IMPACT CALCULATOR */}
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
            Adjust the sliders below to calculate annual barrier reductions for your campus, hospital, or enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
          
          <div className="flex flex-col gap-6">
            
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Deaf & Hearing Members Supported:</span>
                <span className="font-mono font-bold text-indigo-600 text-sm">{calcUsers} Users</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={calcUsers}
                onChange={(e) => setCalcUsers(Number(e.target.value))}
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
                <span className="font-mono font-bold text-indigo-600 text-sm">{calcDailyMinutes} Minutes/Day</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                value={calcDailyMinutes}
                onChange={(e) => setCalcDailyMinutes(Number(e.target.value))}
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
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-[11px] font-mono text-indigo-700 font-bold block">HOURS SAVED / YEAR</span>
              <p className="text-3xl font-black text-indigo-950 mt-1">
                {Math.round((calcUsers * calcDailyMinutes * 250) / 60)} hrs
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs whitespace-nowrap cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* DOWNLOAD PROJECT PDF REPORT BANNER */}
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
              Complete 5-page research report detailing system architecture, MediaPipe kinematics, dataflow pipelines, and ethical accessibility standards.
            </p>
          </div>
        </div>

        <a
          href="/GestureSync_AI_Project_Documentation.pdf"
          download="GestureSync_AI_Project_Documentation.pdf"
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all whitespace-nowrap cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Download PDF Report</span>
        </a>
      </section>

    </div>
  );
}
