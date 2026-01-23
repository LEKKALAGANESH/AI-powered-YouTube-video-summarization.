# API Documentation Report

**Project:** TubeCritique AI
**Version:** 1.0.0
**Date:** January 2025

---

## 1. API Overview

The TubeCritique AI API provides a single endpoint for analyzing YouTube videos. It extracts transcripts, processes them with AI, and returns structured analysis data.

**Base URL:**
- Development: `http://localhost:3000`
- Production: `https://your-domain.vercel.app`

---

## 2. Endpoints

### 2.1 Analyze Video

Analyzes a YouTube video and returns comprehensive insights.

**Endpoint:** `POST /api/analyze`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Supported URL Formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/live/VIDEO_ID`

---

## 3. Response Formats

### 3.1 Success Response (200 OK)

```json
{
  "id": "abc123def",
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "timestamp": 1706000000000,
  "title": "Video Title Here",
  "duration": "15 min",
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
  "error": "Please provide a valid YouTube URL"
}
```

#### Invalid URL Format (400 Bad Request)
```json
{
  "error": "Invalid YouTube URL format"
}
```

#### No Captions Available (400 Bad Request)
```json
{
  "error": "This video doesn't have captions/subtitles available",
  "videoTitle": "Video Title",
  "videoChannel": "Channel Name",
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

#### Transcript Error (400 Bad Request)
```json
{
  "error": "Failed to get transcript: Error message",
  "videoTitle": "Video Title",
  "videoChannel": "Channel Name",
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

#### Rate Limit (429 Too Many Requests)
```json
{
  "error": "API rate limit reached. Please wait and try again."
}
```

#### AI Analysis Failed (500 Internal Server Error)
```json
{
  "error": "AI analysis failed. Please try again."
}
```

#### Unexpected Error (500 Internal Server Error)
```json
{
  "error": "An unexpected error occurred"
}
```

---

## 4. Field Descriptions

### 4.1 Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the analysis |
| `url` | string | Normalized YouTube URL |
| `timestamp` | number | Unix timestamp of analysis |
| `title` | string | Video title from YouTube |
| `duration` | string | Estimated video duration |
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
| Request Timeout | 120s | Configured in vercel.json |
| Transcript Length | 50,000 chars | Truncated if exceeded |

---

## 6. Example Usage

### cURL
```bash
curl -X POST https://your-domain.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

### JavaScript (Fetch)
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }),
});

const data = await response.json();

if (!response.ok) {
  console.error('Error:', data.error);
} else {
  console.log('Analysis:', data);
}
```

### Python (Requests)
```python
import requests

response = requests.post(
    'https://your-domain.vercel.app/api/analyze',
    json={'videoUrl': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
)

if response.status_code == 200:
    data = response.json()
    print(f"Title: {data['title']}")
    print(f"Summary: {data['tldr']}")
else:
    print(f"Error: {response.json()['error']}")
```

---

## 7. Error Handling Best Practices

```javascript
async function analyzeVideo(url) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl: url }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 400) {
        if (data.videoTitle) {
          // Video found but no captions
          console.log(`Video: ${data.videoTitle}`);
          console.log(`Channel: ${data.videoChannel}`);
        }
        throw new Error(data.error);
      }
      if (response.status === 429) {
        throw new Error('Rate limited. Please wait.');
      }
      throw new Error(data.error || 'Unknown error');
    }

    return data;
  } catch (error) {
    console.error('Analysis failed:', error.message);
    throw error;
  }
}
```
