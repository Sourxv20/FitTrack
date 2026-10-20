export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  profile?: Profile;
  settings?: UserSettings;
}

export interface Profile {
  id: string;
  userId: string;
  avatarUrl?: string | null;
  height?: number | null; // cm
  weight?: number | null; // kg
  fitnessGoal?: string | null;
  runningGoal?: string | null;
  dailyCalorieTarget: number;
  bio?: string | null;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  units: "metric" | "imperial";
  notifications: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Legs" | "Core" | string;
  muscleGroup: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  description: string;
  instructions: string[];
  tips?: string[];
  mistakes?: string[];
  muscles?: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  animationType?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutPlanExercise {
  id: string;
  workoutPlanId: string;
  exerciseId: string;
  orderIndex: number;
  targetSets: number;
  targetReps: string;
  restSeconds: number;
  exercise: Exercise;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutPlan {
  id: string;
  dayOfWeek: string;
  shortDay: string;
  title: string;
  focus: string;
  description: string;
  duration: string;
  targetCalories: number;
  type: "Workout" | "Recovery" | "Rest";
  exercises: WorkoutPlanExercise[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkoutSet {
  id?: string;
  exerciseId: string;
  exercise?: { name: string; category: string; muscleGroup?: string };
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId?: string | null;
  workoutPlan?: WorkoutPlan | null;
  title: string;
  startedAt: string;
  completedAt?: string | null;
  durationSeconds: number;
  caloriesBurned: number;
  exercisesCompletedCount: number;
  notes?: string | null;
  sets: WorkoutSet[];
}

export interface RoutePoint {
  id?: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  speed?: number | null;
  timestamp?: string | number | Date | null;
  pointIndex: number;
}

export interface Run {
  id: string;
  userId: string;
  startedAt: string;
  completedAt?: string | null;
  durationSeconds: number;
  distanceKm: number;
  avgPace: string;
  caloriesBurned: number;
  notes?: string | null;
  routePoints?: RoutePoint[];
  _count?: { routePoints: number };
}

export interface YoYoTest {
  id: string;
  userId: string;
  testType: string;
  level?: string;
  finalLevel: number;
  finalShuttle: number;
  finalSpeed: number;
  distance: number;
  duration: number;
  calories: number;
  completedAt: string;
}

export interface YoYoChartPoint {
  testNumber: number;
  name: string;
  level: string;
  distance: number;
  speed: number;
  date: string;
}

export interface YoYoProgressStats {
  bestLevel: string | null;
  bestDistance: number | null;
  latestTest: YoYoTest | null;
  chartData: YoYoChartPoint[];
  history: YoYoTest[];
}

export interface DashboardData {
  greeting: string;
  user: {
    id: string;
    name: string;
    email: string;
    dailyCalorieTarget: number;
    fitnessGoal: string;
    runningGoal: string;
  };
  stats: {
    todayCalories: number;
    dailyCalorieTarget: number;
    calorieProgressPercent: number;
    currentStreak: number;
    totalWorkouts: number;
    totalRunningDistance: number;
  };
  todayActivity: {
    hasDoneWorkout: boolean;
    hasDoneRun: boolean;
    todayPlan: {
      id: string;
      title: string;
      focus: string;
      duration: string;
      targetCalories: number;
      exercisesCount: number;
    } | null;
  };
  weeklyBreakdown: Array<{
    day: string;
    calories: number;
    minutes: number;
    distanceKm: number;
    active: boolean;
  }>;
  recentActivity: Array<{
    id: string;
    type: "workout" | "run";
    title: string;
    date: string;
    durationMinutes: number;
    calories: number;
    detail: string;
  }>;
  latestYoYoTest?: {
    id: string;
    testType: string;
    level: string;
    finalLevel: number;
    finalShuttle: number;
    finalSpeed: number;
    distance: number;
    completedAt: string;
  } | null;
}

export interface ProgressSummary {
  totalWorkouts: number;
  totalRuns: number;
  totalYoYoTests?: number;
  totalCalories: number;
  totalDistanceKm: number;
  totalActiveMinutes: number;
  currentStreak: number;
  yoyo?: YoYoProgressStats;
}

export interface AnalyticsDataPoint {
  date: string;
  displayDate: string;
  workoutMinutes: number;
  runDistance: number;
  calories: number;
  workoutsCount: number;
  runsCount: number;
}
