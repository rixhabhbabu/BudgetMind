"""
Financial health scoring system for BudgetMind.
Provides comprehensive financial wellness metrics.
"""

import numpy as np


def calculate_financial_score(expenses, budget_limit=70000, goals_progress=None):
    """
    Calculate comprehensive financial health score (0-100).
    
    Args:
        expenses: List of expense dictionaries
        budget_limit: Monthly budget limit
        goals_progress: Optional list of goal progress percentages
    
    Returns:
        dict with score and component breakdowns
    """
    if not expenses:
        return {
            "overallScore": 0,
            "components": {
                "budgetAdherence": 0,
                "spendingConsistency": 0,
                "savingsRate": 0,
                "anomalyScore": 0,
            },
            "rating": "poor",
            "recommendations": ["Start tracking your expenses to build financial health."]
        }
    
    amounts = [e.get("amount", 0) for e in expenses if e.get("amount", 0) > 0]
    total_spent = sum(amounts)
    
    # Component 1: Budget Adherence (0-25 points)
    budget_adherence_score = 0
    if budget_limit > 0:
        spend_ratio = total_spent / budget_limit
        if spend_ratio <= 0.75:
            budget_adherence_score = 25
        elif spend_ratio <= 0.90:
            budget_adherence_score = 20
        elif spend_ratio <= 1.0:
            budget_adherence_score = 10
        else:
            budget_adherence_score = max(0, 5 - (spend_ratio - 1.0) * 5)
    
    # Component 2: Spending Consistency (0-25 points)
    spending_consistency_score = 0
    if len(amounts) > 1:
        std_dev = np.std(amounts)
        mean_amount = np.mean(amounts)
        if mean_amount > 0:
            coefficient_of_variation = std_dev / mean_amount
            # Lower variation = better consistency
            if coefficient_of_variation < 0.5:
                spending_consistency_score = 25
            elif coefficient_of_variation < 1.0:
                spending_consistency_score = 20
            elif coefficient_of_variation < 1.5:
                spending_consistency_score = 15
            else:
                spending_consistency_score = max(5, 25 - coefficient_of_variation * 10)
    else:
        spending_consistency_score = 10  # Limited data
    
    # Component 3: Savings Rate Indicator (0-25 points)
    savings_rate_score = 0
    # Assuming average income of 80,000
    assumed_income = 80000
    if total_spent > 0:
        savings_rate = 1 - (total_spent / assumed_income)
        if savings_rate >= 0.25:  # Save at least 25%
            savings_rate_score = 25
        elif savings_rate >= 0.20:
            savings_rate_score = 20
        elif savings_rate >= 0.15:
            savings_rate_score = 15
        elif savings_rate >= 0.10:
            savings_rate_score = 10
        else:
            savings_rate_score = max(0, savings_rate * 50)
    
    # Component 4: Anomaly Management (0-25 points)
    anomaly_score = 25  # Start with full points
    if len(amounts) > 2:
        mean_amount = np.mean(amounts)
        std_dev = np.std(amounts)
        if std_dev > 0:
            # Count anomalies (transactions beyond 2 std deviations)
            anomalies = sum(1 for a in amounts if abs(a - mean_amount) > 2 * std_dev)
            anomaly_ratio = anomalies / len(amounts)
            # Penalize for anomalies
            anomaly_score = max(5, 25 - anomaly_ratio * 50)
    
    # Calculate overall score
    overall_score = round(
        budget_adherence_score + 
        spending_consistency_score + 
        savings_rate_score + 
        anomaly_score
    , 1)
    
    # Determine rating
    if overall_score >= 85:
        rating = "excellent"
    elif overall_score >= 70:
        rating = "good"
    elif overall_score >= 50:
        rating = "fair"
    elif overall_score >= 25:
        rating = "poor"
    else:
        rating = "critical"
    
    # Generate recommendations
    recommendations = []
    
    if budget_adherence_score < 20:
        recommendations.append("Focus on staying within your budget. Review high-spending categories.")
    
    if spending_consistency_score < 15:
        recommendations.append("Your spending varies significantly. Try to create a more predictable pattern.")
    
    if savings_rate_score < 15:
        recommendations.append("Increase your savings rate to 15-20% of income. Reduce discretionary spending.")
    
    if anomaly_score < 20:
        recommendations.append("You have unusual spending spikes. Investigate and avoid unnecessary large expenses.")
    
    if not recommendations:
        recommendations = [
            "Maintain your current spending habits.",
            "Consider increasing your savings goals.",
            "Review quarterly to track progress."
        ]
    
    return {
        "overallScore": overall_score,
        "rating": rating,
        "components": {
            "budgetAdherence": round(budget_adherence_score, 1),
            "spendingConsistency": round(spending_consistency_score, 1),
            "savingsRate": round(savings_rate_score, 1),
            "anomalyScore": round(anomaly_score, 1),
        },
        "recommendations": recommendations,
        "details": {
            "totalTransactions": len(amounts),
            "totalSpent": round(total_spent, 2),
            "averageTransaction": round(total_spent / len(amounts), 2) if amounts else 0,
        }
    }


def calculate_budget_risk_level(spent, budget_limit):
    """
    Determine budget risk level and recovery recommendations.
    
    Returns:
        dict with risk level and actionable recommendations
    """
    if budget_limit <= 0:
        return {
            "riskLevel": "unknown",
            "percentage": 0,
            "status": "no_budget_set",
            "recommendations": ["Set a monthly budget to track financial health."]
        }
    
    percentage = (spent / budget_limit) * 100
    
    if percentage <= 50:
        risk_level = "low"
        color = "emerald"
        recommendations = [
            "Excellent! You're well within budget.",
            "Consider increasing your savings goals.",
            "Build emergency fund to 6 months of expenses."
        ]
    elif percentage <= 75:
        risk_level = "moderate"
        color = "yellow"
        recommendations = [
            "You're on track with your budget.",
            "Monitor spending closely for remainder of month.",
            "Review discretionary spending."
        ]
    elif percentage <= 90:
        risk_level = "high"
        color = "orange"
        recommendations = [
            "Budget is 90% spent. Reduce spending immediately.",
            "Focus on essential expenses only.",
            "Defer non-critical purchases to next month."
        ]
    else:
        risk_level = "critical"
        color = "red"
        recommendations = [
            "Budget exceeded! Take immediate action.",
            "Stop discretionary spending.",
            "Plan to recover balance next month.",
            "Review expense categories for cuts."
        ]
    
    return {
        "riskLevel": risk_level,
        "percentage": round(percentage, 1),
        "color": color,
        "spent": round(spent, 2),
        "limit": budget_limit,
        "remaining": round(budget_limit - spent, 2),
        "recommendations": recommendations
    }


def get_financial_health_summary(analysis_data, prediction_data):
    """
    Generate comprehensive financial health summary.
    
    Combines analysis and prediction into actionable summary.
    """
    if not analysis_data or not prediction_data:
        return {
            "summary": "Not enough data for comprehensive analysis.",
            "healthScore": 0,
            "keyMetrics": [],
            "actionItems": []
        }
    
    health_score = calculate_financial_score(
        analysis_data.get("expenses", []),
        analysis_data.get("budgetLimit", 70000)
    )
    
    risk_assessment = calculate_budget_risk_level(
        prediction_data.get("spentSoFar", 0),
        prediction_data.get("budgetLimit", 70000)
    )
    
    # Key metrics to display
    key_metrics = [
        {
            "label": "Financial Health Score",
            "value": f"{health_score['overallScore']}/100",
            "rating": health_score['rating']
        },
        {
            "label": "Budget Status",
            "value": f"{risk_assessment['percentage']}% spent",
            "status": risk_assessment['riskLevel']
        },
        {
            "label": "Month-End Projection",
            "value": f"₹{prediction_data.get('projectedMonthEnd', 0):,.0f}",
            "trend": prediction_data.get('trend', 'stable')
        },
        {
            "label": "Spending Trend",
            "value": prediction_data.get('trendPercentage', 0),
            "direction": prediction_data.get('trend', 'stable')
        }
    ]
    
    # Action items
    action_items = health_score['recommendations'][:3] + risk_assessment['recommendations'][:2]
    
    return {
        "summary": f"Financial Health: {health_score['rating'].upper()}. {action_items[0] if action_items else 'Track your spending regularly.'}",
        "healthScore": health_score['overallScore'],
        "riskLevel": risk_assessment['riskLevel'],
        "keyMetrics": key_metrics,
        "actionItems": action_items,
        "details": {
            "scoreComponents": health_score['components'],
            "riskDetails": risk_assessment
        }
    }
