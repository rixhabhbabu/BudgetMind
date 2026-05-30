import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firebaseAuth } from "../config/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  firebaseRegister,
  firebaseLogin,
  firebaseGoogleSignIn,
  firebaseLogout
} from "../services/firebaseService.js";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("budgetmind_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("budgetmind_token")));

  useEffect(() => {
    const token = localStorage.getItem("budgetmind_token");
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    async function loadProfile() {
      try {
        const { data } = await api.get("/users/me");
        if (!active) return;
        localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
        setUser(data.user);
      } catch {
        if (!active) return;
        localStorage.removeItem("budgetmind_token");
        localStorage.removeItem("budgetmind_user");
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  async function register(payload) {
    try {
      const { token } = await firebaseRegister(payload.email, payload.password, payload.name);
      
      // Send Firebase token to backend for verification
      const { data } = await api.post("/auth/firebase-register", { 
        token,
        name: payload.name 
      });
      
      localStorage.setItem("budgetmind_token", data.token);
      localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function login(payload) {
    try {
      const { token } = await firebaseLogin(payload.email, payload.password);
      
      // Send Firebase token to backend for verification
      const { data } = await api.post("/auth/firebase-login", { token });
      
      localStorage.setItem("budgetmind_token", data.token);
      localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
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

  async function googleLogin() {
    try {
      const { token } = await firebaseGoogleSignIn();
      
      // Send Firebase token to backend for verification
      const { data } = await api.post("/auth/google", { token });
      
      localStorage.setItem("budgetmind_token", data.token);
      localStorage.setItem("budgetmind_user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
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

  async function logout() {
    try {
      await firebaseLogout();
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
    localStorage.removeItem("budgetmind_token");
    localStorage.removeItem("budgetmind_user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, verifySignupOtp, resendSignupOtp, googleLogin, updateProfile, changePassword, logout }),
    [loading, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
