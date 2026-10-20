import React from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedCounter";

interface StatsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  subtitle?: string;
  progressPercent?: number;
  color?: "blue" | "emerald" | "amber" | "purple";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  unit,
  icon,
  subtitle,
  progressPercent,
  color = "blue"
}) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-600 dark:text-blue-400",
      bar: "bg-blue-600",
      glow: "hover:border-blue-500/40"
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
      glow: "hover:border-emerald-500/40"
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-600 dark:text-amber-400",
      bar: "bg-amber-500",
      glow: "hover:border-amber-500/40"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      text: "text-purple-600 dark:text-purple-400",
      bar: "bg-purple-600",
      glow: "hover:border-purple-500/40"
    }
  };

  const selectedColor = colorMap[color];

  // Parse numeric value for animation if applicable
  const isNumber = typeof value === "number" || (!isNaN(Number(value)) && typeof value === "string");
  const numVal = typeof value === "number" ? value : Number(value);
  const decimals = typeof value === "number" && !Number.isInteger(value) ? 2 : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } }
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${selectedColor.glow}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-2.5 rounded-xl ${selectedColor.bg} ${selectedColor.text} transition-colors`}
        >
          {icon}
        </motion.div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
          {isNumber ? (
            <AnimatedNumber value={numVal} decimals={decimals} />
          ) : (
            value
          )}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {progressPercent !== undefined && (
        <div className="space-y-1.5 mt-3">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full ${selectedColor.bar} rounded-full`}
            />
          </div>
          {subtitle && (
            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>{subtitle}</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                <AnimatedNumber value={Math.round(progressPercent)} />%
              </span>
            </div>
          )}
        </div>
      )}

      {progressPercent === undefined && subtitle && (
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};
