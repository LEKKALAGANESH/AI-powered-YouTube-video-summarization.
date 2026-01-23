
# TubeCritique AI Architecture

## Overview
TubeCritique is an advanced intelligence engine that transforms YouTube content into structured, critiqued insights. Unlike standard summarizers, it employs a multi-stage workflow: **Extraction -> Validation -> Critique**.

## Core Architecture
- **Frontend**: React 18+ (SPA) with Tailwind CSS for high-performance UI.
- **State Management**: React Hooks (useState, useEffect, useMemo).
- **Intelligence**: Google Gemini 3 Pro Preview for deep analysis and reasoning.
- **Verification**: Google Search Grounding to verify claims made in videos.
- **Storage**: Mocked Supabase logic using LocalStorage for session persistence.

## The "Critique" Workflow
1. **Extraction**: Identifies core themes, action items, and data points.
2. **Relevance Scoring**: Calculates impact scores for AI Engineers, Product Managers, and Growth leads.
3. **Grounding**: Uses Gemini's Search tool to cross-reference video claims with current web data.
4. **Analysis**: Detects speaker bias, logical fallacies, and "holes in reasoning."

## Scalability
The app utilizes a service-oriented architecture, separating UI components from the Gemini API logic and storage layers, ensuring easy migration to a full Next.js/Supabase backend.
