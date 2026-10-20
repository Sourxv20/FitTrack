import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, ShieldCheck, Bell, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { settingsService } from "../../services/workoutService";

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [notifications, setNotifications] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await settingsService.getSettings();
        if (s.units) setUnits(s.units);
        if (s.notifications !== undefined) setNotifications(s.notifications);
        if (s.theme) setTheme(s.theme as any);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateSettings({
        theme,
        units,
        notifications
      });
      showToast("Preferences saved successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          PREFERENCES
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] mt-0.5">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Customize visual themes, measurement units, and privacy controls.
        </p>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Theme & Appearance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select your preferred display theme for the interface.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              theme === "light"
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Sun size={24} className="mb-2" />
            <span className="text-xs font-bold">Light</span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              theme === "dark"
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Moon size={24} className="mb-2" />
            <span className="text-xs font-bold">Dark</span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              theme === "system"
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <Monitor size={24} className="mb-2" />
            <span className="text-xs font-bold">System</span>
          </button>
        </div>
      </div>

      {/* Measurement Units Settings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Measurement Units</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose whether to track workouts and runs in metric or imperial.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => setUnits("metric")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              units === "metric"
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <h4 className="text-sm font-bold">Metric System</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kilometers (km), Kilograms (kg), Meters
            </p>
          </button>

          <button
            onClick={() => setUnits("imperial")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              units === "imperial"
                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <h4 className="text-sm font-bold">Imperial System</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Miles (mi), Pounds (lbs), Feet
            </p>
          </button>
        </div>
      </div>

      {/* Location Privacy Disclosure */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Privacy & Geolocation Disclosure</h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          FitTrack uses your device's browser location exclusively while you have an active run in progress to calculate distance and draw your path on OpenStreetMap. Your location data is stored securely in your private database and is never shared, tracked in the background, or transmitted to third parties.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Save All Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
