import React from "react";

export default function SignalCard({ stock }) {
  if (!stock) return null;

  const { recommendation, rsi, macd, signal_line, sma50, sma200, ticker } = stock;
  
  // Determine color theme based on recommendation
  const getSignalColor = (rec) => {
    switch (rec?.toUpperCase()) {
      case "BUY": return "var(--color-buy)";
      case "SELL": return "var(--color-sell)";
      case "HOLD": return "var(--color-hold)";
      default: return "var(--text-primary)";
    }
  };

  const getSignalBadgeClass = (rec) => {
    switch (rec?.toUpperCase()) {
      case "BUY": return "badge-bullish";
      case "SELL": return "badge-bearish";
      default: return "badge-neutral";
    }
  };

  const getSmaTrend = () => {
    if (!sma50 || !sma200) return { label: "Unknown", badge: "badge-neutral" };
    if (sma50 > sma200) return { label: "Bullish (Golden Cross)", badge: "badge-bullish" };
    return { label: "Bearish (Death Cross)", badge: "badge-bearish" };
  };

  const smaTrend = getSmaTrend();
  const signalColor = getSignalColor(recommendation);
  const signalBadge = getSignalBadgeClass(recommendation);

  return (
    <div className="card span-4 fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="card-title">
        <span>Technical Signals</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{ticker}</span>
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
            CONSENSUS SIGNAL
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: signalColor, letterSpacing: "1px" }}>
            {recommendation || "HOLD"}
          </div>
        </div>
        <span className={`badge ${signalBadge}`} style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
          {recommendation === "BUY" ? "Bullish" : recommendation === "SELL" ? "Bearish" : "Neutral"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* RSI Meter */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            <span>Relative Strength Index (RSI-14)</span>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: "bold" }}>{rsi}</span>
          </div>
          <div style={{ width: "100%", height: "6px", backgroundColor: "var(--bg-tertiary)", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
            <div style={{
              position: "absolute",
              left: "30%",
              width: "40%",
              height: "100%",
              borderLeft: "1px dashed var(--border-color)",
              borderRight: "1px dashed var(--border-color)",
              backgroundColor: "rgba(255,255,255,0.03)"
            }}></div>
            <div style={{
              width: `${Math.min(100, Math.max(0, rsi))}%`,
              height: "100%",
              backgroundColor: rsi < 30 ? "var(--color-buy)" : rsi > 70 ? "var(--color-sell)" : "var(--accent-color)"
            }}></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
            <span>Oversold (&lt;30)</span>
            <span>Overbought (&gt;70)</span>
          </div>
        </div>

        {/* SMA Cross Indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Trend (50/200 SMA)</span>
          <span className={`badge ${smaTrend.badge}`}>{smaTrend.label}</span>
        </div>

        {/* MACD vs Signal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>MACD Momentum</span>
          <span className={`badge ${macd > signal_line ? "badge-bullish" : "badge-bearish"}`}>
            {macd > signal_line ? "Bullish Crossover" : "Bearish Crossunder"}
          </span>
        </div>
      </div>
    </div>
  );
}
