import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
        <Sparkles className="w-10 h-10 animate-bounce" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
        The requested URL was not found on this server.
      </p>
      <div className="flex space-x-3">
        <Link
          to="/"
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
