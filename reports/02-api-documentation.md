# API Documentation Report

**Project:** TubeCritique AI
**Version:** 2.0.0
**Date:** January 2025
**Last Updated:** January 28, 2025

---

## 1. API Overview

The TubeCritique AI API is powered by a **Python FastAPI backend** that provides multiple endpoints for analyzing YouTube videos. The backend extracts video metadata, fetches transcripts, processes content with Gemini AI, and returns structured analysis data.

**Base URLs:**
- Development (Backend): `http://localhost:8000`
- Development (Frontend): `http://localhost:3000`
- Production (Backend): `https://your-backend.railway.app` or `https://your-backend.onrender.com`
- Production (Frontend): `https://your-domain.vercel.app`

---

## 2. Endpoints

### 2.1 Health Check

Check if the backend is running.

**Endpoint:** `GET /`

**Response:**
```json
{
  "status": "ok",
  "message": "TubeCritique API is running"
}
```

---

### 2.2 Analyze Video

Analyzes a YouTube video and returns comprehensive insights.

**Endpoint:** `POST /api/analyze`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Note:** The API also accepts `videoUrl` for backwards compatibility.

**Supported URL Formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/live/VIDEO_ID`

---

### 2.3 Streaming Analysis

Analyzes a video with real-time streaming updates via Server-Sent Events (SSE).

**Endpoint:** `POST /api/analyze/stream`

**Headers:**
```
Content-Type: application/json
Accept: text/event-stream
```

**Request Body:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:** Server-Sent Events stream with progress updates.

---

### 2.4 Get Video Metadata

Fetch only the metadata for a video without full analysis.

**Endpoint:** `GET /api/metadata/{video_id}`

**Response:**
```json
{
  "title": "Video Title",
  "channel": "Channel Name",
  "duration": "12:34",
  "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
  "view_count": 1234567
}
```

---

### 2.5 Get Video Transcript

Fetch only the transcript for a video.

**Endpoint:** `GET /api/transcript/{video_id}`

**Response:**
```json
{
  "video_id": "VIDEO_ID",
  "transcript": "Full transcript text...",
  "segments": [
    {
      "text": "Segment text",
      "start": 0.0,
      "duration": 5.0
    }
  ]
}
```

---

## 3. Response Formats

### 3.1 Success Response (200 OK)

```json
{
  "id": "abc123def",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "timestamp": 1706000000000,
  "title": "Video Title Here",
  "duration": "15:30",
  "speaker": "Channel Name",
  "tldr": "Brief 2-3 sentence summary of the video content.",
  "comprehensiveSummary": "Detailed 300-500 word summary covering all major points...",
  "scores": {
    "ai": 4,
    "pm": 3,
    "growth": 5
  },
  "tags": {
    "broad": ["Technology", "Education"],
    "specific": ["Machine Learning", "Tutorial", "Python"]
  },
  "keyMoments": [
    {
      "time": "00:00",
      "topic": "Introduction and overview"
    },
    {
      "time": "02:30",
      "topic": "Main concept explanation"
    }
  ],
  "keyInsights": [
    {
      "title": "Insight Title",
      "explanation": "Why this insight matters and how it applies."
    }
  ],
  "howThisApplies": {
    "productBusiness": "How businesses can apply these concepts...",
    "personal": "How individuals can benefit personally..."
  },
  "critique": {
    "claimsToVerify": [
      {
        "claim": "Specific claim made in video",
        "verdict": "true",
        "sourceUrl": "https://source.com"
      }
    ],
    "holesInReasoning": [
      "Missing consideration of alternative approaches"
    ],
    "whatsMissing": [
      "No mention of potential drawbacks"
    ],
    "speakerBias": "Speaker has commercial interest in promoting this tool."
  },
  "quotes": [
    {
      "text": "Memorable quote from the video",
      "speaker": "Speaker Name",
      "context": "Said during the introduction"
    }
  ],
  "actionItems": [
    {
      "task": "Specific action to take",
      "context": "Why this action is important",
      "completed": false
    }
  ],
  "notesForLater": [
    "Key point to remember",
    "Follow-up research topic"
  ],
  "craftAnalysis": {
    "openingHook": "How the video captures attention",
    "structurePattern": "Problem-Solution-Example format",
    "pacingNotes": "Well-paced with good transitions",
    "stickyMoments": "The demo at 5:00 was particularly memorable",
    "editingNotes": "Clean cuts, good use of graphics"
  }
}
```

### 3.2 Error Responses

#### Invalid URL (400 Bad Request)
```json
{
  "detail": "Please provide a valid YouTube URL"
}
```

#### Invalid URL Format (400 Bad Request)
```json
{
  "detail": "Invalid YouTube URL format"
}
```

#### No Captions Available (400 Bad Request)
```json
{
  "detail": "Could not retrieve transcript for this video",
  "video_id": "VIDEO_ID"
}
```

#### Rate Limit (429 Too Many Requests)
```json
{
  "detail": "API rate limit reached. Please wait and try again."
}
```

#### AI Analysis Failed (500 Internal Server Error)
```json
{
  "detail": "AI analysis failed. Please try again."
}
```

#### Backend Not Configured (502 Bad Gateway)
```json
{
  "error": "Backend service unavailable"
}
```

---

## 4. Field Descriptions

### 4.1 Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the analysis |
| `url` | string | Normalized YouTube URL |
| `timestamp` | number | Unix timestamp of analysis (milliseconds) |
| `title` | string | Video title from YouTube |
| `duration` | string | Video duration (MM:SS format) |
| `speaker` | string | Channel/creator name |

### 4.2 Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| `tldr` | string | 2-3 sentence summary |
| `comprehensiveSummary` | string | 300-500 word detailed summary |

### 4.3 Scores Object

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `ai` | number | 1-5 | Relevance to AI/ML practitioners |
| `pm` | number | 1-5 | Relevance to product managers |
| `growth` | number | 1-5 | Relevance to personal/professional growth |

### 4.4 Tags Object

| Field | Type | Description |
|-------|------|-------------|
| `broad` | string[] | General categories (e.g., "Technology") |
| `specific` | string[] | Specific topics (e.g., "React Hooks") |

### 4.5 Key Moments Array

| Field | Type | Description |
|-------|------|-------------|
| `time` | string | Timestamp in MM:SS format |
| `topic` | string | What happens at this moment |

### 4.6 Key Insights Array

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Insight name/headline |
| `explanation` | string | Why this insight matters |

### 4.7 Critique Object

| Field | Type | Description |
|-------|------|-------------|
| `claimsToVerify` | array | Claims that need fact-checking |
| `holesInReasoning` | string[] | Logical gaps or weaknesses |
| `whatsMissing` | string[] | Topics not covered |
| `speakerBias` | string | Analysis of potential bias |

### 4.8 Action Items Array

| Field | Type | Description |
|-------|------|-------------|
| `task` | string | Specific action to take |
| `context` | string | Why this action matters |
| `completed` | boolean | Completion status (always false from API) |

---

## 5. Rate Limits

| Limit Type | Value | Notes |
|------------|-------|-------|
| Gemini API | Varies | Based on your API plan |
| Request Timeout | 300s | Backend default |
| Transcript Length | ~50,000 chars | Truncated if exceeded |

---

## 6. Example Usage

### cURL (Direct to Backend)
```bash
curl -X POST https://your-backend.railway.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### cURL (Health Check)
```bash
curl https://your-backend.railway.app/
```

### JavaScript (Fetch)
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const response = await fetch(`${API_URL}/api/analyze`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }),
});

const data = await response.json();

if (!response.ok) {
  console.error('Error:', data.detail);
} else {
  console.log('Analysis:', data);
}
```

### Python (Requests)
```python
import requests

API_URL = "https://your-backend.railway.app"

response = requests.post(
    f'{API_URL}/api/analyze',
    json={'video_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
)

if response.status_code == 200:
    data = response.json()
    print(f"Title: {data['title']}")
    print(f"Summary: {data['tldr']}")
else:
    print(f"Error: {response.json()['detail']}")
```

### Python (Async with httpx)
```python
import httpx

async def analyze_video(video_url: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            'http://localhost:8000/api/analyze',
            json={'video_url': video_url},
            timeout=120.0
        )
        return response.json()
```

---

## 7. Error Handling Best Practices

```javascript
async function analyzeVideo(url) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_url: url }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 400) {
        throw new Error(data.detail || 'Invalid request');
      }
      if (response.status === 429) {
        throw new Error('Rate limited. Please wait.');
      }
      if (response.status === 502) {
        throw new Error('Backend service unavailable');
      }
      throw new Error(data.detail || 'Unknown error');
    }

    return data;
  } catch (error) {
    console.error('Analysis failed:', error.message);
    throw error;
  }
}
```

---

## 8. Backend Configuration

### 8.1 CORS Settings

The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://*.vercel.app` (production)

### 8.2 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `PORT` | No | Server port (default: 8000) |

---

## 9. Analysis Workflow

```
1. Client sends POST /api/analyze with video_url
2. Backend extracts video ID from URL
3. Backend fetches metadata via yt-dlp
   - Fallback: YouTube oEmbed API
4. Backend attempts native video analysis with Gemini
   - Gemini "watches" the video directly
   - Fallback: Fetch transcript and analyze text
5. Backend parses AI response to JSON
6. Backend adds metadata and returns result
```
