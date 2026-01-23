
import React from 'react';
import { SummaryResult } from '../types';

interface SummaryViewProps {
  result: SummaryResult;
}

const ScoreDots: React.FC<{ score: number; max?: number }> = ({ score, max = 5 }) => {
  const filled = Math.min(score, max);
  const empty = max - filled;
  return (
    <span className="font-mono">
      {'●'.repeat(filled)}{'○'.repeat(empty)}
    </span>
  );
};

const SectionDivider: React.FC = () => (
  <hr className="border-zinc-800 my-8" />
);

export const SummaryView: React.FC<SummaryViewProps> = ({ result }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
          {result.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <span><strong className="text-zinc-300">Source:</strong>{' '}
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">
              {result.url}
            </a>
          </span>
          <span><strong className="text-zinc-300">Duration:</strong> {result.duration}</span>
          <span><strong className="text-zinc-300">Speaker:</strong> {result.speaker}</span>
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
        <h2 className="text-xl font-bold text-white mb-4">Comprehensive Summary</h2>
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
            <span className="text-blue-400"><ScoreDots score={result.scores.ai} /></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 w-48">Product Management:</span>
            <span className="text-purple-400"><ScoreDots score={result.scores.pm} /></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 w-48">Entrepreneurship/Growth:</span>
            <span className="text-emerald-400"><ScoreDots score={result.scores.growth} /></span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Tags */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
        <div className="space-y-3">
          <div>
            <span className="text-zinc-400 text-sm">Broad: </span>
            <span className="flex flex-wrap gap-2 mt-1">
              {result.tags.broad.map((tag, i) => (
                <span key={i} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">[{tag}]</span>
              ))}
            </span>
          </div>
          <div>
            <span className="text-zinc-400 text-sm">Specific: </span>
            <span className="flex flex-wrap gap-2 mt-1">
              {result.tags.specific.map((tag, i) => (
                <span key={i} className="bg-zinc-700 text-zinc-200 px-3 py-1 rounded-full text-sm">[{tag}]</span>
              ))}
            </span>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Key Moments with Timestamps */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Key Moments with Timestamps</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-zinc-400 font-semibold py-2 px-4 w-24">Time</th>
                <th className="text-zinc-400 font-semibold py-2 px-4">Topic</th>
              </tr>
            </thead>
            <tbody>
              {result.keyMoments.map((moment, i) => (
                <tr key={i} className="border-b border-zinc-800">
                  <td className="text-blue-400 font-mono py-2 px-4">{moment.time}</td>
                  <td className="text-zinc-300 py-2 px-4">{moment.topic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider />

      {/* Key Insights */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Key Insights</h2>
        <div className="space-y-6">
          {result.keyInsights.map((insight, i) => (
            <div key={i} className="bg-zinc-900/30 p-5 rounded-xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-2">{i + 1}. {insight.title}</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{insight.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* How This Applies to Me */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">How This Applies to Me</h2>
        <div className="space-y-4">
          <div className="bg-zinc-900/30 p-5 rounded-xl border border-white/5">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">Product/Business Parallels</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">{result.howThisApplies.productBusiness}</p>
          </div>
          <div className="bg-zinc-900/30 p-5 rounded-xl border border-white/5">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">Personal Relevance</h3>
            <p className="text-zinc-300 text-sm leading-relaxed">{result.howThisApplies.personal}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Critique & Fact-Check */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Critique & Fact-Check
        </h2>

        <div className="space-y-6">
          {/* Claims to Verify */}
          <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-3">Claims to Verify</h3>
            <div className="space-y-3">
              {result.critique.claimsToVerify.map((check, i) => (
                <div key={i} className="border-l-2 border-zinc-700 pl-4">
                  <p className="text-sm text-white mb-1">"{check.claim}"</p>
                  <p className={`text-sm font-medium ${check.verdict.toLowerCase().includes('true') || check.verdict.toLowerCase().includes('verified') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    — {check.verdict}
                  </p>
                  {check.sourceUrl && (
                    <a href={check.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">
                      Source
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Holes in Reasoning */}
          <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">Holes in Reasoning</h3>
            <ul className="list-disc list-inside text-zinc-300 text-sm space-y-1">
              {result.critique.holesInReasoning.map((hole, i) => (
                <li key={i}>{hole}</li>
              ))}
            </ul>
          </div>

          {/* What's Missing */}
          <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">What's Missing</h3>
            <ul className="list-disc list-inside text-zinc-300 text-sm space-y-1">
              {result.critique.whatsMissing.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Speaker Bias */}
          <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter mb-2">Speaker Bias/Incentives</h3>
            <p className="text-zinc-300 text-sm">{result.critique.speakerBias}</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Reusable Quotes */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Reusable Quotes</h2>
        <div className="space-y-4">
          {result.quotes.map((quote, i) => (
            <blockquote key={i} className="border-l-4 border-zinc-600 pl-4 py-2">
              <p className="text-zinc-200 italic text-lg">"{quote.text}"</p>
              <footer className="text-zinc-400 text-sm mt-1">— {quote.speaker} on {quote.context}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Action Items */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Action Items</h2>
        <div className="space-y-3">
          {result.actionItems.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-zinc-900/30 p-4 rounded-xl border border-white/5">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                defaultChecked={item.completed}
              />
              <div>
                <p className="text-white font-medium">{item.task}</p>
                <p className="text-zinc-400 text-sm">{item.context}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Notes for Later */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Notes for Later</h2>
        <ul className="list-disc list-inside text-zinc-300 space-y-2 bg-zinc-900/30 p-5 rounded-xl border border-white/5">
          {result.notesForLater.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </section>

      {/* Craft Analysis (Optional) */}
      {result.craftAnalysis && (
        <>
          <SectionDivider />
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Craft Analysis</h2>
            <p className="text-zinc-500 text-sm italic mb-4">This video demonstrates notably strong storytelling worth studying.</p>
            <div className="space-y-4">
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Opening Hook</h3>
                <p className="text-zinc-300 text-sm">{result.craftAnalysis.openingHook}</p>
              </div>
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Structure Pattern</h3>
                <p className="text-zinc-300 text-sm">{result.craftAnalysis.structurePattern}</p>
              </div>
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Pacing Notes</h3>
                <p className="text-zinc-300 text-sm">{result.craftAnalysis.pacingNotes}</p>
              </div>
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">Sticky Moments</h3>
                <p className="text-zinc-300 text-sm">{result.craftAnalysis.stickyMoments}</p>
              </div>
              <div className="bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-400 mb-1">If Editing This</h3>
                <p className="text-zinc-300 text-sm">{result.craftAnalysis.editingNotes}</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Research Grounding Sources */}
      {result.groundingSources && result.groundingSources.length > 0 && (
        <>
          <SectionDivider />
          <section className="pt-4">
            <h2 className="text-xs font-bold text-zinc-500 uppercase mb-4">Research Grounding Sources</h2>
            <div className="flex flex-wrap gap-2">
              {result.groundingSources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-full text-xs transition-colors border border-zinc-700"
                >
                  {source.title}
                </a>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
