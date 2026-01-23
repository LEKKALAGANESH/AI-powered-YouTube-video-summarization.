
import { GoogleGenAI, Type } from "@google/genai";
import { SummaryResult } from "../types";

export const generateVideoCritique = async (videoUrl: string): Promise<SummaryResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following YouTube video URL: ${videoUrl}

    Perform a comprehensive "YouTube Summary & Critique" workflow following this exact structure:

    1. METADATA: Extract video title, duration (format: "X min"), and speaker/creator name.

    2. TL;DR: Write 2-3 sentences capturing the core message of the video. Plain text only, no markdown.

    3. COMPREHENSIVE SUMMARY: Write a detailed 500-1000 word summary that allows someone to understand the full content without watching. Include:
       - Speaker background and credibility
       - Main topics in chronological order
       - Key arguments with reasoning
       - Specific examples, stories, or data points
       - How different topics connect
       IMPORTANT: Write in plain text only. Do NOT use any markdown formatting like **bold**, *italics*, or headers. Use natural paragraph breaks instead.

    4. RELEVANCE SCORES: Rate 1-5 for each category:
       - AI/Tech: Technical depth, tools, implementation patterns, APIs, architecture
       - Product Management: Frameworks, user research, prioritization, metrics
       - Entrepreneurship/Growth: GTM strategy, fundraising, scaling, positioning

    5. TAGS: Provide searchable tags:
       - Broad tags: General categories like [AI], [Product-Management], [Growth], [Fundraising]
       - Specific tags: Exact topics like [retention-metrics], [pricing-strategy], [user-research]

    6. KEY MOMENTS WITH TIMESTAMPS: List 5-10 important moments with MM:SS format and topic description.

    7. KEY INSIGHTS: Extract 3-7 non-obvious takeaways. For each:
       - Insight title (short, no markdown)
       - 2-3 sentence explanation of why it matters and how it applies (plain text, no markdown)

    8. HOW THIS APPLIES: Connect insights to practical application (plain text, no markdown):
       - Product/Business parallels: How insights apply to AI development, product management, enterprise automation
       - Personal relevance: How this connects to learning goals, current projects, decisions

    9. CRITIQUE & FACT-CHECK (all plain text, no markdown):
       - Claims to verify: List 2-3 specific claims with fact-check results using search grounding
       - Holes in reasoning: Identify survivorship bias, cherry-picked data, circular logic, unstated assumptions
       - What's missing: Perspectives not represented, counterarguments not addressed, data not cited
       - Speaker bias/incentives: What are they selling? How might their position color the narrative?

    10. REUSABLE QUOTES: Extract 2-5 memorable quotes that stand alone. Include speaker name and context.

    11. ACTION ITEMS: List 2-4 specific, actionable tasks tied to insights from the video.

    12. NOTES FOR LATER: Secondary observations, resources mentioned, questions raised, things to verify.

    13. CRAFT ANALYSIS (only if video demonstrates exceptional storytelling):
        - Opening hook technique
        - Structure pattern (chronological, problem→solution, framework reveal, etc.)
        - Pacing notes
        - Sticky moments that landed well
        - Editing suggestions

    IMPORTANT: All text content must be plain text only. Do NOT use markdown formatting like **bold**, *italics*, ### headers, or bullet points with dashes. Write naturally with proper sentences and paragraph breaks.

    Return the response strictly as a JSON object matching the schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          speaker: { type: Type.STRING },
          tldr: { type: Type.STRING },
          comprehensiveSummary: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              ai: { type: Type.NUMBER },
              pm: { type: Type.NUMBER },
              growth: { type: Type.NUMBER }
            }
          },
          tags: {
            type: Type.OBJECT,
            properties: {
              broad: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              specific: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          },
          keyMoments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                topic: { type: Type.STRING }
              }
            }
          },
          keyInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          howThisApplies: {
            type: Type.OBJECT,
            properties: {
              productBusiness: { type: Type.STRING },
              personal: { type: Type.STRING }
            }
          },
          critique: {
            type: Type.OBJECT,
            properties: {
              claimsToVerify: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    claim: { type: Type.STRING },
                    verdict: { type: Type.STRING },
                    sourceUrl: { type: Type.STRING }
                  }
                }
              },
              holesInReasoning: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              whatsMissing: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              speakerBias: { type: Type.STRING }
            }
          },
          quotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                speaker: { type: Type.STRING },
                context: { type: Type.STRING }
              }
            }
          },
          actionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                task: { type: Type.STRING },
                context: { type: Type.STRING }
              }
            }
          },
          notesForLater: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          craftAnalysis: {
            type: Type.OBJECT,
            properties: {
              openingHook: { type: Type.STRING },
              structurePattern: { type: Type.STRING },
              pacingNotes: { type: Type.STRING },
              stickyMoments: { type: Type.STRING },
              editingNotes: { type: Type.STRING }
            }
          }
        },
        required: ["title", "duration", "speaker", "tldr", "comprehensiveSummary", "scores", "tags", "keyMoments", "keyInsights", "howThisApplies", "critique", "quotes", "actionItems", "notesForLater"]
      }
    },
  });

  const rawJson = JSON.parse(response.text || '{}');
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

  const sources = groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Grounding Source',
    uri: chunk.web?.uri || ''
  })).filter((s: any) => s.uri !== '');

  return {
    ...rawJson,
    id: Math.random().toString(36).substr(2, 9),
    url: videoUrl,
    timestamp: Date.now(),
    groundingSources: sources,
    actionItems: rawJson.actionItems?.map((item: any) => ({
      ...item,
      completed: false
    })) || []
  };
};
