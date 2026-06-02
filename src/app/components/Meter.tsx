import React from "react";

export const getStatusColorClass = (score: number) => {
  if (score >= 80) return "display-success";
  if (score >= 50) return "display-warning";
  return "display-danger";
};

export const getStatusColorValues = (score: number) => {
  if (score >= 80) return { hex: "var(--color-success)", glow: "var(--color-success-glow)" };
  if (score >= 50) return { hex: "var(--color-warning)", glow: "var(--color-warning-glow)" };
  return { hex: "var(--color-danger)", glow: "var(--color-danger-glow)" };
};

interface SegmentedMeterProps {
  score: number;
  customMax?: number;
}

export const SegmentedMeter: React.FC<SegmentedMeterProps> = ({ score, customMax = 100 }) => {
  const totalCells = 20;
  const percentage = Math.max(0, Math.min(100, (score / customMax) * 100));
  const activeCells = Math.round((percentage / 100) * totalCells);
  const colors = getStatusColorValues(percentage);

  return (
    <div className="segmented-meter">
      {Array.from({ length: totalCells }).map((_, i) => (
        <div 
          key={i} 
          className={`segmented-cell ${i < activeCells ? "active-fill" : ""}`}
          style={i < activeCells ? { 
            "--fill-color": colors.hex, 
            "--fill-color-glow": colors.glow 
          } as React.CSSProperties : {}}
        />
      ))}
    </div>
  );
};
