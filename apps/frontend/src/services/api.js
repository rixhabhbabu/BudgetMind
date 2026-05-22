import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("budgetmind_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchDashboard() {
  const { data } = await api.get("/dashboard");
  return data;
}

export async function fetchBudgets() {
  const { data } = await api.get("/budgets");
  return data.budgets ?? [];
}

export async function fetchNotifications() {
  const { data } = await api.get("/notifications");
  return data.notifications ?? [];
}

export async function fetchAuditLogs() {
  const { data } = await api.get("/audit");
  return data.logs ?? [];
}

export async function fetchAdminOverview() {
  const { data } = await api.get("/admin/overview");
  return data;
}

export async function fetchBills() {
  const { data } = await api.get("/bills");
  return data.bills ?? [];
}

export async function uploadBill(file) {
  const formData = new FormData();
  formData.append("receipt", file);
  const { data } = await api.post("/bills/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function fetchCards() {
  const { data } = await api.get("/cards");
  return data.cards ?? [];
}

export async function fetchCardTransactions() {
  const { data } = await api.get("/cards/transactions");
  return data.transactions ?? [];
}

export async function fetchUpiTransactions() {
  const { data } = await api.get("/upi/transactions");
  return data.transactions ?? [];
}

export async function parseUpiMessage(message) {
  const { data } = await api.post("/upi/parse", { message });
  return data.transaction;
}
