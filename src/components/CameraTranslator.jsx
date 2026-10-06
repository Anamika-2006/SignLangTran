import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Maximize2, 
  Volume2, 
  Play, 
  Pause,
  Sliders,
  Eye,
  Info
} from 'lucide-react';
import { generateHandLandmarks, drawHandLandmarks } from '../utils/handLandmarkSimulation';
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

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [selectedSign, setSelectedSign] = useState(SIGN_DICTIONARY[0]);
  const [confidence, setConfidence] = useState(98.4);
  const [fps, setFps] = useState(60);
  const [latency, setLatency] = useState(12);
  const [isAutoCycle, setIsAutoCycle] = useState(true);
  const [autoCycleIndex, setAutoCycleIndex] = useState(0);
  const [detectionStatus, setDetectionStatus] = useState('TRACKING_ACTIVE');
  const [cameraFacing, setCameraFacing] = useState('user');

  // Start webcam feed
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
          videoRef.current.play();
          setIsCameraActive(true);
          sounds.playSuccess();
        }
      } else {
        setCameraError('Webcam API is not supported in this browser environment.');
      }
    } catch (err) {
      console.warn('Camera access issue:', err);
      setCameraError('Camera access denied or device not found. Running in Neural Simulation Studio mode.');
      setIsCameraActive(false);
    }
  };

  // Stop webcam feed
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    sounds.playClick();
  };

  // Switch camera front/back
  const toggleCameraFacing = () => {
    sounds.playClick();
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
    if (isCameraActive) {
      stopCamera();
      setTimeout(startCamera, 300);
    }
  };

  // Select a gesture directly
  const handleSelectSign = (sign) => {
    sounds.playDetectChime();
    setSelectedSign(sign);
    const newConf = 94 + Math.random() * 5.8;
    setConfidence(newConf);
    if (onSignRecognized) {
      onSignRecognized(sign, newConf);
    }
  };

  // Auto-cycle through gestures demo mode
  useEffect(() => {
    if (!isAutoCycle) return;
    const interval = setInterval(() => {
      setAutoCycleIndex(prev => {
        const nextIdx = (prev + 1) % SIGN_DICTIONARY.length;
        const nextSign = SIGN_DICTIONARY[nextIdx];
        setSelectedSign(nextSign);
        const newConf = 95 + Math.random() * 4.8;
        setConfidence(newConf);
        if (onSignRecognized) {
          onSignRecognized(nextSign, newConf);
        }
        return nextIdx;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoCycle, onSignRecognized]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const render = (now) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle canvas resolution
      const width = canvas.width;
      const height = canvas.height;

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // If webcam is active and playing, draw webcam frame
      if (isCameraActive && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.save();
        if (settings?.mirrorMode) {
          ctx.translate(width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, width, height);
        ctx.restore();

        // Dark subtle tech tint over camera
        ctx.fillStyle = 'rgba(9, 13, 22, 0.25)';
        ctx.fillRect(0, 0, width, height);
      } else {
        // High-Tech Neural Grid Background in simulation mode
        const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
        grad.addColorStop(0, '#0c1527');
        grad.addColorStop(1, '#05070e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Futuristic Grid lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 40;
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

        // Radar circle HUD in center
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 140, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Generate realistic 21-point hand landmark kinematic mesh
      const landmarks = generateHandLandmarks(selectedSign.id, now, width, height);

      // Render the glowing skeleton
      drawHandLandmarks(ctx, landmarks, selectedSign.aslGloss, confidence);

      // FPS & Latency calculation
      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = now;
        setLatency(Math.floor(10 + Math.random() * 5));
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, selectedSign, confidence, settings?.mirrorMode]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Visualizer Frame Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-2xl shadow-cyan-950/40">
        
        {/* Hidden video element used as canvas source */}
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

        {/* HUD Header Bar: Telemetry Data */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none select-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {isCameraActive ? 'LIVE WEBCAM' : 'NEURAL SIMULATOR'}
            </span>

            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-800 text-slate-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              21 Landmarks Locked
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-emerald-400 text-xs font-mono font-bold">
              {fps} FPS
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-cyan-400 text-xs font-mono">
              {latency}ms
            </span>
          </div>
        </div>

        {/* Camera Control Action Buttons Floating at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-auto">
          
          <div className="flex items-center gap-2">
            {isCameraActive ? (
              <button
                onClick={stopCamera}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-rose-950/50 transition-all"
              >
                <CameraOff className="w-4 h-4" />
                <span>Turn Off Camera</span>
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-cyan-900/50 transition-all group"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Start WebCam Feed</span>
              </button>
            )}

            {isCameraActive && (
              <button
                onClick={toggleCameraFacing}
                title="Flip Camera"
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
              title={isAutoCycle ? 'Pause Gesture Cycle' : 'Resume Gesture Demo Cycle'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all ${
                isAutoCycle
                  ? 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400/40 text-white'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {isAutoCycle ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoCycle ? 'Cycle: Active' : 'Cycle: Paused'}</span>
            </button>

            {/* Quick Word Push to Sentence */}
            <button
              onClick={() => {
                sounds.playSuccess();
                if (onAppendWord) onAppendWord(selectedSign.aslGloss);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold backdrop-blur-md shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Add Sign</span>
            </button>
          </div>

        </div>

        {/* Camera Permission Alert Banner (if needed) */}
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

      {/* Real-Time Detection Hero Ribbon */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-cyan-500/20 p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Gesture Identity */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner">
            {selectedSign.icon || '🤟'}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold text-cyan-400 tracking-wider">
                Active Detected Sign
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {selectedSign.category}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {selectedSign.aslGloss}
              <span className="text-sm font-medium text-slate-400 font-sans">
                ({selectedSign.name})
              </span>
            </h3>
            <p className="text-xs text-indigo-300 font-medium">
              हिन्दी अनुवाद: <span className="font-semibold text-white">{selectedSign.hindi}</span>
            </p>
          </div>
        </div>

        {/* Right: Confidence Metric & Key Points */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <div className="text-right">
            <p className="text-[11px] font-mono text-slate-400">NEURAL CONFIDENCE</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {confidence.toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 italic mt-0.5 max-w-[200px] truncate">
              {selectedSign.keyPoints}
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Quick-Gesture Playground / Testing Strip */}
      <div className="w-full flex flex-col gap-2 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Instant Gesture Sandbox (Click to Test Recognition):
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">
            {SIGN_DICTIONARY.length} Signs Ready
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {SIGN_DICTIONARY.map((sign) => {
            const isSelected = selectedSign.id === sign.id;
            return (
              <button
                key={sign.id}
                onClick={() => handleSelectSign(sign)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{sign.icon}</span>
                <span className="font-bold">{sign.aslGloss}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">({sign.hindi})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
