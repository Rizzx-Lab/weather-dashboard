import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-dark-card 
               shadow-lg hover:shadow-xl transition-all duration-300 
               border border-gray-200 dark:border-dark-border
               hover:scale-105 active:scale-95"
      aria-label="Toggle dark mode"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <FiSun className={`text-yellow-500 text-xl transition-all duration-300 ${
          isDarkMode ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'
        }`} />
        <FiMoon className={`text-blue-400 text-xl absolute transition-all duration-300 ${
          isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'
        }`} />
      </div>
      <span className="sr-only">
        {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;