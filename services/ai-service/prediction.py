from models.spend_model import forecast_spending


def predict_month_end(expenses):
    spent = sum(expense["amount"] for expense in expenses)
    projected = round(spent * 1.35, 2)
    forecast = forecast_spending([expense["amount"] for expense in expenses])
    return {
        "spentSoFar": spent,
        "projectedMonthEnd": projected,
        "nextMonthForecast": forecast,
        "budgetRiskScore": min(100, round(projected / 70000 * 100)),
        "confidence": 0.82,
    }
