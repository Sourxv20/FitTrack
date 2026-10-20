import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, ArrowRight, Lock, Mail, AlertCircle, Sparkles, Eye, EyeOff, Footprints, TrendingUp, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Logo } from "../../components/Logo";

export const Login: React.FC = () => {
  const [authMode, setAuthMode] = useState<"instant_email" | "password">("instant_email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, loginWithEmailOnly, demoLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Instant Email Login
  const handleEmailOnlySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await loginWithEmailOnly(email);
      showToast("Authenticated successfully with email!", "success");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Email authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Traditional Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      showToast("Welcome back to FitTrack!", "success");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      showToast("Logged in as Sourav Pandey!", "success");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080D1A] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter'] overflow-hidden selection:bg-[#FF6B4A] selection:text-white">
      {/* Ambient background radial glow orbs (Athletic Midnight Theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B4A]/10 rounded-full blur-[150px]" />
        <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Header */}
        <Link to="/" className="inline-flex flex-col items-center mb-3 group">
          <Logo size="lg" animated={true} />
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] flex items-center justify-center">
          <span>FIT</span>
          <span className="text-sky-400">TRACK</span>
        </h1>
        <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Train Smarter • Run Stronger
        </p>
      </div>

      <div className="relative z-10 mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B1528] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-[32px] backdrop-blur-xl"
        >
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex p-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("instant_email");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                authMode === "instant_email"
                  ? "bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Email Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("password");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                authMode === "password"
                  ? "bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              With Password
            </button>
          </div>

          {/* OPTION 1: INSTANT EMAIL AUTHENTICATION */}
          {authMode === "instant_email" ? (
            <form onSubmit={handleEmailOnlySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@fittrack.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-2xl text-sm focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] focus:outline-none text-white placeholder-slate-500 transition-all font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">
                  Enter your email to immediately access your athlete dashboard.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FF6B4A] hover:bg-[#FA5A36] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#FF6B4A]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OPTION 2: TRADITIONAL PASSWORD AUTHENTICATION */
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@fittrack.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-white/10 rounded-2xl text-sm focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] focus:outline-none text-white placeholder-slate-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#FF6B4A] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-900/80 border border-white/10 rounded-2xl text-sm focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] focus:outline-none text-white placeholder-slate-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#FF6B4A] focus:ring-[#FF6B4A] cursor-pointer accent-[#FF6B4A]"
                />
                <label htmlFor="remember_me" className="ml-2.5 block text-xs font-medium text-slate-400 select-none cursor-pointer">
                  Remember my session
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FF6B4A] hover:bg-[#FA5A36] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-lg shadow-[#FF6B4A]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0B1528] px-3 text-slate-500 font-bold tracking-wider text-[10px]">
                or instant demo
              </span>
            </div>
          </div>

          {/* Quick Demo Login Option */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Sparkles size={16} className="text-[#FF6B4A]" />
            <span>1-Click Instant Demo Login (Sourav Pandey)</span>
          </button>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link to="/register" className="font-bold text-[#FF6B4A] hover:underline">
              Create free account
            </Link>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-xs text-slate-500 font-medium">
          FitTrack Athletic Systems • Developed by <span className="text-slate-300 font-bold">Sourav Pandey</span>
        </p>
      </div>
    </div>
  );
};
