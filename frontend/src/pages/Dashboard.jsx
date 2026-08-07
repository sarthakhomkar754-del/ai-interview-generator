import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Sparkles, Bookmark, History, Layers, Code, ArrowRight, Clock, PlusCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import QuestionCard from '../components/questions/QuestionCard';
import Toast from '../components/common/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard statistics..." />;
  }

  return (
    <div className="space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header Banner */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Track your interview practice metrics, recent question sets, and saved favorites.
          </p>
        </div>

        <Link
          to="/generate"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition-all flex items-center space-x-2 self-start md:self-auto"
        >
          <Sparkles className="w-5 h-5" />
          <span>Quick Generate</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Database Questions</span>
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalQuestions || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Favorites</span>
            <Bookmark className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalFavorites || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-purple-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generations Run</span>
            <History className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalGeneratedSessions || 0}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Technologies</span>
            <Code className="w-5 h-5" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalTechnologies || 0}</p>
        </div>
      </div>

      {/* Main Grid: Recent History + Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Generation Sessions */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Generations</h2>
            </div>
            <Link to="/history" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All History
            </Link>
          </div>

          {stats?.recentHistories?.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">No question sets generated yet.</p>
              <Link
                to="/generate"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Generate your first set</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentHistories?.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{item.technologyName}</span>
                      <span className="text-xs text-slate-400">• {item.jobRoleName}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.experienceLevelName} | {item.difficultyName} | {item.questionCount} Questions
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(item.generatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Favorites Preview */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Favorites</h2>
            </div>
            <Link to="/favorites" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              View All ({stats?.totalFavorites})
            </Link>
          </div>

          {stats?.recentFavorites?.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
              No saved favorite questions yet. Click the bookmark icon on any question to save it here.
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentFavorites?.map((q) => (
                <QuestionCard key={q.id} question={q} showToast={showToast} onFavoriteToggle={fetchDashboardStats} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
