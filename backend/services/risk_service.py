import yfinance as yf
import pandas as pd
import numpy as np

def get_risk_analytics(ticker):
    # Fetch 2 years of daily close data for stock and benchmark SPY
    df_stock = yf.download(
        ticker,
        period="2y",
        auto_adjust=True,
        progress=False
    )
    df_spy = yf.download(
        "SPY",
        period="2y",
        auto_adjust=True,
        progress=False
    )

    if df_stock.empty or df_spy.empty or len(df_stock) < 50:
        return {"error": "Insufficient historical data for risk analytics"}

    # Flatten columns
    if isinstance(df_stock.columns, pd.MultiIndex):
        df_stock.columns = df_stock.columns.get_level_values(0)
    if isinstance(df_spy.columns, pd.MultiIndex):
        df_spy.columns = df_spy.columns.get_level_values(0)

    # Calculate returns
    ret_stock = df_stock["Close"].pct_change().dropna()
    ret_spy = df_spy["Close"].pct_change().dropna()

    # Align dates
    combined = pd.concat([ret_stock, ret_spy], axis=1, keys=["stock", "spy"]).dropna()
    
    R_a = combined["stock"]
    R_m = combined["spy"]

    if len(combined) < 10:
        return {"error": "Insufficient overlapping data points"}

    # Volatility and expected return (annualized)
    expected_return = float(R_a.mean() * 252 * 100)
    volatility = float(R_a.std() * np.sqrt(252) * 100)

    # Covariance and Beta (risk relative to benchmark)
    cov = R_a.cov(R_m)
    var_m = R_m.var()
    beta = float(cov / var_m) if var_m > 0 else 1.0

    # Alpha (excess return over benchmark)
    expected_benchmark = float(R_m.mean() * 252 * 100)
    alpha = expected_return - beta * expected_benchmark

    # VaR 95% (95% confidence level daily Value at Risk, historical method)
    var_95 = float(np.percentile(R_a, 5) * 100)

    # Sortino Ratio (annualized, risk free rate = 0)
    downside_returns = R_a[R_a < 0]
    downside_std = downside_returns.std()
    downside_vol = float(downside_std * np.sqrt(252) * 100) if downside_std > 0 else 0.0
    
    sortino_ratio = expected_return / downside_vol if downside_vol > 0 else 0.0

    return {
        "ticker": ticker.upper(),
        "beta": round(beta, 2),
        "alpha": round(alpha, 2),
        "var_95": round(var_95, 2),
        "expected_return": round(expected_return, 2),
        "volatility": round(volatility, 2),
        "sortino_ratio": round(sortino_ratio, 2)
    }
