import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
});

export const api = {
  fetchStockData: async (ticker) => {
    const res = await apiClient.get(`/stock/${ticker}`);
    return res.data;
  },
  
  fetchHistory: async (ticker) => {
    const res = await apiClient.get(`/history/${ticker}`);
    return res.data;
  },
  
  fetchSignal: async (ticker) => {
    const res = await apiClient.get(`/signal/${ticker}`);
    return res.data;
  },
  
  fetchBacktest: async (ticker) => {
    const res = await apiClient.get(`/backtest/${ticker}`);
    return res.data;
  },
  
  fetchPrediction: async (ticker) => {
    const res = await apiClient.get(`/predict/${ticker}`);
    return res.data;
  },
  
  fetchInsight: async (ticker) => {
    const res = await apiClient.get(`/insight/${ticker}`);
    return res.data;
  },
  
  fetchRisk: async (ticker) => {
    const res = await apiClient.get(`/risk/${ticker}`);
    return res.data;
  },
  
  fetchPortfolio: async (tickers = [], weights = []) => {
    const tickersParam = tickers.join(",");
    const weightsParam = weights.join(",");
    const res = await apiClient.get(`/portfolio`, {
      params: {
        tickers: tickersParam || undefined,
        weights: weightsParam || undefined
      }
    });
    return res.data;
  }
};

export default apiClient;