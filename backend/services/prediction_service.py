import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from utils.indicators import calculate_indicators

def get_prediction(ticker):
    # Fetch 2 years of daily data (approx 500 trading days)
    df = yf.download(
        ticker,
        period="2y",
        auto_adjust=True,
        progress=False
    )

    if df.empty or len(df) < 220:
        return {"error": "Insufficient data to train machine learning models (needs 220+ days)"}

    # Flatten MultiIndex columns if necessary
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Calculate indicators
    df = calculate_indicators(df)

    # Drop NaNs resulting from SMA50/SMA200 and indicators
    df_clean = df.dropna(subset=["SMA50", "SMA200", "RSI", "MACD"]).copy()
    if len(df_clean) < 100:
        return {"error": "Insufficient clean data after indicator computation"}

    # Define Features and Target
    feature_cols = ["Open", "High", "Low", "Close", "Volume", "SMA50", "SMA200", "RSI", "MACD"]
    X = df_clean[feature_cols].copy()
    
    # Target: Next Day Close
    y = df_clean["Close"].shift(-1)

    # Save today's features for forecasting
    latest_features = X.iloc[[-1]]
    latest_close = float(df_clean["Close"].iloc[-1])

    # Remove the last row since we don't know the future next-day close target
    X_ml = X.iloc[:-1]
    y_ml = y.dropna()

    # Split chronologically (80% train, 20% test) to prevent lookahead bias
    split_idx = int(len(X_ml) * 0.8)
    if split_idx < 40:
        return {"error": "Insufficient training samples"}

    X_train, X_test = X_ml.iloc[:split_idx], X_ml.iloc[split_idx:]
    y_train, y_test = y_ml.iloc[:split_idx], y_ml.iloc[split_idx:]

    # Train Random Forest Regressor
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    rf_preds = rf.predict(X_test)
    rf_rmse = np.sqrt(mean_squared_error(y_test, rf_preds))
    rf_mae = mean_absolute_error(y_test, rf_preds)

    # Train XGBoost Regressor
    xgb = XGBRegressor(n_estimators=100, random_state=42, learning_rate=0.05)
    xgb.fit(X_train, y_train)
    xgb_preds = xgb.predict(X_test)
    xgb_rmse = np.sqrt(mean_squared_error(y_test, xgb_preds))
    xgb_mae = mean_absolute_error(y_test, xgb_preds)

    # Choose model with the lowest test RMSE
    if rf_rmse <= xgb_rmse:
        best_model = rf
        model_name = "RandomForest"
        best_rmse = rf_rmse
        best_mae = rf_mae
        test_preds = rf_preds
    else:
        best_model = xgb
        model_name = "XGBoost"
        best_rmse = xgb_rmse
        best_mae = xgb_mae
        test_preds = xgb_preds

    # Fit selected model on all historical data
    best_model.fit(X_ml, y_ml)
    next_day_price = float(best_model.predict(latest_features)[0])

    # Direction forecast
    direction = "UP" if next_day_price > latest_close else "DOWN"

    # Calculate Directional Accuracy on test set as a proxy for prediction confidence
    test_closes_prev = X_test["Close"].values
    actual_changes = y_test.values - test_closes_prev
    predicted_changes = test_preds - test_closes_prev

    # Check matches where signs are identical
    matches = sum(1 for i in range(len(actual_changes)) if (actual_changes[i] * predicted_changes[i]) > 0)
    dir_accuracy = (matches / len(actual_changes)) * 100 if len(actual_changes) > 0 else 50.0

    # Clean confidence range (cap between 50% and 95%)
    confidence = max(50.0, min(95.0, dir_accuracy))

    return {
        "ticker": ticker.upper(),
        "next_day_price": round(next_day_price, 2),
        "direction": direction,
        "confidence": round(confidence, 1),
        "model": model_name,
        "rmse": round(float(best_rmse), 2),
        "mae": round(float(best_mae), 2)
    }
