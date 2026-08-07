import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Trophy, Brain } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Aptitude',
    path: '/practice/aptitude',
    icon: '🧮',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/50',
    tag: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    description: 'Numerical reasoning, percentages, ratios, time-work, and logical puzzles.',
    topics: ['Speed & Distance', 'Profit & Loss', 'Permutation', 'Time & Work', 'Percentages'],
    questionCount: '13+',
    badge: '🎯 Placement Test Prep',
  },
  {
    name: 'Coding',
    path: '/practice/coding',
    icon: '💻',
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    lightBg: 'bg-violet-50 dark:bg-violet-950/30',
    border: 'border-violet-200 dark:border-violet-800/50',
    tag: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
    description: 'DSA problems, algorithm implementation, and coding challenges.',
    topics: ['Arrays & Strings', 'Linked Lists', 'Binary Search', 'Recursion', 'Hashing'],
    questionCount: '8+',
    badge: '⚡ DSA Practice',
  },
  {
    name: 'HR',
    path: '/practice/hr',
    icon: '🤝',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    tag: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description: 'Behavioral questions using STAR method, self-introduction, and situational scenarios.',
    topics: ['Tell Me About Yourself', 'STAR Method', 'Conflict Resolution', 'Career Goals', 'Leadership'],
    questionCount: '6+',
    badge: '🌟 Soft Skills',
  },
  {
    name: 'SQL',
    path: '/practice/sql',
    icon: '🐬',
    gradient: 'from-sky-500 via-blue-500 to-cyan-600',
    lightBg: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-800/50',
    tag: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    description: 'JOIN operations, subqueries, normalization, indexing, and SQL transaction management.',
    topics: ['JOINs', 'Subqueries', 'Normalization', 'Indexes', 'ACID'],
    questionCount: '8+',
    badge: '🗄️ Database Mastery',
  },
  {
    name: 'Technical',
    path: '/practice/technical',
    icon: '⚙️',
    gradient: 'from-slate-700 via-blue-800 to-indigo-800',
    lightBg: 'bg-slate-50 dark:bg-slate-900/50',
    border: 'border-slate-200 dark:border-slate-700/50',
    tag: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20',
    description: 'Framework internals, system architecture, design patterns, and technology-specific theory.',
    topics: ['Java / Spring Boot', 'React / Node.js', 'Design Patterns', 'Security', 'Performance'],
    questionCount: '11+',
    badge: '🔧 Tech Deep-Dive',
  },
];

const PracticeHub = () => {
  return (
    <div className="space-y-10">

      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
          <Brain className="w-4 h-4 animate-pulse" />
          <span>Interview Practice Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Choose Your <span className="gradient-text">Practice Category</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Select a focused category to practice targeted questions. Each category generates only relevant, category-specific questions.
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: '📦', value: '5', label: 'Categories' },
          { icon: '❓', value: '47+', label: 'Unique Questions' },
          { icon: '🏆', value: '100%', label: 'Category Locked' },
        ].map((s) => (
          <div key={s.label} className="glass-card neon-border p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-md">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-black gradient-text">{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Category Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}
            className={`group relative overflow-hidden rounded-3xl border ${cat.border} ${cat.lightBg} p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4`}
          >
            {/* Gradient accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient} rounded-t-3xl`} />

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl drop-shadow">{cat.icon}</span>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{cat.name}</h2>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${cat.tag}`}>
                    {cat.badge}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cat.description}</p>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-1.5">
              {cat.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Footer row */}
            <div className={`mt-auto flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-700/50`}>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                📚 {cat.questionCount} Questions Available
              </span>
              <span className={`px-3 py-1.5 text-xs font-extrabold rounded-xl bg-gradient-to-r ${cat.gradient} text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                Practice Now →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="glass-card neon-border p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Want mixed questions?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Use the full generator to mix categories, tech stacks, and difficulties in one session.</p>
          </div>
        </div>
        <Link
          to="/generate"
          className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Open Full Generator
        </Link>
      </div>

    </div>
  );
};

export default PracticeHub;
