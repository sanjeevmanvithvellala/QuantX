import React from "react";

export default function MetricCard({
  title,
  value,
  subtitle,
  change,
  trend,
  prefix = "",
  suffix = "",
  sizeClass = "span-3"
}) {
  const isUp = trend === "UP" || (change && parseFloat(change) > 0);
  const isDown = trend === "DOWN" || (change && parseFloat(change) < 0);
  
  const changeColorClass = isUp ? "text-up" : isDown ? "text-down" : "";
  const changeSymbol = isUp ? "▲" : isDown ? "▼" : "";

  return (
    <div className={`card ${sizeClass} fade-in`}>
      <div className="card-title">
        <span>{title}</span>
        {change !== undefined && (
          <span className={`badge ${isUp ? "badge-bullish" : isDown ? "badge-bearish" : "badge-neutral"}`} style={{ fontSize: "0.75rem" }}>
            {changeSymbol} {Math.abs(change)}{suffix}
          </span>
        )}
      </div>
      <div className="card-value">
        <span style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginRight: "2px" }}>{prefix}</span>
        {value !== null && value !== undefined ? value.toLocaleString() : "—"}
      </div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  );
}