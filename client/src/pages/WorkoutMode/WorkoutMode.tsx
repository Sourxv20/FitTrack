import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  X,
  Play,
  Pause,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Clock,
  Flame,
  Award,
  ArrowRight,
  Dumbbell,
  Video,
  Info,
  Sparkles
} from "lucide-react";
import { workoutService, exerciseService } from "../../services/workoutService";
import { Exercise, WorkoutPlan, WorkoutSet } from "../../types";
import { formatDuration } from "../../utils/formatters";
import { useToast } from "../../context/ToastContext";
import { ExerciseAnimation } from "../../components/ExerciseAnimation";
import { playRestTimerBeep } from "../../utils/audio";

interface ActiveExercise {
  exercise: Exercise;
  sets: Array<{
    setNumber: number;
    weightKg: number;
    reps: number;
    completed: boolean;
  }>;
}

export const WorkoutMode: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const customExerciseId = searchParams.get("exerciseId");

  const [workoutTitle, setWorkoutTitle] = useState<string>("Active Workout");
  const [exercisesList, setExercisesList] = useState<ActiveExercise[]>([]);
  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);

  // Timers
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [totalRestDuration, setTotalRestDuration] = useState<number>(90);

  // Completion modal
  const [isWorkoutComplete, setIsWorkoutComplete] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);

  // Micro-animations
  const [justCompletedSet, setJustCompletedSet] = useState<boolean>(false);

  // Exercise Demo View: animation | video | guide
  const [demoMode, setDemoMode] = useState<"animation" | "video" | "guide">("animation");

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load workout plan or custom exercise
  useEffect(() => {
    const initialize = async () => {
      try {
        if (customExerciseId) {
          const ex = await exerciseService.getExerciseById(customExerciseId);
          setWorkoutTitle(ex.name);
          setExercisesList([
            {
              exercise: ex,
              sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
                setNumber: i + 1,
                weightKg: 50,
                reps: 10,
                completed: false
              }))
            }
          ]);
        } else if (planId) {
          const plans = await workoutService.getPlans();
          const targetPlan = plans.find((p) => p.id === planId) || plans[0];
          setWorkoutTitle(targetPlan.title);

          const list: ActiveExercise[] = targetPlan.exercises.map((pe) => ({
            exercise: pe.exercise,
            sets: Array.from({ length: pe.targetSets || 3 }, (_, i) => ({
              setNumber: i + 1,
              weightKg: 50,
              reps: parseInt(pe.targetReps.split("-")[0]) || 10,
              completed: false
            }))
          }));
          setExercisesList(list);
        }
      } catch (err) {
        console.error("Failed to initialize workout:", err);
        showToast("Error loading workout session.", "error");
        navigate("/gym");
      }
    };

    initialize();
  }, [planId, customExerciseId]);

  // Main Elapsed Timer
  useEffect(() => {
    if (isPaused || isWorkoutComplete) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isWorkoutComplete]);

  // Rest Timer Countdown
  useEffect(() => {
    if (!isResting || restSecondsLeft <= 0) {
      if (isResting && restSecondsLeft <= 0) {
        setIsResting(false);
        playRestTimerBeep();
        showToast("Rest time is up! Ready for your next set.", "info");
      }
      return;
    }

    const timer = setInterval(() => {
      setRestSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  const currentExercise = exercisesList[currentExIndex];
  const currentSet = currentExercise?.sets[currentSetIndex];

  // Adjust Weight
  const handleWeightChange = (delta: number) => {
    if (!currentExercise || !currentSet) return;
    setExercisesList((prev) => {
      const copy = [...prev];
      const targetEx = { ...copy[currentExIndex] };
      const setsCopy = [...targetEx.sets];
      setsCopy[currentSetIndex] = {
        ...setsCopy[currentSetIndex],
        weightKg: Math.max(0, Math.round((setsCopy[currentSetIndex].weightKg + delta) * 10) / 10)
      };
      targetEx.sets = setsCopy;
      copy[currentExIndex] = targetEx;
      return copy;
    });
  };

  // Adjust Reps
  const handleRepsChange = (delta: number) => {
    if (!currentExercise || !currentSet) return;
    setExercisesList((prev) => {
      const copy = [...prev];
      const targetEx = { ...copy[currentExIndex] };
      const setsCopy = [...targetEx.sets];
      setsCopy[currentSetIndex] = {
        ...setsCopy[currentSetIndex],
        reps: Math.max(1, setsCopy[currentSetIndex].reps + delta)
      };
      targetEx.sets = setsCopy;
      copy[currentExIndex] = targetEx;
      return copy;
    });
  };

  // Add Set to Current Exercise
  const handleAddSet = () => {
    if (!currentExercise) return;
    setExercisesList((prev) => {
      const copy = [...prev];
      const targetEx = { ...copy[currentExIndex] };
      const nextSetNum = targetEx.sets.length + 1;
      const lastSet = targetEx.sets[targetEx.sets.length - 1];
      targetEx.sets.push({
        setNumber: nextSetNum,
        weightKg: lastSet ? lastSet.weightKg : 50,
        reps: lastSet ? lastSet.reps : 10,
        completed: false
      });
      copy[currentExIndex] = targetEx;
      return copy;
    });
    showToast(`Set ${currentExercise.sets.length + 1} added`, "info");
  };

  // Complete Current Set
  const handleCompleteSet = () => {
    if (!currentExercise || !currentSet) return;

    // Mark current set completed
    setExercisesList((prev) => {
      const copy = [...prev];
      const targetEx = { ...copy[currentExIndex] };
      const setsCopy = [...targetEx.sets];
      setsCopy[currentSetIndex] = {
        ...setsCopy[currentSetIndex],
        completed: true
      };
      targetEx.sets = setsCopy;
      copy[currentExIndex] = targetEx;
      return copy;
    });

    // Trigger micro-animation
    setJustCompletedSet(true);
    setTimeout(() => setJustCompletedSet(false), 1400);

    // Start rest timer
    const restTime = currentExercise.exercise.restSeconds || 90;
    setTotalRestDuration(restTime);
    setRestSecondsLeft(restTime);
    setIsResting(true);

    // Advance set index or move to next exercise
    if (currentSetIndex < currentExercise.sets.length - 1) {
      setCurrentSetIndex((prev) => prev + 1);
    } else if (currentExIndex < exercisesList.length - 1) {
      // Last set of exercise, ready for next exercise
      setCurrentExIndex((prev) => prev + 1);
      setCurrentSetIndex(0);
    } else {
      // Finished all exercises
      handleFinishWorkout();
    }
  };

  // Add 30 seconds to rest
  const handleAddRestTime = (seconds: number = 30) => {
    setRestSecondsLeft((prev) => prev + seconds);
    setTotalRestDuration((prev) => prev + seconds);
  };

  // Skip rest
  const handleSkipRest = () => {
    setIsResting(false);
    setRestSecondsLeft(0);
  };

  // Finish Workout
  const handleFinishWorkout = () => {
    setIsWorkoutComplete(true);
    setIsResting(false);
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Save Workout to Database
  const handleSaveToDatabase = async () => {
    setSaving(true);
    try {
      // Flatten all sets
      const flatSets: WorkoutSet[] = [];
      let exercisesCount = 0;

      exercisesList.forEach((ex) => {
        let exHadCompletedSet = false;
        ex.sets.forEach((s) => {
          if (s.completed) {
            exHadCompletedSet = true;
            flatSets.push({
              exerciseId: ex.exercise.id,
              setNumber: s.setNumber,
              weightKg: s.weightKg,
              reps: s.reps,
              completed: true
            });
          }
        });
        if (exHadCompletedSet) exercisesCount++;
      });

      // Estimated calories
      const calories = Math.round((elapsedSeconds / 60) * 6.5 + flatSets.length * 3);

      const saved = await workoutService.saveSession({
        workoutPlanId: planId && planId !== "custom" ? planId : null,
        title: workoutTitle,
        durationSeconds: elapsedSeconds,
        caloriesBurned: calories,
        exercisesCompletedCount: exercisesCount || exercisesList.length,
        notes: `Completed ${flatSets.length} sets in Workout Mode.`,
        sets: flatSets
      });

      setSavedSessionId(saved.id);
      showToast("Workout saved to your history!", "success");
      navigate("/progress");
    } catch (err: any) {
      showToast(err.message || "Failed to save workout.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading workout environment...</p>
        </div>
      </div>
    );
  }

  const completedSetsCount = exercisesList.reduce(
    (total, ex) => total + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSetsCount = exercisesList.reduce((total, ex) => total + ex.sets.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1B33] text-white flex flex-col justify-between overflow-y-auto font-['Inter']">
      {/* Top Bar Controls */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-[#0B1B33]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/gym")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit workout"
          >
            <X size={20} />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 block">
              WORKOUT MODE
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {workoutTitle}
            </h2>
          </div>
        </div>

        {/* Workout Elapsed Timer & Finish Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm font-bold font-mono">
            <Clock size={15} className="text-blue-400" />
            <span>{formatDuration(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isPaused ? "Resume workout" : "Pause workout"}
          >
            {isPaused ? <Play size={16} className="fill-slate-300" /> : <Pause size={16} />}
          </button>

          <button
            onClick={handleFinishWorkout}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all"
          >
            Finish Workout
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col justify-center space-y-6">
        {/* Exercise Progress Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 text-xs font-extrabold">
              Exercise {currentExIndex + 1} of {exercisesList.length}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {currentExercise.exercise.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentExIndex === 0}
              onClick={() => {
                setCurrentExIndex((prev) => prev - 1);
                setCurrentSetIndex(0);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous exercise"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={currentExIndex === exercisesList.length - 1}
              onClick={() => {
                setCurrentExIndex((prev) => prev + 1);
                setCurrentSetIndex(0);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next exercise"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Exercise Demonstration Stage: Animation vs Video Demo vs Guide */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl">
          {/* Stage Tab Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/70 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {demoMode === "animation" ? "BIOMECHANICAL DEMO" : demoMode === "video" ? "OFFICIAL VIDEO DEMO" : "TECHNIQUE CUES"}
              </span>
              <span className="text-slate-700 hidden sm:inline">•</span>
              <span className="text-[11px] font-bold text-blue-400 hidden sm:inline truncate max-w-[200px]">
                {currentExercise.exercise.name}
              </span>
            </div>

            {/* View Mode Pills */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setDemoMode("animation")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  demoMode === "animation"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles size={13} />
                <span>Animation</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoMode("video")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  demoMode === "video"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Play size={13} className="fill-current" />
                <span>Video Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setDemoMode("guide")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  demoMode === "guide"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Info size={13} />
                <span>Guide</span>
              </button>
            </div>
          </div>

          {/* Demonstration Content */}
          {demoMode === "animation" && (
            <ExerciseAnimation
              type={currentExercise.exercise.animationType}
              name={currentExercise.exercise.name}
              category={currentExercise.exercise.category}
            />
          )}

          {demoMode === "video" && (
            <div className="w-full bg-black p-2 sm:p-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
                {currentExercise.exercise.videoUrl ? (
                  <iframe
                    src={currentExercise.exercise.videoUrl}
                    title={`${currentExercise.exercise.name} Video Demonstration`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 space-y-2">
                    <Video size={36} className="text-slate-600" />
                    <p className="text-sm font-semibold">Video preview currently unavailable for this exercise.</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between w-full max-w-2xl mt-3 text-xs text-slate-400 px-1">
                <span>{currentExercise.exercise.category} • {currentExercise.exercise.muscleGroup}</span>
                <button
                  type="button"
                  onClick={() => setDemoMode("animation")}
                  className="text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  Return to Kinematic Animation →
                </button>
              </div>
            </div>
          )}

          {demoMode === "guide" && (
            <div className="p-5 sm:p-6 text-left space-y-4 max-h-[360px] overflow-y-auto">
              <div>
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Step-by-Step Form</h5>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-200">
                  {(currentExercise.exercise.instructions || []).map((step: string, i: number) => (
                    <li key={i} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              {(currentExercise.exercise.tips || []).length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Pro Coaching Cues</h5>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                    {(currentExercise.exercise.tips || []).map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Set Card with Steppers */}
        {currentSet && (
          <div className="relative bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {/* Set Completed Success Banner Animation */}
            <AnimatePresence>
              {justCompletedSet && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="absolute inset-x-6 -top-3 z-30 py-2 px-4 rounded-xl bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 size={16} />
                  <span>✓ Set completed! Rest timer activated.</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  CURRENT SET
                </span>
                <h4 className="text-2xl font-extrabold text-white font-mono mt-0.5">
                  Set {currentSet.setNumber} <span className="text-slate-500 text-lg">/ {currentExercise.sets.length}</span>
                </h4>
              </div>

              {/* Set Pills Overview */}
              <div className="flex items-center gap-1.5">
                {currentExercise.sets.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSetIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      s.completed
                        ? "bg-emerald-600 text-white"
                        : idx === currentSetIndex
                        ? "bg-blue-600 text-white ring-2 ring-blue-400"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {s.completed ? <Check size={14} /> : s.setNumber}
                  </button>
                ))}

                <button
                  onClick={handleAddSet}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
                  title="Add extra set"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Steppers Grid: Weight & Reps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Weight Stepper */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Weight (kg)
                </span>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleWeightChange(-2.5)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="text-3xl font-extrabold text-white font-mono w-24 text-center">
                    {currentSet.weightKg}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleWeightChange(2.5)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
                <div className="flex gap-1.5 mt-3">
                  {[-5, -2.5, +2.5, +5].map((delta) => (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      key={delta}
                      onClick={() => handleWeightChange(delta)}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Reps Stepper */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Target Reps
                </span>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleRepsChange(-1)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="text-3xl font-extrabold text-white font-mono w-24 text-center">
                    {currentSet.reps}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => handleRepsChange(1)}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>
                <div className="flex gap-1.5 mt-3">
                  {[-2, -1, +1, +2].map((delta) => (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      key={delta}
                      onClick={() => handleRepsChange(delta)}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Complete Set Action Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteSet}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Check size={20} />
              <span>Complete Set</span>
            </motion.button>
          </div>
        )}

        {/* Animated Rest Timer Drawer / Box */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {/* Circular Rest Timer Ring with Breathing Glow */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="relative w-14 h-14 flex items-center justify-center shrink-0"
                >
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="stroke-slate-800"
                      strokeWidth="4"
                      fill="none"
                    />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="stroke-blue-500"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={150.79}
                      animate={{
                        strokeDashoffset:
                          150.79 * (1 - (totalRestDuration > 0 ? restSecondsLeft / totalRestDuration : 0))
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <span className="absolute font-mono font-bold text-xs text-white">
                    {restSecondsLeft}s
                  </span>
                </motion.div>

                <div>
                  <h4 className="text-sm font-bold text-white">Resting... Take deep breaths</h4>
                  <p className="text-xs text-slate-400">
                    Next up: Set {currentSetIndex + 1} of {currentExercise.sets.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddRestTime(30)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg transition-colors"
                >
                  +30s Rest
                </button>
                <button
                  onClick={handleSkipRest}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-lg transition-colors"
                >
                  Skip Rest →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Overall Summary Progress */}
      <footer className="px-6 py-3 border-t border-slate-800 bg-[#0B1B33] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Dumbbell size={14} className="text-blue-400" />
          <span>
            Sets Completed: <strong className="text-white">{completedSetsCount}</strong> of {totalSetsCount}
          </span>
        </div>
        <span>FitTrack Pro Runner</span>
      </footer>

      {/* Workout Complete Full-Screen Modal */}
      <AnimatePresence>
        {isWorkoutComplete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  SESSION FINISHED
                </span>
                <h3 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] mt-1">
                  WORKOUT COMPLETE!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Awesome effort. Every rep counts towards consistency.
                </p>
              </div>

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-2 gap-3 py-2 text-left">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                  <span className="text-lg font-bold text-white font-mono">{formatDuration(elapsedSeconds)}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Burn</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    ~{Math.round((elapsedSeconds / 60) * 6.5 + completedSetsCount * 3)} kcal
                  </span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exercises</span>
                  <span className="text-lg font-bold text-white">{exercisesList.length} completed</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sets Logged</span>
                  <span className="text-lg font-bold text-blue-400 font-mono">{completedSetsCount} sets</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSaveToDatabase}
                  disabled={saving}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Save Workout to History</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/gym")}
                  className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Discard & Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
