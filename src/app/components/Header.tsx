import React from "react";
import { Terminal } from "lucide-react";
import { UIBenchmarkTranslations } from "../translations";

interface HeaderProps {
  lang: "en" | "ja";
  setLang: (lang: "en" | "ja") => void;
  text: UIBenchmarkTranslations;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, text }) => {
  return (
    <>
      {/* Dynamic Telemetry Header Bar */}
      <div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0"
        style={{ 
          borderBottom: "1px solid var(--border-color)", 
          paddingBottom: "0.75rem", 
          marginBottom: "2rem",
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          width: "100%"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="blinking-dot" />
          <span className="display-cyan" style={{ letterSpacing: "0.1em" }}>{text.module}</span>
        </div>
        
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }} className="w-full sm:w-auto justify-between sm:justify-start">
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
      <header className="mb-8 md:mb-14">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <Terminal size={16} className="display-cyan" />
          <span className="display-cyan glow-pulse" style={{ fontSize: "0.85rem", letterSpacing: "0.15em", fontFamily: "var(--font-display)", wordBreak: "break-word", overflowWrap: "break-word" }}>
            {text.benchmark_title}
          </span>
        </div>
        <h1 className="display-title text-2xl sm:text-3xl md:text-[2.85rem]" style={{ textTransform: "uppercase", fontWeight: "400", lineHeight: "1.1", marginBottom: "0.75rem" }}>
          {text.app_title}
        </h1>
        <p style={{ color: "var(--text-main)", fontSize: "0.9rem", maxWidth: "680px", lineHeight: "1.6", wordBreak: "break-word", overflowWrap: "break-word" }}>
          {text.app_subtitle}
        </p>
      </header>
    </>
  );
};
