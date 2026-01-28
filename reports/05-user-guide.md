# User Guide

**Project:** TubeCritique AI
**Version:** 2.0.0
**Date:** January 2025
**Last Updated:** January 28, 2025

---

## 1. Introduction

TubeCritique AI is an intelligent YouTube video analyzer that extracts insights, generates summaries, and critiques content using AI. Powered by Google's Gemini 2.0 Flash model, it can analyze videos by either watching them directly or processing their transcripts. This guide will help you get the most out of the application.

---

## 2. Getting Started

### 2.1 Accessing the Application

1. Open your web browser
2. Navigate to the application URL
3. You'll see the home page with the analysis input

### 2.2 System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection

---

## 3. Analyzing a Video

### 3.1 Step-by-Step Guide

1. **Find a YouTube Video**
   - Go to YouTube and find a video you want to analyze
   - The video should be publicly accessible

2. **Copy the Video URL**
   - Copy the URL from your browser's address bar
   - Supported formats:
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - YouTube Shorts and Live URLs also work

3. **Paste and Analyze**
   - Paste the URL into the input field
   - Click the "Analyze" button
   - Wait for the analysis to complete (usually 15-45 seconds)

4. **View Results**
   - The analysis will display with multiple sections
   - Scroll through to explore all insights

### 3.2 Video Requirements

| Requirement | Description |
|-------------|-------------|
| Public Access | Video must be publicly accessible |
| Length | Any length (longer videos may take more time) |
| Captions | Helpful but not required (Gemini can watch video directly) |

### 3.3 How Analysis Works

TubeCritique AI uses a two-step approach:

1. **Primary Method:** Gemini AI "watches" the video directly for comprehensive analysis
2. **Fallback Method:** If direct viewing fails, it uses the video's transcript for text-based analysis

This ensures maximum compatibility with different video types.

---

## 4. Understanding the Analysis

### 4.1 TL;DR

A brief 2-3 sentence summary of the video's main points. Perfect for quick understanding.

### 4.2 Comprehensive Summary

A detailed 300-500 word summary covering all major topics discussed in the video.

### 4.3 Relevance Scores

Three scores from 1-5 indicating how relevant the video is for:

| Score | Category | Description |
|-------|----------|-------------|
| AI/Tech | Technology professionals | Relevance to AI, ML, software engineering |
| PM | Product Managers | Relevance to product management |
| Growth | Personal Development | Relevance to personal/professional growth |

**Score Legend:**
- 1 = Not relevant
- 2 = Slightly relevant
- 3 = Moderately relevant
- 4 = Very relevant
- 5 = Essential

### 4.4 Tags

- **Broad Tags:** General categories (e.g., "Technology", "Business")
- **Specific Tags:** Detailed topics (e.g., "React Hooks", "Startup Funding")

### 4.5 Key Moments

A table of important timestamps with descriptions:
- Time: When the moment occurs (MM:SS)
- Topic: What happens at this timestamp

Click timestamps to jump to that part of the video (on YouTube).

### 4.6 Key Insights

The most valuable takeaways from the video:
- **Title:** The insight headline
- **Explanation:** Why this insight matters

### 4.7 How This Applies

Practical applications of the video content:
- **Product/Business:** How businesses can use this information
- **Personal:** How individuals can apply it personally

### 4.8 Critique & Fact-Check

Critical analysis of the video content:

| Section | Description |
|---------|-------------|
| Claims to Verify | Statements that should be fact-checked |
| Holes in Reasoning | Logical gaps or weaknesses |
| What's Missing | Topics not covered |
| Speaker Bias | Analysis of potential bias |

### 4.9 Reusable Quotes

Memorable quotes from the video with:
- The quote text
- Who said it
- Context of when/why it was said

### 4.10 Action Items

Actionable takeaways you can implement:
- **Task:** What to do
- **Context:** Why it matters
- **Checkbox:** Mark as completed (saved automatically)

### 4.11 Notes for Later

Key points to remember for future reference.

### 4.12 Craft Analysis

For content creators, analysis of the video's production:
- **Opening Hook:** How the video captures attention
- **Structure Pattern:** How the content is organized
- **Pacing Notes:** Flow and timing observations
- **Sticky Moments:** Most memorable parts
- **Editing Notes:** Production quality observations

---

## 5. Action Items Feature

### 5.1 Checking Off Items

1. Click on any action item text or checkbox
2. The item will be marked as completed (strikethrough)
3. Progress is automatically saved

### 5.2 Persistence

- Action item status is saved to your browser
- Reopening the analysis from History preserves your progress

---

## 6. History Feature

### 6.1 Accessing History

1. Click "History" in the navigation bar
2. View all previously analyzed videos

### 6.2 History Cards

Each card shows:
- Video title
- TL;DR summary
- Relevance scores
- Date analyzed

### 6.3 Searching History

1. Use the search box at the top
2. Search by title or content
3. Results filter in real-time

### 6.4 Viewing Past Analyses

1. Click on any history card
2. Full analysis opens
3. Action item progress is preserved

---

## 7. Error Handling

### 7.1 Analysis Failed

**Message:** "AI analysis failed. Please try again."

**Solution:**
- Click "Analyze" again
- If persistent, try a different video
- The backend may be temporarily unavailable

### 7.2 Rate Limit Error

**Message:** "API rate limit reached. Please wait and try again."

**Solution:**
- Wait a few minutes
- Try again later

### 7.3 Backend Unavailable

**Message:** "Backend service unavailable"

**Solution:**
- Wait a moment and try again
- The backend server may be starting up (especially on free tier hosting)

### 7.4 Invalid URL

**Message:** "Please provide a valid YouTube URL"

**Solution:**
- Ensure you're using a complete YouTube URL
- Check for typos in the URL

---

## 8. Tips & Best Practices

### 8.1 Choosing Videos

**Best results with:**
- Educational content
- Podcasts and interviews
- Tech talks and presentations
- Tutorial videos
- Any video with clear audio

**May have longer processing time:**
- Very long videos (1+ hours)
- Videos with complex visual content

### 8.2 Using the Analysis

1. **Quick Overview:** Start with TL;DR
2. **Deep Dive:** Read Comprehensive Summary
3. **Verify:** Check Critique section
4. **Take Action:** Use Action Items
5. **Reference:** Save important Quotes

### 8.3 Productivity Tips

- Analyze videos before watching to decide if worth your time
- Use scores to prioritize relevant content
- Check off action items as you complete them
- Search history for past insights

---

## 9. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit URL (when input focused) |
| `Ctrl/Cmd + V` | Paste URL |

---

## 10. Privacy

### 10.1 Data Storage

- All analysis history stored in your browser only (LocalStorage)
- No account required
- Video URLs are sent to our backend for processing
- No personal data is collected or stored server-side

### 10.2 Clearing Data

To clear your history:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Delete `tubecritique_summaries` key

Or clear all browser data for the site.

### 10.3 What Data is Processed

- Video URL (sent to backend)
- Video metadata (fetched from YouTube)
- Video content or transcript (processed by Gemini AI)
- Analysis results (returned to your browser)

---

## 11. FAQ

**Q: Why does analysis take time?**
A: The AI needs to process the video content and generate comprehensive insights. Usually 15-45 seconds depending on video length.

**Q: Can I analyze private videos?**
A: No, only publicly accessible videos can be analyzed.

**Q: Do videos need captions?**
A: No, captions are not required. Gemini AI can watch and analyze the video directly. Captions are used as a fallback if needed.

**Q: Is my history synced across devices?**
A: No, history is stored locally in your browser only.

**Q: Can I export my analysis?**
A: Currently no export feature. You can copy/paste content manually.

**Q: How accurate is the analysis?**
A: The AI provides helpful insights but always verify critical claims independently.

**Q: Why did analysis fail?**
A: Common reasons include:
- Backend server temporarily unavailable
- Gemini API rate limits
- Network connectivity issues
Try again after a few moments.

**Q: Can I analyze YouTube Shorts?**
A: Yes, YouTube Shorts URLs are supported.

**Q: What about live streams?**
A: Live stream recordings can be analyzed after they end. Active live streams cannot be analyzed.

---

## 12. Technical Details

### 12.1 How It Works

1. You submit a YouTube URL
2. Our Python backend extracts video metadata
3. Gemini AI analyzes the video content
4. Structured analysis is returned to your browser
5. Results are saved to LocalStorage

### 12.2 AI Model

- **Model:** Google Gemini 2.0 Flash
- **Capabilities:** Native video understanding, text analysis
- **Features:** Can "watch" videos directly for comprehensive analysis

### 12.3 Backend Technology

- **Framework:** FastAPI (Python)
- **Hosting:** Railway or Render
- **Video Processing:** yt-dlp, youtube-transcript-api

---

## 13. Support

For issues or feedback:
- Check the FAQ above
- Review error messages carefully
- Try a different video to isolate issues
- Report issues at the project repository
