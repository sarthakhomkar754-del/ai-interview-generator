import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ArrowLeft, Sparkles } from 'lucide-react';
import QuestionCard from '../components/questions/QuestionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';

const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchQuestionDetails();
  }, [id]);

  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/questions/${id}`);
      if (res.success && res.data) {
        setQuestion(res.data);
      }
    } catch (err) {
      setError(err.message || 'Question not found');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  if (loading) return <LoadingSpinner text="Fetching question details..." />;

  if (error) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-rose-500 font-bold text-lg">{error}</p>
        <Link to="/generate" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          Back to Question Generator
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      <Link
        to="/generate"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Generator</span>
      </Link>

      {question && <QuestionCard question={question} showToast={showToast} />}
    </div>
  );
};

export default QuestionDetails;
