export function formatDuration(seconds: number, showHoursAlways = false): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  if (hrs > 0 || showHoursAlways) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function formatPace(durationSeconds: number, distanceKm: number): string {
  if (!distanceKm || distanceKm < 0.05 || !durationSeconds || durationSeconds <= 0) {
    return "--:-- /km";
  }

  const paceSec = durationSeconds / distanceKm;
  if (paceSec > 1800 || paceSec < 120) {
    return "--:-- /km";
  }

  const mins = Math.floor(paceSec / 60);
  const secs = Math.floor(paceSec % 60);
  return `${mins}:${secs < 10 ? `0${secs}` : secs} /km`;
}

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return "";
  return name.trim().charAt(0).toUpperCase();
}

export function formatDistance(km: number, units: "metric" | "imperial" = "metric"): string {
  if (units === "imperial") {
    const miles = km * 0.621371;
    return `${miles.toFixed(2)} mi`;
  }
  return `${km.toFixed(2)} km`;
}

export function formatWeight(kg: number, units: "metric" | "imperial" = "metric"): string {
  if (units === "imperial") {
    const lbs = Math.round(kg * 2.20462);
    return `${lbs} lbs`;
  }
  return `${kg} kg`;
}
