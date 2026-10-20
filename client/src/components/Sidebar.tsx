import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Dumbbell,
  Footprints,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Flame
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/formatters";
import { Logo } from "./Logo";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/dashboard", icon: <Home size={19} /> },
  { name: "Gym", path: "/gym", icon: <Dumbbell size={19} /> },
  { name: "Running", path: "/running", icon: <Footprints size={19} /> },
  { name: "Progress", path: "/progress", icon: <TrendingUp size={19} /> },
  { name: "Profile", path: "/profile", icon: <User size={19} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={19} /> }
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-[#080D1A] text-white flex-col justify-between p-6 fixed left-0 top-0 bottom-0 z-30 select-none border-r border-white/5">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <Logo size="md" animated={true} />
          <div>
            <h1 className="font-black text-lg tracking-wider font-['Plus_Jakarta_Sans'] text-white flex items-center leading-tight">
              <span>FIT</span>
              <span className="text-cyan-400">TRACK</span>
            </h1>
            <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase block mt-0.5">
              Train • Run • Track
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            DISCIPLINES
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? "text-white bg-blue-600/20 border border-blue-500/40 shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className={`transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-white"}`}>
                        {item.icon}
                      </span>
                      <span className="tracking-wide">{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] relative z-10" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User Section & Logout */}
      <div className="pt-6 border-t border-white/5 space-y-3">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center font-black text-sm select-none">
            {getInitials(user?.name) || <User size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-slate-100 truncate group-hover:text-white transition-colors">
              {user?.name || "Athlete"}
            </h4>
            <p className="text-[10px] font-semibold text-slate-400 truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              <span>{user?.profile?.fitnessGoal || "FitTrack Athlete"}</span>
            </p>
          </div>
        </NavLink>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};