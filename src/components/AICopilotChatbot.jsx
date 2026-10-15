import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  ChevronRight, 
  Video, 
  Mic, 
  GraduationCap, 
  Radio, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { speech } from '../utils/speechSynthesizer';

// Knowledge base with pattern matching & direct actions
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['camera', 'webcam', 'recognize', 'detect', 'gesture', 'vision', 'kamera', 'dekhna'],
    title: 'Camera Studio & Vision Engine',
    response: 'GestureSync AI uses client-side MediaPipe BlazeHand kinematics to detect 21 3D hand joints at 60 FPS. When you hold your hand before the camera, it computes bone angles, identifies the sign (like HELLO, THANK YOU, I LOVE YOU, DOCTOR, HELP), and translates it directly below the camera container in under 15ms.',
    actionLabel: 'Go to Camera Studio',
    actionTab: 'translator'
  },
  {
    keywords: ['voice', 'speech', 'microphone', 'bolna', 'reverse', 'bolkar', 'audio'],
    title: '2-Way Voice-to-Sign Studio',
    response: 'Our Voice-to-Sign reverse studio enables hearing people to speak aloud into their microphone. The system transcribes spoken English sentences into structured ASL/ISL animated sign cards with step-by-step sequential playback and fingerspelling fallback.',
    actionLabel: 'Open Voice-to-Sign',
    actionTab: 'reverse'
  },
  {
    keywords: ['landmark', 'joint', 'skeleton', '21', 'points', 'mesh', 'kinematic', 'angle'],
    title: '21 3D Joint Kinematics',
    response: 'The hand skeleton is modeled using 21 spatial landmarks: Wrist (#0), Thumb (#1-4), Index (#5-8), Middle (#9-12), Ring (#13-16), and Pinky (#17-20). By calculating the Euclidean distance and cosine angles between knuckles, our neural classifier recognizes complex signs without relying on cloud processing.',
    actionLabel: 'Inspect Skeleton on Home',
    actionTab: 'home'
  },
  {
    keywords: ['academy', 'learn', 'quiz', 'flashcard', 'practice', 'padhna', 'seekhna'],
    title: 'Sign Academy & Practice Arena',
    response: 'Sign Academy features a comprehensive visual dictionary with categorized flashcards across Beginner, Everyday, Food, Emergency, and Numbers. You can also test your knowledge in the gamified Practice Quiz with real-time score tracking, streaks, and confetti celebrations.',
    actionLabel: 'Launch Sign Academy',
    actionTab: 'academy'
  },
  {
    keywords: ['sos', 'emergency', 'help', 'doctor', 'hospital', 'danger', 'police', 'fire', 'khatra'],
    title: 'Critical Emergency SOS Beacon',
    response: 'The Emergency SOS HUD is a life-safety tool for non-verbal and deaf individuals. With 1 tap, it broadcasts high-visibility flashing alert cards, plays a 900Hz vocal alarm over device speakers, and displays emergency triage coordinates for doctors and first responders.',
    actionLabel: 'Open Emergency SOS HUD',
    actionModal: 'sos'
  },
  {
    keywords: ['privacy', 'secure', 'safe', 'data', 'server', 'record', 'video', 'hipaa', 'gdpr'],
    title: '100% Edge Privacy & Security',
    response: 'Your privacy is guaranteed. All webcam frames are processed 100% on-device inside sandboxed WebAssembly (WASM) browser memory. Video frames are discarded immediately after joint detection and NEVER stored, recorded, or sent to any remote server.',
    actionLabel: 'Inspect Security Specs',
    actionModal: 'settings'
  },
  {
    keywords: ['pdf', 'report', 'document', 'download', 'documentation', 'project', 'architecture'],
    title: 'Official Project PDF Documentation',
    response: 'You can download the complete official 5-page research report anytime! It includes system architecture diagrams, MediaPipe mathematical formulations, pipeline flowcharts, and ethical accessibility standards.',
    actionDownload: '/GestureSync_AI_Project_Documentation.pdf',
    actionLabel: 'Download PDF Report'
  },
  {
    keywords: ['shortcut', 'hotkey', 'key', 'space', 'button'],
    title: 'Keyboard Shortcuts',
    response: 'Quick hotkeys available: [Space] to toggle camera, [T] to speak current translation output, [M] to toggle sound effects, and [Escape] to dismiss any open modal or drawer.',
    actionLabel: 'View System Settings',
    actionModal: 'settings'
  },
  {
    keywords: ['dialect', 'isl', 'asl', 'bsl', 'language', 'hindi'],
    title: 'Supported Dialects & Languages',
    response: 'GestureSync AI supports American Sign Language (ASL), Indian Sign Language (ISL), and British Sign Language (BSL). You can also toggle fluent English text, raw gloss tokens, and Hindi translation on request.',
    actionLabel: 'Configure Dialects',
    actionModal: 'settings'
  }
];

export default function AICopilotChatbot({
  onNavigateTab,
  onOpenSOS,
  onOpenSettings,
  currentUser
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${currentUser?.name || 'there'}! I am your GestureSync AI Copilot. Ask me anything about our 21-joint hand tracking, 2-way voice-to-sign, emergency SOS, or system architecture!`,
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Find best matching response from knowledge base
  const generateBotResponse = (query) => {
    const clean = query.toLowerCase();

    for (let item of KNOWLEDGE_RESPONSES) {
      if (item.keywords.some(kw => clean.includes(kw))) {
        return {
          text: item.response,
          actionLabel: item.actionLabel,
          actionTab: item.actionTab,
          actionModal: item.actionModal,
          actionDownload: item.actionDownload
        };
      }
    }

    return {
      text: `GestureSync AI provides real-time bidirectional communication between deaf and hearing communities. You can use our Camera Studio for sign-to-speech, Voice-to-Sign for speech-to-sign, or Sign Academy to learn gestures. What specific feature would you like to explore?`,
      actionLabel: 'Explore Camera Studio',
      actionTab: 'translator'
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    sounds.playClick();

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulated AI response delay
    setTimeout(() => {
      const match = generateBotResponse(query);
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: match.text,
        actionLabel: match.actionLabel,
        actionTab: match.actionTab,
        actionModal: match.actionModal,
        actionDownload: match.actionDownload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      sounds.playDetectChime();
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (ttsEnabled) {
        speech.speak(match.text);
      }
    }, 600);
  };

  const handleActionClick = (msg) => {
    sounds.playClick();
    if (msg.actionTab) {
      onNavigateTab(msg.actionTab);
    } else if (msg.actionModal === 'sos') {
      onOpenSOS();
    } else if (msg.actionModal === 'settings') {
      onOpenSettings();
    } else if (msg.actionDownload) {
      const link = document.createElement('a');
      link.href = msg.actionDownload;
      link.download = 'GestureSync_AI_Project_Documentation.pdf';
      link.click();
    }
  };

  return (
    <>
      {/* ============================================================== */}
      {/* FLOATING BOT LAUNCHER BUTTON (ALWAYS ACCESSIBLE IN BOTTOM-RIGHT) */}
      {/* ============================================================== */}
      {!isOpen && (
        <button
          onClick={() => {
            sounds.playClick();
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600"></span>
          </div>
          <span className="font-sans">Ask AI Assistant</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">v4.2</span>
        </button>
      )}

      {/* ============================================================== */}
      {/* CONVERSATIONAL AI CHATBOT WINDOW */}
      {/* ============================================================== */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[560px] max-h-[85vh] rounded-3xl bg-white border border-slate-200/90 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-200 text-left">
          
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-xs">
                🤖
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900">GestureSync Copilot</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 font-mono">
                    AI AGENT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Live platform knowledge & guidance</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                title={ttsEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4 text-indigo-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  speech.stop();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}

                  <div className={`flex flex-col gap-1.5 max-w-[85%] ${isBot ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isBot
                          ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                          : 'bg-indigo-600 text-white font-medium rounded-br-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Interactive Action Button inside Bot Message */}
                      {isBot && msg.actionLabel && (
                        <button
                          onClick={() => handleActionClick(msg)}
                          className="mt-2.5 w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] border border-indigo-200 transition-colors cursor-pointer"
                        >
                          <span>{msg.actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
                      <span>{msg.time}</span>
                      {isBot && (
                        <button
                          onClick={() => speech.speak(msg.text)}
                          title="Read message aloud"
                          className="hover:text-indigo-600 ml-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-9">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px]">SyncBot is formulating answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {[
              'How does camera translate signs?',
              'Is my video private?',
              'How to use Voice-to-Sign?',
              'Emergency SOS feature',
              'Download PDF report'
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-[11px] text-slate-600 whitespace-nowrap transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about GestureSync AI..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
