import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import {
  Sparkles, RefreshCw, AlertCircle, Briefcase, UserCheck,
  ChevronRight, Target, BookOpen, CheckSquare, Zap, Layers
} from 'lucide-react';
import InteractiveQuiz from '../components/questions/InteractiveQuiz';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/common/Toast';

const TIPS = {
  Aptitude: [
    'Focus on identifying the pattern before calculating',
    'For percentage problems: always work from the base value',
    'Time & Work: use person-days as total units of work',
    'Ratio problems: scale both sides equally',
  ],
  Coding: [
    'Think about edge cases: empty input, single element',
    'Identify time & space complexity before coding',
    'Consider two-pointer or sliding window for array problems',
    'Hash maps can reduce O(n²) solutions to O(n)',
  ],
  HR: [
    'Use the STAR method: Situation, Task, Action, Result',
    'Quantify your impact whenever possible',
    'Research the company values before answering culture questions',
    'Be honest — interviewers value authenticity',
  ],
  SQL: [
    'Always think about JOIN type before writing the query',
    'Use CTEs (WITH clause) for multi-step logic clarity',
    'Indexes speed up reads but slow down writes',
    'HAVING filters aggregated data; WHERE filters rows',
  ],
  Technical: [
    'Explain "why" not just "what" — show deep understanding',
    'Relate concepts to real-world use cases you have worked on',
    'Know the trade-offs: every design decision has pros & cons',
    'Be ready to draw architecture diagrams verbally',
  ],
};

const CategoryPracticePage = ({ categoryName, icon, gradient, description, accentClass }) => {
  const [technologies, setTechnologies] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const [technologyId, setTechnologyId] = useState('');
  const [jobRoleId, setJobRoleId] = useState('');
  const [experienceLevelId, setExperienceLevelId] = useState('');
  const [difficultyId, setDifficultyId] = useState('');
  const [count, setCount] = useState(5);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [error, setError] = useState('');

  const isAptitude = categoryName.toLowerCase() === 'aptitude';

  const showToast = (msg, type = 'success') => { setToastMessage(msg); setToastType(type); };

  useEffect(() => {
    fetchMetadata();
  }, [categoryName]);

  const fetchMetadata = async () => {
    try {
      setFetchingMeta(true);
      setGeneratedQuestions([]);
      const [techRes, roleRes, levelRes, catRes, diffRes] = await Promise.all([
        api.get('/technologies'),
        api.get('/job-roles'),
        api.get('/experience-levels'),
        api.get('/categories'),
        api.get('/difficulties'),
      ]);

      if (techRes.success) setTechnologies(techRes.data || []);
      if (roleRes.success) setJobRoles(roleRes.data || []);
      if (levelRes.success) setExperienceLevels(levelRes.data || []);
      if (diffRes.success) setDifficulties(diffRes.data || []);

      // Auto-resolve categoryId for this page
      if (catRes.success && catRes.data) {
        const cat = catRes.data.find(c =>
          c.categoryName.toLowerCase() === categoryName.toLowerCase()
        );
        if (cat) setCategoryId(cat.id);
      }
    } catch (err) {
      console.error('Failed to load metadata', err);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    
    // For Aptitude, tech/role/level are not required
    if (!isAptitude && (!technologyId || !jobRoleId || !experienceLevelId)) {
      setError('Please select a Technology, Job Role, and Experience Level before generating.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const payload = {
        technologyId: technologyId ? Number(technologyId) : null,
        jobRoleId: jobRoleId ? Number(jobRoleId) : null,
        experienceLevelId: experienceLevelId ? Number(experienceLevelId) : null,
        categoryId: categoryId ? Number(categoryId) : null,
        difficultyId: difficultyId ? Number(difficultyId) : null,
        count: Number(count),
      };
      const res = await api.post('/questions/generate', payload);
      if (res.success && res.data) {
        setGeneratedQuestions(res.data);
        showToast(`Generated ${res.data.length} ${categoryName} questions!`, 'success');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTechIcon = (name) => {
    const map = { java: '☕', 'spring boot': '🍃', react: '⚛️', python: '🐍', sql: '🐬', docker: '🐳', nodejs: '🟢' };
    return map[name?.toLowerCase()] || '💻';
  };

  const tips = TIPS[categoryName] || [];

  return (
    <div className="space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* ── Hero Banner ── */}
      <div className={`relative overflow-hidden rounded-3xl p-8 ${gradient} shadow-2xl`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl drop-shadow-lg">{icon}</span>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                  {categoryName} Practice
                </h1>
                <p className="text-white/80 text-sm sm:text-base mt-0.5 font-medium">{description}</p>
              </div>
            </div>
            {/* Stat pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/20">
                🎯 {isAptitude ? 'Branch Independent' : 'Category-Focused'}
              </span>
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/20">
                ⚡ Instant Generation
              </span>
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white font-bold border border-white/20">
                📊 Interactive Quiz Included
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tips Card ── */}
      <div className="glass-card neon-border p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Pro Tips for {categoryName}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Generator Form ── */}
      <div className="glass-card neon-border p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Configure Your {categoryName} Session</h2>
          </div>
          {isAptitude && (
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showAdvancedFilters ? 'Hide Tech Filters' : 'Optional Tech Filters'}</span>
            </button>
          )}
        </div>

        {fetchingMeta ? (
          <SkeletonLoader count={2} />
        ) : (
          <form onSubmit={handleGenerate} className="space-y-5">

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Aptitude Universal Info Banner */}
            {isAptitude && !showAdvancedFilters && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-sm flex items-center gap-3">
                <span className="text-2xl shrink-0">✨</span>
                <div>
                  <strong className="block font-bold">Universal Aptitude Mode</strong>
                  <span className="text-xs text-slate-600 dark:text-amber-300/80">
                    Aptitude questions evaluate general quantitative ability, logical reasoning, and time management common for <strong>all engineering branches &amp; job roles</strong>. No programming language or technology selection required!
                  </span>
                </div>
              </div>
            )}

            {/* Tech, Role, Level Selectors (shown for non-Aptitude or if Advanced Filters toggled) */}
            {(!isAptitude || showAdvancedFilters) && (
              <div className="space-y-5 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                {/* Technology */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    1. Select Technology {isAptitude && '(Optional)'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((t) => {
                      const sel = String(technologyId) === String(t.id);
                      return (
                        <button
                          key={t.id} type="button"
                          onClick={() => { setTechnologyId(sel ? '' : t.id); setError(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                            sel
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg ring-2 ring-blue-500/40'
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

                {/* Job Role */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    2. Select Job Role {isAptitude && '(Optional)'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {jobRoles.map((r) => {
                      const sel = String(jobRoleId) === String(r.id);
                      return (
                        <button
                          key={r.id} type="button"
                          onClick={() => { setJobRoleId(sel ? '' : r.id); setError(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                            sel
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg ring-2 ring-indigo-500/40'
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

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    3. Select Experience Level {isAptitude && '(Optional)'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {experienceLevels.map((l) => {
                      const sel = String(experienceLevelId) === String(l.id);
                      return (
                        <button
                          key={l.id} type="button"
                          onClick={() => { setExperienceLevelId(sel ? '' : l.id); setError(''); }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                            sel
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-purple-500/40'
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
              </div>
            )}

            {/* Difficulty + Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty (Optional)
                </label>
                <select
                  value={difficultyId}
                  onChange={(e) => setDifficultyId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="">All Difficulties (Easy, Medium, Hard)</option>
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            {/* Category locked badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Questions will be locked to <strong className="text-slate-700 dark:text-slate-300">{categoryName}</strong> category only.</span>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-white font-black text-base shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${gradient}`}
              >
                {loading ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /><span>Generating...</span></>
                ) : (
                  <><Sparkles className="w-5 h-5" /><span>Generate {categoryName} Questions</span></>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : generatedQuestions.length > 0 ? (
        <InteractiveQuiz questions={generatedQuestions} showToast={showToast} />
      ) : null}
    </div>
  );
};

export default CategoryPracticePage;
