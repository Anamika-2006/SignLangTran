import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Volume2,
  Send,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SIGN_DICTIONARY } from '../data/signsData';
import { sounds } from '../utils/soundEffects';

export default function VoiceToSignStudio() {
  const [inputText, setInputText] = useState('Hello! I am happy to meet you. Thank you.');
  const [isListening, setIsListening] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [matchedSigns, setMatchedSigns] = useState([]);

  // Break input phrase into matched sign cards
  const analyzePhrase = (text) => {
    const clean = text.toUpperCase().replace(/[.,!?;:]/g, '');
    const words = clean.split(/\s+/).filter(Boolean);
    const results = [];

    words.forEach(word => {
      // Find direct or partial match in dictionary
      const found = SIGN_DICTIONARY.find(s => 
        s.aslGloss === word || 
        s.name.toUpperCase().includes(word) ||
        word.includes(s.aslGloss)
      );

      if (found) {
        results.push({ ...found, originalWord: word, type: 'phrase' });
      } else {
        // Break into finger-spelling letters
        for (let char of word) {
          const letterMatch = SIGN_DICTIONARY.find(s => s.id === `letter-${char.toLowerCase()}`);
          if (letterMatch) {
            results.push({ ...letterMatch, originalWord: char, type: 'letter' });
          } else {
            results.push({
              id: `char-${char}`,
              name: `Letter ${char}`,
              aslGloss: char,
              icon: '🖐️',
              category: 'Spelling',
              originalWord: char,
              type: 'spelling',
              keyPoints: `Fingerspell letter ${char}`
            });
          }
        }
      }
    });

    return results;
  };

  useEffect(() => {
    const signs = analyzePhrase(inputText);
    setMatchedSigns(signs);
    setActiveStep(0);
  }, [inputText]);

  // Sequential Playback loop
  useEffect(() => {
    if (!isPlayingSequence || matchedSigns.length === 0) return;

    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= matchedSigns.length - 1) {
          setIsPlayingSequence(false);
          sounds.playSuccess();
          return prev;
        }
        sounds.playClick();
        return prev + 1;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [isPlayingSequence, matchedSigns]);

  // Voice speech recognition toggle
  const toggleListening = () => {
    sounds.playClick();
    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e) => {
          const speechResult = e.results[0][0].transcript;
          setInputText(speechResult);
          sounds.playSuccess();
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } else {
        alert('Web Speech API is not supported in this browser. Please use Chrome or Edge.');
      }
    } else {
      setIsListening(false);
    }
  };

  const currentActiveSign = matchedSigns[activeStep] || matchedSigns[0];

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      
      {/* Studio Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              BIDIRECTIONAL VOICE REVERSE STUDIO
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              SPEECH-TO-GESTURE READY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Spoken Voice & Text &rarr; <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Sign Language Engine</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Speak into your microphone or type English phrases. Our neural parser translates grammar into accurate ASL glosses and kinematic sign cues.
          </p>
        </div>

        {/* Big Mic Button */}
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all whitespace-nowrap active:scale-95 ${
            isListening
              ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5 text-rose-600" /> : <Mic className="w-5 h-5" />}
          <span>{isListening ? 'Listening...' : 'Tap & Speak Voice'}</span>
        </button>
      </div>

      {/* Input Text Box & Quick Presets */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span className="uppercase tracking-wider">Spoken or Typed Message:</span>
          <span className="text-indigo-600 font-mono font-bold">{matchedSigns.length} Signs Generated</span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type any phrase or speak into your microphone..."
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-slate-900 font-medium text-base focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs pr-14"
          />
          <button
            onClick={() => {
              sounds.playClick();
              setIsPlayingSequence(true);
              setActiveStep(0);
            }}
            title="Translate & Play"
            className="absolute right-2.5 top-2.5 p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Sample phrases */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-slate-500 font-medium">Quick Prompts:</span>
          {[
            'Hello! Thank you.',
            'Please help me doctor.',
            'Yes, I want water.',
            'I love you peace.'
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                sounds.playClick();
                setInputText(prompt);
              }}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Sign Visualizer Stage */}
      {currentActiveSign && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual Display (Hero Stage) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative shadow-sm">
            
            {/* Top Badge */}
            <div className="w-full flex items-center justify-between text-xs mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-semibold">
                STEP {activeStep + 1} OF {matchedSigns.length}
              </span>
              <span className="text-slate-500">
                Original Word: <strong className="text-slate-900 font-bold">"{currentActiveSign.originalWord}"</strong>
              </span>
            </div>

            {/* Huge Sign Icon & Kinematics */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-44 h-44 rounded-3xl bg-slate-50 border-2 border-indigo-100 flex items-center justify-center text-7xl shadow-xs animate-pulse">
                {currentActiveSign.icon || '🤟'}
              </div>
            </div>

            {/* Sign Title & Details */}
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {currentActiveSign.aslGloss}
              </h3>
              <p className="text-sm text-indigo-600 font-semibold">
                {currentActiveSign.name}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto pt-2 italic">
                {currentActiveSign.keyPoints || currentActiveSign.tips}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100 w-full justify-center">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(prev => Math.max(0, prev - 1));
                }}
                disabled={activeStep === 0}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous sign"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlayingSequence(!isPlayingSequence);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all"
              >
                {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingSequence ? 'Pause Animation' : 'Play Sequence'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(0);
                  setIsPlayingSequence(true);
                }}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Replay from start"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(prev => Math.min(matchedSigns.length - 1, prev + 1));
                }}
                disabled={activeStep >= matchedSigns.length - 1}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next sign"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* Sequential Step List */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Kinematic Sign Sequence
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                {activeStep + 1} of {matchedSigns.length} steps
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
              {matchedSigns.map((item, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={`${item.id}-${index}`}
                    onClick={() => {
                      sounds.playClick();
                      setActiveStep(index);
                      setIsPlayingSequence(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isActive
                        ? 'bg-indigo-50 border-indigo-200 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className={`font-bold text-xs ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                          {item.aslGloss}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          Word: "{item.originalWord}" &bull; {item.type}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      #{index + 1}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
