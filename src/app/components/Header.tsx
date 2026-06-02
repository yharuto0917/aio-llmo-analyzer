import React from "react";
import { Terminal } from "lucide-react";

interface HeaderProps {
  lang: "en" | "ja";
  setLang: (lang: "en" | "ja") => void;
  text: any;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, text }) => {
  return (
    <>
      {/* Dynamic Telemetry Header Bar */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        borderBottom: "1px solid var(--border-color)", 
        paddingBottom: "0.75rem", 
        marginBottom: "3rem",
        fontSize: "0.75rem",
        color: "var(--text-muted)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="blinking-dot" />
          <span className="display-cyan" style={{ letterSpacing: "0.1em" }}>{text.module}</span>
        </div>
        
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          {/* Interactive Brutalist Hardware Switch Toggle */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.25rem", 
            background: "#020203", 
            border: "1px solid var(--border-color)", 
            padding: "0.2rem" 
          }}>
            <button 
              type="button"
              onClick={() => setLang("en")}
              style={{
                background: lang === "en" ? "var(--color-cyan)" : "transparent",
                color: lang === "en" ? "#000000" : "var(--text-muted)",
                border: "none",
                fontSize: "0.7rem",
                fontFamily: "var(--font-display)",
                padding: "0.1rem 0.4rem",
                cursor: "pointer"
              }}
            >
              EN
            </button>
            <span style={{ fontSize: "0.65rem", color: "var(--border-color)" }}>/</span>
            <button 
              type="button"
              onClick={() => setLang("ja")}
              style={{
                background: lang === "ja" ? "var(--color-cyan)" : "transparent",
                color: lang === "ja" ? "#000000" : "var(--text-muted)",
                border: "none",
                fontSize: "0.7rem",
                fontFamily: "var(--font-display)",
                padding: "0.1rem 0.4rem",
                cursor: "pointer"
              }}
            >
              JP
            </button>
          </div>
          <span>{text.system_status}</span>
        </div>
      </div>

      {/* Main Brand Section - Styled as a rugged scientific banner */}
      <header style={{ marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <Terminal size={16} className="display-cyan" />
          <span className="display-cyan glow-pulse" style={{ fontSize: "0.85rem", letterSpacing: "0.15em", fontFamily: "var(--font-display)" }}>
            {text.benchmark_title}
          </span>
        </div>
        <h1 className="display-title" style={{ fontSize: "2.85rem", textTransform: "uppercase", fontWeight: "400", lineHeight: "1.1", marginBottom: "0.75rem" }}>
          {text.app_title}
        </h1>
        <p style={{ color: "var(--text-main)", fontSize: "0.9rem", maxWidth: "680px", lineHeight: "1.6" }}>
          {text.app_subtitle}
        </p>
      </header>
    </>
  );
};
