# TubeCritique AI

AI-powered YouTube video analyzer that extracts insights, critiques claims, and scores content relevance using Google Gemini's multimodal capabilities.

## Features

- **Native Video Analysis** - Gemini watches and analyzes videos directly (no transcript needed!)
- **Smart Summaries** - TL;DR and comprehensive summaries with timestamps
- **Relevance Scoring** - Rates content for AI/Tech, Product Management, and Growth
- **Critique Engine** - Identifies claims to verify, reasoning gaps, and speaker bias
- **Key Moments** - Timestamps for important sections
- **Action Items** - Actionable takeaways with checkbox tracking
- **Quotes Extraction** - Notable quotes with context
- **History** - Local storage persistence for all analyzed videos
- **Streaming Responses** - Real-time SSE streaming for better UX

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js 14    │────▶│  FastAPI Python │────▶│  Gemini 2.0     │
│   Frontend      │     │    Backend      │     │  Flash API      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   yt-dlp +      │
                        │ youtube-transcript│
                        └─────────────────┘
```

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser LocalStorage

### Backend

- **Framework**: FastAPI (Python)
- **AI**: Google Gemini 2.0 Flash API
- **Video Data**: yt-dlp, youtube-transcript-api
- **Streaming**: SSE (Server-Sent Events)

### Deployment

- **Frontend**: Vercel
- **Backend**: Railway / Render / Any Python host

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/LEKKALAGANESH/AI-powered-YouTube-video-summarization..git
cd AI-powered-YouTube-video-summarization.
```

### 2. Setup Python Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Setup Next.js Frontend

```bash
cd ..  # Back to root directory

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local and configure:
# - GEMINI_API_KEY=your_key
# - NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Servers

**Terminal 1 - Python Backend:**

```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Next.js Frontend:**

```bash
npm run dev
```

### 5. Open in browser

```
http://localhost:3000
```

## Project Structure

```
tubecritique-ai/
├── app/                      # Next.js frontend
│   ├── api/analyze/
│   │   └── route.ts          # API proxy to Python backend
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── backend/                  # Python FastAPI backend
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Backend environment variables
│   └── .env.example          # Example environment file
├── .env.local                # Frontend environment variables
├── .env.example              # Example environment file
├── next.config.js            # Next.js configuration
├── package.json              # Node.js dependencies
├── tsconfig.json             # TypeScript configuration
└── vercel.json               # Vercel deployment settings
```

## API Endpoints

### Python Backend (FastAPI)

#### `GET /`

Health check endpoint.

#### `POST /api/analyze`

Analyzes a YouTube video using Gemini's native video processing.

**Request:**

```json
{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "stream": false
}
```

**Response:**

```json
{
  "id": "unique_id",
  "url": "video_url",
  "title": "Video Title",
  "speaker": "Channel Name",
  "duration": "12:34",
  "tldr": "Brief summary",
  "comprehensiveSummary": "Detailed summary...",
  "scores": { "ai": 4, "pm": 3, "growth": 5 },
  "keyMoments": [{ "time": "01:23", "topic": "..." }],
  "keyInsights": [{ "title": "...", "explanation": "..." }],
  "critique": { ... },
  "actionItems": [{ "task": "...", "context": "...", "completed": false }],
  "thumbnail": "https://...",
  "viewCount": 12345
}
```

#### `POST /api/analyze/stream`

Same as above but with SSE streaming response.

#### `GET /api/metadata/{video_id}`

Get video metadata only (title, channel, duration, etc.).

#### `GET /api/transcript/{video_id}`

Get video transcript (if available).

## Requirements

- **Python 3.10+** (for backend)
- **Node.js 18+** (for frontend)
- **Gemini API key** (get from [Google AI Studio](https://aistudio.google.com/))
- **youtube-transcript-api 0.6.0+** (uses new instance-based API)

## Deployment

### Frontend (Vercel)

```bash
npm run build
vercel --prod
```

Set environment variables in Vercel:

- `NEXT_PUBLIC_API_URL` = Your Python backend URL
- `PYTHON_BACKEND_URL` = Your Python backend URL (for proxy mode)

### Backend (Railway/Render)

1. Push your backend folder to a separate repo or use monorepo support
2. Set environment variable: `GEMINI_API_KEY`
3. Deploy with:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

## Environment Variables

### Frontend (.env.local)

| Variable              | Description                           | Required |
| --------------------- | ------------------------------------- | -------- |
| `NEXT_PUBLIC_API_URL` | Python backend URL (direct calls)     | Yes      |
| `PYTHON_BACKEND_URL`  | Python backend URL (proxy mode)       | Optional |
| `GEMINI_API_KEY`      | Gemini API key (if using Next.js API) | Optional |

### Backend (.env)

| Variable         | Description           | Required |
| ---------------- | --------------------- | -------- |
| `GEMINI_API_KEY` | Google Gemini API key | Yes      |

## How It Works

1. **User submits YouTube URL** - Frontend sends request to Python backend
2. **Metadata extraction** - yt-dlp fetches video metadata (title, duration, thumbnail)
3. **Video analysis** - Gemini processes the video directly via YouTube URL (no download needed)
4. **Fallback** - If direct processing fails, uses youtube-transcript-api for text-based analysis
5. **Response** - Structured JSON with all insights, scores, and critiques

## Quick Start (Windows)

```bash
# Clone and setup
git clone <repo-url>
cd tubecritique-ai

# Setup backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
echo GEMINI_API_KEY=your_key_here > .env

# Start backend (keep this terminal open)
uvicorn main:app --reload --port 8000
```

In a new terminal:

```bash
# Setup frontend
cd tubecritique-ai
npm install
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

# Start frontend
npm run dev
```

Open http://localhost:3000

## Troubleshooting

| Issue                             | Solution                                                    |
| --------------------------------- | ----------------------------------------------------------- |
| `GEMINI_API_KEY not configured`   | Add your API key to `backend/.env`                          |
| `Connection refused on port 8000` | Make sure Python backend is running                         |
| `CORS error`                      | Backend must be running on `localhost:8000`                 |
| `Video analysis failed`           | Video may be private, age-restricted, or too long (>1 hour) |
| `Python version error`            | Use Python 3.10+ (check with `python --version`)            |

## Supported Video Types

- Public YouTube videos
- Videos up to ~1 hour (longer videos may timeout)
- Any language (Gemini handles translation)
- Videos with or without captions

## API Rate Limits

- Gemini API has usage quotas - check [Google AI Studio](https://aistudio.google.com/)
- yt-dlp may be rate-limited by YouTube for excessive requests
- Consider adding caching for production use

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
