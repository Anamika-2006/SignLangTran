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
  HelpCircle
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
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
          sounds.playSuccess();
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } else {
        alert('Speech recognition is not supported in this browser. Please type your phrase.');
      }
    } else {
      setIsListening(false);
    }
  };

  const currentActiveSign = matchedSigns[activeStep] || matchedSigns[0];

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-mono">
              REVERSE MULTIMODAL MODE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Voice & Text to Sign Visualizer
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Hearing person speaks or types &rarr; Automatic neural sign sequence & finger-spelling rendered for Deaf listeners.
          </p>
        </div>

        {/* Voice Microphone Record Trigger */}
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-indigo-900/40'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isListening ? 'Listening...' : 'Tap & Speak Voice'}</span>
        </button>
      </div>

      {/* Input Text Box & Quick Presets */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
        <label className="text-xs font-mono font-bold text-slate-400 flex items-center justify-between">
          <span>ENTER SPOKEN OR TYPED MESSAGE:</span>
          <span className="text-cyan-400 font-mono">{matchedSigns.length} Signs Generated</span>
        </label>

        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type any phrase or speak into your microphone..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-white font-medium text-base focus:outline-none focus:border-cyan-400 shadow-inner pr-12"
          />
          <button
            onClick={() => {
              sounds.playClick();
              setIsPlayingSequence(true);
              setActiveStep(0);
            }}
            title="Translate & Play"
            className="absolute right-2 top-2 p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Sample phrases */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-slate-500">Quick Prompts:</span>
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
              className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-colors"
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
          <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl">
            
            {/* Top Badge */}
            <div className="w-full flex items-center justify-between text-xs font-mono mb-4">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                STEP {activeStep + 1} OF {matchedSigns.length}
              </span>
              <span className="text-slate-400">
                Original Word: <strong className="text-white">"{currentActiveSign.originalWord}"</strong>
              </span>
            </div>

            {/* Huge Sign Icon & Kinematics */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-44 h-44 rounded-3xl bg-gradient-to-tr from-cyan-900/30 via-slate-950 to-indigo-900/30 border-2 border-cyan-500/40 flex items-center justify-center text-7xl shadow-2xl shadow-cyan-500/20 animate-pulse">
                {currentActiveSign.icon || '🤟'}
              </div>
            </div>

            {/* Sign Title & Details */}
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-white font-mono">
                {currentActiveSign.aslGloss}
              </h3>
              <p className="text-sm text-cyan-400 font-semibold">
                {currentActiveSign.name}
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto pt-2 italic">
                {currentActiveSign.keyPoints || currentActiveSign.tips}
              </p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800/80 w-full justify-center">
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(prev => Math.max(0, prev - 1));
                }}
                disabled={activeStep === 0}
                className="px-3.5 py-2 rounded-xl bg-slate-800 disabled:opacity-30 text-white text-xs font-semibold"
              >
                Previous
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsPlayingSequence(!isPlayingSequence);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md"
              >
                {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingSequence ? 'Pause' : 'Play Sequence'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(prev => Math.min(matchedSigns.length - 1, prev + 1));
                }}
                disabled={activeStep >= matchedSigns.length - 1}
                className="px-3.5 py-2 rounded-xl bg-slate-800 disabled:opacity-30 text-white text-xs font-semibold"
              >
                Next
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveStep(0);
                }}
                title="Restart"
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Sequential Timeline Strip */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              SEQUENCE TIMELINE ({matchedSigns.length} STEPS):
            </h4>

            <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1">
              {matchedSigns.map((item, idx) => {
                const isCurrent = idx === activeStep;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      sounds.playClick();
                      setActiveStep(idx);
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-mono text-xs text-slate-500">
                        #{idx + 1}
                      </span>
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-bold text-sm leading-tight text-white">
                          {item.aslGloss}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                        {item.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
