import React from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface ActivityRingProps {
  calorieProgress: number; // 0 - 100+
  activeMinutesProgress?: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  todayCalories: number;
  calorieTarget: number;
  className?: string;
}

export const ActivityRing: React.FC<ActivityRingProps> = ({
  calorieProgress,
  activeMinutesProgress = 65,
  size = 170,
  strokeWidth = 14,
  todayCalories,
  calorieTarget,
  className = ""
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Calorie ring offset (clamped to max 100% for circle fill, or visually overflowing)
  const clampedCalorie = Math.min(100, Math.max(0, calorieProgress));
  const calorieOffset = circumference - (clampedCalorie / 100) * circumference;

  // Inner ring for active minutes / workout volume
  const innerRadius = radius - strokeWidth - 5;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const clampedInner = Math.min(100, Math.max(0, activeMinutesProgress));
  const innerOffset = innerCircumference - (clampedInner / 100) * innerCircumference;

  const id = React.useId().replace(/:/g, "");

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <defs>
          {/* Coral Gradient for Primary Calorie Ring */}
          <linearGradient id={`${id}-coral`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B4A" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Cyan / Blue Gradient for Inner Ring */}
          <linearGradient id={`${id}-cyan`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF6B4A" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Ring Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-100 dark:text-slate-800/80"
        />

        {/* Outer Ring Progress (Calories - Coral Flame) */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${id}-coral)`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: calorieOffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          filter={`url(#${id}-glow)`}
        />

        {/* Inner Ring Background Track */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke="currentColor"
          strokeWidth={strokeWidth - 4}
          fill="none"
          className="text-slate-100 dark:text-slate-800/60"
        />

        {/* Inner Ring Progress (Cyan Stride / Training Time) */}
        <motion.circle
          cx={center}
          cy={center}
          r={innerRadius}
          stroke={`url(#${id}-cyan)`}
          strokeWidth={strokeWidth - 4}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={innerCircumference}
          initial={{ strokeDashoffset: innerCircumference }}
          animate={{ strokeDashoffset: innerOffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      </svg>

      {/* Center Metrics Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/15 dark:bg-[#FF6B4A]/20 flex items-center justify-center text-[#FF6B4A] mb-1">
          <Flame size={16} className="fill-current" />
        </div>
        <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] leading-none">
          {Math.round(calorieProgress)}%
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">
          {todayCalories} / {calorieTarget} kcal
        </span>
      </div>
    </div>
  );
};
