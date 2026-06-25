import yfinance as yf
from utils.indicators import calculate_indicators


def get_stock_data(ticker):

    df = yf.download(
        ticker,
        period="2y",
        auto_adjust=True,
        progress=False
    )

    if df.empty:
        return {"error": "No Data"}

    # flatten MultiIndex

    df.columns = df.columns.get_level_values(0)

    df = calculate_indicators(df)

    latest = df.iloc[-1]

    signal = "HOLD"

    if latest["RSI"] < 30:
        signal = "BUY"

    elif latest["RSI"] > 70:
        signal = "SELL"

    return {
        "ticker": ticker.upper(),

        "close": round(float(latest["Close"]), 2),

        "volume": int(latest["Volume"]),

        "sma50": round(float(latest["SMA50"]), 2),

        "sma200": round(float(latest["SMA200"]), 2),

        "rsi": round(float(latest["RSI"]), 2),

        "macd": round(float(latest["MACD"]), 2),

        "signal_line": round(float(latest["Signal"]), 2),

        "recommendation": signal
    }