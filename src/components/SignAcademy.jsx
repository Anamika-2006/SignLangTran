import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  GraduationCap, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SIGN_DICTIONARY, CATEGORIES } from '../data/signsData';
import { sounds } from '../utils/soundEffects';

export default function SignAcademy() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct' or 'wrong'
  const [selectedOption, setSelectedOption] = useState(null);

  // Filtered dictionary
  const filteredSigns = SIGN_DICTIONARY.filter(sign => {
    const matchesCat = selectedCategory === 'All' || sign.category === selectedCategory;
    const matchesSearch = 
      sign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sign.aslGloss.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Setup quiz question
  const currentQuizSign = SIGN_DICTIONARY[currentQuizIndex % SIGN_DICTIONARY.length];
  
  // Generate 4 randomized options including the correct answer
  const getOptions = () => {
    const wrongOptions = SIGN_DICTIONARY
      .filter(s => s.id !== currentQuizSign.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const all = [currentQuizSign, ...wrongOptions].sort(() => 0.5 - Math.random());
    return all;
  };

  const [options, setOptions] = useState(() => getOptions());

  const handleNextQuestion = () => {
    sounds.playClick();
    setQuizFeedback(null);
    setSelectedOption(null);
    const nextIdx = currentQuizIndex + 1;
    setCurrentQuizIndex(nextIdx);
    const nextSign = SIGN_DICTIONARY[nextIdx % SIGN_DICTIONARY.length];
    const wrong = SIGN_DICTIONARY.filter(s => s.id !== nextSign.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([nextSign, ...wrong].sort(() => 0.5 - Math.random()));
  };

  const handleSelectAnswer = (option) => {
    if (quizFeedback) return; // already answered
    setSelectedOption(option.id);

    if (option.id === currentQuizSign.id) {
      sounds.playSuccess();
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setQuizFeedback('correct');
      // Trigger festive confetti explosion!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      sounds.playClick();
      setStreak(0);
      setQuizFeedback('wrong');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      {/* Academy Banner & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              NEURAL ACADEMY & MASTERY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Sign Language Learning Studio
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Master American (ASL) & Indian (ISL) Sign Language through interactive visual flashcards and gamified recognition challenges.
          </p>
        </div>

        {/* Quiz Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setQuizMode(!quizMode);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all ${
            quizMode
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
          }`}
        >
          {quizMode ? <BookOpen className="w-5 h-5" /> : <Trophy className="w-5 h-5 text-amber-400" />}
          <span>{quizMode ? 'Back to Library' : 'Start Practice Quiz'}</span>
        </button>
      </div>

      {quizMode ? (
        /* QUIZ MODE ARENA */
        <div className="w-full max-w-3xl mx-auto rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-center">
          
          {/* Header Stats */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-4 h-4" />
              <span>SCORE: {score} PTS</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>STREAK: {streak} 🔥</span>
            </div>
            <span className="text-slate-400">QUESTION #{currentQuizIndex + 1}</span>
          </div>

          {/* Quiz Question Card */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Identify the meaning of this hand gesture:
            </p>

            <div className="w-32 h-32 mx-auto rounded-3xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-6xl shadow-inner my-2 animate-bounce">
              {currentQuizSign.icon}
            </div>

            <p className="text-sm text-slate-400 italic">
              Hint / Physical Form: "{currentQuizSign.keyPoints}"
            </p>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentQuizSign.id;
              let btnClass = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200';

              if (quizFeedback) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-600/30 border-rose-500 text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer(opt)}
                  disabled={quizFeedback !== null}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${btnClass}`}
                >
                  <div>
                    <p className="font-bold text-base leading-tight">{opt.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Gloss: {opt.aslGloss}</p>
                  </div>

                  {quizFeedback && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {quizFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {quizFeedback && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className={`text-sm font-bold ${
                quizFeedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {quizFeedback === 'correct' ? '🎉 Perfect! Correct Gesture Recognized!' : '❌ Incorrect. Correct answer was ' + currentQuizSign.name}
              </span>

              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md"
              >
                Next Question &rarr;
              </button>
            </div>
          )}

        </div>
      ) : (
        /* LIBRARY & FLASHCARD CATALOG */
        <div className="flex flex-col gap-6">
          
          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search signs by name, letter, or Hindi..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-thin">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSigns.map((sign) => (
              <div
                key={sign.id}
                className="group rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px]">
                      {sign.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      sign.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {sign.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                      {sign.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                        {sign.name}
                      </h4>
                      <p className="text-xs font-mono text-cyan-400 font-semibold">
                        {sign.aslGloss}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                    {sign.keyPoints}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Accuracy: ~{sign.confidenceDefault}%</span>
                  <span className="text-cyan-400 group-hover:underline font-medium">Explore &rarr;</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
