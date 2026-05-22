import React from "react";
import { Search, RefreshCw, XCircle } from "lucide-react";

interface AuditFormProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  error: string | null;
  text: any;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuditForm: React.FC<AuditFormProps> = ({
  url,
  setUrl,
  loading,
  error,
  text,
  onSubmit,
}) => {
  return (
    <section style={{ marginBottom: "3.5rem" }}>
      <form onSubmit={onSubmit} className="console-input-group">
        <div className="console-input-prefix">{text.cmd_prefix}</div>
        <input
          type="text"
          className="console-input"
          placeholder={text.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="console-btn" disabled={loading || !url}>
          {loading ? (
            <>
              <RefreshCw className="spinner" size={13} style={{ animation: "rotate 1.5s linear infinite" }} />
              <span>{text.btn_running}</span>
            </>
          ) : (
            <>
              <Search size={13} />
              <span>{text.btn_run}</span>
            </>
          )}
        </button>
      </form>

      {/* Fault / Alarm Banner for unavailable URLs */}
      {error && (
        <div className="hazard-alert" style={{ marginTop: "1.5rem" }}>
          <div style={{ flexShrink: 0 }}>
            <XCircle size={18} className="display-danger" style={{ marginTop: "0.1rem" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="display-danger" style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", marginBottom: "0.25rem", letterSpacing: "0.05em" }}>
              {text.critical_fault}
            </div>
            <div style={{ color: "var(--text-heading)", lineHeight: "1.4" }}>
              {error}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
