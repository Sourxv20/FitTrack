import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Moon, Sun, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getInitials } from "../utils/formatters";
import { Logo } from "./Logo";

export const Topbar: React.FC = () => {
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
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#080D1A]/85 backdrop-blur-xl border-b border-white/10">
      {/* Mobile Brand / Desktop Title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2.5">
          <Logo size="sm" animated={true} />
          <span className="font-black text-white text-base tracking-wider font-['Plus_Jakarta_Sans'] flex items-center">
            <span>FIT</span>
            <span className="text-cyan-400">TRACK</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Train Smarter • Run Stronger
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/5"
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="p-2.5 rounded-2xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/5"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B4A] rounded-full shadow-[0_0_6px_#FF6B4A]" />
          </button>
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
          >
            <span className="hidden sm:inline text-xs font-black text-white">
              {user?.name?.split(" ")[0]}
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center font-black text-xs shadow-sm select-none">
              {getInitials(user?.name) || <User size={14} />}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0B1528] border border-white/10 rounded-2xl shadow-2xl py-2 z-50 text-white">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
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
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
