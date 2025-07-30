import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: { name: string; email: string; role: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (data: { email: string; password: string }) => {
    const res = await axios.post("http://localhost:5000/auth/signin", data);
    const token = res.data.token;
    if (token) setToken(token);
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    const res = await axios.post("http://localhost:5000/auth/signup", data);
    const token = res.data.token;
    if (token) setToken(token);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
