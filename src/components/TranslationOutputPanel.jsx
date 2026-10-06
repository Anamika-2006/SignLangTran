import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Copy, 
  Trash2, 
  Download, 
  Sparkles, 
  Check, 
  Languages,
  RotateCcw
} from 'lucide-react';
import { speech } from '../utils/speechSynthesizer';
import { sounds } from '../utils/soundEffects';

export default function TranslationOutputPanel({
  sentenceTokens = [],
  onClearSentence,
  onAddManualToken,
  onSaveToHistory
}) {
  const [outputMode, setOutputMode] = useState('fluent'); // 'fluent', 'raw', 'spanish', 'hindi'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState([]);

  // Load available system speech voices
  useEffect(() => {
    const updateVoices = () => {
      const available = speech.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        setSelectedVoice(available[0].name);
      }
    };
    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedVoice]);

  // Transform raw tokens into fluent natural sentences
  const rawGloss = sentenceTokens.length > 0 ? sentenceTokens.join(' ') : 'HELLO THANK YOU';

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

  const getTranslatedText = () => {
    if (outputMode === 'raw') {
      return rawGloss;
    }

    if (outputMode === 'spanish') {
      const match = spanishDict[rawGloss];
      if (match) return match;
      if (sentenceTokens.length > 0) {
        return sentenceTokens.map(tok => spanishDict[tok] || tok).join(' ') + '.';
      }
      return '¡Hola, encantado de conocerte!';
    }

    // Only show Hindi IF the user explicitly clicks the 'hindi' tab!
    if (outputMode === 'hindi') {
      const match = hindiDict[rawGloss];
      if (match) return match;
      if (sentenceTokens.length > 0) {
        return sentenceTokens.map(tok => hindiDict[tok] || tok).join(' ') + '।';
      }
      return 'नमस्ते, आपसे मिलकर अच्छा लगा!';
    }

    // Default: Pure fluent English
    const match = fluentEnglishDict[rawGloss];
    if (match) return match;
    if (sentenceTokens.length > 0) {
      return sentenceTokens.map(t => fluentEnglishDict[t] || t).join(', ') + '.';
    }
    return 'Hello, thank you for communicating with me!';
  };

  const currentDisplayText = getTranslatedText();

  // Trigger speech synthesis
  const handleSpeak = () => {
    sounds.playClick();
    speech.rate = speechRate;
    if (selectedVoice) {
      speech.setVoice(selectedVoice);
    }
    setIsSpeaking(true);
    speech.speak(
      currentDisplayText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Stop speech
  const handleStopSpeech = () => {
    sounds.playClick();
    speech.stop();
    setIsSpeaking(false);
  };

  // Copy to clipboard
  const handleCopy = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(currentDisplayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export transcript as a downloaded text file
  const handleDownload = () => {
    sounds.playSuccess();
    const content = `--- GESTURESYNC AI TRANSLATION TRANSCRIPT ---\n` +
      `Timestamp: ${new Date().toLocaleString()}\n` +
      `Raw Gloss: ${rawGloss}\n` +
      `Mode: ${outputMode.toUpperCase()}\n` +
      `Translated Text: ${currentDisplayText}\n\n` +
      `Generated by GestureSync AI Universal Translation Studio.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gesture_translation_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Translation Output Card */}
      <div className="relative w-full rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-5 text-left">
        
        {/* Output Header with Language Mode Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">
                TRANSLATION OUTPUT STREAM
              </h4>
              <p className="text-[11px] text-slate-400">
                Natural language refinement & vocal speech synthesizer
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => { sounds.playClick(); setOutputMode('fluent'); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                outputMode === 'fluent'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fluent English
            </button>
            <button
              onClick={() => { sounds.playClick(); setOutputMode('raw'); }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                outputMode === 'raw'
                  ? 'bg-slate-700 text-cyan-300 font-mono shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Sign Gloss
            </button>
            <button
              onClick={() => { sounds.playClick(); setOutputMode('spanish'); }}
              className={`px-3 py-1.5 rounded-lg transition-all hidden sm:block ${
                outputMode === 'spanish'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Español
            </button>
            <button
              onClick={() => { sounds.playClick(); setOutputMode('hindi'); }}
              title="Show Hindi translation only on user request"
              className={`px-3 py-1.5 rounded-lg transition-all text-[11px] ${
                outputMode === 'hindi'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Hindi (On Request)
            </button>
          </div>
        </div>

        {/* Translation Content Area */}
        <div className="relative min-h-[110px] sm:min-h-[130px] rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between group">
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
              <span>SYNTHESIS PREVIEW</span>
              <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3" />
                Refined Grammar
              </span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-relaxed">
              "{currentDisplayText}"
            </p>
          </div>

          {/* Audio Wave Visualizer Simulation during speech */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-900/60 mt-2">
            <div className="flex items-center gap-1.5">
              {[4, 12, 18, 24, 16, 8, 20, 26, 14, 6].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking 
                      ? 'bg-cyan-400 animate-pulse' 
                      : 'bg-slate-800'
                  }`}
                  style={{
                    height: isSpeaking ? `${Math.max(6, (h * (Math.sin(Date.now() / 200 + i) + 1.2)).toFixed(0))}px` : '4px'
                  }}
                />
              ))}
              <span className="text-[10px] font-mono text-slate-500 ml-2">
                {isSpeaking ? 'SYNTHESIZING SPEECH AUDIO...' : 'AUDIO SYNTHESIZER READY'}
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              Sign Sequence: <span className="text-cyan-300 font-bold">{rawGloss}</span>
            </span>
          </div>
        </div>

        {/* Primary Action Buttons: Speak, Copy, Clear, Save */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            {isSpeaking ? (
              <button
                onClick={handleStopSpeech}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition-all active:scale-95"
              >
                <VolumeX className="w-4 h-4 animate-bounce" />
                <span>Stop Vocal</span>
              </button>
            ) : (
              <button
                onClick={handleSpeak}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 group"
              >
                <Volume2 className="w-4 h-4 group-hover:scale-125 transition-transform" />
                <span>Speak Aloud</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              title="Download Transcript File"
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sounds.playSuccess();
                if (onSaveToHistory) {
                  onSaveToHistory({
                    text: currentDisplayText,
                    gloss: rawGloss,
                    mode: outputMode,
                    time: 'Just now'
                  });
                }
              }}
              title="Save to History Log"
              className="px-3.5 py-2 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
            >
              Save Record
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                if (onClearSentence) onClearSentence();
              }}
              title="Clear Current Sentence"
              className="p-2.5 rounded-2xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Speech Tuning Controls */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          
          <div className="flex items-center gap-2">
            <span className="font-mono">Speech Speed:</span>
            {[0.8, 1.0, 1.2, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  sounds.playClick();
                  setSpeechRate(rate);
                }}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] ${
                  speechRate === rate
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {voices.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono hidden sm:inline">Voice Engine:</span>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  speech.setVoice(e.target.value);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
              >
                {voices.slice(0, 12).map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name.slice(0, 24)} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
