import React from "react";

export default function InsightCard({ insight }) {
  if (!insight || insight.error) {
    return (
      <div className="card span-4 fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px" }}>
        <p style={{ color: "var(--text-muted)" }}>Market insights unavailable or error calculating explanations.</p>
      </div>
    );
  }

  const { trend, recommendation, confidence, summary, risk } = insight;

  // Signal color helpers
  const getRecColor = (rec) => {
    switch (rec?.toUpperCase()) {
      case "BUY": return "var(--color-buy)";
      case "SELL": return "var(--color-sell)";
      case "HOLD": return "var(--color-hold)";
      default: return "var(--text-primary)";
    }
  };

  const getTrendBadge = (trnd) => {
    switch (trnd?.toUpperCase()) {
      case "BULLISH": return "badge-bullish";
      case "BEARISH": return "badge-bearish";
      default: return "badge-neutral";
    }
  };

  const getRiskBadge = (rsk) => {
    switch (rsk?.toUpperCase()) {
      case "HIGH": return "badge-bearish";
      case "LOW": return "badge-bullish";
      default: return "badge-neutral";
    }
  };

  return (
    <div className="card span-4 fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="card-title">
        <span>AI Market Insights</span>
        <span className={`badge ${getTrendBadge(trend)}`}>{trend}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          flex: 1
        }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            RECOMMENDATION
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: getRecColor(recommendation) }}>
            {recommendation}
          </div>
        </div>

        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          flex: 1
        }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            CONFIDENCE
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            {confidence}%
          </div>
        </div>
      </div>

      {/* Explanations List */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600 }}>
          CONCURRING REASONS
        </div>
        <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
          {summary && summary.map((reason, idx) => (
            <li key={idx} style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              display: "flex",
              gap: "8px",
              lineHeight: "1.3"
            }}>
              <span style={{ color: "var(--accent-color)" }}>•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Badge */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "12px",
        marginTop: "auto"
      }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Volatility Risk Profile</span>
        <span className={`badge ${getRiskBadge(risk)}`}>{risk}</span>
      </div>
    </div>
  );
}
