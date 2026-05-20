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
