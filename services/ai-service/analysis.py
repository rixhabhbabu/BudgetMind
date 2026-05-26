import numpy as np


def analyze_expenses(expenses):
    """Comprehensive expense analysis with statistical insights."""
    if not expenses:
        return {
            "totals": {},
            "topCategory": "None",
            "savingsPotential": 0,
            "recommendations": ["No expense data available yet."],
            "statistics": {},
            "categoryBreakdown": []
        }
    
    # Calculate totals by category
    totals = {}
    category_items = {}
    for expense in expenses:
        category = expense.get("category", "Other")
        amount = expense.get("amount", 0)
        totals[category] = totals.get(category, 0) + amount
        if category not in category_items:
            category_items[category] = []
        category_items[category].append(amount)
    
    total_spend = sum(totals.values())
    
    # Find top category
    top_category = max(totals, key=totals.get) if totals else "None"
    top_category_amount = totals.get(top_category, 0)
    
    # Calculate category percentages
    category_breakdown = []
    for category, amount in sorted(totals.items(), key=lambda x: x[1], reverse=True):
        percentage = (amount / total_spend * 100) if total_spend > 0 else 0
        category_breakdown.append({
            "category": category,
            "amount": round(amount, 2),
            "percentage": round(percentage, 1),
            "count": len(category_items[category]),
            "average": round(amount / len(category_items[category]), 2)
        })
    
    # Statistical analysis
    all_amounts = [exp.get("amount", 0) for exp in expenses]
    statistics = {
        "totalExpenses": len(expenses),
        "totalSpent": round(total_spend, 2),
        "averageExpense": round(total_spend / len(expenses), 2),
        "medianExpense": round(float(np.median(all_amounts)), 2),
        "stdDeviation": round(float(np.std(all_amounts)), 2),
        "minExpense": round(min(all_amounts), 2),
        "maxExpense": round(max(all_amounts), 2)
    }
    
    # Generate intelligent recommendations
    recommendations = []
    
    # Savings potential calculation
    high_std = statistics["stdDeviation"] > statistics["averageExpense"]
    recommended_savings_rate = 0.15 if high_std else 0.12
    savings_potential = round(total_spend * recommended_savings_rate, 2)
    
    if top_category and top_category_amount > total_spend * 0.35:
        recommendations.append(
            f"{top_category} is {round(top_category_amount/total_spend*100, 1)}% of spending. Try to reduce this by 10-15%."
        )
    
    if statistics["maxExpense"] > statistics["averageExpense"] * 3:
        recommendations.append(
            f"You have unusually high expenses (₹{statistics['maxExpense']}). Monitor these carefully."
        )
    
    if high_std:
        recommendations.append(
            "Your spending varies widely. Create a budget buffer for unexpected expenses."
        )
    else:
        recommendations.append(
            "Your spending is consistent. This is a good time to increase savings goals."
        )
    
    if total_spend > 0:
        recommendations.append(
            f"Potential monthly savings: ₹{savings_potential} if you reduce discretionary spending."
        )
    
    return {
        "totals": {k: round(v, 2) for k, v in totals.items()},
        "topCategory": top_category,
        "savingsPotential": savings_potential,
        "recommendations": recommendations,
        "statistics": statistics,
        "categoryBreakdown": category_breakdown
    }
