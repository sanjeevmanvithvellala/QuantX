import React from "react";

export default function RiskCard({ risk }) {
  if (!risk || risk.error) {
    return (
      <div className="card span-4 fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px" }}>
        <p style={{ color: "var(--text-muted)" }}>Risk metrics unavailable or error computing statistical portfolio risk.</p>
      </div>
    );
  }

  const {
    ticker,
    beta,
    alpha,
    var_95,
    expected_return,
    volatility,
    sortino_ratio
  } = risk;

  return (
    <div className="card span-4 fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="card-title">
        <span>Risk Analytics (vs. SPY)</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{ticker} (2Y daily)</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            BETA (SYSTEMATIC)
          </div>
          <div style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: beta > 1.2 ? "var(--color-sell)" : beta < 0.8 ? "var(--color-buy)" : "var(--text-primary)",
            fontFamily: "var(--font-mono)"
          }}>
            {beta.toFixed(2)}
          </div>
        </div>

        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            ALPHA (EXCESS RETURN)
          </div>
          <div style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: alpha >= 0 ? "var(--color-buy)" : "var(--color-sell)",
            fontFamily: "var(--font-mono)"
          }}>
            {alpha >= 0 ? "+" : ""}{alpha.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Additional Risk Ratios */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Expected Return (Ann.)</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: expected_return >= 0 ? "var(--color-buy)" : "var(--color-sell)" }}>
            {expected_return >= 0 ? "+" : ""}{expected_return}%
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Annual Volatility</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{volatility}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Daily Value at Risk (VaR 95%)</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--color-sell)" }}>{var_95}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Sortino Ratio</span>
          <span style={{
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            color: sortino_ratio > 1.2 ? "var(--color-buy)" : sortino_ratio > 0 ? "var(--text-primary)" : "var(--color-sell)"
          }}>{sortino_ratio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
