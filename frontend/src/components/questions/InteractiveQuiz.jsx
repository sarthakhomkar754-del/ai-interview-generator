import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, XCircle, Award, RotateCcw, Sparkles,
  BookOpen, ArrowRight, ArrowLeft, Zap, Eye, EyeOff, Mic, Bookmark
} from 'lucide-react';
import QuestionCard from './QuestionCard';
import api from '../../api/axiosConfig';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/* ── mode labels / config ────────────────────────────────── */
const MODE_CONFIGS = {
  exam:  { label: '🎯 Exam Mode',       toggle: 'quiz'  },
  quiz:  { label: '🎯 Exam Mode',       toggle: 'quiz'  },
  study: { label: '📖 Study Mode',      toggle: 'cards' },
  cards: { label: '📖 Study Mode',      toggle: 'cards' },
  mock:  { label: '🎙️ Mock Interview',  toggle: 'mock'  },
};

/* ─────────────────────────────────────────────────────────── */
const InteractiveQuiz = ({ questions = [], showToast, initialMode = 'exam' }) => {

  // Map prop mode → internal viewMode string
  const resolveMode = (m) => {
    if (m === 'exam')  return 'quiz';
    if (m === 'study') return 'cards';
    if (m === 'mock')  return 'mock';
    return m; // 'quiz' | 'cards' | 'mock' | 'results'
  };

  const [viewMode, setViewMode]     = useState(() => resolveMode(initialMode));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers]   = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({}); // for mock mode
  const [favorites, setFavorites] = useState({}); // Map of questionId -> isFavorite
  const [favLoading, setFavLoading] = useState(false);

  // Sync mode when parent re-generates with a different initialMode
  useEffect(() => {
    setViewMode(resolveMode(initialMode));
    setCurrentIndex(0);
    setUserAnswers({});
    setRevealedAnswers({});
    
    // Initialize favorites map from question props
    const initialFavs = {};
    if (questions) {
      questions.forEach(q => {
        initialFavs[q.id] = q.isFavorite || false;
      });
    }
    setFavorites(initialFavs);
  }, [questions, initialMode]);

  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  /* ─── handlers ─────────────────────────────────────────── */
  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmitExam = () => {
    const answered = Object.keys(userAnswers).length;
    if (answered < questions.length) {
      if (!window.confirm(`You answered ${answered} of ${questions.length} questions. Submit anyway?`)) return;
    }
    setViewMode('results');
    if (showToast) showToast('Exam submitted! Check your score below.', 'success');
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setRevealedAnswers({});
    setViewMode(resolveMode(initialMode));
  };

  const toggleReveal = (id) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleFavorite = async (questionId) => {
    try {
      setFavLoading(true);
      const currentlyFavorite = favorites[questionId];
      if (currentlyFavorite) {
        await api.delete(`/favorites/${questionId}`);
        setFavorites(prev => ({ ...prev, [questionId]: false }));
        if (showToast) showToast('Removed from favorites', 'info');
      } else {
        await api.post(`/favorites/${questionId}`);
        setFavorites(prev => ({ ...prev, [questionId]: true }));
        if (showToast) showToast('Saved to favorites!', 'success');
      }
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update favorite status', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  /* ─── score ─────────────────────────────────────────────── */
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === (q.correctOptionIndex ?? 0)) score++;
    });
    return score;
  };

  const score = calculateScore();
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getFeedbackBadge = (pct) => {
    if (pct >= 80) return { text: '🎯 Outstanding Mastery!', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (pct >= 50) return { text: '👍 Good Practice Effort!', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    return { text: '📚 Keep Practicing!', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div style={{ position: 'relative', zIndex: 0 }}>

      {/* ── Mode Toggle Bar ── */}
      <div style={{ marginBottom: 24 }} className="glass-card neon-border p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-2 text-sm font-extrabold text-slate-900 dark:text-white">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>Interactive Practice Engine</span>
          {/* Current mode pill */}
          <span className="ml-1 px-2.5 py-1 rounded-full text-[11px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">
            {viewMode === 'quiz' || viewMode === 'results' ? '🎯 Exam Mode' : viewMode === 'mock' ? '🎙️ Mock Interview' : '📖 Study Mode'}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setViewMode('quiz'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'quiz' || viewMode === 'results'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🎯 Exam
          </button>
          <button
            type="button"
            onClick={() => { setViewMode('mock'); setCurrentIndex(0); setRevealedAnswers({}); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'mock'
                ? 'bg-gradient-to-r from-orange-600 to-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            🎙️ Mock
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📖 Study
          </button>
        </div>
      </div>

      {/* ══════════ 1. EXAM / QUIZ MODE ══════════ */}
      {viewMode === 'quiz' && (
        <div className="glass-card neon-border p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            {[currentQuestion.categoryName, currentQuestion.technologyName, currentQuestion.experienceLevelName]
              .filter(Boolean)
              .map((label, i) => (
                <span key={i} className="px-3 py-1 text-xs font-extrabold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {label}
                </span>
              ))}
          </div>

          {/* Question and actions */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
            <button
              type="button"
              onClick={() => handleToggleFavorite(currentQuestion.id)}
              disabled={favLoading}
              className={`p-3 rounded-xl transition-all shrink-0 ${
                favorites[currentQuestion.id]
                  ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={favorites[currentQuestion.id] ? 'Remove Favorite' : 'Save Favorite'}
            >
              <Bookmark className={`w-6 h-6 ${favorites[currentQuestion.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(currentQuestion.options || []).map((option, idx) => {
              const isSelected = userAnswers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.id, idx)}
                  style={{ display: 'flex', width: '100%', textAlign: 'left', cursor: 'pointer', position: 'relative', zIndex: 1 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all items-start gap-4 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg ring-2 ring-blue-500/30'
                      : 'border-slate-200 dark:border-slate-700 bg-white/40 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {OPTION_LETTERS[idx] || idx + 1}
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 pt-1 leading-relaxed">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5" />
                Submit Exam & Get Score
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ 2. MOCK INTERVIEW MODE ══════════ */}
      {viewMode === 'mock' && (
        <div className="glass-card neon-border p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 border-orange-500/20 bg-orange-500/5">

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Interview Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-orange-500">🎙️ Mock Interview Active</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-900 dark:text-orange-300 font-medium flex items-start gap-2">
            <Mic className="w-4 h-4 shrink-0 mt-0.5 text-orange-500" />
            <span>Read the question aloud, think through your answer, then tap <strong>Reveal Answer</strong> to assess yourself. No multiple choice — just like a real interview.</span>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            {[currentQuestion.categoryName, currentQuestion.technologyName, currentQuestion.experienceLevelName]
              .filter(Boolean)
              .map((label, i) => (
                <span key={i} className="px-3 py-1 text-xs font-extrabold rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {label}
                </span>
              ))}
          </div>

          {/* Question and actions */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
            <button
              type="button"
              onClick={() => handleToggleFavorite(currentQuestion.id)}
              disabled={favLoading}
              className={`p-3 rounded-xl transition-all shrink-0 ${
                favorites[currentQuestion.id]
                  ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={favorites[currentQuestion.id] ? 'Remove Favorite' : 'Save Favorite'}
            >
              <Bookmark className={`w-6 h-6 ${favorites[currentQuestion.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>

          {/* Reveal answer toggle */}
          <div>
            <button
              type="button"
              onClick={() => toggleReveal(currentQuestion.id)}
              className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 font-extrabold text-sm ${
                revealedAnswers[currentQuestion.id]
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'border-orange-400/40 bg-white/40 dark:bg-slate-900/40 text-orange-600 dark:text-orange-400 hover:border-orange-500/60'
              }`}
            >
              {revealedAnswers[currentQuestion.id] ? (
                <><EyeOff className="w-5 h-5" /><span>Hide Answer</span></>
              ) : (
                <><Eye className="w-5 h-5" /><span>Reveal Answer</span></>
              )}
            </button>

            {revealedAnswers[currentQuestion.id] && (
              <div className="mt-3 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                <strong className="text-emerald-600 dark:text-emerald-400 block mb-2 uppercase tracking-wider text-xs font-extrabold">
                  ✅ Model Answer:
                </strong>
                {currentQuestion.answer}
              </div>
            )}
          </div>

          {/* Self-assessment (shown after reveal) */}
          {revealedAnswers[currentQuestion.id] && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: currentQuestion.correctOptionIndex ?? 0 })); handleNext(); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm hover:bg-emerald-500/20 transition-all cursor-pointer"
              >
                ✅ I got it right
              </button>
              <button
                type="button"
                onClick={() => { setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: -1 })); handleNext(); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-extrabold text-sm hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                ❌ I need to revise
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                type="button"
                onClick={() => { setViewMode('results'); if (showToast) showToast('Mock interview complete! See your summary.', 'success'); }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-extrabold text-sm shadow-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5" />
                Finish Mock Interview
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white font-extrabold text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ 3. RESULTS VIEW ══════════ */}
      {viewMode === 'results' && (
        <div className="space-y-8">
          {/* Score card */}
          <div className="glass-card neon-border p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent text-center space-y-6 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              {/* Circular gauge */}
              <div style={{ position: 'relative', width: 144, height: 144 }} className="flex items-center justify-center">
                <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={radius} strokeWidth="10" stroke="currentColor" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                  <circle
                    cx="60" cy="60" r={radius}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="url(#scoreGrad)"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute' }} className="flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black gradient-text">{percentage}%</span>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Score</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {initialMode === 'mock' ? 'Mock Interview Summary' : 'Exam Summary'}: <span className="gradient-text">{score} / {total} Correct</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review your answers below</p>
              </div>

              <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${getFeedbackBadge(percentage).cls}`}>
                {getFeedbackBadge(percentage).text}
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestartQuiz}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                {initialMode === 'mock' ? 'Restart Mock Interview' : 'Retake Exam'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-md transition-all hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                View Study Cards
              </button>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Detailed Performance Breakdown
            </h3>

            {questions.map((q, idx) => {
              const selectedIdx = userAnswers[q.id];
              const correctIdx = q.correctOptionIndex ?? 0;
              const isCorrect = initialMode === 'mock'
                ? selectedIdx === correctIdx           // mock: -1 = wrong, correctIdx = right
                : selectedIdx === correctIdx;

              return (
                <div
                  key={q.id}
                  className={`glass-card p-6 rounded-3xl border transition-all ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : 'border-rose-500/40 bg-rose-50/20 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-2 pr-4">
                      <span className="font-black text-sm text-slate-400 shrink-0">Q{idx + 1}.</span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">{q.question}</h4>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(q.id)}
                        disabled={favLoading}
                        className={`p-2 rounded-xl transition-colors ${
                          favorites[q.id]
                            ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 shadow-sm'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent'
                        }`}
                        title={favorites[q.id] ? 'Remove Favorite' : 'Save Favorite'}
                      >
                        <Bookmark className={`w-4 h-4 ${favorites[q.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                      
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full">
                          <XCircle className="w-4 h-4" /> {selectedIdx === undefined ? 'Unanswered' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* In mock mode don't show MCQ options — show answer directly */}
                  {initialMode === 'mock' ? (
                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-900/60 p-4 rounded-2xl">
                      <strong className="text-blue-600 dark:text-blue-400 block mb-1 font-bold uppercase tracking-wider">Model Answer:</strong>
                      {q.answer}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4">
                        {(q.options || []).map((opt, oIdx) => {
                          const wasSelected = selectedIdx === oIdx;
                          const isOptionCorrect = oIdx === correctIdx;
                          let cls = 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300';
                          if (isOptionCorrect) cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 font-bold';
                          if (wasSelected && !isOptionCorrect) cls = 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200 font-semibold line-through opacity-70';

                          return (
                            <div key={oIdx} className={`p-3.5 rounded-xl border text-sm flex items-center justify-between ${cls}`}>
                              <span>{opt}</span>
                              {isOptionCorrect && <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">✓ Correct Answer</span>}
                              {wasSelected && !isOptionCorrect && <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 shrink-0 ml-2">Your Choice</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-900/60 p-4 rounded-2xl">
                        <strong className="text-blue-600 dark:text-blue-400 block mb-1 font-bold uppercase tracking-wider">Solution Explanation:</strong>
                        {q.answer}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════ 4. STUDY CARDS ══════════ */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          {questions.map((q) => (
            <QuestionCard 
              key={q.id} 
              question={{...q, isFavorite: favorites[q.id] || false}} 
              showToast={showToast} 
              onFavoriteToggle={(id, isFav) => setFavorites(prev => ({ ...prev, [id]: isFav }))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveQuiz;
