import { GoogleGenAI } from "@google/genai";

export interface GeminiAnalysisResult {
  geminiFetchSuccess: boolean;
  mockFallbackUsed: boolean;
  pageSummary: string;
  coreTopics: string[];
  keyClaimsOrFacts: string[];
  contentRichness: "HIGH" | "MEDIUM" | "LOW";
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
  let contentRichness: "HIGH" | "MEDIUM" | "LOW" = "LOW";

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      if (serverFetchSuccess && cleanBodyText.trim().length > 0) {
        const fetchPrompt = `You are an AI analyzing the text content of a webpage.
The webpage content was fetched from the URL: "${targetUrl}".

CRITICAL INSTRUCTION: You MUST output all text (summary, topics, claims) strictly in ${targetLanguage}.

Please analyze the following webpage content. Extract:
1. A brief 2-3 sentence summary of the page content.
2. The core topics or main keywords that are the focus of this page.
3. The key claims, facts, numbers, or data points specifically stated in this text.
4. An evaluation of the content's richness ("HIGH", "MEDIUM", or "LOW") indicating if it has enough detailed information to answer user questions effectively.

Respond ONLY with a valid JSON object in the following format:
{
  "success": true,
  "summary": "a brief 2-3 sentence summary of the page content",
  "coreTopics": ["topic1", "topic2"],
  "keyClaimsOrFacts": ["claim1", "claim2"],
  "contentRichness": "HIGH"
}

Webpage Content:
"""
${cleanBodyText.slice(0, 8000)}
"""`;

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
                contentRichness: { 
                  type: "STRING",
                  enum: ["HIGH", "MEDIUM", "LOW"]
                }
              },
              required: ["success", "summary", "coreTopics", "keyClaimsOrFacts", "contentRichness"]
            },
            tools: [],
            maxOutputTokens: 8192
          }
        });

        const rawText = fetchResponse.text || "{}";
        let parsedResult: { success?: boolean; summary?: string; coreTopics?: string[]; keyClaimsOrFacts?: string[]; contentRichness?: "HIGH" | "MEDIUM" | "LOW" } = {};
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
          contentRichness = parsedResult.contentRichness || "LOW";
        }
      }
    } catch (e: unknown) {
      console.error("Gemini Audit Error:", e);
    }
  }

  // Fallback to mock data if Gemini API failed or apiKey is missing
  if (!geminiFetchSuccess) {
    mockFallbackUsed = true;
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
    contentRichness,
  };
}
