"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, AuthUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    setUser(res.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await authAPI.signup(name, email, password);
    setUser(res.user);
  };

  const logout = async () => {
    await authAPI.logout().catch(() => {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
