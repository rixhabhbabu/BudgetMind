# BudgetMind AI Service

Advanced AI and Machine Learning microservice for intelligent financial analytics, predictions, and personalized recommendations.

## 🎯 Features

### Core Analytics
- **Expense Analysis**: Statistical breakdown with category insights
- **Anomaly Detection**: Identifies unusual spending patterns
- **Spending Predictions**: Forecasts month-end spending with confidence scores
- **Financial Scoring**: Comprehensive health assessment (0-100)

### Intelligence
- **Pattern Recognition**: Detects spending behaviors and trends
- **Smart Recommendations**: Priority-based actionable advice
- **Trend Analysis**: Identifies spending direction (increasing/stable/decreasing)
- **Budget Risk Assessment**: Real-time budget status monitoring

### Conversational AI
- **Intelligent Chatbot**: Natural language financial advice
- **Intent Recognition**: Understands user financial questions
- **Context-Aware Responses**: Personalized based on user data
- **Suggested Actions**: Quick-action recommendations

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- pip (Python package manager)

### Installation

```bash
cd services/ai-service

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Service

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs` (Swagger UI)

## 📦 Dependencies

```
fastapi==0.115.6          # Web framework
uvicorn==0.34.0          # ASGI server
pydantic==2.10.4         # Data validation
numpy==2.2.1             # Numerical computing
pandas==2.2.3            # Data analysis
scikit-learn==1.6.0      # Machine learning
scipy==1.14.0            # Scientific computing
```

## 🔌 API Endpoints

### Health & Status
```
GET /health
```
Returns service health status.

### Analysis & Insights
```
POST /analyze
POST /predict
POST /score
POST /insights
POST /personalized-recommendations
```

### Conversation
```
POST /chat
POST /recommendations
```

### Utilities
```
POST /risk
POST /summary
```

## 📊 Data Models

### Expense Input
```python
{
  "category": str,           # e.g., "Food", "Transport"
  "amount": float,           # Expense amount in ₹
  "description": str,        # Optional description
  "date": str               # Optional ISO date
}
```

### Analysis Output
```python
{
  "totals": dict,           # Category totals
  "topCategory": str,       # Highest spending category
  "savingsPotential": float,# Amount that could be saved
  "recommendations": list,  # Actionable tips
  "statistics": dict,       # Statistical metrics
  "categoryBreakdown": list,# Detailed category analysis
  "unusualTransactions": list,  # Anomalies
  "anomalyCount": int      # Number of anomalies
}
```

## 🧪 Testing

### Run Test Suite
```bash
python test_ai_service.py
```

### Test with Custom URL
```bash
python test_ai_service.py --url http://your-ai-service:8000
```

### Manual Testing with curl
```bash
# Health check
curl http://localhost:8000/health

# Analyze expenses
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"expenses": [{"category": "Food", "amount": 500}]}'

# Predict spending
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "expenses": [{"category": "Food", "amount": 500}],
    "budgetLimit": 70000,
    "daysInMonth": 30
  }'
```

## 📝 Usage Examples

### Backend Integration
```javascript
// From Express backend
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    expenses: [
      { category: 'Food', amount: 500 },
      { category: 'Transport', amount: 200 }
    ]
  })
});

const data = await response.json();
```

### Frontend Integration
```javascript
// From React component
const response = await api.post('/api/ai/analyze');
const { analysis, recommendations } = response.data;

// Display analysis
console.log(`Top category: ${analysis.topCategory}`);
console.log(`Savings potential: ₹${analysis.savingsPotential}`);
```

## 🔍 Modules

### analysis.py
Statistical expense analysis with recommendations.
- Calculates category totals and percentages
- Computes average, median, and standard deviation
- Generates intelligent recommendations
- Performs comprehensive statistical analysis

### anomaly.py
Detects unusual transactions using multiple methods.
- Z-score based detection
- IQR (Interquartile Range) analysis
- Severity scoring
- Deduplication

### prediction.py
ML-based spending forecasting.
- Linear regression with trend analysis
- Budget risk calculation
- Monthly run-rate estimation
- Confidence scoring

### scoring.py
Financial health assessment.
- 4-component scoring system (0-100)
- Budget adherence measurement
- Spending consistency analysis
- Savings rate evaluation
- Risk assessment

### insights.py
Pattern recognition and recommendations.
- Category spending analysis
- Pattern detection
- Personalized recommendations
- Actionable insights

### models/spend_model.py
Machine learning models.
- Spending forecasting
- Trend calculation
- Budget risk assessment
- Run-rate estimation

## 📈 Scoring System

### Components (25 points each = 100 total)
1. **Budget Adherence** - Staying within budget (0-75% = 25pts → 100%+ = 0pts)
2. **Spending Consistency** - Predictability (low variation = high score)
3. **Savings Rate** - Percentage saved (25%+ = 25pts → <10% = low)
4. **Anomaly Management** - Freedom from outliers (fewer anomalies = higher)

### Ratings
- **Excellent** (85-100): Excellent financial health
- **Good** (70-84): Strong financial management
- **Fair** (50-69): Adequate but room for improvement
- **Poor** (25-49): Needs attention
- **Critical** (<25): Urgent action needed

## 🔧 Configuration

### Environment Variables
```bash
# Port (default: 8000)
PORT=8000

# Budget limit for calculations (default: 70000)
DEFAULT_BUDGET=70000

# Days in month for calculations (default: 30)
DAYS_IN_MONTH=30
```

### Budget Limit
Set per request or use default (70,000 ₹).

## 🚦 Performance

### Typical Response Times
- Analyze: 200-300ms
- Predict: 150-250ms
- Score: 100-200ms
- Chat: 300-400ms
- Insights: 200-350ms

### Data Limits
- Max expenses per request: 200
- Recommended budget range: ₹20,000 - ₹200,000
- Min transactions for scoring: 10-15

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check port is available
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Try different port
uvicorn main:app --port 8001
```

### Import Errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt

# Check Python version
python --version  # Should be 3.10+
```

### Connection Errors (from Backend)
- Check `AI_SERVICE_URL` env variable
- Verify firewall settings
- Ensure service is running on correct host/port

## 📊 Data Flow

```
Request (Expenses)
    ↓
Validation (Pydantic)
    ↓
Analysis Module
├─ Statistical analysis
├─ Anomaly detection
└─ Recommendations
    ↓
ML Modules
├─ Prediction
├─ Scoring
└─ Insights
    ↓
JSON Response
    ↓
Client (Backend/Frontend)
```

## 🔐 Security Notes

- All endpoints expect POST requests with JSON bodies
- Input validation via Pydantic
- Error handling and sanitization
- No sensitive data logging
- Consider adding authentication in production

## 📚 API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Integration with BudgetMind

### Backend Routes
```
GET  /api/ai/recommendations
GET  /api/ai/analyze
GET  /api/ai/predict
GET  /api/ai/score
GET  /api/ai/insights
GET  /api/ai/personalized-recommendations
POST /api/ai/chat
```

### Frontend Pages
- **Insights** - Real-time AI analysis and chatbot
- **Dashboard** - AI-powered insights widget
- **Reports** - AI-generated financial reports

## 📞 Support

### Logs
Check service logs for:
- Request validation errors
- Processing exceptions
- Performance issues
- Data quality problems

### Common Issues
1. **Empty response**: Ensure expense data is provided
2. **Inaccurate predictions**: Need more data (20+ transactions)
3. **No anomalies detected**: Normal if spending is consistent

## 🔄 Updates & Maintenance

### Regular Updates
```bash
# Update dependencies
pip install --upgrade -r requirements.txt

# Test after updates
python test_ai_service.py
```

### Model Retraining
Models are computed per-request. No offline training required.

## 📝 Version History

### v1.0.0 (May 2024)
- Initial release
- Core analytics modules
- ML prediction models
- Financial scoring system
- Intelligent chatbot
- Comprehensive API

---

**Last Updated**: May 26, 2024  
**Status**: Production Ready
