import yfinance as yf
from utils.indicators import calculate_indicators


def generate_signal(ticker):

    df = yf.download(
        ticker,
        period="2y",
        auto_adjust=True,
        progress=False
    )

    if df.empty:
        return {
            "error": "No data found"
        }

    df.columns = df.columns.get_level_values(0)

    df = calculate_indicators(df)

    latest = df.iloc[-1]

    signal = "HOLD"

    # RSI Strategy
    if latest["RSI"] < 30:
        signal = "BUY"

    elif latest["RSI"] > 70:
        signal = "SELL"

    # MACD Confirmation
    if latest["MACD"] > latest["Signal"]:
        macd_trend = "Bullish"
    else:
        macd_trend = "Bearish"

    return {
        "ticker": ticker.upper(),
        "signal": signal,
        "rsi": round(float(latest["RSI"]), 2),
        "macd": round(float(latest["MACD"]), 2),
        "signal_line": round(float(latest["Signal"]), 2),
        "macd_trend": macd_trend
    }