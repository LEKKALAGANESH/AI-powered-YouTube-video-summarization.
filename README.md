# TubeCritique AI

AI-powered YouTube video analyzer that extracts insights, critiques claims, and scores content relevance.

## Features

- **Video Analysis** - Extracts transcripts and analyzes content using Gemini 2.0 Flash
- **Smart Summaries** - TL;DR and comprehensive summaries with timestamps
- **Relevance Scoring** - Rates content for AI/Tech, Product Management, and Growth
- **Critique Engine** - Identifies claims to verify, reasoning gaps, and speaker bias
- **Key Moments** - Timestamps for important sections
- **Action Items** - Actionable takeaways with checkbox tracking
- **Quotes Extraction** - Notable quotes with context
- **History** - Local storage persistence for all analyzed videos

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.0 Flash API
- **Storage**: Browser LocalStorage
- **Deployment**: Vercel

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd tubecritique-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env.local` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
tubecritique-ai/
├── app/
│   ├── api/analyze/
│   │   └── route.ts      # API endpoint for video analysis
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── .env.local            # Environment variables (not committed)
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Vercel deployment settings
```

## API

### POST /api/analyze

Analyzes a YouTube video.

**Request:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "id": "unique_id",
  "url": "video_url",
  "title": "Video Title",
  "speaker": "Channel Name",
  "duration": "X min",
  "tldr": "Brief summary",
  "comprehensiveSummary": "Detailed summary...",
  "scores": { "ai": 4, "pm": 3, "growth": 5 },
  "keyMoments": [{ "time": "01:23", "topic": "..." }],
  "keyInsights": [{ "title": "...", "explanation": "..." }],
  "critique": { ... },
  "actionItems": [{ "task": "...", "context": "...", "completed": false }],
  ...
}
```

## Requirements

- Node.js 18+
- Gemini API key (get from [Google AI Studio](https://aistudio.google.com/))
- Videos must have captions/subtitles enabled

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Set `GEMINI_API_KEY` in Vercel environment variables.

## License

MIT
