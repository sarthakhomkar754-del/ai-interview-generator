import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Bookmark, Sparkles, PlusCircle } from 'lucide-react';
import QuestionCard from '../components/questions/QuestionCard';
import QuestionSearch from '../components/questions/QuestionSearch';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Toast from '../components/common/Toast';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchFavorites();
  }, [search]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/favorites', { params: { search } });
      if (res.success && res.data) {
        setFavorites(res.data);
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (questionId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((f) => f.question.id !== questionId));
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  return (
    <div className="space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-3">
            <Bookmark className="w-8 h-8 text-amber-500 fill-amber-500" />
            <span>Saved Favorites</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Access your bookmarked interview questions anytime
          </p>
        </div>

        <div className="w-full md:w-80">
          <QuestionSearch search={search} onSearchChange={setSearch} placeholder="Search saved favorites..." />
        </div>
      </div>

      {/* Favorites List */}
      {loading ? (
        <SkeletonLoader count={3} />
      ) : favorites.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Favorite Questions Saved</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            When you generate questions, click the bookmark icon on any question card to save it here for future study sessions.
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Questions Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {favorites.map((fav) => (
            <QuestionCard
              key={fav.id}
              question={fav.question}
              showToast={showToast}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
