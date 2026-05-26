#!/usr/bin/env python3
"""
Test script for BudgetMind AI Service.
Tests all endpoints with sample data.

Usage:
    python test_ai_service.py
    python test_ai_service.py --url http://localhost:8000
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import random

# Configuration
AI_SERVICE_URL = "http://localhost:8000"
BUDGET_LIMIT = 70000

# Sample test data
SAMPLE_EXPENSES = [
    {"category": "Food", "amount": 500, "description": "Restaurant dinner"},
    {"category": "Food", "amount": 450, "description": "Groceries"},
    {"category": "Food", "amount": 520, "description": "Dining out"},
    {"category": "Transport", "amount": 150, "description": "Uber"},
    {"category": "Transport", "amount": 200, "description": "Gas"},
    {"category": "Transport", "amount": 180, "description": "Fuel"},
    {"category": "Entertainment", "amount": 800, "description": "Movie tickets"},
    {"category": "Entertainment", "amount": 500, "description": "Streaming"},
    {"category": "Shopping", "amount": 1200, "description": "Clothes"},
    {"category": "Shopping", "amount": 300, "description": "Books"},
    {"category": "Utilities", "amount": 2000, "description": "Electricity bill"},
    {"category": "Health", "amount": 600, "description": "Gym membership"},
    {"category": "Health", "amount": 300, "description": "Doctor visit"},
]

ANOMALY_EXPENSES = SAMPLE_EXPENSES + [
    {"category": "Shopping", "amount": 15000, "description": "Emergency purchase"},
    {"category": "Entertainment", "amount": 5000, "description": "Concert tickets"},
]

def test_health():
    """Test health check endpoint."""
    print("\\n" + "="*60)
    print("Testing: Health Check")
    print("="*60)
    try:
        response = requests.get(f"{AI_SERVICE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_analyze():
    """Test expense analysis."""
    print("\\n" + "="*60)
    print("Testing: Expense Analysis")
    print("="*60)
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/analyze",
            json=SAMPLE_EXPENSES
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        print(f"\\nKey Metrics:")
        print(f"  Total Spent: ₹{data.get('statistics', {}).get('totalSpent', 0):,.2f}")
        print(f"  Top Category: {data.get('topCategory')}")
        print(f"  Savings Potential: ₹{data.get('savingsPotential', 0):,.2f}")
        print(f"  Anomalies Detected: {data.get('anomalyCount', 0)}")
        
        print(f"\\nRecommendations:")
        for i, rec in enumerate(data.get('recommendations', [])[:3], 1):
            print(f"  {i}. {rec}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_predict():
    """Test spending prediction."""
    print("\\n" + "="*60)
    print("Testing: Spending Prediction")
    print("="*60)
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/predict",
            json={
                "expenses": SAMPLE_EXPENSES,
                "budgetLimit": BUDGET_LIMIT,
                "daysInMonth": 30
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        print(f"\\nPrediction Results:")
        print(f"  Spent So Far: ₹{data.get('spentSoFar', 0):,.2f}")
        print(f"  Projected Month-End: ₹{data.get('projectedMonthEnd', 0):,.2f}")
        print(f"  Next Month Forecast: ₹{data.get('nextMonthForecast', 0):,.2f}")
        print(f"  Budget Risk Score: {data.get('budgetRiskScore', 0):.1f}/100")
        print(f"  Trend: {data.get('trend', 'N/A')}")
        print(f"  Budget Status: {data.get('budgetStatus', 'N/A')}")
        print(f"  Confidence: {data.get('confidence', 0):.0%}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_anomaly_detection():
    """Test anomaly detection."""
    print("\\n" + "="*60)
    print("Testing: Anomaly Detection")
    print("="*60)
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/analyze",
            json=ANOMALY_EXPENSES
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        anomalies = data.get('unusualTransactions', [])
        print(f"\\nAnomalies Detected: {len(anomalies)}")
        
        for i, anomaly in enumerate(anomalies[:3], 1):
            print(f"\\n  Anomaly {i}:")
            exp = anomaly.get('expense', {})
            print(f"    Amount: ₹{exp.get('amount', 0):,.2f}")
            print(f"    Category: {exp.get('category')}")
            print(f"    Reason: {anomaly.get('reason')}")
            print(f"    Severity: {anomaly.get('severityScore')}/100")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_score():
    """Test financial health score."""
    print("\\n" + "="*60)
    print("Testing: Financial Health Score")
    print("="*60)
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/score",
            json={
                "expenses": SAMPLE_EXPENSES,
                "budget_limit": BUDGET_LIMIT
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        print(f"\\nHealth Score Results:")
        print(f"  Overall Score: {data.get('overallScore', 0)}/100")
        print(f"  Rating: {data.get('rating', 'N/A').upper()}")
        
        components = data.get('components', {})
        print(f"\\n  Score Components:")
        print(f"    Budget Adherence: {components.get('budgetAdherence', 0)}/25")
        print(f"    Spending Consistency: {components.get('spendingConsistency', 0)}/25")
        print(f"    Savings Rate: {components.get('savingsRate', 0)}/25")
        print(f"    Anomaly Score: {components.get('anomalyScore', 0)}/25")
        
        print(f"\\n  Recommendations:")
        for i, rec in enumerate(data.get('recommendations', [])[:2], 1):
            print(f"    {i}. {rec}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_insights():
    """Test spending insights."""
    print("\\n" + "="*60)
    print("Testing: Spending Insights")
    print("="*60)
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/insights",
            json=SAMPLE_EXPENSES
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        print(f"\\nCategory Breakdown:")
        for category in data.get('categories', [])[:5]:
            print(f"  {category['name']}: ₹{category['total']:,.2f} ({category['count']}x)")
        
        print(f"\\nDetected Patterns:")
        for pattern in data.get('patterns', []):
            print(f"  - {pattern.get('description')}")
            print(f"    Action: {pattern.get('action')}")
        
        print(f"\\nInsights:")
        for insight in data.get('insights', [])[:3]:
            print(f"  - {insight}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_recommendations():
    """Test personalized recommendations."""
    print("\\n" + "="*60)
    print("Testing: Personalized Recommendations")
    print("="*60)
    try:
        response = requests.post(
            f"{AI_SERVICE_URL}/personalized-recommendations",
            json={
                "expenses": SAMPLE_EXPENSES,
                "budget_limit": BUDGET_LIMIT
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        print(f"\\nRecommendations ({data.get('totalCount', 0)} total):")
        for i, rec in enumerate(data.get('recommendations', [])[:5], 1):
            print(f"\\n  {i}. [{rec.get('priority').upper()}] {rec.get('category')}")
            print(f"     {rec.get('text')}")
            print(f"     Action: {rec.get('action')}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_chat():
    """Test chatbot."""
    print("\\n" + "="*60)
    print("Testing: Chatbot")
    print("="*60)
    
    test_messages = [
        "How can I save money?",
        "What's my biggest expense?",
        "Am I over budget?",
        "Help me with budgeting",
    ]
    
    all_passed = True
    for message in test_messages:
        try:
            print(f"\\nUser: {message}")
            response = requests.post(
                f"{AI_SERVICE_URL}/chat",
                json={
                    "message": message,
                    "expenses": SAMPLE_EXPENSES
                }
            )
            print(f"Status: {response.status_code}")
            data = response.json()
            
            print(f"AI: {data.get('reply', 'No response')}")
            print(f"Intent: {data.get('intent', 'unknown')}")
            
            if response.status_code != 200:
                all_passed = False
        except Exception as e:
            print(f"Error: {e}")
            all_passed = False
    
    return all_passed


def run_all_tests():
    """Run all tests and report results."""
    print("\\n" + "█"*60)
    print("BudgetMind AI Service Test Suite")
    print("█"*60)
    print(f"Target URL: {AI_SERVICE_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("Health Check", test_health),
        ("Analyze", test_analyze),
        ("Predict", test_predict),
        ("Anomaly Detection", test_anomaly_detection),
        ("Health Score", test_score),
        ("Insights", test_insights),
        ("Recommendations", test_recommendations),
        ("Chatbot", test_chat),
    ]
    
    results = {}
    for name, test_func in tests:
        try:
            results[name] = test_func()
        except Exception as e:
            print(f"\\nTest failed with exception: {e}")
            results[name] = False
    
    # Summary
    print("\\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for name, passed_test in results.items():
        status = "✓ PASSED" if passed_test else "✗ FAILED"
        print(f"{status:10} - {name}")
    
    print(f"\\nTotal: {passed}/{total} passed")
    
    return passed == total


if __name__ == "__main__":
    # Parse arguments
    if len(sys.argv) > 1 and sys.argv[1] == "--url" and len(sys.argv) > 2:
        AI_SERVICE_URL = sys.argv[2]
    
    success = run_all_tests()
    sys.exit(0 if success else 1)
