import React from "react";

export default function BacktestCard({ backtest }) {
  if (!backtest || backtest.error) {
    return (
      <div className="card span-6 fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px" }}>
        <p style={{ color: "var(--text-muted)" }}>Backtest data unavailable or error loading strategy metrics.</p>
      </div>
    );
  }

  const {
    ticker,
    strategy_return,
    buy_hold_return,
    sharpe_ratio,
    annual_return,
    annual_volatility,
    max_drawdown,
    win_rate,
    profit_factor,
    trades
  } = backtest;

  const isOutperforming = strategy_return > buy_hold_return;

  return (
    <div className="card span-6 fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="card-title">
        <span>Backtest Engine (50/200 SMA Crossover)</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{ticker} (2Y History)</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid " + (isOutperforming ? "rgba(38, 166, 154, 0.2)" : "var(--border-color)")
        }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            STRATEGY RETURN
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: strategy_return >= 0 ? "var(--color-buy)" : "var(--color-sell)",
            fontFamily: "var(--font-mono)"
          }}>
            {strategy_return >= 0 ? "+" : ""}{strategy_return}%
          </div>
        </div>

        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
            BUY & HOLD RETURN
          </div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: buy_hold_return >= 0 ? "var(--color-buy)" : "var(--color-sell)",
            fontFamily: "var(--font-mono)"
          }}>
            {buy_hold_return >= 0 ? "+" : ""}{buy_hold_return}%
          </div>
        </div>
      </div>

      {isOutperforming ? (
        <div style={{
          fontSize: "0.8rem",
          color: "var(--color-buy)",
          backgroundColor: "rgba(38, 166, 154, 0.1)",
          padding: "8px 12px",
          borderRadius: "6px",
          fontWeight: 500,
          border: "1px solid rgba(38, 166, 154, 0.2)"
        }}>
          🚀 Strategy outperforms Buy & Hold by {(strategy_return - buy_hold_return).toFixed(2)}%
        </div>
      ) : (
        <div style={{
          fontSize: "0.8rem",
          color: "var(--color-sell)",
          backgroundColor: "rgba(239, 83, 80, 0.1)",
          padding: "8px 12px",
          borderRadius: "6px",
          fontWeight: 500,
          border: "1px solid rgba(239, 83, 80, 0.2)"
        }}>
          ⚠️ Strategy underperforms Buy & Hold by {(buy_hold_return - strategy_return).toFixed(2)}%
        </div>
      )}

      {/* Advanced Performance Stats Table */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Annual Return</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{annual_return}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Annual Volatility</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>{annual_volatility}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Sharpe Ratio</span>
          <span style={{
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            color: sharpe_ratio > 1 ? "var(--color-buy)" : sharpe_ratio > 0 ? "var(--text-primary)" : "var(--color-sell)"
          }}>{sharpe_ratio}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Maximum Drawdown</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: "var(--color-sell)" }}>{max_drawdown}%</span>
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", borderTop: "1px dashed var(--border-color)", paddingTop: "8px" }}>
          <span style={{ color: "var(--text-secondary)" }}>Win Rate</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", color: win_rate >= 50 ? "var(--color-buy)" : "var(--color-sell)" }}>
            {win_rate}%
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Total Trades</span>
          <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)" }}>{trades}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
          <span style={{ color: "var(--text-secondary)" }}>Profit Factor</span>
          <span style={{
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            color: profit_factor >= 1.5 ? "var(--color-buy)" : profit_factor >= 1.0 ? "var(--text-primary)" : "var(--color-sell)"
          }}>{profit_factor}</span>
        </div>
      </div>
    </div>
  );
}
