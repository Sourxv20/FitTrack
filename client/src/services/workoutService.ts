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

const defaultSampleRuns: Run[] = [
  {
    id: "run_sample_1",
    userId: "usr_athlete",
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 1620000).toISOString(),
    durationSeconds: 1620,
    distanceKm: 5.24,
    avgPace: "5:09 /km",
    caloriesBurned: 385,
    notes: "Outdoor tempo run around city perimeter.",
    routePoints: [
      { latitude: 28.6139, longitude: 77.209, pointIndex: 0 },
      { latitude: 28.6149, longitude: 77.2105, pointIndex: 1 },
      { latitude: 28.6165, longitude: 77.212, pointIndex: 2 },
      { latitude: 28.618, longitude: 77.211, pointIndex: 3 },
      { latitude: 28.617, longitude: 77.2085, pointIndex: 4 },
      { latitude: 28.6145, longitude: 77.208, pointIndex: 5 },
      { latitude: 28.6139, longitude: 77.209, pointIndex: 6 }
    ]
  },
  {
    id: "run_sample_2",
    userId: "usr_athlete",
    startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 5 + 1140000).toISOString(),
    durationSeconds: 1140,
    distanceKm: 3.42,
    avgPace: "5:33 /km",
    caloriesBurned: 248,
    notes: "Interval strides and aerobic recovery run.",
    routePoints: [
      { latitude: 28.6139, longitude: 77.209, pointIndex: 0 },
      { latitude: 28.6155, longitude: 77.211, pointIndex: 1 },
      { latitude: 28.6168, longitude: 77.213, pointIndex: 2 },
      { latitude: 28.6139, longitude: 77.209, pointIndex: 3 }
    ]
  }
];

const LOCAL_RUNS_KEY = "fittrack_saved_runs";

function getLocalRuns(): Run[] {
  try {
    const raw = localStorage.getItem(LOCAL_RUNS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return defaultSampleRuns;
}

function saveLocalRuns(runs: Run[]) {
  try {
    localStorage.setItem(LOCAL_RUNS_KEY, JSON.stringify(runs));
  } catch (e) {
    console.warn("Failed to persist runs locally", e);
  }
}

export const runService = {
  saveRun: async (runData: {
    durationSeconds: number;
    distanceKm: number;
    avgPace: string;
    caloriesBurned: number;
    notes?: string | null;
    routePoints: RoutePoint[];
  }): Promise<{ success: boolean; message: string; data: Run }> => {
    const newRun: Run = {
      id: "run_" + Math.random().toString(36).substring(2, 9),
      userId: "usr_athlete",
      startedAt: new Date(Date.now() - runData.durationSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: runData.durationSeconds,
      distanceKm: runData.distanceKm,
      avgPace: runData.avgPace,
      caloriesBurned: runData.caloriesBurned,
      notes: runData.notes || "Completed outdoor GPS run.",
      routePoints: runData.routePoints
    };

    try {
      const res = await api.post<any>("/runs", runData);
      if (res && res.data) {
        const saved = res.data.data || res.data;
        const currentRuns = getLocalRuns();
        saveLocalRuns([saved, ...currentRuns.filter((r) => r.id !== saved.id)]);
        return { success: true, message: "Run saved successfully!", data: saved };
      }
    } catch {
      // Backend not running / Vercel static fallback
    }

    const currentRuns = getLocalRuns();
    saveLocalRuns([newRun, ...currentRuns]);
    return {
      success: true,
      message: "Run saved successfully!",
      data: newRun
    };
  },

  getRuns: async (): Promise<Run[]> => {
    try {
      const res = await api.get<any>("/runs");
      if (res) {
        if (Array.isArray(res.data)) {
          saveLocalRuns(res.data);
          return res.data;
        }
        if (Array.isArray(res)) {
          saveLocalRuns(res);
          return res;
        }
      }
    } catch {
      // Backend not running / Vercel static fallback
    }
    return getLocalRuns();
  },

  getRunById: async (id: string): Promise<Run> => {
    try {
      const res = await api.get<any>(`/runs/${id}`);
      if (res && res.data) {
        return res.data.data || res.data;
      }
    } catch {
      // ignore
    }
    const current = getLocalRuns();
    const found = current.find((r) => r.id === id);
    if (found) return found;
    return defaultSampleRuns[0];
  },

  deleteRun: async (id: string) => {
    try {
      await api.delete<{ success: boolean; message: string }>(`/runs/${id}`);
    } catch {
      // ignore
    }
    const current = getLocalRuns();
    saveLocalRuns(current.filter((r) => r.id !== id));
    return { success: true, message: "Run deleted successfully." };
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

const defaultSampleYoYoTests: YoYoTest[] = [
  {
    id: "yoyo_sample_1",
    userId: "usr_athlete",
    testType: "Yo-Yo IR1",
    level: "Level 16.3",
    finalLevel: 16,
    finalShuttle: 3,
    finalSpeed: 16.5,
    distance: 1240,
    duration: 540,
    calories: 145,
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const LOCAL_YOYO_KEY = "fittrack_saved_yoyo_tests";

function getLocalYoYoTests(): YoYoTest[] {
  try {
    const raw = localStorage.getItem(LOCAL_YOYO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return defaultSampleYoYoTests;
}

function saveLocalYoYoTests(tests: YoYoTest[]) {
  try {
    localStorage.setItem(LOCAL_YOYO_KEY, JSON.stringify(tests));
  } catch (e) {
    console.warn("Failed to persist Yo-Yo tests locally", e);
  }
}

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
  }): Promise<YoYoTest> => {
    const newTest: YoYoTest = {
      id: "yoyo_" + Math.random().toString(36).substring(2, 9),
      userId: "usr_athlete",
      testType: data.testType || "Yo-Yo IR1",
      level: `Level ${data.finalLevel}.${data.finalShuttle}`,
      finalLevel: data.finalLevel,
      finalShuttle: data.finalShuttle,
      finalSpeed: data.finalSpeed,
      distance: data.distance,
      duration: data.duration,
      calories: data.calories,
      completedAt: data.completedAt || new Date().toISOString()
    };

    try {
      const res = await api.post<any>("/yoyo-tests", data);
      if (res && res.data) {
        const saved: YoYoTest = res.data.data || res.data;
        const currentTests = getLocalYoYoTests();
        saveLocalYoYoTests([saved, ...currentTests.filter((t) => t.id !== saved.id)]);
        return saved;
      }
    } catch {
      // Fallback
    }

    const currentTests = getLocalYoYoTests();
    saveLocalYoYoTests([newTest, ...currentTests]);
    return newTest;
  },

  getTests: async (): Promise<YoYoTest[]> => {
    try {
      const res = await api.get<any>("/yoyo-tests");
      if (res) {
        if (Array.isArray(res.data)) {
          saveLocalYoYoTests(res.data);
          return res.data;
        }
        if (Array.isArray(res)) {
          saveLocalYoYoTests(res);
          return res;
        }
      }
    } catch {
      // Fallback
    }
    return getLocalYoYoTests();
  },

  getTestById: async (id: string): Promise<YoYoTest> => {
    try {
      const res = await api.get<any>(`/yoyo-tests/${id}`);
      if (res && res.data) {
        return res.data.data || res.data;
      }
    } catch {
      // Fallback
    }
    const current = getLocalYoYoTests();
    const found = current.find((t) => t.id === id);
    if (found) return found;
    return defaultSampleYoYoTests[0];
  }
};

