export interface DetailItem {
  name: string;
  score: number;
  max: number;
  status: "pass" | "partial" | "fail";
  description: string;
}

export interface AnalysisResults {
  url: string;
  totalScore: number;
  categoryScores: {
    seo: number;
    aio: number;
    llmo: number;
  };
  seoDetails: DetailItem[];
  aioDetails: DetailItem[];
  llmoDetails: DetailItem[];
  llmVerification: {
    rawFetchedSnippet: string;
    geminiSummary: string;
    geminiEntities: string[];
    geminiStats: string[];
    evalAccuracyScore: number;
    evalText: string;
  };
  serverFetchSuccess: boolean;
  fetchError: string;
}
