import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { History as HistoryIcon, Clock, Sparkles, Layers } from 'lucide-react';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';

const History = () => {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/history');
      if (res.success && res.data) {
        setHistoryLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
          <HistoryIcon className="w-8 h-8 text-purple-500" />
          <span>Generation History</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Review your past interview question generation sessions
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={4} />
      ) : historyLogs.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Generation History Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            You haven't generated any question sets yet. Start by generating questions for your target stack.
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate First Set</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {historyLogs.map((log) => (
            <div
              key={log.id}
              className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {log.technologyName}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                    {log.jobRoleName}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                    {log.experienceLevelName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>Category: <strong>{log.categoryName}</strong></span>
                  <span>•</span>
                  <span>Difficulty: <strong>{log.difficultyName}</strong></span>
                  <span>•</span>
                  <span>Questions Count: <strong>{log.questionCount}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono block">
                    {new Date(log.generatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <Link
                  to={`/generate`}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                  title="Generate similar questions"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
