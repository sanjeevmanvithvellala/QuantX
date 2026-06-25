import yfinance as yf
import numpy as np
import pandas as pd

def run_backtest(ticker):
    # Fetch 2 years of daily data for backtest
    df = yf.download(
        ticker,
        period="2y",
        auto_adjust=True,
        progress=False
    )

    if df.empty or len(df) < 50:
        return {"error": "No Data or insufficient history"}

    # Flatten MultiIndex columns if necessary
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Calculate indicators
    df["SMA50"] = df["Close"].rolling(50).mean()
    df["SMA200"] = df["Close"].rolling(200).mean()

    # Strategy: Go long (1) when SMA50 > SMA200, else Flat/Cash (0)
    df["Position"] = np.where(df["SMA50"] > df["SMA200"], 1, 0)

    # Returns
    df["Returns"] = df["Close"].pct_change()
    
    # Strategy returns (shift position by 1 to prevent lookahead bias)
    df["Strategy"] = df["Position"].shift(1) * df["Returns"]

    # Drop NaNs to isolate active backtesting period
    df_clean = df.dropna(subset=["SMA50", "SMA200"]).copy()
    if len(df_clean) < 10:
        return {"error": "Insufficient data points after indicator computation"}

    # Cumulative Returns
    cumulative_strategy = (1 + df_clean["Strategy"]).cumprod()
    cumulative_buy_hold = (1 + df_clean["Returns"]).cumprod()

    strategy_return_pct = (cumulative_strategy.iloc[-1] - 1) * 100 if len(cumulative_strategy) > 0 else 0.0
    buy_hold_return_pct = (cumulative_buy_hold.iloc[-1] - 1) * 100 if len(cumulative_buy_hold) > 0 else 0.0

    # Annualized statistics
    mean_daily = df_clean["Strategy"].mean()
    std_daily = df_clean["Strategy"].std()

    annual_return = mean_daily * 252 * 100
    annual_volatility = std_daily * np.sqrt(252) * 100 if std_daily > 0 else 0.0

    # Sharpe Ratio (annualized, Rf = 0)
    sharpe_ratio = (mean_daily / std_daily) * np.sqrt(252) if std_daily > 0 else 0.0

    # Maximum Drawdown
    drawdown = (cumulative_strategy / cumulative_strategy.cummax() - 1) * 100
    max_drawdown = drawdown.min()

    # Trades analytics (Win Rate, Profit Factor, count)
    trades_list = []
    in_position = False
    entry_price = 0.0

    # Track trades from df_clean (excluding NaNs)
    for i in range(1, len(df_clean)):
        prev_pos = df_clean["Position"].iloc[i - 1]
        curr_pos = df_clean["Position"].iloc[i]
        curr_price = df_clean["Close"].iloc[i]

        # Enter long position
        if prev_pos == 0 and curr_pos == 1:
            entry_price = curr_price
            in_position = True
        # Exit long position
        elif prev_pos == 1 and curr_pos == 0 and in_position:
            trade_return = (curr_price - entry_price) / entry_price
            trades_list.append(trade_return)
            in_position = False

    # Close remaining open position at the end
    if in_position:
        final_price = df_clean["Close"].iloc[-1]
        trade_return = (final_price - entry_price) / entry_price
        trades_list.append(trade_return)

    total_trades = len(trades_list)
    win_rate = 0.0
    profit_factor = 1.0

    if total_trades > 0:
        wins = [r for r in trades_list if r > 0]
        losses = [abs(r) for r in trades_list if r < 0]
        
        win_rate = (len(wins) / total_trades) * 100
        gross_profit = sum(wins)
        gross_loss = sum(losses)
        
        if gross_loss > 0:
            profit_factor = gross_profit / gross_loss
        else:
            profit_factor = gross_profit if gross_profit > 0 else 1.0

    return {
        "ticker": ticker.upper(),
        "strategy_return": round(float(strategy_return_pct), 2),
        "buy_hold_return": round(float(buy_hold_return_pct), 2),
        "sharpe_ratio": round(float(sharpe_ratio), 2),
        "annual_return": round(float(annual_return), 2),
        "annual_volatility": round(float(annual_volatility), 2),
        "max_drawdown": round(float(max_drawdown), 2),
        "win_rate": round(float(win_rate), 2),
        "profit_factor": round(float(profit_factor), 2),
        "trades": int(total_trades)
    }