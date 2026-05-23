import * as cheerio from "cheerio";
import { DetailItem } from "../../app/types";

export interface SeoResult {
  score: number;
  details: DetailItem[];
}

export function analyzeSeo(targetUrl: string, $: cheerio.CheerioAPI): SeoResult {
  const seoDetails: DetailItem[] = [];
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

  return {
    score: seoScore,
    details: seoDetails,
  };
}
