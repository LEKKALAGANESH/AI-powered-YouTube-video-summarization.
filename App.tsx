
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SummaryView } from './components/SummaryView';
import { SummaryResult, ViewState } from './types';
import { storageService } from './services/storageService';
import { generateVideoCritique } from './services/geminiService';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [url, setUrl] = useState('');
  const [currentResult, setCurrentResult] = useState<SummaryResult | null>(null);
  const [history, setHistory] = useState<SummaryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setError(null);
    setViewState(ViewState.LOADING);

    try {
      const result = await generateVideoCritique(url);
      setCurrentResult(result);
      storageService.saveSummary(result);
      setHistory(storageService.getHistory());
      setViewState(ViewState.RESULT);
      setUrl('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      setViewState(ViewState.HOME);
    }
  };

  const filteredHistory = history.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-300">
      <Header 
        onGoHome={() => setViewState(ViewState.HOME)} 
        onGoHistory={() => setViewState(ViewState.HISTORY)} 
      />

      <main className="flex-1 overflow-y-auto">
        {viewState === ViewState.HOME && (
          <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Gemini 3 Pro Powered
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Deep Intelligence <br /> <span className="text-zinc-500">For Every Video.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              Don't just summarize. Critique. Verify. Extract. <br />
              TubeCritique uses multimodal AI to fact-check claims and score content relevance across engineering and growth domains.
            </p>

            <form onSubmit={handleSummarize} className="w-full max-w-2xl relative">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube Video URL..."
                className="w-full h-16 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 pr-32 text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all shadow-2xl shadow-red-900/10"
              />
              <button 
                type="submit"
                disabled={!url}
                className="absolute right-2 top-2 bottom-2 px-6 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:bg-zinc-800 text-white font-bold rounded-xl transition-all"
              >
                Analyze
              </button>
            </form>
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {viewState === ViewState.LOADING && (
          <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center animate-pulse">
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Engaging Intelligence Engine...</h2>
            <p className="text-zinc-500">Extracting content, scoring relevance, and fact-checking claims with Google Search Grounding.</p>
          </div>
        )}

        {viewState === ViewState.RESULT && currentResult && (
          <SummaryView result={currentResult} />
        )}

        {viewState === ViewState.HISTORY && (
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-black text-white mb-1">Intelligence Vault</h1>
                <p className="text-zinc-500 text-sm">Access all your analyzed video summaries and critiques.</p>
              </div>
              <div className="relative w-full sm:w-80">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search insights..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500/50"
                />
              </div>
            </div>

            {filteredHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHistory.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      setCurrentResult(item);
                      setViewState(ViewState.RESULT);
                    }}
                    className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-red-500/50 hover:bg-zinc-900 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">AI: {item.scores.ai}</span>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">PM: {item.scores.pm}</span>
                      </div>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-3 mb-4">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-red-500 font-bold uppercase tracking-wider">
                      View Deep Report 
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-600 italic">No historical insights found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {viewState === ViewState.RESULT && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => setViewState(ViewState.HOME)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
