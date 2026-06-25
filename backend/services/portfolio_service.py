import yfinance as yf
import pandas as pd
import numpy as np

def calculate_portfolio(tickers=None, weights=None):
    if not tickers:
        tickers = ["AAPL", "MSFT", "NVDA", "TSLA", "META"]
    if not weights:
        weights = [1.0 / len(tickers)] * len(tickers)

    if len(tickers) != len(weights):
        return {"error": "Tickers list and weights list must be of identical length"}

    # Uppercase tickers
    tickers = [t.upper() for t in tickers]

    # Fetch 1 year of daily close data
    df = yf.download(
        tickers,
        period="1y",
        auto_adjust=True,
        progress=False
    )

    if df.empty:
        return {"error": "Failed to fetch portfolio data"}

    # Extract Close prices
    if isinstance(df.columns, pd.MultiIndex):
        df_close = df["Close"]
    else:
        # Single stock or flat structure
        df_close = df

    # Drop tickers with no data
    df_close = df_close.dropna(how="all", axis=1)
    available_tickers = df_close.columns.tolist()

    if len(available_tickers) == 0:
        return {"error": "No data found for any of the specified tickers"}

    # Re-normalize weights for available tickers
    clean_weights = {}
    total_w = 0.0
    for t, w in zip(tickers, weights):
        if t in available_tickers:
            clean_weights[t] = float(w)
            total_w += float(w)

    if total_w == 0.0:
        return {"error": "Total weights cannot be zero"}

    for t in clean_weights:
        clean_weights[t] = clean_weights[t] / total_w

    # Calculate daily returns
    returns_df = df_close.pct_change().dropna()

    # Calculate portfolio daily returns series
    weights_vector = np.array([clean_weights[t] for t in available_tickers])
    portfolio_daily_returns = returns_df[available_tickers].dot(weights_vector)

    # Compute portfolio stats
    port_cum_returns = (1 + portfolio_daily_returns).cumprod()
    total_return_pct = (port_cum_returns.iloc[-1] - 1) * 100 if len(port_cum_returns) > 0 else 0.0
    latest_daily_return = portfolio_daily_returns.iloc[-1] * 100 if len(portfolio_daily_returns) > 0 else 0.0

    expected_return_annual = portfolio_daily_returns.mean() * 252 * 100
    volatility_annual = portfolio_daily_returns.std() * np.sqrt(252) * 100

    sharpe_ratio = expected_return_annual / volatility_annual if volatility_annual > 0 else 0.0

    # Calculate correlation matrix
    corr = returns_df[available_tickers].corr()
    correlation_matrix = {}
    for t1 in available_tickers:
        correlation_matrix[t1] = {}
        for t2 in available_tickers:
            correlation_matrix[t1][t2] = round(float(corr.loc[t1, t2]), 2)

    # Initial investment of $100k
    starting_val = 100000.0
    portfolio_value = starting_val * (1 + total_return_pct / 100.0)

    allocation = {t: round(clean_weights[t] * 100, 1) for t in available_tickers}

    return {
        "portfolio_value": round(portfolio_value, 2),
        "allocation": allocation,
        "daily_return": round(latest_daily_return, 2),
        "total_return": round(total_return_pct, 2),
        "expected_return": round(expected_return_annual, 2),
        "volatility": round(volatility_annual, 2),
        "sharpe_ratio": round(sharpe_ratio, 2),
        "correlation_matrix": correlation_matrix
    }
