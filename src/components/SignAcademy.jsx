import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  BookOpen
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              SIGN ACADEMY & MASTERY
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Sign Language Learning Studio
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Master American (ASL) & Indian (ISL) Sign Language through interactive visual flashcards and gamified recognition challenges.
          </p>
        </div>

        {/* Quiz Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setQuizMode(!quizMode);
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all ${
            quizMode
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
          }`}
        >
          {quizMode ? <BookOpen className="w-5 h-5 text-indigo-600" /> : <Trophy className="w-5 h-5 text-amber-300" />}
          <span>{quizMode ? 'Back to Library' : 'Start Practice Quiz'}</span>
        </button>
      </div>

      {quizMode ? (
        /* QUIZ MODE ARENA */
        <div className="w-full max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-center">
          
          {/* Header Stats */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>SCORE: {score} PTS</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>STREAK: {streak} 🔥</span>
            </div>
            <span className="text-slate-500">QUESTION #{currentQuizIndex + 1}</span>
          </div>

          {/* Quiz Question Card */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-600">
              Identify the meaning of this hand gesture:
            </p>

            <div className="w-32 h-32 mx-auto rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-6xl shadow-inner my-2 animate-bounce">
              {currentQuizSign.icon}
            </div>

            <p className="text-sm text-slate-600 italic">
              Hint / Physical Form: "{currentQuizSign.keyPoints}"
            </p>
          </div>

          {/* 4 Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = opt.id === currentQuizSign.id;
              let btnClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

              if (quizFeedback) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-500';
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
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Gloss: {opt.aslGloss}</p>
                  </div>

                  {quizFeedback && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  {quizFeedback && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {quizFeedback && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className={`text-sm font-bold ${
                quizFeedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {quizFeedback === 'correct' ? '🎉 Perfect! Correct Gesture Recognized!' : '❌ Incorrect. Correct answer was ' + currentQuizSign.name}
              </span>

              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm"
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
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search signs by name, letter, or keyword..."
                className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
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
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
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
                className="group rounded-3xl bg-white hover:border-indigo-300 border border-slate-200 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] font-medium">
                      {sign.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      sign.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {sign.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs">
                      {sign.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {sign.name}
                      </h4>
                      <p className="text-xs font-mono text-indigo-600 font-semibold">
                        {sign.aslGloss}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                    {sign.keyPoints}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Accuracy: ~{sign.confidenceDefault}%</span>
                  <span className="text-indigo-600 group-hover:underline font-semibold">Explore &rarr;</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
