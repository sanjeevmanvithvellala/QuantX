import yfinance as yf
from utils.indicators import calculate_indicators


def get_history(ticker):

    df = yf.download(
        ticker,
        period="1y",
        auto_adjust=True,
        progress=False
    )

    df.columns = df.columns.get_level_values(0)

    df = calculate_indicators(df)

    return {
        "dates":
            df.index.strftime(
                "%Y-%m-%d"
            ).tolist(),

        "close":
            df["Close"]
            .round(2)
            .tolist(),

        "sma50":
            df["SMA50"]
            .fillna(0)
            .round(2)
            .tolist(),

        "sma200":
            df["SMA200"]
            .fillna(0)
            .round(2)
            .tolist()
    }