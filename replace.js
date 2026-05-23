const fs = require('fs');
const file = 'src/app/api/analyze/route.ts';
let code = fs.readFileSync(file, 'utf8');

const startMarker = `    // ----------------------------------------------------
    // 3. LLMO SCORE CALCULATION & GEMINI VERIFICATION (Max 100 points)
    // ----------------------------------------------------`;

const endMarker = `    // ----------------------------------------------------
    // COMPREHENSIVE SCORE CALCULATION
    // ----------------------------------------------------`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found");
  process.exit(1);
}

const replacement = `    // ----------------------------------------------------
    // 3. LLMO SCORE CALCULATION & GEMINI VERIFICATION (Max 100 points)
    // ----------------------------------------------------
    const llmoDetails = [];
    let llmoScore = 0;
    let geminiFetchSuccess = false;
    let pageSummary = "";
    let coreTopics: string[] = [];
    let keyClaimsOrFacts: string[] = [];
    let contentRichness: "HIGH" | "MEDIUM" | "LOW" = "LOW";
    let richnessScore = 0;

    // Detect language from server-fetched text to enforce LLM output language
    const isJapanese = /[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff]/.test(cleanBodyText);
    const targetLanguage = isJapanese ? "Japanese" : "English";

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        if (serverFetchSuccess && cleanBodyText.trim().length > 0) {
          const fetchPrompt = \`You are an AI analyzing the text content of a webpage.
The webpage content was fetched from the URL: "\${targetUrl}".

CRITICAL INSTRUCTION: You MUST output all text (summary, topics, claims) strictly in \${targetLanguage}.

Please analyze the following text content. Extract:
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
\${cleanBodyText.slice(0, 8000)}
"""\`;

          const fetchResponse = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite-preview",
            contents: fetchPrompt,
            config: {
              temperature: 0,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  success: { type: Type.BOOLEAN },
                  summary: { type: Type.STRING },
                  coreTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  keyClaimsOrFacts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  contentRichness: { 
                    type: Type.STRING,
                    enum: ["HIGH", "MEDIUM", "LOW"]
                  }
                },
                required: ["success", "summary", "coreTopics", "keyClaimsOrFacts", "contentRichness"]
              },
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.MEDIUM
              },
              maxOutputTokens: 8192
            }
          });

          const rawText = fetchResponse.text || "{}";
          let parsedResult: { success?: boolean; summary?: string; coreTopics?: string[]; keyClaimsOrFacts?: string[]; contentRichness?: "HIGH" | "MEDIUM" | "LOW" } = {};
          try {
            parsedResult = JSON.parse(rawText);
          } catch {
            const cleanJsonStr = rawText.replace(/\`\`\`json/gi, "").replace(/\`\`\`/g, "").trim();
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
      } catch (e: any) {
        console.error("Gemini Audit Error:", e);
      }
    } else {
      geminiFetchSuccess = true;
      if (isJapanese) {
        pageSummary = "[MOCK SUMMARY] (実際のAPIキーを設定してLLMフェッチをテストしてください) このページはサービスや最適化プランについて詳述する企業サイトのようです。";
        coreTopics = ["[MOCK] LLMO Optimizer", "[MOCK] 検索エンジン", "[MOCK] ウェブクローラー"];
        keyClaimsOrFacts = ["[MOCK] 精度98%", "[MOCK] 10倍高速"];
        contentRichness = "HIGH";
      } else {
        pageSummary = "[MOCK SUMMARY] (Add GEMINI_API_KEY environment variable to test real-time LLM fetch capability). The page appears to be a corporate website detailing its product services and optimization plans.";
        coreTopics = ["[MOCK] LLMO Optimizer", "[MOCK] Search Engine", "[MOCK] Web Crawler"];
        keyClaimsOrFacts = ["[MOCK] 98% accuracy", "[MOCK] 10x faster"];
        contentRichness = "HIGH";
      }
    }

    if (contentRichness === "HIGH") richnessScore = 100;
    else if (contentRichness === "MEDIUM") richnessScore = 50;
    else richnessScore = 0;

    // LLM Parseability Check (40 pts) - Since we use URL Context, we check if LLM successfully parsed the HTML text
    const fetchabilityScore = geminiFetchSuccess ? 40 : 0;
    llmoScore += fetchabilityScore;
    llmoDetails.push({
      name: "LLM URL Context Extraction",
      score: fetchabilityScore,
      max: 40,
      status: geminiFetchSuccess ? "pass" : "fail",
      description: geminiFetchSuccess
        ? "Gemini successfully parsed the text context of this webpage."
        : "Gemini failed to extract valid structured data from this page's text context.",
    });

    // Content Richness Check (20 pts)
    const accuracyPoints = Math.round((richnessScore / 100) * 20);
    llmoScore += accuracyPoints;
    llmoDetails.push({
      name: "LLM Content Richness Score",
      score: accuracyPoints,
      max: 20,
      status: accuracyPoints >= 15 ? "pass" : (accuracyPoints >= 8 ? "partial" : "fail"),
      description: \`Evaluated Content Richness: \${contentRichness}. \${contentRichness === "HIGH" ? "Provides sufficient details to answer user intents." : "Lacking depth or detail."}\`,
    });

    // Fact & Data-Point Density (20 pts)
    const hasStats = keyClaimsOrFacts.length >= 3;
    const statsScore = hasStats ? 20 : (keyClaimsOrFacts.length > 0 ? 10 : 0);
    llmoScore += statsScore;
    llmoDetails.push({
      name: "Factual Claims & Data Density",
      score: statsScore,
      max: 20,
      status: statsScore === 20 ? "pass" : (statsScore === 10 ? "partial" : "fail"),
      description: hasStats
        ? \`Rich data density! Detected \${keyClaimsOrFacts.length} specific factual claims. Highly beneficial for LLM citations.\`
        : \`Only found \${keyClaimsOrFacts.length} factual claims. AI systems prioritize clear facts and statistical metrics for claims.\`,
    });

    // Core Topic Definition (20 pts)
    const hasEntities = coreTopics.length >= 4;
    const entityScore = hasEntities ? 20 : (coreTopics.length > 0 ? 10 : 0);
    llmoScore += entityScore;
    llmoDetails.push({
      name: "Core Topic Density",
      score: entityScore,
      max: 20,
      status: entityScore === 20 ? "pass" : (entityScore === 10 ? "partial" : "fail"),
      description: hasEntities
        ? \`Found sufficient core topics. Perfect for entity disambiguation in the LLM Knowledge Graph.\`
        : \`Low topic count (\${coreTopics.length} topics). Make sure your key services and topics are clear.\`,
    });

`;

const newCode = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync(file, newCode);
console.log("Replaced successfully");
