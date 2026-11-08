import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SectionConfig {
  imageUrl: string;
  glowColor: string;
  tagline: string;
  accentOverlay: string;
}

const SECTION_CONFIGS: Record<string, SectionConfig> = {
  "/dashboard": {
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(139, 92, 246, 0.22)",
    tagline: "COMMAND CENTER • HIGH-TECH ARENA",
    accentOverlay: "from-purple-900/30 via-slate-950/70 to-[#080D1A]"
  },
  "/gym": {
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(255, 107, 74, 0.25)",
    tagline: "HEAVY IRON • RESISTANCE & POWER",
    accentOverlay: "from-[#FF6B4A]/20 via-slate-950/75 to-[#080D1A]"
  },
  "/running": {
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(6, 182, 212, 0.25)",
    tagline: "OPEN ROAD • SATELLITE GPS TELEMETRY",
    accentOverlay: "from-cyan-900/25 via-slate-950/75 to-[#080D1A]"
  },
  "/progress": {
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop",
    glowColor: "rgba(16, 185, 129, 0.22)",
    tagline: "STADIUM METRICS • VOLUME & CADENCE",
    accentOverlay: "from-emerald-900/25 via-slate-950/75 to-[#080D1A]"
  },
  "/profile": {
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop",
    glowColor: "rgba(99, 102, 241, 0.22)",
    tagline: "ATHLETE PROFILE • BIOMETRICS",
    accentOverlay: "from-indigo-900/25 via-slate-950/75 to-[#080D1A]"
  },
  "/settings": {
    imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2074&auto=format&fit=crop",
    glowColor: "rgba(168, 85, 247, 0.2)",
    tagline: "SYSTEM CONFIG • TELEMETRY",
    accentOverlay: "from-purple-950/30 via-slate-950/80 to-[#080D1A]"
  }
};

export const Section3DBackground: React.FC = () => {
  const location = useLocation();

  // Find matching config or fallback to dashboard
  const currentKey = Object.keys(SECTION_CONFIGS).find((key) =>
    location.pathname.startsWith(key)
  ) || "/dashboard";

  const config = SECTION_CONFIGS[currentKey];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* 1. High-Resolution Thematic Section Image */}
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.38] contrast-[1.15] saturate-[1.2]"
            style={{
              backgroundImage: `url(${config.imageUrl})`
            }}
          />

          {/* 2. Multi-Layer Radial & Linear Dark Gradient Vignette for Absolute UI Contrast */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, rgba(8, 13, 26, 0.35) 0%, rgba(8, 13, 26, 0.82) 60%, #080D1A 100%)`
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-b ${config.accentOverlay} mix-blend-multiply opacity-80`}
          />

          {/* 3. Ambient Section Glow Spotlight */}
          <div
            className="absolute top-0 right-1/4 w-[650px] h-[450px] rounded-full blur-[160px]"
            style={{ backgroundColor: config.glowColor }}
          />

          {/* 4. Subtle 3D Depth Grid Floor */}
          <div
            className="absolute -bottom-20 left-0 right-0 h-96 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              transform: "perspective(600px) rotateX(65deg)"
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
