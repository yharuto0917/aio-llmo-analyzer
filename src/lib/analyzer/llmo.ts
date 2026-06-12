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
    comprehensionScore,
    contentRichness,
    keyClaimsOrFacts,
    coreTopics,
  } = geminiAnalysis;

  // LLM Parseability Check (40 pts)
  // Parse success remains the dominant signal (30 pts), with a continuous 0-10 gradient
  // tied to the comprehension score so this no longer swings as a hard 40/0 cliff.
  const fetchabilityScore = geminiFetchSuccess
    ? 30 + Math.round((comprehensionScore / 100) * 10)
    : 0;
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
  // Continuous, driven by the 0-100 comprehension score (no more HIGH/MEDIUM/LOW buckets).
  const accuracyPoints = Math.round((comprehensionScore / 100) * 20);
  llmoScore += accuracyPoints;
  llmoDetails.push({
    name: "LLM Content Richness Score",
    score: accuracyPoints,
    max: 20,
    status: accuracyPoints >= 15 ? "pass" : (accuracyPoints >= 8 ? "partial" : "fail"),
    description: `Evaluated Content Richness: ${contentRichness}. ${contentRichness === "HIGH" ? "Provides sufficient details to answer user intents." : "Lacking depth or detail."}`,
  });

  // Fact & Data-Point Density (20 pts)
  // Graduated: ~7 pts per extracted claim up to the 20-pt cap (2 claims now scores, not zero).
  const statsScore = Math.min(20, keyClaimsOrFacts.length * 7);
  llmoScore += statsScore;
  llmoDetails.push({
    name: "Factual Claims & Data Density",
    score: statsScore,
    max: 20,
    status: statsScore >= 20 ? "pass" : (statsScore > 0 ? "partial" : "fail"),
    description: keyClaimsOrFacts.length >= 3
      ? `Rich data density! Detected ${keyClaimsOrFacts.length} specific factual claims. Highly beneficial for LLM citations.`
      : `Only found ${keyClaimsOrFacts.length} factual claims. AI systems prioritize clear facts and statistical metrics for claims.`,
  });

  // Core Topic Definition (20 pts)
  // Graduated: 5 pts per extracted topic up to the 20-pt cap.
  const entityScore = Math.min(20, coreTopics.length * 5);
  llmoScore += entityScore;
  llmoDetails.push({
    name: "Core Topic Density",
    score: entityScore,
    max: 20,
    status: entityScore >= 20 ? "pass" : (entityScore > 0 ? "partial" : "fail"),
    description: coreTopics.length >= 4
      ? `Found sufficient core topics. Perfect for entity disambiguation in the LLM Knowledge Graph.`
      : `Low topic count (${coreTopics.length} topics). Make sure your key services and topics are clear.`,
  });

  return {
    score: llmoScore,
    details: llmoDetails,
  };
}
