export type Exercise = {
  id: string;
  name: string;
  category: string;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sets: number;
  reps: string;
  rest: string;
  animation: string;
  muscles: string[];
  instructions: string[];
  tips: string[];
  mistakes: string[];
};

export const exercises: Exercise[] = [

  // =========================
  // CHEST
  // =========================

  {
    id: "bench-press",
    name: "Barbell Bench Press",
    category: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    rest: "90 sec",
    animation: "/exercises/chest/bench-press.mp4",
    muscles: ["Chest", "Triceps", "Front Shoulders"],
    instructions: [
      "Lie flat on the bench with your feet firmly planted.",
      "Grip the bar slightly wider than shoulder width.",
      "Unrack the bar and position it above your chest.",
      "Lower the bar slowly toward the middle of your chest.",
      "Press the bar upward while keeping control."
    ],
    tips: [
      "Keep your shoulder blades pulled back.",
      "Keep your feet planted throughout the set.",
      "Control the bar during the entire movement."
    ],
    mistakes: [
      "Bouncing the bar off the chest.",
      "Using excessive weight.",
      "Flaring the elbows too much."
    ]
  },

  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    rest: "75 sec",
    animation: "/exercises/chest/incline-dumbbell-press.mp4",
    muscles: ["Upper Chest", "Triceps", "Shoulders"],
    instructions: [
      "Set the bench to a comfortable incline.",
      "Hold a dumbbell in each hand at chest level.",
      "Press both dumbbells upward.",
      "Pause briefly at the top.",
      "Lower the dumbbells slowly."
    ],
    tips: [
      "Keep your back against the bench.",
      "Move both dumbbells together.",
      "Use controlled repetitions."
    ],
    mistakes: [
      "Dropping the weights too quickly.",
      "Using excessive weight.",
      "Lifting the hips from the bench."
    ]
  },

  {
    id: "cable-fly",
    name: "Cable Chest Fly",
    category: "Chest",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    rest: "60 sec",
    animation: "/exercises/chest/cable-fly.mp4",
    muscles: ["Chest", "Front Shoulders"],
    instructions: [
      "Stand between the cable handles.",
      "Take a small step forward.",
      "Keep a slight bend in your elbows.",
      "Bring your hands together in front of your chest.",
      "Slowly return to the starting position."
    ],
    tips: [
      "Keep your chest lifted.",
      "Focus on squeezing the chest.",
      "Avoid locking your elbows."
    ],
    mistakes: [
      "Using momentum.",
      "Bending the elbows excessively.",
      "Using too much weight."
    ]
  },

  {
    id: "push-ups",
    name: "Push-Ups",
    category: "Chest",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-15",
    rest: "60 sec",
    animation: "/exercises/chest/push-ups.mp4",
    muscles: ["Chest", "Triceps", "Core"],
    instructions: [
      "Place your hands slightly wider than your shoulders.",
      "Keep your body straight from head to heels.",
      "Lower your chest toward the floor.",
      "Push through your palms.",
      "Return to the starting position."
    ],
    tips: [
      "Keep your core tight.",
      "Keep your hips aligned.",
      "Move under control."
    ],
    mistakes: [
      "Dropping the hips.",
      "Flaring the elbows.",
      "Performing very short repetitions."
    ]
  },


  // =========================
  // BACK
  // =========================

  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: "Back",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 4,
    reps: "10-12",
    rest: "75 sec",
    animation: "/exercises/back/lat-pulldown.mp4",
    muscles: ["Lats", "Biceps", "Upper Back"],
    instructions: [
      "Sit comfortably at the pulldown machine.",
      "Grip the bar slightly wider than shoulder width.",
      "Pull the bar toward your upper chest.",
      "Squeeze your back muscles.",
      "Slowly return the bar upward."
    ],
    tips: [
      "Keep your chest lifted.",
      "Pull with your elbows.",
      "Avoid swinging your body."
    ],
    mistakes: [
      "Pulling the bar behind the neck.",
      "Using momentum.",
      "Letting the weight drop quickly."
    ]
  },

  {
    id: "seated-row",
    name: "Seated Cable Row",
    category: "Back",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    rest: "75 sec",
    animation: "/exercises/back/seated-row.mp4",
    muscles: ["Middle Back", "Lats", "Biceps"],
    instructions: [
      "Sit with your feet firmly on the platform.",
      "Hold the cable handle with both hands.",
      "Keep your back straight.",
      "Pull the handle toward your torso.",
      "Slowly extend your arms again."
    ],
    tips: [
      "Keep your chest open.",
      "Squeeze your shoulder blades.",
      "Control the return."
    ],
    mistakes: [
      "Rounding your back.",
      "Using body momentum.",
      "Shrugging the shoulders."
    ]
  },

  {
    id: "dumbbell-row",
    name: "One-Arm Dumbbell Row",
    category: "Back",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 each side",
    rest: "60 sec",
    animation: "/exercises/back/dumbbell-row.mp4",
    muscles: ["Lats", "Upper Back", "Biceps"],
    instructions: [
      "Place one hand and knee on a bench.",
      "Hold the dumbbell with the opposite hand.",
      "Pull the dumbbell toward your hip.",
      "Squeeze your back.",
      "Lower the dumbbell slowly."
    ],
    tips: [
      "Keep your spine neutral.",
      "Pull toward your hip.",
      "Avoid twisting your torso."
    ],
    mistakes: [
      "Rotating the body.",
      "Shrugging the shoulder.",
      "Using momentum."
    ]
  },

  {
    id: "face-pull",
    name: "Face Pull",
    category: "Back",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    rest: "60 sec",
    animation: "/exercises/back/face-pull.mp4",
    muscles: ["Rear Shoulders", "Upper Back"],
    instructions: [
      "Attach a rope to a high cable.",
      "Grip the rope with both hands.",
      "Pull the rope toward your face.",
      "Rotate your hands outward.",
      "Return slowly."
    ],
    tips: [
      "Keep your elbows high.",
      "Focus on your rear shoulders.",
      "Use a moderate weight."
    ],
    mistakes: [
      "Using excessive weight.",
      "Pulling toward the chest.",
      "Using momentum."
    ]
  },


  // =========================
  // SHOULDERS
  // =========================

  {
    id: "shoulder-press",
    name: "Dumbbell Shoulder Press",
    category: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-12",
    rest: "75 sec",
    animation: "/exercises/shoulders/shoulder-press.mp4",
    muscles: ["Shoulders", "Triceps"],
    instructions: [
      "Sit upright with a dumbbell in each hand.",
      "Start with the dumbbells beside your shoulders.",
      "Press both dumbbells overhead.",
      "Pause briefly.",
      "Lower them under control."
    ],
    tips: [
      "Keep your core tight.",
      "Do not overarch your back.",
      "Move smoothly."
    ],
    mistakes: [
      "Using excessive weight.",
      "Locking the elbows aggressively.",
      "Arching the lower back."
    ]
  },

  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    rest: "60 sec",
    animation: "/exercises/shoulders/lateral-raise.mp4",
    muscles: ["Side Shoulders"],
    instructions: [
      "Stand with dumbbells beside your body.",
      "Keep a slight bend in your elbows.",
      "Raise your arms outward.",
      "Lift until approximately shoulder height.",
      "Lower slowly."
    ],
    tips: [
      "Use light weights.",
      "Lead with your elbows.",
      "Avoid swinging."
    ],
    mistakes: [
      "Using momentum.",
      "Shrugging your shoulders.",
      "Lifting excessively high."
    ]
  },

  {
    id: "front-raise",
    name: "Dumbbell Front Raise",
    category: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    rest: "60 sec",
    animation: "/exercises/shoulders/front-raise.mp4",
    muscles: ["Front Shoulders"],
    instructions: [
      "Stand tall with dumbbells in front of your thighs.",
      "Raise one or both arms forward.",
      "Stop around shoulder height.",
      "Lower the weights slowly."
    ],
    tips: [
      "Keep your torso stable.",
      "Use controlled movement."
    ],
    mistakes: [
      "Swinging the weights.",
      "Using excessive weight."
    ]
  },


  // =========================
  // ARMS
  // =========================

  {
    id: "bicep-curl",
    name: "Dumbbell Bicep Curl",
    category: "Arms",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    animation: "/exercises/arms/bicep-curl.mp4",
    muscles: ["Biceps"],
    instructions: [
      "Stand with your arms beside your body.",
      "Keep your elbows close to your torso.",
      "Curl the dumbbells upward.",
      "Squeeze your biceps at the top.",
      "Lower the dumbbells slowly."
    ],
    tips: [
      "Keep your elbows stationary.",
      "Avoid swinging.",
      "Use a full range of motion."
    ],
    mistakes: [
      "Swinging the body.",
      "Moving the elbows forward.",
      "Using excessive weight."
    ]
  },

  {
    id: "hammer-curl",
    name: "Hammer Curl",
    category: "Arms",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    animation: "/exercises/arms/hammer-curl.mp4",
    muscles: ["Biceps", "Forearms"],
    instructions: [
      "Hold dumbbells with your palms facing inward.",
      "Keep your elbows close to your body.",
      "Curl the dumbbells upward.",
      "Pause briefly.",
      "Lower under control."
    ],
    tips: [
      "Keep your wrists neutral.",
      "Avoid swinging."
    ],
    mistakes: [
      "Rotating the wrists.",
      "Using momentum."
    ]
  },

  {
    id: "tricep-pushdown",
    name: "Cable Tricep Pushdown",
    category: "Arms",
    equipment: "Cable Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-15",
    rest: "60 sec",
    animation: "/exercises/arms/tricep-pushdown.mp4",
    muscles: ["Triceps"],
    instructions: [
      "Stand facing the cable machine.",
      "Grip the bar or rope.",
      "Keep your elbows close to your sides.",
      "Push the handle downward.",
      "Slowly return to the starting position."
    ],
    tips: [
      "Keep your elbows stationary.",
      "Squeeze the triceps at the bottom.",
      "Control the return."
    ],
    mistakes: [
      "Moving the elbows.",
      "Leaning excessively.",
      "Using momentum."
    ]
  },

  {
    id: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    category: "Arms",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    animation: "/exercises/arms/overhead-tricep-extension.mp4",
    muscles: ["Triceps"],
    instructions: [
      "Hold one dumbbell with both hands.",
      "Raise it above your head.",
      "Bend your elbows and lower the weight behind your head.",
      "Extend your arms upward.",
      "Repeat under control."
    ],
    tips: [
      "Keep your elbows pointing forward.",
      "Keep your core tight."
    ],
    mistakes: [
      "Flaring the elbows.",
      "Using excessive weight."
    ]
  },


  // =========================
  // LEGS
  // =========================

  {
    id: "squat",
    name: "Barbell Squat",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    rest: "90 sec",
    animation: "/exercises/legs/squat.mp4",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    instructions: [
      "Place the bar securely across your upper back.",
      "Stand with your feet around shoulder width.",
      "Brace your core.",
      "Lower your hips while bending your knees.",
      "Drive through your feet to stand."
    ],
    tips: [
      "Keep your chest controlled.",
      "Keep your knees tracking over your toes.",
      "Maintain a neutral spine."
    ],
    mistakes: [
      "Rounding the lower back.",
      "Knees collapsing inward.",
      "Using excessive weight."
    ]
  },

  {
    id: "leg-press",
    name: "Leg Press",
    category: "Legs",
    equipment: "Machine",
    difficulty: "Beginner",
    sets: 4,
    reps: "10-12",
    rest: "90 sec",
    animation: "/exercises/legs/leg-press.mp4",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    instructions: [
      "Sit securely in the leg press machine.",
      "Place your feet on the platform.",
      "Release the safety handles.",
      "Lower the platform under control.",
      "Push through your feet to extend your legs."
    ],
    tips: [
      "Keep your back against the pad.",
      "Do not lock your knees aggressively."
    ],
    mistakes: [
      "Allowing the hips to lift.",
      "Locking the knees.",
      "Using excessive weight."
    ]
  },

  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-12",
    rest: "90 sec",
    animation: "/exercises/legs/romanian-deadlift.mp4",
    muscles: ["Hamstrings", "Glutes", "Lower Back"],
    instructions: [
      "Stand holding the bar close to your thighs.",
      "Keep your knees slightly bent.",
      "Push your hips backward.",
      "Lower the bar along your legs.",
      "Drive your hips forward to stand."
    ],
    tips: [
      "Keep the bar close to your body.",
      "Maintain a neutral spine.",
      "Focus on the hamstring stretch."
    ],
    mistakes: [
      "Rounding the back.",
      "Bending the knees too much.",
      "Moving the bar away from the legs."
    ]
  },

  {
    id: "lunges",
    name: "Walking Lunges",
    category: "Legs",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    sets: 3,
    reps: "10 each leg",
    rest: "75 sec",
    animation: "/exercises/legs/lunges.mp4",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    instructions: [
      "Stand tall with dumbbells at your sides.",
      "Step forward with one leg.",
      "Lower your hips toward the floor.",
      "Push through the front foot.",
      "Step forward with the opposite leg."
    ],
    tips: [
      "Keep your torso upright.",
      "Take controlled steps.",
      "Keep your front knee stable."
    ],
    mistakes: [
      "Taking unstable steps.",
      "Letting the knee collapse inward.",
      "Rushing the movement."
    ]
  },

  {
    id: "leg-extension",
    name: "Leg Extension",
    category: "Legs",
    equipment: "Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    rest: "60 sec",
    animation: "/exercises/legs/leg-extension.mp4",
    muscles: ["Quadriceps"],
    instructions: [
      "Sit securely on the machine.",
      "Place your ankles behind the pads.",
      "Extend your legs upward.",
      "Squeeze your quadriceps.",
      "Lower the weight slowly."
    ],
    tips: [
      "Use controlled movement.",
      "Avoid excessive weight."
    ],
    mistakes: [
      "Kicking the weight upward.",
      "Using momentum."
    ]
  },

  {
    id: "calf-raise",
    name: "Standing Calf Raise",
    category: "Legs",
    equipment: "Machine",
    difficulty: "Beginner",
    sets: 3,
    reps: "15-20",
    rest: "45 sec",
    animation: "/exercises/legs/calf-raise.mp4",
    muscles: ["Calves"],
    instructions: [
      "Stand with your feet comfortably positioned.",
      "Lower your heels slightly.",
      "Push through the balls of your feet.",
      "Raise your heels as high as possible.",
      "Lower slowly."
    ],
    tips: [
      "Use a full range of motion.",
      "Pause at the top."
    ],
    mistakes: [
      "Bouncing through repetitions.",
      "Using very short movements."
    ]
  },


  // =========================
  // CORE
  // =========================

  {
    id: "plank",
    name: "Plank",
    category: "Core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    sets: 3,
    reps: "30-60 sec",
    rest: "45 sec",
    animation: "/exercises/core/plank.mp4",
    muscles: ["Core", "Shoulders"],
    instructions: [
      "Place your forearms on the floor.",
      "Extend your legs behind you.",
      "Keep your body in a straight line.",
      "Brace your abdominal muscles.",
      "Hold the position while breathing normally."
    ],
    tips: [
      "Keep your hips level.",
      "Keep your core tight.",
      "Do not hold your breath."
    ],
    mistakes: [
      "Dropping the hips.",
      "Raising the hips too high.",
      "Holding your breath."
    ]
  },

  {
    id: "cable-crunch",
    name: "Cable Crunch",
    category: "Core",
    equipment: "Cable Machine",
    difficulty: "Intermediate",
    sets: 3,
    reps: "12-15",
    rest: "60 sec",
    animation: "/exercises/core/cable-crunch.mp4",
    muscles: ["Abs"],
    instructions: [
      "Kneel in front of the cable machine.",
      "Hold the rope near your head.",
      "Brace your core.",
      "Curl your torso downward.",
      "Slowly return to the starting position."
    ],
    tips: [
      "Focus on contracting your abs.",
      "Keep the movement controlled."
    ],
    mistakes: [
      "Pulling with the arms.",
      "Using momentum."
    ]
  },

  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    category: "Core",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    sets: 3,
    reps: "30 sec",
    rest: "45 sec",
    animation: "/exercises/core/mountain-climbers.mp4",
    muscles: ["Core", "Shoulders", "Legs"],
    instructions: [
      "Start in a high plank position.",
      "Bring one knee toward your chest.",
      "Return that leg.",
      "Bring the opposite knee forward.",
      "Continue alternating."
    ],
    tips: [
      "Keep your hips stable.",
      "Keep your core engaged.",
      "Maintain a steady rhythm."
    ],
    mistakes: [
      "Raising the hips too high.",
      "Moving without control."
    ]
  }
];