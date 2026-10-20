import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Dumbbell,
  Footprints,
  Flame,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight,
  Filter,
  Trophy,
  Zap
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { progressService, workoutService, runService } from "../../services/workoutService";
import { ProgressSummary, AnalyticsDataPoint, WorkoutSession, Run } from "../../types";
import { StatsCard } from "../../components/StatsCard";
import { CardSkeleton, Skeleton } from "../../components/Skeleton";
import { formatDuration } from "../../utils/formatters";
import { AnimatedNumber } from "../../components/AnimatedCounter";

export const Progress: React.FC = () => {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("7d");
  const [activeTab, setActiveTab] = useState<"charts" | "workouts" | "runs" | "yoyo">("charts");

  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [runHistory, setRunHistory] = useState<Run[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [sum, anal, workouts, runs] = await Promise.all([
          progressService.getSummary(),
          progressService.getAnalytics(timeframe),
          workoutService.getHistory(),
          runService.getRuns()
        ]);
        setSummary(sum);
        setAnalytics(anal);
        setWorkoutHistory(workouts);
        setRunHistory(runs);
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  const s = summary || {
    totalWorkouts: 0,
    totalRuns: 0,
    totalCalories: 0,
    totalDistanceKm: 0,
    totalActiveMinutes: 0,
    currentStreak: 0
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            FITNESS PROGRESS ANALYTICS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] mt-0.5">
            Progress & Performance
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Real data from your logged gym workouts and outdoor GPS runs.
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm self-start sm:self-auto">
          {(["7d", "30d", "90d"] as const).map((tf) => {
            const isTfActive = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isTfActive
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isTfActive && (
                  <motion.div
                    layoutId="activeTimeframeIndicator"
                    className="absolute inset-0 bg-blue-600 rounded-lg -z-0 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tf.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Workouts</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            <AnimatedNumber value={s.totalWorkouts} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Sessions</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Runs</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            <AnimatedNumber value={s.totalRuns} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">GPS tracked</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Distance</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            <AnimatedNumber value={s.totalDistanceKm} decimals={2} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">km covered</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Burn</span>
          <div className="text-2xl font-extrabold text-amber-500 font-mono">
            <AnimatedNumber value={s.totalCalories} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">kcal burned</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-400/30 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Time</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            <AnimatedNumber value={s.totalActiveMinutes} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">minutes</span>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Streak</span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
            <AnimatedNumber value={s.currentStreak} />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">days active</span>
        </motion.div>
      </div>

      {/* Yo-Yo Endurance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:border-emerald-500/30 transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Trophy size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Yo-Yo Level</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {s.yoyo?.bestLevel || "—"}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Yo-Yo IR1 Protocol</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:border-blue-500/30 transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Zap size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Best Yo-Yo Distance</span>
            <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
              {s.yoyo?.bestDistance ? `${s.yoyo.bestDistance} m` : "—"}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              {s.yoyo?.bestDistance ? `${(s.yoyo.bestDistance / 1000).toFixed(2)} km covered` : "No tests yet"}
            </span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:border-amber-500/30 transition-all flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Latest Yo-Yo Test</span>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {s.yoyo?.latestTest ? (s.yoyo.latestTest.level || `Level ${s.yoyo.latestTest.finalLevel}.${s.yoyo.latestTest.finalShuttle}`) : "—"}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              {s.yoyo?.latestTest ? `${s.yoyo.latestTest.distance} m (${s.yoyo.latestTest.finalSpeed.toFixed(1)} km/h)` : "Take test in Running"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Tabs Selector: Charts vs Workouts History vs Runs History vs Yo-Yo Tests */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 relative overflow-x-auto">
        {(
          [
            { id: "charts", label: "Analytics & Trends" },
            { id: "workouts", label: `Gym Logs (${workoutHistory.length})` },
            { id: "runs", label: `Running Logs (${runHistory.length})` },
            { id: "yoyo", label: `Yo-Yo Tests (${s.yoyo?.history?.length || 0})` }
          ] as const
        ).map((tab) => {
          const isTabActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 px-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0 ${
                isTabActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {isTabActive && (
                <motion.div
                  layoutId="activeProgressTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {/* Tab 1: Recharts Interactive Analytics */}
          {activeTab === "charts" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Calories Burned Progression */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TREND</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Calorie Burn</h3>
              </div>
              <span className="text-xs font-bold text-amber-500 font-mono">kcal</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="calColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Area type="monotone" dataKey="calories" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#calColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Running Distance Progression */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DISTANCE</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Running Distance (km)</h3>
              </div>
              <span className="text-xs font-bold text-blue-600 font-mono">km</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Bar dataKey="runDistance" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Active Workout Duration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TIME</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Gym Workout Time (minutes)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 font-mono">mins</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="timeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Area type="monotone" dataKey="workoutMinutes" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#timeColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Yo-Yo Intermittent Recovery Performance Over Time */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  ENDURANCE & RECOVERY
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Yo-Yo Test Performance Over Time (Distance in Meters)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">meters</span>
            </div>

            {s.yoyo?.chartData && s.yoyo.chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s.yoyo.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="yoyoColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0F172A",
                        border: "none",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px"
                      }}
                      formatter={(val: any, _name: any, item: any) => [
                        `${val} meters (${item.payload.level} • ${item.payload.speed} km/h)`,
                        "Shuttle Distance"
                      ]}
                    />
                    <Bar dataKey="distance" fill="url(#yoyoColor)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <Trophy size={28} className="text-slate-400 mb-2 opacity-60" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No Yo-Yo tests recorded yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  Complete your first Yo-Yo IR1 test under the Running section to chart your intermittent recovery progress over time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

          {/* Tab 2: Workout Sessions History */}
          {activeTab === "workouts" && (
            <div className="space-y-3">
              {workoutHistory.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                  <Dumbbell size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No gym workouts recorded yet</p>
                  <p className="text-xs mt-1">Start a workout in the Gym tab to record your training history.</p>
                </div>
              ) : (
                workoutHistory.map((w) => (
                  <motion.div
                    whileHover={{ y: -3 }}
                    key={w.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Dumbbell size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {w.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {new Date(w.startedAt).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
                        <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          {Math.round(w.durationSeconds / 60)} min
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Calories</span>
                        <span className="font-bold font-mono text-sm text-amber-500">
                          {w.caloriesBurned} kcal
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Volume</span>
                        <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                          {w.sets?.length || 0} sets
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Running Logs History */}
          {activeTab === "runs" && (
            <div className="space-y-3">
              {runHistory.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                  <Footprints size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No runs recorded yet</p>
                  <p className="text-xs mt-1">Start an outdoor GPS run to track route and pace.</p>
                </div>
              ) : (
                runHistory.map((r) => (
                  <motion.div
                    whileHover={{ y: -3 }}
                    key={r.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Footprints size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {r.distanceKm.toFixed(2)} km Run
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {new Date(r.startedAt).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
                        <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          {formatDuration(r.durationSeconds)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Pace</span>
                        <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          {r.avgPace}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Burn</span>
                        <span className="font-bold font-mono text-sm text-amber-500">
                          {r.caloriesBurned} kcal
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab 4: Yo-Yo Tests History */}
          {activeTab === "yoyo" && (
            <div className="space-y-3">
              {!s.yoyo?.history || s.yoyo.history.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                  <Trophy size={36} className="mx-auto mb-2 opacity-40 text-emerald-500" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No Yo-Yo tests recorded yet</p>
                  <p className="text-xs mt-1">Start a 20m shuttle test in the Running section to record your endurance benchmark.</p>
                </div>
              ) : (
                s.yoyo.history.map((t) => (
                  <motion.div
                    whileHover={{ y: -3 }}
                    key={t.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Trophy size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {t.level || `Level ${t.finalLevel}.${t.finalShuttle}`}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                            {t.testType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {new Date(t.completedAt).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Distance</span>
                        <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          {t.distance} m
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Final Speed</span>
                        <span className="font-bold font-mono text-sm text-emerald-600 dark:text-emerald-400">
                          {t.finalSpeed.toFixed(1)} km/h
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Duration</span>
                        <span className="font-bold font-mono text-sm text-slate-900 dark:text-white">
                          {formatDuration(t.duration)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Burn</span>
                        <span className="font-bold font-mono text-sm text-amber-500">
                          {t.calories} kcal
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};