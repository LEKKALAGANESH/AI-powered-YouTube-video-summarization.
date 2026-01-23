
export interface KeyMoment {
  time: string;
  topic: string;
}

export interface KeyInsight {
  title: string;
  explanation: string;
}

export interface Quote {
  text: string;
  speaker: string;
  context: string;
}

export interface ActionItem {
  task: string;
  context: string;
  completed: boolean;
}

export interface CraftAnalysis {
  openingHook: string;
  structurePattern: string;
  pacingNotes: string;
  stickyMoments: string;
  editingNotes: string;
}

export interface SummaryResult {
  id: string;
  url: string;
  title: string;
  duration: string;
  speaker: string;
  tldr: string;
  comprehensiveSummary: string;
  scores: {
    ai: number;
    pm: number;
    growth: number;
  };
  tags: {
    broad: string[];
    specific: string[];
  };
  keyMoments: KeyMoment[];
  keyInsights: KeyInsight[];
  howThisApplies: {
    productBusiness: string;
    personal: string;
  };
  critique: {
    claimsToVerify: Array<{ claim: string; verdict: string; sourceUrl?: string }>;
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

export enum ViewState {
  HOME = 'HOME',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY'
}
