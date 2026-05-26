# BudgetMind AI & ML Module Documentation

## Overview

The BudgetMind AI & ML system provides advanced financial analytics, predictions, and personalized recommendations to help users manage their finances intelligently.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                  │
│  - Insights Page with real-time AI data                     │
│  - Chatbot Component with conversational AI                 │
│  - Dashboard with AI-powered insights                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ /api/ai/*
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend (Express + Node.js)                    │
│  - AI Routes & Controllers                                  │
│  - Expense aggregation & formatting                         │
│  - AI Report storage in MongoDB                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ FastAPI calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         AI Service (FastAPI + Python)                       │
│  - analysis.py: Statistical expense analysis                │
│  - anomaly.py: Outlier & anomaly detection                 │
│  - prediction.py: ML-based spending forecasting            │
│  - scoring.py: Financial health scoring                    │
│  - insights.py: Pattern recognition & recommendations      │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Analysis Module (`analysis.py`)

Provides comprehensive expense analysis with statistical insights.

**Key Functions:**
- `analyze_expenses(expenses)` - Detailed spending breakdown with recommendations

**Output Example:**
```json
{
  "totals": {"Food": 5000, "Transport": 2000},
  "topCategory": "Food",
  "savingsPotential": 840,
  "recommendations": ["Review Food expenses...", "..."],
  "statistics": {
    "totalExpenses": 45,
    "totalSpent": 7000,
    "averageExpense": 155.56,
    "medianExpense": 120,
    "stdDeviation": 250
  },
  "categoryBreakdown": [...]
}
```

### 2. Anomaly Detection Module (`anomaly.py`)

Detects unusual spending patterns using statistical methods.

**Methods:**
- Z-score based detection (standard deviation)
- IQR (Interquartile Range) based detection
- Severity scoring (0-100)

**Use Cases:**
- Alert users to unusual transactions
- Fraud detection
- Spending spike identification

### 3. Prediction Module (`prediction.py`)

Forecasts spending patterns and budget risk.

**Key Functions:**
- `predict_month_end(expenses, budget_limit, days_in_month)`
- `calculate_trend(values)` - Trending direction and strength
- `calculate_budget_risk(spent, budget_limit)` - Risk assessment
- `estimate_monthly_run_rate(values, days_elapsed)` - Spending extrapolation

**Output Example:**
```json
{
  "spentSoFar": 25000,
  "projectedMonthEnd": 72500,
  "nextMonthForecast": 65000,
  "budgetRiskScore": 103.6,
  "confidence": 0.85,
  "trend": "increasing",
  "trendPercentage": 8.5,
  "budgetStatus": "at_risk"
}
```

### 4. Scoring Module (`scoring.py`)

Calculates comprehensive financial health metrics.

**Scoring Components (25 points each):**
1. **Budget Adherence** - How well user stays within budget
2. **Spending Consistency** - Predictability of spending patterns
3. **Savings Rate** - Percentage of income saved
4. **Anomaly Score** - Freedom from unusual transactions

**Ratings:**
- Excellent: 85-100
- Good: 70-84
- Fair: 50-69
- Poor: 25-49
- Critical: <25

### 5. Insights Module (`insights.py`)

Pattern recognition and intelligent recommendations.

**Features:**
- Category spending analysis
- Pattern detection (variability, concentration, frequency)
- Personalized recommendations by priority
- Actionable insights with specific amounts

## API Endpoints

### Analysis Endpoints

#### POST `/analyze`
Analyze expenses with statistical insights.

**Request:**
```json
{
  "expenses": [
    {"category": "Food", "amount": 500},
    {"category": "Transport", "amount": 200}
  ]
}
```

**Response:**
```json
{
  "totals": {...},
  "topCategory": "Food",
  "savingsPotential": 840,
  "recommendations": [...],
  "statistics": {...},
  "categoryBreakdown": [...],
  "unusualTransactions": [...],
  "anomalyCount": 2
}
```

#### POST `/predict`
Predict month-end spending.

**Request:**
```json
{
  "expenses": [...],
  "budgetLimit": 70000,
  "daysInMonth": 30
}
```

**Response:**
```json
{
  "spentSoFar": 25000,
  "projectedMonthEnd": 72500,
  "nextMonthForecast": 65000,
  "budgetRiskScore": 103.6,
  "confidence": 0.85,
  "trend": "increasing",
  "budgetStatus": "at_risk",
  "remainingBudget": -2500
}
```

#### POST `/score`
Calculate financial health score.

**Request:**
```json
{
  "expenses": [...],
  "budget_limit": 70000
}
```

**Response:**
```json
{
  "overallScore": 68.5,
  "rating": "fair",
  "components": {
    "budgetAdherence": 20,
    "spendingConsistency": 18,
    "savingsRate": 15,
    "anomalyScore": 15.5
  },
  "recommendations": [...]
}
```

#### POST `/chat`
Get AI assistant responses.

**Request:**
```json
{
  "message": "How can I save money?",
  "expenses": [...]
}
```

**Response:**
```json
{
  "reply": "To save ₹840 monthly, focus on reducing Food expenses...",
  "intent": "savings_advice",
  "suggestedActions": ["Review subscriptions", "Set category alerts"]
}
```

#### POST `/insights`
Analyze spending patterns.

**Request:**
```json
{
  "expenses": [...]
}
```

**Response:**
```json
{
  "categories": [...],
  "patterns": [...],
  "insights": ["Your spending is concentrated in...", ...]
}
```

#### POST `/personalized-recommendations`
Get context-aware recommendations.

**Request:**
```json
{
  "expenses": [...],
  "budget_limit": 70000
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "priority": "high",
      "category": "anomaly_management",
      "text": "Investigate unusual transactions...",
      "action": "Review anomalous spending"
    }
  ],
  "actionItems": ["...", "...", "..."]
}
```

## Backend Integration

### Express Routes
```javascript
GET  /api/ai/recommendations  - Get recommendations
GET  /api/ai/analyze          - Analyze spending
GET  /api/ai/predict          - Predict month-end
GET  /api/ai/score            - Get health score
GET  /api/ai/insights         - Get insights
GET  /api/ai/personalized-recommendations
POST /api/ai/chat             - Chat with AI
```

### Controller Functions

```javascript
// All require authentication
- getRecommendations()
- analyzeSpending()
- predictSpending()
- getHealthScore()
- getSpendingInsights()
- getPersonalizedRecommendations()
- chatWithAssistant()
```

## Frontend Integration

### Insights Page
- Real-time AI analysis
- Spending predictions
- Chatbot integration
- Loading states & error handling

### Chatbot Component
- Real-time chat interface
- Suggested actions
- Auto-scrolling
- Loading indicators
- Error recovery

## Data Flow Example

```
User adds expense
        ↓
Expense saved to MongoDB
        ↓
User navigates to Insights
        ↓
Frontend calls GET /api/ai/analyze
        ↓
Backend fetches user expenses
        ↓
Backend calls FastAPI /analyze
        ↓
AI Service processes data
        ↓
Frontend displays results
```

## Sample Data

### Typical Expense Input
```json
[
  {"category": "Food", "amount": 500, "date": "2024-05-01"},
  {"category": "Transport", "amount": 150, "date": "2024-05-01"},
  {"category": "Food", "amount": 450, "date": "2024-05-02"},
  {"category": "Entertainment", "amount": 800, "date": "2024-05-03"},
  {"category": "Food", "amount": 480, "date": "2024-05-04"}
]
```

### AI Output Structure
```json
{
  "analysis": {
    "statistics": {...},
    "recommendations": [...],
    "categoryBreakdown": [...]
  },
  "prediction": {
    "trend": "increasing",
    "budgetStatus": "caution"
  },
  "score": {
    "overallScore": 68.5,
    "rating": "fair"
  },
  "insights": {
    "patterns": [...],
    "insights": [...]
  }
}
```

## Performance Metrics

### Response Times (Typical)
- Analyze: 200-300ms
- Predict: 150-250ms
- Score: 100-200ms
- Chat: 300-400ms
- Insights: 200-350ms

### Data Limits
- Max expenses per request: 200
- Recommended budget range: ₹20,000 - ₹200,000
- Min transactions for accurate scoring: 10-15

## Dependencies

### Python
- FastAPI 0.115.6
- Pydantic 2.10.4
- NumPy 2.2.1
- Pandas 2.2.3
- scikit-learn 1.6.0
- scipy 1.14.0

### JavaScript
- Axios (for API calls)
- Lucide React (for icons)
- React hooks (useState, useEffect)

## Testing

### Sample Test Cases

1. **No Data Scenario**
   - Expected: Helpful empty state messages
   - Action: Return zero scores with guidance

2. **Minimal Data Scenario**
   - Input: 3-5 transactions
   - Expected: Confidence score <0.7, clear guidance

3. **Normal Data Scenario**
   - Input: 20+ transactions
   - Expected: Accurate analysis and recommendations

4. **Anomaly Scenario**
   - Input: Expenses with outliers
   - Expected: Anomalies detected and flagged

## Troubleshooting

### AI Service Not Responding
1. Check `AI_SERVICE_URL` in backend .env
2. Verify AI service is running: `GET /health`
3. Check CORS settings
4. Monitor error logs

### Inaccurate Predictions
1. Ensure sufficient data (20+ transactions)
2. Check for data quality issues
3. Verify budget limit is set correctly
4. Review trend analysis component

### Missing Insights
1. Add more categorized expenses
2. Ensure consistent category naming
3. Check for data formatting issues
4. Verify service is receiving data

## Future Enhancements

1. **Advanced ML Models**
   - Time series forecasting (ARIMA, Prophet)
   - Expense classification automation
   - Savings goal optimization

2. **Advanced Analytics**
   - Peer comparison analytics
   - Seasonal spending patterns
   - Budget optimization algorithms

3. **Personalization**
   - User preference learning
   - Goal-based recommendations
   - Custom scoring models

4. **Integration**
   - Bank API integration for auto-import
   - Real-time notifications
   - Export reports (PDF, Excel)

## Maintenance

### Regular Tasks
- Monitor API response times
- Review anomaly detection accuracy
- Update ML models with new data
- Check scoring algorithm calibration

### Logs to Monitor
- `/api/ai/*` request latency
- AI Service error rates
- Anomaly detection false positives
- Chat intent accuracy

---

Last Updated: 2024-05-26
Version: 1.0.0
