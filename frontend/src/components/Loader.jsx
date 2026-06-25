import React from "react";

export default function Loader({ message = "Retrieving market analytics..." }) {
  return (
    <div className="loader-wrapper fade-in">
      <div className="spinner"></div>
      <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{message}</p>
    </div>
  );
}
