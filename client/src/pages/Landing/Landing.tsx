import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Dumbbell,
  Footprints,
  TrendingUp,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Target,
  ChevronRight,
  ChevronLeft,
  Activity,
  Plus,
  Minus,
  Award,
  Mail
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../../components/Logo";

// =======================================================
// 1. MAGNETIC BUTTON HELPER
// =======================================================
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  to?: string;
  strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = "",
  onClick,
  to,
  strength = 0.25
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 200, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const buttonContent = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.95 }}
      className={`inline-block cursor-pointer select-none ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (to) {
    return <Link to={to}>{buttonContent}</Link>;
  }
  return buttonContent;
};

// =======================================================
// 2. ANIMATED NUMBER COUNTER
// =======================================================
const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  decimals?: number;
}> = ({ value, suffix = "", decimals = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Number(start.toFixed(decimals)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, decimals]);

  return (
    <span>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString()}
      {suffix}
    </span>
  );
};

// =======================================================
// MAIN LANDING COMPONENT
// =======================================================
export const Landing: React.FC = () => {
  const { user, loginWithEmailOnly } = useAuth();
  const navigate = useNavigate();

  // Email Authentication States
  const [heroEmail, setHeroEmail] = useState("");
  const [isSubmittingHero, setIsSubmittingHero] = useState(false);
  const [heroError, setHeroError] = useState<string | null>(null);

  const [footerEmail, setFooterEmail] = useState("");
  const [isSubmittingFooter, setIsSubmittingFooter] = useState(false);
  const [footerError, setFooterError] = useState<string | null>(null);

  const handleHeroEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroEmail || !heroEmail.includes("@")) {
      setHeroError("Please enter a valid email address.");
      return;
    }
    setHeroError(null);
    setIsSubmittingHero(true);
    try {
      await loginWithEmailOnly(heroEmail);
      navigate("/dashboard");
    } catch (err: any) {
      setHeroError(err.message || "Failed to authenticate with email.");
    } finally {
      setIsSubmittingHero(false);
    }
  };

  const handleFooterEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail || !footerEmail.includes("@")) {
      setFooterError("Please enter a valid email address.");
      return;
    }
    setFooterError(null);
    setIsSubmittingFooter(true);
    try {
      await loginWithEmailOnly(footerEmail);
      navigate("/dashboard");
    } catch (err: any) {
      setFooterError(err.message || "Failed to authenticate with email.");
    } finally {
      setIsSubmittingFooter(false);
    }
  };

  // Interactive Live Demo State
  const [activeSandboxTab, setActiveSandboxTab] = useState<"gym" | "running" | "yoyo">("gym");

  // Gym Sandbox State
  const [demoWeight, setDemoWeight] = useState(82.5);
  const [demoReps, setDemoReps] = useState(8);
  const [completedDemoSets, setCompletedDemoSets] = useState<number[]>([1]);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Running Sandbox State
  const [isRunningSim, setIsRunningSim] = useState(true);
  const [simDistance, setSimDistance] = useState(3.42);

  // Yo-Yo Sandbox State
  const [yoyoShuttle, setYoyoShuttle] = useState(1);
  const [isYoYoActive, setIsYoYoActive] = useState(false);
  const [shuttlePosition, setShuttlePosition] = useState<"coneA" | "coneB">("coneA");

  // Transformation Timeline State
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Rest Timer simulation effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isResting && restSecondsLeft > 0) {
      timer = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  const triggerRestTimer = () => {
    setRestSecondsLeft(60);
    setIsResting(true);
  };

  // Yo-Yo Shuttle simulation effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isYoYoActive) {
      interval = setInterval(() => {
        setShuttlePosition((prev) => (prev === "coneA" ? "coneB" : "coneA"));
        setYoyoShuttle((prev) => prev + 1);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [isYoYoActive]);

  // Running distance progression effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunningSim) {
      interval = setInterval(() => {
        setSimDistance((prev) => Number((prev + 0.01).toFixed(2)));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isRunningSim]);

  const timelineDays = [
    {
      day: "Day 01",
      title: "Baseline Calibration & VO2 Ceiling",
      description:
        "Calibrate your starting neuromuscular 1RM strength and run the official 20m Bangsbo Yo-Yo IR1 test. FitTrack establishes your aerobic ceiling and current strength benchmark.",
      metrics: [
        { label: "Bench 1RM", val: "85 kg" },
        { label: "Yo-Yo IR1", val: "Lvl 14.2 (680m)" },
        { label: "VO2 Max", val: "44.6 mL/kg" }
      ],
      tag: "IGNITION"
    },
    {
      day: "Week 02",
      title: "Progressive Overload Lock",
      description:
        "FitTrack's overload algorithm steps your compound lifts up by +2.5kg or enforces extra reps, backed by set-by-set precision rest clocks so no adaptation is left on the table.",
      metrics: [
        { label: "Tonnage Moved", val: "14,800 kg" },
        { label: "Rest Adherence", val: "98.2%" },
        { label: "Weekly Splits", val: "4 Completed" }
      ],
      tag: "ADAPTATION"
    },
    {
      day: "Month 01",
      title: "Velocity Shift & Sub-4 Pace Pacing",
      description:
        "Real satellite GPS tracking logs high-precision polylines, sub-second split dynamics, and cadence control. Perceived exertion drops as road mileage builds.",
      metrics: [
        { label: "5K Personal Best", val: "21:40 (-1m 15s)" },
        { label: "Average Pace", val: "4:20 /km" },
        { label: "GPS Accuracy", val: "±2 meters" }
      ],
      tag: "VELOCITY"
    },
    {
      day: "Month 03",
      title: "Peak Hybrid Athleticism",
      description:
        "Full fusion of raw gym power, muscle hypertrophy, and high-level aerobic conditioning. Personal records shattered, radar metrics maxed, and zero plateau.",
      metrics: [
        { label: "Squat 1RM", val: "+22.5 kg" },
        { label: "Yo-Yo IR1", val: "Lvl 18.4 (1,760m)" },
        { label: "Streak Momentum", val: "42 Days" }
      ],
      tag: "ELITE STATUS"
    }
  ];

  return (
    <div className="min-h-screen bg-[#080D1A] text-white selection:bg-[#FF6B4A] selection:text-white overflow-x-hidden font-['Inter'] relative">

      {/* Ambient Radial Soft Atmospheric Glows (Athletic Midnight Theme) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[650px] h-[650px] bg-blue-600/12 rounded-full blur-[160px]" />
        <div className="absolute top-[35%] right-[-5%] w-[550px] h-[550px] bg-[#FF6B4A]/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[180px]" />
      </div>

      {/* =======================================================
          FROSTED GLASS CLEAN NAVIGATION BAR (MATCHING TOPBAR)
         ======================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080D1A]/85 border-b border-white/10 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo with Sprinter Emblem */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="md" animated={true} />
            <div>
              <div className="flex items-center tracking-wider font-black font-['Plus_Jakarta_Sans'] leading-tight">
                <span className="text-white text-lg">FIT</span>
                <span className="text-sky-400 text-lg">TRACK</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase block mt-0.5">
                Train • Run • Track
              </span>
            </div>
          </Link>

          {/* Quick Anchor Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wide text-slate-300 uppercase">
            <a href="#mission" className="hover:text-[#FF6B4A] transition-colors">
              Mission
            </a>
            <a href="#pillars" className="hover:text-[#FF6B4A] transition-colors">
              The 3 Pillars
            </a>
            <a
              href="#sandbox"
              className="hover:text-[#FF6B4A] transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-ping" />
              Live Demo
            </a>
            <a href="#timeline" className="hover:text-[#FF6B4A] transition-colors">
              Daily Evolution
            </a>
          </nav>

          {/* Contextual Auth CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <MagneticButton
                onClick={() => navigate("/dashboard")}
                className="bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-extrabold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF6B4A]/25"
              >
                Go to Dashboard
                <ArrowRight size={14} />
              </MagneticButton>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-full transition-colors"
                >
                  Athlete Sign In
                </Link>

                <MagneticButton
                  to="/register"
                  className="bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-extrabold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#FF6B4A]/25"
                >
                  <Sparkles size={14} className="stroke-[2.5]" />
                  Join FitTrack
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* =======================================================
          HERO SECTION: ATHLETIC MIDNIGHT THEME
         ======================================================= */}
      <section className="relative z-10 pt-14 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Anti-Diet & Mission Chip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-xs mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
            Zero Diet Noise • 100% Raw Athletic Performance
          </span>
        </motion.div>

        {/* Main Title - Pure White & Gradient Coral/Sky */}
        <div className="max-w-5xl mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-['Plus_Jakarta_Sans'] tracking-tight leading-[0.95] uppercase text-white">
              TRAIN SMARTER.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] via-[#FF8566] to-sky-400">
                RUN STRONGER.
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Manifesto Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl text-slate-400 text-base sm:text-lg font-normal leading-relaxed mb-10"
        >
          We eliminated calorie counting, food logging, and social feeds. FitTrack is engineered
          exclusively for serious lifters, runners, and athletes who want calibrated progressive
          overload, live satellite GPS route pacing, and the official Bangsbo Yo-Yo IR1 test.
        </motion.p>

        {/* Email Authentication Hero Box (Midnight Dark Card) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="w-full max-w-xl mb-12"
        >
          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton
                to="/dashboard"
                strength={0.3}
                className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-black text-sm px-8 py-4 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#FF6B4A]/25"
              >
                Go to Dashboard
                <ArrowRight size={17} className="stroke-[2.5]" />
              </MagneticButton>
            </div>
          ) : (
            <form onSubmit={handleHeroEmailAuth} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center p-1.5 bg-[#0B1528] rounded-3xl sm:rounded-full border border-white/10 shadow-2xl gap-2">
                <div className="flex items-center gap-3 pl-4 pr-2 w-full sm:w-auto flex-1 py-2 sm:py-0">
                  <Mail size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={heroEmail}
                    onChange={(e) => {
                      setHeroEmail(e.target.value);
                      if (heroError) setHeroError(null);
                    }}
                    placeholder="Enter your email address to start..."
                    required
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingHero}
                  className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#FA5A36] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl sm:rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B4A]/25 transition-all cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isSubmittingHero ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Starting...
                    </span>
                  ) : (
                    <>
                      <span>Start Transformation</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {heroError && (
                <p className="text-xs font-semibold text-rose-400 text-center">
                  {heroError}
                </p>
              )}

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Instant Email Access
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Zero Password Hassle
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("sandbox");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-slate-300 hover:text-[#FF6B4A] underline font-bold cursor-pointer"
                >
                  Try Sandbox
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* The 4 Core Metric Badges (Dark Bento Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-4">
          <div className="p-5 rounded-3xl bg-[#0B1528] border border-white/10 shadow-lg text-left hover:border-white/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6B4A] block mb-1">
              PILLAR 01
            </span>
            <div className="text-sm font-extrabold text-white">Progressive Overload</div>
            <p className="text-xs text-slate-400 mt-0.5">
              +<AnimatedCounter value={2.5} decimals={1} suffix="kg" /> dynamic step
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0B1528] border border-white/10 shadow-lg text-left hover:border-white/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block mb-1">
              PILLAR 02
            </span>
            <div className="text-sm font-extrabold text-white">Real Satellite GPS</div>
            <p className="text-xs text-slate-400 mt-0.5">
              <AnimatedCounter value={99.4} decimals={1} suffix="%" /> route fidelity
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0B1528] border border-white/10 shadow-lg text-left hover:border-white/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block mb-1">
              PILLAR 02 (TEST)
            </span>
            <div className="text-sm font-extrabold text-white">Yo-Yo IR1 Protocol</div>
            <p className="text-xs text-slate-400 mt-0.5">
              <AnimatedCounter value={20} suffix="m" /> intermittent shuttle
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0B1528] border border-white/10 shadow-lg text-left hover:border-white/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
              PILLAR 03
            </span>
            <div className="text-sm font-extrabold text-white">Tonnage Analytics</div>
            <p className="text-xs text-slate-400 mt-0.5">
              <AnimatedCounter value={14800} suffix=" kg" /> weekly volume
            </p>
          </div>
        </div>
      </section>

      {/* =======================================================
          VELOCITY MARQUEE TICKER (DARK ATHLETIC)
         ======================================================= */}
      <section className="relative z-10 py-5 overflow-hidden bg-[#080D1A] border-y border-white/10 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {[1, 2, 3, 4].map((set) => (
            <div key={set} className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-400">
              <span className="text-white">TRAIN SMARTER</span>
              <span className="text-[#FF6B4A]">✦</span>
              <span className="text-slate-300">RUN STRONGER</span>
              <span className="text-sky-400">✦</span>
              <span className="text-white">PROGRESSIVE OVERLOAD</span>
              <span className="text-[#FF6B4A]">✦</span>
              <span className="text-sky-400">SATELLITE GPS POLYLINES</span>
              <span className="text-emerald-400">✦</span>
              <span className="text-white">BANGSBO YO-YO IR1</span>
              <span className="text-[#FF6B4A]">✦</span>
              <span className="text-slate-300">ZERO DIET NOISE</span>
              <span className="text-sky-400">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* =======================================================
          ABOUT US & MISSION STATEMENT
         ======================================================= */}
      <motion.section
        id="mission"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Editorial Statement */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B4A]/15 border border-[#FF6B4A]/40 text-[#FF6B4A] text-[11px] font-black uppercase tracking-widest">
              <Target size={13} />
              OUR PHILOSOPHY & GOAL
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] leading-tight tracking-tight uppercase text-white">
              The fitness industry is drowning in gimmicks.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-sky-400">
                FitTrack is built for pure execution.
              </span>
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Open almost any fitness app today, and you are forced through endless screens of calorie
              counting, barcode scanners, macro pie charts, and sponsored influencer selfies.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              We asked a simple question: <strong className="text-white">what if an app focused 100% on the work that actually changes your biology?</strong> Heavy iron moved with calibrated progressive overload. Real miles pounded under true satellite positioning. Aerobic capacity measured by the same Bangsbo Yo-Yo protocol used by elite football clubs worldwide.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-3xl bg-[#0B1528] border border-white/10 shadow-lg">
                <div className="w-9 h-9 rounded-2xl bg-[#FF6B4A]/15 text-[#FF6B4A] flex items-center justify-center font-black text-sm mb-3">
                  01
                </div>
                <h4 className="font-extrabold text-sm text-white mb-1">Zero Nutrition Noise</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No diet logging. No food shaming. We don't care what you ate—we care about the output you produce.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-[#0B1528] border border-white/10 shadow-lg">
                <div className="w-9 h-9 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-black text-sm mb-3">
                  02
                </div>
                <h4 className="font-extrabold text-sm text-white mb-1">Authentic Sports Science</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real GPS geolocation coordinates and Bangsbo intermittent recovery standards, not step-counter estimates.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Architecture Card (Dashboard Bento Style) */}
          <div className="lg:col-span-6">
            <div className="relative p-8 sm:p-10 rounded-[36px] bg-[#0B1528] border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#FF6B4A] animate-ping" />
                  <span className="text-xs font-black tracking-wider uppercase text-white">
                    FITTRACK ARCHITECTURE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#FF6B4A] bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 px-2.5 py-1 rounded-full font-bold">
                  V2.5 ELITE
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-[#FF6B4A]/20 text-[#FF6B4A] shrink-0">
                    <Dumbbell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Hypertrophy & Strength System</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Structured Splits targeting Chest, Back, Shoulders, Arms, and Legs. Set-by-set load calculation and automatic 60s rest countdowns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                    <Footprints size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Dual-Mode Running Engine</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Mode 1: High-accuracy Leaflet GPS with live pace splits. Mode 2: Official Yo-Yo IR1 test with automated 20m shuttle beep cadence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Unforgiving Data Analytics</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Weekly tonnage volume, unbroken streak tracking, VO2 max estimations, and automatic Personal Record detection.
                    </p>
                  </div>
                </div>
              </div>

              {/* Heart Cadence Visualizer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Activity size={13} className="text-[#FF6B4A]" />
                    LIVE ATHLETIC CADENCE & EQUALIZER
                  </span>
                  <span className="text-white font-bold">172 BPM • 4:18 /KM</span>
                </div>
                <div className="flex items-end justify-between gap-1 h-12 px-2 py-1 bg-black/40 rounded-2xl border border-white/5">
                  {[20, 45, 70, 95, 55, 80, 100, 65, 40, 60, 85, 70, 90, 50, 75, 45, 65, 95, 80, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${Math.max(15, h * 0.4)}%`, `${h}%`, `${Math.max(20, h * 0.7)}%`] }}
                      transition={{ duration: 1.2 + (i % 4) * 0.2, repeat: Infinity, repeatType: "reverse" }}
                      className={`w-1.5 rounded-full ${i % 3 === 0 ? "bg-[#FF6B4A]" : i % 2 === 0 ? "bg-sky-400" : "bg-slate-700"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =======================================================
          THE 3 CORE PILLARS (MIDNIGHT BENTO CARDS)
         ======================================================= */}
      <motion.section
        id="pillars"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[11px] font-black uppercase tracking-widest mb-4">
          <Zap size={13} />
          UNCOMPROMISING EXECUTION
        </div>

        <h2 className="text-4xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight mb-4 text-white">
          The 3 Pillars of FitTrack
        </h2>
        <p className="max-w-xl mx-auto text-slate-400 text-sm mb-16">
          Everything you need to build maximum strength, road speed, and aerobic capacity—and
          nothing you don't.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Gym Mastery */}
          <div className="h-full p-8 rounded-[36px] bg-[#0B1528] border border-white/10 shadow-2xl flex flex-col justify-between text-left hover:border-white/20 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 text-[#FF6B4A] flex items-center justify-center mb-6 shadow-sm">
                <Dumbbell size={24} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B4A]">
                PILLAR 01
              </span>
              <h3 className="text-2xl font-black text-white mt-1 mb-3">Gym Strength & Splits</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Log your sets, reps, and weights with instant progressive overload calculation. Precision rest timer ensures optimal ATP recovery between sets.
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-[#FF6B4A]" />
                  <span>Push, Pull, Legs & Upper/Lower splits</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-[#FF6B4A]" />
                  <span>Automated rest interval stopwatch</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-[#FF6B4A]" />
                  <span>3D exercise animations & anatomy guide</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#FF6B4A]">
              <span>Explore Gym System</span>
              <ChevronRight size={16} />
            </div>
          </div>

          {/* Card 2: Road Running & Yo-Yo IR1 */}
          <div className="h-full p-8 rounded-[36px] bg-[#0B1528] border border-white/10 shadow-2xl flex flex-col justify-between text-left hover:border-white/20 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-6 shadow-sm">
                <Footprints size={24} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                PILLAR 02
              </span>
              <h3 className="text-2xl font-black text-white mt-1 mb-3">GPS Run & Yo-Yo Test</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Dual-discipline running. Switch seamlessly between outdoor GPS road tracking with real Leaflet polylines and the official 20m Bangsbo Yo-Yo IR1 test.
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-sky-400" />
                  <span>Live satellite route & sub-second pace</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-sky-400" />
                  <span>Official 20m shuttle beep test audio</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-sky-400" />
                  <span>Aerobic VO2 max benchmark score</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-400">
              <span>Explore Running System</span>
              <ChevronRight size={16} />
            </div>
          </div>

          {/* Card 3: Progress Analytics */}
          <div className="h-full p-8 rounded-[36px] bg-[#0B1528] border border-white/10 shadow-2xl flex flex-col justify-between text-left hover:border-white/20 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-sm">
                <TrendingUp size={24} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                PILLAR 03
              </span>
              <h3 className="text-2xl font-black text-white mt-1 mb-3">Progress Intelligence</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Scientific analytics that show true bodily transformation. Track weekly volume tonnage, consistency streaks, and auto-updated personal record achievements.
              </p>

              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Volume curves & muscle group distribution</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Consistency streaks with milestone badges</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>Automatic 1RM and PR tracking radar</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Explore Analytics</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* =======================================================
          INTERACTIVE LIVE SANDBOX (DARK THEME)
         ======================================================= */}
      <motion.section
        id="sandbox"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 text-[#FF6B4A] text-[11px] font-black uppercase tracking-widest mb-3">
            <Activity size={13} />
            TRY IT BEFORE SIGNING UP
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight text-white">
            Interactive Test-Drive Sandbox
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mt-2">
            Interact with our actual workout logger, GPS running route simulator, and 20m Yo-Yo beep test right now.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 max-w-lg mx-auto mb-10">
          {[
            { id: "gym", label: "Gym Overload", icon: <Dumbbell size={15} /> },
            { id: "running", label: "Satellite GPS Run", icon: <Footprints size={15} /> },
            { id: "yoyo", label: "Yo-Yo Shuttle", icon: <Flame size={15} /> }
          ].map((tab) => {
            const isActive = activeSandboxTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSandboxTab(tab.id as any)}
                className={`relative px-4 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all flex-1 justify-center z-10 cursor-pointer ${
                  isActive ? "text-white bg-[#FF6B4A] shadow-md shadow-[#FF6B4A]/30" : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sandbox Card Surface (Midnight Bento Card) */}
        <div className="p-6 sm:p-10 rounded-[36px] bg-[#0B1528] border border-white/10 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          {/* TAB 1: GYM OVERLOAD LOGGER */}
          {activeSandboxTab === "gym" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-[#FF6B4A] uppercase tracking-widest block mb-1 font-bold">
                    EXERCISE 01 • CHEST & DELTS
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                    Incline Barbell Bench Press
                  </h3>
                  <span className="text-xs text-slate-400">Target: 3 Sets • 8-10 Reps • RPE 8.5</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={triggerRestTimer}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      isResting
                        ? "bg-[#FF6B4A] text-white animate-pulse shadow-md"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    <Clock size={14} />
                    {isResting ? `Resting: ${restSecondsLeft}s` : "Start 60s Rest"}
                  </button>
                </div>
              </div>

              {/* Set Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                {/* Weight Stepper */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Working Weight
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDemoWeight((prev) => Math.max(20, prev - 2.5))}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <Minus size={18} />
                    </button>

                    <div className="font-mono text-3xl font-black text-white">
                      {demoWeight.toFixed(1)}{" "}
                      <span className="text-sm font-sans text-slate-400">kg</span>
                    </div>

                    <button
                      onClick={() => setDemoWeight((prev) => prev + 2.5)}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Reps Stepper */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Reps Logged
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setDemoReps((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <Minus size={18} />
                    </button>

                    <div className="font-mono text-3xl font-black text-white">
                      {demoReps} <span className="text-sm font-sans text-slate-400">reps</span>
                    </div>

                    <button
                      onClick={() => setDemoReps((prev) => prev + 1)}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sets Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Tap to Complete Sets (Try It)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((setNum) => {
                    const isDone = completedDemoSets.includes(setNum);
                    return (
                      <button
                        key={setNum}
                        onClick={() => {
                          if (isDone) {
                            setCompletedDemoSets((prev) => prev.filter((s) => s !== setNum));
                          } else {
                            setCompletedDemoSets((prev) => [...prev, setNum]);
                            triggerRestTimer();
                          }
                        }}
                        className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isDone
                            ? "bg-[#FF6B4A]/20 border-[#FF6B4A] text-[#FF6B4A]"
                            : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
                        }`}
                      >
                        <span>SET {setNum}</span>
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-[#FF6B4A]" />
                        ) : (
                          <span className="text-[10px] text-slate-400 uppercase">Tap</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume Feedback */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <span className="text-slate-400 font-medium">Session Exercise Volume</span>
                <span className="font-mono font-bold text-white">
                  {(completedDemoSets.length * demoWeight * demoReps).toLocaleString()} kg
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SATELLITE GPS RUN */}
          {activeSandboxTab === "running" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block mb-1 font-bold">
                    REAL-TIME SATELLITE TELEMETRY
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                    Outdoor GPS Route Tracker
                  </h3>
                </div>

                <button
                  onClick={() => setIsRunningSim((prev) => !prev)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isRunningSim ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-sky-500 text-white"
                  }`}
                >
                  {isRunningSim ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isRunningSim ? "Pause Simulation" : "Resume Route"}</span>
                </button>
              </div>

              {/* Simulated GPS Map Canvas */}
              <div className="h-64 rounded-3xl bg-[#060D1A] border border-sky-900/40 relative overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full text-sky-400" viewBox="0 0 400 180" fill="none">
                  <path
                    d="M 30 140 C 90 120, 120 40, 200 60 C 270 80, 310 160, 370 70"
                    stroke="#0284C7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="6 4"
                  />
                  <circle cx="370" cy="70" r="7" fill="#FF6B4A" className="animate-ping" />
                  <circle cx="370" cy="70" r="6" fill="#FF6B4A" />
                </svg>

                {/* Floating GPS Stats Box */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-sm text-left">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Distance
                  </span>
                  <div className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                    {simDistance.toFixed(2)} <span className="text-xs font-normal text-slate-400 font-sans">km</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-sm text-right">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pace
                  </span>
                  <div className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                    4:18 <span className="text-xs font-normal text-slate-400 font-sans">/km</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: YO-YO SHUTTLE */}
          {activeSandboxTab === "yoyo" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-[#FF6B4A] uppercase tracking-widest block mb-1 font-bold">
                    OFFICIAL BANGSBO PROTOCOL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                    20m Intermittent Recovery Test
                  </h3>
                </div>

                <button
                  onClick={() => setIsYoYoActive(!isYoYoActive)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isYoYoActive ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-[#FF6B4A] text-white"
                  }`}
                >
                  {isYoYoActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isYoYoActive ? "Halt Shuttle" : "Start Beep Test"}</span>
                </button>
              </div>

              {/* Shuttle Track Visualizer */}
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-4">
                  <span>CONE A (0m)</span>
                  <span className="text-[#FF6B4A]">SHUTTLE #{yoyoShuttle}</span>
                  <span>CONE B (20m)</span>
                </div>

                <div className="h-4 bg-slate-800 rounded-full relative overflow-hidden">
                  <motion.div
                    animate={{ left: shuttlePosition === "coneA" ? "5%" : "90%" }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="absolute top-0 bottom-0 w-8 bg-[#FF6B4A] rounded-full shadow-md"
                  />
                </div>

                <div className="flex justify-between items-center mt-6 text-xs text-slate-400">
                  <span>Current Speed: <strong className="text-white">14.5 km/h</strong></span>
                  <span>Cumulative Distance: <strong className="text-white">{(yoyoShuttle * 40).toLocaleString()} meters</strong></span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* =======================================================
          DAILY EVOLUTION TIMELINE (DARK THEME)
         ======================================================= */}
      <motion.section
        id="timeline"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-widest mb-3">
            <Award size={13} />
            YOUR PHYSIOLOGICAL TRAJECTORY
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight text-white">
            How FitTrack Evolves Your Biology
          </h2>
        </div>

        {/* Timeline Day Switcher */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {timelineDays.map((t, idx) => (
            <button
              key={t.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                selectedDayIndex === idx
                  ? "bg-[#0B1528] border-[#FF6B4A] shadow-lg shadow-[#FF6B4A]/10"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                selectedDayIndex === idx ? "text-[#FF6B4A]" : "text-slate-400"
              }`}>
                {t.tag}
              </span>
              <div className="text-base font-black text-white font-['Plus_Jakarta_Sans']">{t.day}</div>
            </button>
          ))}
        </div>

        {/* Active Stage Card */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-[#0B1528] border border-white/10 shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#FF6B4A] uppercase tracking-wider mb-2 block">
              {timelineDays[selectedDayIndex].day} • {timelineDays[selectedDayIndex].tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 font-['Plus_Jakarta_Sans']">
              {timelineDays[selectedDayIndex].title}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              {timelineDays[selectedDayIndex].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {timelineDays[selectedDayIndex].metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {m.label}
                  </span>
                  <span className="text-base font-black text-white font-['Plus_Jakarta_Sans']">
                    {m.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* =======================================================
          CONVERSION CALL TO ACTION & FOOTER
         ======================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 py-24 px-6 bg-gradient-to-b from-[#080D1A] to-[#040810] border-t border-white/10 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 text-[#FF6B4A] flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Sparkles size={28} />
          </div>

          <h2 className="text-4xl sm:text-6xl font-black font-['Plus_Jakarta_Sans'] uppercase tracking-tight mb-6 text-white">
            Ready to stop scrolling and start training?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Your transformation starts with your first logged rep and your first tracked road mile.
            Join FitTrack today.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton
                to="/dashboard"
                strength={0.3}
                className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-black text-sm px-9 py-4 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#FF6B4A]/25"
              >
                Go to Dashboard
                <ArrowRight size={17} className="stroke-[2.5]" />
              </MagneticButton>
            </div>
          ) : (
            <form onSubmit={handleFooterEmailAuth} className="max-w-md mx-auto space-y-3">
              <div className="flex flex-col sm:flex-row items-center p-1.5 bg-[#0B1528] rounded-3xl sm:rounded-full border border-white/10 shadow-2xl gap-2">
                <div className="flex items-center gap-3 pl-4 pr-2 w-full sm:w-auto flex-1 py-2 sm:py-0">
                  <Mail size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => {
                      setFooterEmail(e.target.value);
                      if (footerError) setFooterError(null);
                    }}
                    placeholder="Enter your email address..."
                    required
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingFooter}
                  className="w-full sm:w-auto bg-[#FF6B4A] hover:bg-[#FA5A36] active:scale-95 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl sm:rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B4A]/25 transition-all cursor-pointer shrink-0 disabled:opacity-70"
                >
                  {isSubmittingFooter ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {footerError && (
                <p className="text-xs font-semibold text-rose-400 text-center">
                  {footerError}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Clean Minimalist Athletic Footer */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Logo size="sm" animated={false} />
            <div>
              <div className="flex items-center tracking-wider font-black font-['Plus_Jakarta_Sans'] leading-tight">
                <span className="text-white text-sm">FIT</span>
                <span className="text-sky-400 text-sm">TRACK</span>
              </div>
              <span className="text-[9px] font-extrabold text-slate-500 tracking-widest uppercase block">
                Train • Run • Track
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-1.5 sm:gap-3 text-center sm:text-right">
            <span>© {new Date().getFullYear()} FitTrack Athletic Systems. Strictly Performance.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400 font-medium">
              Developed by <strong className="text-white font-bold">Sourav Pandey</strong>
            </span>
          </div>
        </footer>
      </motion.section>
    </div>
  );
};

export default Landing;
