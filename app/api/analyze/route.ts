import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// CONFIGURATION
// ============================================================================

const MAX_TRANSCRIPT_CHARS = 50000;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

// ============================================================================
// TYPES
// ============================================================================

interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

interface TranscriptResult {
  segments: TranscriptSegment[];
  fullText: string;
  title: string;
  channelName: string;
}

interface AnalysisResult {
  title: string;
  duration: string;
  speaker: string;
  tldr: string;
  comprehensiveSummary: string;
  scores: { ai: number; pm: number; growth: number };
  tags: { broad: string[]; specific: string[] };
  keyMoments: Array<{ time: string; topic: string }>;
  keyInsights: Array<{ title: string; explanation: string }>;
  howThisApplies: { productBusiness: string; personal: string };
  critique: {
    claimsToVerify: Array<{ claim: string; verdict: string; sourceUrl: string }>;
    holesInReasoning: string[];
    whatsMissing: string[];
    speakerBias: string;
  };
  quotes: Array<{ text: string; speaker: string; context: string }>;
  actionItems: Array<{ task: string; context: string }>;
  notesForLater: string[];
  craftAnalysis: {
    openingHook: string;
    structurePattern: string;
    pacingNotes: string;
    stickyMoments: string;
    editingNotes: string;
  };
}

// ============================================================================
// VIDEO ID EXTRACTION
// ============================================================================

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

// ============================================================================
// TRANSCRIPT FETCHING
// ============================================================================

async function fetchYouTubePage(videoId: string): Promise<string> {
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video page: ${response.status}`);
  }

  return response.text();
}

function extractVideoMetadata(html: string): { title: string; channelName: string } {
  let title = "Unknown Title";
  let channelName = "Unknown Channel";

  // Extract title
  const titleMatch = html.match(/"title":"([^"]+)"/);
  if (titleMatch) {
    title = titleMatch[1].replace(/\\u0026/g, "&").replace(/\\"/g, '"');
  }

  // Extract channel name
  const channelMatch = html.match(/"ownerChannelName":"([^"]+)"/);
  if (channelMatch) {
    channelName = channelMatch[1];
  }

  return { title, channelName };
}

function extractCaptionTracks(html: string): Array<{ baseUrl: string; languageCode: string; name: string }> {
  const tracks: Array<{ baseUrl: string; languageCode: string; name: string }> = [];

  // Find captions in ytInitialPlayerResponse
  const playerMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\});/s);
  if (!playerMatch) {
    // console.log("[Transcript] No ytInitialPlayerResponse found");
    return tracks;
  }

  try {
    // Find the captionTracks array within the response
    const captionsMatch = playerMatch[1].match(/"captionTracks":\s*(\[[\s\S]*?\])/);
    if (!captionsMatch) {
      // console.log("[Transcript] No captionTracks found");
      return tracks;
    }

    // Parse each track
    const trackRegex = /\{"baseUrl":"([^"]+)"[^}]*"languageCode":"([^"]+)"[^}]*?"name":\{"[^"]*":"([^"]+)"/g;
    let match;
    while ((match = trackRegex.exec(captionsMatch[1])) !== null) {
      tracks.push({
        baseUrl: match[1].replace(/\\u0026/g, "&"),
        languageCode: match[2],
        name: match[3],
      });
    }
  } catch (e) {
    // console.log("[Transcript] Error parsing captions:", e);
  }

  return tracks;
}

async function fetchCaptionXML(captionUrl: string): Promise<TranscriptSegment[]> {
  const response = await fetch(captionUrl, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch captions: ${response.status}`);
  }

  const xml = await response.text();
  const segments: TranscriptSegment[] = [];

  // Parse XML: <text start="X" dur="Y">content</text>
  const textRegex = /<text[^>]*start="([^"]*)"[^>]*dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
  let match;

  while ((match = textRegex.exec(xml)) !== null) {
    const start = parseFloat(match[1]) || 0;
    const duration = parseFloat(match[2]) || 0;
    let text = match[3]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\n/g, " ")
      .trim();

    if (text) {
      segments.push({ text, start, duration });
    }
  }

  return segments;
}

// ============================================================================
// GEMINI API
// ============================================================================

function buildPrompt(transcript: TranscriptResult): string {
  const timestampedText = transcript.segments
    .slice(0, 500)
    .map((s) => {
      const mins = Math.floor(s.start / 60);
      const secs = Math.floor(s.start % 60);
      return `[${mins}:${secs.toString().padStart(2, "0")}] ${s.text}`;
    })
    .join("\n");

  return `Analyze this YouTube video based on its transcript.

VIDEO TITLE: ${transcript.title}
CHANNEL: ${transcript.channelName}

=== TRANSCRIPT WITH TIMESTAMPS ===
${timestampedText}
=== END TRANSCRIPT ===

Based on this transcript, return a JSON object with this exact structure:
{
  "title": "${transcript.title}",
  "duration": "estimate based on timestamps",
  "speaker": "${transcript.channelName}",
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

Scoring:
- ai: Relevance to AI/ML (1=none, 5=essential)
- pm: Relevance to product management (1=none, 5=essential)
- growth: Relevance to personal growth (1=none, 5=essential)

IMPORTANT: Return ONLY the JSON object. No markdown, no code blocks.`;
}

async function analyzeWithGemini(transcript: TranscriptResult): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // console.log("[Gemini] Analyzing transcript...");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(transcript);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  let text = response.text || "";
  // console.log(`[Gemini] Response: ${text.length} chars`);

  // Clean markdown
  text = text.trim();
  if (text.startsWith("```json")) text = text.slice(7);
  if (text.startsWith("```")) text = text.slice(3);
  if (text.endsWith("```")) text = text.slice(0, -3);
  text = text.trim();

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch {
    // Try to extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as AnalysisResult;
    }
    // console.error("[Gemini] Failed to parse:", text.slice(0, 500));
    throw new Error("Invalid JSON response from AI");
  }
}

// ============================================================================
// API ROUTE
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoUrl } = body;

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid YouTube URL" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(videoUrl.trim());
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL format" },
        { status: 400 }
      );
    }

    const normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    // console.log(`[API] Processing: ${videoId}`);

    // Step 1: Fetch video page and metadata first
    let html: string;
    let videoMetadata: { title: string; channelName: string };
    try {
      html = await fetchYouTubePage(videoId);
      videoMetadata = extractVideoMetadata(html);
      // console.log(`[Transcript] Video: "${videoMetadata.title}" by ${videoMetadata.channelName}`);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to access video. Please check the URL." },
        { status: 400 }
      );
    }

    // Step 2: Get transcript
    let transcript: TranscriptResult;
    try {
      const captionTracks = extractCaptionTracks(html);
      // console.log(`[Transcript] Found ${captionTracks.length} caption tracks`);

      if (captionTracks.length === 0) {
        return NextResponse.json(
          {
            error: "This video doesn't have captions/subtitles available",
            videoTitle: videoMetadata.title,
            videoChannel: videoMetadata.channelName,
            videoUrl: normalizedUrl,
          },
          { status: 400 }
        );
      }

      const englishTrack = captionTracks.find(
        (t) => t.languageCode === "en" || t.languageCode.startsWith("en")
      );
      const selectedTrack = englishTrack || captionTracks[0];
      // console.log(`[Transcript] Using: ${selectedTrack.name} (${selectedTrack.languageCode})`);

      const segments = await fetchCaptionXML(selectedTrack.baseUrl);
      if (segments.length === 0) {
        throw new Error("Failed to parse caption data");
      }

      let fullText = segments.map((s) => s.text).join(" ");
      if (fullText.length > MAX_TRANSCRIPT_CHARS) {
        fullText = fullText.slice(0, MAX_TRANSCRIPT_CHARS);
      }

      transcript = {
        segments,
        fullText,
        title: videoMetadata.title,
        channelName: videoMetadata.channelName,
      };
    } catch (error) {
      const msg = (error as Error).message;
      // console.error(`[Transcript] Error: ${msg}`);

      return NextResponse.json(
        {
          error: `Failed to get transcript: ${msg}`,
          videoTitle: videoMetadata.title,
          videoChannel: videoMetadata.channelName,
          videoUrl: normalizedUrl,
        },
        { status: 400 }
      );
    }

    // Step 2: Analyze with Gemini
    let analysis: AnalysisResult;
    try {
      analysis = await analyzeWithGemini(transcript);
    } catch (error) {
      const msg = (error as Error).message;
      // console.error(`[Gemini] Error: ${msg}`);

      if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
        return NextResponse.json(
          { error: "API rate limit reached. Please wait and try again." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "AI analysis failed. Please try again." },
        { status: 500 }
      );
    }

    // Build result
    const result = {
      id: Math.random().toString(36).substring(2, 11),
      url: normalizedUrl,
      timestamp: Date.now(),
      ...analysis,
      // Ensure title matches the actual video
      title: transcript.title,
      speaker: transcript.channelName,
      actionItems: (analysis.actionItems || []).map((item) => ({
        ...item,
        completed: false,
      })),
    };

    // console.log(`[API] Success: "${result.title}"`);
    return NextResponse.json(result);

  } catch (error) {
    // console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
