/**
 * Calculates consecutive active days from recorded activity dates.
 * Considers activity today or yesterday as maintaining the active streak.
 */
export function calculateActivityStreak(activityDates: (Date | string)[]): number {
  if (!activityDates || activityDates.length === 0) return 0;

  // Extract unique sorted date strings (YYYY-MM-DD)
  const uniqueDateStrings = Array.from(
    new Set(
      activityDates
        .filter(Boolean)
        .map((d) => {
          const date = new Date(d);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })
    )
  ).sort((a, b) => b.localeCompare(a)); // Descending order (newest first)

  if (uniqueDateStrings.length === 0) return 0;

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;

  const latestDateStr = uniqueDateStrings[0];

  // If latest activity is older than yesterday, the streak is broken
  if (latestDateStr !== todayStr && latestDateStr !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(latestDateStr);

  for (const dateStr of uniqueDateStrings) {
    const currentDate = new Date(dateStr);
    
    // Calculate difference in calendar days
    const diffTime = expectedDate.getTime() - currentDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 0) {
      streak += 1;
      // Decrement expected date by 1 day for next iteration
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap detected; streak terminates
      break;
    }
  }

  return streak;
}
