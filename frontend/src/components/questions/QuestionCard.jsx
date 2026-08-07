import React, { useState } from 'react';
import { Bookmark, ChevronDown, ChevronUp, Copy, Check, Share2, Sparkles, Code, Cpu, Database } from 'lucide-react';
import api from '../../api/axiosConfig';

const QuestionCard = ({ question, onFavoriteToggle, showToast }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(question.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      setFavLoading(true);
      if (isFavorite) {
        await api.delete(`/favorites/${question.id}`);
        setIsFavorite(false);
        if (showToast) showToast('Removed from favorites', 'info');
      } else {
        await api.post(`/favorites/${question.id}`);
        setIsFavorite(true);
        if (showToast) showToast('Saved to favorites!', 'success');
      }
      if (onFavoriteToggle) onFavoriteToggle(question.id, !isFavorite);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update favorite status', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `Q: ${question.question}\n\nA: ${question.answer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (showToast) showToast('Copied question and answer!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const textToCopy = `${window.location.origin}/questions/${question.id}`;
    navigator.clipboard.writeText(textToCopy);
    if (showToast) showToast('Direct link copied to clipboard!', 'info');
  };

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'hard':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  const getTechIcon = (techName) => {
    switch (techName?.toLowerCase()) {
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

  return (
    <div className="glass-card neon-border hover-lift rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl transition-all duration-300">
      
      {/* Badges Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center space-x-1.5 shadow-sm">
            <span>{getTechIcon(question.technologyName)}</span>
            <span>{question.technologyName}</span>
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            {question.jobRoleName}
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {question.experienceLevelName}
          </span>

          {question.categoryName && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {question.categoryName}
            </span>
          )}
        </div>

        <span className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full border ${getDifficultyColor(question.difficultyName)}`}>
          {question.difficultyName}
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug mb-4">
        {question.question}
      </h3>

      {/* Expandable Answer Section */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-5 rounded-2xl text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap transition-all shadow-inner border border-blue-500/10">
          <div className="flex items-center space-x-2 mb-2 font-bold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
            <span>Detailed Answer & Code Solution:</span>
          </div>
          {question.answer}
        </div>
      )}

      {/* Card Action Buttons */}
      <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>{expanded ? 'Hide Explanation' : 'View Explanation'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy Question and Answer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share Direct Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className={`p-2 rounded-xl transition-colors ${
              isFavorite
                ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Save Favorite'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
