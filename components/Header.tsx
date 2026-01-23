
import React from 'react';

interface HeaderProps {
  onGoHome: () => void;
  onGoHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGoHome, onGoHistory }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TubeCritique <span className="text-red-500">AI</span></span>
        </div>

        <nav className="flex items-center gap-6">
          <button 
            onClick={onGoHistory}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            History
          </button>
          <div className="h-8 w-[1px] bg-zinc-800"></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500 hidden sm:inline">Guest User</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-700"></div>
          </div>
        </nav>
      </div>
    </header>
  );
};
