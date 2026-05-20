def analyze_expenses(expenses):
    totals = {}
    for expense in expenses:
        totals[expense["category"]] = totals.get(expense["category"], 0) + expense["amount"]
    top_category = max(totals, key=totals.get) if totals else "None"
    return {
        "totals": totals,
        "topCategory": top_category,
        "savingsPotential": round(sum(totals.values()) * 0.12, 2),
        "recommendations": [
            f"Review {top_category} expenses for savings opportunities.",
            "Set a weekly discretionary cap.",
        ],
    }
