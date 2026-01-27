"""
TubeCritique AI - FastAPI Backend
YouTube Video Analyzer using Gemini API
"""

import os
import re
import json
from typing import Optional, AsyncGenerator, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from google.genai import Client
from google.genai.types import Content, Part
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import yt_dlp

# Load environment variables
load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is required")

# Initialize Gemini client
client = Client(api_key=GEMINI_API_KEY)

# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(
    title="TubeCritique AI API",
    description="YouTube Video Analyzer powered by Gemini",
    version="2.0.0",
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class VideoRequest(BaseModel):
    video_url: str = Field(..., description="YouTube video URL")
    stream: bool = Field(default=False, description="Enable streaming response")


class VideoMetadata(BaseModel):
    title: str
    channel: str
    duration: Optional[str] = None
    view_count: Optional[int] = None
    thumbnail: Optional[str] = None


class AnalysisScores(BaseModel):
    ai: int = Field(ge=1, le=5)
    pm: int = Field(ge=1, le=5)
    growth: int = Field(ge=1, le=5)


class KeyMoment(BaseModel):
    time: str
    topic: str


class KeyInsight(BaseModel):
    title: str
    explanation: str


class Critique(BaseModel):
    claimsToVerify: list[dict]
    holesInReasoning: list[str]
    whatsMissing: list[str]
    speakerBias: str


class CraftAnalysis(BaseModel):
    openingHook: str
    structurePattern: str
    pacingNotes: str
    stickyMoments: str
    editingNotes: str


class AnalysisResult(BaseModel):
    id: str
    url: str
    timestamp: int
    title: str
    duration: str
    speaker: str
    tldr: str
    comprehensiveSummary: str
    scores: AnalysisScores
    tags: dict
    keyMoments: list[KeyMoment]
    keyInsights: list[KeyInsight]
    howThisApplies: dict
    critique: Critique
    quotes: list[dict]
    actionItems: list[dict]
    notesForLater: list[str]
    craftAnalysis: CraftAnalysis


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def extract_video_id(url: str) -> Optional[str]:
    """Extract video ID from various YouTube URL formats."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/live\/([a-zA-Z0-9_-]{11})',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def get_video_metadata(video_id: str) -> VideoMetadata:
    """Fetch video metadata using yt-dlp."""
    url = f"https://www.youtube.com/watch?v={video_id}"

    ydl_opts: dict[str, Any] = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'skip_download': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:  # type: ignore[arg-type]
            info = ydl.extract_info(url, download=False)

            # Format duration
            duration_secs = info.get('duration', 0)
            if duration_secs:
                mins, secs = divmod(duration_secs, 60)
                hours, mins = divmod(mins, 60)
                if hours > 0:
                    duration = f"{hours}:{mins:02d}:{secs:02d}"
                else:
                    duration = f"{mins}:{secs:02d}"
            else:
                duration = "Unknown"

            return VideoMetadata(
                title=info.get('title') or 'Unknown Title',
                channel=info.get('channel') or info.get('uploader') or 'Unknown Channel',
                duration=duration,
                view_count=info.get('view_count'),
                thumbnail=info.get('thumbnail'),
            )
    except Exception as e:
        print(f"[yt-dlp] Error: {e}")
        return VideoMetadata(title="Unknown Title", channel="Unknown Channel")


def get_transcript(video_id: str) -> Optional[str]:
    """Fetch transcript using youtube-transcript-api."""
    try:
        # Try to get English transcript first
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.list(video_id)

        # Prefer manual transcripts over auto-generated
        try:
            transcript = transcript_list.find_manually_created_transcript(['en', 'en-US', 'en-GB'])
        except:
            try:
                transcript = transcript_list.find_generated_transcript(['en', 'en-US', 'en-GB'])
            except:
                # Get any available transcript
                transcript = transcript_list.find_transcript(transcript_list._manually_created_transcripts.keys() or transcript_list._generated_transcripts.keys())

        # Format transcript with timestamps
        lines = []
        for entry in transcript.fetch():
            mins = int(entry.start // 60)
            secs = int(entry.start % 60)
            lines.append(f"[{mins}:{secs:02d}] {entry.text}")

        return "\n".join(lines)

    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"[Transcript] Not available: {e}")
        return None
    except Exception as e:
        print(f"[Transcript] Error: {e}")
        return None


def build_analysis_prompt(metadata: VideoMetadata, transcript: Optional[str] = None) -> str:
    """Build the analysis prompt for Gemini."""
    base_prompt = """You are analyzing a YouTube video. Watch and listen to the entire video carefully.

Based on the video content, return a JSON object with this exact structure:
{
  "title": "the video title",
  "duration": "video duration",
  "speaker": "main speaker or channel name",
  "tldr": "2-3 sentence summary of the main point",
  "comprehensiveSummary": "detailed 300-500 word summary covering all major points",
  "scores": { "ai": 1-5, "pm": 1-5, "growth": 1-5 },
  "tags": { "broad": ["category1", "category2"], "specific": ["topic1", "topic2"] },
  "keyMoments": [{ "time": "MM:SS", "topic": "what happens" }],
  "keyInsights": [{ "title": "insight name", "explanation": "why it matters" }],
  "howThisApplies": {
    "productBusiness": "business applications",
    "personal": "personal relevance"
  },
  "critique": {
    "claimsToVerify": [{ "claim": "claim text", "verdict": "true/false/unverified", "sourceUrl": "" }],
    "holesInReasoning": ["gap 1"],
    "whatsMissing": ["missing perspective"],
    "speakerBias": "bias analysis"
  },
  "quotes": [{ "text": "quote", "speaker": "who", "context": "when" }],
  "actionItems": [{ "task": "action", "context": "why" }],
  "notesForLater": ["note 1", "note 2"],
  "craftAnalysis": {
    "openingHook": "how it opens",
    "structurePattern": "organization",
    "pacingNotes": "pacing",
    "stickyMoments": "memorable parts",
    "editingNotes": "editing choices"
  }
}

Scoring guide:
- ai: Relevance to AI/ML (1=none, 5=essential)
- pm: Relevance to product management (1=none, 5=essential)
- growth: Relevance to personal growth (1=none, 5=essential)

IMPORTANT: Return ONLY valid JSON, no markdown code blocks."""

    if transcript:
        return f"""{base_prompt}

VIDEO TITLE: {metadata.title}
CHANNEL: {metadata.channel}
DURATION: {metadata.duration}

=== TRANSCRIPT ===
{transcript[:50000]}
=== END TRANSCRIPT ===
"""
    return base_prompt


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "TubeCritique AI API", "version": "2.0.0"}


@app.post("/api/analyze")
async def analyze_video(request: VideoRequest):
    """
    Analyze a YouTube video using Gemini API.

    Supports two modes:
    1. Native YouTube URL processing (Gemini watches the video)
    2. Transcript-based analysis (fallback)
    """
    video_id = extract_video_id(request.video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    normalized_url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"[API] Processing: {video_id}")

    # Step 1: Get video metadata using yt-dlp
    metadata = get_video_metadata(video_id)
    print(f"[API] Video: '{metadata.title}' by {metadata.channel}")

    # Step 2: Try native YouTube URL processing with Gemini
    try:
        print("[Gemini] Using native YouTube URL processing...")

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                Content(
                    role="user",
                    parts=[
                        Part.from_uri(
                            file_uri=normalized_url,
                            mime_type="video/*"
                        ),
                        Part.from_text(text=build_analysis_prompt(metadata))
                    ]
                )
            ]
        )

        result_text = response.text or ""
        print(f"[Gemini] Response: {len(result_text)} chars")

    except Exception as e:
        error_msg = str(e)
        print(f"[Gemini] Native URL failed: {error_msg}")

        # Fallback: Try transcript-based analysis
        print("[Fallback] Trying transcript-based analysis...")
        transcript = get_transcript(video_id)

        if not transcript:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Could not analyze video. No transcript available and video processing failed.",
                    "videoTitle": metadata.title,
                    "videoChannel": metadata.channel,
                    "videoUrl": normalized_url,
                }
            )

        # Use transcript-based analysis
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=build_analysis_prompt(metadata, transcript)
        )
        result_text = response.text or ""

    # Parse JSON response
    result_text = result_text.strip()
    if result_text.startswith("```json"):
        result_text = result_text[7:]
    if result_text.startswith("```"):
        result_text = result_text[3:]
    if result_text.endswith("```"):
        result_text = result_text[:-3]
    result_text = result_text.strip()

    try:
        analysis = json.loads(result_text)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        json_match = re.search(r'\{[\s\S]*\}', result_text)
        if json_match:
            analysis = json.loads(json_match.group(0))
        else:
            raise HTTPException(status_code=500, detail="Failed to parse AI response")

    # Build final result
    result = {
        "id": f"{video_id}_{int(datetime.now().timestamp())}",
        "url": normalized_url,
        "timestamp": int(datetime.now().timestamp() * 1000),
        **analysis,
        "title": analysis.get("title", metadata.title),
        "speaker": analysis.get("speaker", metadata.channel),
        "actionItems": [
            {**item, "completed": False}
            for item in analysis.get("actionItems", [])
        ],
    }

    # Add metadata
    if metadata.thumbnail:
        result["thumbnail"] = metadata.thumbnail
    if metadata.view_count:
        result["viewCount"] = metadata.view_count

    print(f"[API] Success: '{result['title']}'")
    return result


@app.post("/api/analyze/stream")
async def analyze_video_stream(request: VideoRequest):
    """
    Analyze a YouTube video with streaming response (SSE).
    Returns analysis progressively for better UX.
    """
    video_id = extract_video_id(request.video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    normalized_url = f"https://www.youtube.com/watch?v={video_id}"

    async def generate() -> AsyncGenerator[str, None]:
        # Send initial status
        yield f"data: {json.dumps({'status': 'started', 'message': 'Fetching video metadata...'})}\n\n"

        # Get metadata
        metadata = get_video_metadata(video_id)
        yield f"data: {json.dumps({'status': 'metadata', 'data': metadata.model_dump()})}\n\n"

        # Try to get transcript
        yield f"data: {json.dumps({'status': 'processing', 'message': 'Analyzing video with AI...'})}\n\n"

        try:
            # Use Gemini with streaming
            response = client.models.generate_content_stream(
                model="gemini-2.0-flash",
                contents=[
                    Content(
                        role="user",
                        parts=[
                            Part.from_uri(
                                file_uri=normalized_url,
                                mime_type="video/*"
                            ),
                            Part.from_text(text=build_analysis_prompt(metadata))
                        ]
                    )
                ]
            )

            full_text = ""
            for chunk in response:
                if chunk.text:
                    full_text += chunk.text
                    yield f"data: {json.dumps({'status': 'streaming', 'chunk': chunk.text})}\n\n"

            # Parse final result
            result_text = full_text.strip()
            if result_text.startswith("```json"):
                result_text = result_text[7:]
            if result_text.startswith("```"):
                result_text = result_text[3:]
            if result_text.endswith("```"):
                result_text = result_text[:-3]

            analysis = json.loads(result_text.strip())

            result = {
                "id": f"{video_id}_{int(datetime.now().timestamp())}",
                "url": normalized_url,
                "timestamp": int(datetime.now().timestamp() * 1000),
                **analysis,
                "title": analysis.get("title", metadata.title),
                "speaker": analysis.get("speaker", metadata.channel),
            }

            yield f"data: {json.dumps({'status': 'complete', 'data': result})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.get("/api/metadata/{video_id}")
async def get_metadata(video_id: str):
    """Get video metadata only (without analysis)."""
    metadata = get_video_metadata(video_id)
    return metadata.model_dump()


@app.get("/api/transcript/{video_id}")
async def get_video_transcript(video_id: str):
    """Get video transcript only."""
    transcript = get_transcript(video_id)
    if not transcript:
        raise HTTPException(status_code=404, detail="Transcript not available")
    return {"video_id": video_id, "transcript": transcript}


# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
