import React, { useState } from "react";
import { 
  Globe, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Info 
} from "lucide-react";
import { AnalysisResults } from "../types";
import { getLocalizedItem } from "../translations";
import { getStatusColorClass, SegmentedMeter } from "./Meter";

interface DiagnosticTabsProps {
  results: AnalysisResults;
  lang: "en" | "ja";
  text: any;
}

export const DiagnosticTabs: React.FC<DiagnosticTabsProps> = ({ results, lang, text }) => {
  const [activeTab, setActiveTab] = useState<"seo" | "aio" | "llmo" | "verify">("seo");

  return (
    <div className="tech-panel">
      {/* Tab Header Terminal Panels */}
      <div className="console-tabs">
        <button 
          className={`console-tab ${activeTab === "seo" ? "active" : ""}`}
          onClick={() => setActiveTab("seo")}
        >
          <Globe size={13} />
          <span>{text.tab_seo}</span>
        </button>
        <button 
          className={`console-tab ${activeTab === "aio" ? "active" : ""}`}
          onClick={() => setActiveTab("aio")}
        >
          <Sparkles size={13} />
          <span>{text.tab_aio}</span>
        </button>
        <button 
          className={`console-tab ${activeTab === "llmo" ? "active" : ""}`}
          onClick={() => setActiveTab("llmo")}
        >
          <Cpu size={13} />
          <span>{text.tab_llmo}</span>
        </button>
        <button 
          className={`console-tab ${activeTab === "verify" ? "active" : ""}`}
          onClick={() => setActiveTab("verify")}
        >
          <ShieldCheck size={13} />
          <span>{text.tab_verify}</span>
        </button>
      </div>

      <div className="tech-panel-content">
        
        {/* SEO Metrics Tab */}
        {activeTab === "seo" && (
          <div>
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
              <h4 className="display-title" style={{ fontSize: "1rem", textTransform: "uppercase" }}>{text.seo_tab_title}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{text.seo_tab_sub}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.seoDetails.map((item, idx) => {
                const localItem = getLocalizedItem(item, lang);
                return (
                  <div key={idx} className="analog-log-row">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1 }}>
                      <div style={{ marginTop: "0.1rem" }}>
                        {localItem.status === "pass" && <CheckCircle2 size={14} className="display-success" />}
                        {localItem.status === "partial" && <AlertTriangle size={14} className="display-warning" />}
                        {localItem.status === "fail" && <XCircle size={14} className="display-danger" />}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                          <span style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.85rem" }}>{localItem.name}</span>
                          <span className={`bracket-badge ${getStatusColorClass(localItem.score)}`} style={{ fontSize: "0.7rem" }}>
                            [{localItem.score} / {localItem.max}]
                          </span>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", lineHeight: "1.4" }}>{localItem.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AIO Metrics Tab */}
        {activeTab === "aio" && (
          <div>
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
              <h4 className="display-title" style={{ fontSize: "1rem", textTransform: "uppercase" }}>{text.aio_tab_title}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{text.aio_tab_sub}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.aioDetails.map((item, idx) => {
                const localItem = getLocalizedItem(item, lang);
                return (
                  <div key={idx} className="analog-log-row">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1 }}>
                      <div style={{ marginTop: "0.1rem" }}>
                        {localItem.status === "pass" && <CheckCircle2 size={14} className="display-success" />}
                        {localItem.status === "partial" && <AlertTriangle size={14} className="display-warning" />}
                        {localItem.status === "fail" && <XCircle size={14} className="display-danger" />}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                          <span style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.85rem" }}>{localItem.name}</span>
                          <span className={`bracket-badge ${getStatusColorClass(localItem.score)}`} style={{ fontSize: "0.7rem" }}>
                            [{localItem.score} / {localItem.max}]
                          </span>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", lineHeight: "1.4" }}>{localItem.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LLMO Metrics Tab */}
        {activeTab === "llmo" && (
          <div>
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
              <h4 className="display-title" style={{ fontSize: "1rem", textTransform: "uppercase" }}>{text.llmo_tab_title}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{text.llmo_tab_sub}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {results.llmoDetails.map((item, idx) => {
                const localItem = getLocalizedItem(item, lang);
                return (
                  <div key={idx} className="analog-log-row">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: 1 }}>
                      <div style={{ marginTop: "0.1rem" }}>
                        {localItem.status === "pass" && <CheckCircle2 size={14} className="display-success" />}
                        {localItem.status === "partial" && <AlertTriangle size={14} className="display-warning" />}
                        {localItem.status === "fail" && <XCircle size={14} className="display-danger" />}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                          <span style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.85rem" }}>{localItem.name}</span>
                          <span className={`bracket-badge ${getStatusColorClass(localItem.score)}`} style={{ fontSize: "0.7rem" }}>
                            [{localItem.score} / {localItem.max}]
                          </span>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", lineHeight: "1.4" }}>{localItem.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LLM Fetch Verification (Side-by-Side Dual Hex Console) */}
        {activeTab === "verify" && (
          <div>
            <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
              <h4 className="display-title" style={{ fontSize: "1rem", textTransform: "uppercase" }}>{text.verify_tab_title}</h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{text.verify_tab_sub}</p>
            </div>

            {results.llmVerification.mockFallbackUsed && (
              <div style={{
                background: "var(--color-warning-glow)",
                border: "1px dashed var(--color-warning)",
                padding: "1rem",
                marginBottom: "1.5rem",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start"
              }}>
                <AlertTriangle size={18} className="display-warning" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                <div>
                  <h5 style={{ color: "#ffffff", fontWeight: "600", fontSize: "0.85rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-display)" }}>
                    {text.mock_warning_title}
                  </h5>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", lineHeight: "1.5", margin: "0.25rem 0 0 0" }}>
                    {text.mock_warning_text}
                  </p>
                </div>
              </div>
            )}

            {/* Comprehension Rating Strip */}
            <div style={{ 
              background: "rgba(0, 229, 255, 0.01)", 
              border: "1px solid var(--border-color)", 
              padding: "1.25rem", 
              marginBottom: "2rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-heading)", fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
                  <Zap size={14} className="display-cyan" /> {text.verify_coeff}
                </span>
                <span className={`display-title ${getStatusColorClass(results.llmVerification.richnessScore)}`} style={{ fontSize: "1.75rem" }}>
                  {results.llmVerification.richnessScore}%
                </span>
              </div>
              <SegmentedMeter score={results.llmVerification.richnessScore} />
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                <Info size={14} className="display-cyan" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                <p style={{ fontSize: "0.75rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                  <strong className="display-cyan" style={{ fontFamily: "var(--font-display)" }}>{text.verify_assessment} </strong>
                  {`${text.content_richness}: ${results.llmVerification.contentRichness} (${text.verify_assessment_text})`}
                </p>
              </div>
            </div>

            {/* Dual Hex Scientific Panels */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
              
              {/* Left: Raw HTML Snippet Console */}
              <div className="tech-panel">
                <div className="tech-panel-header" style={{ background: "#060608" }}>
                  <span>{text.buffer_raw}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{text.buffer_raw_sub}</span>
                </div>
                <div className="tech-panel-content" style={{ padding: "0" }}>
                  <pre style={{
                    margin: 0,
                    padding: "1.25rem",
                    background: "#020203",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    lineHeight: "1.5",
                    height: "360px",
                    overflowY: "auto",
                    color: "var(--color-success)",
                    border: "none"
                  }}>
                    {results.llmVerification.rawFetchedSnippet}
                  </pre>
                </div>
              </div>

              {/* Right: Gemini Synthesized JSON Console */}
              <div className="tech-panel">
                <div className="tech-panel-header" style={{ background: "#060608" }}>
                  <span>{text.buffer_extract}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{text.buffer_extract_sub}</span>
                </div>
                <div className="tech-panel-content" style={{ 
                  padding: "1.25rem", 
                  background: "#020203",
                  height: "360px", 
                  overflowY: "auto",
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "1.5rem"
                }}>
                  {/* Summary */}
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-cyan)", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>{text.summary_label}</span>
                    <p style={{ fontSize: "0.75rem", marginTop: "0.45rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {results.llmVerification.pageSummary}
                    </p>
                  </div>

                  {/* Entities */}
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-cyan)", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>{text.entities_label}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.5rem" }}>
                      {results.llmVerification.coreTopics.map((ent, idx) => (
                        <span key={idx} style={{ 
                          background: "rgba(0, 229, 255, 0.04)", 
                          border: "1px solid rgba(0, 229, 255, 0.15)", 
                          padding: "0.25rem 0.5rem", 
                          fontSize: "0.7rem", 
                          color: "var(--color-cyan)"
                        }}>
                          {ent}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Claims */}
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-cyan)", textTransform: "uppercase", fontFamily: "var(--font-display)" }}>{text.claims_label}</span>
                    <ul style={{ fontSize: "0.75rem", listStyleType: "none", marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      {results.llmVerification.keyClaimsOrFacts.map((stat, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", lineHeight: "1.4" }}>
                          <span className="display-cyan" style={{ flexShrink: 0 }}>&gt;&gt;</span>
                          <span style={{ color: "var(--text-main)" }}>{stat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
