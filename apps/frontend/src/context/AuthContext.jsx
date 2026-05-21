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
    if (data.requiresOtp) return data;
    localStorage.setItem("budgetmind_token", data.token);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    if (data.requiresOtp) return data;
    localStorage.setItem("budgetmind_token", data.token);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function verifySignupOtp(payload) {
    const { data } = await api.post("/auth/verify-signup-otp", payload);
    localStorage.setItem("budgetmind_token", data.token);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function resendSignupOtp(payload) {
    const { data } = await api.post("/auth/resend-signup-otp", payload);
    return data;
  }

  async function googleLogin(payload) {
    const { data } = await api.post("/auth/google", payload);
    localStorage.setItem("budgetmind_token", data.token);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function updateProfile(payload) {
    const { data } = await api.patch("/users/me", payload);
    localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function changePassword(payload) {
    const { data } = await api.patch("/users/me/password", payload);
    return data;
  }

  function logout() {
    localStorage.removeItem("budgetmind_token");
    localStorage.removeItem("budgetmind_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, register, verifySignupOtp, resendSignupOtp, googleLogin, updateProfile, changePassword, logout }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
