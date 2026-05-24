import { NextRequest, NextResponse } from "next/server";
import { fetchAndParseUrl } from "../../../lib/analyzer/fetcher";
import { analyzeSeo } from "../../../lib/analyzer/seo";
import { analyzeAio } from "../../../lib/analyzer/aio";
import { analyzeWithGemini } from "../../../lib/analyzer/gemini";
import { analyzeLlmo } from "../../../lib/analyzer/llmo";

// SDK is dynamic and modularized to support request-time configuration and avoid redundancy
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Fetch & parse HTML using modular Fetcher
    const fetchResult = await fetchAndParseUrl(url);

    if (!fetchResult.serverFetchSuccess) {
      return NextResponse.json(
        { error: `Could not connect to the website (${fetchResult.fetchError}). Please verify that the URL is correct and the domain is online.` },
        { status: 400 }
      );
    }

    const { targetUrl, html, $, cleanBodyText, serverFetchSuccess, fetchError } = fetchResult;

    // 2. Run modularized SEO analysis
    const seoResult = analyzeSeo(targetUrl, $);

    // 3. Run modularized AIO analysis
    const aioResult = analyzeAio(targetUrl, $, cleanBodyText, html);

    // 4. Run modularized Gemini content audit
    const geminiAnalysis = await analyzeWithGemini(
      targetUrl,
      cleanBodyText,
      serverFetchSuccess,
      process.env.GEMINI_API_KEY
    );

    // 5. Run modularized LLMO scoring based on audit results
    const llmoResult = analyzeLlmo(geminiAnalysis);

    // Calculate comprehensive score (Ratio is 2 : 1 : 1 -> SEO = 50%, AIO = 25%, LLMO = 25%)
    const totalScore = Math.round(
      (seoResult.score * 0.5) + (aioResult.score * 0.25) + (llmoResult.score * 0.25)
    );

    // Build compatibility metrics
    let richnessScore = 0;
    if (geminiAnalysis.contentRichness === "HIGH") richnessScore = 100;
    else if (geminiAnalysis.contentRichness === "MEDIUM") richnessScore = 50;

    return NextResponse.json({
      url: targetUrl,
      totalScore,
      categoryScores: {
        seo: seoResult.score,
        aio: aioResult.score,
        llmo: llmoResult.score,
      },
      seoDetails: seoResult.details,
      aioDetails: aioResult.details,
      llmoDetails: llmoResult.details,
      llmVerification: {
        rawFetchedSnippet: cleanBodyText.substring(0, 1000) + "...",
        pageSummary: geminiAnalysis.pageSummary,
        coreTopics: geminiAnalysis.coreTopics,
        keyClaimsOrFacts: geminiAnalysis.keyClaimsOrFacts,
        richnessScore,
        contentRichness: geminiAnalysis.contentRichness,
        mockFallbackUsed: geminiAnalysis.mockFallbackUsed,
      },
      serverFetchSuccess,
      fetchError,
    });
  } catch (error: unknown) {
    console.error("Analysis Exception:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "An error occurred during analysis" }, { status: 500 });
  }
}
