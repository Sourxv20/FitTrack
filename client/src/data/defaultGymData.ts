import { Exercise, WorkoutPlan } from "../types";

export const defaultExercises: Exercise[] = [
  {
    "id": "leg-press",
    "name": "45-Degree Leg Press",
    "category": "Legs",
    "muscleGroup": "Quadriceps",
    "equipment": "Machine",
    "difficulty": "Beginner",
    "description": "Heavy quad and glute loading without spinal compressive fatigue.",
    "instructions": [
      "Sit in machine with back firmly against pad and feet hip-width on sled.",
      "Disengage safety levers and slowly lower sled until knees reach 90 degrees.",
      "Drive sled upward through entire foot without locking knees violently."
    ],
    "tips": [
      "Never lock out knees completely at top.",
      "Keep lower back flat against back pad; do not let butt lift."
    ],
    "mistakes": [
      "Letting pelvis tuck under and lower back round at bottom of stroke.",
      "Hyperextending knees at full extension."
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings"
    ],
    "sets": 4,
    "reps": "10-12",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/IZxyjW7MPJQ",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584466977772-e5992b8b311a?auto=format&fit=crop&w=400&q=80",
    "animationType": "leg-press",
    "createdAt": "2026-10-20T13:32:58.706Z"
  },
  {
    "id": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "category": "Core",
    "muscleGroup": "Anti-Extension Core",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "description": "Extreme anti-extension core stimulus that challenges anterior abdominal wall to maximum capacity.",
    "instructions": [
      "Kneel on mat with hands gripping the ab wheel handles directly under shoulders.",
      "Brace abs into slight posterior pelvic tilt.",
      "Roll wheel forward smoothly as far as you can without hyperextending lower back.",
      "Contract abdominals to pull wheel back under your chest."
    ],
    "tips": [
      "Never let your lower spine dip into a swayback curve.",
      "Squeeze glutes throughout the full roll."
    ],
    "mistakes": [
      "Rolling out too far and sagging lumbar spine.",
      "Pulling back with hips first instead of curling core."
    ],
    "muscles": [
      "Rectus Abdominis",
      "Lats",
      "Serratus Anterior",
      "Hip Flexors"
    ],
    "sets": 3,
    "reps": "8-12",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/rqiTPdK1cWg",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    "animationType": "ab-rollout",
    "createdAt": "2026-10-20T13:32:58.723Z"
  },
  {
    "id": "arnold-press",
    "name": "Arnold Dumbbell Press",
    "category": "Shoulders",
    "muscleGroup": "Complete Deltoids",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "description": "Rotational dumbbell press that activates anterior and lateral deltoid fibers through complete arc.",
    "instructions": [
      "Sit on bench with dumbbells held at chin level, palms facing your chest.",
      "As you press overhead, rotate your wrists so palms face forward at top.",
      "Reverse rotation on way down, returning to chin-level start position."
    ],
    "tips": [
      "Perform the rotation smoothly during the upward press motion.",
      "Control the descent completely."
    ],
    "mistakes": [
      "Rotating too early before pressing upward.",
      "Arching lower back off the backrest."
    ],
    "muscles": [
      "Anterior Deltoids",
      "Lateral Deltoids",
      "Triceps"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/3ml7BH7mNwQ",
    "thumbnailUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    "animationType": "arnold-press",
    "createdAt": "2026-10-20T13:32:58.702Z"
  },
  {
    "id": "barbell-squat",
    "name": "Barbell Back Squat",
    "category": "Legs",
    "muscleGroup": "Quadriceps & Glutes",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "description": "The fundamental compound lift for lower-body hypertrophy, explosive athletic power, and bone density.",
    "instructions": [
      "Position bar across upper trapezius muscle with shoulder-width grip.",
      "Step back with feet shoulder-width apart, toes angled slightly out.",
      "Hinge hips back and bend knees, tracking knees in line with toes.",
      "Descend until hip crease is below top of knees (parallel or below).",
      "Drive through mid-foot to stand back up powerfully."
    ],
    "tips": [
      "Keep chest tall and maintain rigid abdominal pressure.",
      "Push knees outward to prevent valgus collapse."
    ],
    "mistakes": [
      "Knees caving inward during ascent.",
      "Rising on toes and letting heels leave floor."
    ],
    "muscles": [
      "Quadriceps",
      "Gluteus Maximus",
      "Adductors",
      "Core"
    ],
    "sets": 4,
    "reps": "6-8",
    "restSeconds": 120,
    "videoUrl": "https://www.youtube.com/embed/bEv6CCg2BC8",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
    "animationType": "squat",
    "createdAt": "2026-10-20T13:32:58.704Z"
  },
  {
    "id": "bench-press",
    "name": "Barbell Bench Press",
    "category": "Chest",
    "muscleGroup": "Pectoralis Major",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "description": "The classic compound movement for upper-body pushing power, chest thickness, and shoulder stability.",
    "instructions": [
      "Lie flat on the bench with your feet planted firmly on the floor.",
      "Grip the bar slightly wider than shoulder-width with wrists straight.",
      "Unrack the bar and stabilize it directly over your upper chest.",
      "Lower the bar under control until it lightly touches your mid-chest.",
      "Drive your feet into the floor and press the barbell back up explosively."
    ],
    "tips": [
      "Retract and depress your scapulae before unracking.",
      "Keep a natural arch in your lower spine; do not let your hips lift.",
      "Flare elbows at a roughly 45-degree angle rather than a 90-degree flare."
    ],
    "mistakes": [
      "Bouncing the bar off the rib cage.",
      "Lifting hips off the bench during the push phase.",
      "Overflaring elbows, putting excessive strain on the anterior deltoids."
    ],
    "muscles": [
      "Chest",
      "Triceps",
      "Front Deltoids"
    ],
    "sets": 4,
    "reps": "8-10",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/rT7DgCr-3pg",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    "animationType": "bench-press",
    "createdAt": "2026-10-20T13:32:58.674Z"
  },
  {
    "id": "barbell-deadlift",
    "name": "Barbell Deadlift",
    "category": "Back",
    "muscleGroup": "Erector Spinae & Posterior Chain",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "description": "The king of total-body strength movements, developing massive posterior chain density and grip power.",
    "instructions": [
      "Stand with mid-foot directly under the barbell, feet hip-width apart.",
      "Hinge at the hips and grip the bar just outside your shins.",
      "Pull chest up, flatten your back, and pull the slack out of the barbell.",
      "Drive through the floor with your legs and lock out hips and knees simultaneously."
    ],
    "tips": [
      "Keep the barbell dragging against or right next to your shins.",
      "Take a deep diaphragmatic breath into your belt and brace hard before pulling."
    ],
    "mistakes": [
      "Rounding the lumbar spine under load.",
      "Hyperextending and leaning back excessively at the top lockout."
    ],
    "muscles": [
      "Lower Back",
      "Lats",
      "Glutes",
      "Hamstrings",
      "Traps"
    ],
    "sets": 4,
    "reps": "5-6",
    "restSeconds": 120,
    "videoUrl": "https://www.youtube.com/embed/op9kVnSso6Q",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    "animationType": "deadlift",
    "createdAt": "2026-10-20T13:32:58.686Z"
  },
  {
    "id": "overhead-press",
    "name": "Barbell Overhead Press",
    "category": "Shoulders",
    "muscleGroup": "Deltoids",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "description": "Strict vertical barbell press that builds wide cannonball shoulders and core rigidity.",
    "instructions": [
      "Rest the barbell across your clavicles with an overhand grip outside shoulders.",
      "Brace core, squeeze glutes, and tilt head slightly back to clear bar path.",
      "Press barbell straight overhead to full lockout.",
      "Bring head forward through the 'window' of your arms at lockout.",
      "Lower the bar under control back to your upper chest."
    ],
    "tips": [
      "Keep forearms vertical directly under the bar.",
      "Keep glutes squeezed tight to prevent lower back hyperextension."
    ],
    "mistakes": [
      "Leaning back excessively into an improvised incline press.",
      "Using knee dip to launch weight (that is a push press, not strict press)."
    ],
    "muscles": [
      "Anterior Deltoid",
      "Lateral Deltoid",
      "Triceps",
      "Upper Traps"
    ],
    "sets": 4,
    "reps": "6-8",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/2yjwXTZQDDI",
    "thumbnailUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    "animationType": "overhead-press",
    "createdAt": "2026-10-20T13:32:58.694Z"
  },
  {
    "id": "bulgarian-split-squat",
    "name": "Bulgarian Split Squat",
    "category": "Legs",
    "muscleGroup": "Quadriceps & Gluteus Medius",
    "equipment": "Dumbbell",
    "difficulty": "Advanced",
    "description": "Brutal unilateral leg builder that develops exceptional single-leg balance and glute-quad hypertrophy.",
    "instructions": [
      "Stand 2-3 feet in front of a flat bench. Place top of one foot flat on bench behind you.",
      "Hold dumbbells at sides with tall chest.",
      "Lower rear knee towards floor until front thigh is parallel to ground.",
      "Drive up through front heel to return to top position."
    ],
    "tips": [
      "Keep torso angled slightly forward to engage glutes.",
      "Most weight should remain over front foot, not rear foot."
    ],
    "mistakes": [
      "Placing front foot too close to bench, causing front heel to elevate.",
      "Allowing front knee to cave inward."
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "sets": 3,
    "reps": "10 per leg",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/2C-uNgKwPLE",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    "animationType": "bulgarian-split-squat",
    "createdAt": "2026-10-20T13:32:58.724Z"
  },
  {
    "id": "cable-fly",
    "name": "Cable Chest Fly",
    "category": "Chest",
    "muscleGroup": "Inner & Mid Chest",
    "equipment": "Cable",
    "difficulty": "Beginner",
    "description": "Maintains constant tension across the entire range of motion, providing unmatched chest pump and isolation.",
    "instructions": [
      "Set cable pulleys at chest height. Take a handle in each hand and step forward into a staggered stance.",
      "With a slight bend in your elbows, sweep your hands forward in an arc.",
      "Squeeze the chest muscles forcefully when hands meet in front of you.",
      "Control the handles as they spread back out until a comfortable stretch is reached."
    ],
    "tips": [
      "Imagine hugging a wide oak tree.",
      "Maintain a fixed elbow angle throughout the entire fly movement."
    ],
    "mistakes": [
      "Turning the fly into a pressing motion by bending and straightening elbows.",
      "Using momentum and rocking the torso back and forth."
    ],
    "muscles": [
      "Chest",
      "Anterior Deltoids",
      "Serratus Anterior"
    ],
    "sets": 3,
    "reps": "12-15",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/taI4XduLpBe",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    "animationType": "cable-fly",
    "createdAt": "2026-10-20T13:32:58.681Z"
  },
  {
    "id": "cable-woodchopper",
    "name": "Cable Woodchopper",
    "category": "Core",
    "muscleGroup": "Obliques & Rotational Core",
    "equipment": "Cable",
    "difficulty": "Intermediate",
    "description": "Rotational powerhouse exercise training athletic torso power and functional oblique stability.",
    "instructions": [
      "Set cable pulley at high position. Stand sideways to machine holding handle with both hands.",
      "Pull handle diagonally down across body toward opposite hip while rotating torso.",
      "Pivot back foot as you rotate down.",
      "Slowly control the handle back up along the diagonal path."
    ],
    "tips": [
      "Keep arms mostly straight; power originates from abdominal rotation.",
      "Brace core firmly through the full arc."
    ],
    "mistakes": [
      "Pulling strictly with arms without rotating torso.",
      "Losing control on the return eccentric phase."
    ],
    "muscles": [
      "External Obliques",
      "Internal Obliques",
      "Transverse Abdominis"
    ],
    "sets": 3,
    "reps": "12 per side",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/pAplQXk3dkU",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    "animationType": "woodchopper",
    "createdAt": "2026-10-20T13:32:58.722Z"
  },
  {
    "id": "dips-chest",
    "name": "Chest Dips",
    "category": "Chest",
    "muscleGroup": "Lower Chest",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "description": "High-intensity compound exercise targeting the lower pectoral fibers and triceps with bodyweight load.",
    "instructions": [
      "Grip parallel dip bars and hoist yourself up with locked elbows.",
      "Lean forward at roughly 30 degrees to emphasize pectoral loading.",
      "Lower yourself smoothly until elbows reach 90 degrees.",
      "Press back up firmly without swinging your legs."
    ],
    "tips": [
      "Crossing ankles and leaning the torso forward shifts load from triceps to chest.",
      "Descend with control to safeguard the anterior shoulder joint."
    ],
    "mistakes": [
      "Staying completely upright (which loads triceps rather than chest).",
      "Descending too deep past comfort and straining the rotator cuff."
    ],
    "muscles": [
      "Lower Chest",
      "Triceps",
      "Front Deltoids"
    ],
    "sets": 3,
    "reps": "8-12",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/2z8JmcrW-As",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "dips",
    "createdAt": "2026-10-20T13:32:58.683Z"
  },
  {
    "id": "close-grip-bench-press",
    "name": "Close-Grip Barbell Bench Press",
    "category": "Triceps",
    "muscleGroup": "Triceps Brachii",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "description": "Heavy compound triceps overload exercise that allows moving maximum poundage.",
    "instructions": [
      "Lie on bench and grip bar shoulder-width apart (wrists directly above shoulders).",
      "Unrack bar and tuck elbows close to ribs at 30 degrees.",
      "Lower bar to lower chest / upper abs.",
      "Press explosively back up, locking out with triceps."
    ],
    "tips": [
      "Grip should not be excessively narrow; shoulder-width is optimal to save wrists.",
      "Keep elbows tucked tightly to ribs."
    ],
    "mistakes": [
      "Placing hands 4 inches apart (wrecks wrists and limits strength).",
      "Flaring elbows outward."
    ],
    "muscles": [
      "Triceps",
      "Chest",
      "Front Deltoids"
    ],
    "sets": 3,
    "reps": "8-10",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/nEF0bv2FW94",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    "animationType": "close-grip-bench",
    "createdAt": "2026-10-20T13:32:58.727Z"
  },
  {
    "id": "hammer-curl",
    "name": "Dumbbell Hammer Curl",
    "category": "Biceps",
    "muscleGroup": "Brachialis & Brachioradialis",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "description": "Neutral-grip curl that adds thick arm width and forearm mass by heavily loading the brachialis.",
    "instructions": [
      "Stand tall holding dumbbells with palms facing each other (neutral grip).",
      "Curl weights upward while keeping palms facing inward throughout.",
      "Squeeze peak forearm and outer arm contraction.",
      "Lower smoothly to starting position."
    ],
    "tips": [
      "Can be performed alternating or both arms together.",
      "Maintain neutral wrist alignment without bending backwards."
    ],
    "mistakes": [
      "Swinging elbows backwards and forwards.",
      "Using momentum to swing weights up."
    ],
    "muscles": [
      "Brachialis",
      "Brachioradialis",
      "Biceps"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/zC3nLlEvin4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    "animationType": "hammer-curl",
    "createdAt": "2026-10-20T13:32:58.714Z"
  },
  {
    "id": "lateral-raise",
    "name": "Dumbbell Lateral Raise",
    "category": "Shoulders",
    "muscleGroup": "Lateral Deltoids",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "description": "The primary isolation exercise for creating boulder shoulders and upper body width.",
    "instructions": [
      "Stand holding dumbbells at your sides with palms facing inward.",
      "Maintain a soft bend in elbows and a very slight forward torso hinge.",
      "Raise arms out to sides in scapular plane until parallel to floor.",
      "Pause for half a second at peak, then lower smoothly."
    ],
    "tips": [
      "Lead with your elbows rather than wrists.",
      "Imagine pouring water out of pitchers at the top."
    ],
    "mistakes": [
      "Using swinging body English to heave heavy weights up.",
      "Raising arms way above shoulder height, pinching rotator cuff."
    ],
    "muscles": [
      "Lateral Deltoid",
      "Trapezius"
    ],
    "sets": 4,
    "reps": "12-15",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/3VcKaXpzqRo",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
    "animationType": "lateral-raise",
    "createdAt": "2026-10-20T13:32:58.696Z"
  },
  {
    "id": "walking-lunges",
    "name": "Dumbbell Walking Lunges",
    "category": "Legs",
    "muscleGroup": "Quads & Glutes",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "description": "Dynamic unilateral leg movement that torches quadriceps, glutes, and builds unilateral coordination.",
    "instructions": [
      "Hold a pair of dumbbells at sides with tall upright torso.",
      "Take an exaggerated step forward and sink down until back knee kisses floor.",
      "Drive through lead heel to rise and step smoothly into the next lunge."
    ],
    "tips": [
      "Keep torso upright and brace core.",
      "Front shin should remain nearly vertical at bottom of stride."
    ],
    "mistakes": [
      "Taking strides that are too short, causing front knee to shoot past toes excessively.",
      "Collapsing torso forward onto lead thigh."
    ],
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Calves",
      "Core"
    ],
    "sets": 3,
    "reps": "12 per leg",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/L8fvypPrzzs",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    "animationType": "lunge",
    "createdAt": "2026-10-20T13:32:58.708Z"
  },
  {
    "id": "plank",
    "name": "Forearm Plank",
    "category": "Core",
    "muscleGroup": "Transverse Abdominis & Deep Core",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "description": "Isometric core stability exercise that reinforces spinal rigidity and posture.",
    "instructions": [
      "Rest on forearms with elbows placed directly below shoulders.",
      "Extend legs behind with balls of feet on floor.",
      "Form a rigid straight line from heels to head.",
      "Actively pull elbows towards toes and squeeze glutes to maximize tension."
    ],
    "tips": [
      "Breathe steadily from diaphragm without holding breath.",
      "Do not let shoulder blades collapse inward; push floor away."
    ],
    "mistakes": [
      "Hips sagging down toward floor.",
      "Piking butt up into the air."
    ],
    "muscles": [
      "Transverse Abdominis",
      "Rectus Abdominis",
      "Glutes",
      "Shoulders"
    ],
    "sets": 3,
    "reps": "45-60 sec",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/ASdvN_XEl_c",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    "animationType": "plank",
    "createdAt": "2026-10-20T13:32:58.720Z"
  },
  {
    "id": "hanging-leg-raise",
    "name": "Hanging Leg Raise",
    "category": "Core",
    "muscleGroup": "Lower Rectus Abdominis",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "description": "Premier core movement that pulls pelvis up into posterior tilt to scorch lower abdominals.",
    "instructions": [
      "Hang from pull-up bar with overhand grip and dead hang shoulder engagement.",
      "Brace core and raise legs straight in front until parallel with floor or higher.",
      "Tilt pelvis up towards ribcage to ensure abdominal contraction, not just hip flexors.",
      "Lower legs slowly without swinging body."
    ],
    "tips": [
      "Think about rolling your pelvis up toward your chest.",
      "Bend knees if straight leg raise causes lower back strain or swinging."
    ],
    "mistakes": [
      "Swinging body wildly to kick legs up.",
      "Only moving at hips without curling pelvis upward."
    ],
    "muscles": [
      "Lower Abdominals",
      "Hip Flexors",
      "Obliques",
      "Grip"
    ],
    "sets": 3,
    "reps": "12-15",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/Pr1ieGZ5atk",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    "animationType": "hanging-leg-raise",
    "createdAt": "2026-10-20T13:32:58.718Z"
  },
  {
    "id": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "category": "Biceps",
    "muscleGroup": "Long Head of Biceps",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "description": "Maximizes long head stretch of the biceps by placing shoulders into passive hyperextension.",
    "instructions": [
      "Sit back on bench set at 45-60 degree incline.",
      "Let dumbbells hang straight down behind torso.",
      "Curl dumbbells upward while supinating wrists so palms face shoulders at top.",
      "Lower under control feeling extreme stretch in long head."
    ],
    "tips": [
      "Keep shoulders pinned to bench backrest.",
      "Do not let elbows migrate forward during curl."
    ],
    "mistakes": [
      "Using bench angle that is too steep or lifting head off pad.",
      "Curling with internally rotated shoulders."
    ],
    "muscles": [
      "Biceps Long Head",
      "Brachialis"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/soxrZlIl35U",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "incline-curl",
    "createdAt": "2026-10-20T13:32:58.712Z"
  },
  {
    "id": "incline-dumbbell-press",
    "name": "Incline Dumbbell Press",
    "category": "Chest",
    "muscleGroup": "Upper Chest",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "description": "Focuses on the clavicular head of the pectoralis major with greater freedom of wrist rotation.",
    "instructions": [
      "Set an adjustable bench to an incline angle between 30 and 45 degrees.",
      "Sit back with dumbbells resting on your knees, then kick them up to shoulder level.",
      "Press the dumbbells overhead until arms are extended, keeping wrists neutral.",
      "Slowly lower dumbbells until you feel a deep stretch in the upper pectorals."
    ],
    "tips": [
      "Keep chest puffed and shoulders pinned back into the bench padding.",
      "Do not bang the dumbbells together at the top of the movement."
    ],
    "mistakes": [
      "Setting the bench incline too steep (>45 deg) which turns it into a shoulder press.",
      "Dropping elbows too low and over-stretching the shoulder capsule."
    ],
    "muscles": [
      "Upper Chest",
      "Front Deltoids",
      "Triceps"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/8iPEnn-ltC8",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "incline-press",
    "createdAt": "2026-10-20T13:32:58.679Z"
  },
  {
    "id": "skull-crushers",
    "name": "Lying EZ-Bar Skull Crushers",
    "category": "Triceps",
    "muscleGroup": "Long Head of Triceps",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "description": "Isolates long head of triceps from deep stretch position behind the crown of the head.",
    "instructions": [
      "Lie on flat bench holding EZ-bar with narrow overhand grip.",
      "Angle arms back roughly 15 degrees from vertical towards your head.",
      "Bending only at elbows, lower bar down towards hairline or crown of head.",
      "Extend forearms back to start position while keeping upper arms fixed."
    ],
    "tips": [
      "Angling arms back keeps continuous tension on triceps at top.",
      "Use EZ bar to reduce wrist and elbow joint strain."
    ],
    "mistakes": [
      "Flaring elbows wide open.",
      "Moving upper arms during the movement."
    ],
    "muscles": [
      "Triceps Long Head",
      "Triceps Lateral Head"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/d_KZxkY_0cM",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "skull-crusher",
    "createdAt": "2026-10-20T13:32:58.716Z"
  },
  {
    "id": "pull-ups",
    "name": "Overhand Pull-Ups",
    "category": "Back",
    "muscleGroup": "Lats & Biceps",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "description": "The quintessential test of upper body relative strength and back vertical pulling power.",
    "instructions": [
      "Grip the pull-up bar with overhand grip slightly wider than shoulders.",
      "Hang at full arm extension with scapulae engaged.",
      "Pull yourself upward by driving elbows down until chin clears the bar.",
      "Lower under control back to a full dead hang."
    ],
    "tips": [
      "Engage your core to avoid swinging or kicking legs.",
      "Focus on chest to bar rather than merely reaching with your chin."
    ],
    "mistakes": [
      "Kipping or flailing legs for momentum.",
      "Cutting the range of motion short at top or bottom."
    ],
    "muscles": [
      "Lats",
      "Biceps",
      "Upper Back",
      "Grip"
    ],
    "sets": 3,
    "reps": "6-10",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/eGo4IYlbE5g",
    "thumbnailUrl": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&q=80",
    "animationType": "pull-up",
    "createdAt": "2026-10-20T13:32:58.693Z"
  },
  {
    "id": "overhead-dumbbell-extension",
    "name": "Overhead Dumbbell Tricep Extension",
    "category": "Triceps",
    "muscleGroup": "Triceps Long Head",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "description": "Places long head of triceps in fully stretched position overhead for maximum hypertrophy.",
    "instructions": [
      "Sit on short-backed bench holding one heavy dumbbell vertically overhead with both hands cup-gripped under top plate.",
      "Lower dumbbell smoothly behind your head until forearms hit biceps.",
      "Drive dumbbell straight back up overhead until arms extend completely."
    ],
    "tips": [
      "Keep elbows pointing forward as much as anatomy allows.",
      "Keep core braced and spine neutral."
    ],
    "mistakes": [
      "Allowing elbows to flare excessively wide.",
      "Arching lower back into hyperextension."
    ],
    "muscles": [
      "Triceps Long Head"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/Q0P_w6uG5jE",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "overhead-extension",
    "createdAt": "2026-10-20T13:32:58.717Z"
  },
  {
    "id": "reverse-cable-fly",
    "name": "Rear Delt Cable Fly",
    "category": "Shoulders",
    "muscleGroup": "Posterior Deltoids",
    "equipment": "Cable",
    "difficulty": "Intermediate",
    "description": "Cross-cable isolation for rear shoulder cap definition and scapular balance.",
    "instructions": [
      "Set dual cables at head height without attachments.",
      "Reach across to grip right cable with left hand and left cable with right hand.",
      "Pull arms back and outward in horizontal plane until hands are in line with shoulders.",
      "Squeeze rear deltoids forcefully, then control return."
    ],
    "tips": [
      "Keep elbows slightly bent and static.",
      "Do not shrug upper traps."
    ],
    "mistakes": [
      "Using excessive weight and bending elbows into a row.",
      "Swinging torso."
    ],
    "muscles": [
      "Rear Delts",
      "Infraspinatus",
      "Rhomboids"
    ],
    "sets": 3,
    "reps": "12-15",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/edwtSEmB3x4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    "animationType": "reverse-cable-fly",
    "createdAt": "2026-10-20T13:32:58.724Z"
  },
  {
    "id": "romanian-deadlift",
    "name": "Romanian Deadlift (RDL)",
    "category": "Legs",
    "muscleGroup": "Hamstrings & Glutes",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "description": "Pure hip-hinge exercise producing deep hamstring stretch and glute hypertrophy.",
    "instructions": [
      "Hold barbell at hips with overhand grip and soft bend in knees.",
      "Push hips backward as if touching a wall behind you.",
      "Lower bar down close along your shins until hamstrings feel fully stretched.",
      "Contract glutes and hamstrings to return to standing position."
    ],
    "tips": [
      "Keep barbell in contact with legs the entire time.",
      "Do not squat; the knees remain at the same slight bend throughout."
    ],
    "mistakes": [
      "Rounding lumbar spine when lowering bar.",
      "Bending knees excessively into a squat."
    ],
    "muscles": [
      "Hamstrings",
      "Gluteus Maximus",
      "Erector Spinae"
    ],
    "sets": 3,
    "reps": "8-10",
    "restSeconds": 90,
    "videoUrl": "https://www.youtube.com/embed/JCXUYuzwNrM",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=400&q=80",
    "animationType": "rdl",
    "createdAt": "2026-10-20T13:32:58.705Z"
  },
  {
    "id": "face-pull",
    "name": "Rope Cable Face Pull",
    "category": "Shoulders",
    "muscleGroup": "Rear Deltoids & Rotator Cuff",
    "equipment": "Cable",
    "difficulty": "Beginner",
    "description": "Essential postural and shoulder longevity exercise targeting the posterior deltoid and external rotators.",
    "instructions": [
      "Set cable pulley at upper-chest height with rope attachment.",
      "Grip rope ends with thumbs pointing back towards you.",
      "Step back and pull rope directly towards your eyes/forehead.",
      "Flare elbows out wide and externally rotate wrists at end of pull."
    ],
    "tips": [
      "Separate the rope handles widely as you pull.",
      "Focus on mind-muscle contraction rather than high weight."
    ],
    "mistakes": [
      "Pulling downwards to chest like a row.",
      "Jerking torso backwards."
    ],
    "muscles": [
      "Rear Delts",
      "Infraspinatus",
      "Teres Minor",
      "Rhomboids"
    ],
    "sets": 3,
    "reps": "15",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/rep-qVOkqgk",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    "animationType": "face-pull",
    "createdAt": "2026-10-20T13:32:58.700Z"
  },
  {
    "id": "tricep-pushdown",
    "name": "Rope Tricep Cable Pushdown",
    "category": "Triceps",
    "muscleGroup": "Lateral & Medial Head of Triceps",
    "equipment": "Cable",
    "difficulty": "Beginner",
    "description": "Constant cable tension targeting triceps with end-range abduction flare for lateral head peak.",
    "instructions": [
      "Attach rope to high pulley. Stand with slight forward torso lean.",
      "Lock elbows at sides of ribs with forearms parallel to ground.",
      "Push rope down forcefully until arms lock out completely.",
      "Spread rope ends apart at bottom for peak contraction.",
      "Return slowly to 90-degree elbow bend."
    ],
    "tips": [
      "Upper arms should remain glued in place throughout.",
      "Do not let shoulders roll forward as you push."
    ],
    "mistakes": [
      "Letting elbows flare forward and back, turning pushdown into a chest press.",
      "Not achieving complete elbow lockout at bottom."
    ],
    "muscles": [
      "Lateral Triceps",
      "Medial Triceps",
      "Long Head"
    ],
    "sets": 4,
    "reps": "12-15",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/2-LAMcpzODU",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    "animationType": "tricep-pushdown",
    "createdAt": "2026-10-20T13:32:58.715Z"
  },
  {
    "id": "seated-row",
    "name": "Seated Cable Row",
    "category": "Back",
    "muscleGroup": "Mid Back & Rhomboids",
    "equipment": "Cable",
    "difficulty": "Beginner",
    "description": "Develops mid-back thickness, posture, and scapular retraction using a close-grip V-handle.",
    "instructions": [
      "Sit with knees slightly bent and feet placed on the foot platforms.",
      "Reach forward to grab the V-handle, keeping spine upright and chest puffed.",
      "Pull handle towards your belly button while driving elbows back.",
      "Pinch shoulder blades together tightly for 1 second at full contraction.",
      "Return the weight smoothly under control."
    ],
    "tips": [
      "Keep torso stationary and do not rock back and forth.",
      "Keep shoulders depressed away from your ears."
    ],
    "mistakes": [
      "Using torso momentum to pull the weight.",
      "Rounding upper back during the eccentric phase."
    ],
    "muscles": [
      "Rhomboids",
      "Middle Trapezius",
      "Lats",
      "Biceps"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/GZbfZ033f74",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    "animationType": "seated-row",
    "createdAt": "2026-10-20T13:32:58.689Z"
  },
  {
    "id": "dumbbell-row",
    "name": "Single-Arm Dumbbell Row",
    "category": "Back",
    "muscleGroup": "Lats & Upper Back",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "description": "Unilateral pulling movement that fixes muscular imbalances and enhances full lat contraction.",
    "instructions": [
      "Place one knee and hand on a flat bench for support.",
      "Hold dumbbell in opposite hand, arm hanging straight down.",
      "Pull dumbbell up towards your hip crease, keeping elbow tucked.",
      "Lower dumbbell slowly to feel a deep stretch in the lat."
    ],
    "tips": [
      "Pull towards hip, not towards shoulder.",
      "Avoid twisting your torso open at the top."
    ],
    "mistakes": [
      "Rotating torso to yank the weight.",
      "Letting the shoulder drop completely out of socket."
    ],
    "muscles": [
      "Lats",
      "Rhomboids",
      "Biceps",
      "Core"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/pYcpY20QaE8",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "dumbbell-row",
    "createdAt": "2026-10-20T13:32:58.690Z"
  },
  {
    "id": "push-ups",
    "name": "Standard Push-Ups",
    "category": "Chest",
    "muscleGroup": "Chest & Core",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "description": "The gold standard bodyweight movement for upper body pressing endurance and core stability.",
    "instructions": [
      "Place hands on the floor slightly wider than shoulder-width.",
      "Form a rigid straight line from heels through hips to the crown of your head.",
      "Lower your chest until it hovers roughly one inch above the ground.",
      "Press through your palms to return to full arm extension."
    ],
    "tips": [
      "Brace glutes and abs tightly to avoid sagging hips.",
      "Keep neck neutral by looking at a spot on the floor 1 foot ahead."
    ],
    "mistakes": [
      "Hips sagging down or piking up in the air.",
      "Flaring elbows straight out sideways at 90 degrees."
    ],
    "muscles": [
      "Chest",
      "Triceps",
      "Core",
      "Shoulders"
    ],
    "sets": 3,
    "reps": "15-20",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/IODxDxX7oi4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    "animationType": "push-up",
    "createdAt": "2026-10-20T13:32:58.682Z"
  },
  {
    "id": "barbell-curl",
    "name": "Standing Barbell Bicep Curl",
    "category": "Biceps",
    "muscleGroup": "Biceps Brachii",
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "description": "The classic mass builder for biceps peak and arm thickness.",
    "instructions": [
      "Hold barbell with underhand shoulder-width grip, arms extended at thighs.",
      "Pin elbows against sides of ribcage.",
      "Curl bar upward in arc toward shoulders, squeezing biceps hard at peak.",
      "Lower bar slowly under complete resistance back to full stretch."
    ],
    "tips": [
      "Keep upper arms stationary; do not let elbows drift forward.",
      "Do not lean back or swing hips."
    ],
    "mistakes": [
      "Swinging lower back to heave the barbell up.",
      "Dropping weight quickly on eccentric phase."
    ],
    "muscles": [
      "Biceps Brachii",
      "Brachialis",
      "Forearms"
    ],
    "sets": 3,
    "reps": "10-12",
    "restSeconds": 60,
    "videoUrl": "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    "animationType": "bicep-curl",
    "createdAt": "2026-10-20T13:32:58.710Z"
  },
  {
    "id": "standing-calf-raise",
    "name": "Standing Calf Raise",
    "category": "Legs",
    "muscleGroup": "Gastrocnemius & Soleus",
    "equipment": "Machine",
    "difficulty": "Beginner",
    "description": "Targets calf muscle heads through full ankle plantar flexion and deep dorsiflexion stretch.",
    "instructions": [
      "Stand with balls of feet on platform and shoulder pads adjusted securely.",
      "Lower heels down as deep as possible to feel full calf stretch.",
      "Press through balls of big toes to rise to highest possible calf contraction.",
      "Hold peak contraction for 1 full second before descending."
    ],
    "tips": [
      "Do not bounce at the bottom.",
      "Pause at bottom stretch for 1 second to eliminate Achilles tendon reflex."
    ],
    "mistakes": [
      "Rapid bouncing without muscular control.",
      "Bending knees to assist the lift."
    ],
    "muscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "sets": 4,
    "reps": "15-20",
    "restSeconds": 45,
    "videoUrl": "https://www.youtube.com/embed/-M4-G8p8fmc",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
    "animationType": "calf-raise",
    "createdAt": "2026-10-20T13:32:58.709Z"
  },
  {
    "id": "lat-pulldown",
    "name": "Wide-Grip Lat Pulldown",
    "category": "Back",
    "muscleGroup": "Latissimus Dorsi",
    "equipment": "Cable",
    "difficulty": "Beginner",
    "description": "Builds back width and V-taper taper by isolating the latissimus dorsi under controlled resistance.",
    "instructions": [
      "Sit down and secure your thighs firmly under the roller pads.",
      "Grip the wide bar with an overhand grip slightly wider than shoulders.",
      "Lean torso back roughly 10 degrees and pull the bar down to touch upper chest.",
      "Drive elbows downwards and backwards into your back pockets.",
      "Slowly allow the bar to raise back up to full stretch overhead."
    ],
    "tips": [
      "Think of your hands as hooks; pull with your elbows.",
      "Feel the stretch at the top without allowing shoulders to shrug violently."
    ],
    "mistakes": [
      "Leaning back excessively and swinging torso to move the weight.",
      "Pulling the bar behind the neck, causing cervical stress."
    ],
    "muscles": [
      "Lats",
      "Biceps",
      "Rhomboids",
      "Rear Delts"
    ],
    "sets": 4,
    "reps": "10-12",
    "restSeconds": 75,
    "videoUrl": "https://www.youtube.com/embed/CAwf7n6Luuc",
    "thumbnailUrl": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
    "animationType": "lat-pulldown",
    "createdAt": "2026-10-20T13:32:58.688Z"
  }
];

export const defaultWorkoutPlans: WorkoutPlan[] = [
  {
    "id": "monday",
    "dayOfWeek": "Monday",
    "shortDay": "MON",
    "title": "Push Day",
    "focus": "Chest • Shoulders • Triceps",
    "description": "Build upper-body pushing strength and muscular density with compound pressing and isolation finishes.",
    "duration": "45 min",
    "targetCalories": 320,
    "type": "Workout",
    "createdAt": "2026-10-20T13:32:58.729Z",
    "exercises": [
      {
        "id": "1b77f50a-7b3e-42c2-8ed3-636641672ead",
        "workoutPlanId": "monday",
        "exerciseId": "bench-press",
        "orderIndex": 0,
        "targetSets": 4,
        "targetReps": "8-10",
        "restSeconds": 90,
        "exercise": {
          "id": "bench-press",
          "name": "Barbell Bench Press",
          "category": "Chest",
          "muscleGroup": "Pectoralis Major",
          "equipment": "Barbell",
          "difficulty": "Intermediate",
          "description": "The classic compound movement for upper-body pushing power, chest thickness, and shoulder stability.",
          "instructions": [
            "Lie flat on the bench with your feet planted firmly on the floor.",
            "Grip the bar slightly wider than shoulder-width with wrists straight.",
            "Unrack the bar and stabilize it directly over your upper chest.",
            "Lower the bar under control until it lightly touches your mid-chest.",
            "Drive your feet into the floor and press the barbell back up explosively."
          ],
          "tips": [
            "Retract and depress your scapulae before unracking.",
            "Keep a natural arch in your lower spine; do not let your hips lift.",
            "Flare elbows at a roughly 45-degree angle rather than a 90-degree flare."
          ],
          "mistakes": [
            "Bouncing the bar off the rib cage.",
            "Lifting hips off the bench during the push phase.",
            "Overflaring elbows, putting excessive strain on the anterior deltoids."
          ],
          "muscles": [
            "Chest",
            "Triceps",
            "Front Deltoids"
          ],
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/rT7DgCr-3pg",
          "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
          "animationType": "bench-press",
          "createdAt": "2026-10-20T13:32:58.674Z"
        }
      },
      {
        "id": "3b2bb69a-2b86-41d2-bca6-9860e087fae7",
        "workoutPlanId": "monday",
        "exerciseId": "incline-dumbbell-press",
        "orderIndex": 1,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "incline-dumbbell-press",
          "name": "Incline Dumbbell Press",
          "category": "Chest",
          "muscleGroup": "Upper Chest",
          "equipment": "Dumbbell",
          "difficulty": "Intermediate",
          "description": "Focuses on the clavicular head of the pectoralis major with greater freedom of wrist rotation.",
          "instructions": [
            "Set an adjustable bench to an incline angle between 30 and 45 degrees.",
            "Sit back with dumbbells resting on your knees, then kick them up to shoulder level.",
            "Press the dumbbells overhead until arms are extended, keeping wrists neutral.",
            "Slowly lower dumbbells until you feel a deep stretch in the upper pectorals."
          ],
          "tips": [
            "Keep chest puffed and shoulders pinned back into the bench padding.",
            "Do not bang the dumbbells together at the top of the movement."
          ],
          "mistakes": [
            "Setting the bench incline too steep (>45 deg) which turns it into a shoulder press.",
            "Dropping elbows too low and over-stretching the shoulder capsule."
          ],
          "muscles": [
            "Upper Chest",
            "Front Deltoids",
            "Triceps"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/8iPEnn-ltC8",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "incline-press",
          "createdAt": "2026-10-20T13:32:58.679Z"
        }
      },
      {
        "id": "f1fffdcb-aa94-4dfd-b0f4-27fc60f351b3",
        "workoutPlanId": "monday",
        "exerciseId": "cable-fly",
        "orderIndex": 2,
        "targetSets": 3,
        "targetReps": "12-15",
        "restSeconds": 60,
        "exercise": {
          "id": "cable-fly",
          "name": "Cable Chest Fly",
          "category": "Chest",
          "muscleGroup": "Inner & Mid Chest",
          "equipment": "Cable",
          "difficulty": "Beginner",
          "description": "Maintains constant tension across the entire range of motion, providing unmatched chest pump and isolation.",
          "instructions": [
            "Set cable pulleys at chest height. Take a handle in each hand and step forward into a staggered stance.",
            "With a slight bend in your elbows, sweep your hands forward in an arc.",
            "Squeeze the chest muscles forcefully when hands meet in front of you.",
            "Control the handles as they spread back out until a comfortable stretch is reached."
          ],
          "tips": [
            "Imagine hugging a wide oak tree.",
            "Maintain a fixed elbow angle throughout the entire fly movement."
          ],
          "mistakes": [
            "Turning the fly into a pressing motion by bending and straightening elbows.",
            "Using momentum and rocking the torso back and forth."
          ],
          "muscles": [
            "Chest",
            "Anterior Deltoids",
            "Serratus Anterior"
          ],
          "sets": 3,
          "reps": "12-15",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/taI4XduLpBe",
          "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
          "animationType": "cable-fly",
          "createdAt": "2026-10-20T13:32:58.681Z"
        }
      },
      {
        "id": "313a83e0-da8c-42b2-8e96-d366dbe8ff97",
        "workoutPlanId": "monday",
        "exerciseId": "overhead-press",
        "orderIndex": 3,
        "targetSets": 3,
        "targetReps": "8-10",
        "restSeconds": 90,
        "exercise": {
          "id": "overhead-press",
          "name": "Barbell Overhead Press",
          "category": "Shoulders",
          "muscleGroup": "Deltoids",
          "equipment": "Barbell",
          "difficulty": "Intermediate",
          "description": "Strict vertical barbell press that builds wide cannonball shoulders and core rigidity.",
          "instructions": [
            "Rest the barbell across your clavicles with an overhand grip outside shoulders.",
            "Brace core, squeeze glutes, and tilt head slightly back to clear bar path.",
            "Press barbell straight overhead to full lockout.",
            "Bring head forward through the 'window' of your arms at lockout.",
            "Lower the bar under control back to your upper chest."
          ],
          "tips": [
            "Keep forearms vertical directly under the bar.",
            "Keep glutes squeezed tight to prevent lower back hyperextension."
          ],
          "mistakes": [
            "Leaning back excessively into an improvised incline press.",
            "Using knee dip to launch weight (that is a push press, not strict press)."
          ],
          "muscles": [
            "Anterior Deltoid",
            "Lateral Deltoid",
            "Triceps",
            "Upper Traps"
          ],
          "sets": 4,
          "reps": "6-8",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/2yjwXTZQDDI",
          "thumbnailUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
          "animationType": "overhead-press",
          "createdAt": "2026-10-20T13:32:58.694Z"
        }
      },
      {
        "id": "1b815ffb-d22d-4d04-92fb-4171b48d6b3c",
        "workoutPlanId": "monday",
        "exerciseId": "lateral-raise",
        "orderIndex": 4,
        "targetSets": 4,
        "targetReps": "12-15",
        "restSeconds": 60,
        "exercise": {
          "id": "lateral-raise",
          "name": "Dumbbell Lateral Raise",
          "category": "Shoulders",
          "muscleGroup": "Lateral Deltoids",
          "equipment": "Dumbbell",
          "difficulty": "Beginner",
          "description": "The primary isolation exercise for creating boulder shoulders and upper body width.",
          "instructions": [
            "Stand holding dumbbells at your sides with palms facing inward.",
            "Maintain a soft bend in elbows and a very slight forward torso hinge.",
            "Raise arms out to sides in scapular plane until parallel to floor.",
            "Pause for half a second at peak, then lower smoothly."
          ],
          "tips": [
            "Lead with your elbows rather than wrists.",
            "Imagine pouring water out of pitchers at the top."
          ],
          "mistakes": [
            "Using swinging body English to heave heavy weights up.",
            "Raising arms way above shoulder height, pinching rotator cuff."
          ],
          "muscles": [
            "Lateral Deltoid",
            "Trapezius"
          ],
          "sets": 4,
          "reps": "12-15",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/3VcKaXpzqRo",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
          "animationType": "lateral-raise",
          "createdAt": "2026-10-20T13:32:58.696Z"
        }
      },
      {
        "id": "9c1dcc23-a183-4948-b92e-a05551d3fe55",
        "workoutPlanId": "monday",
        "exerciseId": "tricep-pushdown",
        "orderIndex": 5,
        "targetSets": 4,
        "targetReps": "12-15",
        "restSeconds": 60,
        "exercise": {
          "id": "tricep-pushdown",
          "name": "Rope Tricep Cable Pushdown",
          "category": "Triceps",
          "muscleGroup": "Lateral & Medial Head of Triceps",
          "equipment": "Cable",
          "difficulty": "Beginner",
          "description": "Constant cable tension targeting triceps with end-range abduction flare for lateral head peak.",
          "instructions": [
            "Attach rope to high pulley. Stand with slight forward torso lean.",
            "Lock elbows at sides of ribs with forearms parallel to ground.",
            "Push rope down forcefully until arms lock out completely.",
            "Spread rope ends apart at bottom for peak contraction.",
            "Return slowly to 90-degree elbow bend."
          ],
          "tips": [
            "Upper arms should remain glued in place throughout.",
            "Do not let shoulders roll forward as you push."
          ],
          "mistakes": [
            "Letting elbows flare forward and back, turning pushdown into a chest press.",
            "Not achieving complete elbow lockout at bottom."
          ],
          "muscles": [
            "Lateral Triceps",
            "Medial Triceps",
            "Long Head"
          ],
          "sets": 4,
          "reps": "12-15",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/2-LAMcpzODU",
          "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
          "animationType": "tricep-pushdown",
          "createdAt": "2026-10-20T13:32:58.715Z"
        }
      }
    ]
  },
  {
    "id": "tuesday",
    "dayOfWeek": "Tuesday",
    "shortDay": "TUE",
    "title": "Pull Day",
    "focus": "Back • Biceps • Rear Delts",
    "description": "Train back thickness, lat width, and arm peak with vertical and horizontal pulling movements.",
    "duration": "45 min",
    "targetCalories": 310,
    "type": "Workout",
    "createdAt": "2026-10-20T13:32:58.741Z",
    "exercises": [
      {
        "id": "efc57fbf-4ecb-48b0-8a8a-dc53f475d3da",
        "workoutPlanId": "tuesday",
        "exerciseId": "lat-pulldown",
        "orderIndex": 0,
        "targetSets": 4,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "lat-pulldown",
          "name": "Wide-Grip Lat Pulldown",
          "category": "Back",
          "muscleGroup": "Latissimus Dorsi",
          "equipment": "Cable",
          "difficulty": "Beginner",
          "description": "Builds back width and V-taper taper by isolating the latissimus dorsi under controlled resistance.",
          "instructions": [
            "Sit down and secure your thighs firmly under the roller pads.",
            "Grip the wide bar with an overhand grip slightly wider than shoulders.",
            "Lean torso back roughly 10 degrees and pull the bar down to touch upper chest.",
            "Drive elbows downwards and backwards into your back pockets.",
            "Slowly allow the bar to raise back up to full stretch overhead."
          ],
          "tips": [
            "Think of your hands as hooks; pull with your elbows.",
            "Feel the stretch at the top without allowing shoulders to shrug violently."
          ],
          "mistakes": [
            "Leaning back excessively and swinging torso to move the weight.",
            "Pulling the bar behind the neck, causing cervical stress."
          ],
          "muscles": [
            "Lats",
            "Biceps",
            "Rhomboids",
            "Rear Delts"
          ],
          "sets": 4,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/CAwf7n6Luuc",
          "thumbnailUrl": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
          "animationType": "lat-pulldown",
          "createdAt": "2026-10-20T13:32:58.688Z"
        }
      },
      {
        "id": "a9dacc3f-f348-47f9-bcc0-964ed5fd7e37",
        "workoutPlanId": "tuesday",
        "exerciseId": "seated-row",
        "orderIndex": 1,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "seated-row",
          "name": "Seated Cable Row",
          "category": "Back",
          "muscleGroup": "Mid Back & Rhomboids",
          "equipment": "Cable",
          "difficulty": "Beginner",
          "description": "Develops mid-back thickness, posture, and scapular retraction using a close-grip V-handle.",
          "instructions": [
            "Sit with knees slightly bent and feet placed on the foot platforms.",
            "Reach forward to grab the V-handle, keeping spine upright and chest puffed.",
            "Pull handle towards your belly button while driving elbows back.",
            "Pinch shoulder blades together tightly for 1 second at full contraction.",
            "Return the weight smoothly under control."
          ],
          "tips": [
            "Keep torso stationary and do not rock back and forth.",
            "Keep shoulders depressed away from your ears."
          ],
          "mistakes": [
            "Using torso momentum to pull the weight.",
            "Rounding upper back during the eccentric phase."
          ],
          "muscles": [
            "Rhomboids",
            "Middle Trapezius",
            "Lats",
            "Biceps"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/GZbfZ033f74",
          "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
          "animationType": "seated-row",
          "createdAt": "2026-10-20T13:32:58.689Z"
        }
      },
      {
        "id": "9f62d835-8ab9-4c35-9dd3-6e06af630112",
        "workoutPlanId": "tuesday",
        "exerciseId": "dumbbell-row",
        "orderIndex": 2,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "dumbbell-row",
          "name": "Single-Arm Dumbbell Row",
          "category": "Back",
          "muscleGroup": "Lats & Upper Back",
          "equipment": "Dumbbell",
          "difficulty": "Intermediate",
          "description": "Unilateral pulling movement that fixes muscular imbalances and enhances full lat contraction.",
          "instructions": [
            "Place one knee and hand on a flat bench for support.",
            "Hold dumbbell in opposite hand, arm hanging straight down.",
            "Pull dumbbell up towards your hip crease, keeping elbow tucked.",
            "Lower dumbbell slowly to feel a deep stretch in the lat."
          ],
          "tips": [
            "Pull towards hip, not towards shoulder.",
            "Avoid twisting your torso open at the top."
          ],
          "mistakes": [
            "Rotating torso to yank the weight.",
            "Letting the shoulder drop completely out of socket."
          ],
          "muscles": [
            "Lats",
            "Rhomboids",
            "Biceps",
            "Core"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/pYcpY20QaE8",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "dumbbell-row",
          "createdAt": "2026-10-20T13:32:58.690Z"
        }
      },
      {
        "id": "12bf23b9-1ecb-4e18-ae4d-d6dfa97e5d84",
        "workoutPlanId": "tuesday",
        "exerciseId": "face-pull",
        "orderIndex": 3,
        "targetSets": 3,
        "targetReps": "15",
        "restSeconds": 60,
        "exercise": {
          "id": "face-pull",
          "name": "Rope Cable Face Pull",
          "category": "Shoulders",
          "muscleGroup": "Rear Deltoids & Rotator Cuff",
          "equipment": "Cable",
          "difficulty": "Beginner",
          "description": "Essential postural and shoulder longevity exercise targeting the posterior deltoid and external rotators.",
          "instructions": [
            "Set cable pulley at upper-chest height with rope attachment.",
            "Grip rope ends with thumbs pointing back towards you.",
            "Step back and pull rope directly towards your eyes/forehead.",
            "Flare elbows out wide and externally rotate wrists at end of pull."
          ],
          "tips": [
            "Separate the rope handles widely as you pull.",
            "Focus on mind-muscle contraction rather than high weight."
          ],
          "mistakes": [
            "Pulling downwards to chest like a row.",
            "Jerking torso backwards."
          ],
          "muscles": [
            "Rear Delts",
            "Infraspinatus",
            "Teres Minor",
            "Rhomboids"
          ],
          "sets": 3,
          "reps": "15",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/rep-qVOkqgk",
          "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
          "animationType": "face-pull",
          "createdAt": "2026-10-20T13:32:58.700Z"
        }
      },
      {
        "id": "5e2c67ca-d60f-486a-8651-38fb786bb7c2",
        "workoutPlanId": "tuesday",
        "exerciseId": "barbell-curl",
        "orderIndex": 4,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "barbell-curl",
          "name": "Standing Barbell Bicep Curl",
          "category": "Biceps",
          "muscleGroup": "Biceps Brachii",
          "equipment": "Barbell",
          "difficulty": "Beginner",
          "description": "The classic mass builder for biceps peak and arm thickness.",
          "instructions": [
            "Hold barbell with underhand shoulder-width grip, arms extended at thighs.",
            "Pin elbows against sides of ribcage.",
            "Curl bar upward in arc toward shoulders, squeezing biceps hard at peak.",
            "Lower bar slowly under complete resistance back to full stretch."
          ],
          "tips": [
            "Keep upper arms stationary; do not let elbows drift forward.",
            "Do not lean back or swing hips."
          ],
          "mistakes": [
            "Swinging lower back to heave the barbell up.",
            "Dropping weight quickly on eccentric phase."
          ],
          "muscles": [
            "Biceps Brachii",
            "Brachialis",
            "Forearms"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/ykJmrZ5v0Oo",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "bicep-curl",
          "createdAt": "2026-10-20T13:32:58.710Z"
        }
      },
      {
        "id": "98bacadf-c92f-4461-b9e6-cfdf8061362a",
        "workoutPlanId": "tuesday",
        "exerciseId": "hammer-curl",
        "orderIndex": 5,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "hammer-curl",
          "name": "Dumbbell Hammer Curl",
          "category": "Biceps",
          "muscleGroup": "Brachialis & Brachioradialis",
          "equipment": "Dumbbell",
          "difficulty": "Beginner",
          "description": "Neutral-grip curl that adds thick arm width and forearm mass by heavily loading the brachialis.",
          "instructions": [
            "Stand tall holding dumbbells with palms facing each other (neutral grip).",
            "Curl weights upward while keeping palms facing inward throughout.",
            "Squeeze peak forearm and outer arm contraction.",
            "Lower smoothly to starting position."
          ],
          "tips": [
            "Can be performed alternating or both arms together.",
            "Maintain neutral wrist alignment without bending backwards."
          ],
          "mistakes": [
            "Swinging elbows backwards and forwards.",
            "Using momentum to swing weights up."
          ],
          "muscles": [
            "Brachialis",
            "Brachioradialis",
            "Biceps"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/zC3nLlEvin4",
          "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
          "animationType": "hammer-curl",
          "createdAt": "2026-10-20T13:32:58.714Z"
        }
      }
    ]
  },
  {
    "id": "wednesday",
    "dayOfWeek": "Wednesday",
    "shortDay": "WED",
    "title": "Leg Day",
    "focus": "Quads • Hamstrings • Calves",
    "description": "Heavy lower body strength session targeting quadriceps, posterior chain, and calves.",
    "duration": "50 min",
    "targetCalories": 380,
    "type": "Workout",
    "createdAt": "2026-10-20T13:32:58.749Z",
    "exercises": [
      {
        "id": "167d11c6-a63e-4c0b-bbc8-3504aba2a6d7",
        "workoutPlanId": "wednesday",
        "exerciseId": "barbell-squat",
        "orderIndex": 0,
        "targetSets": 4,
        "targetReps": "6-8",
        "restSeconds": 120,
        "exercise": {
          "id": "barbell-squat",
          "name": "Barbell Back Squat",
          "category": "Legs",
          "muscleGroup": "Quadriceps & Glutes",
          "equipment": "Barbell",
          "difficulty": "Advanced",
          "description": "The fundamental compound lift for lower-body hypertrophy, explosive athletic power, and bone density.",
          "instructions": [
            "Position bar across upper trapezius muscle with shoulder-width grip.",
            "Step back with feet shoulder-width apart, toes angled slightly out.",
            "Hinge hips back and bend knees, tracking knees in line with toes.",
            "Descend until hip crease is below top of knees (parallel or below).",
            "Drive through mid-foot to stand back up powerfully."
          ],
          "tips": [
            "Keep chest tall and maintain rigid abdominal pressure.",
            "Push knees outward to prevent valgus collapse."
          ],
          "mistakes": [
            "Knees caving inward during ascent.",
            "Rising on toes and letting heels leave floor."
          ],
          "muscles": [
            "Quadriceps",
            "Gluteus Maximus",
            "Adductors",
            "Core"
          ],
          "sets": 4,
          "reps": "6-8",
          "restSeconds": 120,
          "videoUrl": "https://www.youtube.com/embed/bEv6CCg2BC8",
          "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
          "animationType": "squat",
          "createdAt": "2026-10-20T13:32:58.704Z"
        }
      },
      {
        "id": "668b4012-4982-4e98-98f3-b38e2cdd511c",
        "workoutPlanId": "wednesday",
        "exerciseId": "romanian-deadlift",
        "orderIndex": 1,
        "targetSets": 3,
        "targetReps": "8-10",
        "restSeconds": 90,
        "exercise": {
          "id": "romanian-deadlift",
          "name": "Romanian Deadlift (RDL)",
          "category": "Legs",
          "muscleGroup": "Hamstrings & Glutes",
          "equipment": "Barbell",
          "difficulty": "Intermediate",
          "description": "Pure hip-hinge exercise producing deep hamstring stretch and glute hypertrophy.",
          "instructions": [
            "Hold barbell at hips with overhand grip and soft bend in knees.",
            "Push hips backward as if touching a wall behind you.",
            "Lower bar down close along your shins until hamstrings feel fully stretched.",
            "Contract glutes and hamstrings to return to standing position."
          ],
          "tips": [
            "Keep barbell in contact with legs the entire time.",
            "Do not squat; the knees remain at the same slight bend throughout."
          ],
          "mistakes": [
            "Rounding lumbar spine when lowering bar.",
            "Bending knees excessively into a squat."
          ],
          "muscles": [
            "Hamstrings",
            "Gluteus Maximus",
            "Erector Spinae"
          ],
          "sets": 3,
          "reps": "8-10",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/JCXUYuzwNrM",
          "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=400&q=80",
          "animationType": "rdl",
          "createdAt": "2026-10-20T13:32:58.705Z"
        }
      },
      {
        "id": "9a53a69b-e0a9-449c-bde2-f80c7c379562",
        "workoutPlanId": "wednesday",
        "exerciseId": "leg-press",
        "orderIndex": 2,
        "targetSets": 4,
        "targetReps": "10-12",
        "restSeconds": 90,
        "exercise": {
          "id": "leg-press",
          "name": "45-Degree Leg Press",
          "category": "Legs",
          "muscleGroup": "Quadriceps",
          "equipment": "Machine",
          "difficulty": "Beginner",
          "description": "Heavy quad and glute loading without spinal compressive fatigue.",
          "instructions": [
            "Sit in machine with back firmly against pad and feet hip-width on sled.",
            "Disengage safety levers and slowly lower sled until knees reach 90 degrees.",
            "Drive sled upward through entire foot without locking knees violently."
          ],
          "tips": [
            "Never lock out knees completely at top.",
            "Keep lower back flat against back pad; do not let butt lift."
          ],
          "mistakes": [
            "Letting pelvis tuck under and lower back round at bottom of stroke.",
            "Hyperextending knees at full extension."
          ],
          "muscles": [
            "Quadriceps",
            "Glutes",
            "Hamstrings"
          ],
          "sets": 4,
          "reps": "10-12",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/IZxyjW7MPJQ",
          "thumbnailUrl": "https://images.unsplash.com/photo-1584466977772-e5992b8b311a?auto=format&fit=crop&w=400&q=80",
          "animationType": "leg-press",
          "createdAt": "2026-10-20T13:32:58.706Z"
        }
      },
      {
        "id": "3aadcac7-4125-46d5-a41a-b3257fc185b9",
        "workoutPlanId": "wednesday",
        "exerciseId": "walking-lunges",
        "orderIndex": 3,
        "targetSets": 3,
        "targetReps": "12 per leg",
        "restSeconds": 75,
        "exercise": {
          "id": "walking-lunges",
          "name": "Dumbbell Walking Lunges",
          "category": "Legs",
          "muscleGroup": "Quads & Glutes",
          "equipment": "Dumbbell",
          "difficulty": "Intermediate",
          "description": "Dynamic unilateral leg movement that torches quadriceps, glutes, and builds unilateral coordination.",
          "instructions": [
            "Hold a pair of dumbbells at sides with tall upright torso.",
            "Take an exaggerated step forward and sink down until back knee kisses floor.",
            "Drive through lead heel to rise and step smoothly into the next lunge."
          ],
          "tips": [
            "Keep torso upright and brace core.",
            "Front shin should remain nearly vertical at bottom of stride."
          ],
          "mistakes": [
            "Taking strides that are too short, causing front knee to shoot past toes excessively.",
            "Collapsing torso forward onto lead thigh."
          ],
          "muscles": [
            "Quadriceps",
            "Glutes",
            "Calves",
            "Core"
          ],
          "sets": 3,
          "reps": "12 per leg",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/L8fvypPrzzs",
          "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
          "animationType": "lunge",
          "createdAt": "2026-10-20T13:32:58.708Z"
        }
      },
      {
        "id": "d72cf1bd-1691-483f-b52e-8ef45f41c8ee",
        "workoutPlanId": "wednesday",
        "exerciseId": "standing-calf-raise",
        "orderIndex": 4,
        "targetSets": 4,
        "targetReps": "15-20",
        "restSeconds": 45,
        "exercise": {
          "id": "standing-calf-raise",
          "name": "Standing Calf Raise",
          "category": "Legs",
          "muscleGroup": "Gastrocnemius & Soleus",
          "equipment": "Machine",
          "difficulty": "Beginner",
          "description": "Targets calf muscle heads through full ankle plantar flexion and deep dorsiflexion stretch.",
          "instructions": [
            "Stand with balls of feet on platform and shoulder pads adjusted securely.",
            "Lower heels down as deep as possible to feel full calf stretch.",
            "Press through balls of big toes to rise to highest possible calf contraction.",
            "Hold peak contraction for 1 full second before descending."
          ],
          "tips": [
            "Do not bounce at the bottom.",
            "Pause at bottom stretch for 1 second to eliminate Achilles tendon reflex."
          ],
          "mistakes": [
            "Rapid bouncing without muscular control.",
            "Bending knees to assist the lift."
          ],
          "muscles": [
            "Gastrocnemius",
            "Soleus"
          ],
          "sets": 4,
          "reps": "15-20",
          "restSeconds": 45,
          "videoUrl": "https://www.youtube.com/embed/-M4-G8p8fmc",
          "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
          "animationType": "calf-raise",
          "createdAt": "2026-10-20T13:32:58.709Z"
        }
      }
    ]
  },
  {
    "id": "thursday",
    "dayOfWeek": "Thursday",
    "shortDay": "THU",
    "title": "Shoulders & Core",
    "focus": "Deltoids • Abs • Rotational Strength",
    "description": "Sculpt shoulder 3D caps and reinforce 360-degree core rigidity and rotational stability.",
    "duration": "40 min",
    "targetCalories": 280,
    "type": "Workout",
    "createdAt": "2026-10-20T13:32:58.755Z",
    "exercises": [
      {
        "id": "61dc9ed4-6e77-4c69-a86a-8fea37e58bf6",
        "workoutPlanId": "thursday",
        "exerciseId": "overhead-press",
        "orderIndex": 0,
        "targetSets": 4,
        "targetReps": "6-8",
        "restSeconds": 90,
        "exercise": {
          "id": "overhead-press",
          "name": "Barbell Overhead Press",
          "category": "Shoulders",
          "muscleGroup": "Deltoids",
          "equipment": "Barbell",
          "difficulty": "Intermediate",
          "description": "Strict vertical barbell press that builds wide cannonball shoulders and core rigidity.",
          "instructions": [
            "Rest the barbell across your clavicles with an overhand grip outside shoulders.",
            "Brace core, squeeze glutes, and tilt head slightly back to clear bar path.",
            "Press barbell straight overhead to full lockout.",
            "Bring head forward through the 'window' of your arms at lockout.",
            "Lower the bar under control back to your upper chest."
          ],
          "tips": [
            "Keep forearms vertical directly under the bar.",
            "Keep glutes squeezed tight to prevent lower back hyperextension."
          ],
          "mistakes": [
            "Leaning back excessively into an improvised incline press.",
            "Using knee dip to launch weight (that is a push press, not strict press)."
          ],
          "muscles": [
            "Anterior Deltoid",
            "Lateral Deltoid",
            "Triceps",
            "Upper Traps"
          ],
          "sets": 4,
          "reps": "6-8",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/2yjwXTZQDDI",
          "thumbnailUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
          "animationType": "overhead-press",
          "createdAt": "2026-10-20T13:32:58.694Z"
        }
      },
      {
        "id": "948eaa16-846a-4342-a164-b4bdaee911ec",
        "workoutPlanId": "thursday",
        "exerciseId": "arnold-press",
        "orderIndex": 1,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "arnold-press",
          "name": "Arnold Dumbbell Press",
          "category": "Shoulders",
          "muscleGroup": "Complete Deltoids",
          "equipment": "Dumbbell",
          "difficulty": "Intermediate",
          "description": "Rotational dumbbell press that activates anterior and lateral deltoid fibers through complete arc.",
          "instructions": [
            "Sit on bench with dumbbells held at chin level, palms facing your chest.",
            "As you press overhead, rotate your wrists so palms face forward at top.",
            "Reverse rotation on way down, returning to chin-level start position."
          ],
          "tips": [
            "Perform the rotation smoothly during the upward press motion.",
            "Control the descent completely."
          ],
          "mistakes": [
            "Rotating too early before pressing upward.",
            "Arching lower back off the backrest."
          ],
          "muscles": [
            "Anterior Deltoids",
            "Lateral Deltoids",
            "Triceps"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/3ml7BH7mNwQ",
          "thumbnailUrl": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
          "animationType": "arnold-press",
          "createdAt": "2026-10-20T13:32:58.702Z"
        }
      },
      {
        "id": "8358ef89-a3a0-4471-8e15-c84b3936285f",
        "workoutPlanId": "thursday",
        "exerciseId": "lateral-raise",
        "orderIndex": 2,
        "targetSets": 4,
        "targetReps": "12-15",
        "restSeconds": 60,
        "exercise": {
          "id": "lateral-raise",
          "name": "Dumbbell Lateral Raise",
          "category": "Shoulders",
          "muscleGroup": "Lateral Deltoids",
          "equipment": "Dumbbell",
          "difficulty": "Beginner",
          "description": "The primary isolation exercise for creating boulder shoulders and upper body width.",
          "instructions": [
            "Stand holding dumbbells at your sides with palms facing inward.",
            "Maintain a soft bend in elbows and a very slight forward torso hinge.",
            "Raise arms out to sides in scapular plane until parallel to floor.",
            "Pause for half a second at peak, then lower smoothly."
          ],
          "tips": [
            "Lead with your elbows rather than wrists.",
            "Imagine pouring water out of pitchers at the top."
          ],
          "mistakes": [
            "Using swinging body English to heave heavy weights up.",
            "Raising arms way above shoulder height, pinching rotator cuff."
          ],
          "muscles": [
            "Lateral Deltoid",
            "Trapezius"
          ],
          "sets": 4,
          "reps": "12-15",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/3VcKaXpzqRo",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
          "animationType": "lateral-raise",
          "createdAt": "2026-10-20T13:32:58.696Z"
        }
      },
      {
        "id": "87e5f49c-fd30-4f49-9bd7-424860073f1a",
        "workoutPlanId": "thursday",
        "exerciseId": "hanging-leg-raise",
        "orderIndex": 3,
        "targetSets": 3,
        "targetReps": "12-15",
        "restSeconds": 60,
        "exercise": {
          "id": "hanging-leg-raise",
          "name": "Hanging Leg Raise",
          "category": "Core",
          "muscleGroup": "Lower Rectus Abdominis",
          "equipment": "Bodyweight",
          "difficulty": "Advanced",
          "description": "Premier core movement that pulls pelvis up into posterior tilt to scorch lower abdominals.",
          "instructions": [
            "Hang from pull-up bar with overhand grip and dead hang shoulder engagement.",
            "Brace core and raise legs straight in front until parallel with floor or higher.",
            "Tilt pelvis up towards ribcage to ensure abdominal contraction, not just hip flexors.",
            "Lower legs slowly without swinging body."
          ],
          "tips": [
            "Think about rolling your pelvis up toward your chest.",
            "Bend knees if straight leg raise causes lower back strain or swinging."
          ],
          "mistakes": [
            "Swinging body wildly to kick legs up.",
            "Only moving at hips without curling pelvis upward."
          ],
          "muscles": [
            "Lower Abdominals",
            "Hip Flexors",
            "Obliques",
            "Grip"
          ],
          "sets": 3,
          "reps": "12-15",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/Pr1ieGZ5atk",
          "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
          "animationType": "hanging-leg-raise",
          "createdAt": "2026-10-20T13:32:58.718Z"
        }
      },
      {
        "id": "458bf1ad-0e41-4ce4-a39c-cd5c56a20e5f",
        "workoutPlanId": "thursday",
        "exerciseId": "plank",
        "orderIndex": 4,
        "targetSets": 3,
        "targetReps": "45-60 sec",
        "restSeconds": 60,
        "exercise": {
          "id": "plank",
          "name": "Forearm Plank",
          "category": "Core",
          "muscleGroup": "Transverse Abdominis & Deep Core",
          "equipment": "Bodyweight",
          "difficulty": "Beginner",
          "description": "Isometric core stability exercise that reinforces spinal rigidity and posture.",
          "instructions": [
            "Rest on forearms with elbows placed directly below shoulders.",
            "Extend legs behind with balls of feet on floor.",
            "Form a rigid straight line from heels to head.",
            "Actively pull elbows towards toes and squeeze glutes to maximize tension."
          ],
          "tips": [
            "Breathe steadily from diaphragm without holding breath.",
            "Do not let shoulder blades collapse inward; push floor away."
          ],
          "mistakes": [
            "Hips sagging down toward floor.",
            "Piking butt up into the air."
          ],
          "muscles": [
            "Transverse Abdominis",
            "Rectus Abdominis",
            "Glutes",
            "Shoulders"
          ],
          "sets": 3,
          "reps": "45-60 sec",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/ASdvN_XEl_c",
          "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
          "animationType": "plank",
          "createdAt": "2026-10-20T13:32:58.720Z"
        }
      },
      {
        "id": "68e64007-c0a8-4022-a3cf-ce3a8ed9744f",
        "workoutPlanId": "thursday",
        "exerciseId": "cable-woodchopper",
        "orderIndex": 5,
        "targetSets": 3,
        "targetReps": "12 per side",
        "restSeconds": 60,
        "exercise": {
          "id": "cable-woodchopper",
          "name": "Cable Woodchopper",
          "category": "Core",
          "muscleGroup": "Obliques & Rotational Core",
          "equipment": "Cable",
          "difficulty": "Intermediate",
          "description": "Rotational powerhouse exercise training athletic torso power and functional oblique stability.",
          "instructions": [
            "Set cable pulley at high position. Stand sideways to machine holding handle with both hands.",
            "Pull handle diagonally down across body toward opposite hip while rotating torso.",
            "Pivot back foot as you rotate down.",
            "Slowly control the handle back up along the diagonal path."
          ],
          "tips": [
            "Keep arms mostly straight; power originates from abdominal rotation.",
            "Brace core firmly through the full arc."
          ],
          "mistakes": [
            "Pulling strictly with arms without rotating torso.",
            "Losing control on the return eccentric phase."
          ],
          "muscles": [
            "External Obliques",
            "Internal Obliques",
            "Transverse Abdominis"
          ],
          "sets": 3,
          "reps": "12 per side",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/pAplQXk3dkU",
          "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
          "animationType": "woodchopper",
          "createdAt": "2026-10-20T13:32:58.722Z"
        }
      }
    ]
  },
  {
    "id": "friday",
    "dayOfWeek": "Friday",
    "shortDay": "FRI",
    "title": "Chest & Back Super Split",
    "focus": "Antagonist Hypertrophy",
    "description": "High-density antagonist upper body workout alternating chest presses and heavy back rows.",
    "duration": "45 min",
    "targetCalories": 340,
    "type": "Workout",
    "createdAt": "2026-10-20T13:32:58.760Z",
    "exercises": [
      {
        "id": "b46dd27c-3e32-4d7c-ba60-8bfe57ebc268",
        "workoutPlanId": "friday",
        "exerciseId": "bench-press",
        "orderIndex": 0,
        "targetSets": 4,
        "targetReps": "8-10",
        "restSeconds": 90,
        "exercise": {
          "id": "bench-press",
          "name": "Barbell Bench Press",
          "category": "Chest",
          "muscleGroup": "Pectoralis Major",
          "equipment": "Barbell",
          "difficulty": "Intermediate",
          "description": "The classic compound movement for upper-body pushing power, chest thickness, and shoulder stability.",
          "instructions": [
            "Lie flat on the bench with your feet planted firmly on the floor.",
            "Grip the bar slightly wider than shoulder-width with wrists straight.",
            "Unrack the bar and stabilize it directly over your upper chest.",
            "Lower the bar under control until it lightly touches your mid-chest.",
            "Drive your feet into the floor and press the barbell back up explosively."
          ],
          "tips": [
            "Retract and depress your scapulae before unracking.",
            "Keep a natural arch in your lower spine; do not let your hips lift.",
            "Flare elbows at a roughly 45-degree angle rather than a 90-degree flare."
          ],
          "mistakes": [
            "Bouncing the bar off the rib cage.",
            "Lifting hips off the bench during the push phase.",
            "Overflaring elbows, putting excessive strain on the anterior deltoids."
          ],
          "muscles": [
            "Chest",
            "Triceps",
            "Front Deltoids"
          ],
          "sets": 4,
          "reps": "8-10",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/rT7DgCr-3pg",
          "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
          "animationType": "bench-press",
          "createdAt": "2026-10-20T13:32:58.674Z"
        }
      },
      {
        "id": "fbc67e33-6261-4b0d-a65d-93de1e375e31",
        "workoutPlanId": "friday",
        "exerciseId": "barbell-deadlift",
        "orderIndex": 1,
        "targetSets": 3,
        "targetReps": "5-6",
        "restSeconds": 120,
        "exercise": {
          "id": "barbell-deadlift",
          "name": "Barbell Deadlift",
          "category": "Back",
          "muscleGroup": "Erector Spinae & Posterior Chain",
          "equipment": "Barbell",
          "difficulty": "Advanced",
          "description": "The king of total-body strength movements, developing massive posterior chain density and grip power.",
          "instructions": [
            "Stand with mid-foot directly under the barbell, feet hip-width apart.",
            "Hinge at the hips and grip the bar just outside your shins.",
            "Pull chest up, flatten your back, and pull the slack out of the barbell.",
            "Drive through the floor with your legs and lock out hips and knees simultaneously."
          ],
          "tips": [
            "Keep the barbell dragging against or right next to your shins.",
            "Take a deep diaphragmatic breath into your belt and brace hard before pulling."
          ],
          "mistakes": [
            "Rounding the lumbar spine under load.",
            "Hyperextending and leaning back excessively at the top lockout."
          ],
          "muscles": [
            "Lower Back",
            "Lats",
            "Glutes",
            "Hamstrings",
            "Traps"
          ],
          "sets": 4,
          "reps": "5-6",
          "restSeconds": 120,
          "videoUrl": "https://www.youtube.com/embed/op9kVnSso6Q",
          "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
          "animationType": "deadlift",
          "createdAt": "2026-10-20T13:32:58.686Z"
        }
      },
      {
        "id": "2df7f764-2899-4597-b85b-59c37fe8f7a2",
        "workoutPlanId": "friday",
        "exerciseId": "incline-dumbbell-press",
        "orderIndex": 2,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "incline-dumbbell-press",
          "name": "Incline Dumbbell Press",
          "category": "Chest",
          "muscleGroup": "Upper Chest",
          "equipment": "Dumbbell",
          "difficulty": "Intermediate",
          "description": "Focuses on the clavicular head of the pectoralis major with greater freedom of wrist rotation.",
          "instructions": [
            "Set an adjustable bench to an incline angle between 30 and 45 degrees.",
            "Sit back with dumbbells resting on your knees, then kick them up to shoulder level.",
            "Press the dumbbells overhead until arms are extended, keeping wrists neutral.",
            "Slowly lower dumbbells until you feel a deep stretch in the upper pectorals."
          ],
          "tips": [
            "Keep chest puffed and shoulders pinned back into the bench padding.",
            "Do not bang the dumbbells together at the top of the movement."
          ],
          "mistakes": [
            "Setting the bench incline too steep (>45 deg) which turns it into a shoulder press.",
            "Dropping elbows too low and over-stretching the shoulder capsule."
          ],
          "muscles": [
            "Upper Chest",
            "Front Deltoids",
            "Triceps"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/8iPEnn-ltC8",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "incline-press",
          "createdAt": "2026-10-20T13:32:58.679Z"
        }
      },
      {
        "id": "3a02415b-3b85-4bb3-aeda-50891e10fb64",
        "workoutPlanId": "friday",
        "exerciseId": "lat-pulldown",
        "orderIndex": 3,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "lat-pulldown",
          "name": "Wide-Grip Lat Pulldown",
          "category": "Back",
          "muscleGroup": "Latissimus Dorsi",
          "equipment": "Cable",
          "difficulty": "Beginner",
          "description": "Builds back width and V-taper taper by isolating the latissimus dorsi under controlled resistance.",
          "instructions": [
            "Sit down and secure your thighs firmly under the roller pads.",
            "Grip the wide bar with an overhand grip slightly wider than shoulders.",
            "Lean torso back roughly 10 degrees and pull the bar down to touch upper chest.",
            "Drive elbows downwards and backwards into your back pockets.",
            "Slowly allow the bar to raise back up to full stretch overhead."
          ],
          "tips": [
            "Think of your hands as hooks; pull with your elbows.",
            "Feel the stretch at the top without allowing shoulders to shrug violently."
          ],
          "mistakes": [
            "Leaning back excessively and swinging torso to move the weight.",
            "Pulling the bar behind the neck, causing cervical stress."
          ],
          "muscles": [
            "Lats",
            "Biceps",
            "Rhomboids",
            "Rear Delts"
          ],
          "sets": 4,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/CAwf7n6Luuc",
          "thumbnailUrl": "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
          "animationType": "lat-pulldown",
          "createdAt": "2026-10-20T13:32:58.688Z"
        }
      },
      {
        "id": "a3b4a526-b20b-475f-bb06-d3e10541ec7d",
        "workoutPlanId": "friday",
        "exerciseId": "dips-chest",
        "orderIndex": 4,
        "targetSets": 3,
        "targetReps": "8-12",
        "restSeconds": 90,
        "exercise": {
          "id": "dips-chest",
          "name": "Chest Dips",
          "category": "Chest",
          "muscleGroup": "Lower Chest",
          "equipment": "Bodyweight",
          "difficulty": "Advanced",
          "description": "High-intensity compound exercise targeting the lower pectoral fibers and triceps with bodyweight load.",
          "instructions": [
            "Grip parallel dip bars and hoist yourself up with locked elbows.",
            "Lean forward at roughly 30 degrees to emphasize pectoral loading.",
            "Lower yourself smoothly until elbows reach 90 degrees.",
            "Press back up firmly without swinging your legs."
          ],
          "tips": [
            "Crossing ankles and leaning the torso forward shifts load from triceps to chest.",
            "Descend with control to safeguard the anterior shoulder joint."
          ],
          "mistakes": [
            "Staying completely upright (which loads triceps rather than chest).",
            "Descending too deep past comfort and straining the rotator cuff."
          ],
          "muscles": [
            "Lower Chest",
            "Triceps",
            "Front Deltoids"
          ],
          "sets": 3,
          "reps": "8-12",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/2z8JmcrW-As",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "dips",
          "createdAt": "2026-10-20T13:32:58.683Z"
        }
      },
      {
        "id": "0068f134-4175-403e-a114-56a4fc940950",
        "workoutPlanId": "friday",
        "exerciseId": "pull-ups",
        "orderIndex": 5,
        "targetSets": 3,
        "targetReps": "6-10",
        "restSeconds": 90,
        "exercise": {
          "id": "pull-ups",
          "name": "Overhand Pull-Ups",
          "category": "Back",
          "muscleGroup": "Lats & Biceps",
          "equipment": "Bodyweight",
          "difficulty": "Advanced",
          "description": "The quintessential test of upper body relative strength and back vertical pulling power.",
          "instructions": [
            "Grip the pull-up bar with overhand grip slightly wider than shoulders.",
            "Hang at full arm extension with scapulae engaged.",
            "Pull yourself upward by driving elbows down until chin clears the bar.",
            "Lower under control back to a full dead hang."
          ],
          "tips": [
            "Engage your core to avoid swinging or kicking legs.",
            "Focus on chest to bar rather than merely reaching with your chin."
          ],
          "mistakes": [
            "Kipping or flailing legs for momentum.",
            "Cutting the range of motion short at top or bottom."
          ],
          "muscles": [
            "Lats",
            "Biceps",
            "Upper Back",
            "Grip"
          ],
          "sets": 3,
          "reps": "6-10",
          "restSeconds": 90,
          "videoUrl": "https://www.youtube.com/embed/eGo4IYlbE5g",
          "thumbnailUrl": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&q=80",
          "animationType": "pull-up",
          "createdAt": "2026-10-20T13:32:58.693Z"
        }
      }
    ]
  },
  {
    "id": "saturday",
    "dayOfWeek": "Saturday",
    "shortDay": "SAT",
    "title": "Arms & Core",
    "focus": "Biceps • Triceps • Deep Core",
    "description": "Dedicated arm blasting protocol with superset curls and triceps extensions, paired with ab rollouts.",
    "duration": "40 min",
    "targetCalories": 290,
    "type": "Workout",
    "createdAt": "2026-10-20T13:32:58.766Z",
    "exercises": [
      {
        "id": "0383e367-0189-45f3-bda0-4e733ee40d9a",
        "workoutPlanId": "saturday",
        "exerciseId": "barbell-curl",
        "orderIndex": 0,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "barbell-curl",
          "name": "Standing Barbell Bicep Curl",
          "category": "Biceps",
          "muscleGroup": "Biceps Brachii",
          "equipment": "Barbell",
          "difficulty": "Beginner",
          "description": "The classic mass builder for biceps peak and arm thickness.",
          "instructions": [
            "Hold barbell with underhand shoulder-width grip, arms extended at thighs.",
            "Pin elbows against sides of ribcage.",
            "Curl bar upward in arc toward shoulders, squeezing biceps hard at peak.",
            "Lower bar slowly under complete resistance back to full stretch."
          ],
          "tips": [
            "Keep upper arms stationary; do not let elbows drift forward.",
            "Do not lean back or swing hips."
          ],
          "mistakes": [
            "Swinging lower back to heave the barbell up.",
            "Dropping weight quickly on eccentric phase."
          ],
          "muscles": [
            "Biceps Brachii",
            "Brachialis",
            "Forearms"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/ykJmrZ5v0Oo",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "bicep-curl",
          "createdAt": "2026-10-20T13:32:58.710Z"
        }
      },
      {
        "id": "3891a095-95a9-49e7-9077-394270259048",
        "workoutPlanId": "saturday",
        "exerciseId": "skull-crushers",
        "orderIndex": 1,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 75,
        "exercise": {
          "id": "skull-crushers",
          "name": "Lying EZ-Bar Skull Crushers",
          "category": "Triceps",
          "muscleGroup": "Long Head of Triceps",
          "equipment": "Barbell",
          "difficulty": "Intermediate",
          "description": "Isolates long head of triceps from deep stretch position behind the crown of the head.",
          "instructions": [
            "Lie on flat bench holding EZ-bar with narrow overhand grip.",
            "Angle arms back roughly 15 degrees from vertical towards your head.",
            "Bending only at elbows, lower bar down towards hairline or crown of head.",
            "Extend forearms back to start position while keeping upper arms fixed."
          ],
          "tips": [
            "Angling arms back keeps continuous tension on triceps at top.",
            "Use EZ bar to reduce wrist and elbow joint strain."
          ],
          "mistakes": [
            "Flaring elbows wide open.",
            "Moving upper arms during the movement."
          ],
          "muscles": [
            "Triceps Long Head",
            "Triceps Lateral Head"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/d_KZxkY_0cM",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "skull-crusher",
          "createdAt": "2026-10-20T13:32:58.716Z"
        }
      },
      {
        "id": "dae8a847-b928-44c1-97f1-6f6b08bea1a2",
        "workoutPlanId": "saturday",
        "exerciseId": "incline-dumbbell-curl",
        "orderIndex": 2,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "incline-dumbbell-curl",
          "name": "Incline Dumbbell Curl",
          "category": "Biceps",
          "muscleGroup": "Long Head of Biceps",
          "equipment": "Dumbbell",
          "difficulty": "Intermediate",
          "description": "Maximizes long head stretch of the biceps by placing shoulders into passive hyperextension.",
          "instructions": [
            "Sit back on bench set at 45-60 degree incline.",
            "Let dumbbells hang straight down behind torso.",
            "Curl dumbbells upward while supinating wrists so palms face shoulders at top.",
            "Lower under control feeling extreme stretch in long head."
          ],
          "tips": [
            "Keep shoulders pinned to bench backrest.",
            "Do not let elbows migrate forward during curl."
          ],
          "mistakes": [
            "Using bench angle that is too steep or lifting head off pad.",
            "Curling with internally rotated shoulders."
          ],
          "muscles": [
            "Biceps Long Head",
            "Brachialis"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/soxrZlIl35U",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "incline-curl",
          "createdAt": "2026-10-20T13:32:58.712Z"
        }
      },
      {
        "id": "91880623-6a8b-4b07-b720-ffa201f3ea17",
        "workoutPlanId": "saturday",
        "exerciseId": "overhead-dumbbell-extension",
        "orderIndex": 3,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "overhead-dumbbell-extension",
          "name": "Overhead Dumbbell Tricep Extension",
          "category": "Triceps",
          "muscleGroup": "Triceps Long Head",
          "equipment": "Dumbbell",
          "difficulty": "Beginner",
          "description": "Places long head of triceps in fully stretched position overhead for maximum hypertrophy.",
          "instructions": [
            "Sit on short-backed bench holding one heavy dumbbell vertically overhead with both hands cup-gripped under top plate.",
            "Lower dumbbell smoothly behind your head until forearms hit biceps.",
            "Drive dumbbell straight back up overhead until arms extend completely."
          ],
          "tips": [
            "Keep elbows pointing forward as much as anatomy allows.",
            "Keep core braced and spine neutral."
          ],
          "mistakes": [
            "Allowing elbows to flare excessively wide.",
            "Arching lower back into hyperextension."
          ],
          "muscles": [
            "Triceps Long Head"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/Q0P_w6uG5jE",
          "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
          "animationType": "overhead-extension",
          "createdAt": "2026-10-20T13:32:58.717Z"
        }
      },
      {
        "id": "49c4b8e6-c62a-42b5-9741-69f37c61b1b7",
        "workoutPlanId": "saturday",
        "exerciseId": "hammer-curl",
        "orderIndex": 4,
        "targetSets": 3,
        "targetReps": "10-12",
        "restSeconds": 60,
        "exercise": {
          "id": "hammer-curl",
          "name": "Dumbbell Hammer Curl",
          "category": "Biceps",
          "muscleGroup": "Brachialis & Brachioradialis",
          "equipment": "Dumbbell",
          "difficulty": "Beginner",
          "description": "Neutral-grip curl that adds thick arm width and forearm mass by heavily loading the brachialis.",
          "instructions": [
            "Stand tall holding dumbbells with palms facing each other (neutral grip).",
            "Curl weights upward while keeping palms facing inward throughout.",
            "Squeeze peak forearm and outer arm contraction.",
            "Lower smoothly to starting position."
          ],
          "tips": [
            "Can be performed alternating or both arms together.",
            "Maintain neutral wrist alignment without bending backwards."
          ],
          "mistakes": [
            "Swinging elbows backwards and forwards.",
            "Using momentum to swing weights up."
          ],
          "muscles": [
            "Brachialis",
            "Brachioradialis",
            "Biceps"
          ],
          "sets": 3,
          "reps": "10-12",
          "restSeconds": 60,
          "videoUrl": "https://www.youtube.com/embed/zC3nLlEvin4",
          "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
          "animationType": "hammer-curl",
          "createdAt": "2026-10-20T13:32:58.714Z"
        }
      },
      {
        "id": "11cab6f6-4aaa-4365-8b51-4d9143cec656",
        "workoutPlanId": "saturday",
        "exerciseId": "ab-wheel-rollout",
        "orderIndex": 5,
        "targetSets": 3,
        "targetReps": "8-12",
        "restSeconds": 75,
        "exercise": {
          "id": "ab-wheel-rollout",
          "name": "Ab Wheel Rollout",
          "category": "Core",
          "muscleGroup": "Anti-Extension Core",
          "equipment": "Bodyweight",
          "difficulty": "Advanced",
          "description": "Extreme anti-extension core stimulus that challenges anterior abdominal wall to maximum capacity.",
          "instructions": [
            "Kneel on mat with hands gripping the ab wheel handles directly under shoulders.",
            "Brace abs into slight posterior pelvic tilt.",
            "Roll wheel forward smoothly as far as you can without hyperextending lower back.",
            "Contract abdominals to pull wheel back under your chest."
          ],
          "tips": [
            "Never let your lower spine dip into a swayback curve.",
            "Squeeze glutes throughout the full roll."
          ],
          "mistakes": [
            "Rolling out too far and sagging lumbar spine.",
            "Pulling back with hips first instead of curling core."
          ],
          "muscles": [
            "Rectus Abdominis",
            "Lats",
            "Serratus Anterior",
            "Hip Flexors"
          ],
          "sets": 3,
          "reps": "8-12",
          "restSeconds": 75,
          "videoUrl": "https://www.youtube.com/embed/rqiTPdK1cWg",
          "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
          "animationType": "ab-rollout",
          "createdAt": "2026-10-20T13:32:58.723Z"
        }
      }
    ]
  },
  {
    "id": "sunday",
    "dayOfWeek": "Sunday",
    "shortDay": "SUN",
    "title": "Active Recovery & Mobility",
    "focus": "Cardio • Stretching • Recovery",
    "description": "Rest day to allow muscle fiber supercompensation, hydration replenishment, and light walking/running.",
    "duration": "30 min",
    "targetCalories": 150,
    "type": "Rest",
    "createdAt": "2026-10-20T13:32:58.773Z",
    "exercises": []
  }
];
