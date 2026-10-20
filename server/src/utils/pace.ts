/**
 * Formats running pace in mm:ss /km.
 * If distance is too small (< 0.05 km), returns '--:-- /km' to avoid absurd numbers.
 */
export function formatPace(durationSeconds: number, distanceKm: number): string {
  if (!distanceKm || distanceKm < 0.05 || !durationSeconds || durationSeconds <= 0) {
    return "--:-- /km";
  }

  const paceSecondsPerKm = durationSeconds / distanceKm;

  // If pace is slower than 30 min/km or faster than 2 min/km, guard against absurd spikes
  if (paceSecondsPerKm > 1800 || paceSecondsPerKm < 120) {
    return "--:-- /km";
  }

  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.floor(paceSecondsPerKm % 60);

  const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${paddedSeconds} /km`;
}

/**
 * Calculates estimated running calories based on distance, duration, and user weight.
 * Standard MET estimation: roughly 1 kcal per kg per km.
 */
export function calculateRunningCalories(
  distanceKm: number,
  durationSeconds: number,
  weightKg: number = 72
): number {
  if (distanceKm <= 0) return 0;
  // Standard exercise science formula: Cal ≈ distanceKm * weightKg * 1.036
  const calories = distanceKm * weightKg * 1.036;
  return Math.round(calories);
}

/**
 * Calculates estimated gym workout calories based on duration and sets completed.
 * Average resistance training burn is roughly 6 to 8 kcal/min for active lifting.
 */
export function calculateWorkoutCalories(
  durationSeconds: number,
  setsCompleted: number = 10,
  weightKg: number = 72
): number {
  if (durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  // Baseline ~ 5 kcal/min for weight training + volume factor
  const baseBurn = minutes * 5.5 * (weightKg / 70);
  const setBonus = setsCompleted * 3.5;
  return Math.round(baseBurn + setBonus);
}
