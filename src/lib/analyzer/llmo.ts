import { DetailItem } from "../../app/types";
import { GeminiAnalysisResult } from "./gemini";

export interface LlmoResult {
  score: number;
  details: DetailItem[];
}

export function analyzeLlmo(geminiAnalysis: GeminiAnalysisResult): LlmoResult {
  const llmoDetails: DetailItem[] = [];
  let llmoScore = 0;

  const {
    geminiFetchSuccess,
    contentRichness,
    keyClaimsOrFacts,
    coreTopics,
  } = geminiAnalysis;

  let richnessScore = 0;
  if (contentRichness === "HIGH") richnessScore = 100;
  else if (contentRichness === "MEDIUM") richnessScore = 50;
  else richnessScore = 0;

  // LLM Parseability Check (40 pts)
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
    description: `Evaluated Content Richness: ${contentRichness}. ${contentRichness === "HIGH" ? "Provides sufficient details to answer user intents." : "Lacking depth or detail."}`,
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
      ? `Rich data density! Detected ${keyClaimsOrFacts.length} specific factual claims. Highly beneficial for LLM citations.`
      : `Only found ${keyClaimsOrFacts.length} factual claims. AI systems prioritize clear facts and statistical metrics for claims.`,
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
      ? `Found sufficient core topics. Perfect for entity disambiguation in the LLM Knowledge Graph.`
      : `Low topic count (${coreTopics.length} topics). Make sure your key services and topics are clear.`,
  });

  return {
    score: llmoScore,
    details: llmoDetails,
  };
}
