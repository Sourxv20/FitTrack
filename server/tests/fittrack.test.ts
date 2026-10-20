import test from "node:test";
import assert from "node:assert/strict";
import { calculateHaversineDistance, calculateFilteredRouteDistance } from "../src/utils/haversine.js";
import { formatPace, calculateRunningCalories, calculateWorkoutCalories } from "../src/utils/pace.js";
import { calculateActivityStreak } from "../src/utils/streak.js";

test("Distance calculation - Haversine formula calculates accurate distance", () => {
  // New Delhi India Gate (28.6129, 77.2295) to Rashtrapati Bhavan (28.6143, 77.1995) ~ 2.93 km
  const dist = calculateHaversineDistance(28.6129, 77.2295, 28.6143, 77.1995);
  assert.ok(dist > 2.8 && dist < 3.1, `Expected ~2.93 km, got ${dist}`);
});

test("Distance calculation - Filters out inaccurate GPS points", () => {
  const points = [
    { latitude: 28.6129, longitude: 77.2295, accuracy: 8 },
    { latitude: 28.6500, longitude: 77.3000, accuracy: 90 }, // Terrible accuracy (>35m), should be skipped
    { latitude: 28.6135, longitude: 77.2280, accuracy: 6 }
  ];

  const dist = calculateFilteredRouteDistance(points);
  // Direct distance between pt0 and pt2 is ~0.16 km, while with outlier it would have been >10 km
  assert.ok(dist < 0.5, `Outlier point was not filtered, got ${dist} km`);
});

test("Pace calculation - Handles normal and short distance cases", () => {
  // 5 km in 25 min (1500 sec) -> 5:00 /km
  const normalPace = formatPace(1500, 5.0);
  assert.equal(normalPace, "5:00 /km");

  // 10 km in 53 min (3180 sec) -> 5:18 /km
  const tenKmPace = formatPace(3180, 10.0);
  assert.equal(tenKmPace, "5:18 /km");

  // Tiny distance (<0.05 km) should not show absurd values
  const tinyPace = formatPace(10, 0.01);
  assert.equal(tinyPace, "--:-- /km");

  // Zero distance
  const zeroPace = formatPace(60, 0);
  assert.equal(zeroPace, "--:-- /km");
});

test("Calorie calculations - Running and Workout burn estimations", () => {
  // Running 5 km in 30 mins for 75 kg runner
  const runCal = calculateRunningCalories(5.0, 1800, 75);
  assert.ok(runCal >= 350 && runCal <= 450, `Expected ~390 kcal, got ${runCal}`);

  // Workout 45 min with 15 sets for 75 kg lifter
  const liftCal = calculateWorkoutCalories(45 * 60, 15, 75);
  assert.ok(liftCal >= 250 && liftCal <= 400, `Expected ~315 kcal, got ${liftCal}`);
});

test("Streak calculation - Computes consecutive active calendar days", () => {
  const now = new Date();
  const d0 = new Date(now); // today
  const d1 = new Date(now); d1.setDate(d1.getDate() - 1); // yesterday
  const d2 = new Date(now); d2.setDate(d2.getDate() - 2); // 2 days ago
  const d3 = new Date(now); d3.setDate(d3.getDate() - 3); // 3 days ago

  // 4 continuous days
  const streak4 = calculateActivityStreak([d0, d1, d2, d3]);
  assert.equal(streak4, 4);

  // 3 continuous days with duplicate entries on same day
  const streakWithDuplicates = calculateActivityStreak([d0, d0, d1, d2]);
  assert.equal(streakWithDuplicates, 3);

  // Broken streak (gap yesterday)
  const dOld = new Date(now); dOld.setDate(dOld.getDate() - 4);
  const brokenStreak = calculateActivityStreak([dOld]);
  assert.equal(brokenStreak, 0);
});

test("Yo-Yo Test - Zod schema validates correct test payload", async () => {
  const { createYoYoTestSchema } = await import("../src/validators/yoyoValidators.js");

  const validPayload = {
    testType: "Yo-Yo IR1",
    finalLevel: 14,
    finalShuttle: 3,
    finalSpeed: 14.5,
    distance: 560,
    duration: 324,
    calories: 78
  };

  const parsed = createYoYoTestSchema.parse(validPayload);
  assert.equal(parsed.finalLevel, 14);
  assert.equal(parsed.finalShuttle, 3);
  assert.equal(parsed.distance, 560);

  // Invalid payload (negative distance)
  assert.throws(() => {
    createYoYoTestSchema.parse({
      ...validPayload,
      distance: -20
    });
  });
});

