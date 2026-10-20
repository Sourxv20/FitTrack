import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Search,
  Filter,
  Play,
  Calendar,
  Flame,
  Clock,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { exerciseService, workoutService } from "../../services/workoutService";
import { Exercise, WorkoutPlan } from "../../types";
import { ExerciseModal } from "../../components/ExerciseModal";
import { Skeleton } from "../../components/Skeleton";

export const Gym: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedDayId, setSelectedDayId] = useState<string>("monday");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inspectExercise, setInspectExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const categories = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Core"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, exData] = await Promise.all([
          workoutService.getPlans(),
          exerciseService.getExercises()
        ]);
        setPlans(plansData);
        setExercises(exData);

        // Auto-select today's day of week
        const daysMap = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const todayDay = daysMap[new Date().getDay()];
        if (plansData.some((p) => p.id === todayDay)) {
          setSelectedDayId(todayDay);
        }
      } catch (err) {
        console.error("Failed to load gym data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activePlan = useMemo(() => {
    return plans.find((p) => p.id === selectedDayId) || plans[0];
  }, [plans, selectedDayId]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesCategory =
        selectedCategory === "All" || ex.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesDifficulty =
        selectedDifficulty === "All" || ex.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [exercises, selectedCategory, selectedDifficulty, searchQuery]);

  const handleStartWorkout = () => {
    if (!activePlan) return;
    navigate(`/gym/workout/${activePlan.id}`);
  };

  const handleStartSingleExercise = (exercise: Exercise) => {
    navigate(`/gym/workout/custom?exerciseId=${exercise.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-28 shrink-0 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            GYM WORKOUT SYSTEM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] mt-0.5">
            Workout Plans & Exercises
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Follow your structured weekly training split or target specific muscle groups.
          </p>
        </div>

        {activePlan && activePlan.type !== "Rest" && (
          <button
            onClick={handleStartWorkout}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#FF6B4A] hover:bg-[#FA5A36] active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-[#FF6B4A]/25 transition-all cursor-pointer"
          >
            <Play size={16} className="fill-white text-white" />
            <span>Start {activePlan.title}</span>
          </button>
        )}
      </div>

      {/* Weekly Day Split Selector */}
      <div className="bg-[#0B1528] border border-white/10 rounded-3xl p-5 shadow-2xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          WEEKLY TRAINING SCHEDULE
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedDayId;
            const isRest = plan.type === "Rest";

            return (
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                key={plan.id}
                onClick={() => setSelectedDayId(plan.id)}
                className={`relative flex flex-col items-start p-3 rounded-2xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "border-[#FF6B4A] text-white"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeSplitIndicator"
                    className="absolute inset-0 bg-[#FF6B4A] rounded-2xl -z-0 shadow-lg shadow-[#FF6B4A]/30"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? "text-white" : "text-slate-400"}`}>
                    {plan.shortDay}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                  )}
                </div>

                <h4 className={`relative z-10 text-xs font-bold truncate w-full ${isSelected ? "text-white" : "text-slate-100"}`}>
                  {plan.title}
                </h4>

                <span className={`relative z-10 text-[10px] mt-1 font-medium truncate w-full ${isSelected ? "text-white/80" : isRest ? "text-slate-400" : "text-slate-400"}`}>
                  {isRest ? "Active Rest" : `${plan.exercises.length} exercises`}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Banner */}
      <AnimatePresence mode="wait">
        {activePlan && (
          <motion.div
            key={activePlan.id}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#080D1A] text-white rounded-3xl p-7 shadow-2xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#FF6B4A]/15 text-[#FF6B4A] border border-[#FF6B4A]/30 text-[10px] font-black uppercase tracking-wider">
                  {activePlan.dayOfWeek} Split
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {activePlan.type}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans'] text-white">
                {activePlan.title}
              </h2>

              <p className="text-sm text-cyan-400 mt-1 font-bold">
                {activePlan.focus}
              </p>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activePlan.description}
              </p>

              {activePlan.type !== "Rest" ? (
                <div className="flex flex-wrap items-center gap-5 mt-6 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Clock size={16} className="text-cyan-400" />
                    <span>{activePlan.duration}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Flame size={16} className="text-amber-400" />
                    <span>~{activePlan.targetCalories} kcal</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Dumbbell size={16} className="text-emerald-400" />
                    <span>{activePlan.exercises.length} Exercises Scheduled</span>
                  </div>

                  <button
                    onClick={handleStartWorkout}
                    className="ml-auto flex items-center gap-2 px-6 py-3 bg-[#FF6B4A] text-white hover:bg-[#FA5A36] font-black text-xs rounded-2xl shadow-lg shadow-[#FF6B4A]/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <Play size={14} className="fill-white text-white" />
                    <span>START SESSION NOW</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-300">
                  🌱 Active recovery day. Hydrate, perform gentle mobility stretches, or take a light recovery walk.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Catalog & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              EXERCISE LIBRARY
            </span>
            <h3 className="text-lg font-bold text-white">
              Explore & Filter Movements ({filteredExercises.length})
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise, muscle, barbell..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1528] border border-white/10 rounded-2xl text-xs sm:text-sm focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] focus:outline-none text-white placeholder-slate-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Filter Pills with animated glider */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Muscle:
          </span>
          {categories.map((cat) => {
            const isCatSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isCatSelected
                    ? "text-white"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isCatSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#FF6B4A] rounded-xl -z-0 shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? "bg-slate-700 text-white"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="bg-[#0B1528] border border-white/10 rounded-3xl p-12 text-center text-slate-400 shadow-2xl">
            <Dumbbell size={36} className="mx-auto mb-3 opacity-40 text-slate-500" />
            <h4 className="text-sm font-bold text-white">No exercises found</h4>
            <p className="text-xs mt-1 text-slate-400">Try clearing your filters or search terms.</p>
          </div>
        ) : (
          <motion.div
            layout
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredExercises.map((ex) => (
              <motion.div
                layout
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                }}
                key={ex.id}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-[#0B1528] border border-white/10 rounded-3xl p-5 shadow-2xl hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/60 text-sky-400 border border-blue-800/60">
                      {ex.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {ex.difficulty}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug">
                    {ex.name}
                  </h4>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {ex.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mt-3 pt-3 border-t border-white/10">
                    <span>{ex.sets} Sets</span>
                    <span>•</span>
                    <span>{ex.reps} Reps</span>
                    <span>•</span>
                    <span className="text-slate-400">{ex.equipment}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-2">
                  <button
                    onClick={() => setInspectExercise(ex)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    <Info size={14} />
                    View Technique
                  </button>

                  <button
                    onClick={() => handleStartSingleExercise(ex)}
                    className="p-2 rounded-xl bg-[#FF6B4A] hover:bg-[#FA5A36] text-white transition-colors shadow-sm cursor-pointer"
                    title="Start this exercise in Workout Mode"
                  >
                    <Play size={14} className="fill-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Technique Modal */}
      <ExerciseModal
        exercise={inspectExercise}
        isOpen={!!inspectExercise}
        onClose={() => setInspectExercise(null)}
        onStartExercise={handleStartSingleExercise}
      />
    </div>
  );
};