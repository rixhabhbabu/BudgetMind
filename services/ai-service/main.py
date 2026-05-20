from fastapi import FastAPI
from pydantic import BaseModel

from analysis import analyze_expenses
from anomaly import detect_unusual_transactions
from prediction import predict_month_end

app = FastAPI(title="BudgetMind AI Service")


class Expense(BaseModel):
    category: str
    amount: float


class ChatRequest(BaseModel):
    message: str
    expenses: list[Expense] = []


@app.get("/health")
def health():
    return {"status": "ok", "service": "budgetmind-ai"}


@app.post("/analyze")
def analyze(expenses: list[Expense]):
    payload = [expense.model_dump() for expense in expenses]
    result = analyze_expenses(payload)
    result["unusualTransactions"] = detect_unusual_transactions(payload)
    return result


@app.post("/predict")
def predict(expenses: list[Expense]):
    return predict_month_end([expense.model_dump() for expense in expenses])


@app.post("/chat")
def chat(payload: ChatRequest):
    return {
        "reply": "Keep discretionary spending below your weekly limit and move surplus into savings.",
        "intent": "budget_coaching",
    }
