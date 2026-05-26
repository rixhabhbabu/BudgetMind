import { env } from "../config/env.js";
import { AIReport } from "../models/AIReport.js";
import { Expense } from "../models/Expense.js";

/**
 * Call the FastAPI AI service
 */
async function callAIService(endpoint, data) {
  try {
    const response = await fetch(`${env.aiServiceUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`AI Service error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("AI Service call failed:", error.message);
    throw error;
  }
}

/**
 * Get AI recommendations based on user spending
 */
export async function getRecommendations(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(100);

    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      description: e.description,
      date: e.spentAt,
    }));

    // Call AI service
    const aiResponse = await fetch(`${env.aiServiceUrl}/recommendations`, {
      method: "GET",
    });

    if (!aiResponse.ok) {
      throw new Error("Failed to get AI recommendations");
    }

    const recommendations = await aiResponse.json();

    res.json({
      recommendations: recommendations.recommendations,
      source: "budgetmind-ai",
      expenseCount: expenses.length,
    });
  } catch (error) {
    // Fallback recommendations
    res.json({
      recommendations: [
        "Start tracking your daily expenses to identify spending patterns.",
        "Set up budget categories that match your lifestyle.",
        "Review and cancel unused subscriptions.",
        "Build an emergency fund with 3-6 months of expenses.",
        "Automate transfers to savings after each payday.",
      ],
      source: "fallback",
      error: error.message,
    });
  }
}

/**
 * Analyze user spending with AI
 */
export async function analyzeSpending(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(200);

    if (expenses.length === 0) {
      return res.json({
        message: "No expenses found. Start adding expenses to get AI insights.",
        analysis: null,
      });
    }

    // Format expenses for AI service
    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      description: e.description,
      date: e.spentAt,
    }));

    // Call AI service
    const aiAnalysis = await callAIService("/analyze", expenseData);

    // Save analysis report
    const report = await AIReport.create({
      userId: req.user.id,
      topSpendingCategory: aiAnalysis.topCategory,
      savingsPotential: aiAnalysis.savingsPotential,
      recommendations: aiAnalysis.recommendations,
      prediction: {
        spentSoFar: aiAnalysis.statistics?.totalSpent || 0,
      },
      analysis: aiAnalysis,
    });

    res.json({
      report,
      analysis: aiAnalysis,
      expenseCount: expenses.length,
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Predict spending patterns
 */
export async function predictSpending(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(200);

    if (expenses.length === 0) {
      return res.json({
        message: "Not enough data for predictions. Add more expenses.",
        prediction: null,
      });
    }

    // Format expenses
    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
    }));

    // Get budget limit from user profile or query
    const budgetLimit = parseFloat(req.query.budget) || 70000;

    // Call AI service
    const prediction = await callAIService("/predict", {
      expenses: expenseData,
      budgetLimit,
    });

    // Save prediction
    const report = await AIReport.create({
      userId: req.user.id,
      prediction,
      topSpendingCategory: "Multiple",
      recommendations: [
        `Based on your spending trend (${prediction.trend}), ${
          prediction.budgetStatus === "on_track"
            ? "you're on track for your budget."
            : `your budget is at ${prediction.budgetStatus}. Consider reducing expenses.`
        }`,
        `Projected month-end spend: ₹${prediction.projectedMonthEnd}`,
        `Next month forecast: ₹${prediction.nextMonthForecast}`,
      ],
    });

    res.json({
      prediction,
      report,
      confidence: prediction.confidence,
      model: prediction.model,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get financial health score
 */
export async function getHealthScore(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(200);

    if (expenses.length === 0) {
      return res.json({
        message: "No expenses found. Score will improve with more data.",
        score: null,
      });
    }

    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
    }));

    const budgetLimit = parseFloat(req.query.budget) || 70000;

    // Call AI service
    const scoreResult = await callAIService("/score", {
      expenses: expenseData,
      budget_limit: budgetLimit,
    });

    res.json({
      score: scoreResult,
      expenseCount: expenses.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get personalized recommendations
 */
export async function getPersonalizedRecommendations(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(200);

    if (expenses.length === 0) {
      return res.json({
        message: "No expenses found. Start tracking to get recommendations.",
        recommendations: null,
      });
    }

    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      description: e.description,
    }));

    const budgetLimit = parseFloat(req.query.budget) || 70000;

    // Call AI service
    const recommendations = await callAIService("/personalized-recommendations", {
      expenses: expenseData,
      budget_limit: budgetLimit,
    });

    res.json({
      recommendations: recommendations.recommendations,
      actionItems: recommendations.actionItems,
      totalCount: recommendations.totalCount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get spending insights
 */
export async function getSpendingInsights(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(200);

    if (expenses.length === 0) {
      return res.json({
        message: "No expenses found.",
        insights: null,
      });
    }

    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      description: e.description,
    }));

    // Call AI service
    const insights = await callAIService("/insights", expenseData);

    res.json({
      insights: insights,
      expenseCount: expenses.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Chat with AI assistant
 */
export async function chatWithAssistant(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Get recent expenses for context
    const expenses = await Expense.find({ userId: req.user.id })
      .sort({ spentAt: -1 })
      .limit(50);

    const expenseData = expenses.map((e) => ({
      category: e.category,
      amount: e.amount,
      description: e.description,
    }));

    // Call AI service
    const response = await callAIService("/chat", {
      message,
      expenses: expenseData,
    });

    res.json({
      reply: response.reply,
      intent: response.intent,
      suggestedActions: response.suggestedActions || [],
      source: "budgetmind-ai",
    });
  } catch (error) {
    // Fallback response
    res.json({
      reply:
        "I'm having trouble understanding your request. Please try again or rephrase your question.",
      intent: "error",
      source: "fallback",
      error: error.message,
    });
  }
}
