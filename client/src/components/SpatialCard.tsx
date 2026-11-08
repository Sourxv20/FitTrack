import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface SpatialCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "purple" | "cyan" | "coral" | "emerald" | "amber";
  depth?: "sm" | "md" | "lg";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const SpatialCard: React.FC<SpatialCardProps> = ({
  children,
  className = "",
  glowColor = "purple",
  depth = "md",
  onClick,
  style = {}
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs for realistic spatial physics
  const springConfig = { damping: 22, stiffness: 240, mass: 0.6 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Max tilt angle based on depth
  const maxTilt = depth === "lg" ? 8 : depth === "md" ? 5 : 3;
  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  // Glow color mapping
  const glowMap = {
    purple: "rgba(168, 85, 247, 0.18)",
    cyan: "rgba(6, 182, 212, 0.18)",
    coral: "rgba(255, 107, 74, 0.18)",
    emerald: "rgba(16, 185, 129, 0.18)",
    amber: "rgba(245, 158, 11, 0.18)"
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cursorX = (e.clientX - rect.left) / rect.width;
    const cursorY = (e.clientY - rect.top) / rect.height;
    x.set(cursorX);
    y.set(cursorY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="transform-style-3d select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          ...style
        }}
        whileHover={{
          scale: 1.012,
          z: 20
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={`relative rounded-3xl overflow-hidden transition-shadow duration-300 ${className}`}
      >
        {/* Dynamic Specular Glass Reflection Layer */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-3xl"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${smoothX.get() * 100}% ${smoothY.get() * 100}%, rgba(255, 255, 255, 0.12), transparent 50%), radial-gradient(400px circle at ${smoothX.get() * 100}% ${smoothY.get() * 100}%, ${glowMap[glowColor]}, transparent 70%)`
          }}
        />

        {/* Ambient Top Rim Reflection Highlight (VisionOS Specular Edge) */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/35 to-transparent z-20" />

        {/* Card Content with 3D Depth */}
        <div className="relative z-10 transform-style-3d">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
