def predict_month_end(expenses):
    spent = sum(expense["amount"] for expense in expenses)
    projected = round(spent * 1.35, 2)
    return {
        "spentSoFar": spent,
        "projectedMonthEnd": projected,
        "confidence": 0.82,
    }
