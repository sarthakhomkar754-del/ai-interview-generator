import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles, LayoutDashboard, Bookmark, History, User, Shield,
  ChevronDown, ChevronRight, Calculator, Code2, MessageSquare,
  Database, Cpu, BookOpen
} from 'lucide-react';

const CATEGORY_LINKS = [
  { name: 'Aptitude',  path: '/practice/aptitude',  icon: '🧮', color: 'text-amber-500' },
  { name: 'Coding',    path: '/practice/coding',    icon: '💻', color: 'text-violet-500' },
  { name: 'HR',        path: '/practice/hr',        icon: '🤝', color: 'text-emerald-500' },
  { name: 'SQL',       path: '/practice/sql',       icon: '🐬', color: 'text-sky-500' },
  { name: 'Technical', path: '/practice/technical', icon: '⚙️', color: 'text-slate-500' },
];

const Sidebar = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [practiceOpen, setPracticeOpen] = useState(true);
  const location = useLocation();

  if (['/', '/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const mainLinks = [
    { name: 'Generate Questions', path: '/generate',  icon: Sparkles,       color: 'text-blue-500' },
    { name: 'Dashboard',          path: '/dashboard', icon: LayoutDashboard, color: 'text-emerald-500' },
    { name: 'Saved Favorites',    path: '/favorites', icon: Bookmark,        color: 'text-amber-500' },
    { name: 'History Logs',       path: '/history',   icon: History,         color: 'text-purple-500' },
    { name: 'My Profile',         path: '/profile',   icon: User,            color: 'text-sky-500' },
  ];

  return (
    <aside className="w-64 glass-card bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 gap-6">

      {/* ── Main Navigation ── */}
      {isAuthenticated && (
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            User Workspace
          </h3>
          <div className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className={`w-5 h-5 ${link.color}`} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Practice Hub Section ── */}
      <div>
        {/* Section header with collapse toggle */}
        <button
          type="button"
          onClick={() => setPracticeOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 mb-2 group"
        >
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            Practice Hub
          </h3>
          {practiceOpen
            ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          }
        </button>

        {/* Browse All link */}
        <NavLink
          to="/practice"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`
          }
        >
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <span>Browse All Categories</span>
        </NavLink>

        {/* Category links (collapsible) */}
        {practiceOpen && (
          <div className="space-y-0.5 pl-2 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
            {CATEGORY_LINKS.map((cat) => (
              <NavLink
                key={cat.path}
                to={cat.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                  }`
                }
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span>{cat.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* ── Admin Section ── */}
      {isAdmin && (
        <div className="mt-auto">
          <h3 className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Administration
          </h3>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Shield className="w-5 h-5 text-indigo-500" />
            <span>Admin Dashboard</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
