"""Advanced ML insights for spending patterns, trends, and recommendations."""

import numpy as np
from datetime import datetime, timedelta
from collections import Counter


def detect_spending_patterns(expenses):
    """Detect recurring spending patterns and habits."""
    if not expenses or len(expenses) < 5:
        return {
            "hasRecurringExpenses": False,
            "recurringExpenses": [],
            "recurringFrequency": [],
            "monthlyRecurringAmount": 0
        }
    
    # Group by category and merchant
    category_amounts = {}
    merchant_amounts = {}
    
    for exp in expenses:
        category = exp.get("category", "Other")
        merchant = exp.get("merchant", "Unknown")
        amount = exp.get("amount", 0)
        
        # Track categories
        if category not in category_amounts:
            category_amounts[category] = []
        category_amounts[category].append(amount)
        
        # Track merchants
        if merchant not in merchant_amounts:
            merchant_amounts[merchant] = []
        merchant_amounts[merchant].append(amount)
    
    # Find recurring patterns
    recurring = []
    monthly_recurring = 0
    
    for merchant, amounts in merchant_amounts.items():
        if len(amounts) >= 2:
            # Check if amounts are similar (variance < 20%)
            mean_amount = np.mean(amounts)
            std_dev = np.std(amounts)
            
            if std_dev < mean_amount * 0.2:  # Low variance = recurring
                frequency = len(amounts)
                recurring.append({
                    "merchant": merchant,
                    "amount": round(mean_amount, 2),
                    "frequency": frequency,
                    "category": expenses[[e.get("merchant") for e in expenses].index(merchant) if merchant in [e.get("merchant") for e in expenses] else 0].get("category", "Other"),
                    "isSubscription": frequency >= 2 and std_dev < mean_amount * 0.1
                })
                
                # Estimate if monthly
                if frequency >= 2:
                    monthly_recurring += mean_amount
    
    return {
        "hasRecurringExpenses": len(recurring) > 0,
        "recurringExpenses": sorted(recurring, key=lambda x: x["amount"], reverse=True),
        "monthlyRecurringAmount": round(monthly_recurring, 2),
        "subscriptionCount": len([r for r in recurring if r.get("isSubscription", False)])
    }


def calculate_spending_trends(expenses):
    """Analyze spending trends (increasing, decreasing, stable)."""
    if not expenses or len(expenses) < 5:
        return {
            "trend": "insufficient_data",
            "trendPercentage": 0,
            "weeklyTrend": "stable",
            "categoryTrends": []
        }
    
    # Sort by date
    sorted_expenses = sorted(expenses, key=lambda x: x.get("date", ""), reverse=True)
    
    # Split into recent and older periods
    mid_point = len(sorted_expenses) // 2
    recent_expenses = sorted_expenses[:mid_point]
    older_expenses = sorted_expenses[mid_point:]
    
    recent_total = sum(e.get("amount", 0) for e in recent_expenses)
    older_total = sum(e.get("amount", 0) for e in older_expenses)
    
    # Calculate trend percentage
    if older_total > 0:
        trend_percentage = ((recent_total - older_total) / older_total) * 100
    else:
        trend_percentage = 0
    
    # Determine trend direction
    if trend_percentage > 10:
        trend = "increasing"
    elif trend_percentage < -10:
        trend = "decreasing"
    else:
        trend = "stable"
    
    # Category-wise trends
    recent_categories = {}
    older_categories = {}
    
    for exp in recent_expenses:
        cat = exp.get("category", "Other")
        recent_categories[cat] = recent_categories.get(cat, 0) + exp.get("amount", 0)
    
    for exp in older_expenses:
        cat = exp.get("category", "Other")
        older_categories[cat] = older_categories.get(cat, 0) + exp.get("amount", 0)
    
    category_trends = []
    for category in set(list(recent_categories.keys()) + list(older_categories.keys())):
        recent_amt = recent_categories.get(category, 0)
        older_amt = older_categories.get(category, 0)
        
        if older_amt > 0:
            cat_trend_pct = ((recent_amt - older_amt) / older_amt) * 100
        else:
            cat_trend_pct = 0
        
        if cat_trend_pct > 15:
            cat_trend = "↑ increasing"
        elif cat_trend_pct < -15:
            cat_trend = "↓ decreasing"
        else:
            cat_trend = "→ stable"
        
        category_trends.append({
            "category": category,
            "trend": cat_trend,
            "percentage": round(cat_trend_pct, 1),
            "recent": round(recent_amt, 2),
            "previous": round(older_amt, 2)
        })
    
    return {
        "trend": trend,
        "trendPercentage": round(trend_percentage, 1),
        "recentSpending": round(recent_total, 2),
        "previousSpending": round(older_total, 2),
        "categoryTrends": sorted(category_trends, key=lambda x: abs(x["percentage"]), reverse=True)
    }


def generate_budget_recommendations(expenses, income, current_budget):
    """Generate personalized budget recommendations."""
    if not expenses:
        return {
            "recommendations": [],
            "recommendedBudget": current_budget,
            "savingsPotential": 0,
            "budgetBreakdown": {}
        }
    
    total_spent = sum(e.get("amount", 0) for e in expenses)
    num_expenses = len(expenses)
    
    # Calculate category-wise statistics
    categories = {}
    for exp in expenses:
        cat = exp.get("category", "Other")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(exp.get("amount", 0))
    
    recommendations = []
    
    # Find problematic categories
    for category, amounts in categories.items():
        cat_total = sum(amounts)
        cat_percentage = (cat_total / total_spent) * 100 if total_spent > 0 else 0
        cat_avg = np.mean(amounts)
        cat_std = np.std(amounts) if len(amounts) > 1 else 0
        
        if cat_percentage > 40:
            recommendations.append({
                "category": category,
                "issue": f"{category} accounts for {cat_percentage:.1f}% of spending",
                "action": f"Try to reduce to 30% (save ₹{(cat_total * 0.25):.0f})",
                "priority": "high"
            })
        elif cat_std > cat_avg * 0.5:
            recommendations.append({
                "category": category,
                "issue": f"{category} spending is highly variable (±{(cat_std/cat_avg)*100:.0f}%)",
                "action": "Set strict category budget or use envelope method",
                "priority": "medium"
            })
    
    # Calculate recommended budget
    daily_average = total_spent / num_expenses if num_expenses > 0 else 0
    recommended_monthly = daily_average * 30
    recommended_savings = max(0, income - recommended_monthly) if income > 0 else 0
    
    # Calculate savings potential
    # Target: 50% needs, 30% wants, 20% savings
    needs_target = income * 0.5 if income > 0 else 0
    wants_target = income * 0.3 if income > 0 else 0
    savings_target = income * 0.2 if income > 0 else 0
    
    current_needs = 0
    for exp in expenses:
        # Simple categorization
        if exp.get("category") in ["Food & Dining", "Utilities", "Transport"]:
            current_needs += exp.get("amount", 0)
    
    savings_potential = max(0, total_spent - (current_budget * 0.85)) if current_budget > 0 else 0
    
    return {
        "recommendations": recommendations,
        "recommendedBudget": round(recommended_monthly, 2),
        "recommendedSavingsRate": round((recommended_savings / income * 100), 1) if income > 0 else 0,
        "savingsPotential": round(savings_potential, 2),
        "targetBreakdown": {
            "needs50percent": round(needs_target, 2),
            "wants30percent": round(wants_target, 2),
            "savings20percent": round(savings_target, 2)
        }
    }


def calculate_financial_health_score(expenses, income, budget, goals_progress):
    """Calculate comprehensive financial health score (0-1000)."""
    score = 600  # Base score
    
    if not expenses:
        return score
    
    total_spent = sum(e.get("amount", 0) for e in expenses)
    num_expenses = len(expenses)
    
    # Spending consistency (±10% = good)
    if num_expenses >= 5:
        daily_amounts = [e.get("amount", 0) for e in expenses]
        std_dev = np.std(daily_amounts)
        mean_amount = np.mean(daily_amounts)
        consistency = (1 - min(1, std_dev / mean_amount if mean_amount > 0 else 0)) * 100
        score += int(consistency * 2)  # +0 to +200
    
    # Budget adherence
    if budget > 0:
        budget_usage = (total_spent / budget) * 100
        if budget_usage <= 80:
            score += 150
        elif budget_usage <= 100:
            score += 100
        elif budget_usage <= 120:
            score += 50
        else:
            score -= 50
    
    # Savings rate
    if income > 0:
        savings_rate = ((income - total_spent) / income) * 100
        if savings_rate >= 20:
            score += 100
        elif savings_rate >= 10:
            score += 50
        elif savings_rate < 0:
            score -= 100
    
    # Goal progress
    if goals_progress:
        goal_score = int(goals_progress * 2)
        score += goal_score
    
    # Cap score between 0-1000
    score = max(0, min(1000, score))
    
    return round(score, 0)


def get_smart_recommendations(expenses, income, budget):
    """Generate smart, actionable recommendations."""
    if not expenses:
        return []
    
    recommendations = []
    patterns = detect_spending_patterns(expenses)
    trends = calculate_spending_trends(expenses)
    budget_recs = generate_budget_recommendations(expenses, income, budget)
    
    # Recommendation 1: Subscriptions
    if patterns.get("subscriptionCount", 0) > 0:
        monthly_subs = patterns.get("monthlyRecurringAmount", 0)
        recommendations.append({
            "title": f"Audit {patterns['subscriptionCount']} recurring subscriptions",
            "description": f"You have {patterns['subscriptionCount']} recurring charges costing ₹{monthly_subs}/month. Review and cancel unused ones.",
            "potential_savings": round(monthly_subs * 0.3, 0),
            "urgency": "medium"
        })
    
    # Recommendation 2: Spending trends
    if trends.get("trend") == "increasing":
        trend_pct = trends.get("trendPercentage", 0)
        recommendations.append({
            "title": f"Spending increasing by {trend_pct:.1f}%",
            "description": f"Your recent spending is {trend_pct:.1f}% higher than before. Create a budget to control this trend.",
            "potential_savings": 0,
            "urgency": "high"
        })
    
    # Recommendation 3: Top category
    if trends.get("categoryTrends"):
        top_cat = trends["categoryTrends"][0]
        if float(top_cat.get("percentage", 0)) > 20:
            recommendations.append({
                "title": f"Reduce {top_cat['category']} spending",
                "description": f"{top_cat['category']} is {top_cat['percentage']:.1f}% higher than average. Find ways to optimize.",
                "potential_savings": round(top_cat['recent'] * 0.15, 0),
                "urgency": "medium"
            })
    
    # Recommendation 4: Budget safety
    total_spent = sum(e.get("amount", 0) for e in expenses)
    if budget > 0 and total_spent > budget * 0.9:
        recommendations.append({
            "title": "Close to budget limit",
            "description": f"You're {((total_spent/budget)*100):.0f}% of your budget. Be careful with remaining spending.",
            "potential_savings": round(total_spent * 0.05, 0),
            "urgency": "high"
        })
    
    return recommendations
