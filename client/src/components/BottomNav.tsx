import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Dumbbell, Footprints, TrendingUp, User } from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const mobileItems: NavItem[] = [
  { name: "Home", path: "/dashboard", icon: <Home size={22} /> },
  { name: "Gym", path: "/gym", icon: <Dumbbell size={22} /> },
  { name: "Running", path: "/running", icon: <Footprints size={22} /> },
  { name: "Progress", path: "/progress", icon: <TrendingUp size={22} /> },
  { name: "Profile", path: "/profile", icon: <User size={22} /> }
];

export const BottomNav: React.FC = () => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg"
      aria-label="Mobile Navigation"
    >
      {mobileItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isActive
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                {item.icon}
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
