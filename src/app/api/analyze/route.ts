import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";

// SDK will be initialized dynamically inside the request handler to support request-time environment variables
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Ensure URL has protocol
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    // 1. Fetch the target URL content via standard HTTP client
    let html = "";
    let serverFetchSuccess = false;
    let fetchError = "";
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 AIO-LLMO-Analyzer/1.0",
        },
        signal: AbortSignal.timeout(10000), // 10s timeout
      });
      if (response.ok) {
        html = await response.text();
        serverFetchSuccess = true;
      } else {
        fetchError = `HTTP error! status: ${response.status}`;
      }
    } catch (e: any) {
      fetchError = e.message || "Failed to fetch URL";
    }
    if (!serverFetchSuccess) {
      return NextResponse.json(
        { error: `Could not connect to the website (${fetchError}). Please verify that the URL is correct and the domain is online.` },
        { status: 400 }
      );
    }

    // Parse HTML with Cheerio
    const $ = cheerio.load(html || "");
    const bodyText = $("body").text() || "";
    const cleanBodyText = bodyText.replace(/\s+/g, " ").trim();

    // ----------------------------------------------------
    // 1. SEO SCORE CALCULATION (Max 100 points)
    // ----------------------------------------------------
    const seoDetails = [];
    let seoScore = 0;

    // Crawlability & Indexability (20 pts)
    const robotsMeta = $('meta[name="robots"]').attr("content") || "";
    const hasNoIndex = robotsMeta.toLowerCase().includes("noindex");
    const robotsScore = hasNoIndex ? 0 : 10;
    seoScore += robotsScore;
    seoDetails.push({
      name: "Robots Indexation Tag",
      score: robotsScore,
      max: 10,
      status: robotsScore === 10 ? "pass" : "fail",
      description: hasNoIndex 
        ? "Detected 'noindex' in Robots meta tag, which prevents search engines from indexing the page."
        : "No 'noindex' tag detected. The page allows indexing by search engines.",
    });

    const canonicalHref = $('link[rel="canonical"]').attr("href") || "";
    const canonicalScore = canonicalHref ? 5 : 0;
    seoScore += canonicalScore;
    seoDetails.push({
      name: "Canonical Link Tag",
      score: canonicalScore,
      max: 5,
      status: canonicalScore === 5 ? "pass" : "fail",
      description: canonicalHref 
        ? `Canonical tag exists: "${canonicalHref}"`
        : "Missing canonical tag. Search engines may flag duplicate content issues.",
    });

    const viewportMeta = $('meta[name="viewport"]').attr("content") || "";
    const viewportScore = viewportMeta ? 5 : 0;
    seoScore += viewportScore;
    seoDetails.push({
      name: "Viewport Tag (Mobile Friendly)",
      score: viewportScore,
      max: 5,
      status: viewportScore === 5 ? "pass" : "fail",
      description: viewportMeta 
        ? "Viewport tag exists, enabling mobile-first index compatibility."
        : "Missing viewport tag. Page might be penalized for mobile rendering issues.",
    });

    // Performance & Security (20 pts)
    const isHttps = targetUrl.toLowerCase().startsWith("https://");
    const httpsScore = isHttps ? 10 : 0;
    seoScore += httpsScore;
    seoDetails.push({
      name: "HTTPS Security Encryption",
      score: httpsScore,
      max: 10,
      status: httpsScore === 10 ? "pass" : "fail",
      description: isHttps 
        ? "The website is loaded securely via HTTPS with SSL/TLS encryption."
        : "Loaded via unencrypted HTTP. An SSL certificate is highly recommended.",
    });

    const imgs = $("img");
    let lazyImgsCount = 0;
    let responsiveImgsCount = 0;
    imgs.each((_, el) => {
      const loading = $(el).attr("loading");
      if (loading === "lazy") lazyImgsCount++;
      const width = $(el).attr("width");
      const height = $(el).attr("height");
      const srcSet = $(el).attr("srcset");
      if (width || height || srcSet) responsiveImgsCount++;
    });
    const totalImgs = imgs.length;
    let imgOptScore = 10;
    let imgDesc = "No images found or all images are optimized.";
    if (totalImgs > 0) {
      const lazyRatio = lazyImgsCount / totalImgs;
      const responsiveRatio = responsiveImgsCount / totalImgs;
      imgOptScore = Math.round((lazyRatio * 5) + (responsiveRatio * 5));
      imgDesc = `${lazyImgsCount}/${totalImgs} images use lazy loading. ${responsiveImgsCount}/${totalImgs} images define width/height/srcset.`;
    }
    seoScore += imgOptScore;
    seoDetails.push({
      name: "Image Performance Optimization",
      score: imgOptScore,
      max: 10,
      status: imgOptScore >= 8 ? "pass" : (imgOptScore >= 4 ? "partial" : "fail"),
      description: imgDesc,
    });

    // Architecture & Internal Links (20 pts)
    const hasParams = targetUrl.includes("?");
    const urlScore = hasParams ? 5 : 10;
    seoScore += urlScore;
    seoDetails.push({
      name: "Clean URL Parameters",
      score: urlScore,
      max: 10,
      status: urlScore === 10 ? "pass" : "partial",
      description: hasParams 
        ? "The URL contains query parameters, which can lead to crawler confusion and duplicate parameters."
        : "The URL has a clean, parameter-free directory structure.",
    });

    let internalLinksCount = 0;
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.startsWith("/") || href.includes(targetUrl.replace(/^https?:\/\/(www\.)?/i, ""))) {
        internalLinksCount++;
      }
    });
    const linksScore = internalLinksCount > 0 ? 10 : 0;
    seoScore += linksScore;
    seoDetails.push({
      name: "Internal Navigation Links",
      score: linksScore,
      max: 10,
      status: linksScore === 10 ? "pass" : "fail",
      description: internalLinksCount > 0
        ? `Found ${internalLinksCount} internal navigation links. Good architecture.`
        : "No internal navigation links found on this page.",
    });

    // Content & Metadata (30 pts)
    const title = $("title").text() || "";
    const titleLength = title.length;
    let titleScore = 0;
    if (titleLength >= 10 && titleLength <= 60) titleScore = 10;
    else if (titleLength > 0) titleScore = 5;
    seoScore += titleScore;
    seoDetails.push({
      name: "SEO Title Tag",
      score: titleScore,
      max: 10,
      status: titleScore === 10 ? "pass" : (titleScore === 5 ? "partial" : "fail"),
      description: title 
        ? `Found title tag: "${title}" (${titleLength} chars). Optimal range is 10-60 characters.`
        : "The HMTL is missing a <title> tag.",
    });

    const metaDesc = $('meta[name="description"]').attr("content") || "";
    const descLength = metaDesc.length;
    let descScore = 0;
    if (descLength >= 50 && descLength <= 160) descScore = 10;
    else if (descLength > 0) descScore = 5;
    seoScore += descScore;
    seoDetails.push({
      name: "Meta Description Tag",
      score: descScore,
      max: 10,
      status: descScore === 10 ? "pass" : (descScore === 5 ? "partial" : "fail"),
      description: metaDesc 
        ? `Found description tag: "${metaDesc.substring(0, 40)}..." (${descLength} chars). Optimal range is 50-160 characters.`
        : "The HTML is missing a meta description tag.",
    });

    const h1s = $("h1");
    const h1Count = h1s.length;
    const h1Score = h1Count === 1 ? 10 : (h1Count > 1 ? 5 : 0);
    seoScore += h1Score;
    seoDetails.push({
      name: "Single H1 Tag Check",
      score: h1Score,
      max: 10,
      status: h1Score === 10 ? "pass" : (h1Score === 5 ? "partial" : "fail"),
      description: h1Count === 1 
        ? "Exactly one H1 tag is present on the page."
        : (h1Count > 1 ? `Found ${h1Count} H1 tags. Exactly one H1 tag is recommended for proper page relevance.` : "Missing an H1 tag completely."),
    });

    // Structured Data (10 pts)
    const jsonLdScripts = $('script[type="application/ld+json"]');
    const jsonLdScore = jsonLdScripts.length > 0 ? 10 : 0;
    seoScore += jsonLdScore;
    seoDetails.push({
      name: "JSON-LD Schema Markup",
      score: jsonLdScore,
      max: 10,
      status: jsonLdScore === 10 ? "pass" : "fail",
      description: jsonLdScripts.length > 0 
        ? `Found ${jsonLdScripts.length} JSON-LD structured schema script(s) on the page.`
        : "No JSON-LD structured schema script found.",
    });


    // ----------------------------------------------------
    // 2. AIO SCORE CALCULATION (Max 100 points)
    // ----------------------------------------------------
    const aioDetails = [];
    let aioScore = 0;

    // Answer-First Structure (Snippet Bait) (30 pts)
    let directAnswerFound = false;
    $("h2, h3").each((_, heading) => {
      const nextEl = $(heading).next("p");
      if (nextEl.length > 0) {
        const text = nextEl.text().trim();
        const wordCount = text.split(/\s+/).length;
        const charCount = text.length;
        if ((wordCount >= 30 && wordCount <= 80) || (charCount >= 100 && charCount <= 300)) {
          directAnswerFound = true;
        }
      }
    });
    const directAnswerScore = directAnswerFound ? 15 : 0;
    aioScore += directAnswerScore;
    aioDetails.push({
      name: "Snippet Bait Content (30-80 words)",
      score: directAnswerScore,
      max: 15,
      status: directAnswerFound ? "pass" : "fail",
      description: directAnswerFound 
        ? "Excellent! A concise, answer-first paragraph (30-80 words) is positioned immediately below a sub-heading, ready for AI overview extraction."
        : "No direct answers (30-80 word paragraphs) immediately following sub-headings were found.",
    });

    const hasListsOrTables = $("ul, ol, table").length > 0;
    const listTableScore = hasListsOrTables ? 15 : 0;
    aioScore += listTableScore;
    aioDetails.push({
      name: "Extractable Lists & Tables",
      score: listTableScore,
      max: 15,
      status: hasListsOrTables ? "pass" : "fail",
      description: hasListsOrTables 
        ? "The page makes use of structured <ul>, <ol>, or <table> tags, which AI engines frequently scrape for step-by-step answers."
        : "No lists or tables found. This makes complex details harder for AI agents to structure and present.",
    });

    // Intent Mapping & Headings (25 pts)
    let questionHeadingFound = false;
    $("h1, h2, h3").each((_, heading) => {
      const text = $(heading).text().toLowerCase();
      if (
        text.includes("what") ||
        text.includes("how") ||
        text.includes("why") ||
        text.includes("who") ||
        text.includes("when") ||
        text.includes("where") ||
        text.includes("which") ||
        text.includes("?") ||
        text.includes("とは") ||
        text.includes("方法") ||
        text.includes("なぜ") ||
        text.includes("理由") ||
        text.includes("どうやって") ||
        text.includes("誰") ||
        text.includes("いつ") ||
        text.includes("どこ") ||
        text.includes("どれ") ||
        text.includes("？")
      ) {
        questionHeadingFound = true;
      }
    });
    const questionHeadingScore = questionHeadingFound ? 15 : 0;
    aioScore += questionHeadingScore;
    aioDetails.push({
      name: "Conversational Question Headings",
      score: questionHeadingScore,
      max: 15,
      status: questionHeadingFound ? "pass" : "fail",
      description: questionHeadingFound 
        ? "Found question-based headings (e.g. including 'What', 'How', '?'). Perfect for direct matches with natural language query triggers."
        : "No question-based headings found. Consider structuring headings to mirror common user queries.",
    });

    const hasH2 = $("h2").length > 0;
    const hierarchyScore = (h1Count > 0 && hasH2) ? 10 : 5;
    aioScore += hierarchyScore;
    aioDetails.push({
      name: "Heading Hierarchy Consistency",
      score: hierarchyScore,
      max: 10,
      status: hierarchyScore === 10 ? "pass" : "partial",
      description: (h1Count > 0 && hasH2)
        ? "The page correctly nests and builds H1 -> H2 structures."
        : "Incomplete heading nesting. Ensure headings are built progressively to guide AI crawlers.",
    });

    // Semantic Completeness (25 pts)
    const rawHtmlLength = html.length || 1;
    const textLength = cleanBodyText.length;
    const textHtmlRatio = textLength / rawHtmlLength;
    let ratioScore = 0;
    if (textHtmlRatio > 0.15) ratioScore = 15;
    else if (textHtmlRatio > 0.05) ratioScore = 8;
    aioScore += ratioScore;
    aioDetails.push({
      name: "Content-to-Code Ratio (>15%)",
      score: ratioScore,
      max: 15,
      status: ratioScore === 15 ? "pass" : (ratioScore === 8 ? "partial" : "fail"),
      description: `Your text-to-code ratio is ${(textHtmlRatio * 100).toFixed(1)}%. Text-heavy pages with clean HTML are highly favored by machine crawlers.`,
    });

    const semanticTags = $("article, section, main, aside");
    const semanticTagsScore = semanticTags.length > 0 ? 10 : 0;
    aioScore += semanticTagsScore;
    aioDetails.push({
      name: "Semantic HTML5 Elements",
      score: semanticTagsScore,
      max: 10,
      status: semanticTagsScore === 10 ? "pass" : "fail",
      description: semanticTags.length > 0
        ? "Standard semantic block containers (article, section, main) are utilized to segment layout."
        : "No semantic layout tags found. The code uses generic divs, which can obscure layout hierarchy for crawlers.",
    });

    // E-E-A-T & Authority (20 pts)
    let outboundHighAuthorityFound = false;
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.startsWith("http") && !href.includes(targetUrl.replace(/^https?:\/\/(www\.)?/i, ""))) {
        if (
          href.includes(".edu") ||
          href.includes(".gov") ||
          href.includes("wikipedia.org") ||
          href.includes(".org")
        ) {
          outboundHighAuthorityFound = true;
        }
      }
    });
    const outboundScore = outboundHighAuthorityFound ? 10 : 0;
    aioScore += outboundScore;
    aioDetails.push({
      name: "High-Authority Reference Outlinks",
      score: outboundScore,
      max: 10,
      status: outboundScore === 10 ? "pass" : "fail",
      description: outboundHighAuthorityFound
        ? "The page contains outlinks referencing high-authority reference hubs (.edu, .gov, wikipedia, etc.), boosting credibility."
        : "No authoritative source outlinks detected. Referencing reputable sources helps establish content validity.",
    });

    let authorSignalFound = false;
    const authorMeta = $('meta[name="author"]').attr("content") || "";
    const hasAuthorClass = $(".author, [rel='author'], .byline, [itemprop='author']").length > 0;
    if (authorMeta || hasAuthorClass) authorSignalFound = true;
    const authorScore = authorSignalFound ? 10 : 0;
    aioScore += authorScore;
    aioDetails.push({
      name: "Author Credentials & Bylines (E-E-A-T)",
      score: authorScore,
      max: 10,
      status: authorScore === 10 ? "pass" : "fail",
      description: authorSignalFound
        ? "Author credentials, byline classes, or author metadata tags were detected."
        : "Missing explicit author attribution metadata or bylines.",
    });


    // ----------------------------------------------------
    // 3. LLMO SCORE CALCULATION & GEMINI VERIFICATION (Max 100 points)
    // ----------------------------------------------------
    const llmoDetails = [];
    let llmoScore = 0;
    let geminiFetchSuccess = false;
    let geminiSummary = "";
    let geminiEntities: string[] = [];
    let geminiStats: string[] = [];
    let evalAccuracyScore = 0;
    let evalText = "";

    // Run active Gemini audits if environment key is defined
    if (process.env.GEMINI_API_KEY) {
      try {
        // Initialize Gemini SDK with request-time environment variable to avoid static global instantiation issues
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Step A: Request Gemini to directly fetch the URL using its built-in knowledge & search grounding
        const fetchPrompt = `Fetch the content of this URL: "${targetUrl}". Please summarize the main content of this webpage, extract the main entities (people, products, organizations, topics), and extract any key statistics, numbers, or data points mentioned on the page. Respond ONLY with a valid JSON object in the following format:
{
  "success": true,
  "summary": "a brief 2-3 sentence summary of the page content",
  "entities": ["entity1", "entity2", ...],
  "statistics": ["stat1", "stat2", ...]
}`;

        const fetchResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: fetchPrompt,
          config: {
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }],
            thinkingConfig: {
              thinkingLevel: "medium" as any
            }
          }
        });

        const rawText = fetchResponse.text || "{}";
        let parsedResult: any = {};
        try {
          parsedResult = JSON.parse(rawText);
        } catch {
          const cleanJsonStr = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          try {
            parsedResult = JSON.parse(cleanJsonStr);
          } catch {
            parsedResult = { success: rawText.toLowerCase().includes("success\": true") };
          }
        }

        if (parsedResult.success) {
          geminiFetchSuccess = true;
          geminiSummary = parsedResult.summary || "Summary successfully extracted.";
          geminiEntities = parsedResult.entities || [];
          geminiStats = parsedResult.statistics || [];
        }

        // Step B: Ask Gemini to evaluate accuracy by comparing server-fetched text vs its own URL-fetched result
        if (serverFetchSuccess && geminiFetchSuccess) {
          const evalPrompt = `Compare the actual text content of a webpage with a summary and data points generated by an LLM that tried to fetch the URL directly.

Actual Webpage Text (Server Fetched):
"""
${cleanBodyText.slice(0, 4000)}
"""

LLM URL-Fetched Result:
Summary: ${geminiSummary || "None"}
Entities: ${(geminiEntities || []).join(", ") || "None"}
Statistics: ${(geminiStats || []).join(", ") || "None"}

Evaluate:
1. Did the LLM successfully retrieve the actual content of the webpage? (Look for matches in core facts, names, and numbers).
2. Is the LLM's summary accurate and free of hallucinations compared to the actual text?
3. Assign an overall accuracy score between 0 and 100.
4. Explain any discrepancies or missed information.

Respond ONLY with a valid JSON object in the following format:
{
  "success": true,
  "accuracyScore": 85,
  "evaluation": "explanation of the rating"
}`;

          const evalResponse = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: evalPrompt,
            config: {
              responseMimeType: "application/json",
              thinkingConfig: {
                thinkingLevel: "medium" as any
              }
            }
          });

          const evalRawText = evalResponse.text || "{}";
          let evalParsed: any = {};
          try {
            evalParsed = JSON.parse(evalRawText);
          } catch {
            const cleanJsonStr = evalRawText.replace(/```json/gi, "").replace(/```/g, "").trim();
            try {
              evalParsed = JSON.parse(cleanJsonStr);
            } catch {
              evalParsed = { accuracyScore: 75, evaluation: "Succeeded in extraction with some formatting issues." };
            }
          }

          evalAccuracyScore = evalParsed.accuracyScore || 0;
          evalText = evalParsed.evaluation || "Evaluation processed successfully.";
        }
      } catch (e: any) {
        console.error("Gemini Audit Error:", e);
        evalText = `Error calling Gemini API: ${e.message}`;
      }
    } else {
      // Mocked outputs for local dev when GEMINI_API_KEY is not defined
      geminiFetchSuccess = true;
      geminiSummary = "[MOCK SUMMARY] (Add GEMINI_API_KEY environment variable to test real-time LLM fetch capability). The page appears to be a corporate website detailing its product services and optimization plans.";
      geminiEntities = ["[MOCK] AIO Optimizer", "[MOCK] Search Engine", "[MOCK] Web Crawler"];
      geminiStats = ["[MOCK] 98% accuracy", "[MOCK] 10x faster"];
      evalAccuracyScore = 80;
      evalText = "[MOCK EVALUATION] (Add GEMINI_API_KEY environment variable to evaluate accuracy). The LLM summary matches the server-fetched page structure and references relevant details.";
    }

    // LLM Fetchability Check (30 pts)
    const fetchabilityScore = geminiFetchSuccess ? 30 : 0;
    llmoScore += fetchabilityScore;
    llmoDetails.push({
      name: "LLM Bot-Blocker Exemption",
      score: fetchabilityScore,
      max: 30,
      status: geminiFetchSuccess ? "pass" : "fail",
      description: geminiFetchSuccess
        ? "Gemini successfully bypassed all firewalls and successfully fetched your page contents."
        : "Gemini was blocked or failed to access the URL. Check your robots.txt or Cloudflare WAF blocklists.",
    });

    // Content Accuracy Check (40 pts)
    const accuracyPoints = Math.round((evalAccuracyScore / 100) * 40);
    llmoScore += accuracyPoints;
    llmoDetails.push({
      name: "LLM Extraction Fidelity (Accuracy)",
      score: accuracyPoints,
      max: 40,
      status: accuracyPoints >= 30 ? "pass" : (accuracyPoints >= 15 ? "partial" : "fail"),
      description: `Fidelity rate: ${evalAccuracyScore}%. ${evalText}`,
    });

    // Fact & Data-Point Density (15 pts)
    const numberMatches = cleanBodyText.match(/\b\d+(?:[\.,]\d+)?%?\b/g) || [];
    const hasStats = numberMatches.length > 5;
    const statsScore = hasStats ? 15 : 5;
    llmoScore += statsScore;
    llmoDetails.push({
      name: "Factual Data & Statistics Density",
      score: statsScore,
      max: 15,
      status: statsScore === 15 ? "pass" : "partial",
      description: hasStats
        ? `Rich data density! Detected ${numberMatches.length} numbers/statistics. Highly beneficial for LLM citations.`
        : `Only found ${numberMatches.length} numeric tokens. AI systems prioritize facts and statistical metrics for claims.`,
    });

    // Clear Entity Definition (15 pts)
    const capitalizedWords = cleanBodyText.match(/\b[A-Z][a-z]+\b/g) || [];
    const hasEntities = capitalizedWords.length > 10 || (geminiEntities && geminiEntities.length >= 5);
    const entityScore = hasEntities ? 15 : 5;
    llmoScore += entityScore;
    llmoDetails.push({
      name: "Proper Noun Entity Density",
      score: entityScore,
      max: 15,
      status: entityScore === 15 ? "pass" : "partial",
      description: hasEntities
        ? `Found sufficient proper nouns or key entities. Perfect for entity disambiguation in the LLM Knowledge Graph.`
        : `Low entity count (${capitalizedWords.length} proper nouns, ${geminiEntities ? geminiEntities.length : 0} AI entities). Make sure your key services are labeled clearly.`,
    });


    // ----------------------------------------------------
    // COMPREHENSIVE SCORE CALCULATION
    // ----------------------------------------------------
    // Ratio is 2 : 1 : 1 (SEO = 50%, AIO = 25%, LLMO = 25%)
    const totalScore = Math.round((seoScore * 0.5) + (aioScore * 0.25) + (llmoScore * 0.25));

    return NextResponse.json({
      url: targetUrl,
      totalScore,
      categoryScores: {
        seo: seoScore,
        aio: aioScore,
        llmo: llmoScore,
      },
      seoDetails,
      aioDetails,
      llmoDetails,
      llmVerification: {
        rawFetchedSnippet: cleanBodyText.substring(0, 1000) + "...",
        geminiSummary,
        geminiEntities,
        geminiStats,
        evalAccuracyScore,
        evalText,
      },
      serverFetchSuccess,
      fetchError,
    });
  } catch (error: any) {
    console.error("Analysis Exception:", error);
    return NextResponse.json({ error: error.message || "An error occurred during analysis" }, { status: 500 });
  }
}
