import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Profile } from "../types";
import { authService } from "../services/authService";
import { profileService } from "../services/workoutService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithEmailOnly: (email: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("fittrack_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("fittrack_token");
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("fittrack_token");
      if (storedToken) {
        try {
          const fetchedUser = await authService.getMe();
          setUser(fetchedUser);
        } catch {
          // Token expired or invalid
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToken(data.accessToken);
  };

  const loginWithEmailOnly = async (email: string) => {
    const data = await authService.loginWithEmailOnly(email);
    setUser(data.user);
    setToken(data.accessToken);
  };

  const demoLogin = async () => {
    await login("sourav@fittrack.com", "Password123!");
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    const data = await authService.register(name, email, password, confirmPassword);
    setUser(data.user);
    setToken(data.accessToken);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem("fittrack_user", JSON.stringify(merged));
      return merged;
    });
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getMe();
      setUser(data);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        loginWithEmailOnly,
        demoLogin,
        register,
        logout,
        updateUser,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
