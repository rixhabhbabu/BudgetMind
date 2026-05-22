import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

function normalizeExpense(expense) {
  return {
    id: expense._id ?? expense.id,
    merchant: expense.merchant,
    category: expense.category,
    amount: Number(expense.amount ?? 0),
    method: expense.method ?? "UPI",
    date: expense.spentAt ? new Date(expense.spentAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    notes: expense.notes ?? ""
  };
}

export function useExpenseQuery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("date");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/expenses");
      setItems((data.expenses ?? []).map(normalizeExpense));
    } catch (err) {
      setError(err.response?.data?.message ?? "Could not load expenses.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  async function addExpense(payload) {
    const { data } = await api.post("/expenses", {
      merchant: payload.merchant,
      amount: Number(payload.amount),
      category: payload.category,
      method: payload.method,
      spentAt: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
      notes: payload.notes
    });
    setItems((current) => [normalizeExpense(data.expense), ...current]);
    return data.expense;
  }

  const expenses = useMemo(() => {
    return items
      .filter((item) => category === "All" || item.category === category)
      .filter((item) => `${item.merchant} ${item.category}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sort === "amount" ? b.amount - a.amount : b.date.localeCompare(a.date));
  }, [category, items, query, sort]);

  return { expenses, loading, error, addExpense, reload: loadExpenses, query, setQuery, category, setCategory, sort, setSort };
}
