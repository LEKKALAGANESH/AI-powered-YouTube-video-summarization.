# Technical Architecture Report

**Project:** TubeCritique AI
**Version:** 2.0.0
**Date:** January 2025
**Last Updated:** January 28, 2025

---

## 1. System Overview

TubeCritique AI is a web application that analyzes YouTube videos using AI to extract insights, generate summaries, and critique content. The system follows a **hybrid frontend/backend architecture** with a dedicated Python FastAPI backend for processing and a Next.js frontend for the user interface.

## 2. Architecture Diagram

```
+-----------------------------------------------------------------+
|                         CLIENT LAYER                             |
|  +-----------------------------------------------------------+  |
|  |                    Next.js 14 Frontend                     |  |
|  |  +-------------+  +-------------+  +-----------------+    |  |
|  |  |   page.tsx  |  | layout.tsx  |  |  globals.css    |    |  |
|  |  |  (React UI) |  | (Root Wrap) |  |  (Tailwind)     |    |  |
|  |  +-------------+  +-------------+  +-----------------+    |  |
|  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------------+
|                         API LAYER                                |
|  +-----------------------------------------------------------+  |
|  |           Python FastAPI Backend (Port 8000)               |  |
|  |                    backend/main.py                         |  |
|  |  +-----------------------------------------------------+  |  |
|  |  |  1. URL Validation & Video ID Extraction            |  |  |
|  |  |  2. Metadata Fetch (yt-dlp / oEmbed fallback)       |  |  |
|  |  |  3. Native Video Processing (Gemini watches video)  |  |  |
|  |  |  4. Transcript Fallback (youtube-transcript-api)    |  |  |
|  |  |  5. AI Analysis (Gemini 2.0 Flash)                  |  |  |
|  |  |  6. JSON Response Formatting                        |  |  |
|  |  +-----------------------------------------------------+  |  |
|  +-----------------------------------------------------------+  |
|                                                                  |
|  +-----------------------------------------------------------+  |
|  |      Optional: Next.js API Proxy (for production)         |  |
|  |               /api/analyze/route.ts                        |  |
|  |         Forwards requests to Python backend               |  |
|  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------------+
|                      EXTERNAL SERVICES                           |
|  +---------------------+      +-----------------------------+   |
|  |     YouTube.com     |      |    Google Gemini API        |   |
|  |  +---------------+  |      |  +-----------------------+  |   |
|  |  | Video Content |  |      |  | gemini-2.0-flash      |  |   |
|  |  | Transcripts   |  |      |  | Native Video Analysis |  |   |
|  |  | oEmbed API    |  |      |  | Content Generation    |  |   |
|  |  | Metadata      |  |      |  | JSON Response         |  |   |
|  |  +---------------+  |      |  +-----------------------+  |   |
|  +---------------------+      +-----------------------------+   |
+-----------------------------------------------------------------+
                              |
                              v
+-----------------------------------------------------------------+
|                       STORAGE LAYER                              |
|  +-----------------------------------------------------------+  |
|  |                  Browser LocalStorage                      |  |
|  |  +-----------------------------------------------------+  |  |
|  |  |  Key: tubecritique_summaries                        |  |  |
|  |  |  Value: JSON array of analysis results              |  |  |
|  +-----------------------------------------------------+  |  |
|  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------+
```

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 | React framework with App Router |
| **Frontend Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | FastAPI (Python) | High-performance API framework |
| **Backend Language** | Python 3.10+ | Backend processing |
| **AI** | Gemini 2.0 Flash | Content analysis (native video + text) |
| **Video Metadata** | yt-dlp | YouTube metadata extraction |
| **Transcripts** | youtube-transcript-api | Transcript extraction fallback |
| **Storage** | LocalStorage | Client-side persistence |
| **Frontend Hosting** | Vercel | Static/SSR hosting |
| **Backend Hosting** | Railway / Render | Python backend hosting |

## 4. Data Flow

### 4.1 Video Analysis Flow

```
User Input (URL)
      |
      v
+------------------+
| URL Validation   | --> Invalid URL Error
+------------------+
      | Valid
      v
+------------------+
| Extract Video ID |
| (Regex patterns) |
+------------------+
      |
      v
+------------------+
| Fetch Metadata   |
| (yt-dlp)         | --> Fallback to oEmbed API
+------------------+
      | Success
      v
+------------------+
| Native Video     |
| Processing       | --> If fails, use transcript
| (Gemini API)     |
+------------------+
      | or Fallback
      v
+------------------+
| Get Transcript   |
| (youtube-        |
| transcript-api)  |
+------------------+
      |
      v
+------------------+
| Build Analysis   |
| Prompt           |
+------------------+
      |
      v
+------------------+
| Gemini API       | --> Rate Limit / Error
| Analysis         |
+------------------+
      | Success
      v
+------------------+
| Parse JSON       |
| Response         |
+------------------+
      |
      v
+------------------+
| Add Metadata     |
| Return Result    |
+------------------+
```

## 5. Component Architecture

### 5.1 Backend Components (Python FastAPI)

```
backend/main.py
|-- FastAPI App
|   |-- CORS Middleware (localhost:3000, *.vercel.app)
|   |-- Root Endpoint (/)
|   |-- Analyze Endpoint (/api/analyze)
|   |-- Stream Endpoint (/api/analyze/stream)
|   |-- Metadata Endpoint (/api/metadata/{video_id})
|   +-- Transcript Endpoint (/api/transcript/{video_id})
|
|-- Helper Functions
|   |-- extract_video_id()
|   |-- get_video_metadata()
|   |-- get_video_metadata_oembed() [fallback]
|   |-- get_transcript()
|   |-- analyze_video()
|   +-- extract_json_from_response()
|
+-- Pydantic Models
    |-- AnalyzeRequest
    +-- AnalyzeResponse
```

### 5.2 Frontend Components

```
page.tsx
|-- Header
|   |-- Logo
|   |-- History Button
|   +-- User Avatar
|-- Home View
|   |-- Hero Section
|   |-- URL Input Form
|   +-- Error Display
|-- Loading View
|   +-- Spinner Animation
|-- Result View (SummaryView)
|   |-- Video Header
|   |-- TL;DR Section
|   |-- Comprehensive Summary
|   |-- Relevance Scores
|   |-- Tags
|   |-- Key Moments Table
|   |-- Key Insights
|   |-- How This Applies
|   |-- Critique Section
|   |-- Quotes
|   |-- Action Items (Interactive)
|   +-- Notes for Later
+-- History View
    |-- Search Input
    +-- History Cards Grid
```

### 5.3 State Management

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

### 6.1 Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/analyze` | POST | Main video analysis |
| `/api/analyze/stream` | POST | Streaming analysis (SSE) |
| `/api/metadata/{video_id}` | GET | Metadata only |
| `/api/transcript/{video_id}` | GET | Transcript only |

### 6.2 Request Schema

```python
class AnalyzeRequest(BaseModel):
    video_url: str
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

- API key stored in environment variables (server-side only)
- CORS configured for specific origins (localhost:3000, *.vercel.app)
- Input validation on video URLs
- No user authentication (public access)
- LocalStorage for client-side data only

## 8. Scalability

| Aspect | Current | Scalable Solution |
|--------|---------|-------------------|
| Backend | Single instance | Horizontal scaling (Railway/Render) |
| Storage | LocalStorage | Database (Supabase/PostgreSQL) |
| Auth | None | NextAuth.js / Clerk |
| Caching | None | Redis / Vercel KV |
| Rate Limiting | Gemini API limits | Custom rate limiter |

## 9. Dependencies

### 9.1 Backend (Python)

```txt
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
google-genai>=1.0.0
youtube-transcript-api>=1.2.3
yt-dlp>=2024.12.23
python-dotenv>=1.0.1
pydantic>=2.10.0
sse-starlette>=2.2.1
httpx>=0.28.0
```

### 9.2 Frontend (Node.js)

```json
{
  "next": "^14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## 10. Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `next.config.js` | Root | Next.js configuration |
| `tsconfig.json` | Root | TypeScript settings |
| `vercel.json` | Root | Frontend deployment settings |
| `.env.local` | Root | Frontend environment variables |
| `main.py` | backend/ | FastAPI application |
| `requirements.txt` | backend/ | Python dependencies |
| `railway.json` | backend/ | Railway deployment config |
| `render.yaml` | backend/ | Render deployment config |
| `.env` | backend/ | Backend environment variables |

## 11. Environment Variables

### 11.1 Frontend (.env.local)

```env
# Option 1: Call Python backend directly from frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Option 2: Use Next.js API route as proxy
# PYTHON_BACKEND_URL=http://localhost:8000
```

### 11.2 Backend (.env)

```env
GEMINI_API_KEY=your_gemini_api_key_here
```
