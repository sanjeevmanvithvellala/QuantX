import React from "react";

export default function PredictionCard({ prediction }) {
  if (!prediction || prediction.error) {
    return (
      <div className="card span-4 fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px" }}>
        <p style={{ color: "var(--text-muted)" }}>ML predictions unavailable or error training regression models.</p>
      </div>
    );
  }

  const {
    ticker,
    next_day_price,
    direction,
    confidence,
    model,
    rmse,
    mae
  } = prediction;

  const isUp = direction === "UP";

  return (
    <div className="card span-4 fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="card-title">
        <span>Machine Learning Forecast</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{ticker} (Next Day)</span>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "var(--bg-tertiary)",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)"
      }}>
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            EST. NEXT CLOSE
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
            ${next_day_price.toFixed(2)}
          </div>
        </div>
        <span className={`badge ${isUp ? "badge-bullish" : "badge-bearish"}`} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
          {isUp ? "▲ UP" : "▼ DOWN"}
        </span>
      </div>

      {/* Confidence Gauge */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "6px" }}>
          <span>Directional Confidence</span>
          <span style={{ fontWeight: 600, color: "var(--accent-color)" }}>{confidence}%</span>
        </div>
        <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            width: `${confidence}%`,
            height: "100%",
            backgroundColor: "var(--accent-color)"
          }}></div>
        </div>
      </div>

      {/* Selected Model Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Optimal Model Selected</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{model}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Backtest RMSE (Error)</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>${rmse.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "var(--text-secondary)" }}>Backtest MAE (Error)</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>${mae.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
