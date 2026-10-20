import { api } from "./api";
import { defaultExercises, defaultWorkoutPlans } from "../data/defaultGymData";
import {
  Exercise,
  WorkoutPlan,
  WorkoutSession,
  WorkoutSet,
  Run,
  RoutePoint,
  DashboardData,
  ProgressSummary,
  AnalyticsDataPoint,
  UserSettings,
  Profile,
  YoYoTest
} from "../types";

export const exerciseService = {
  getExercises: async (params?: { category?: string; difficulty?: string; equipment?: string; search?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append("category", params.category);
      if (params?.difficulty) query.append("difficulty", params.difficulty);
      if (params?.equipment) query.append("equipment", params.equipment);
      if (params?.search) query.append("search", params.search);

      const queryString = query.toString();
      const endpoint = `/exercises${queryString ? `?${queryString}` : ""}`;
      const res = await api.get<{ success: boolean; count: number; data: Exercise[] }>(endpoint);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return defaultExercises;
    } catch {
      return defaultExercises;
    }
  },

  getExerciseById: async (id: string) => {
    try {
      const res = await api.get<{ success: boolean; data: Exercise }>(`/exercises/${id}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    const found = defaultExercises.find((e) => e.id === id);
    if (found) return found;
    throw new Error("Exercise not found");
  }
};

export const workoutService = {
  getPlans: async () => {
    try {
      const res = await api.get<{ success: boolean; data: WorkoutPlan[] }>("/workouts/plans");
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
      return defaultWorkoutPlans;
    } catch {
      return defaultWorkoutPlans;
    }
  },

  getTodayPlan: async () => {
    try {
      const res = await api.get<{ success: boolean; data: WorkoutPlan | null }>("/workouts/today");
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayId = daysMap[new Date().getDay()];
    return defaultWorkoutPlans.find((p) => p.id === todayId) || defaultWorkoutPlans[0];
  },

  saveSession: async (sessionData: {
    workoutPlanId?: string | null;
    title: string;
    durationSeconds: number;
    caloriesBurned: number;
    exercisesCompletedCount: number;
    notes?: string | null;
    sets: WorkoutSet[];
  }) => {
    const res = await api.post<{ success: boolean; message: string; data: WorkoutSession }>(
      "/workouts/sessions",
      sessionData
    );
    return res.data;
  },

  getHistory: async () => {
    const res = await api.get<{ success: boolean; count: number; data: WorkoutSession[] }>("/workouts/history");
    return res.data;
  },

  getSessionById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: WorkoutSession }>(`/workouts/sessions/${id}`);
    return res.data;
  }
};

export const runService = {
  saveRun: async (runData: {
    durationSeconds: number;
    distanceKm: number;
    avgPace: string;
    caloriesBurned: number;
    notes?: string | null;
    routePoints: RoutePoint[];
  }) => {
    const res = await api.post<{ success: boolean; message: string; data: Run }>("/runs", runData);
    return res.data;
  },

  getRuns: async () => {
    const res = await api.get<{ success: boolean; count: number; data: Run[] }>("/runs");
    return res.data;
  },

  getRunById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: Run }>(`/runs/${id}`);
    return res.data;
  },

  deleteRun: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/runs/${id}`);
    return res;
  }
};

export const progressService = {
  getSummary: async () => {
    const res = await api.get<{ success: boolean; data: ProgressSummary }>("/progress/summary");
    return res.data;
  },

  getAnalytics: async (timeframe: "7d" | "30d" | "90d" = "7d") => {
    const res = await api.get<{ success: boolean; timeframe: string; data: AnalyticsDataPoint[] }>(
      `/progress/analytics?timeframe=${timeframe}`
    );
    return res.data;
  }
};

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    try {
      const res = await api.get<any>("/dashboard");
      if (res && res.data) {
        if (res.data.stats) return res.data as DashboardData;
        if (res.data.data && res.data.data.stats) return res.data.data as DashboardData;
      }
    } catch {
      // Backend not running (e.g. static Vercel deployment)
    }

    const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayId = daysMap[new Date().getDay()];
    const todayPlanRaw = defaultWorkoutPlans.find((p) => p.id === todayId) || defaultWorkoutPlans[0];

    const fallbackData: DashboardData = {
      greeting: "Welcome back, Athlete 👋",
      user: {
        id: "usr_athlete",
        name: "Athlete",
        email: "athlete@fittrack.com",
        dailyCalorieTarget: 500,
        fitnessGoal: "Build muscle & endurance",
        runningGoal: "5K Run"
      },
      stats: {
        todayCalories: 0,
        dailyCalorieTarget: 500,
        calorieProgressPercent: 0,
        currentStreak: 1,
        totalWorkouts: 0,
        totalRunningDistance: 0
      },
      todayActivity: {
        hasDoneWorkout: false,
        hasDoneRun: false,
        todayPlan: {
          id: todayPlanRaw.id,
          title: todayPlanRaw.title,
          focus: todayPlanRaw.focus,
          duration: todayPlanRaw.duration,
          targetCalories: todayPlanRaw.targetCalories,
          exercisesCount: todayPlanRaw.exercises.length
        }
      },
      weeklyBreakdown: [
        { day: "Mon", calories: 0, minutes: 0, distanceKm: 0, active: false },
        { day: "Tue", calories: 0, minutes: 0, distanceKm: 0, active: false },
        { day: "Wed", calories: 0, minutes: 0, distanceKm: 0, active: false },
        { day: "Thu", calories: 0, minutes: 0, distanceKm: 0, active: false },
        { day: "Fri", calories: 0, minutes: 0, distanceKm: 0, active: false },
        { day: "Sat", calories: 0, minutes: 0, distanceKm: 0, active: false },
        { day: "Sun", calories: 0, minutes: 0, distanceKm: 0, active: false }
      ],
      recentActivity: []
    };

    return fallbackData;
  }
};

export const profileService = {
  getProfile: async () => {
    const res = await api.get<{ success: boolean; data: any }>("/profile");
    return res.data;
  },

  updateProfile: async (data: Partial<Profile> & { name?: string }) => {
    const res = await api.put<{ success: boolean; message: string; data: any }>("/profile", data);
    return res.data;
  },

  exportDataUrl: (format: "json" | "csv" | "gpx" = "json") => {
    const token = localStorage.getItem("fittrack_token");
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    return `${baseUrl}/profile/export?format=${format}&token=${token}`;
  },

  deleteAccount: async () => {
    const res = await api.delete<{ success: boolean; message: string }>("/profile/account");
    return res;
  }
};

export const settingsService = {
  getSettings: async () => {
    const res = await api.get<{ success: boolean; data: UserSettings }>("/settings");
    return res.data;
  },

  updateSettings: async (settings: Partial<UserSettings>) => {
    const res = await api.put<{ success: boolean; message: string; data: UserSettings }>("/settings", settings);
    return res.data;
  }
};

export const yoyoService = {
  saveTest: async (data: {
    testType?: string;
    finalLevel: number;
    finalShuttle: number;
    finalSpeed: number;
    distance: number;
    duration: number;
    calories: number;
    completedAt?: string;
  }) => {
    const res = await api.post<{ success: boolean; message: string; data: YoYoTest }>("/yoyo-tests", data);
    return res.data;
  },

  getTests: async () => {
    const res = await api.get<{ success: boolean; count: number; data: YoYoTest[] }>("/yoyo-tests");
    return res.data;
  },

  getTestById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: YoYoTest }>(`/yoyo-tests/${id}`);
    return res.data;
  }
};

