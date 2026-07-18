import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    try {
      const p = await api.me();
      setProfile(p);
    } catch {
      setProfile(null);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("sf_token");
    if (token) refreshProfile().finally(() => setLoading(false));
    else setLoading(false);
  }, []);

  async function login(email, password) {
    const res = await api.login({ email, password });
    localStorage.setItem("sf_token", res.access_token);
    await refreshProfile();
  }

  function logout() {
    localStorage.removeItem("sf_token");
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}