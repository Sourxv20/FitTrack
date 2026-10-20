const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined" && window.location.hostname && window.location.hostname !== "localhost") {
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

interface RequestOptions extends RequestInit {
  data?: any;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const token = localStorage.getItem("fittrack_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    const response = await fetch(url, config);

    // If 401 Unauthorized, try refresh token or clear session
    if (response.status === 401) {
      const refreshToken = localStorage.getItem("fittrack_refresh_token");
      if (refreshToken && !endpoint.includes("/auth/")) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData.data.accessToken;
            localStorage.setItem("fittrack_token", newAccessToken);

            // Retry original request with new token
            headers["Authorization"] = `Bearer ${newAccessToken}`;
            const retryRes = await fetch(url, { ...config, headers });
            const retryData = await retryRes.json();
            return retryData;
          }
        } catch {
          // Refresh failed
        }
      }

      // If unauthorized and no refresh worked, clear credentials
      if (!endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
        localStorage.removeItem("fittrack_token");
        localStorage.removeItem("fittrack_refresh_token");
        localStorage.removeItem("fittrack_user");
        window.location.href = "/login";
      }
    }

    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || `Request failed with status ${response.status}` };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error: any) {
    if (error.name === "TypeError" && (error.message === "Failed to fetch" || error.message.includes("fetch"))) {
      throw new Error("Unable to connect to the backend server. Please verify the server is running on port 5000.");
    }
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", data }),
  put: <T>(endpoint: string, data?: any, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", data }),
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" })
};
