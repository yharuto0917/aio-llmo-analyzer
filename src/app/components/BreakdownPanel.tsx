import React from "react";
import { Globe, Sparkles, Cpu } from "lucide-react";
import { getStatusColorClass, SegmentedMeter } from "./Meter";
import { UIBenchmarkTranslations } from "../translations";

interface BreakdownPanelProps {
  categoryScores: {
    seo: number;
    aio: number;
    llmo: number;
  };
  text: UIBenchmarkTranslations;
}

export const BreakdownPanel: React.FC<BreakdownPanelProps> = ({ categoryScores, text }) => {
  return (
    <div className="tech-panel">
      <div className="tech-panel-header">
        <span>{text.dimensional_header}</span>
        <span className="display-cyan" style={{ fontSize: "0.75rem" }}>{text.modules_label}</span>
      </div>
      <div className="tech-panel-content" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Traditional SEO */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.45rem", fontSize: "0.8rem", gap: "0.5rem" }}>
            <span style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "var(--text-heading)", minWidth: 0, flex: 1 }}>
              <Globe size={13} className="display-cyan" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <span style={{ wordBreak: "break-word", lineHeight: "1.4" }}>{text.seo_label}</span>
            </span>
            <span className={getStatusColorClass(categoryScores.seo)} style={{ fontFamily: "var(--font-display)", flexShrink: 0, marginTop: "0.15rem" }}>
              {categoryScores.seo} / 100
            </span>
          </div>
          <SegmentedMeter score={categoryScores.seo} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            <span>{text.seo_sub}</span>
            <span>{text.seo_weight}</span>
          </div>
        </div>

        {/* AI Overview (AIO) */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.45rem", fontSize: "0.8rem", gap: "0.5rem" }}>
            <span style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "var(--text-heading)", minWidth: 0, flex: 1 }}>
              <Sparkles size={13} className="display-cyan" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <span style={{ wordBreak: "break-word", lineHeight: "1.4" }}>{text.aio_label}</span>
            </span>
            <span className={getStatusColorClass(categoryScores.aio)} style={{ fontFamily: "var(--font-display)", flexShrink: 0, marginTop: "0.15rem" }}>
              {categoryScores.aio} / 100
            </span>
          </div>
          <SegmentedMeter score={categoryScores.aio} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            <span>{text.aio_sub}</span>
            <span>{text.aio_weight}</span>
          </div>
        </div>

        {/* LLMO */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.45rem", fontSize: "0.8rem", gap: "0.5rem" }}>
            <span style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: "var(--text-heading)", minWidth: 0, flex: 1 }}>
              <Cpu size={13} className="display-cyan" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <span style={{ wordBreak: "break-word", lineHeight: "1.4" }}>{text.llmo_label}</span>
            </span>
            <span className={getStatusColorClass(categoryScores.llmo)} style={{ fontFamily: "var(--font-display)", flexShrink: 0, marginTop: "0.15rem" }}>
              {categoryScores.llmo} / 100
            </span>
          </div>
          <SegmentedMeter score={categoryScores.llmo} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            <span>{text.llmo_sub}</span>
            <span>{text.llmo_weight}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
