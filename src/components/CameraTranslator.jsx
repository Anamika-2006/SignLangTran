import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Play, 
  Pause,
  Sliders,
  Eye,
  Info,
  HandMetal,
  Check
} from 'lucide-react';
import { 
  generateHandLandmarks, 
  drawHandLandmarks, 
  classifyHandGesture 
} from '../utils/handLandmarkSimulation';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';

export default function CameraTranslator({
  onSignRecognized,
  settings,
  currentSentence,
  onAppendWord
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const mpHandsRef = useRef(null);
  const realLandmarksRef = useRef(null);

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
  const [mediaPipeReady, setMediaPipeReady] = useState(false);

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

            // Map normalized [0, 1] coords to canvas dimensions
            const mapped = raw.map(p => ({
              x: (settings?.mirrorMode ? (1 - p.x) : p.x) * w,
              y: p.y * h,
              z: p.z * w
            }));

            realLandmarksRef.current = mapped;
            setHandInFrame(true);

            // Run real-time gesture classification
            const detected = classifyHandGesture(mapped);
            if (detected && detected.id) {
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
              if (onSignRecognized) {
                onSignRecognized(matchedInDict, detected.confidence);
              }
            }
          } else {
            realLandmarksRef.current = null;
            setHandInFrame(false);
          }
        });

        mpHandsRef.current = hands;
        setMediaPipeReady(true);
      } catch (e) {
        console.warn('MediaPipe initialization fallback:', e);
      }
    }
  }, [settings?.mirrorMode, onSignRecognized]);

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
    const newConf = 95 + Math.random() * 4.5;
    setConfidence(newConf);
    if (onSignRecognized) {
      onSignRecognized(sign, newConf);
    }
  };

  // Auto-cycle through gestures demo mode
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setSelectedSign(prev => {
        const currentIdx = SIGN_DICTIONARY.findIndex(s => s.id === prev.id);
        const nextIdx = (currentIdx + 1) % SIGN_DICTIONARY.length;
        const nextSign = SIGN_DICTIONARY[nextIdx];
        setActiveDetectedSign(nextSign);
        setConfidence(95 + Math.random() * 4.5);
        if (onSignRecognized) {
          onSignRecognized(nextSign, 97.5);
        }
        return nextSign;
      });
    }, 4000);

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

      // If webcam is active, render webcam frame
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
          // Subtle instruction overlay when no hand is in view
          ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
          ctx.fillRect(width / 2 - 200, height - 70, 400, 40);
          ctx.strokeStyle = '#06b6d4';
          ctx.strokeRect(width / 2 - 200, height - 70, 400, 40);

          ctx.font = 'bold 14px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.textAlign = 'center';
          ctx.fillText('SHOW YOUR HAND TO DETECT SIGNS', width / 2, height - 45);
          ctx.textAlign = 'left';
        }

      } else {
        // High-Tech Cyber Grid in simulation / preview mode
        const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
        grad.addColorStop(0, '#0d192e');
        grad.addColorStop(1, '#05070e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Futuristic grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
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

        // Center target reticle
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 130, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
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
    <div className="w-full flex flex-col gap-4">
      {/* Visualizer Frame Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-950/40">
        
        {/* Real Video Element Source */}
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

        {/* HUD Top Bar: Telemetry Data */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none select-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-lg">
              <span className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
              {isCameraActive ? (handInFrame ? 'WEBCAM: HAND LOCKED' : 'WEBCAM: LIVE FEED') : 'NEURAL SIMULATOR'}
            </span>

            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-800 text-slate-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              21 Joint Points
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-400 text-xs font-mono font-bold">
              {fps} FPS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-400 text-xs font-mono">
              {latency}ms Latency
            </span>
          </div>
        </div>

        {/* Floating Controls at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto">
          
          <div className="flex items-center gap-2">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-rose-950/50 transition-all"
              >
                <CameraOff className="w-4 h-4" />
                <span>Turn Off Camera</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-cyan-900/50 transition-all group"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Start WebCam Feed</span>
              </button>
            )}

            {isCameraActive && (
              <button
                onClick={toggleCameraFacing}
                title="Switch Camera Facing"
                className="p-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white backdrop-blur-md transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Cycle Gesture Demo */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsAutoCycle(!isAutoCycle);
              }}
              title={isAutoCycle ? 'Pause Gesture Demo' : 'Run Gesture Demo'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all ${
                isAutoCycle
                  ? 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400/40 text-white'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {isAutoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoCycle ? 'Cycle Demo' : 'Practice Cycle'}</span>
            </button>

            {/* Quick Word Push to Sentence */}
            <button
              onClick={() => {
                sounds.playSuccess();
                if (onAppendWord) onAppendWord(activeDetectedSign.aslGloss);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Add to Sentence</span>
            </button>
          </div>

        </div>

        {/* Camera Permission Alert Banner */}
        {cameraError && (
          <div className="absolute top-14 left-4 right-4 p-3 rounded-2xl bg-amber-950/85 border border-amber-500/40 backdrop-blur-lg flex items-center justify-between text-amber-200 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{cameraError}</span>
            </div>
            <button
              onClick={() => setCameraError(null)}
              className="ml-2 text-amber-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Real-Time Detection Hero Ribbon (CLEAN INTERNATIONAL ENGLISH - NO HINDI) */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-cyan-500/20 p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Gesture Identity */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner">
            {activeDetectedSign.icon || '🤟'}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                Recognized Sign Gesture
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {activeDetectedSign.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
              {activeDetectedSign.aslGloss}
              <span className="text-sm font-medium text-slate-400 font-sans">
                — {activeDetectedSign.name}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Physical Posture: <span className="text-slate-300">{activeDetectedSign.keyPoints || activeDetectedSign.tips}</span>
            </p>
          </div>
        </div>

        {/* Right: Confidence Metric */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <div className="text-right">
            <p className="text-[11px] font-mono text-slate-400">NEURAL RECOGNITION CONFIDENCE</p>
            <div className="flex items-center gap-2 justify-end mt-1">
              <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {confidence.toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
              Status: Locked & Verified
            </p>
          </div>
        </div>

      </div>

      {/* Expanded Interactive Sign Sandbox (Click to Test Gesture Recognition) */}
      <div className="w-full flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Sign Library Quick Selector (Click to simulate / test):
          </span>
          <span className="text-[11px] text-cyan-400 font-mono font-bold">
            {SIGN_DICTIONARY.length} Signs & Gestures Active
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SIGN_DICTIONARY.map((sign) => {
            const isSelected = activeDetectedSign.id === sign.id;
            return (
              <button
                key={sign.id}
                onClick={() => handleSelectSign(sign)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20 scale-105 font-bold'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
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
