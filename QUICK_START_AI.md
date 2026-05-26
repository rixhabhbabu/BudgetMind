# BudgetMind AI & ML - Quick Setup Guide

## 🚀 5-Minute Setup

### Step 1: Install AI Service Dependencies
```bash
cd services/ai-service
pip install -r requirements.txt
```

### Step 2: Start AI Service
```bash
# Terminal 1 - AI Service
cd services/ai-service
uvicorn main:app --reload --port 8000
```

### Step 3: Configure Backend
```bash
# Update apps/backend/.env
AI_SERVICE_URL=http://localhost:8000
```

### Step 4: Start Backend & Frontend
```bash
# Terminal 2 - Full Stack
npm run dev
```

### Step 5: Access Features
1. Open browser to http://localhost:5173
2. Login or register
3. Add some expenses
4. Go to "Insights" page to see AI features

## ✨ What You Can Now Do

### 1. View AI-Powered Insights
- Go to **Insights** page
- See real-time analysis of your spending
- View spending predictions
- Check budget status
- Get personalized recommendations

### 2. Chat with AI Assistant
- Type messages like:
  - "How can I save money?"
  - "What's my biggest expense?"
  - "Am I over budget?"
  - "Help me with budgeting"
- Get personalized financial advice

### 3. Get Recommendations
- View priority-ranked action items
- Learn about spending patterns
- Discover savings opportunities
- Understand budget health

## 📊 Example Workflows

### Workflow 1: New User Setup
1. Create account
2. Add 5-10 expenses with different categories
3. View Insights page → See analysis
4. Chat → Ask "How can I improve?"
5. Read recommendations

### Workflow 2: Budget Monitoring
1. Add daily expenses
2. Go to Insights page regularly
3. Check "Spending Prediction"
4. Monitor budget risk indicator
5. Ask AI for budget tips

### Workflow 3: Savings Planning
1. View financial health score
2. Check savings potential
3. Ask AI: "Help me save more"
4. Get personalized action items
5. Track progress over time

## 🧪 Testing AI Features

### Quick Test
```bash
# In services/ai-service folder
python test_ai_service.py
```

Expected output:
```
✓ PASSED - Health Check
✓ PASSED - Analyze
✓ PASSED - Predict
✓ PASSED - Anomaly Detection
✓ PASSED - Health Score
✓ PASSED - Insights
✓ PASSED - Recommendations
✓ PASSED - Chatbot
```

### Manual Testing
```bash
# Health check
curl http://localhost:8000/health

# Get health score
curl -X POST http://localhost:8000/score \
  -H "Content-Type: application/json" \
  -d '{
    "expenses": [
      {"category": "Food", "amount": 500},
      {"category": "Transport", "amount": 200},
      {"category": "Food", "amount": 450},
      {"category": "Entertainment", "amount": 800}
    ]
  }'
```

## 🎯 Key Features to Try

### Feature 1: Expense Analysis
```
Add expenses → Insights page → See statistical breakdown
- Total spent
- Top category
- Savings potential
- Category breakdown
```

### Feature 2: Spending Predictions
```
Add expenses → Insights page → See "Spending Prediction"
- Projected month-end
- Budget risk
- Spending trend
- Daily budget remaining
```

### Feature 3: Financial Health Score
```
Insights page → AI Analysis → See overall score
- Health score (0-100)
- Rating (Excellent/Good/Fair/Poor/Critical)
- Component breakdown
- Improvement recommendations
```

### Feature 4: Anomaly Detection
```
Chat with AI → Say "Show unusual spending"
- Detects outlier transactions
- Shows severity
- Explains why it's unusual
```

### Feature 5: Smart Chatbot
```
Go to Insights → Use chatbot
- Ask about spending
- Get budget advice
- Request savings tips
- Get financial health summary
```

## 📈 Understanding the Scores

### Financial Health Score (0-100)
- **85+** ⭐⭐⭐⭐⭐ Excellent - Keep it up!
- **70-84** ⭐⭐⭐⭐ Good - On the right track
- **50-69** ⭐⭐⭐ Fair - Room for improvement
- **25-49** ⭐⭐ Poor - Needs attention
- **<25** ⭐ Critical - Take action immediately

### Budget Status
- **On Track** (<75% spent) - Good! Stay disciplined
- **Caution** (75-90% spent) - Watch spending carefully
- **At Risk** (>90% spent) - Reduce spending now

### Spending Trend
- **Increasing** - Spending is going up (might exceed budget)
- **Stable** - Spending is consistent
- **Decreasing** - Spending is going down (good!)

## 🔧 Troubleshooting

### Problem: AI Service not responding
```bash
# Check if service is running
curl http://localhost:8000/health

# Should see: {"status": "ok", ...}
# If error, start the service
cd services/ai-service
uvicorn main:app --reload --port 8000
```

### Problem: Insights page shows "No Data Yet"
```
Solution:
1. Make sure you're logged in
2. Add at least 3-5 expenses
3. Refresh the page
4. Wait a moment for analysis to complete
```

### Problem: Chatbot not responding
```
Solution:
1. Check backend is running (npm run dev)
2. Check AI service is running (port 8000)
3. Refresh the page
4. Try a simple message like "Hi"
```

### Problem: Inaccurate predictions
```
Solution:
1. Add more expenses (need 20+)
2. Add more variety in categories
3. Ensure consistent category names
4. System improves with more data
```

## 📚 Documentation Files

- **AI_ML_COMPLETION.md** - Complete feature overview
- **services/ai-service/README.md** - AI service details
- **services/ai-service/AI_DOCUMENTATION.md** - API reference

## 🎓 Learning Resources

### Python ML Concepts
- [NumPy Docs](https://numpy.org/doc/)
- [Pandas Docs](https://pandas.pydata.org/)
- [scikit-learn](https://scikit-learn.org/)

### FastAPI
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Interactive Docs](http://localhost:8000/docs)

### React Integration
- [React Hooks](https://react.dev/reference/react/hooks)
- [Axios HTTP Client](https://axios-http.com/)

## 🚀 Next Steps

1. **Familiarize yourself** with the Insights page
2. **Add test data** (expenses) to get real insights
3. **Chat with AI** to understand capabilities
4. **Review recommendations** provided by the system
5. **Share feedback** for improvements

## 💡 Pro Tips

1. **Add diverse expenses** - Different categories = Better insights
2. **Set realistic budget** - Use your actual monthly budget
3. **Check regularly** - Daily insights help track progress
4. **Ask follow-up questions** - Chatbot gets better with context
5. **Act on recommendations** - Apply suggestions to improve score

## ❓ FAQ

**Q: How long does it take to get good insights?**  
A: You need ~20 transactions for accuracy. Start with quick test data.

**Q: Can I change my budget?**  
A: Yes, in Insights page via query parameter or in settings.

**Q: Is my data secure?**  
A: Yes, all data is encrypted and only accessible when logged in.

**Q: Can I export the analysis?**  
A: Coming soon! Currently view in-app.

**Q: How accurate are predictions?**  
A: Gets better with more data. Confidence score shows reliability.

---

## 🎉 You're Ready!

Your BudgetMind AI & ML system is now ready to use. Start by:

1. ✅ Starting the AI service
2. ✅ Starting the backend
3. ✅ Adding some expenses
4. ✅ Going to Insights page
5. ✅ Chatting with AI assistant

**Enjoy intelligent financial management!** 💰📊
