from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from analysis import analyze_expenses
from anomaly import detect_unusual_transactions
from prediction import predict_month_end
from scoring import calculate_financial_score, calculate_budget_risk_level, get_financial_health_summary
from insights import categorize_spending, get_personalized_recommendations
from advanced_insights import (
    detect_spending_patterns,
    calculate_spending_trends,
    generate_budget_recommendations,
    calculate_financial_health_score,
    get_smart_recommendations
)

app = FastAPI(
    title="BudgetMind AI Service",
    description="AI and ML microservice for expense analysis, predictions, and recommendations",
    version="1.0.0"
)


class Expense(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None
    date: Optional[str] = None
    merchant: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    expenses: list[Expense] = []
    recentTransactions: Optional[list] = None


class PredictionRequest(BaseModel):
    expenses: list[Expense]
    budgetLimit: Optional[float] = 70000
    daysInMonth: Optional[int] = 30


class AdvancedInsightsRequest(BaseModel):
    expenses: list[Expense]
    income: Optional[float] = 0
    budget: Optional[float] = 70000
    goalsProgress: Optional[float] = 0


@app.get("/health")
def health():
    """Health check endpoint for deployment monitoring."""
    return {
        "status": "ok",
        "service": "budgetmind-ai",
        "version": "1.0.0"
    }


@app.post("/analyze")
def analyze(expenses: list[Expense]):
    """Analyze expenses with statistical insights and recommendations."""
    try:
        if not expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in expenses]
        
        # Get detailed analysis
        analysis_result = analyze_expenses(payload)
        
        # Detect anomalies
        anomalies = detect_unusual_transactions(payload)
        
        # Clean anomaly objects to be JSON serializable
        cleaned_anomalies = []
        for anomaly in anomalies:
            cleaned_anomalies.append({
                "expense": anomaly.get("expense", {}),
                "anomalyType": anomaly.get("anomalyType", ""),
                "reason": anomaly.get("reason", ""),
                "severityScore": anomaly.get("severityScore", 0)
            })
        
        return {
            **analysis_result,
            "unusualTransactions": cleaned_anomalies,
            "anomalyCount": len(cleaned_anomalies)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict")
def predict(request: PredictionRequest):
    """Predict month-end spending and budget risk."""
    try:
        if not request.expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in request.expenses]
        
        return predict_month_end(
            payload,
            budget_limit=request.budgetLimit,
            days_in_month=request.daysInMonth
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
def chat(payload: ChatRequest):
    """Generate personalized financial coaching responses."""
    try:
        message = payload.message.lower().strip()
        expenses = payload.expenses
        
        if not message:
            return {
                "reply": "Hello! I'm BudgetMind AI. Ask me about your spending, budgets, savings opportunities, or financial health.",
                "intent": "greeting",
                "suggestedActions": ["Show my spending", "Budget advice", "Savings tips", "Financial health"]
            }
        
        # Analyze current expenses
        if expenses:
            analysis = analyze_expenses([e.model_dump() for e in expenses])
        else:
            analysis = None
        
        # Intent detection and response generation
        if any(word in message for word in ["reduce", "cut", "save", "lower", "save money"]):
            if analysis and analysis.get("savingsPotential", 0) > 0:
                top_cat = analysis["topCategory"]
                savings = analysis["savingsPotential"]
                recommendations = analysis.get("recommendations", ["Track your spending carefully."])
                return {
                    "reply": f"💡 To save ₹{savings} monthly, focus on reducing {top_cat} expenses. {recommendations[0]}",
                    "intent": "savings_advice",
                    "suggestedActions": ["Review subscriptions", "Category limits", "Savings goal"]
                }
            return {
                "reply": "💡 Start by tracking your spending by category. The 50-30-20 rule works well: 50% needs, 30% wants, 20% savings.",
                "intent": "savings_advice",
                "suggestedActions": ["View categories", "Set alert threshold"]
            }
        
        elif any(word in message for word in ["budget", "limit", "plan", "allocation"]):
            if analysis and "statistics" in analysis:
                total = analysis["statistics"].get("totalSpent", 0)
                return {
                    "reply": f"📊 Your recent spending is ₹{total}. For effective budgeting, set limits at 80% of your average monthly spend. {analysis.get('recommendations', [''])[0]}",
                    "intent": "budget_coaching",
                    "suggestedActions": ["Set monthly budget", "View budget usage"]
                }
            return {
                "reply": "📊 Good budgeting uses the 50-30-20 rule: 50% to essentials, 30% to discretionary, 20% to savings. Adjust based on your income.",
                "intent": "budget_coaching",
                "suggestedActions": ["Create budget", "Budget templates"]
            }
        
        elif any(word in message for word in ["spend", "spending", "expense", "how much", "total spent"]):
            if analysis and "statistics" in analysis:
                total = analysis["statistics"].get("totalSpent", 0)
                num_expenses = analysis["statistics"].get("totalExpenses", 0)
                avg = analysis["statistics"].get("averageExpense", 0)
                top_cat = analysis.get("topCategory", "")
                return {
                    "reply": f"📈 You've spent ₹{total} in {num_expenses} transactions (avg: ₹{avg}). Top category: {top_cat}. Keep tracking to identify patterns!",
                    "intent": "spending_summary",
                    "suggestedActions": ["View all expenses", "Export report"]
                }
            return {
                "reply": "📊 I don't have spending data yet. Add some expenses to get detailed insights and recommendations.",
                "intent": "no_data",
                "suggestedActions": ["Add expense", "Demo data"]
            }
        
        elif any(word in message for word in ["anomaly", "unusual", "strange", "spike", "suspicious"]):
            if expenses:
                anomalies_data = detect_unusual_transactions([e.model_dump() for e in expenses])
                if anomalies_data:
                    anomaly_text = f"⚠️ Found {len(anomalies_data)} unusual transactions. Review high expenses carefully—they might indicate unusual activity."
                    return {
                        "reply": anomaly_text,
                        "intent": "anomaly_detection",
                        "anomalyCount": len(anomalies_data),
                        "suggestedActions": ["Review anomalies", "Set alert threshold"]
                    }
            return {
                "reply": "✅ No unusual spending patterns detected. Your expenses look consistent.",
                "intent": "anomaly_detection",
                "anomalyCount": 0
            }
        
        elif any(word in message for word in ["goal", "target", "save for", "objective"]):
            return {
                "reply": "🎯 Set specific savings goals with amounts and deadlines. I'll track your progress and suggest ways to reach them faster. Start with realistic targets!",
                "intent": "goal_setting",
                "suggestedActions": ["Create goal", "Vacation fund", "Emergency fund"]
            }
        
        elif any(word in message for word in ["health", "score", "risk", "financial", "stability"]):
            if analysis and "statistics" in analysis:
                categories = [c['category'] for c in analysis.get('categoryBreakdown', [])[:3]]
                cat_list = ', '.join(categories) if categories else "various"
                return {
                    "reply": f"💪 Your financial profile is stable. Focus on: {cat_list}. Maintain consistent spending patterns and you'll improve your financial score.",
                    "intent": "financial_health",
                    "suggestedActions": ["View score", "Improve health"]
                }
            return {
                "reply": "💪 Financial health is built on consistent spending tracking, budget adherence, and savings. Keep building good habits!",
                "intent": "financial_health"
            }
        
        elif any(word in message for word in ["category", "categories", "breakdown", "by category"]):
            if analysis and "categoryBreakdown" in analysis:
                categories = analysis["categoryBreakdown"][:5]
                cat_text = ", ".join([f"{c['category']}: ₹{c['amount']}" for c in categories])
                return {
                    "reply": f"📋 Spending by category: {cat_text}. These top categories offer the biggest savings opportunities.",
                    "intent": "category_analysis",
                    "suggestedActions": ["View chart", "Set alerts"]
                }
            return {
                "reply": "📋 Categorizing your expenses helps identify where to cut. Track food, transport, entertainment separately.",
                "intent": "category_analysis"
            }
        
        elif any(word in message for word in ["tip", "advice", "recommendation", "help me"]):
            if analysis and analysis.get("recommendations"):
                tips = analysis["recommendations"][:2]
                tips_text = " ".join(tips)
                return {
                    "reply": f"💡 My recommendations: {tips_text}",
                    "intent": "personalized_advice",
                    "suggestedActions": ["More tips", "Apply suggestion"]
                }
            return {
                "reply": "💡 Here are general tips: Track daily, review weekly, budget monthly. Set alerts for categories, automate savings, reduce subscriptions.",
                "intent": "personalized_advice",
                "suggestedActions": ["Subscription audit", "Reduce waste"]
            }
        
        elif any(word in message for word in ["insight", "predict", "future", "next month"]):
            if analysis and analysis.get("prediction"):
                pred = analysis["prediction"]
                return {
                    "reply": f"🔮 Based on your pattern, you'll spend around ₹{pred} next month. Plan accordingly and adjust if needed.",
                    "intent": "prediction",
                    "suggestedActions": ["See full prediction"]
                }
            return {
                "reply": "🔮 I can predict your spending once you add more expenses. The more data, the better my predictions!",
                "intent": "prediction"
            }
        
        elif any(word in message for word in ["card", "payment", "method", "credit", "debit"]):
            return {
                "reply": "💳 Use different payment methods for tracking: cards for big purchases, cash for daily expenses, UPI for quick payments. This helps categorization.",
                "intent": "payment_advice",
                "suggestedActions": ["Link card", "Payment history"]
            }
        
        elif any(word in message for word in ["hello", "hi", "hey", "thanks", "help"]):
            return {
                "reply": "👋 Hi there! I'm BudgetMind AI. I can help you understand your spending, plan budgets, find savings, and reach financial goals. What would you like to know?",
                "intent": "greeting",
                "suggestedActions": ["Show spending", "Budget tips", "Savings goals"]
            }
        
        else:
            # Default helpful response with suggestions
            return {
                "reply": "I can help with spending analysis, budget planning, savings tips, financial goals, and more. Try asking about your money!",
                "intent": "general_help",
                "suggestedActions": ["Show spending", "Budget advice", "Savings tips", "My score"]
            }
    
    except Exception as e:
        return {
            "reply": f"I encountered an error processing your request: {str(e)}. Please try again.",
            "intent": "error",
            "error": str(e)
        }


@app.get("/recommendations")
def get_recommendations(expenses: Optional[list[dict]] = None):
    """Get personalized financial recommendations."""
    try:
        if not expenses:
            expenses = []
        
        analysis = analyze_expenses(expenses) if expenses else None
        
        recommendations = []
        
        if analysis and analysis["recommendations"]:
            recommendations = analysis["recommendations"]
        else:
            recommendations = [
                "Start tracking your daily expenses to identify spending patterns.",
                "Set up budget categories that match your lifestyle.",
                "Review and cancel unused subscriptions.",
                "Build an emergency fund with 3-6 months of expenses.",
                "Automate transfers to savings after each payday."
            ]
        
        return {
            "recommendations": recommendations,
            "source": "budgetmind-ai-v1.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/score")
def score_financial_health(expenses: list[Expense], budget_limit: float = 70000):
    """Calculate comprehensive financial health score."""
    try:
        if not expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in expenses]
        
        score_result = calculate_financial_score(payload, budget_limit)
        
        return score_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/risk")
def assess_budget_risk(spent: float, budget_limit: float = 70000):
    """Assess budget risk level."""
    try:
        risk_result = calculate_budget_risk_level(spent, budget_limit)
        
        return risk_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summary")
def get_health_summary(
    expenses: list[Expense],
    budget_limit: float = 70000,
    projected_month_end: float = 0
):
    """Get comprehensive financial health summary."""
    try:
        if not expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in expenses]
        
        # Create analysis-like structure
        analysis_data = {
            "expenses": payload,
            "budgetLimit": budget_limit
        }
        
        # Create prediction-like structure
        prediction_data = {
            "spentSoFar": sum(e.get("amount", 0) for e in payload),
            "projectedMonthEnd": projected_month_end or sum(e.get("amount", 0) for e in payload),
            "budgetLimit": budget_limit,
            "trend": "stable",
            "trendPercentage": 0
        }
        
        summary = get_financial_health_summary(analysis_data, prediction_data)
        
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/insights")
def get_spending_insights(expenses: list[Expense]):
    """Analyze spending patterns and generate insights."""
    try:
        if not expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in expenses]
        
        insights_result = categorize_spending(payload)
        
        return insights_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/personalized-recommendations")
def get_personalized_advice(
    expenses: list[Expense],
    budget_limit: float = 70000
):
    """Get personalized, context-aware recommendations."""
    try:
        if not expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in expenses]
        
        recommendations_result = get_personalized_recommendations(
            payload,
            budget_limit=budget_limit
        )
        
        return recommendations_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/advanced-insights")
def advanced_insights(request: AdvancedInsightsRequest):
    """Generate advanced ML insights including patterns, trends, and recommendations."""
    try:
        if not request.expenses:
            raise HTTPException(status_code=400, detail="Expenses list cannot be empty")
        
        payload = [expense.model_dump() for expense in request.expenses]
        
        # Detect spending patterns
        patterns = detect_spending_patterns(payload)
        
        # Calculate trends
        trends = calculate_spending_trends(payload)
        
        # Generate budget recommendations
        budget_recs = generate_budget_recommendations(payload, request.income, request.budget)
        
        # Calculate financial health score
        health_score = calculate_financial_health_score(
            payload,
            request.income,
            request.budget,
            request.goalsProgress
        )
        
        # Get smart recommendations
        smart_recs = get_smart_recommendations(payload, request.income, request.budget)
        
        return {
            "patterns": patterns,
            "trends": trends,
            "budgetRecommendations": budget_recs,
            "healthScore": health_score,
            "smartRecommendations": smart_recs,
            "timestamp": "now"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
