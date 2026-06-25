import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Header from "./Header";
import SearchBar from "./SearchBar";
import MetricCard from "./MetricCard";
import StockChart from "./StockChart";
import SignalCard from "./SignalCard";
import BacktestCard from "./BacktestCard";
import PredictionCard from "./PredictionCard";
import RiskCard from "./RiskCard";
import InsightCard from "./InsightCard";
import PortfolioCard from "./PortfolioCard";
import Loader from "./Loader";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stock");
  
  // Stock analysis state
  const [ticker, setTicker] = useState("AAPL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [stockData, setStockData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [backtestData, setBacktestData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [insightData, setInsightData] = useState(null);
  const [riskData, setRiskData] = useState(null);

  // Portfolio tracker state
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  // Load stock on mount
  useEffect(() => {
    handleStockSearch(ticker);
  }, []);

  // Load portfolio when tab changes to portfolio
  useEffect(() => {
    if (activeTab === "portfolio" && !portfolioData) {
      handleRebalancePortfolio();
    }
  }, [activeTab]);

  const handleStockSearch = async (symbol) => {
    setTicker(symbol);
    setLoading(true);
    setError(null);

    try {
      // Parallel requests for ultra-low latency load times
      const [stock, history, backtest, prediction, insight, risk] = await Promise.all([
        api.fetchStockData(symbol),
        api.fetchHistory(symbol),
        api.fetchBacktest(symbol),
        api.fetchPrediction(symbol),
        api.fetchInsight(symbol),
        api.fetchRisk(symbol)
      ]);

      if (stock.error || history.error) {
        setError(stock.error || history.error || "Failed to load ticker data");
        setStockData(null);
        setHistoryData(null);
        setBacktestData(null);
        setPredictionData(null);
        setInsightData(null);
        setRiskData(null);
      } else {
        setStockData(stock);
        setHistoryData(history);
        setBacktestData(backtest);
        setPredictionData(prediction);
        setInsightData(insight);
        setRiskData(risk);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection lost. Verify that the FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleRebalancePortfolio = async (tickers = [], weights = []) => {
    setPortfolioLoading(true);
    try {
      const data = await api.fetchPortfolio(tickers, weights);
      setPortfolioData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPortfolioLoading(false);
    }
  };

  return (
    <div className="app-container fade-in">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="dashboard-container">
        {activeTab === "stock" ? (
          <>
            <SearchBar onSearch={handleStockSearch} initialValue={ticker} />

            {loading ? (
              <Loader message={`Analyzing ticker: ${ticker.toUpperCase()} with quantitative indicators...`} />
            ) : error ? (
              <div className="card span-12" style={{ borderLeft: "4px solid var(--color-sell)", padding: "24px", minHeight: "150px" }}>
                <h3 style={{ color: "var(--color-sell)", marginBottom: "8px" }}>⚠️ Market Analytics Error</h3>
                <p style={{ color: "var(--text-secondary)" }}>{error}</p>
                <button
                  className="btn-primary"
                  onClick={() => handleStockSearch(ticker)}
                  style={{ marginTop: "16px", padding: "6px 12px", fontSize: "0.85rem" }}
                >
                  Retry Search
                </button>
              </div>
            ) : stockData ? (
              <div className="dashboard-grid">
                
                {/* Micro Metric Cards */}
                <MetricCard
                  title="Last Close Price"
                  value={stockData.close}
                  prefix="$"
                  subtitle="Latest transaction price"
                  sizeClass="span-3"
                />
                
                <MetricCard
                  title="Daily Volume"
                  value={stockData.volume}
                  subtitle="Number of shares traded"
                  sizeClass="span-3"
                />

                <MetricCard
                  title="50-Day SMA"
                  value={stockData.sma50}
                  prefix="$"
                  subtitle="Short-term trend support"
                  sizeClass="span-3"
                />

                <MetricCard
                  title="200-Day SMA"
                  value={stockData.sma200}
                  prefix="$"
                  subtitle="Long-term trend support"
                  sizeClass="span-3"
                />

                {/* Historical chart */}
                <StockChart historyData={historyData} />

                {/* Consensus Technical Signals */}
                <SignalCard stock={stockData} />

                {/* Backtesting Stats */}
                <BacktestCard backtest={backtestData} />

                {/* ML Predictions */}
                <PredictionCard prediction={predictionData} />

                {/* Risk metrics */}
                <RiskCard risk={riskData} />

                {/* Explanations insights */}
                <InsightCard insight={insightData} />

              </div>
            ) : (
              <div className="card span-12" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
                  Please enter a ticker above to retrieve real-time market metrics.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {portfolioLoading ? (
              <Loader message="Recalculating portfolio allocations, correlation matrices, and risk profiles..." />
            ) : (
              <PortfolioCard
                portfolioData={portfolioData}
                onRebalance={handleRebalancePortfolio}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
