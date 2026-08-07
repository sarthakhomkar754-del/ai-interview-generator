import React from 'react';
import { Sparkles, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 transition-colors py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              AI Interview Question Generator
            </span>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            Built with Spring Boot 3, React 18 & MySQL
          </p>

          <div className="flex items-center space-x-4 text-slate-400 dark:text-slate-500">
            <a
              href="/swagger-ui/index.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              Swagger API Docs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
