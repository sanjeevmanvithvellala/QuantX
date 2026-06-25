from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.stock_service import get_stock_data
from services.signal_service import generate_signal
from services.history_service import get_history
from services.backtest_service import run_backtest
from services.prediction_service import get_prediction
from services.insight_service import get_insight
from services.risk_service import get_risk_analytics
from services.portfolio_service import calculate_portfolio

app = FastAPI(title="QuantX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "QuantX API Running"}

@app.get("/stock/{ticker}")
def stock_data(ticker: str):
    return get_stock_data(ticker)

@app.get("/history/{ticker}")
def history(ticker: str):
    return get_history(ticker)

@app.get("/backtest/{ticker}")
def backtest(ticker: str):
    return run_backtest(ticker)

@app.get("/signal/{ticker}")
def signal(ticker: str):
    return generate_signal(ticker)

@app.get("/predict/{ticker}")
def predict(ticker: str):
    return get_prediction(ticker)

@app.get("/insight/{ticker}")
def insight(ticker: str):
    return get_insight(ticker)

@app.get("/risk/{ticker}")
def risk(ticker: str):
    return get_risk_analytics(ticker)

@app.get("/portfolio")
def portfolio(tickers: str = None, weights: str = None):
    tickers_list = None
    weights_list = None
    
    if tickers:
        tickers_list = [t.strip().upper() for t in tickers.split(",") if t.strip()]
        
    if weights:
        try:
            weights_list = [float(w.strip()) for w in weights.split(",") if w.strip()]
        except ValueError:
            return {"error": "Weights parameter must be comma-separated float numbers"}
            
    return calculate_portfolio(tickers_list, weights_list)