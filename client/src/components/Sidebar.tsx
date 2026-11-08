import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  Footprints,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  CheckCircle2,
  X
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getInitials } from "../utils/formatters";
import { Logo } from "./Logo";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  hasDot?: boolean;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={18} />
  },
  {
    name: "Analytics",
    path: "/progress",
    icon: <TrendingUp size={18} />,
    hasDot: true
  },
  {
    name: "Gym & Workouts",
    path: "/gym",
    icon: <Dumbbell size={18} />
  },
  {
    name: "Running Tracker",
    path: "/running",
    icon: <Footprints size={18} />
  },
  {
    name: "Athlete Profile",
    path: "/profile",
    icon: <User size={18} />
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings size={18} />
  }
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [showProModal, setShowProModal] = useState(false);
  const [isProActive, setIsProActive] = useState(false);

  const handleActivatePro = () => {
    setIsProActive(true);
    setShowProModal(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast("FitTrack Pro V24 Activated! Enjoy unlimited access.", "success");
  };

  const sidebarContent = (
    <div className="relative flex flex-col justify-between h-full w-full overflow-hidden p-5 z-10">
      {/* Ambient Glass Glow Elements */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-20 w-44 h-44 bg-fuchsia-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl" />

      {/* Top Section: Brand + Menu */}
      <div className="space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Logo size="sm" animated={true} />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0F1E] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg tracking-wider font-['Plus_Jakarta_Sans'] text-white flex items-center leading-none">
                  <span>FIT</span>
                  <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                    TRACK
                  </span>
                </h1>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  V24
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block mt-1">
                Glassy Athlete UI
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="space-y-1.5">
          <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-widest text-slate-400/90 flex items-center justify-between">
            <span>MENU</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-semibold transition-all group select-none ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] hover:translate-x-1"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Pill Gradient with Glowing Drop Shadow (CodeXR Glassy V24 Style) */}
                    {isActive && (
                      <motion.div
                        layoutId="glassy-active-nav-bg"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] shadow-[0_8px_20px_-3px_rgba(168,85,247,0.6),0_3px_8px_rgba(217,70,239,0.35)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}

                    {/* Nav Link Content */}
                    <div className="flex items-center gap-3 relative z-10">
                      <span
                        className={`transition-all duration-200 ${
                          isActive
                            ? "text-white scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                            : "text-slate-400 group-hover:text-purple-300"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`tracking-tight transition-colors duration-200 ${
                          isActive ? "font-bold text-white" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    {/* Notification Dot / Badge */}
                    <div className="relative z-10 flex items-center gap-1.5">
                      {item.hasDot && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.9)] ring-2 ring-fuchsia-500/20" />
                      )}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Upgrade to Pro Card & Athlete Profile */}
      <div className="space-y-3 relative z-10 pt-4">
        {/* Signature "Upgrade to Pro" Card (as featured in the Glassy Dashboard video) */}
        <motion.div
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProModal(true)}
          className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-violet-900/40 via-purple-900/25 to-pink-900/35 border border-purple-500/30 backdrop-blur-xl shadow-lg shadow-purple-950/40 cursor-pointer group hover:border-purple-400/50 hover:shadow-purple-500/20 transition-all"
        >
          {/* Subtle light shimmer bar */}
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            {/* Glowing Crown Icon Box */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#A855F7] to-[#EC4899] text-white flex items-center justify-center shadow-md shadow-purple-500/40 shrink-0 group-hover:scale-105 transition-transform">
              <Crown size={18} className="fill-white/20" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-white tracking-tight">
                  {isProActive ? "FitTrack Pro" : "Upgrade to Pro"}
                </h4>
                <Sparkles size={11} className="text-amber-300 animate-pulse" />
              </div>
              <p className="text-[10px] font-semibold text-purple-300/80 group-hover:text-purple-200 transition-colors truncate">
                {isProActive ? "Elite Tier Active" : "Unlock all features"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Athlete Section */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <NavLink
            to="/profile"
            onClick={() => onClose && onClose()}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.06] transition-all group flex-1 min-w-0"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm ring-1 ring-white/20">
                {getInitials(user?.name) || <User size={14} />}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0A0F1E] shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-white transition-colors">
                {user?.name || "Athlete"}
              </h4>
              <p className="text-[10px] font-semibold text-slate-400 truncate flex items-center gap-1">
                <span>{user?.profile?.fitnessGoal || "Elite Runner"}</span>
              </p>
            </div>
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* FitTrack Pro Modal */}
      <AnimatePresence>
        {showProModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#0D1528] border border-purple-500/30 rounded-3xl p-6 shadow-2xl text-white overflow-hidden"
            >
              {/* Top ambient glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-44 h-44 bg-purple-500/30 rounded-full blur-3xl" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/40">
                    <Crown size={22} className="fill-white/20" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      FitTrack Pro Athlete
                    </h3>
                    <p className="text-xs text-purple-300 font-semibold">
                      Glassy Dashboard V24 Experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 my-5">
                {[
                  "Unlimited GPS Trail Route History & Real-Time Tracking",
                  "Real-Time Satellite & OpenStreetMap Zero-Watermark Layers",
                  "Complete 32-Movement Library & 7-Day Split Builder",
                  "Advanced Heart Rate Telemetry & Fatigue Recovery",
                  "Audio Coached Yo-Yo IR1 Endurance Test"
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleActivatePro}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#D946EF] text-white text-xs font-bold shadow-lg shadow-purple-500/40 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>{isProActive ? "Reactivate Pro Access" : "Activate Pro Access (Free)"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop Floating Spatial Dock Navigation Bar */}
      <aside className="hidden lg:flex fixed left-4 top-4 bottom-4 w-64 rounded-3xl spatial-dock flex-col justify-between z-30 select-none overflow-hidden transition-all duration-300">
        {sidebarContent}
      </aside>

      {/* Mobile Spatial Drawer (Slide-in) */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Slide-in Spatial Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-72 max-w-[85vw] h-full spatial-dock border-r border-white/10 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
