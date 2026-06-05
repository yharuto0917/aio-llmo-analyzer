import React from "react";
import { getStatusColorClass, getStatusColorValues, SegmentedMeter } from "./Meter";
import { UIBenchmarkTranslations } from "../translations";

interface MasterVerdictPanelProps {
  totalScore: number;
  text: UIBenchmarkTranslations;
}

export const MasterVerdictPanel: React.FC<MasterVerdictPanelProps> = ({ totalScore, text }) => {
  const statusColorValues = getStatusColorValues(totalScore);

  const getStatusText = () => {
    if (totalScore >= 90) return text.status_optimized;
    if (totalScore >= 75) return text.status_strong;
    if (totalScore >= 50) return text.status_warning;
    return text.status_critical;
  };

  return (
    <div className="tech-panel">
      <div className="tech-panel-header">
        <span>{text.system_verdict}</span>
        <span className="display-cyan" style={{ fontSize: "0.75rem" }}>{text.sys_ok}</span>
      </div>
      <div className="tech-panel-content" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Huge Raw Monospace Score */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
          <span className={`display-title ${getStatusColorClass(totalScore)}`} style={{ fontSize: "5rem", lineHeight: "1", fontFamily: "var(--font-display)" }}>
            {totalScore}
          </span>
          <span style={{ fontSize: "1.25rem", color: "var(--text-muted)" }}>{text.score_label}</span>
        </div>

        {/* Level Meter */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
            <span>{text.telemetry_gauge}</span>
            <span className={getStatusColorClass(totalScore)}>
              {totalScore}% {text.signal_label}
            </span>
          </div>
          <SegmentedMeter score={totalScore} />
        </div>

        {/* Text Rating Details */}
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
            <span style={{ width: "8px", height: "8px", backgroundColor: statusColorValues.hex, borderRadius: "50%" }} />
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", color: "#ffffff", letterSpacing: "0.05em" }}>
              {getStatusText()}
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
            {text.composite_weight}
          </p>
        </div>

      </div>
    </div>
  );
};
