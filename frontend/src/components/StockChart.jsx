import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Brush
} from "recharts";

export default function StockChart({ historyData }) {
  const [range, setRange] = useState("ALL"); // "1M" | "3M" | "6M" | "ALL"

  // Process data from parallel lists into an array of objects
  const chartData = useMemo(() => {
    if (!historyData || !historyData.dates || !historyData.close) return [];
    
    const formatted = historyData.dates.map((date, idx) => ({
      date,
      Close: historyData.close[idx],
      SMA50: historyData.sma50 ? historyData.sma50[idx] : null,
      SMA200: historyData.sma200 ? historyData.sma200[idx] : null
    }));

    // Filter based on range
    if (range === "ALL") return formatted;
    
    let daysToKeep = 252; // default
    if (range === "1M") daysToKeep = 21;
    else if (range === "3M") daysToKeep = 63;
    else if (range === "6M") daysToKeep = 126;

    return formatted.slice(-daysToKeep);
  }, [historyData, range]);

  if (chartData.length === 0) {
    return (
      <div className="card span-8" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "350px" }}>
        <p style={{ color: "var(--text-muted)" }}>No historical data available to chart.</p>
      </div>
    );
  }

  // Custom tooltips to match dark aesthetic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: "var(--bg-tertiary)",
          border: "1px solid var(--border-color)",
          padding: "10px 14px",
          borderRadius: "6px",
          boxShadow: "var(--shadow-md)"
        }}>
          <p style={{ margin: "0 0 6px", fontWeight: "bold", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", fontSize: "0.85rem", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: entry.color, fontWeight: 500 }}>{entry.name}:</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card span-8 fade-in" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="card-title" style={{ marginBottom: "0" }}>Historical Close vs. Moving Averages</span>
        </div>
        
        {/* Time filters */}
        <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-primary)", padding: "2px", borderRadius: "6px" }}>
          {["1M", "3M", "6M", "ALL"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                background: range === r ? "var(--bg-tertiary)" : "transparent",
                color: range === r ? "var(--text-primary)" : "var(--text-muted)",
                border: "none",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: "100%", height: "350px", marginTop: "10px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.85rem" }} />
            
            <Line
              type="monotone"
              dataKey="Close"
              name="Close Price"
              stroke="var(--accent-color)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="SMA50"
              name="50-day SMA"
              stroke="var(--color-hold)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="SMA200"
              name="200-day SMA"
              stroke="var(--color-sell)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            
            <Brush
              dataKey="date"
              height={20}
              stroke="var(--border-color)"
              fill="var(--bg-primary)"
              tickFormatter={() => ""}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}