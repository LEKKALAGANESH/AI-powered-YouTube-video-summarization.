import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Python backend URL - if set, proxy requests to Python FastAPI backend
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL;

// ============================================================================
// API ROUTE - Proxy to Python Backend
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get video URL from either format
    const videoUrl = body.video_url || body.videoUrl;

    if (!videoUrl || typeof videoUrl !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid YouTube URL" },
        { status: 400 }
      );
    }

    // If Python backend is configured, proxy the request
    if (PYTHON_BACKEND_URL) {
      console.log(`[Proxy] Forwarding to Python backend: ${PYTHON_BACKEND_URL}`);

      const pythonResponse = await fetch(`${PYTHON_BACKEND_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_url: videoUrl }),
      });

      const data = await pythonResponse.json();

      if (!pythonResponse.ok) {
        return NextResponse.json(data, { status: pythonResponse.status });
      }

      return NextResponse.json(data);
    }

    // No Python backend - return error suggesting to configure it
    return NextResponse.json(
      {
        error: "Backend not configured. Please set PYTHON_BACKEND_URL environment variable.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
