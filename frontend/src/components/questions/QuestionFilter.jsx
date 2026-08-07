import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const QuestionFilter = ({
  technologies = [],
  jobRoles = [],
  experienceLevels = [],
  categories = [],
  difficulties = [],
  filters = {},
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold text-sm uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-500" />
          <span>Filter Questions</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Technology */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Technology
          </label>
          <select
            value={filters.technologyId || ''}
            onChange={(e) => onFilterChange('technologyId', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Technologies</option>
            {technologies.map((t) => (
              <option key={t.id} value={t.id}>
                {t.technologyName}
              </option>
            ))}
          </select>
        </div>

        {/* Job Role */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Job Role
          </label>
          <select
            value={filters.jobRoleId || ''}
            onChange={(e) => onFilterChange('jobRoleId', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Job Roles</option>
            {jobRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Experience Level
          </label>
          <select
            value={filters.experienceLevelId || ''}
            onChange={(e) => onFilterChange('experienceLevelId', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Levels</option>
            {experienceLevels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.levelName}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Category
          </label>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => onFilterChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Difficulty
          </label>
          <select
            value={filters.difficultyId || ''}
            onChange={(e) => onFilterChange('difficultyId', e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Difficulties</option>
            {difficulties.map((d) => (
              <option key={d.id} value={d.id}>
                {d.difficultyName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default QuestionFilter;
