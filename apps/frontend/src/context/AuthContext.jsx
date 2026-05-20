import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("budgetmind_user");
    return stored ? JSON.parse(stored) : null;
  });

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("budgetmind_token", data.token);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("budgetmind_token", data.token);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("budgetmind_token");
    localStorage.removeItem("budgetmind_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
