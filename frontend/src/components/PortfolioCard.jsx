import React, { useState } from "react";

export default function PortfolioCard({ portfolioData, onRebalance }) {
  const [weights, setWeights] = useState({
    AAPL: 20,
    MSFT: 20,
    NVDA: 20,
    TSLA: 20,
    META: 20
  });

  if (!portfolioData || portfolioData.error) {
    return (
      <div className="card span-12 fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "350px" }}>
        <p style={{ color: "var(--text-muted)" }}>Portfolio data unavailable or error calculating asset relationships.</p>
      </div>
    );
  }

  const {
    portfolio_value,
    allocation,
    daily_return,
    total_return,
    expected_return,
    volatility,
    sharpe_ratio,
    correlation_matrix
  } = portfolioData;

  const handleWeightChange = (ticker, value) => {
    setWeights(prev => ({
      ...prev,
      [ticker]: Math.max(0, parseInt(value) || 0)
    }));
  };

  const handleRebalanceSubmit = (e) => {
    e.preventDefault();
    const tickers = Object.keys(weights);
    const sum = tickers.reduce((acc, t) => acc + weights[t], 0);
    if (sum === 0) {
      alert("Sum of weights must be greater than 0");
      return;
    }
    // Convert to fractions
    const fracWeights = tickers.map(t => weights[t] / sum);
    onRebalance(tickers, fracWeights);
  };

  // Correlation heatmap cell background styling helper
  const getHeatmapColor = (val) => {
    if (val === 1) return "rgba(41, 98, 255, 0.4)"; // high correlation blue
    const absVal = Math.abs(val);
    if (val > 0) {
      return `rgba(38, 166, 154, ${absVal * 0.35})`; // teal for positive
    } else {
      return `rgba(239, 83, 80, ${absVal * 0.35})`; // red for negative
    }
  };

  const tickersList = Object.keys(correlation_matrix || {});

  return (
    <div className="card span-12 fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="card-title">
        <span>Active Multi-Asset Portfolio Tracker</span>
        <span style={{ fontSize: "0.80rem", color: "var(--text-muted)" }}>Benchmark basis S&P 500</span>
      </div>

      {/* Aggregate Portfolio Value and Stats Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "16px",
        backgroundColor: "var(--bg-tertiary)",
        padding: "16px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)"
      }}>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>PORTFOLIO VALUE</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            ${portfolio_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>DAILY RETURN</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: daily_return >= 0 ? "var(--color-buy)" : "var(--color-sell)", fontFamily: "var(--font-mono)" }}>
            {daily_return >= 0 ? "+" : ""}{daily_return.toFixed(2)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>EXPECTED RETURN (ANN.)</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: expected_return >= 0 ? "var(--color-buy)" : "var(--color-sell)", fontFamily: "var(--font-mono)" }}>
            {expected_return >= 0 ? "+" : ""}{expected_return.toFixed(2)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>VOLATILITY (ANN.)</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            {volatility.toFixed(2)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>PORTFOLIO SHARPE</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: sharpe_ratio > 1 ? "var(--color-buy)" : "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            {sharpe_ratio.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "24px" }}>
        
        {/* Allocations adjusting panel */}
        <form onSubmit={handleRebalanceSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
            Adjust Asset Weights (%)
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.keys(weights).map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)", width: "60px" }}>{t}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights[t]}
                  onChange={(e) => handleWeightChange(t, e.target.value)}
                  style={{
                    flexGrow: 1,
                    accentColor: "var(--accent-color)",
                    cursor: "pointer"
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights[t]}
                  onChange={(e) => handleWeightChange(t, e.target.value)}
                  style={{
                    width: "55px",
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    borderRadius: "4px",
                    padding: "4px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem"
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", width: "35px", textAlign: "right" }}>
                  {allocation[t] !== undefined ? allocation[t] : 0}%
                </span>
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "8px", padding: "10px" }}>
            Rebalance & Recalculate
          </button>
        </form>

        {/* Heatmap correlation grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
            Returns Correlation Heatmap (1Y Co-movements)
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}></th>
                  {tickersList.map(t => (
                    <th key={t} style={{ padding: "8px", fontWeight: "bold", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickersList.map(t1 => (
                  <tr key={t1}>
                    <td style={{ padding: "8px", fontWeight: "bold", borderRight: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-secondary)" }}>
                      {t1}
                    </td>
                    {tickersList.map(t2 => {
                      const val = correlation_matrix[t1][t2];
                      return (
                        <td
                          key={t2}
                          style={{
                            padding: "12px 8px",
                            backgroundColor: getHeatmapColor(val),
                            border: "1px solid var(--border-color)",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 600,
                            color: Math.abs(val) > 0.6 ? "#ffffff" : "var(--text-primary)",
                            transition: "background-color 0.2s"
                          }}
                        >
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
