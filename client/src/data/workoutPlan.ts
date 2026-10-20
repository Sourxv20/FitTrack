export type WorkoutDay = {
  id: string;
  day: string;
  shortDay: string;
  title: string;
  focus: string;
  description: string;
  duration: string;
  calories: number;
  exercises: string[];
  type: "Workout" | "Recovery" | "Rest";
};

export const workoutPlan: WorkoutDay[] = [
  {
    id: "monday",
    day: "Monday",
    shortDay: "MON",
    title: "Push Day",
    focus: "Chest • Shoulders • Triceps",
    description:
      "Build upper-body pushing strength with controlled movements.",
    duration: "45 min",
    calories: 320,
    type: "Workout",
    exercises: [
      "bench-press",
      "incline-dumbbell-press",
      "cable-fly",
      "shoulder-press",
      "lateral-raise",
      "tricep-pushdown",
    ],
  },

  {
    id: "tuesday",
    day: "Tuesday",
    shortDay: "TUE",
    title: "Pull Day",
    focus: "Back • Biceps",
    description:
      "Train your back and arms with controlled pulling movements.",
    duration: "45 min",
    calories: 300,
    type: "Workout",
    exercises: [
      "lat-pulldown",
      "seated-row",
      "dumbbell-row",
      "face-pull",
      "bicep-curl",
      "hammer-curl",
    ],
  },

  {
    id: "wednesday",
    day: "Wednesday",
    shortDay: "WED",
    title: "Leg Day",
    focus: "Quads • Hamstrings • Glutes",
    description:
      "Build lower-body strength and stability with compound movements.",
    duration: "50 min",
    calories: 400,
    type: "Workout",
    exercises: [
      "squat",
      "leg-press",
      "romanian-deadlift",
      "lunges",
      "leg-extension",
      "calf-raise",
    ],
  },

  {
    id: "thursday",
    day: "Thursday",
    shortDay: "THU",
    title: "Recovery Day",
    focus: "Mobility • Recovery",
    description:
      "Give your muscles time to recover while keeping your body moving.",
    duration: "20 min",
    calories: 100,
    type: "Recovery",
    exercises: [],
  },

  {
    id: "friday",
    day: "Friday",
    shortDay: "FRI",
    title: "Upper Body",
    focus: "Chest • Back • Shoulders • Arms",
    description:
      "A balanced upper-body session targeting all major muscle groups.",
    duration: "45 min",
    calories: 330,
    type: "Workout",
    exercises: [
      "bench-press",
      "lat-pulldown",
      "shoulder-press",
      "seated-row",
      "bicep-curl",
      "tricep-pushdown",
    ],
  },

  {
    id: "saturday",
    day: "Saturday",
    shortDay: "SAT",
    title: "Lower Body + Core",
    focus: "Legs • Glutes • Core",
    description:
      "Strengthen your lower body and finish with focused core training.",
    duration: "45 min",
    calories: 360,
    type: "Workout",
    exercises: [
      "squat",
      "romanian-deadlift",
      "leg-press",
      "lunges",
      "plank",
      "cable-crunch",
    ],
  },

  {
    id: "sunday",
    day: "Sunday",
    shortDay: "SUN",
    title: "Rest Day",
    focus: "Full Recovery",
    description:
      "Rest and recover so your body is ready for the next training week.",
    duration: "Rest",
    calories: 0,
    type: "Rest",
    exercises: [],
  },
];