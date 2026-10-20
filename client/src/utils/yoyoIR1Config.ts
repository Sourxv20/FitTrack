/**
 * Official Yo-Yo Intermittent Recovery Test Level 1 (Yo-Yo IR1) Configuration
 * Protocol created by Jens Bangsbo.
 * 
 * Course: 20-meter shuttles (40m per full shuttle bout = 2x20m out and back).
 * Active recovery: 10 seconds active walk/jog around a cone 5m behind start line.
 * Speed levels start at Level 5 (10.0 km/h) and progress through Level 23 (19.0 km/h).
 */

export interface YoYoLevelConfig {
  level: number;
  speedKmH: number;
  shuttlesInLevel: number;
  shuttleRunSeconds: number; // 144 / speed
  turnSeconds: number;       // 72 / speed
  recoverySeconds: number;   // 10.0s
}

export interface YoYoShuttleItem {
  globalIndex: number;
  level: number;
  shuttleNumberInLevel: number;
  speedKmH: number;
  runDurationSec: number;
  turnDurationSec: number;
  recoveryDurationSec: number;
  accumulatedDistanceStart: number;
  accumulatedDistanceEnd: number;
}

export const YOYO_IR1_LEVELS: YoYoLevelConfig[] = [
  { level: 5,  speedKmH: 10.0, shuttlesInLevel: 1, shuttleRunSeconds: 14.40, turnSeconds: 7.20, recoverySeconds: 10.0 },
  { level: 9,  speedKmH: 12.0, shuttlesInLevel: 1, shuttleRunSeconds: 12.00, turnSeconds: 6.00, recoverySeconds: 10.0 },
  { level: 11, speedKmH: 13.0, shuttlesInLevel: 2, shuttleRunSeconds: 11.08, turnSeconds: 5.54, recoverySeconds: 10.0 },
  { level: 12, speedKmH: 13.5, shuttlesInLevel: 3, shuttleRunSeconds: 10.67, turnSeconds: 5.33, recoverySeconds: 10.0 },
  { level: 13, speedKmH: 14.0, shuttlesInLevel: 4, shuttleRunSeconds: 10.29, turnSeconds: 5.14, recoverySeconds: 10.0 },
  { level: 14, speedKmH: 14.5, shuttlesInLevel: 8, shuttleRunSeconds: 9.93,  turnSeconds: 4.97, recoverySeconds: 10.0 },
  { level: 15, speedKmH: 15.0, shuttlesInLevel: 8, shuttleRunSeconds: 9.60,  turnSeconds: 4.80, recoverySeconds: 10.0 },
  { level: 16, speedKmH: 15.5, shuttlesInLevel: 8, shuttleRunSeconds: 9.29,  turnSeconds: 4.65, recoverySeconds: 10.0 },
  { level: 17, speedKmH: 16.0, shuttlesInLevel: 8, shuttleRunSeconds: 9.00,  turnSeconds: 4.50, recoverySeconds: 10.0 },
  { level: 18, speedKmH: 16.5, shuttlesInLevel: 8, shuttleRunSeconds: 8.73,  turnSeconds: 4.36, recoverySeconds: 10.0 },
  { level: 19, speedKmH: 17.0, shuttlesInLevel: 8, shuttleRunSeconds: 8.47,  turnSeconds: 4.24, recoverySeconds: 10.0 },
  { level: 20, speedKmH: 17.5, shuttlesInLevel: 8, shuttleRunSeconds: 8.23,  turnSeconds: 4.11, recoverySeconds: 10.0 },
  { level: 21, speedKmH: 18.0, shuttlesInLevel: 8, shuttleRunSeconds: 8.00,  turnSeconds: 4.00, recoverySeconds: 10.0 },
  { level: 22, speedKmH: 18.5, shuttlesInLevel: 8, shuttleRunSeconds: 7.78,  turnSeconds: 3.89, recoverySeconds: 10.0 },
  { level: 23, speedKmH: 19.0, shuttlesInLevel: 8, shuttleRunSeconds: 7.58,  turnSeconds: 3.79, recoverySeconds: 10.0 }
];

// Pre-computed ordered list of all shuttles for zero-overhead indexing during test execution
export const ALL_YOYO_SHUTTLES: YoYoShuttleItem[] = [];

let runningDist = 0;
let globalIdx = 0;

for (const lvl of YOYO_IR1_LEVELS) {
  for (let s = 1; s <= lvl.shuttlesInLevel; s++) {
    const startDist = runningDist;
    runningDist += 40;
    ALL_YOYO_SHUTTLES.push({
      globalIndex: globalIdx,
      level: lvl.level,
      shuttleNumberInLevel: s,
      speedKmH: lvl.speedKmH,
      runDurationSec: lvl.shuttleRunSeconds,
      turnDurationSec: lvl.turnSeconds,
      recoveryDurationSec: lvl.recoverySeconds,
      accumulatedDistanceStart: startDist,
      accumulatedDistanceEnd: runningDist
    });
    globalIdx++;
  }
}

export const TOTAL_YOYO_SHUTTLES = ALL_YOYO_SHUTTLES.length; // 91 shuttles = 3640m
export const MAX_YOYO_DISTANCE = 3640;

/**
 * Calculate distance in meters based on completed 20-meter shuttles / legs
 */
export function calculateYoYoDistance(fullShuttlesCompleted: number, reachedTurnLine: boolean): number {
  const baseMeters = fullShuttlesCompleted * 40;
  return reachedTurnLine ? baseMeters + 20 : baseMeters;
}

/**
 * Format meters and kilometers
 */
export function formatYoYoDistance(meters: number): { metersStr: string; kmStr: string } {
  return {
    metersStr: `${meters} m`,
    kmStr: `${(meters / 1000).toFixed(2)} km`
  };
}

/**
 * Estimate calories for high-intensity intermittent sprinting
 * Standard exercise science estimate using MET ~11.5 for shuttle runs
 */
export function estimateYoYoCalories(durationSeconds: number, weightKg: number = 72): number {
  if (durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  const met = 11.5;
  const calories = (met * 3.5 * weightKg) / 200 * minutes;
  return Math.max(1, Math.round(calories));
}
