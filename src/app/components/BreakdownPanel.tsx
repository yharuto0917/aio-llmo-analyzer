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
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem", fontSize: "0.8rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-heading)" }}>
              <Globe size={13} className="display-cyan" />
              <span>{text.seo_label}</span>
            </span>
            <span className={getStatusColorClass(categoryScores.seo)} style={{ fontFamily: "var(--font-display)" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem", fontSize: "0.8rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-heading)" }}>
              <Sparkles size={13} className="display-cyan" />
              <span>{text.aio_label}</span>
            </span>
            <span className={getStatusColorClass(categoryScores.aio)} style={{ fontFamily: "var(--font-display)" }}>
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
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem", fontSize: "0.8rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-heading)" }}>
              <Cpu size={13} className="display-cyan" />
              <span>{text.llmo_label}</span>
            </span>
            <span className={getStatusColorClass(categoryScores.llmo)} style={{ fontFamily: "var(--font-display)" }}>
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
