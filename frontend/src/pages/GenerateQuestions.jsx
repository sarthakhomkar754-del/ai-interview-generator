import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
  Sparkles, RefreshCw, AlertCircle, Zap, Briefcase, UserCheck,
  Clock, BookOpen, Mic, Target, ChevronRight
} from 'lucide-react';
import InteractiveQuiz from '../components/questions/InteractiveQuiz';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/common/Toast';

/* ─── Test Mode Definitions ─────────────────────────────── */
const TEST_MODES = [
  {
    id: 'exam',
    icon: '🎯',
    label: 'Exam Mode',
    subtitle: 'Timed MCQ — Get Scored',
    desc: 'Answer all questions with A/B/C/D options, submit at the end, and see your detailed score report with correct answers.',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    ring: 'ring-blue-500/40',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    textAccent: 'text-blue-600 dark:text-blue-400',
    tag: '⚡ Most Popular',
  },
  {
    id: 'study',
    icon: '📖',
    label: 'Study Mode',
    subtitle: 'Flashcards — Learn at Your Own Pace',
    desc: 'Browse questions as study cards. Expand each card to see the detailed answer. Perfect for deep understanding.',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    ring: 'ring-emerald-500/40',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    textAccent: 'text-emerald-600 dark:text-emerald-400',
    tag: '📚 Best for Revision',
  },
  {
    id: 'mock',
    icon: '🎙️',
    label: 'Mock Interview',
    subtitle: 'One Question at a Time — Simulate Real Interview',
    desc: 'Questions appear one by one with no options. Think your answer, then reveal it to self-assess. Simulates a real interview.',
    gradient: 'from-orange-600 via-rose-600 to-pink-600',
    ring: 'ring-rose-500/40',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    textAccent: 'text-rose-600 dark:text-rose-400',
    tag: '🎙️ Advanced Practice',
  },
];

const GenerateQuestions = () => {
  const [technologies, setTechnologies] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  // Form State
  const [technologyId, setTechnologyId] = useState('');
  const [jobRoleId, setJobRoleId] = useState('');
  const [experienceLevelId, setExperienceLevelId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficultyId, setDifficultyId] = useState('');
  const [count, setCount] = useState(5);

  // Test mode chosen BEFORE generating
  const [selectedMode, setSelectedMode] = useState('exam');

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      setFetchingMeta(true);
      const [techRes, roleRes, levelRes, catRes, diffRes] = await Promise.all([
        api.get('/technologies'),
        api.get('/job-roles'),
        api.get('/experience-levels'),
        api.get('/categories'),
        api.get('/difficulties'),
      ]);

      if (techRes.success && techRes.data?.length > 0) setTechnologies(techRes.data);
      if (roleRes.success && roleRes.data?.length > 0) setJobRoles(roleRes.data);
      if (levelRes.success && levelRes.data?.length > 0) setExperienceLevels(levelRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (diffRes.success) setDifficulties(diffRes.data);
    } catch (err) {
      console.error('Failed to load filter metadata', err);
    } finally {
      setFetchingMeta(false);
    }
  };

  const executeGeneration = async (overrides = {}) => {
    const tId = overrides.technologyId ?? technologyId;
    const rId = overrides.jobRoleId ?? jobRoleId;
    const lId = overrides.experienceLevelId ?? experienceLevelId;
    const cId = overrides.categoryId ?? categoryId;
    const dId = overrides.difficultyId ?? difficultyId;
    const qCount = overrides.count ?? count;

    if (!tId || !rId || !lId) {
      setError('Please select a Technology, Job Role, and Experience Level before generating.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setGeneratedQuestions([]); // clear old results
      const payload = {
        technologyId: Number(tId),
        jobRoleId: Number(rId),
        experienceLevelId: Number(lId),
        categoryId: cId ? Number(cId) : null,
        difficultyId: dId ? Number(dId) : null,
        count: Number(qCount),
      };

      const res = await api.post('/questions/generate', payload);
      if (res.success && res.data) {
        setGeneratedQuestions(res.data);
        const modeLabel = TEST_MODES.find(m => m.id === selectedMode)?.label || 'Quiz';
        showToast(`${res.data.length} questions ready in ${modeLabel}!`, 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTechnology = (id) => { setTechnologyId(id); setError(''); setGeneratedQuestions([]); };
  const handleSelectJobRole = (id) => { setJobRoleId(id); setError(''); setGeneratedQuestions([]); };
  const handleSelectExperienceLevel = (id) => { setExperienceLevelId(id); setError(''); setGeneratedQuestions([]); };

  const applyPresetAndGenerate = (techName, roleName, levelName) => {
    const t = technologies.find((i) => i.technologyName.toLowerCase().includes(techName.toLowerCase()));
    const r = jobRoles.find((i) => i.roleName.toLowerCase().includes(roleName.toLowerCase()));
    const l = experienceLevels.find((i) => i.levelName.toLowerCase().includes(levelName.toLowerCase()));

    const newTechId = t?.id || technologyId;
    const newRoleId = r?.id || jobRoleId;
    const newLevelId = l?.id || experienceLevelId;

    if (t) setTechnologyId(t.id);
    if (r) setJobRoleId(r.id);
    if (l) setExperienceLevelId(l.id);

    showToast(`Loading ${techName} ${roleName} preset...`, 'info');
    executeGeneration({ technologyId: newTechId, jobRoleId: newRoleId, experienceLevelId: newLevelId });
  };

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    executeGeneration();
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const getTechIcon = (name) => {
    switch (name?.toLowerCase()) {
      case 'java': return '☕';
      case 'spring boot': return '🍃';
      case 'react': return '⚛️';
      case 'python': return '🐍';
      case 'sql': return '🐬';
      case 'docker': return '🐳';
      case 'nodejs': return '🟢';
      default: return '💻';
    }
  };

  const activeModeConfig = TEST_MODES.find(m => m.id === selectedMode);

  return (
    <div className="space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Interactive AI Interview Generator</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Generate <span className="gradient-text">Interview Questions</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Choose your <strong>test mode</strong>, select your stack, then generate your personalized question set.
        </p>
      </div>

      {/* ── STEP 1: Test Mode Selector ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Step 1 — Choose Your Test Mode:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEST_MODES.map((mode) => {
            const isActive = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => { setSelectedMode(mode.id); setGeneratedQuestions([]); }}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? `border-transparent bg-gradient-to-br ${mode.gradient} text-white shadow-2xl scale-[1.02] ring-2 ${mode.ring}`
                    : 'border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg'
                }`}
              >
                {/* Tag badge */}
                <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : `${mode.bg} ${mode.textAccent} border ${mode.border}`
                }`}>
                  {mode.tag}
                </span>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mode.icon}</span>
                    <div>
                      <div className={`font-extrabold text-base ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {mode.label}
                      </div>
                      <div className={`text-[11px] font-semibold ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                        {mode.subtitle}
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-white/90' : 'text-slate-600 dark:text-slate-400'}`}>
                    {mode.desc}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="mt-3 flex items-center gap-1 text-white text-[11px] font-extrabold">
                    <ChevronRight className="w-3 h-3" />
                    <span>Selected — Ready to Generate</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STEP 2: 1-Click Starter Packs ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Step 2 — Quick Start Packs (or configure manually below):
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '☕', label: 'Java Fresher Pack', tech: 'Java', role: 'Java Developer', level: 'Fresher' },
            { icon: '🍃', label: 'Spring Boot Pro', tech: 'Spring Boot', role: 'Backend Developer', level: 'Intermediate' },
            { icon: '⚛️', label: 'React Frontend Pack', tech: 'React', role: 'Frontend Developer', level: 'Intermediate' },
            { icon: '🐬', label: 'SQL Master Pack', tech: 'SQL', role: 'Full Stack', level: 'Intermediate' },
          ].map((pack) => (
            <button
              key={pack.label}
              type="button"
              onClick={() => applyPresetAndGenerate(pack.tech, pack.role, pack.level)}
              className="p-3.5 rounded-2xl glass-card neon-border border text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-center space-x-2 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
            >
              <span>{pack.icon}</span>
              <span>{pack.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── STEP 3: Main Generator Form ── */}
      <div className="glass-card neon-border p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Selected mode pill */}
        {activeModeConfig && (
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-extrabold w-fit ${activeModeConfig.bg} ${activeModeConfig.textAccent} border ${activeModeConfig.border}`}>
            <span>{activeModeConfig.icon}</span>
            <span>{activeModeConfig.label} Selected</span>
            <span className="opacity-60 font-normal">— {activeModeConfig.subtitle}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Step 3 — Configure Your Question Set:
          </h2>
        </div>

        {fetchingMeta ? (
          <SkeletonLoader count={2} />
        ) : (
          <form onSubmit={handleGenerate} className="space-y-6">

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm font-medium flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Technology Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Select Technology Badge:
              </label>
              <div className="flex flex-wrap gap-2">
                {technologies.map((t) => {
                  const isSelected = String(technologyId) === String(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTechnology(t.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/40'
                          : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{getTechIcon(t.technologyName)}</span>
                      <span>{t.technologyName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Job Role Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Select Job Role Badge:
              </label>
              <div className="flex flex-wrap gap-2">
                {jobRoles.map((r) => {
                  const isSelected = String(jobRoleId) === String(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectJobRole(r.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/40'
                          : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{r.roleName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Experience Level Selector */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                3. Select Experience Level Badge:
              </label>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((l) => {
                  const isSelected = String(experienceLevelId) === String(l.id);
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleSelectExperienceLevel(l.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-500/40'
                          : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{l.levelName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category, Difficulty & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Category (Optional)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty (Optional)
                </label>
                <select
                  value={difficultyId}
                  onChange={(e) => setDifficultyId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((d) => (
                    <option key={d.id} value={d.id}>{d.difficultyName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Question Count
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r ${activeModeConfig?.gradient || 'from-blue-600 via-indigo-600 to-purple-600'} hover:opacity-90 text-white font-black text-base shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating {activeModeConfig?.label}...</span>
                  </>
                ) : (
                  <>
                    <span>{activeModeConfig?.icon}</span>
                    <span>Generate — {activeModeConfig?.label}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : generatedQuestions.length > 0 ? (
        <InteractiveQuiz
          questions={generatedQuestions}
          showToast={showToast}
          initialMode={selectedMode}
        />
      ) : null}
    </div>
  );
};

export default GenerateQuestions;
