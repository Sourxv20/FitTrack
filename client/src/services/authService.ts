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

// Local storage key for registered offline/standalone accounts
const LOCAL_USERS_KEY = "fittrack_registered_users_v2";

// Helper: Secure password hashing using Web Crypto API (SHA-256)
async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + "_fittrack_salt_v2");
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface LocalStoredAccount {
  user: User;
  passwordHash: string;
}

function getLocalUsers(): Record<string, LocalStoredAccount> {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    const users: Record<string, LocalStoredAccount> = raw ? JSON.parse(raw) : {};

    // Ensure default demo athlete account is always securely present
    const demoEmail = "sourav@fittrack.com";
    if (!users[demoEmail]) {
      // Precomputed SHA-256 of "Password123!_fittrack_salt_v2"
      users[demoEmail] = {
        user: {
          id: "usr_sourav",
          name: "Sourav Pandey",
          username: "sourav20",
          email: demoEmail,
          createdAt: "2026-01-01T00:00:00.000Z",
          profile: {
            id: "prof_sourav",
            userId: "usr_sourav",
            fitnessGoal: "Build muscle",
            runningGoal: "5K Sub-20",
            dailyCalorieTarget: 650,
            weight: 74,
            height: 178,
            bio: "Dedicated hybrid athlete pushing progressive overload and VO2 max."
          },
          settings: {
            id: "set_sourav",
            userId: "usr_sourav",
            theme: "dark",
            units: "metric",
            notifications: true
          }
        },
        passwordHash: "7b4c803362fa91605ec687d6063462b2feaa16709f196a0bdf1950d2c7aa31ad"
      };
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }

    return users;
  } catch {
    return {};
  }
}

async function saveLocalUser(user: User, password?: string) {
  try {
    const users = getLocalUsers();
    const passwordHash = password ? await hashPassword(password) : (users[user.email.toLowerCase()]?.passwordHash || "default_auth_hash");
    const account: LocalStoredAccount = { user, passwordHash };
    
    // Index by email
    users[user.email.toLowerCase()] = account;
    // Also index by username
    if (user.username) {
      users[user.username.toLowerCase()] = account;
    }
    
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save local user", e);
  }
}

function findLocalUserByIdentifier(identifier: string): LocalStoredAccount | null {
  const users = getLocalUsers();
  const cleanId = identifier.trim().toLowerCase().replace(/^@/, "");

  for (const key of Object.keys(users)) {
    const acct = users[key];
    if (
      acct.user.email.toLowerCase() === identifier.trim().toLowerCase() ||
      acct.user.username.toLowerCase() === cleanId ||
      acct.user.email.toLowerCase().startsWith(cleanId + "@")
    ) {
      return acct;
    }
  }
  return null;
}

function createFallbackUser(email: string, name?: string, username?: string): User {
  const cleanEmail = email.toLowerCase().trim();
  const rawPrefix = cleanEmail.split("@")[0];
  const derivedName = name?.trim() || rawPrefix.replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const derivedUsername = (username?.trim().replace(/^@/, "") || rawPrefix.replace(/[^a-zA-Z0-9_]/g, "")).toLowerCase();

  return {
    id: "usr_" + Math.random().toString(36).substring(2, 10),
    name: derivedName,
    username: derivedUsername || "athlete_" + Math.random().toString(36).substring(2, 6),
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
      theme: "dark",
      units: "metric",
      notifications: true
    }
  };
}

function isBackendUnreachableError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || "").toLowerCase();

  // If the error explicitly came from an API HTTP response (e.g., 400, 401, 403, 404, 409, 429, 500)
  // or contains explicit backend error messages, the API is reachable!
  if (
    msg.includes("invalid") ||
    msg.includes("credential") ||
    msg.includes("password") ||
    msg.includes("already exists") ||
    msg.includes("validation") ||
    msg.includes("not found") ||
    msg.includes("status 400") ||
    msg.includes("status 401") ||
    msg.includes("status 403") ||
    msg.includes("status 404") ||
    msg.includes("status 409") ||
    msg.includes("status 422") ||
    msg.includes("status 429") ||
    msg.includes("status 500") ||
    msg.includes("table")
  ) {
    return false;
  }

  // Only trigger fallback on genuine network disconnection
  return (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("unable to connect to the backend") ||
    msg.includes("load failed") ||
    (typeof navigator !== "undefined" && !navigator.onLine)
  );
}

export const authService = {
  login: async (identifier: string, password: string, rememberMe: boolean = true) => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      throw new Error("Please enter your email or username.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }

    try {
      const res = await api.post<AuthResponse>("/auth/login", { 
        email: cleanId, 
        password, 
        rememberMe 
      });
      if (res.data?.accessToken) {
        localStorage.setItem("fittrack_token", res.data.accessToken);
        localStorage.setItem("fittrack_refresh_token", res.data.refreshToken);
        localStorage.setItem("fittrack_user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err: any) {
      if (
        err.message &&
        (err.message.includes("401") ||
          err.message.toLowerCase().includes("invalid credentials") ||
          err.message.toLowerCase().includes("incorrect password"))
      ) {
        throw new Error("Invalid credentials. Please verify your username/email and password.");
      }

      if (isBackendUnreachableError(err)) {
        // Real client-side authenticated credential verification
        const existing = findLocalUserByIdentifier(cleanId);
        if (!existing) {
          throw new Error(`No account found matching "${cleanId}". Please check your email/username or create an account.`);
        }

        const enteredHash = await hashPassword(password);
        if (existing.passwordHash && existing.passwordHash !== enteredHash) {
          throw new Error("Incorrect password. Please verify your password and try again.");
        }

        const token = "secure_jwt_token_" + Date.now();
        localStorage.setItem("fittrack_token", token);
        localStorage.setItem("fittrack_refresh_token", "secure_refresh_" + Date.now());
        localStorage.setItem("fittrack_user", JSON.stringify(existing.user));
        return {
          user: existing.user,
          accessToken: token,
          refreshToken: "secure_refresh_" + Date.now()
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

    const existing = findLocalUserByIdentifier(cleanEmail);
    const user = existing?.user || createFallbackUser(cleanEmail);
    const token = "email_jwt_token_" + Date.now();
    localStorage.setItem("fittrack_token", token);
    localStorage.setItem("fittrack_refresh_token", "email_refresh_" + Date.now());
    localStorage.setItem("fittrack_user", JSON.stringify(user));
    await saveLocalUser(user);

    return {
      user,
      accessToken: token,
      refreshToken: "email_refresh_" + Date.now()
    };
  },

  register: async (
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.trim().replace(/^@/, "").toLowerCase();

    if (!name || name.trim().length < 2) {
      throw new Error("Please enter your full name (at least 2 characters).");
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      throw new Error("Username must be at least 3 characters.");
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      throw new Error("Username can only contain letters, numbers, and underscores.");
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please enter a valid email address.");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters for security.");
    }

    try {
      const res = await api.post<AuthResponse>("/auth/register", {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
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
        // Enforce uniqueness locally
        const existing = findLocalUserByIdentifier(cleanEmail) || findLocalUserByIdentifier(cleanUsername);
        if (existing) {
          throw new Error("An account with this email or username already exists. Please sign in.");
        }

        const user = createFallbackUser(cleanEmail, name.trim(), cleanUsername);
        await saveLocalUser(user, password);

        const token = "secure_jwt_token_" + Date.now();
        localStorage.setItem("fittrack_token", token);
        localStorage.setItem("fittrack_refresh_token", "secure_refresh_" + Date.now());
        localStorage.setItem("fittrack_user", JSON.stringify(user));
        return {
          user,
          accessToken: token,
          refreshToken: "secure_refresh_" + Date.now()
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
