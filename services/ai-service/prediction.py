from models.spend_model import (
    forecast_spending,
    calculate_trend,
    calculate_budget_risk,
    estimate_monthly_run_rate
)


def predict_month_end(expenses, budget_limit=70000, days_in_month=30):
    """
    Predict month-end spending with comprehensive analysis.
    
    Args:
        expenses: List of expense dictionaries with 'amount' and 'category'
        budget_limit: Monthly budget limit (default 70000)
        days_in_month: Days in the month (default 30)
    """
    if not expenses:
        return {
            "spentSoFar": 0,
            "projectedMonthEnd": 0,
            "nextMonthForecast": 0,
            "budgetRiskScore": 0,
            "confidence": 0.0,
            "trend": "stable",
            "runRate": 0,
            "budgetStatus": "on_track"
        }
    
    # Extract amounts
    amounts = [exp.get("amount", 0) for exp in expenses if exp.get("amount", 0) > 0]
    
    if not amounts:
        return {
            "spentSoFar": 0,
            "projectedMonthEnd": 0,
            "nextMonthForecast": 0,
            "budgetRiskScore": 0,
            "confidence": 0.0,
            "trend": "stable",
            "runRate": 0,
            "budgetStatus": "on_track"
        }
    
    spent_so_far = sum(amounts)
    
    # Forecast spending for next month
    next_month_forecast = forecast_spending(amounts)
    
    # Project month end (simple extrapolation)
    avg_daily_spending = spent_so_far / max(1, len(amounts))
    projected_month_end = spent_so_far + (avg_daily_spending * (days_in_month - len(amounts)))
    
    # Calculate trend
    trend_analysis = calculate_trend(amounts)
    
    # Calculate budget risk
    risk_analysis = calculate_budget_risk(projected_month_end, budget_limit)
    
    # Estimate run rate
    run_rate = estimate_monthly_run_rate(amounts, len(amounts))
    
    # Calculate confidence based on data points
    confidence = min(0.95, 0.6 + (len(amounts) / 100))
    
    # Determine budget status
    if risk_analysis["score"] < 50:
        budget_status = "on_track"
    elif risk_analysis["score"] < 80:
        budget_status = "caution"
    else:
        budget_status = "at_risk"
    
    return {
        "spentSoFar": round(spent_so_far, 2),
        "projectedMonthEnd": round(projected_month_end, 2),
        "nextMonthForecast": round(next_month_forecast, 2),
        "budgetRiskScore": risk_analysis["score"],
        "confidence": round(confidence, 2),
        "trend": trend_analysis["trend"],
        "trendPercentage": trend_analysis["percentage"],
        "runRate": round(run_rate, 2),
        "budgetStatus": budget_status,
        "budgetLimit": budget_limit,
        "remainingBudget": max(0, round(budget_limit - projected_month_end, 2)),
        "dailyBudgetRemaining": round(max(0, budget_limit - projected_month_end) / max(1, days_in_month - len(amounts)), 2),
        "model": "linear-regression-with-trend-analysis"
    }
