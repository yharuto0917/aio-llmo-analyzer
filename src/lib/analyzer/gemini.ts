import { GoogleGenAI } from "@google/genai";

export interface GeminiAnalysisResult {
  geminiFetchSuccess: boolean;
  mockFallbackUsed: boolean;
  pageSummary: string;
  coreTopics: string[];
  keyClaimsOrFacts: string[];
  // Continuous 0-100 retrieval/comprehension fidelity (replaces the old 3-bucket richness).
  comprehensionScore: number;
  // Derived label kept for display/back-compat; computed from comprehensionScore.
  contentRichness: "HIGH" | "MEDIUM" | "LOW";
}

// Clamp an arbitrary model-provided number into a valid 0-100 integer score.
function clampScore(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Derive the coarse display label from the continuous score.
function richnessLabel(score: number): "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 75) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

export async function analyzeWithGemini(
  targetUrl: string,
  cleanBodyText: string,
  serverFetchSuccess: boolean,
  apiKey?: string
): Promise<GeminiAnalysisResult> {
  // Detect language from server-fetched text to enforce LLM output language
  const isJapanese = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(cleanBodyText);
  const targetLanguage = isJapanese ? "Japanese" : "English";

  let geminiFetchSuccess = false;
  let mockFallbackUsed = false;
  let pageSummary = "";
  let coreTopics: string[] = [];
  let keyClaimsOrFacts: string[] = [];
  let comprehensionScore = 0;
  let contentRichness: "HIGH" | "MEDIUM" | "LOW" = "LOW";

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      if (serverFetchSuccess && cleanBodyText.trim().length > 0) {
        const fetchPrompt = `You are an AI analyzing the text content of a webpage.
Below is the text content extracted from the URL: "${targetUrl}".

--- START WEBPAGE CONTENT ---
${cleanBodyText}
--- END WEBPAGE CONTENT ---

CRITICAL INSTRUCTION: You MUST output all text (summary, topics, claims) strictly in ${targetLanguage}.

Perform the following THREE independent tasks. The summary in TASK A must NOT influence how much you extract in TASK B — they are separate.

[TASK A — Display summary]
Write a brief 2-3 sentence overview of the page for a human reader. Keep it concise. This is for display only.

[TASK B — EXHAUSTIVE extraction for machine indexing]
COMPLETENESS is the goal here, not brevity:
- coreTopics: list EVERY distinct topic, keyword, entity, product, or service the page covers.
- keyClaimsOrFacts: list EVERY factual claim, number, statistic, date, price, or concrete data point stated on the page.
Do NOT omit, merge, or shorten items to be concise. Long lists are expected and desirable. Never summarize these two lists.

[TASK C — Comprehension fidelity]
- comprehensionScore: an INTEGER from 0 to 100 estimating how completely an AI could understand this page and answer real user questions from it. Judge the PAGE's information richness and retrievability — NOT how short your summary is. Use the full range (e.g. 12, 38, 57, 73, 91); do not cluster only at 0, 50, or 100.

Respond ONLY with a valid JSON object in the following format:
{
  "success": true,
  "summary": "a brief 2-3 sentence summary of the page content",
  "coreTopics": ["topic1", "topic2"],
  "keyClaimsOrFacts": ["claim1", "claim2"],
  "comprehensionScore": 0
}`;

        const fetchResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite", // Explicit model name per user instruction
          contents: fetchPrompt,
          config: {
            temperature: 0,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                success: { type: "BOOLEAN" },
                summary: { type: "STRING" },
                coreTopics: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                keyClaimsOrFacts: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                },
                comprehensionScore: {
                  type: "NUMBER"
                }
              },
              required: ["success", "summary", "coreTopics", "keyClaimsOrFacts", "comprehensionScore"]
            },
            maxOutputTokens: 8192
          }
        });

        const rawText = fetchResponse.text || "{}";
        let parsedResult: { success?: boolean; summary?: string; coreTopics?: string[]; keyClaimsOrFacts?: string[]; comprehensionScore?: number } = {};
        try {
          parsedResult = JSON.parse(rawText);
        } catch {
          const cleanJsonStr = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          try {
            parsedResult = JSON.parse(cleanJsonStr);
          } catch {}
        }

        if (parsedResult.success && parsedResult.summary) {
          geminiFetchSuccess = true;
          pageSummary = parsedResult.summary;
          coreTopics = parsedResult.coreTopics || [];
          keyClaimsOrFacts = parsedResult.keyClaimsOrFacts || [];
          comprehensionScore = clampScore(parsedResult.comprehensionScore);
          contentRichness = richnessLabel(comprehensionScore);
        } else {
          // LLM successfully responded but returned success: false or invalid JSON.
          // This is a normal LLM evaluation/behavior resulting in a 0 score (no system error is logged).
          geminiFetchSuccess = false;
          pageSummary = parsedResult.summary || (isJapanese
            ? "LLM分析により、このページには有効なコンテンツ構造が検出されませんでした。"
            : "No valid content structure was identified on this page during LLM analysis.");
          coreTopics = [];
          keyClaimsOrFacts = [];
          comprehensionScore = 0;
          contentRichness = "LOW";
        }
      }
    } catch (e: unknown) {
      console.error("Gemini Audit Error:", e);
      mockFallbackUsed = true;
    }
  } else {
    // API key is missing. This is a setup error.
    console.error("Gemini API Key is missing. Live LLM analysis is bypassed.");
    mockFallbackUsed = true;
  }

  // Fallback to mock data if Gemini API failed or apiKey is missing
  if (mockFallbackUsed) {
    if (isJapanese) {
      pageSummary = "[MOCK SUMMARY] (実際のAPIキーを設定してLLMフェッチをテストしてください) このページはサービスや最適化プランについて詳述する企業サイトのようです。";
    } else {
      pageSummary = "[MOCK SUMMARY] (Add GEMINI_API_KEY environment variable to test real-time LLM fetch capability). The page appears to be a corporate website detailing its product services and optimization plans.";
    }
  }

  return {
    geminiFetchSuccess,
    mockFallbackUsed,
    pageSummary,
    coreTopics,
    keyClaimsOrFacts,
    comprehensionScore,
    contentRichness,
  };
}
