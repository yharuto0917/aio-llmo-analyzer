import * as cheerio from "cheerio";

export interface FetchResult {
  targetUrl: string;
  html: string;
  serverFetchSuccess: boolean;
  fetchError: string;
  $: cheerio.CheerioAPI;
  cleanBodyText: string;
}

export async function fetchAndParseUrl(url: string): Promise<FetchResult> {
  // Ensure URL has protocol
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  let html = "";
  let serverFetchSuccess = false;
  let fetchError = "";

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 LLMO-Optimizer/1.0",
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

  // Parse HTML with Cheerio
  const $ = cheerio.load(html || "");

  // Remove unnecessary tags (JS, CSS, SVG, etc.) to eliminate noise from text extraction
  $("script, style, noscript, svg, iframe").remove();

  // Append a space to block-level elements to prevent words from sticking together
  $("br, p, div, section, article, h1, h2, h3, h4, h5, h6, li").append(" ");

  const bodyText = $("body").text() || "";
  const cleanBodyText = bodyText.replace(/\s+/g, " ").trim();

  return {
    targetUrl,
    html,
    serverFetchSuccess,
    fetchError,
    $,
    cleanBodyText,
  };
}
