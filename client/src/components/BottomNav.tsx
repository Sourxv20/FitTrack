import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Dumbbell, Footprints, TrendingUp, User } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const mobileItems: NavItem[] = [
  { name: "Home", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "Gym", path: "/gym", icon: <Dumbbell size={20} /> },
  { name: "Running", path: "/running", icon: <Footprints size={20} /> },
  { name: "Analytics", path: "/progress", icon: <TrendingUp size={20} /> },
  { name: "Profile", path: "/profile", icon: <User size={20} /> }
];

export const BottomNav: React.FC = () => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1E]/90 backdrop-blur-2xl border-t border-white/10 px-3 py-2 flex items-center justify-around shadow-2xl"
      aria-label="Mobile Navigation"
    >
      {mobileItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isActive
                ? "text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative z-10 flex flex-col items-center">
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveGlow"
                    className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 via-fuchsia-600/30 to-pink-600/30 rounded-xl blur-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
                <div className={`transition-transform duration-200 ${isActive ? "scale-110 text-purple-300" : ""}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] mt-1 tracking-tight font-medium">
                  {item.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDot"
                    className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-0.5 shadow-[0_0_8px_rgba(217,70,239,0.9)]"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </div>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
