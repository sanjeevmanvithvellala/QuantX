import yfinance as yf
import numpy as np
import pandas as pd
from utils.indicators import calculate_indicators

def get_insight(ticker):
    df = yf.download(
        ticker,
        period="2y",
        auto_adjust=True,
        progress=False
    )

    if df.empty or len(df) < 50:
        return {"error": "Insufficient data to compute explanations"}

    # Flatten MultiIndex columns if necessary
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Calculate indicators
    df = calculate_indicators(df)
    latest = df.iloc[-1]

    close = float(latest["Close"])
    sma50 = float(latest["SMA50"])
    sma200 = float(latest["SMA200"])
    rsi = float(latest["RSI"])
    macd = float(latest["MACD"])
    signal = float(latest["Signal"])

    reasons = []
    bullish_signals = 0
    bearish_signals = 0
    total_signals = 0

    # 1. Close vs SMA50
    total_signals += 1
    if close > sma50:
        reasons.append("Price is above the 50-day moving average (Short-term Bullish).")
        bullish_signals += 1
    else:
        reasons.append("Price is below the 50-day moving average (Short-term Bearish).")
        bearish_signals += 1

    # 2. SMA50 vs SMA200 (Golden / Death Cross)
    total_signals += 1
    if sma50 > sma200:
        reasons.append("SMA50 is above SMA200, indicating a long-term upward trend (Golden Cross).")
        bullish_signals += 1
    else:
        reasons.append("SMA50 is below SMA200, indicating a long-term downward trend (Death Cross).")
        bearish_signals += 1

    # 3. MACD
    total_signals += 1
    if macd > signal:
        reasons.append("MACD is above the signal line, showing positive momentum.")
        bullish_signals += 1
    else:
        reasons.append("MACD is below the signal line, suggesting downward momentum.")
        bearish_signals += 1

    # 4. RSI
    total_signals += 1
    if rsi < 30:
        reasons.append("RSI is oversold (under 30), implying a potential near-term price rebound.")
        bullish_signals += 1
    elif rsi > 70:
        reasons.append("RSI is overbought (above 70), indicating the stock might be due for a pullback.")
        bearish_signals += 1
    else:
        reasons.append("RSI is in neutral territory, showing steady relative strength.")
        # Neutral RSI does not count toward direction bias
        total_signals -= 1

    # Determine Trend and Recommendation
    bias_score = (bullish_signals / total_signals) * 100 if total_signals > 0 else 50.0

    if bias_score > 60:
        trend = "Bullish"
        recommendation = "BUY"
        confidence = int(bias_score)
    elif bias_score < 40:
        trend = "Bearish"
        recommendation = "SELL"
        confidence = int(100 - bias_score)
    else:
        trend = "Neutral"
        recommendation = "HOLD"
        confidence = int(50 + abs(bias_score - 50))

    # Volatility / Risk Estimation (Standard deviation of daily returns over the last quarter)
    recent_returns = df["Close"].pct_change().iloc[-63:]
    vol_annual = recent_returns.std() * np.sqrt(252) * 100 if not recent_returns.empty else 0.0

    if vol_annual > 35:
        risk = "High"
    elif vol_annual > 20:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "trend": trend,
        "recommendation": recommendation,
        "confidence": confidence,
        "summary": reasons,
        "risk": risk
    }
