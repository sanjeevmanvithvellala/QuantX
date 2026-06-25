import React, { useState } from "react";

export default function SearchBar({ onSearch, initialValue = "AAPL" }) {
  const [ticker, setTicker] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim().toUpperCase());
    }
  };

  const handleQuickSelect = (symbol) => {
    setTicker(symbol);
    onSearch(symbol);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "16px",
      backgroundColor: "var(--bg-secondary)",
      padding: "16px 20px",
      borderRadius: "12px",
      border: "1px solid var(--border-color)",
      width: "100%"
    }} className="fade-in">
      <form onSubmit={handleSubmit} className="input-group" style={{ flexGrow: 1, maxWidth: "400px" }}>
        <span style={{ fontSize: "1.1rem", paddingLeft: "8px", color: "var(--text-muted)" }}>🔍</span>
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="search-input"
          placeholder="Enter stock ticker (e.g. AAPL)"
          required
        />
        <button type="submit" className="btn-primary">
          Analyze
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
          Popular assets:
        </span>
        {["AAPL", "MSFT", "NVDA", "TSLA", "META"].map((symbol) => (
          <button
            key={symbol}
            onClick={() => handleQuickSelect(symbol)}
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.8rem",
              transition: "all 0.15s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "var(--text-muted)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.transform = "none";
            }}
          >
            {symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
