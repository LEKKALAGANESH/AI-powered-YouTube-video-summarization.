
import { SummaryResult } from '../types';

const STORAGE_KEY = 'tubecritique_summaries';

export const storageService = {
  saveSummary: (summary: SummaryResult) => {
    const existing = storageService.getHistory();
    const updated = [summary, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getHistory: (): SummaryResult[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  searchHistory: (query: string): SummaryResult[] => {
    const history = storageService.getHistory();
    const q = query.toLowerCase();
    return history.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.summary.toLowerCase().includes(q)
    );
  }
};
