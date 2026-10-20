import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Target,
  Scale,
  Ruler,
  Flame,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileJson,
  FileSpreadsheet,
  Compass,
  Sparkles,
  Activity,
  Heart
} from "lucide-react";
import { profileService } from "../../services/workoutService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getInitials } from "../../utils/formatters";
import { Modal } from "../../components/Modal";
import { useNavigate } from "react-router-dom";

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [fitnessGoal, setFitnessGoal] = useState<string>("Build muscle");
  const [runningGoal, setRunningGoal] = useState<string>("5K Run");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<number>(500);
  const [bio, setBio] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setHeight(user.profile?.height || 175);
      setWeight(user.profile?.weight || 74);
      setFitnessGoal(user.profile?.fitnessGoal || "Build muscle");
      setRunningGoal(user.profile?.runningGoal || "5K Run");
      setDailyCalorieTarget(user.profile?.dailyCalorieTarget || 500);
      setBio(user.profile?.bio || "");
    }
  }, [user]);

  // Compute BMI dynamically
  const bmiData = useMemo(() => {
    const h = typeof height === "number" ? height : 175;
    const w = typeof weight === "number" ? weight : 74;
    if (h <= 0 || w <= 0) return { bmi: 0, category: "N/A", color: "text-slate-500", percent: 50 };

    const heightM = h / 100;
    const bmiVal = Number((w / (heightM * heightM)).toFixed(1));

    let category = "Normal weight";
    let color = "text-emerald-500";
    let percent = 50;

    if (bmiVal < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
      percent = Math.max(10, (bmiVal / 18.5) * 25);
    } else if (bmiVal < 25) {
      category = "Healthy / Optimal";
      color = "text-emerald-500";
      percent = 25 + ((bmiVal - 18.5) / 6.5) * 25;
    } else if (bmiVal < 30) {
      category = "Athletic / Overweight";
      color = "text-amber-500";
      percent = 50 + ((bmiVal - 25) / 5) * 25;
    } else {
      category = "High BMI";
      color = "text-rose-500";
      percent = Math.min(100, 75 + ((bmiVal - 30) / 10) * 25);
    }

    // Estimated BMR (Mifflin-St Jeor formula)
    const bmr = Math.round(10 * w + 6.25 * h - 5 * 25 + 5);

    return { bmi: bmiVal, category, color, percent, bmr };
  }, [height, weight]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await profileService.updateProfile({
        name,
        height: height === "" ? null : Number(height),
        weight: weight === "" ? null : Number(weight),
        fitnessGoal,
        runningGoal,
        dailyCalorieTarget: Number(dailyCalorieTarget),
        bio
      });

      updateUser(updated);
      showToast("Profile updated successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = (format: "json" | "csv" | "gpx") => {
    window.open(profileService.exportDataUrl(format), "_blank");
    showToast(`Downloading your activity data in ${format.toUpperCase()} format...`, "info");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await profileService.deleteAccount();
      showToast("Your account has been deleted.", "info");
      await logout();
      navigate("/register");
    } catch (err: any) {
      showToast(err.message || "Failed to delete account.", "error");
      setDeleting(false);
    }
  };

  const goalOptions = [
    "Build muscle",
    "Improve fitness",
    "Improve endurance",
    "Lose weight",
    "General fitness"
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          ATHLETE PROFILE
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] mt-0.5">
          User Settings & Biometrics
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
          Manage your physical attributes, training goals, and export your workout data.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* First Letter of Name Avatar (or clean User icon if no name) */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-extrabold text-4xl shadow-xl shadow-blue-500/25 shrink-0 font-['Plus_Jakarta_Sans'] select-none">
          {getInitials(user?.name) || <UserIcon size={42} />}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              {user?.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-100 dark:border-blue-900 w-fit mx-auto sm:mx-0">
              {user?.profile?.fitnessGoal || "Athlete"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            <Mail size={14} />
            <span>{user?.email}</span>
          </p>

          <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
            <Calendar size={14} />
            <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "September 2026"}</span>
          </p>

          {user?.profile?.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-2 max-w-xl">
              "{user.profile.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Biometrics & BMI Analytics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* BMI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BODY MASS INDEX</span>
            <Activity size={18} className="text-blue-600" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                {bmiData.bmi}
              </span>
              <span className={`text-xs font-bold ${bmiData.color}`}>
                {bmiData.category}
              </span>
            </div>
            
            {/* Visual range meter */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full mt-3 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-rose-500 rounded-full"
                style={{ width: "100%" }}
              />
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-slate-900 dark:bg-white rounded-full shadow-md transition-all"
                style={{ left: `${Math.min(96, Math.max(4, bmiData.percent))}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
              <span>18.5</span>
              <span>25.0</span>
              <span>30.0</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Calculated from {height || 175} cm height and {weight || 74} kg weight.
          </p>
        </div>

        {/* Estimated BMR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ESTIMATED BMR</span>
            <Flame size={18} className="text-amber-500" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
                {bmiData.bmr}
              </span>
              <span className="text-xs font-semibold text-slate-400">kcal / day</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Base calories expended at rest before training workouts or runs.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Active Burn Goal:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">+{dailyCalorieTarget} kcal</span>
          </div>
        </div>

        {/* Target Milestone */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ACTIVE TARGETS</span>
            <Target size={18} className="text-emerald-500" />
          </div>

          <div className="my-4 space-y-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Gym Focus</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{fitnessGoal}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Running Goal</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{runningGoal}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Tracked across all gym splits and outdoor GPS runs.
          </p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
          Physical Attributes & Targets
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white"
              />
            </div>

            {/* Daily Calorie Target */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Daily Burn Target (kcal)
              </label>
              <input
                type="number"
                min="100"
                max="5000"
                value={dailyCalorieTarget}
                onChange={(e) => setDailyCalorieTarget(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-mono"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Height (cm)
              </label>
              <input
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-mono"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-mono"
              />
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Fitness Goal
              </label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white"
              >
                {goalOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Running Goal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Running Goal
              </label>
              <input
                type="text"
                value={runningGoal}
                onChange={(e) => setRunningGoal(e.target.value)}
                placeholder="e.g. 10K under 50 min"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Athlete Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your fitness background and ambitions..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Data Export & Account Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Export Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">DATA PORTABILITY</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">Export Activity Records</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Download your complete history of completed gym sessions, set metrics, and GPS route points.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-6">
            <button
              onClick={() => handleExport("json")}
              className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <FileJson size={15} />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => handleExport("csv")}
              className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={15} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => handleExport("gpx")}
              className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Compass size={15} />
              <span>Export GPX</span>
            </button>
          </div>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">DANGER ZONE</span>
            <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">Delete FitTrack Account</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Permanently delete your profile, workout logs, runs, and GPS paths. This action cannot be reversed.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Account Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Are you absolutely sure?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All your workout logs, personal records, and GPS running routes will be permanently removed.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 cursor-pointer"
            >
              {deleting ? "Deleting..." : "Permanently Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};