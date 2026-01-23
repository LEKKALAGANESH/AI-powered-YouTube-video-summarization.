# User Guide

**Project:** TubeCritique AI
**Version:** 1.0.0
**Date:** January 2025

---

## 1. Introduction

TubeCritique AI is an intelligent YouTube video analyzer that extracts insights, generates summaries, and critiques content using AI. This guide will help you get the most out of the application.

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
   - Make sure the video has captions/subtitles enabled (CC icon)

2. **Copy the Video URL**
   - Copy the URL from your browser's address bar
   - Supported formats:
     - `https://www.youtube.com/watch?v=VIDEO_ID`
     - `https://youtu.be/VIDEO_ID`
     - YouTube Shorts and Live URLs also work

3. **Paste and Analyze**
   - Paste the URL into the input field
   - Click the "Analyze" button
   - Wait for the analysis to complete (usually 10-30 seconds)

4. **View Results**
   - The analysis will display with multiple sections
   - Scroll through to explore all insights

### 3.2 Video Requirements

| Requirement | Description |
|-------------|-------------|
| Captions | Video must have subtitles/closed captions |
| Accessibility | Video must be publicly accessible |
| Length | Any length (longer videos may take more time) |

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

### 7.1 No Captions Error

**Message:** "This video doesn't have captions/subtitles available"

**Solution:**
- The video doesn't have CC enabled
- Try a different video with captions
- Many educational and official channels have captions

**What you'll see:**
- Video title and channel name
- Link to the video
- Error explanation

### 7.2 Rate Limit Error

**Message:** "API rate limit reached. Please wait and try again."

**Solution:**
- Wait a few minutes
- Try again later

### 7.3 Analysis Failed

**Message:** "AI analysis failed. Please try again."

**Solution:**
- Click "Analyze" again
- If persistent, try a different video

---

## 8. Tips & Best Practices

### 8.1 Choosing Videos

**Best results with:**
- Educational content
- Podcasts and interviews
- Tech talks and presentations
- Videos with clear audio and captions

**May have issues:**
- Music videos (limited meaningful content)
- Videos without captions
- Very short clips

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

- All analysis history stored in your browser only
- No account required
- No data sent to external servers (except YouTube and Gemini API)

### 10.2 Clearing Data

To clear your history:
1. Open browser Developer Tools (F12)
2. Go to Application > Local Storage
3. Delete `tubecritique_summaries` key

Or clear all browser data for the site.

---

## 11. FAQ

**Q: Why does analysis take time?**
A: The AI needs to process the transcript and generate comprehensive insights. Usually 10-30 seconds.

**Q: Can I analyze private videos?**
A: No, only publicly accessible videos can be analyzed.

**Q: Why no captions error on a video that has captions?**
A: Some videos have auto-generated captions that may not be accessible. Try official/verified content.

**Q: Is my history synced across devices?**
A: No, history is stored locally in your browser only.

**Q: Can I export my analysis?**
A: Currently no export feature. You can copy/paste content manually.

**Q: How accurate is the analysis?**
A: The AI provides helpful insights but always verify critical claims independently.

---

## 12. Support

For issues or feedback:
- Check the FAQ above
- Review error messages carefully
- Try a different video to isolate issues
