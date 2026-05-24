import * as cheerio from "cheerio";

export interface FetchResult {
  targetUrl: string;
  html: string;
  serverFetchSuccess: boolean;
  fetchError: string;
  $: cheerio.CheerioAPI;
  cleanBodyText: string;
}

function isPrivateIp(ip: string): boolean {
  // IPv4 checks
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Regex);
  if (match) {
    const [, o1, o2] = match.map(Number);
    if (o1 === 127) return true; // loopback
    if (o1 === 10) return true; // private
    if (o1 === 172 && (o2 >= 16 && o2 <= 31)) return true; // private
    if (o1 === 192 && o2 === 168) return true; // private
    if (o1 === 169 && o2 === 254) return true; // link-local
    if (o1 === 0) return true; // current network
    if (o1 === 100 && (o2 >= 64 && o2 <= 127)) return true; // shared
    if (o1 === 198 && (o2 === 18 || o2 === 19)) return true; // benchmark
    if (o1 >= 224) return true; // multicast / reserved
  }

  // IPv6 checks
  if (ip.startsWith("[") && ip.endsWith("]")) {
    const ipv6 = ip.slice(1, -1).toLowerCase();
    if (ipv6 === "::1" || ipv6 === "0:0:0:0:0:0:0:1") return true;
    if (ipv6.startsWith("fe80:")) return true; // link-local
    if (ipv6.startsWith("fc00:") || ipv6.startsWith("fd00:")) return true; // unique local
    if (ipv6.startsWith("ff00:")) return true; // multicast
  }
  
  return false;
}

function isValidPublicUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();

  // Block local domains
  if (
    hostname === "localhost" ||
    hostname === "metadata.google.internal" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return false;
  }

  // Block private/reserved IPs
  if (isPrivateIp(hostname)) {
    return false;
  }

  return true;
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
    const parsedUrl = new URL(targetUrl);
    if (!isValidPublicUrl(parsedUrl)) {
      throw new Error("Access to private/local network addresses is prohibited.");
    }

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
  } catch (e: unknown) {
    const err = e as Error;
    fetchError = err.message || "Failed to fetch URL";
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
