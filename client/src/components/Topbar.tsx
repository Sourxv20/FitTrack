import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Moon, Sun, User, Settings, LogOut, Menu, Search, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getInitials } from "../utils/formatters";
import { Logo } from "./Logo";

interface TopbarProps {
  onOpenMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("light");
    else setTheme(isDark ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#080D1A]/75 backdrop-blur-2xl border-b border-white/[0.08]">
      {/* Mobile Brand & Hamburger / Desktop Status */}
      <div className="flex items-center gap-3">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="lg:hidden flex items-center gap-2">
          <Logo size="sm" animated={true} />
          <span className="font-black text-white text-base tracking-wider font-['Plus_Jakarta_Sans'] flex items-center">
            <span>FIT</span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">TRACK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <p className="text-xs font-bold text-slate-400 tracking-wider">
            ATHLETE DASHBOARD <span className="text-purple-400 font-mono text-[10px] ml-1">V24</span>
          </p>
        </div>
      </div>

      {/* Center Search Pill (From CodeXR Glassy Dashboard Preview) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-400 hover:border-purple-500/40 focus-within:border-purple-500/60 transition-all shadow-inner">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search workouts, routes, telemetry..."
            className="bg-transparent border-none outline-none w-full text-xs text-white placeholder:text-slate-500 font-medium"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10"
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
        </button>

        {/* Notifications Icon with Glowing Badge */}
        <div className="relative">
          <button
            className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_8px_rgba(217,70,239,0.9)] animate-pulse" />
          </button>
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 pl-2 sm:pl-2.5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10"
          >
            <span className="hidden sm:inline text-xs font-black text-white">
              {user?.name?.split(" ")[0]}
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-black text-xs shadow-md shadow-purple-500/20 select-none ring-1 ring-white/20">
              {getInitials(user?.name) || <User size={14} />}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0B1528] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 text-white backdrop-blur-xl">
              <div className="px-4 py-2.5 border-b border-white/10">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-[#FF6B4A] font-mono font-bold truncate">
                  @{user?.username || user?.name?.toLowerCase().replace(/\s+/g, "_") || "athlete"}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <User size={15} />
                  My Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Settings size={15} />
                  Settings & Data
                </Link>
              </div>

              <div className="border-t border-white/10 pt-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
