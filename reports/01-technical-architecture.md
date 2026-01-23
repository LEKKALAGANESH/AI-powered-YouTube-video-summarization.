# Technical Architecture Report

**Project:** TubeCritique AI
**Version:** 1.0.0
**Date:** January 2025

---

## 1. System Overview

TubeCritique AI is a web application that analyzes YouTube videos using AI to extract insights, generate summaries, and critique content. The system follows a modern serverless architecture optimized for scalability and performance.

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Next.js Frontend                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   page.tsx  │  │ layout.tsx  │  │  globals.css    │   │  │
│  │  │  (React UI) │  │ (Root Wrap) │  │  (Tailwind)     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js API Route (Serverless)               │  │
│  │                  /api/analyze/route.ts                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  1. URL Validation                                  │  │  │
│  │  │  2. YouTube Page Fetch                              │  │  │
│  │  │  3. Transcript Extraction                           │  │  │
│  │  │  4. Gemini AI Analysis                              │  │  │
│  │  │  5. Response Formatting                             │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                          │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │     YouTube.com     │      │    Google Gemini API        │  │
│  │  ┌───────────────┐  │      │  ┌───────────────────────┐  │  │
│  │  │ Video Page    │  │      │  │ gemini-2.0-flash      │  │  │
│  │  │ Captions XML  │  │      │  │ Content Generation    │  │  │
│  │  │ Metadata      │  │      │  │ JSON Response         │  │  │
│  │  └───────────────┘  │      │  └───────────────────────┘  │  │
│  └─────────────────────┘      └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       STORAGE LAYER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Browser LocalStorage                     │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  Key: tubecritique_summaries                        │  │  │
│  │  │  Value: JSON array of analysis results              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 | React framework with App Router |
| Language | TypeScript | Type-safe development |
| Styling | Tailwind CSS | Utility-first CSS framework |
| API | Next.js API Routes | Serverless functions |
| AI | Gemini 2.0 Flash | Content analysis |
| Storage | LocalStorage | Client-side persistence |
| Deployment | Vercel | Serverless hosting |

## 4. Data Flow

### 4.1 Video Analysis Flow

```
User Input (URL)
      │
      ▼
┌─────────────────┐
│ URL Validation  │ ──▶ Invalid URL Error
└─────────────────┘
      │ Valid
      ▼
┌─────────────────┐
│ Fetch YouTube   │ ──▶ Access Error
│ Page HTML       │
└─────────────────┘
      │ Success
      ▼
┌─────────────────┐
│ Extract Video   │
│ Title & Channel │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Extract Caption │ ──▶ No Captions Error
│ Tracks          │     (with video info)
└─────────────────┘
      │ Found
      ▼
┌─────────────────┐
│ Fetch Caption   │
│ XML Content     │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Parse to Text   │
│ Segments        │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Build Prompt    │
│ with Transcript │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Gemini API      │ ──▶ Rate Limit Error
│ Analysis        │
└─────────────────┘
      │ Success
      ▼
┌─────────────────┐
│ Parse JSON      │
│ Response        │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Return Result   │
│ to Client       │
└─────────────────┘
```

## 5. Component Architecture

### 5.1 Frontend Components

```
page.tsx
├── Header
│   ├── Logo
│   ├── History Button
│   └── User Avatar
├── Home View
│   ├── Hero Section
│   ├── URL Input Form
│   └── Error Display
├── Loading View
│   └── Spinner Animation
├── Result View (SummaryView)
│   ├── Video Header
│   ├── TL;DR Section
│   ├── Comprehensive Summary
│   ├── Relevance Scores
│   ├── Tags
│   ├── Key Moments Table
│   ├── Key Insights
│   ├── How This Applies
│   ├── Critique Section
│   ├── Quotes
│   ├── Action Items (Interactive)
│   └── Notes for Later
└── History View
    ├── Search Input
    └── History Cards Grid
```

### 5.2 State Management

```typescript
// View States
enum ViewState {
  HOME = "HOME",
  LOADING = "LOADING",
  RESULT = "RESULT",
  HISTORY = "HISTORY"
}

// Application State
- viewState: ViewState
- url: string
- currentResult: SummaryResult | null
- history: SummaryResult[]
- error: string | null
- searchQuery: string
```

## 6. API Design

### 6.1 Endpoint

```
POST /api/analyze
Content-Type: application/json
```

### 6.2 Request Schema

```typescript
interface AnalyzeRequest {
  videoUrl: string;
}
```

### 6.3 Response Schema

```typescript
interface AnalyzeResponse {
  id: string;
  url: string;
  timestamp: number;
  title: string;
  duration: string;
  speaker: string;
  tldr: string;
  comprehensiveSummary: string;
  scores: {
    ai: number;      // 1-5
    pm: number;      // 1-5
    growth: number;  // 1-5
  };
  tags: {
    broad: string[];
    specific: string[];
  };
  keyMoments: Array<{
    time: string;
    topic: string;
  }>;
  keyInsights: Array<{
    title: string;
    explanation: string;
  }>;
  howThisApplies: {
    productBusiness: string;
    personal: string;
  };
  critique: {
    claimsToVerify: Array<{
      claim: string;
      verdict: string;
      sourceUrl: string;
    }>;
    holesInReasoning: string[];
    whatsMissing: string[];
    speakerBias: string;
  };
  quotes: Array<{
    text: string;
    speaker: string;
    context: string;
  }>;
  actionItems: Array<{
    task: string;
    context: string;
    completed: boolean;
  }>;
  notesForLater: string[];
  craftAnalysis: {
    openingHook: string;
    structurePattern: string;
    pacingNotes: string;
    stickyMoments: string;
    editingNotes: string;
  };
}
```

## 7. Security Considerations

- API key stored in environment variables (not exposed to client)
- Input validation on video URLs
- No user authentication (public access)
- LocalStorage for client-side data only

## 8. Scalability

| Aspect | Current | Scalable Solution |
|--------|---------|-------------------|
| Storage | LocalStorage | Database (Supabase/PostgreSQL) |
| Auth | None | NextAuth.js / Clerk |
| Caching | None | Redis / Vercel KV |
| Rate Limiting | Gemini API limits | Custom rate limiter |

## 9. Dependencies

```json
{
  "@google/genai": "^1.38.0",
  "next": "^14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## 10. Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js configuration |
| `tsconfig.json` | TypeScript settings |
| `vercel.json` | Deployment settings (timeout, memory) |
| `.env.local` | Environment variables |
