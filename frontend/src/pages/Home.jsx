import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Bookmark, Search, Code, Cpu, Database } from 'lucide-react';
import api from '../api/axiosConfig';
import QuestionCard from '../components/questions/QuestionCard';

const Home = () => {
  const [sampleQuestions, setSampleQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSampleQuestions();
  }, []);

  const fetchSampleQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/questions');
      if (res.success && res.data) {
        setSampleQuestions(res.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load sample questions', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent p-8 sm:p-14 border border-blue-500/20 shadow-2xl">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Interview Preparation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Ace Your Next Technical Interview with <span className="gradient-text">Precision</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Instantly generate tailored, high-frequency interview questions categorized by technology, experience level, job role, and difficulty. Master technical concepts, coding solutions, SQL queries, and HR scenarios.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/practice"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-base shadow-xl shadow-blue-500/30 hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Explore Practice Hub</span>
            </Link>

            <Link
              to="/practice/aptitude"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/50 hover:bg-white/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-extrabold text-base border border-slate-300 dark:border-slate-700 shadow-sm backdrop-blur-sm transition-all flex items-center justify-center space-x-2 hover:scale-105 hover:border-slate-400 dark:hover:border-slate-500"
            >
              <span>🧮 Aptitude Practice</span>
            </Link>
          </div>

          {/* Quick Features List */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Fresher to Experienced
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Spring Boot + React + MySQL
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Export & Save Favorites
            </span>
          </div>
        </div>
      </section>

      {/* Popular Technologies Badge Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Supported Tech Stack & Roles</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate interview questions for any stack</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Java', desc: 'Core & JVM', icon: Code, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
            { name: 'Spring Boot', desc: 'Enterprise', icon: Cpu, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
            { name: 'React.js', desc: 'Frontend', icon: Sparkles, color: 'text-sky-500 bg-sky-500/10 border-sky-500/20' },
            { name: 'SQL', desc: 'Database Queries', icon: Database, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
            { name: 'Python', desc: 'Backend & Data', icon: Code, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
            { name: 'Docker', desc: 'DevOps & Cloud', icon: Cpu, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl border ${item.color} text-center space-y-2 hover:scale-105 transition-transform cursor-pointer`}>
                <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Question Engine</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Select tech, job role, experience level, and difficulty. Our system immediately fetches and synthesizes matching question sets.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save & Organize Favorites</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Bookmark crucial interview questions to build your personalized revision library accessible anytime from your account dashboard.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Production Security</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Secured using JWT tokens, BCrypt password hashing, stateless Spring Security filters, and full RBAC for standard users and admins.
          </p>
        </div>
      </section>

      {/* Live Sample Questions Section */}
      {sampleQuestions.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Featured Interview Questions</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Explore sample technical questions generated by our engine</p>
            </div>
            <Link
              to="/generate"
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
