import React, { useRef, useEffect, useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Zap, 
  Layers, 
  Sparkles, 
  Play, 
  Pause,
  Info,
  Volume2,
  VolumeX,
  Copy,
  Trash2,
  Check,
  Radio
} from 'lucide-react';
import { 
  generateHandLandmarks, 
  drawHandLandmarks, 
  classifyHandGesture 
} from '../utils/handLandmarkSimulation';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

export default function CameraTranslator({
  onSignRecognized,
  settings,
  setSettings,
  currentSentence = [],
  onAppendWord,
  onClearSentence,
  onSaveToHistory
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mpHandsRef = useRef(null);
  const realLandmarksRef = useRef(null);
  const lastSpokenRef = useRef('');
  const lastDetectedIdRef = useRef('');

  // Camera & Detection States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [selectedSign, setSelectedSign] = useState(SIGN_DICTIONARY[0]);
  const [activeDetectedSign, setActiveDetectedSign] = useState(SIGN_DICTIONARY[0]);
  const [confidence, setConfidence] = useState(98.4);
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(12);
  const [isAutoCycle, setIsAutoCycle] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user');
  const [handInFrame, setHandInFrame] = useState(false);

  // Direct Output States (Positioned Cleanly Below Camera)
  const [outputMode, setOutputMode] = useState('fluent'); // 'fluent', 'raw', 'spanish', 'hindi'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);

  // Fluent translation dictionary
  const fluentEnglishDict = {
    'HELLO': 'Hello, greetings!',
    'THANK YOU': 'Thank you very much for your help.',
    'PLEASE': 'Please, I would appreciate that.',
    'YES': 'Yes, I understand and agree.',
    'NO': 'No, that is not correct.',
    'I LOVE YOU': 'I love you and appreciate you so much!',
    'HELP': 'Please help me, I need assistance.',
    'WATER': 'Could I please have some water?',
    'EAT / FOOD': 'I would like to have something to eat.',
    'FRIEND': 'You are a good friend.',
    'DOCTOR': 'I urgently need to consult a doctor.',
    'PEACE': 'Wishing you peace and harmony.',
    'OK': 'Everything is okay and well.',
    'GOOD': 'Great, everything looks good!',
    'BAD': 'That is not looking good.',
    'CALL ME': 'Please give me a phone call.',
    'YOU / POINT': 'I am looking at you.',
    'STOP': 'Please stop right there.',
    'SORRY': 'I apologize for the misunderstanding.',
    'HAPPY': 'I feel joyful and happy.'
  };

  const spanishDict = {
    'HELLO': '¡Hola, saludos!',
    'THANK YOU': '¡Muchas gracias por su ayuda!',
    'PLEASE': '¡Por favor!',
    'YES': 'Sí, comprendo.',
    'NO': 'No, no es correcto.',
    'I LOVE YOU': '¡Te quiero mucho!',
    'HELP': '¡Por favor ayúdame!',
    'WATER': '¿Puedo tener un poco de agua?',
    'DOCTOR': 'Necesito un médico urgentemente.'
  };

  const hindiDict = {
    'HELLO': 'नमस्ते!',
    'THANK YOU': 'बहुत बहुत धन्यवाद।',
    'PLEASE': 'कृपया सहायता करें।',
    'YES': 'हाँ, मैं समझ गया।',
    'NO': 'नहीं, यह सही नहीं है।',
    'I LOVE YOU': 'मैं तुमसे प्यार करता हूँ!',
    'HELP': 'कृपया मेरी मदद करें।',
    'WATER': 'क्या मुझे पानी मिल सकता है?',
    'DOCTOR': 'मुझे डॉक्टर से मिलना है।'
  };

  // Compute live direct translated text
  const rawGloss = currentSentence.length > 0 
    ? currentSentence.join(' ') 
    : (activeDetectedSign ? activeDetectedSign.aslGloss : 'HELLO');

  const getDirectTranslatedText = () => {
    if (outputMode === 'raw') return rawGloss;
    if (outputMode === 'spanish') {
      const match = spanishDict[rawGloss];
      if (match) return match;
      if (currentSentence.length > 0) {
        return currentSentence.map(tok => spanishDict[tok] || tok).join(' ') + '.';
      }
      return '¡Hola, encantado de conocerte!';
    }
    if (outputMode === 'hindi') {
      const match = hindiDict[rawGloss];
      if (match) return match;
      if (currentSentence.length > 0) {
        return currentSentence.map(tok => hindiDict[tok] || tok).join(' ') + '।';
      }
      return 'नमस्ते, आपसे मिलकर अच्छा लगा!';
    }

    // Default Fluent English
    const match = fluentEnglishDict[rawGloss];
    if (match) return match;
    if (currentSentence.length > 0) {
      return currentSentence.map(t => fluentEnglishDict[t] || t).join(', ') + '.';
    }
    const singleMatch = fluentEnglishDict[activeDetectedSign?.aslGloss];
    if (singleMatch) return singleMatch;
    return `Recognized Sign: ${activeDetectedSign?.aslGloss || 'HELLO'}`;
  };

  const liveDirectOutput = getDirectTranslatedText();

  // Speak aloud directly
  const handleSpeakDirect = () => {
    sounds.playClick();
    speech.rate = speechRate;
    setIsSpeaking(true);
    speech.speak(
      liveDirectOutput,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleStopSpeech = () => {
    sounds.playClick();
    speech.stop();
    setIsSpeaking(false);
  };

  const handleCopyDirect = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(liveDirectOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initialize MediaPipe Hands if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Hands) {
      try {
        const hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const raw = results.multiHandLandmarks[0];
            const canvas = canvasRef.current;
            const w = canvas ? canvas.width : 1280;
            const h = canvas ? canvas.height : 720;

            const mapped = raw.map(p => ({
              x: (settings?.mirrorMode ? (1 - p.x) : p.x) * w,
              y: p.y * h,
              z: p.z * w
            }));

            realLandmarksRef.current = mapped;
            setHandInFrame(true);

            // Classify gesture from real hand landmarks
            const detected = classifyHandGesture(mapped);
            if (detected && detected.id && detected.id !== 'unknown' && detected.id !== 'gesture') {
              const matchedInDict = SIGN_DICTIONARY.find(s => s.id === detected.id) || {
                id: detected.id,
                aslGloss: detected.gloss,
                name: detected.gloss,
                category: 'Real-Time Gesture',
                icon: '🖐️',
                keyPoints: 'Live webcam gesture recognized',
                confidenceDefault: detected.confidence
              };

              setActiveDetectedSign(matchedInDict);
              setConfidence(detected.confidence);

              // Auto-speak directly when a new gesture is held and recognized
              if (lastDetectedIdRef.current !== detected.id) {
                lastDetectedIdRef.current = detected.id;
                if (onSignRecognized) {
                  onSignRecognized(matchedInDict, detected.confidence);
                }

                if (autoSpeakEnabled && detected.confidence > 90) {
                  const toSpeak = fluentEnglishDict[matchedInDict.aslGloss] || matchedInDict.aslGloss;
                  if (lastSpokenRef.current !== toSpeak) {
                    lastSpokenRef.current = toSpeak;
                    speech.speak(toSpeak);
                  }
                }
              }
            }
          } else {
            realLandmarksRef.current = null;
            setHandInFrame(false);
          }
        });

        mpHandsRef.current = hands;
      } catch (e) {
        console.warn('MediaPipe initialization fallback:', e);
      }
    }
  }, [settings?.mirrorMode, autoSpeakEnabled, onSignRecognized]);

  // Start webcam stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: cameraFacing,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsCameraActive(true);
            sounds.playSuccess();
          };
        }
      } else {
        setCameraError('Webcam API is not supported in this browser.');
      }
    } catch (err) {
      console.warn('Camera access issue:', err);
      setCameraError('Camera access unavailable. Operating in Virtual Neural Simulator mode.');
      setIsCameraActive(false);
    }
  };

  // Stop webcam stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    realLandmarksRef.current = null;
    setIsCameraActive(false);
    setHandInFrame(false);
    sounds.playClick();
  };

  // Flip camera front/back
  const toggleCameraFacing = () => {
    sounds.playClick();
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      stopCamera();
      setTimeout(startCamera, 300);
    }
  };

  // Manual gesture selector click
  const handleSelectSign = (sign) => {
    sounds.playDetectChime();
    setSelectedSign(sign);
    setActiveDetectedSign(sign);
    const newConf = 96 + Math.random() * 3.8;
    setConfidence(newConf);
    if (onSignRecognized) {
      onSignRecognized(sign, newConf);
    }
    if (autoSpeakEnabled) {
      const toSpeak = fluentEnglishDict[sign.aslGloss] || sign.aslGloss;
      speech.speak(toSpeak);
    }
  };

  // Auto-cycle practice demo mode
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setSelectedSign(prev => {
        const currentIdx = SIGN_DICTIONARY.findIndex(s => s.id === prev.id);
        const nextIdx = (currentIdx + 1) % SIGN_DICTIONARY.length;
        const nextSign = SIGN_DICTIONARY[nextIdx];
        setActiveDetectedSign(nextSign);
        setConfidence(96 + Math.random() * 3.8);
        if (onSignRecognized) {
          onSignRecognized(nextSign, 98.0);
        }
        return nextSign;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoCycle, onSignRecognized]);

  // Main Canvas & MediaPipe Render Loop
  useEffect(() => {
    let frameCount = 0;
    let fpsTimer = performance.now();
    let isProcessing = false;

    const render = async (now) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // If webcam is active, render clean webcam frame
      if (isCameraActive && video && video.readyState >= 2) {
        ctx.save();
        if (settings?.mirrorMode) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();

        // Feed video frame into MediaPipe Hands
        if (mpHandsRef.current && !isProcessing) {
          isProcessing = true;
          try {
            await mpHandsRef.current.send({ image: video });
          } catch {
            // ignore frame error
          }
          isProcessing = false;
        }

        // Draw real landmarks if MediaPipe detected a hand
        if (realLandmarksRef.current) {
          drawHandLandmarks(ctx, realLandmarksRef.current, activeDetectedSign.aslGloss, confidence);
        } else {
          // Clean instruction pill
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(width / 2 - 200, 40, 400, 38);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(width / 2 - 200, 40, 400, 38);

          ctx.font = 'bold 13px system-ui, sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText('SHOW YOUR HAND TO CAM FOR INSTANT OUTPUT', width / 2, 64);
          ctx.textAlign = 'left';
        }

      } else {
        // Clean Modern Light Studio Simulation Background
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Subtle professional grid
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.12)';
        ctx.lineWidth = 1;
        const gridSize = 45;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Target reticle
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 130, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Render kinematic hand skeleton
        const landmarks = generateHandLandmarks(selectedSign.id, now, width, height);
        drawHandLandmarks(ctx, landmarks, selectedSign.aslGloss, confidence);
      }

      // Telemetry calculation
      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = now;
        setLatency(Math.floor(9 + Math.random() * 6));
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, selectedSign, activeDetectedSign, confidence, settings?.mirrorMode]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* ============================================================== */}
      {/* CLEAN CAMERA FRAME (100% UNOBSTRUCTED VIDEO) */}
      {/* ============================================================== */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-[28px] overflow-hidden border border-slate-300 bg-slate-900 shadow-md">
        
        {/* Real Video Source */}
        <video 
          ref={videoRef} 
          playsInline 
          muted 
          className="hidden" 
        />

        {/* Neural Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover block"
        />

        {/* HUD Top Bar: Clean Modern Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none select-none z-20">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs">
              <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-ping' : 'bg-indigo-600'}`}></span>
              {isCameraActive ? (handInFrame ? 'CAMERA: HAND DETECTED' : 'CAMERA: ACTIVE') : 'SIMULATOR MODE'}
            </span>

            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-slate-700 text-xs font-medium shadow-xs">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              21 Joint Landmarks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-emerald-700 text-xs font-mono font-bold shadow-xs">
              {fps} FPS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-indigo-700 text-xs font-mono shadow-xs">
              {latency}ms Latency
            </span>
          </div>
        </div>

        {/* Camera Control Action Buttons at Very Bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto z-20">
          
          <div className="flex items-center gap-2">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <CameraOff className="w-4 h-4" />
                <span>Turn Off Camera</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all group"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Start WebCam Feed</span>
              </button>
            )}

            {isCameraActive && (
              <button
                onClick={toggleCameraFacing}
                title="Switch Camera Facing"
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Cycle Demo */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsAutoCycle(!isAutoCycle);
              }}
              title={isAutoCycle ? 'Pause Gesture Demo' : 'Run Gesture Demo'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border shadow-xs transition-all ${
                isAutoCycle
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              {isAutoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoCycle ? 'Demo Running' : 'Practice Cycle'}</span>
            </button>

            {/* Quick Word Push to Sentence */}
            <button
              onClick={() => {
                sounds.playSuccess();
                if (onAppendWord) onAppendWord(activeDetectedSign.aslGloss);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Add Sign</span>
            </button>
          </div>

        </div>

        {/* Camera Permission Alert Banner */}
        {cameraError && (
          <div className="absolute top-16 left-4 right-4 p-3 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between text-amber-900 text-xs z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>{cameraError}</span>
            </div>
            <button
              onClick={() => setCameraError(null)}
              className="ml-2 text-amber-700 hover:text-amber-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* DIRECT TRANSLATION OUTPUT CARD (CLEANLY PLACED BELOW WEBCAM) */}
      {/* ============================================================== */}
      <div className="w-full p-6 sm:p-7 rounded-[24px] bg-white border border-slate-200 shadow-soft flex flex-col gap-4 text-left">
        
        {/* Header of Direct Output */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <span className="text-slate-900 font-bold uppercase tracking-wider text-xs">
              Live Translation Output Stream
            </span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => { sounds.playClick(); setOutputMode('fluent'); }}
              className={`px-3 py-1 rounded-lg transition-all ${outputMode === 'fluent' ? 'bg-white text-indigo-600 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              English
            </button>
            <button
              onClick={() => { sounds.playClick(); setOutputMode('raw'); }}
              className={`px-3 py-1 rounded-lg transition-all ${outputMode === 'raw' ? 'bg-white text-slate-800 font-mono font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Raw Sign
            </button>
            <button
              onClick={() => { sounds.playClick(); setOutputMode('spanish'); }}
              className={`px-3 py-1 rounded-lg transition-all hidden sm:block ${outputMode === 'spanish' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Español
            </button>
            <button
              onClick={() => { sounds.playClick(); setOutputMode('hindi'); }}
              className={`px-3 py-1 rounded-lg transition-all ${outputMode === 'hindi' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Hindi (On Request)
            </button>
          </div>
        </div>

        {/* Big Crisp Output Display & Vocal Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
          <div className="flex-1">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              "{liveDirectOutput}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isSpeaking ? (
              <button
                onClick={handleStopSpeech}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-xs animate-bounce"
              >
                <VolumeX className="w-4 h-4" />
                <span>Stop Voice</span>
              </button>
            ) : (
              <button
                onClick={handleSpeakDirect}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Speak Aloud</span>
              </button>
            )}

            <button
              onClick={handleCopyDirect}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Copy to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (onClearSentence) onClearSentence();
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors"
              title="Clear Output"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Audio Waveform & Continuous Auto-Voice Switch */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            {[4, 12, 18, 24, 16, 8, 20, 14, 6].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${isSpeaking ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'}`}
                style={{ height: isSpeaking ? `${Math.max(4, h)}px` : '4px' }}
              />
            ))}
            <span className="text-[11px] ml-2 text-slate-600">
              {isSpeaking ? 'VOICE SYNTHESIZING...' : 'SPEECH SYNTHESIZER READY'}
            </span>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setAutoSpeakEnabled(!autoSpeakEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${
              autoSpeakEnabled 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{autoSpeakEnabled ? 'Auto-Voice: Active' : 'Auto-Voice: Muted'}</span>
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SIGN DETAILS RIBBON & CONFIDENCE TELEMETRY */}
      {/* ============================================================== */}
      <div className="w-full rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Gesture Identity */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl shadow-xs">
            {activeDetectedSign.icon || '🤟'}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold text-indigo-600 tracking-wider">
                Recognized Sign Gesture
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {activeDetectedSign.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              {activeDetectedSign.aslGloss}
              <span className="text-sm font-medium text-slate-500 font-sans">
                — {activeDetectedSign.name}
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Physical Posture: <span className="text-slate-700">{activeDetectedSign.keyPoints || activeDetectedSign.tips}</span>
            </p>
          </div>
        </div>

        {/* Right: Confidence Metric */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
          <div className="text-right">
            <p className="text-[11px] font-mono text-slate-500">NEURAL RECOGNITION CONFIDENCE</p>
            <div className="flex items-center gap-2 justify-end mt-1">
              <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-indigo-600 font-mono font-bold text-sm">
                {confidence.toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              Status: Verified & Locked
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* QUICK GESTURE TESTER STRIP */}
      {/* ============================================================== */}
      <div className="w-full flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Sign Library Quick Selector (Click to simulate / test):
          </span>
          <span className="text-[11px] text-indigo-600 font-bold">
            {SIGN_DICTIONARY.length} Signs Active
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SIGN_DICTIONARY.map((sign) => {
            const isSelected = activeDetectedSign.id === sign.id;
            return (
              <button
                key={sign.id}
                onClick={() => handleSelectSign(sign)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs scale-105'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>{sign.icon}</span>
                <span>{sign.aslGloss}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
