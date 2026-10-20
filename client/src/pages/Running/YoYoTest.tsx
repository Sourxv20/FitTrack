import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Clock,
  Gauge,
  Trophy,
  History,
  ArrowRight,
  Sparkles,
  Zap,
  Info
} from "lucide-react";
import { yoyoService } from "../../services/workoutService";
import { YoYoTest as YoYoTestType } from "../../types";
import {
  ALL_YOYO_SHUTTLES,
  calculateYoYoDistance,
  formatYoYoDistance,
  estimateYoYoCalories,
  TOTAL_YOYO_SHUTTLES,
  MAX_YOYO_DISTANCE
} from "../../utils/yoyoIR1Config";
import { yoyoAudio } from "../../utils/yoyoAudio";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal";
import { formatDuration } from "../../utils/formatters";

type TestState = "READY" | "COUNTDOWN" | "RUNNING" | "RECOVERY" | "PAUSED" | "COMPLETED";

export const YoYoTest: React.FC = () => {
  // Test Lifecycle State
  const [testState, setTestState] = useState<TestState>("READY");
  const [countdownNum, setCountdownNum] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Yo-Yo Shuttle Progression State
  const [shuttleIndex, setShuttleIndex] = useState<number>(0);
  const [shuttlePhase, setShuttlePhase] = useState<"OUT" | "BACK">("OUT"); // OUT: 0-20m, BACK: 20-40m
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [nextBeepSeconds, setNextBeepSeconds] = useState<number>(0);
  const [beepPulse, setBeepPulse] = useState<boolean>(false);

  // Scoring & Distance
  const [completedFullShuttles, setCompletedFullShuttles] = useState<number>(0);
  const [reachedTurnLineInCurrent, setReachedTurnLineInCurrent] = useState<boolean>(false);

  // History & Modals
  const [savedTests, setSavedTests] = useState<YoYoTestType[]>([]);
  const [selectedTestDetail, setSelectedTestDetail] = useState<YoYoTestType | null>(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [savingTest, setSavingTest] = useState<boolean>(false);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  // Completed Test Snapshot
  const [completedSummary, setCompletedSummary] = useState<{
    testType: string;
    finalLevel: number;
    finalShuttle: number;
    finalSpeed: number;
    distanceMeters: number;
    durationSeconds: number;
    estimatedCalories: number;
  } | null>(null);

  // Accurate Timestamp Timing Engine Refs
  const engineRef = useRef<{
    testState: TestState;
    startTime: number;
    accumulatedPausedMs: number;
    pauseStartTime: number;
    shuttleIndex: number;
    shuttlePhaseStartTime: number;
    recoveryStartTime: number;
    hasTurnBeeped: boolean;
    hasRecoveryHalfBeeped: boolean;
    hasRecoveryWarn3: boolean;
    hasRecoveryWarn2: boolean;
    hasRecoveryWarn1: boolean;
    completedShuttles: number;
    reachedTurn: boolean;
    animationFrameId: number | null;
  }>({
    testState: "READY",
    startTime: 0,
    accumulatedPausedMs: 0,
    pauseStartTime: 0,
    shuttleIndex: 0,
    shuttlePhaseStartTime: 0,
    recoveryStartTime: 0,
    hasTurnBeeped: false,
    hasRecoveryHalfBeeped: false,
    hasRecoveryWarn3: false,
    hasRecoveryWarn2: false,
    hasRecoveryWarn1: false,
    completedShuttles: 0,
    reachedTurn: false,
    animationFrameId: null
  });

  const { showToast } = useToast();
  const { user } = useAuth();
  const userWeight = user?.profile?.weight || 72;

  // Load Past Yo-Yo Tests
  const loadHistory = useCallback(async () => {
    try {
      const res = await yoyoService.getTests();
      setSavedTests(res);
    } catch (err) {
      console.error("Failed to load Yo-Yo tests history:", err);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Synchronize audio mute state
  const handleToggleMute = () => {
    const nextVal = !isMuted;
    setIsMuted(nextVal);
    yoyoAudio.setMuted(nextVal);
  };

  // Trigger brief visual pulse on beep
  const triggerBeepVisual = () => {
    setBeepPulse(true);
    setTimeout(() => setBeepPulse(false), 350);
  };

  // Start Test Button clicked -> Initiate 3s countdown & unlock Web Audio
  const handleStartTestPrompt = () => {
    yoyoAudio.init();
    yoyoAudio.setMuted(isMuted);

    setTestState("COUNTDOWN");
    engineRef.current.testState = "COUNTDOWN";
    setCountdownNum(3);

    yoyoAudio.playCountdownPip(false);
    triggerBeepVisual();

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        yoyoAudio.playCountdownPip(false);
        triggerBeepVisual();
      } else {
        clearInterval(interval);
        startActualTest();
      }
    }, 1000);
  };

  // Actually launch the running test loop with timestamp precision
  const startActualTest = () => {
    const now = performance.now();

    engineRef.current = {
      testState: "RUNNING",
      startTime: now,
      accumulatedPausedMs: 0,
      pauseStartTime: 0,
      shuttleIndex: 0,
      shuttlePhaseStartTime: now,
      recoveryStartTime: 0,
      hasTurnBeeped: false,
      hasRecoveryHalfBeeped: false,
      hasRecoveryWarn3: false,
      hasRecoveryWarn2: false,
      hasRecoveryWarn1: false,
      completedShuttles: 0,
      reachedTurn: false,
      animationFrameId: null
    };

    setTestState("RUNNING");
    setShuttleIndex(0);
    setShuttlePhase("OUT");
    setCompletedFullShuttles(0);
    setReachedTurnLineInCurrent(false);
    setElapsedSeconds(0);

    yoyoAudio.playStartBeep();
    triggerBeepVisual();
  };

  // Main Test Timing Loop using requestAnimationFrame + Timestamps
  useEffect(() => {
    if (testState !== "RUNNING" && testState !== "RECOVERY") {
      if (engineRef.current.animationFrameId) {
        cancelAnimationFrame(engineRef.current.animationFrameId);
        engineRef.current.animationFrameId = null;
      }
      return;
    }

    const tick = () => {
      const now = performance.now();
      const eng = engineRef.current;

      if (eng.testState === "PAUSED" || eng.testState === "COMPLETED") {
        return;
      }

      // Total test elapsed time
      const totalElapsedMs = now - eng.startTime - eng.accumulatedPausedMs;
      const totalSec = Math.floor(totalElapsedMs / 1000);
      setElapsedSeconds(totalSec);

      const currentShuttle = ALL_YOYO_SHUTTLES[eng.shuttleIndex];
      if (!currentShuttle) {
        // Elite athlete finished all levels!
        handleFinishTest();
        return;
      }

      if (eng.testState === "RUNNING") {
        const shuttleElapsedMs = now - eng.shuttlePhaseStartTime;
        const shuttleElapsedSec = shuttleElapsedMs / 1000;
        const turnSec = currentShuttle.turnDurationSec;
        const runSec = currentShuttle.runDurationSec;

        // Check if runner reached the 20m turn point halfway through
        if (shuttleElapsedSec < turnSec) {
          setShuttlePhase("OUT");
          setNextBeepSeconds(Math.max(0, turnSec - shuttleElapsedSec));
        } else {
          // Halfway passed -> Turn
          if (!eng.hasTurnBeeped) {
            eng.hasTurnBeeped = true;
            eng.reachedTurn = true;
            setReachedTurnLineInCurrent(true);
            setShuttlePhase("BACK");
            yoyoAudio.playTurnBeep();
            triggerBeepVisual();
          }
          setNextBeepSeconds(Math.max(0, runSec - shuttleElapsedSec));
        }

        // Check if 40m shuttle run completed
        if (shuttleElapsedSec >= runSec) {
          // Shuttle completed!
          eng.completedShuttles += 1;
          eng.reachedTurn = false;
          setCompletedFullShuttles(eng.completedShuttles);
          setReachedTurnLineInCurrent(false);

          yoyoAudio.playShuttleEndBeep();
          triggerBeepVisual();

          // Check if speed level increases on the upcoming shuttle
          const nextShuttle = ALL_YOYO_SHUTTLES[eng.shuttleIndex + 1];
          if (nextShuttle && nextShuttle.level !== currentShuttle.level) {
            setTimeout(() => {
              yoyoAudio.playLevelUp();
            }, 300);
          }

          // Transition to 10s active RECOVERY period
          eng.testState = "RECOVERY";
          eng.recoveryStartTime = now;
          eng.hasRecoveryHalfBeeped = false;
          eng.hasRecoveryWarn3 = false;
          eng.hasRecoveryWarn2 = false;
          eng.hasRecoveryWarn1 = false;
          setTestState("RECOVERY");
          yoyoAudio.playRecoveryCue();
        }
      } else if (eng.testState === "RECOVERY") {
        const recElapsedMs = now - eng.recoveryStartTime;
        const recElapsedSec = recElapsedMs / 1000;
        const recRemainingSec = Math.max(0, 10.0 - recElapsedSec);
        setNextBeepSeconds(recRemainingSec);

        // Warning at 5s remaining
        if (recElapsedSec >= 5.0 && !eng.hasRecoveryHalfBeeped) {
          eng.hasRecoveryHalfBeeped = true;
          yoyoAudio.playCountdownPip(false);
          triggerBeepVisual();
        }

        // Countdown pips at 3s, 2s, 1s
        if (recElapsedSec >= 7.0 && !eng.hasRecoveryWarn3) {
          eng.hasRecoveryWarn3 = true;
          yoyoAudio.playCountdownPip(false);
          triggerBeepVisual();
        }
        if (recElapsedSec >= 8.0 && !eng.hasRecoveryWarn2) {
          eng.hasRecoveryWarn2 = true;
          yoyoAudio.playCountdownPip(false);
          triggerBeepVisual();
        }
        if (recElapsedSec >= 9.0 && !eng.hasRecoveryWarn1) {
          eng.hasRecoveryWarn1 = true;
          yoyoAudio.playCountdownPip(false);
          triggerBeepVisual();
        }

        // Recovery finished (10s elapsed) -> Begin next shuttle!
        if (recElapsedSec >= 10.0) {
          eng.shuttleIndex += 1;
          eng.testState = "RUNNING";
          eng.shuttlePhaseStartTime = now;
          eng.hasTurnBeeped = false;
          eng.reachedTurn = false;

          setShuttleIndex(eng.shuttleIndex);
          setTestState("RUNNING");
          setShuttlePhase("OUT");
          setReachedTurnLineInCurrent(false);

          yoyoAudio.playStartBeep();
          triggerBeepVisual();
        }
      }

      eng.animationFrameId = requestAnimationFrame(tick);
    };

    engineRef.current.animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (engineRef.current.animationFrameId) {
        cancelAnimationFrame(engineRef.current.animationFrameId);
        engineRef.current.animationFrameId = null;
      }
    };
  }, [testState]);

  // Pause Test
  const handlePauseTest = () => {
    if (testState !== "RUNNING" && testState !== "RECOVERY") return;
    const now = performance.now();
    engineRef.current.pauseStartTime = now;
    engineRef.current.testState = "PAUSED";
    setTestState("PAUSED");
  };

  // Resume Test
  const handleResumeTest = () => {
    if (testState !== "PAUSED") return;
    const now = performance.now();
    const pausedMs = now - engineRef.current.pauseStartTime;
    engineRef.current.accumulatedPausedMs += pausedMs;
    engineRef.current.shuttlePhaseStartTime += pausedMs;
    if (engineRef.current.recoveryStartTime > 0) {
      engineRef.current.recoveryStartTime += pausedMs;
    }

    engineRef.current.testState = engineRef.current.recoveryStartTime > 0 ? "RECOVERY" : "RUNNING";
    setTestState(engineRef.current.testState);
  };

  // Finish / Terminate Test
  const handleFinishTest = () => {
    const eng = engineRef.current;
    eng.testState = "COMPLETED";
    setTestState("COMPLETED");

    yoyoAudio.playTestEnd();
    triggerBeepVisual();

    const currShuttle = ALL_YOYO_SHUTTLES[eng.shuttleIndex] || ALL_YOYO_SHUTTLES[ALL_YOYO_SHUTTLES.length - 1];
    const finalDist = calculateYoYoDistance(eng.completedShuttles, eng.reachedTurn);
    const now = performance.now();
    const finalDurationSec = Math.max(1, Math.floor((now - eng.startTime - eng.accumulatedPausedMs) / 1000));
    const estimatedCal = estimateYoYoCalories(finalDurationSec, userWeight);

    const summary = {
      testType: "Yo-Yo IR1",
      finalLevel: currShuttle.level,
      finalShuttle: currShuttle.shuttleNumberInLevel,
      finalSpeed: currShuttle.speedKmH,
      distanceMeters: finalDist,
      durationSeconds: finalDurationSec,
      estimatedCalories: estimatedCal
    };

    setCompletedSummary(summary);
    setShowResultModal(true);

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  // Reset to Ready screen
  const handleResetToReady = () => {
    setTestState("READY");
    engineRef.current.testState = "READY";
    setShuttleIndex(0);
    setShuttlePhase("OUT");
    setElapsedSeconds(0);
    setNextBeepSeconds(0);
    setCompletedFullShuttles(0);
    setReachedTurnLineInCurrent(false);
    setCompletedSummary(null);
  };

  // Save Test Result to PostgreSQL Database
  const handleSaveResult = async () => {
    if (!completedSummary) return;
    setSavingTest(true);
    try {
      const saved = await yoyoService.saveTest({
        testType: completedSummary.testType,
        finalLevel: completedSummary.finalLevel,
        finalShuttle: completedSummary.finalShuttle,
        finalSpeed: completedSummary.finalSpeed,
        distance: completedSummary.distanceMeters,
        duration: completedSummary.durationSeconds,
        calories: completedSummary.estimatedCalories
      });

      setJustSavedId(saved.id);
      showToast("Yo-Yo test result saved to your profile!", "success");
      await loadHistory();
    } catch (err: any) {
      showToast(err.message || "Failed to save Yo-Yo test.", "error");
    } finally {
      setSavingTest(false);
    }
  };

  // Current Active Shuttle Metadata
  const currentShuttle = ALL_YOYO_SHUTTLES[shuttleIndex] || ALL_YOYO_SHUTTLES[0];
  const currentMeters = calculateYoYoDistance(completedFullShuttles, reachedTurnLineInCurrent);
  const { metersStr, kmStr } = formatYoYoDistance(currentMeters);

  return (
    <div className="space-y-6">
      {/* Test Active / Control Panel */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-900 border transition-all duration-300 ${
          beepPulse
            ? "border-emerald-400 shadow-2xl shadow-emerald-500/30 scale-[1.002]"
            : "border-slate-800 shadow-xl"
        }`}
      >
        {/* Subtle Ambient Glowing Backdrop */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Control Bar: Audio Mute & Test Type */}
        <div className="relative z-10 px-5 sm:px-8 pt-5 sm:pt-6 flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  testState === "RUNNING"
                    ? "bg-emerald-400"
                    : testState === "RECOVERY"
                    ? "bg-amber-400"
                    : "bg-slate-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  testState === "RUNNING"
                    ? "bg-emerald-500"
                    : testState === "RECOVERY"
                    ? "bg-amber-500"
                    : "bg-slate-400"
                }`}
              />
            </span>
            <span className="text-xs font-black tracking-widest text-slate-300 uppercase">
              YO-YO IR1 • 20M SHUTTLE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isMuted
                  ? "bg-red-950/40 text-red-400 border border-red-800/50 hover:bg-red-900/60"
                  : "bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700"
              }`}
              title={isMuted ? "Unmute Audio Cues" : "Mute Audio Cues"}
            >
              {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>
        </div>

        {/* Dynamic State Views */}
        <div className="relative z-10 p-5 sm:p-8">
          <AnimatePresence mode="wait">
            {/* 1. PRE-TEST SCREEN (READY) */}
            {testState === "READY" && (
              <motion.div
                key="ready-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center max-w-2xl mx-auto py-4"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Trophy size={13} /> Official Jens Bangsbo Protocol
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans']">
                    YO-YO TEST
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-400 mt-2">
                    "Measure your endurance and recovery."
                  </p>
                </div>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Test</span>
                    <p className="text-sm font-extrabold text-white mt-0.5">Yo-Yo IR1</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Distance</span>
                    <p className="text-sm font-extrabold text-emerald-400 mt-0.5">20 Meters</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Start Speed</span>
                    <p className="text-sm font-extrabold text-blue-400 mt-0.5">10.0 km/h</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Recovery</span>
                    <p className="text-sm font-extrabold text-amber-400 mt-0.5">10 Seconds</p>
                  </div>
                </div>

                {/* Visual Field Diagram */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Course Layout Diagram
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      20m Sprint + 5m Recovery
                    </span>
                  </div>

                  {/* Pitch representation */}
                  <div className="relative py-4 px-2">
                    <div className="flex items-center justify-between relative">
                      {/* Recovery Line (Behind) */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                        <span className="text-[10px] font-black text-amber-300 mt-2 uppercase tracking-tighter">
                          RECOVERY
                        </span>
                        <span className="text-[9px] text-slate-400">5m cone</span>
                      </div>

                      {/* 5m Recovery Arrow */}
                      <div className="flex-1 flex items-center justify-center border-t-2 border-dashed border-amber-400/40 mx-2 relative">
                        <span className="absolute -top-3 text-[9px] font-bold text-amber-300/80 bg-slate-900 px-1">
                          5m
                        </span>
                      </div>

                      {/* Start Line */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30" />
                        <span className="text-[11px] font-black text-white mt-2 uppercase tracking-wider">
                          START LINE
                        </span>
                        <span className="text-[9px] text-slate-400">0 meters</span>
                      </div>

                      {/* 20m Main Sprint Course Arrow */}
                      <div className="flex-[3] flex items-center justify-center border-t-2 border-emerald-400 mx-3 relative">
                        <span className="absolute -top-3.5 text-[10px] sm:text-xs font-black text-emerald-300 bg-slate-900 px-2 tracking-widest uppercase">
                          &lt;---------- 20 METERS ----------&gt;
                        </span>
                      </div>

                      {/* Turn Line */}
                      <div className="flex flex-col items-center z-10">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/30" />
                        <span className="text-[11px] font-black text-emerald-400 mt-2 uppercase tracking-wider">
                          TURN LINE
                        </span>
                        <span className="text-[9px] text-slate-400">20 meters</span>
                      </div>
                    </div>
                  </div>

                  {/* How the test works instructions */}
                  <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-700/50">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <Zap size={14} className="text-yellow-400" /> How the test works:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] sm:text-xs pl-1">
                      <li>Run between the two lines according to the audio beep.</li>
                      <li>Turn at the 20m line when the turn beep sounds and sprint back to start.</li>
                      <li>Return during the 10-second active recovery period (jog around the 5m recovery marker).</li>
                      <li>The test becomes progressively faster with each level.</li>
                    </ul>
                  </div>
                </div>

                {/* Safety & Medical UX Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 text-left">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-200">Safety Notice</p>
                    <p className="text-[11px] sm:text-xs text-amber-300/90 leading-relaxed">
                      Perform the test in a safe, clear 20-meter space. Stop if you feel unwell or unsafe. FitTrack is designed for fitness tracking and is not a medical diagnostic tool.
                    </p>
                  </div>
                </div>

                {/* Start Test Trigger */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleStartTestPrompt}
                    className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
                  >
                    <Play size={20} className="fill-current" />
                    <span>START TEST</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* 2. COUNTDOWN SCREEN */}
            {testState === "COUNTDOWN" && (
              <motion.div
                key="countdown-screen"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="py-16 text-center space-y-4"
              >
                <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-400">
                  GET READY...
                </span>
                <div className="text-8xl sm:text-9xl font-black text-white font-['Plus_Jakarta_Sans'] tracking-tighter">
                  {countdownNum}
                </div>
                <p className="text-xs font-semibold text-slate-400">
                  Sprint to the 20m turn line on the starting beep!
                </p>
              </motion.div>
            )}

            {/* 3. ACTIVE TEST SCREEN (RUNNING / RECOVERY / PAUSED) */}
            {(testState === "RUNNING" || testState === "RECOVERY" || testState === "PAUSED") && (
              <motion.div
                key="active-test-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* State Banner: High-contrast athletic status */}
                <div
                  className={`py-3 px-5 rounded-2xl text-center font-black tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                    testState === "PAUSED"
                      ? "bg-amber-500/20 border border-amber-500 text-amber-300"
                      : testState === "RECOVERY"
                      ? "bg-amber-500/20 border border-amber-400 text-amber-300"
                      : shuttlePhase === "OUT"
                      ? "bg-blue-600/30 border border-blue-500 text-blue-300"
                      : "bg-emerald-600/30 border border-emerald-500 text-emerald-300"
                  }`}
                >
                  {testState === "PAUSED" ? (
                    <span className="text-sm sm:text-base">⏸️ TEST PAUSED</span>
                  ) : testState === "RECOVERY" ? (
                    <span className="text-sm sm:text-base">
                      🚶 ACTIVE RECOVERY (10s) — NEXT SHUTTLE IN {nextBeepSeconds.toFixed(1)}s
                    </span>
                  ) : shuttlePhase === "OUT" ? (
                    <span className="text-sm sm:text-base">
                      ⚡ SPRINT OUT TO TURN LINE (20m)
                    </span>
                  ) : (
                    <span className="text-sm sm:text-base">
                      🏁 SPRINT BACK TO START LINE (20m)
                    </span>
                  )}
                </div>

                {/* Massive Typography Hero Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Current Level */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center flex flex-col justify-center">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      CURRENT STAGE
                    </span>
                    <div className="text-4xl sm:text-6xl font-black text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
                      LEVEL {String(currentShuttle.level).padStart(2, "0")}
                    </div>
                    <span className="text-xs font-bold text-blue-400 mt-1">
                      SHUTTLE {String(currentShuttle.shuttleNumberInLevel).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Next Beep Countdown (Central prominent focal point) */}
                  <div
                    className={`bg-slate-800/80 border rounded-2xl p-5 text-center flex flex-col justify-center relative overflow-hidden transition-all ${
                      testState === "RECOVERY"
                        ? "border-amber-400/80 shadow-lg shadow-amber-500/20"
                        : "border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {testState === "RECOVERY" ? "RECOVERY REMAINING" : "NEXT BEEP"}
                    </span>
                    <div className="text-5xl sm:text-7xl font-black text-emerald-400 font-mono tracking-tight mt-1">
                      {nextBeepSeconds.toFixed(1)}s
                    </div>
                    <span className="text-xs font-bold text-slate-400 mt-1">
                      {testState === "RECOVERY"
                        ? "Prepare at Start Line"
                        : shuttlePhase === "OUT"
                        ? "Turn line beep"
                        : "Finish shuttle beep"}
                    </span>
                  </div>

                  {/* Current Speed */}
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 text-center flex flex-col justify-center">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      RUNNING SPEED
                    </span>
                    <div className="text-4xl sm:text-6xl font-black text-white font-['Plus_Jakarta_Sans'] tracking-tight mt-1">
                      {currentShuttle.speedKmH.toFixed(1)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 mt-1 uppercase">
                      km/h
                    </span>
                  </div>
                </div>

                {/* Secondary Metrics Bar: Total Distance, Duration, Completed Shuttles */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                      TOTAL DISTANCE
                    </span>
                    <p className="text-base sm:text-xl font-black text-white mt-0.5">
                      {metersStr}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">{kmStr}</span>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                      ELAPSED TIME
                    </span>
                    <p className="text-base sm:text-xl font-black text-white mt-0.5 font-mono">
                      {formatDuration(elapsedSeconds)}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">MM:SS</span>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                      SHUTTLES
                    </span>
                    <p className="text-base sm:text-xl font-black text-white mt-0.5">
                      {completedFullShuttles}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-medium">Completed</span>
                  </div>
                </div>

                {/* Athletic Touch Controls: Large Mobile-Optimized Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {testState === "PAUSED" ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleResumeTest}
                      className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm sm:text-base rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Play size={18} className="fill-current" />
                      <span>RESUME TEST</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePauseTest}
                      className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <Pause size={18} />
                      <span>PAUSE</span>
                    </motion.button>
                  )}

                  {/* Stop / Unable to continue */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinishTest}
                    className="w-full sm:w-auto px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                  >
                    <span>I'M DONE • COMPLETE TEST</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* 4. COMPLETED STATE BANNER */}
            {testState === "COMPLETED" && (
              <motion.div
                key="completed-screen"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4 max-w-lg mx-auto"
              >
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white">TEST COMPLETE</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Great effort! Your endurance and recovery metrics have been recorded.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowResultModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-blue-600/20"
                  >
                    <Trophy size={16} />
                    <span>View Full Result</span>
                  </button>
                  <button
                    onClick={handleResetToReady}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-2 border border-slate-700"
                  >
                    <RotateCcw size={16} />
                    <span>Start New Test</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        title="🏆 Yo-Yo Test Result"
      >
        {completedSummary && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Official Yo-Yo IR1 Score
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                Level {completedSummary.finalLevel}.{completedSummary.finalShuttle}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                Completed on {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>

            {/* Scorecard Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Distance</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {completedSummary.distanceMeters} m
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {(completedSummary.distanceMeters / 1000).toFixed(2)} km
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Final Speed</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {completedSummary.finalSpeed.toFixed(1)} km/h
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">At failure point</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Test Duration</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
                  {formatDuration(completedSummary.durationSeconds)}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Active shuttle test</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Calories</span>
                <p className="text-xl font-extrabold text-amber-500 mt-0.5 flex items-center gap-1">
                  <Flame size={18} /> {completedSummary.estimatedCalories} kcal
                </p>
                <span className="text-[10px] text-slate-400">Approximation (MET 11.5)</span>
              </div>
            </div>

            {/* Save to Database action button */}
            <div className="pt-2 flex flex-col gap-2">
              {justSavedId ? (
                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 size={16} /> Saved to your FitTrack database!
                </div>
              ) : (
                <button
                  onClick={handleSaveResult}
                  disabled={savingTest}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trophy size={16} />
                  <span>{savingTest ? "Saving Result..." : "Save Result to FitTrack Profile"}</span>
                </button>
              )}

              <button
                onClick={() => setShowResultModal(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Previous Tests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-['Plus_Jakarta_Sans']">
              Previous Yo-Yo Tests
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {savedTests.length} {savedTests.length === 1 ? "record" : "records"}
          </span>
        </div>

        {savedTests.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
            <Trophy size={32} className="mx-auto text-slate-400/60" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No Yo-Yo tests logged yet.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Complete your first 20m shuttle test to establish your baseline endurance and recovery score!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedTests.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedTestDetail(t)}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 transition-all shadow-sm cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {t.testType}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(t.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      Level {t.finalLevel}.{t.finalShuttle}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t.distance} m ({(t.distance / 1000).toFixed(2)} km)
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {t.finalSpeed.toFixed(1)} km/h
                    </span>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatDuration(t.duration)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Flame size={13} /> {t.calories} kcal
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    Details <ArrowRight size={13} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal for Selected Past Test */}
      <Modal
        isOpen={Boolean(selectedTestDetail)}
        onClose={() => setSelectedTestDetail(null)}
        title="📋 Yo-Yo Test Details"
      >
        {selectedTestDetail && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {selectedTestDetail.testType}
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                Level {selectedTestDetail.finalLevel}.{selectedTestDetail.finalShuttle}
              </h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Completed on {new Date(selectedTestDetail.completedAt).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Distance</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedTestDetail.distance} m
                </p>
                <span className="text-[11px] text-slate-400">
                  {(selectedTestDetail.distance / 1000).toFixed(2)} km
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Final Speed</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedTestDetail.finalSpeed.toFixed(1)} km/h
                </p>
                <span className="text-[11px] text-slate-400">Speed stage reached</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Duration</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
                  {formatDuration(selectedTestDetail.duration)}
                </p>
                <span className="text-[11px] text-slate-400">Total test duration</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Estimated Calories</span>
                <p className="text-xl font-extrabold text-amber-500 mt-0.5 flex items-center gap-1">
                  <Flame size={18} /> {selectedTestDetail.calories} kcal
                </p>
                <span className="text-[10px] text-slate-400">Estimated Burn</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTestDetail(null)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-sm rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
