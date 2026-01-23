"use client";

import { useEffect, useState } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface KeyMoment {
  time: string;
  topic: string;
}

interface KeyInsight {
  title: string;
  explanation: string;
}

interface Quote {
  text: string;
  speaker: string;
  context: string;
}

interface ActionItem {
  task: string;
  context: string;
  completed: boolean;
}

interface CraftAnalysis {
  openingHook: string;
  structurePattern: string;
  pacingNotes: string;
  stickyMoments: string;
  editingNotes: string;
}

interface SummaryResult {
  id: string;
  url: string;
  title: string;
  duration: string;
  speaker: string;
  tldr: string;
  comprehensiveSummary: string;
  scores: { ai: number; pm: number; growth: number };
  tags: { broad: string[]; specific: string[] };
  keyMoments: KeyMoment[];
  keyInsights: KeyInsight[];
  howThisApplies: { productBusiness: string; personal: string };
  critique: {
    claimsToVerify: Array<{
      claim: string;
      verdict: string;
      sourceUrl?: string;
    }>;
    holesInReasoning: string[];
    whatsMissing: string[];
    speakerBias: string;
  };
  quotes: Quote[];
  actionItems: ActionItem[];
  notesForLater: string[];
  craftAnalysis?: CraftAnalysis;
  groundingSources?: Array<{ title: string; uri: string }>;
  timestamp: number;
}

enum ViewState {
  HOME = "HOME",
  LOADING = "LOADING",
  RESULT = "RESULT",
  HISTORY = "HISTORY",
}

// ============================================================================
// STORAGE SERVICE
// ============================================================================

const STORAGE_KEY = "tubecritique_summaries";

const storageService = {
  saveSummary: (summary: SummaryResult) => {
    if (typeof window === "undefined") return;
    const existing = storageService.getHistory();
    const updated = [summary, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getHistory: (): SummaryResult[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  updateSummary: (summaryId: string, updatedSummary: SummaryResult) => {
    if (typeof window === "undefined") return;
    const existing = storageService.getHistory();
    const updated = existing.map((item) =>
      item.id === summaryId ? updatedSummary : item,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
};

// ============================================================================
// API SERVICE
// ============================================================================

interface ApiError {
  error: string;
  videoTitle?: string;
  videoChannel?: string;
  videoUrl?: string;
}

async function analyzeVideo(videoUrl: string): Promise<SummaryResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoUrl }),
  });

  const data = await response.json();

  if (!response.ok) {
    const apiError = data as ApiError;
    // Create enriched error with video details
    const errorMessage = apiError.videoTitle
      ? `${apiError.error}|VIDEO_INFO|${apiError.videoTitle}|${apiError.videoChannel || "Unknown"}|${apiError.videoUrl || ""}`
      : apiError.error;
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================================================
// COMPONENTS
// ============================================================================

function Header({
  onGoHome,
  onGoHistory,
}: {
  onGoHome: () => void;
  onGoHistory: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div
          onClick={onGoHome}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            TubeCritique <span className="text-red-500">AI</span>
          </span>
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
            <span className="text-sm text-zinc-500 hidden sm:inline">
              Guest User
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-zinc-700"></div>
          </div>
        </nav>
      </div>
    </header>
  );
}

function ScoreDots({ score, max = 5 }: { score: number; max?: number }) {
  const filled = Math.min(score || 0, max);
  const empty = max - filled;
  return (
    <span className="font-mono">
      {"●".repeat(filled)}
      {"○".repeat(empty)}
    </span>
  );
}

function SectionDivider() {
  return <hr className="border-zinc-800 my-8" />;
}

function SummaryView({
  result,
  onToggleActionItem,
}: {
  result: SummaryResult;
  onToggleActionItem: (index: number) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          {result.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <span>
            <strong className="text-zinc-300">Source:</strong>{" "}
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 hover:underline"
            >
              {result.url}
            </a>
          </span>
          <span>
            <strong className="text-zinc-300">Duration:</strong>{" "}
            {result.duration}
          </span>
          <span>
            <strong className="text-zinc-300">Speaker:</strong> {result.speaker}
          </span>
        </div>
      </div>

      <SectionDivider />

      {/* TL;DR */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">TL;DR</h2>
        <p className="text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-white/5">
          {result.tldr}
        </p>
      </section>

      <SectionDivider />

      {/* Comprehensive Summary */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Comprehensive Summary
        </h2>
        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed bg-zinc-900/30 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">
          {result.comprehensiveSummary}
        </div>
      </section>

      <SectionDivider />

      {/* Relevance Score */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Relevance Score</h2>
        <div className="bg-zinc-900/30 p-6 rounded-xl border border-white/5 space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 w-48">AI/Tech:</span>
            <span className="text-blue-400">
              <ScoreDots score={result.scores?.ai || 0} />
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 w-48">Product Management:</span>
            <span className="text-purple-400">
              <ScoreDots score={result.scores?.pm || 0} />
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 w-48">Entrepreneurship/Growth:</span>
            <span className="text-emerald-400">
              <ScoreDots score={result.scores?.growth || 0} />
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Tags */}
      {result.tags && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
          <div className="space-y-3">
            <div>
              <span className="text-zinc-400 text-sm">Broad: </span>
              <span className="flex flex-wrap gap-2 mt-1">
                {(result.tags.broad || []).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm"
                  >
                    [{tag}]
                  </span>
                ))}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 text-sm">Specific: </span>
              <span className="flex flex-wrap gap-2 mt-1">
                {(result.tags.specific || []).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-zinc-700 text-zinc-200 px-3 py-1 rounded-full text-sm"
                  >
                    [{tag}]
                  </span>
                ))}
              </span>
            </div>
          </div>
        </section>
      )}

      <SectionDivider />

      {/* Key Moments */}
      {result.keyMoments && result.keyMoments.length > 0 && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Key Moments with Timestamps
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-zinc-400 font-semibold py-2 px-4 w-24">
                      Time
                    </th>
                    <th className="text-zinc-400 font-semibold py-2 px-4">
                      Topic
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.keyMoments.map((moment, i) => (
                    <tr key={i} className="border-b border-zinc-800">
                      <td className="text-blue-400 font-mono py-2 px-4">
                        {moment.time}
                      </td>
                      <td className="text-zinc-300 py-2 px-4">
                        {moment.topic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* Key Insights */}
      {result.keyInsights && result.keyInsights.length > 0 && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Key Insights</h2>
            <div className="space-y-6">
              {result.keyInsights.map((insight, i) => (
                <div
                  key={i}
                  className="bg-zinc-900/30 p-5 rounded-xl border border-white/5"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {i + 1}. {insight.title}
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {insight.explanation}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* How This Applies */}
      {result.howThisApplies && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              How This Applies to Me
            </h2>
            <div className="space-y-4">
              <div className="bg-zinc-900/30 p-5 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">
                  Product/Business Parallels
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {result.howThisApplies.productBusiness}
                </p>
              </div>
              <div className="bg-zinc-900/30 p-5 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">
                  Personal Relevance
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {result.howThisApplies.personal}
                </p>
              </div>
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* Critique */}
      {result.critique && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Critique & Fact-Check
            </h2>
            <div className="space-y-6">
              {result.critique.claimsToVerify &&
                result.critique.claimsToVerify.length > 0 && (
                  <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-3">
                      Claims to Verify
                    </h3>
                    <div className="space-y-3">
                      {result.critique.claimsToVerify.map((check, i) => (
                        <div
                          key={i}
                          className="border-l-2 border-zinc-700 pl-4"
                        >
                          <p className="text-sm text-white mb-1">
                            &quot;{check.claim}&quot;
                          </p>
                          <p
                            className={`text-sm font-medium ${check.verdict?.toLowerCase().includes("true") || check.verdict?.toLowerCase().includes("verified") ? "text-emerald-400" : "text-amber-400"}`}
                          >
                            — {check.verdict}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {result.critique.holesInReasoning &&
                result.critique.holesInReasoning.length > 0 && (
                  <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">
                      Holes in Reasoning
                    </h3>
                    <ul className="list-disc list-inside text-zinc-300 text-sm space-y-1">
                      {result.critique.holesInReasoning.map((hole, i) => (
                        <li key={i}>{hole}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {result.critique.speakerBias && (
                <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">
                    Speaker Bias/Incentives
                  </h3>
                  <p className="text-zinc-300 text-sm">
                    {result.critique.speakerBias}
                  </p>
                </div>
              )}
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* Quotes */}
      {result.quotes && result.quotes.length > 0 && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Reusable Quotes
            </h2>
            <div className="space-y-4">
              {result.quotes.map((quote, i) => (
                <blockquote
                  key={i}
                  className="border-l-4 border-zinc-600 pl-4 py-2"
                >
                  <p className="text-zinc-200 italic text-lg">
                    &quot;{quote.text}&quot;
                  </p>
                  <footer className="text-zinc-400 text-sm mt-1">
                    — {quote.speaker} on {quote.context}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* Action Items */}
      {result.actionItems && result.actionItems.length > 0 && (
        <>
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Action Items</h2>
            <div className="space-y-3">
              {result.actionItems.map((item, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 bg-zinc-900/30 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-zinc-900/50 transition-colors select-none ${
                    item.completed ? "opacity-60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleActionItem(i)}
                    className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <p
                      className={`font-medium ${item.completed ? "text-zinc-500 line-through" : "text-white"}`}
                    >
                      {item.task}
                    </p>
                    <p className="text-zinc-400 text-sm">{item.context}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
          <SectionDivider />
        </>
      )}

      {/* Notes */}
      {result.notesForLater && result.notesForLater.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Notes for Later</h2>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 bg-zinc-900/30 p-5 rounded-xl border border-white/5">
            {result.notesForLater.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [url, setUrl] = useState("");
  const [currentResult, setCurrentResult] = useState<SummaryResult | null>(
    null,
  );
  const [history, setHistory] = useState<SummaryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setHistory(storageService.getHistory());
  }, []);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setError(null);
    setViewState(ViewState.LOADING);

    try {
      const result = await analyzeVideo(url);
      setCurrentResult(result);
      storageService.saveSummary(result);
      setHistory(storageService.getHistory());
      setViewState(ViewState.RESULT);
      setUrl("");
    } catch (err) {
      // console.error(err);
      setError((err as Error).message || "An unexpected error occurred");
      setViewState(ViewState.HOME);
    }
  };

  const handleToggleActionItem = (index: number) => {
    if (!currentResult) return;

    const updatedActionItems = currentResult.actionItems.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item,
    );

    const updatedResult = { ...currentResult, actionItems: updatedActionItems };
    setCurrentResult(updatedResult);
    storageService.updateSummary(currentResult.id, updatedResult);
    setHistory(storageService.getHistory());
  };

  const filteredHistory = history.filter(
    (item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tldr?.toLowerCase().includes(searchQuery.toLowerCase()),
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
              Gemini Powered
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Deep Intelligence <br />
              <span className="text-zinc-500">For Every Video.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mb-12 leading-relaxed">
              Don&apos;t just summarize. Critique. Verify. Extract. <br />
              TubeCritique uses multimodal AI to fact-check claims and score
              content relevance across engineering and growth domains.
            </p>

            <form
              onSubmit={handleSummarize}
              className="w-full max-w-2xl relative"
            >
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
              <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-left max-w-2xl">
                {error.includes("|VIDEO_INFO|") ? (
                  <>
                    {(() => {
                      const parts = error.split("|VIDEO_INFO|");
                      const errorMsg = parts[0];
                      const videoInfo = parts[1]?.split("|") || [];
                      const [videoTitle, videoChannel, videoUrl] = videoInfo;
                      return (
                        <>
                          <div className="mb-4 pb-4 border-b border-red-500/20">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
                              Video Found
                            </p>
                            <p className="text-white font-semibold">
                              {videoTitle}
                            </p>
                            <p className="text-zinc-400 text-sm">
                              by {videoChannel}
                            </p>
                            {videoUrl && (
                              <a
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:underline mt-1 inline-block"
                              >
                                {videoUrl}
                              </a>
                            )}
                          </div>
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <div>
                              <p className="text-red-400 font-medium">
                                {errorMsg}
                              </p>
                              <p className="text-zinc-500 text-xs mt-1">
                                This video doesn&apos;t have subtitles/closed
                                captions. Try a video with CC enabled.
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <p className="text-red-400 text-sm">{error}</p>
                )}
              </div>
            )}
          </div>
        )}

        {viewState === ViewState.LOADING && (
          <div className="container mx-auto px-4 py-32 flex flex-col items-center text-center animate-pulse">
            <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Engaging Intelligence Engine...
            </h2>
            <p className="text-zinc-500">
              Extracting content, scoring relevance, and fact-checking claims
              with Google Search Grounding.
            </p>
          </div>
        )}

        {viewState === ViewState.RESULT && currentResult && (
          <SummaryView
            result={currentResult}
            onToggleActionItem={handleToggleActionItem}
          />
        )}

        {viewState === ViewState.HISTORY && (
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-black text-white mb-1">
                  Intelligence Vault
                </h1>
                <p className="text-zinc-500 text-sm">
                  Access all your analyzed video summaries and critiques.
                </p>
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
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">
                          AI: {item.scores?.ai || 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">
                          PM: {item.scores?.pm || 0}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-3 mb-4">
                      {item.tldr}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-red-500 font-bold uppercase tracking-wider">
                      View Deep Report
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
                <p className="text-zinc-600 italic">
                  No historical insights found matching your search.
                </p>
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
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Analysis
          </button>
        </div>
      )}
    </div>
  );
}
