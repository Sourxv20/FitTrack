import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  showText?: boolean;
  tagline?: string;
  className?: string;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = false,
  tagline,
  className = "",
  animated = true
}) => {
  // Resolve pixel dimensions
  let pxSize = 44;
  if (typeof size === "number") {
    pxSize = size;
  } else {
    switch (size) {
      case "sm":
        pxSize = 34;
        break;
      case "md":
        pxSize = 44;
        break;
      case "lg":
        pxSize = 62;
        break;
      case "xl":
        pxSize = 82;
        break;
    }
  }

  // Unique ID prefix for gradients
  const id = React.useId().replace(/:/g, "");

  const emblem = (
    <svg
      width={pxSize}
      height={pxSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none drop-shadow-md"
    >
      <defs>
        {/* Deep Athletic Obsidian-Cobalt Squircle Base */}
        <linearGradient id={`${id}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#0B132B" />
        </linearGradient>

        {/* Titanium Core Sprinter Body */}
        <linearGradient id={`${id}-runner`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Electric Sky Blue Speed Stream */}
        <linearGradient id={`${id}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Kinetic Neon Mint / Emerald Stride Accent */}
        <linearGradient id={`${id}-neon`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Precision Bevel Glow Rim */}
        <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#2563EB" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0.85" />
        </linearGradient>

        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3.5" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2563EB" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Aerodynamic Squircle Container with Precision Rim */}
      <rect width="100" height="100" rx="26" fill={`url(#${id}-bg)`} />
      <rect
        x="1.25"
        y="1.25"
        width="97.5"
        height="97.5"
        rx="24.75"
        stroke={`url(#${id}-rim)`}
        strokeWidth="1.8"
      />

      {/* The Kinetic Sprinter: Explosive Athletic Motion & Velocity Streams */}
      <g filter={`url(#${id}-glow)`}>
        {/* Head: Aerodynamic glowing sphere with kinetic pulse ring */}
        <circle cx="68" cy="23" r="7.5" fill={`url(#${id}-runner)`} />
        <circle
          cx="68"
          cy="23"
          r="10.5"
          stroke={`url(#${id}-neon)`}
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.85"
        />

        {/* Torso: Aggressive athletic forward sprint drive */}
        <path
          d="M50 36L64.5 28.5C66.8 27.2 69 29 68.2 31.5L61.5 52L46 45L50 36Z"
          fill={`url(#${id}-runner)`}
        />

        {/* Forward High-Knee Drive (Neon Mint Power Stride) */}
        <path
          d="M61.5 52L77 56.5C79.8 57.3 80.8 60.5 79.2 62.6L70 73L63.5 67.5L71 60L57 56.5L61.5 52Z"
          fill={`url(#${id}-neon)`}
        />

        {/* Trailing Arm / Aerodynamic Jet Blade (Electric Blue Wing) */}
        <path
          d="M54 36L27 25C24.5 23.8 21.8 25.8 22.4 28.5L25 36.5L47.5 43L54 36Z"
          fill={`url(#${id}-wing)`}
        />

        {/* Trailing Push-Off Leg (Anchored into Speed Stream) */}
        <path
          d="M46 45L30.5 67C29 69 26 69.5 24 68L15 61.5L19.5 56L27 61L40.5 43L46 45Z"
          fill={`url(#${id}-wing)`}
        />

        {/* Kinetic Speed Ribbons (GPS Route & Pace Velocity Jets) */}
        <path
          d="M17 42L36 47L34 51.5L15 46.5L17 42Z"
          fill={`url(#${id}-neon)`}
          opacity="0.95"
        />
        <path
          d="M10 50.5L25 55L23 58.5L8 54L10 50.5Z"
          fill={`url(#${id}-wing)`}
          opacity="0.8"
        />
      </g>
    </svg>
  );

  const wrapperContent = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {animated ? (
        <motion.div
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 450, damping: 15 }}
          className="cursor-pointer"
        >
          {emblem}
        </motion.div>
      ) : (
        emblem
      )}

      {showText && (
        <div className="flex flex-col text-left select-none">
          <div className="flex items-center tracking-wider font-black font-['Plus_Jakarta_Sans'] leading-tight">
            <span className="text-slate-900 dark:text-white text-base">FIT</span>
            <span className="text-blue-600 dark:text-blue-400 text-base">TRACK</span>
          </div>
          {tagline && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return wrapperContent;
};
