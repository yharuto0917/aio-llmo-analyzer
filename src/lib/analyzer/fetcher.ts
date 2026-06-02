import * as cheerio from "cheerio";

export interface FetchResult {
  targetUrl: string;
  html: string;
  serverFetchSuccess: boolean;
  fetchError: string;
  $: cheerio.CheerioAPI;
  cleanBodyText: string;
}

function parseIpv4ToNumber(hostname: string): number | null {
  // Validate if hostname only consists of characters potentially representing an IP
  if (!/^[0-9a-fx\.\:]+$/i.test(hostname)) {
    return null;
  }

  // Exclude IPv6
  if (hostname.includes(":")) {
    return null;
  }

  const parts = hostname.split(".");
  if (parts.length > 4) return null;

  try {
    const numbers: number[] = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let num: number;
      if (part.startsWith("0x") || part.startsWith("0X")) {
        num = parseInt(part, 16);
      } else if (part.startsWith("0") && part.length > 1) {
        // Octal support
        num = parseInt(part, 8);
      } else {
        num = parseInt(part, 10);
      }
      if (isNaN(num) || num < 0 || num > 0xffffffff) {
        return null;
      }
      numbers.push(num);
    }

    if (numbers.length === 0) return null;

    let ipVal = 0;
    if (numbers.length === 1) {
      ipVal = numbers[0];
    } else if (numbers.length === 2) {
      if (numbers[0] > 0xff || numbers[1] > 0xffffff) return null;
      ipVal = (numbers[0] << 24) + numbers[1];
    } else if (numbers.length === 3) {
      if (numbers[0] > 0xff || numbers[1] > 0xff || numbers[2] > 0xffff) return null;
      ipVal = (numbers[0] << 24) + (numbers[1] << 16) + numbers[2];
    } else if (numbers.length === 4) {
      if (numbers[0] > 0xff || numbers[1] > 0xff || numbers[2] > 0xff || numbers[3] > 0xff) return null;
      ipVal = (numbers[0] << 24) + (numbers[1] << 16) + (numbers[2] << 8) + numbers[3];
    }

    return ipVal >>> 0; // ensure unsigned 32-bit integer
  } catch {
    return null;
  }
}

function isPrivateIp(ip: string): boolean {
  // Try IPv4 parsing and check range using 32-bit unsigned integers
  const ipNum = parseIpv4ToNumber(ip);
  if (ipNum !== null) {
    // 0.0.0.0/8 (0 to 16777215)
    if (ipNum <= 16777215) return true;
    // 10.0.0.0/8 (167772160 to 184549375)
    if (ipNum >= 167772160 && ipNum <= 184549375) return true;
    // 100.64.0.0/10 (1681915904 to 1686110207)
    if (ipNum >= 1681915904 && ipNum <= 1686110207) return true;
    // 127.0.0.0/8 (2130706432 to 2147483647)
    if (ipNum >= 2130706432 && ipNum <= 2147483647) return true;
    // 169.254.0.0/16 (2851995648 to 2852061183)
    if (ipNum >= 2851995648 && ipNum <= 2852061183) return true;
    // 172.16.0.0/12 (2886729728 to 2887778303)
    if (ipNum >= 2886729728 && ipNum <= 2887778303) return true;
    // 192.168.0.0/16 (3232235520 to 3232301055)
    if (ipNum >= 3232235520 && ipNum <= 3232301055) return true;
    // 198.18.0.0/15 (3323068416 to 3323199487)
    if (ipNum >= 3323068416 && ipNum <= 3323199487) return true;
    // 224.0.0.0/4 and above (3758096384 to 4294967295 - Multicast, Reserved, Broadcast)
    if (ipNum >= 3758096384) return true;
  }

  // IPv6 checks (support brackets format and raw form)
  let ipv6 = ip.toLowerCase();
  if (ipv6.startsWith("[") && ipv6.endsWith("]")) {
    ipv6 = ipv6.slice(1, -1);
  }
  
  if (ipv6.includes(":")) {
    // Normalizing IPv6 loopback
    if (ipv6 === "::1" || ipv6 === "0:0:0:0:0:0:0:1") return true;
    
    // Check local prefixes
    // fe80::/10 (link-local)
    if (ipv6.startsWith("fe80:") || ipv6.startsWith("fe90:") || ipv6.startsWith("fea0:") || ipv6.startsWith("feb0:")) return true;
    // fc00::/7 (unique local addresses - fc00:: to fdff::)
    if (ipv6.startsWith("fc00:") || ipv6.startsWith("fd00:")) return true;
    // ff00::/8 (multicast)
    if (ipv6.startsWith("ff")) return true;
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
