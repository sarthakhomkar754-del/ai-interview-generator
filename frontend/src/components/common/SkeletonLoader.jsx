import React from 'react';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="glass-card p-6 rounded-2xl animate-pulse space-y-4 border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
