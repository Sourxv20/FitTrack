import React from "react";
import { motion } from "framer-motion";

interface ExerciseAnimationProps {
  type?: string | null;
  name: string;
  category: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ type, name, category }) => {
  const normType = (type || name).toLowerCase();

  // Bench Press Animation
  if (normType.includes("bench") || normType.includes("push-up") || normType.includes("press") && normType.includes("dumbbell")) {
    return (
      <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
        <span className="absolute top-3 left-4 text-xs font-semibold tracking-wider text-blue-400 uppercase">
          Biomechanical Demo • Press Movement
        </span>
        {/* Bench representation */}
        <div className="w-48 h-3 bg-slate-700 rounded-full mt-24 mb-1" />
        
        {/* Animated Barbell */}
        <motion.div
          animate={{ y: [0, 48, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="absolute flex items-center justify-center"
        >
          {/* Left Weight Plates */}
          <div className="w-2.5 h-12 bg-blue-500 rounded-sm shadow-md" />
          <div className="w-1.5 h-10 bg-blue-400 rounded-sm ml-0.5" />
          {/* Bar */}
          <div className="w-36 h-2 bg-slate-300" />
          {/* Right Weight Plates */}
          <div className="w-1.5 h-10 bg-blue-400 rounded-sm mr-0.5" />
          <div className="w-2.5 h-12 bg-blue-500 rounded-sm shadow-md" />
        </motion.div>

        {/* Lifter Body Silhouette */}
        <div className="absolute flex flex-col items-center mt-12">
          {/* Head */}
          <div className="w-6 h-6 rounded-full bg-slate-500" />
          {/* Torso */}
          <div className="w-16 h-8 bg-slate-600 rounded-t-lg mt-1" />
        </div>

        <div className="absolute bottom-2 text-[11px] text-slate-400">
          Controlled eccentric descent • Explosive concentric drive
        </div>
      </div>
    );
  }

  // Squat & Leg Press Animation
  if (normType.includes("squat") || normType.includes("leg press") || normType.includes("lunge")) {
    return (
      <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
        <span className="absolute top-3 left-4 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
          Biomechanical Demo • Quad & Hip Drive
        </span>

        {/* Floor */}
        <div className="absolute bottom-6 w-52 h-1.5 bg-slate-700 rounded-full" />

        {/* Animated Squat Figure */}
        <motion.div
          animate={{ y: [0, 36, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          className="flex flex-col items-center z-10"
        >
          {/* Barbell on Traps */}
          <div className="flex items-center justify-center mb-1">
            <div className="w-2.5 h-14 bg-emerald-500 rounded-sm" />
            <div className="w-40 h-2 bg-slate-300" />
            <div className="w-2.5 h-14 bg-emerald-500 rounded-sm" />
          </div>
          {/* Head */}
          <div className="w-7 h-7 rounded-full bg-slate-400" />
          {/* Torso */}
          <div className="w-10 h-14 bg-slate-500 rounded-md mt-1" />
        </motion.div>

        <div className="absolute bottom-2 text-[11px] text-slate-400">
          Hips hinge below parallel • Drive through midfoot
        </div>
      </div>
    );
  }

  // Deadlift & Pulling Animation
  if (normType.includes("deadlift") || normType.includes("pull") || normType.includes("row")) {
    return (
      <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
        <span className="absolute top-3 left-4 text-xs font-semibold tracking-wider text-amber-400 uppercase">
          Biomechanical Demo • Posterior Chain Pull
        </span>

        {/* Animated Barbell Pull */}
        <motion.div
          animate={{ y: [35, -15, 35] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
          className="flex items-center justify-center z-10 mt-8"
        >
          <div className="w-3 h-14 bg-amber-500 rounded-sm shadow-md" />
          <div className="w-40 h-2 bg-slate-200" />
          <div className="w-3 h-14 bg-amber-500 rounded-sm shadow-md" />
        </motion.div>

        {/* Back Torso Indicator */}
        <div className="w-12 h-16 bg-slate-600 rounded-t-lg mt-2" />

        <div className="absolute bottom-2 text-[11px] text-slate-400">
          Spine rigid & neutral • Lockout glutes and lats at apex
        </div>
      </div>
    );
  }

  // Curls & Arms Animation
  if (normType.includes("curl") || normType.includes("pushdown") || normType.includes("tricep") || normType.includes("arm")) {
    return (
      <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
        <span className="absolute top-3 left-4 text-xs font-semibold tracking-wider text-purple-400 uppercase">
          Biomechanical Demo • Elbow Flexion & Peak Contraction
        </span>

        {/* Arm Movement Arc */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <motion.div
            animate={{ rotate: [-25, 45, -25] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-2.5 h-16 bg-purple-500 rounded-full origin-top flex flex-col items-center justify-end"
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 shadow-lg -mb-2" />
          </motion.div>

          <motion.div
            animate={{ rotate: [25, -45, 25] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="w-2.5 h-16 bg-purple-500 rounded-full origin-top flex flex-col items-center justify-end"
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 shadow-lg -mb-2" />
          </motion.div>
        </div>

        <div className="absolute bottom-2 text-[11px] text-slate-400">
          Upper arm pinned to ribs • Peak squeeze at top
        </div>
      </div>
    );
  }

  // Core & Plank & Default
  return (
    <div className="w-full h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden p-4">
      <span className="absolute top-3 left-4 text-xs font-semibold tracking-wider text-sky-400 uppercase">
        Biomechanical Demo • {category} Target
      </span>

      {/* Core Isometric pulse */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="w-24 h-24 rounded-full border-4 border-dashed border-sky-400 flex items-center justify-center"
      >
        <div className="w-14 h-14 rounded-full bg-sky-500/30 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-sky-400" />
        </div>
      </motion.div>

      <div className="absolute bottom-2 text-[11px] text-slate-400">
        Maintain full tension & rigid abdominal bracing
      </div>
    </div>
  );
};
