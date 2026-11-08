import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flame,
  Dumbbell,
  Footprints,
  ArrowRight,
  TrendingUp,
  Clock,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Trophy,
  Target,
  ChevronRight,
  Activity,
  Layers
} from "lucide-react";
import { dashboardService } from "../../services/workoutService";
import { DashboardData } from "../../types";
import { ActivityRing } from "../../components/ActivityRing";
import { CardSkeleton } from "../../components/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/formatters";
import { SpatialCard } from "../../components/SpatialCard";

// Animated counter for dynamic telemetry readouts
const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  decimals?: number;
}> = ({ value, suffix = "", decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Number(start.toFixed(decimals)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, decimals]);

  return (
    <span>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboard();
        setData(res);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="h-16 w-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    todayCalories: 0,
    dailyCalorieTarget: 500,
    calorieProgressPercent: 0,
    currentStreak: 0,
    totalWorkouts: 0,
    totalRunningDistance: 0
  };

  const todayPlan = data?.todayActivity?.todayPlan;
  const recentActivity = data?.recentActivity || [];
  const weeklyBreakdown = data?.weeklyBreakdown || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" as const }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* 1. Header Bar: Athlete Greeting & Spatial Action Pills */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 spatial-glass p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="pointer-events-none absolute top-0 left-1/4 w-72 h-32 bg-purple-500/10 blur-2xl" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-purple-500/25 shrink-0 select-none ring-1 ring-white/20">
            {getInitials(user?.name) || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                SPATIAL ATHLETE OVERVIEW
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] mt-0.5">
              {data?.greeting || `Welcome, ${user?.name?.split(" ")[0]} 👋`}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Train Smarter. Run Stronger.
            </p>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-3 relative z-10">
          <Link
            to="/gym"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
          >
            <Dumbbell size={17} className="text-white" />
            <span>START WORKOUT</span>
          </Link>

          <Link
            to="/running"
            className="flex items-center gap-2 px-5 py-3 spatial-pill active:scale-95 text-white text-xs sm:text-sm font-black rounded-2xl transition-all cursor-pointer"
          >
            <Footprints size={17} className="text-cyan-400" />
            <span>GPS RUN</span>
          </Link>
        </div>
      </motion.div>

      {/* 2. Bento Hero Row: "Today's Mission" + "Daily Activity Ring" in 3D Spatial Glass Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: "Today's Mission" Editorial Workout Card (2 cols) */}
        <SpatialCard
          glowColor="coral"
          depth="lg"
          className="lg:col-span-2 spatial-glass text-white p-7 sm:p-9 shadow-2xl flex flex-col justify-between group"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-purple-600/25 transition-all duration-700" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#FF6B4A]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Card Header Tags */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FF6B4A]/15 border border-[#FF6B4A]/40 text-[#FF6B4A] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,107,74,0.3)]">
                <Target size={13} />
                <span>TODAY'S MISSION</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                {todayPlan ? todayPlan.focus : "Full Body Hypertrophy"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Clock size={14} className="text-cyan-400" />
              <span>{todayPlan?.duration || "45 Minutes"}</span>
            </div>
          </div>

          {/* Workout Title & Focus */}
          <div className="relative z-10 my-4 space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-tight">
              {todayPlan ? todayPlan.title : "Chest & Triceps Power Blast"}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Focus on progressive overload with structured sets, maximum contraction, and disciplined form.
            </p>

            {/* Target Muscle Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-3">
              <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
                • {todayPlan ? todayPlan.focus : "Upper Body"}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                {todayPlan?.exercisesCount || 5} Exercises Scheduled
              </span>
            </div>
          </div>

          {/* Bottom Action Row */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400">
                <Activity size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                  Target Calorie Burn
                </span>
                <span className="text-sm font-black text-white font-mono">
                  ~{todayPlan?.targetCalories || 420} kcal
                </span>
              </div>
            </div>

            <Link
              to="/gym"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-[#FF6B4A] to-[#FA5A36] hover:brightness-110 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-[#FF6B4A]/25 transition-all cursor-pointer group/btn"
            >
              <Play size={16} className="fill-white" />
              <span>START SESSION NOW</span>
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </SpatialCard>

        {/* Right: "Daily Target Activity Ring" (1 col) */}
        <SpatialCard
          glowColor="purple"
          depth="md"
          className="spatial-glass p-6 sm:p-7 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                DAILY METRICS
              </span>
              <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
                Activity Goal
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/30">
              {stats.calorieProgressPercent}% Complete
            </span>
          </div>

          {/* Circular SVG Ring Display */}
          <div className="my-4 flex justify-center">
            <ActivityRing
              todayCalories={stats.todayCalories}
              calorieTarget={stats.dailyCalorieTarget}
              calorieProgress={stats.calorieProgressPercent}
              activeMinutesProgress={Math.min(100, Math.round((stats.todayCalories / Math.max(1, stats.dailyCalorieTarget)) * 90))}
              size={180}
              strokeWidth={15}
            />
          </div>

          {/* Metric Breakdown Badges */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B4A]" />
                <span>Burned Energy</span>
              </span>
              <span className="font-mono font-black text-white">
                {stats.todayCalories} kcal
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Daily Target</span>
              </span>
              <span className="font-mono font-bold text-slate-400">
                {stats.dailyCalorieTarget} kcal
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Active Streak</span>
              </span>
              <span className="font-mono font-bold text-purple-400">
                {stats.currentStreak} Days
              </span>
            </div>
          </div>
        </SpatialCard>
      </motion.div>

      {/* 3. Bento Metrics Grid: 4 Interactive 3D Spatial Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Calories */}
        <SpatialCard
          glowColor="coral"
          depth="md"
          className="spatial-glass p-5 shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Active Burn
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(255,107,74,0.3)]">
              <Flame size={20} className="fill-current" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              <AnimatedCounter value={stats.todayCalories} />
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">/ {stats.dailyCalorieTarget} kcal</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#FF6B4A] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(255,107,74,0.8)]"
              style={{ width: `${Math.min(100, stats.calorieProgressPercent)}%` }}
            />
          </div>
        </SpatialCard>

        {/* Metric 2: Streak */}
        <SpatialCard
          glowColor="purple"
          depth="md"
          className="spatial-glass p-5 shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Discipline Streak
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(168,85,247,0.3)]">
              <Trophy size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              <AnimatedCounter value={stats.currentStreak} />
            </span>
            <span className="text-xs font-bold text-slate-400">Days Active</span>
          </div>
          <p className="text-xs font-semibold text-purple-300 mt-3 truncate">
            {stats.currentStreak > 0 ? "🔥 Momentum locked in!" : "Start your streak today!"}
          </p>
        </SpatialCard>

        {/* Metric 3: Total Workouts */}
        <SpatialCard
          glowColor="cyan"
          depth="md"
          className="spatial-glass p-5 shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Gym Sessions
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Dumbbell size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              <AnimatedCounter value={stats.totalWorkouts} />
            </span>
            <span className="text-xs font-bold text-slate-400">Completed</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-3">
            Resistance & hypertrophy
          </p>
        </SpatialCard>

        {/* Metric 4: Running Distance */}
        <SpatialCard
          glowColor="emerald"
          depth="md"
          className="spatial-glass p-5 shadow-lg group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Road Mileage
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Footprints size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              <AnimatedCounter value={stats.totalRunningDistance} decimals={2} />
            </span>
            <span className="text-xs font-bold text-slate-400">Kilometers</span>
          </div>
          <p className="text-xs font-semibold text-emerald-400 mt-3">
            GPS outdoor tracking
          </p>
        </SpatialCard>
      </motion.div>

      {/* 4. Training Modes Quick-Launch Cards */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              PILLARS OF FITTRACK
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Choose Your Discipline
            </h2>
          </div>
          <Link
            to="/gym"
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 group"
          >
            <span>Explore all workouts</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Gym Splits Card */}
          <SpatialCard glowColor="purple" depth="md">
            <Link
              to="/gym"
              className="group relative spatial-glass rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between h-52 block w-full"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all shadow-[0_0_12px_rgba(168,85,247,0.25)]">
                  <Dumbbell size={26} />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-black uppercase tracking-wider border border-purple-500/30">
                  RESISTANCE
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-white font-['Plus_Jakarta_Sans'] group-hover:text-purple-300 transition-colors">
                  Gym Workout Splits
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Full 7-day splits with live set & rep tracking.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold text-purple-400">
                <span>Enter Gym Mode</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </SpatialCard>

          {/* GPS Outdoor Run Card */}
          <SpatialCard glowColor="cyan" depth="md">
            <Link
              to="/running"
              className="group relative spatial-glass rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between h-52 block w-full"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 group-hover:text-white transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                  <Footprints size={26} />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
                  LIVE GPS
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-white font-['Plus_Jakarta_Sans'] group-hover:text-cyan-300 transition-colors">
                  Outdoor GPS Run
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time satellite mapping, live pace & route polyline.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold text-cyan-400">
                <span>Open Map & Track</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </SpatialCard>

          {/* Yo-Yo IR1 Test Card */}
          <SpatialCard glowColor="emerald" depth="md">
            <Link
              to="/running"
              className="group relative spatial-glass rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between h-52 block w-full"
            >
              <div className="flex items-start justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:text-white transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  <Zap size={26} />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  IR1 TEST
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-white font-['Plus_Jakarta_Sans'] group-hover:text-emerald-300 transition-colors">
                  Yo-Yo Recovery Test
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {data?.latestYoYoTest
                    ? `Best: Level ${data.latestYoYoTest.finalLevel}.${data.latestYoYoTest.finalShuttle} • ${data.latestYoYoTest.distance}m`
                    : "Bangsbo 20m timed audio shuttle assessment."}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-bold text-emerald-400">
                <span>Take Yo-Yo Test</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </SpatialCard>
        </div>
      </motion.div>

      {/* 5. Bento Row 4: Weekly Distribution & Recent History Timeline */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Bars (2 cols) */}
        <div className="lg:col-span-2 spatial-glass rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                WEEKLY CADENCE
              </span>
              <h3 className="text-base font-black text-white font-['Plus_Jakarta_Sans']">
                Calorie & Volume Distribution
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Monday – Sunday
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4">
            {weeklyBreakdown.map((item, idx) => {
              const maxCal = Math.max(...weeklyBreakdown.map((b) => b.calories), 500);
              const heightPercent = Math.min(100, Math.max(10, (item.calories / maxCal) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {item.calories > 0 ? `${item.calories}` : ""}
                  </span>
                  <div className="w-full max-w-[38px] bg-white/5 rounded-2xl h-32 relative flex items-end justify-center overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.calories > 0 ? heightPercent : 0}%` }}
                      transition={{ type: "spring", stiffness: 220, damping: 20, delay: idx * 0.04 }}
                      className={`w-full rounded-2xl transition-all ${
                        item.active
                          ? "bg-gradient-to-t from-purple-600 via-indigo-600 to-cyan-400 shadow-md shadow-purple-500/30 group-hover:brightness-125"
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-black ${
                      item.active ? "text-cyan-400" : "text-slate-400"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline (1 col) */}
        <div className="spatial-glass rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  ACTIVITY LOG
                </span>
                <h3 className="text-base font-black text-white font-['Plus_Jakarta_Sans']">
                  Recent Feats
                </h3>
              </div>
              <Link
                to="/progress"
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 4).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          act.type === "workout"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {act.type === "workout" ? (
                          <Dumbbell size={16} />
                        ) : (
                          <Footprints size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-white truncate">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {act.detail || `${act.durationMinutes} min • ${act.calories} kcal`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-300 shrink-0">
                      +{act.calories} cal
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs font-semibold text-slate-400">
                  No sessions logged yet. Hit "START WORKOUT" above!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Keep pushing athlete</span>
            <Link to="/progress" className="font-bold text-cyan-400 hover:underline">
              Analytics →
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
