import React from "react";

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header style={{
      backgroundColor: "var(--bg-secondary)",
      borderBottom: "1px solid var(--border-color)",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent-color)", letterSpacing: "1px" }}>
          ⚡ QUANTX
        </span>
        <span style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          backgroundColor: "var(--bg-tertiary)",
          padding: "3px 8px",
          borderRadius: "4px",
          color: "var(--text-secondary)",
          border: "1px solid var(--border-color)"
        }}>
          TERMINAL v2.0
        </span>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => setActiveTab("stock")}
          style={{
            background: activeTab === "stock" ? "var(--bg-tertiary)" : "transparent",
            color: activeTab === "stock" ? "var(--text-primary)" : "var(--text-secondary)",
            border: "1px solid " + (activeTab === "stock" ? "var(--border-color)" : "transparent"),
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          📊 Market Analysis
        </button>
        <button
          onClick={() => setActiveTab("portfolio")}
          style={{
            background: activeTab === "portfolio" ? "var(--bg-tertiary)" : "transparent",
            color: activeTab === "portfolio" ? "var(--text-primary)" : "var(--text-secondary)",
            border: "1px solid " + (activeTab === "portfolio" ? "var(--border-color)" : "transparent"),
            padding: "8px 16px",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          💼 Portfolio Tracker
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#26a69a",
          display: "inline-block"
        }}></span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
          Live Connection
        </span>
      </div>
    </header>
  );
}
