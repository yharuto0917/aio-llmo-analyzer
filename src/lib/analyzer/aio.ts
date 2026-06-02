import * as cheerio from "cheerio";
import { DetailItem } from "../../app/types";

export interface AioResult {
  score: number;
  details: DetailItem[];
}

export function analyzeAio(
  targetUrl: string,
  $: cheerio.CheerioAPI,
  cleanBodyText: string,
  html: string
): AioResult {
  const aioDetails: DetailItem[] = [];
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

  const h1Count = $("h1").length;
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
  let targetHost = "";
  try {
    targetHost = new URL(targetUrl).hostname.replace(/^www\./i, "");
  } catch {}

  $("a").each((_, el) => {
    const href = ($(el).attr("href") || "").trim();
    if (!href.startsWith("http://") && !href.startsWith("https://")) {
      return;
    }
    try {
      const linkUrl = new URL(href);
      const linkHost = linkUrl.hostname.replace(/^www\./i, "");
      if (linkHost !== targetHost) {
        if (
          linkHost.endsWith(".edu") ||
          linkHost.endsWith(".gov") ||
          linkHost.includes("wikipedia.org") ||
          linkHost.endsWith(".org")
        ) {
          outboundHighAuthorityFound = true;
        }
      }
    } catch {}
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

  return {
    score: aioScore,
    details: aioDetails,
  };
}
