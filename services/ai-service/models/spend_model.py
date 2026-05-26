import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures


def forecast_spending(values):
    """Forecast next month spending using linear regression."""
    if not values or len(values) == 0:
        values = [28000, 32000, 30000, 36000]
    
    values = [v for v in values if v > 0]
    
    if len(values) < 2:
        # Not enough data, return average
        return round(float(np.mean(values)), 2) if values else 30000.0
    
    x = np.arange(len(values)).reshape(-1, 1)
    y = np.array(values, dtype=float)
    
    # Linear regression
    model = LinearRegression().fit(x, y)
    next_index = np.array([[len(values)]])
    forecast = float(model.predict(next_index)[0])
    
    # Ensure reasonable forecast (not negative, not too extreme)
    min_val = min(values)
    max_val = max(values)
    forecast = max(min_val * 0.5, min(forecast, max_val * 1.5))
    
    return round(forecast, 2)


def calculate_trend(values):
    """Calculate spending trend direction and strength."""
    if not values or len(values) < 2:
        return {"trend": "stable", "percentage": 0.0}
    
    values = [v for v in values if v > 0]
    if len(values) < 2:
        return {"trend": "stable", "percentage": 0.0}
    
    first_half = np.mean(values[:len(values)//2])
    second_half = np.mean(values[len(values)//2:])
    
    percentage_change = ((second_half - first_half) / first_half * 100) if first_half > 0 else 0
    
    if percentage_change > 10:
        trend = "increasing"
    elif percentage_change < -10:
        trend = "decreasing"
    else:
        trend = "stable"
    
    return {
        "trend": trend,
        "percentage": round(percentage_change, 1),
        "direction": "up" if percentage_change > 0 else "down"
    }


def calculate_budget_risk(spent, budget_limit=70000):
    """Calculate budget risk score (0-100)."""
    if budget_limit <= 0:
        return 0
    
    risk_score = min(100, max(0, (spent / budget_limit) * 100))
    
    if risk_score < 50:
        status = "low_risk"
    elif risk_score < 75:
        status = "moderate_risk"
    elif risk_score < 90:
        status = "high_risk"
    else:
        status = "critical_risk"
    
    return {
        "score": round(risk_score, 1),
        "status": status,
        "percentageOfBudget": round((spent / budget_limit) * 100, 1)
    }


def estimate_monthly_run_rate(values, days_elapsed):
    """Estimate total monthly spending based on current data."""
    if not values or days_elapsed <= 0:
        return 0
    
    current_spent = sum(values)
    
    # Estimate based on days elapsed
    if days_elapsed > 0:
        estimated_monthly = (current_spent / days_elapsed) * 30
    else:
        estimated_monthly = current_spent
    
    return round(estimated_monthly, 2)
