"""
Advanced insights and recommendations engine.
Provides personalized, context-aware financial guidance.
"""

import numpy as np
from analysis import analyze_expenses
from anomaly import detect_unusual_transactions


def categorize_spending(expenses):
    """
    Categorize expenses and identify patterns.
    
    Returns insights about spending distribution and behavior.
    """
    if not expenses:
        return {
            "categories": [],
            "patterns": [],
            "insights": []
        }
    
    # Group by category
    category_data = {}
    for expense in expenses:
        cat = expense.get("category", "Other")
        amount = expense.get("amount", 0)
        if cat not in category_data:
            category_data[cat] = []
        category_data[cat].append(amount)
    
    # Analyze each category
    categories = []
    for category, amounts in category_data.items():
        total = sum(amounts)
        avg = total / len(amounts) if amounts else 0
        std = float(np.std(amounts)) if len(amounts) > 1 else 0
        
        categories.append({
            "name": category,
            "total": round(total, 2),
            "count": len(amounts),
            "average": round(avg, 2),
            "stdDeviation": round(std, 2),
            "variability": "High" if std > avg * 0.5 else "Low"
        })
    
    # Identify patterns
    patterns = []
    
    # Pattern 1: High variability categories
    high_var_cats = [c for c in categories if c["variability"] == "High"]
    if high_var_cats:
        patterns.append({
            "type": "variable_spending",
            "description": f"{', '.join([c['name'] for c in high_var_cats[:2]])} have inconsistent amounts",
            "action": "Set category budgets to control volatility"
        })
    
    # Pattern 2: Top spending category
    if categories:
        top_cat = max(categories, key=lambda x: x["total"])
        total_spending = sum(c["total"] for c in categories)
        top_percentage = (top_cat["total"] / total_spending * 100) if total_spending > 0 else 0
        
        if top_percentage > 40:
            patterns.append({
                "type": "high_concentration",
                "description": f"{top_cat['name']} dominates at {top_percentage:.1f}% of spending",
                "action": f"Review {top_cat['name']} expenses and optimize"
            })
    
    # Pattern 3: Daily frequency
    daily_patterns = []
    for cat in categories:
        frequency = cat["count"]
        if frequency > 10:
            daily_patterns.append(f"{cat['name']} ({frequency}x)")
    
    if daily_patterns:
        patterns.append({
            "type": "frequent_small_expenses",
            "description": f"Daily spending: {', '.join(daily_patterns)}",
            "action": "Consider bundling or reducing daily purchases"
        })
    
    # Generate insights
    insights = generate_insights(categories, patterns)
    
    return {
        "categories": sorted(categories, key=lambda x: x["total"], reverse=True),
        "patterns": patterns,
        "insights": insights
    }


def generate_insights(categories, patterns):
    """Generate actionable insights from spending data."""
    insights = []
    
    if not categories:
        return ["Start tracking expenses to generate insights."]
    
    # Insight 1: Category diversity
    if len(categories) < 3:
        insights.append("Your spending is concentrated in few categories. Diversify to better track finances.")
    elif len(categories) > 8:
        insights.append("You have many spending categories. Consolidate similar ones for better clarity.")
    
    # Insight 2: High variability insight
    high_var = [c for c in categories if c["stdDeviation"] > c["average"] * 0.4]
    if high_var:
        insights.append(
            f"'{high_var[0]['name']}' spending is unpredictable. "
            f"Average: ₹{high_var[0]['average']}, but ranges from ₹0-{int(high_var[0]['average'] * 2)}"
        )
    
    # Insight 3: Savings opportunity
    total_spending = sum(c["total"] for c in categories)
    variable_categories = [c for c in categories if c["variability"] == "High"]
    if variable_categories:
        potential_reduction = sum(
            c["stdDeviation"] * 0.3 for c in variable_categories
        )
        if potential_reduction > 100:
            insights.append(
                f"You could potentially save ₹{int(potential_reduction)} by "
                f"controlling variable spending in {variable_categories[0]['name']}"
            )
    
    # Insight 4: Spending health
    if len(categories) >= 3:
        essential_cats = ["food", "groceries", "transport", "utilities"]
        discretionary_cats = ["dining", "entertainment", "shopping", "games"]
        
        essential_total = sum(
            c["total"] for c in categories
            if any(e in c["name"].lower() for e in essential_cats)
        )
        discretionary_total = sum(
            c["total"] for c in categories
            if any(d in c["name"].lower() for d in discretionary_cats)
        )
        
        if discretionary_total > 0 and essential_total > 0:
            ratio = discretionary_total / essential_total
            if ratio > 1:
                insights.append(
                    "Discretionary spending exceeds essential expenses. "
                    "Consider reallocating to savings goals."
                )
    
    # Ensure we have at least one insight
    if not insights:
        insights = [
            "Your spending appears stable. Continue monitoring regularly.",
            "Track spending consistently to identify optimization opportunities."
        ]
    
    return insights[:4]  # Return top 4 insights


def get_personalized_recommendations(expenses, budget_limit=70000, user_goals=None):
    """
    Generate personalized recommendations based on complete user profile.
    
    Args:
        expenses: List of expense dictionaries
        budget_limit: Monthly budget limit
        user_goals: Optional dict with savings goals, income, etc.
    
    Returns:
        List of prioritized, actionable recommendations
    """
    if not expenses:
        return {
            "recommendations": [
                "Start tracking your daily expenses to build a financial baseline.",
                "Set a realistic monthly budget based on your income.",
                "Identify your financial goals (emergency fund, vacation, etc.)",
                "Create a spending plan with category limits.",
            ],
            "priority": "setup"
        }
    
    # Analyze spending
    analysis = analyze_expenses(expenses)
    anomalies = detect_unusual_transactions(expenses)
    spending_data = categorize_spending(expenses)
    
    recommendations = []
    
    # Priority recommendations based on data
    
    # 1. Anomaly-based recommendations
    if anomalies:
        high_severity = [a for a in anomalies if a.get("severityScore", 0) > 80]
        if high_severity:
            recommendations.append({
                "priority": "high",
                "category": "anomaly_management",
                "text": f"Investigate {len(high_severity)} unusually high transactions. These may be errors or unnecessary purchases.",
                "action": "Review anomalous spending patterns"
            })
    
    # 2. Savings potential recommendations
    if analysis.get("savingsPotential", 0) > 1000:
        recommendations.append({
            "priority": "high",
            "category": "savings_opportunity",
            "text": f"You could save ₹{int(analysis['savingsPotential'])} monthly by optimizing spending in {analysis.get('topCategory', 'main categories')}.",
            "action": "Create specific reduction plan for top category"
        })
    
    # 3. Category concentration recommendations
    categories = spending_data.get("categories", [])
    if categories:
        top_cat = categories[0]
        total = sum(c["total"] for c in categories)
        top_percentage = (top_cat["total"] / total * 100) if total > 0 else 0
        
        if top_percentage > 35:
            recommendations.append({
                "priority": "medium",
                "category": "category_concentration",
                "text": f"{top_cat['name']} is {top_percentage:.1f}% of your spending. Consider alternatives or set limits.",
                "action": f"Review {top_cat['name']} and find cost-saving opportunities"
            })
    
    # 4. Budget adherence recommendations
    if budget_limit > 0:
        total_spent = analysis["statistics"]["totalSpent"]
        spend_ratio = total_spent / budget_limit if budget_limit > 0 else 0
        
        if spend_ratio > 0.85:
            recommendations.append({
                "priority": "high",
                "category": "budget_warning",
                "text": f"You've spent {spend_ratio*100:.0f}% of your budget. Be cautious with remaining spending.",
                "action": "Review and defer non-essential purchases"
            })
        elif spend_ratio < 0.5:
            recommendations.append({
                "priority": "low",
                "category": "savings_goal",
                "text": f"You're only halfway through your budget. Consider increasing savings goals.",
                "action": "Set aside extra funds for savings or future goals"
            })
    
    # 5. Variability recommendations
    high_var_categories = [c for c in categories if c["variability"] == "High"]
    if high_var_categories:
        recommendations.append({
            "priority": "medium",
            "category": "spending_consistency",
            "text": f"Your {high_var_categories[0]['name']} spending varies significantly. Setting limits would help.",
            "action": "Create a detailed budget for variable categories"
        })
    
    # 6. Frequency-based recommendations
    frequent_cats = [c for c in categories if c["count"] > 10]
    if frequent_cats:
        recommendations.append({
            "priority": "medium",
            "category": "frequent_spending",
            "text": f"Frequent small expenses in {frequent_cats[0]['name']} add up. Consolidate purchases to save.",
            "action": "Plan larger, less frequent purchases instead"
        })
    
    # Sort by priority
    priority_order = {"high": 0, "medium": 1, "low": 2}
    recommendations.sort(key=lambda x: priority_order.get(x["priority"], 3))
    
    # Ensure at least some recommendations
    if not recommendations:
        recommendations = [
            {
                "priority": "low",
                "category": "maintenance",
                "text": "Your spending pattern is balanced. Keep tracking consistently.",
                "action": "Maintain current budgeting practices"
            }
        ]
    
    return {
        "recommendations": recommendations[:6],  # Top 6 recommendations
        "totalCount": len(recommendations),
        "actionItems": [r["action"] for r in recommendations[:3]]
    }
