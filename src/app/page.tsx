"use client";

import { useState } from "react";
import { AnalysisResults } from "./types";
import { UI_TRANSLATIONS } from "./translations";
import { Header } from "./components/Header";
import { AuditForm } from "./components/AuditForm";
import { MasterVerdictPanel } from "./components/MasterVerdictPanel";
import { BreakdownPanel } from "./components/BreakdownPanel";
import { DiagnosticTabs } from "./components/DiagnosticTabs";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Interactive mechanical language switch state
  const [lang, setLang] = useState<"en" | "ja">("en");

  // Dynamic selector puller helper
  const text = UI_TRANSLATIONS[lang];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json();
        // Dynamic localized error catch
        const errMsg = errData.error || "An error occurred during analysis";
        throw new Error(errMsg);
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      let finalErrMsg = err.message || "Failed to connect to the server.";
      // Localize common connection errors
      if (lang === "ja" && finalErrMsg.includes("Could not connect")) {
        finalErrMsg = "指定されたウェブサイトに接続できませんでした（内部エラー）。URLが正しいか、ドメインがオンラインであるかを確認してください。";
      }
      setError(finalErrMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      {/* Structural Telemetry Grid Backdrop */}
      <div className="grid-overlay" />

      <div className="app-container">
        {/* Header brand + switch */}
        <Header lang={lang} setLang={setLang} text={text} />

        {/* Audit query launcher Form */}
        <AuditForm 
          url={url} 
          setUrl={setUrl} 
          loading={loading} 
          error={error} 
          text={text} 
          onSubmit={handleAnalyze} 
        />

        {/* Diagnostic Results Presentation */}
        {results && (
          <section style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Top Grid: Master Console Readout & Dimensional Bars */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
              {/* Master score panel */}
              <MasterVerdictPanel totalScore={results.totalScore} text={text} />

              {/* Dimensional sub-indexes panel */}
              <BreakdownPanel categoryScores={results.categoryScores} text={text} />
            </div>

            {/* Bottom tab logs for SEO / AIO / LLMO / Verification console */}
            <DiagnosticTabs results={results} lang={lang} text={text} />
          </section>
        )}
      </div>
    </main>
  );
}
