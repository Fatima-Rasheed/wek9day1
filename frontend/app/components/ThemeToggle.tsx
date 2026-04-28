'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Show placeholder during SSR
  if (!mounted) {
    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100">
        <div className="w-5 h-5" />
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        console.log('Theme toggle clicked, current theme:', theme);
        toggleTheme();
      }}
      className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-indigo-100 dark:border-gray-700 group"
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-90 transition-transform" />
      )}
    </button>
  );
}
