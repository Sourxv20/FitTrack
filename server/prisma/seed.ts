import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const exercisesData = [
  // CHEST
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    category: "Chest",
    muscleGroup: "Pectoralis Major",
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: "The classic compound movement for upper-body pushing power, chest thickness, and shoulder stability.",
    sets: 4,
    reps: "8-10",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
    animationType: "bench-press",
    muscles: JSON.stringify(["Chest", "Triceps", "Front Deltoids"]),
    instructions: JSON.stringify([
      "Lie flat on the bench with your feet planted firmly on the floor.",
      "Grip the bar slightly wider than shoulder-width with wrists straight.",
      "Unrack the bar and stabilize it directly over your upper chest.",
      "Lower the bar under control until it lightly touches your mid-chest.",
      "Drive your feet into the floor and press the barbell back up explosively."
    ]),
    tips: JSON.stringify([
      "Retract and depress your scapulae before unracking.",
      "Keep a natural arch in your lower spine; do not let your hips lift.",
      "Flare elbows at a roughly 45-degree angle rather than a 90-degree flare."
    ]),
    mistakes: JSON.stringify([
      "Bouncing the bar off the rib cage.",
      "Lifting hips off the bench during the push phase.",
      "Overflaring elbows, putting excessive strain on the anterior deltoids."
    ])
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    muscleGroup: "Upper Chest",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    description: "Focuses on the clavicular head of the pectoralis major with greater freedom of wrist rotation.",
    sets: 3,
    reps: "10-12",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8",
    animationType: "incline-press",
    muscles: JSON.stringify(["Upper Chest", "Front Deltoids", "Triceps"]),
    instructions: JSON.stringify([
      "Set an adjustable bench to an incline angle between 30 and 45 degrees.",
      "Sit back with dumbbells resting on your knees, then kick them up to shoulder level.",
      "Press the dumbbells overhead until arms are extended, keeping wrists neutral.",
      "Slowly lower dumbbells until you feel a deep stretch in the upper pectorals."
    ]),
    tips: JSON.stringify([
      "Keep chest puffed and shoulders pinned back into the bench padding.",
      "Do not bang the dumbbells together at the top of the movement."
    ]),
    mistakes: JSON.stringify([
      "Setting the bench incline too steep (>45 deg) which turns it into a shoulder press.",
      "Dropping elbows too low and over-stretching the shoulder capsule."
    ])
  },
  {
    id: "cable-fly",
    name: "Cable Chest Fly",
    category: "Chest",
    muscleGroup: "Inner & Mid Chest",
    equipment: "Cable",
    difficulty: "Beginner",
    description: "Maintains constant tension across the entire range of motion, providing unmatched chest pump and isolation.",
    sets: 3,
    reps: "12-15",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/taI4XduLpBe",
    animationType: "cable-fly",
    muscles: JSON.stringify(["Chest", "Anterior Deltoids", "Serratus Anterior"]),
    instructions: JSON.stringify([
      "Set cable pulleys at chest height. Take a handle in each hand and step forward into a staggered stance.",
      "With a slight bend in your elbows, sweep your hands forward in an arc.",
      "Squeeze the chest muscles forcefully when hands meet in front of you.",
      "Control the handles as they spread back out until a comfortable stretch is reached."
    ]),
    tips: JSON.stringify([
      "Imagine hugging a wide oak tree.",
      "Maintain a fixed elbow angle throughout the entire fly movement."
    ]),
    mistakes: JSON.stringify([
      "Turning the fly into a pressing motion by bending and straightening elbows.",
      "Using momentum and rocking the torso back and forth."
    ])
  },
  {
    id: "push-ups",
    name: "Standard Push-Ups",
    category: "Chest",
    muscleGroup: "Chest & Core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    description: "The gold standard bodyweight movement for upper body pressing endurance and core stability.",
    sets: 3,
    reps: "15-20",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    animationType: "push-up",
    muscles: JSON.stringify(["Chest", "Triceps", "Core", "Shoulders"]),
    instructions: JSON.stringify([
      "Place hands on the floor slightly wider than shoulder-width.",
      "Form a rigid straight line from heels through hips to the crown of your head.",
      "Lower your chest until it hovers roughly one inch above the ground.",
      "Press through your palms to return to full arm extension."
    ]),
    tips: JSON.stringify([
      "Brace glutes and abs tightly to avoid sagging hips.",
      "Keep neck neutral by looking at a spot on the floor 1 foot ahead."
    ]),
    mistakes: JSON.stringify([
      "Hips sagging down or piking up in the air.",
      "Flaring elbows straight out sideways at 90 degrees."
    ])
  },
  {
    id: "dips-chest",
    name: "Chest Dips",
    category: "Chest",
    muscleGroup: "Lower Chest",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    description: "High-intensity compound exercise targeting the lower pectoral fibers and triceps with bodyweight load.",
    sets: 3,
    reps: "8-12",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/2z8JmcrW-As",
    animationType: "dips",
    muscles: JSON.stringify(["Lower Chest", "Triceps", "Front Deltoids"]),
    instructions: JSON.stringify([
      "Grip parallel dip bars and hoist yourself up with locked elbows.",
      "Lean forward at roughly 30 degrees to emphasize pectoral loading.",
      "Lower yourself smoothly until elbows reach 90 degrees.",
      "Press back up firmly without swinging your legs."
    ]),
    tips: JSON.stringify([
      "Crossing ankles and leaning the torso forward shifts load from triceps to chest.",
      "Descend with control to safeguard the anterior shoulder joint."
    ]),
    mistakes: JSON.stringify([
      "Staying completely upright (which loads triceps rather than chest).",
      "Descending too deep past comfort and straining the rotator cuff."
    ])
  },

  // BACK
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    category: "Back",
    muscleGroup: "Erector Spinae & Posterior Chain",
    equipment: "Barbell",
    difficulty: "Advanced",
    description: "The king of total-body strength movements, developing massive posterior chain density and grip power.",
    sets: 4,
    reps: "5-6",
    restSeconds: 120,
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
    animationType: "deadlift",
    muscles: JSON.stringify(["Lower Back", "Lats", "Glutes", "Hamstrings", "Traps"]),
    instructions: JSON.stringify([
      "Stand with mid-foot directly under the barbell, feet hip-width apart.",
      "Hinge at the hips and grip the bar just outside your shins.",
      "Pull chest up, flatten your back, and pull the slack out of the barbell.",
      "Drive through the floor with your legs and lock out hips and knees simultaneously."
    ]),
    tips: JSON.stringify([
      "Keep the barbell dragging against or right next to your shins.",
      "Take a deep diaphragmatic breath into your belt and brace hard before pulling."
    ]),
    mistakes: JSON.stringify([
      "Rounding the lumbar spine under load.",
      "Hyperextending and leaning back excessively at the top lockout."
    ])
  },
  {
    id: "lat-pulldown",
    name: "Wide-Grip Lat Pulldown",
    category: "Back",
    muscleGroup: "Latissimus Dorsi",
    equipment: "Cable",
    difficulty: "Beginner",
    description: "Builds back width and V-taper taper by isolating the latissimus dorsi under controlled resistance.",
    sets: 4,
    reps: "10-12",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
    animationType: "lat-pulldown",
    muscles: JSON.stringify(["Lats", "Biceps", "Rhomboids", "Rear Delts"]),
    instructions: JSON.stringify([
      "Sit down and secure your thighs firmly under the roller pads.",
      "Grip the wide bar with an overhand grip slightly wider than shoulders.",
      "Lean torso back roughly 10 degrees and pull the bar down to touch upper chest.",
      "Drive elbows downwards and backwards into your back pockets.",
      "Slowly allow the bar to raise back up to full stretch overhead."
    ]),
    tips: JSON.stringify([
      "Think of your hands as hooks; pull with your elbows.",
      "Feel the stretch at the top without allowing shoulders to shrug violently."
    ]),
    mistakes: JSON.stringify([
      "Leaning back excessively and swinging torso to move the weight.",
      "Pulling the bar behind the neck, causing cervical stress."
    ])
  },
  {
    id: "seated-row",
    name: "Seated Cable Row",
    category: "Back",
    muscleGroup: "Mid Back & Rhomboids",
    equipment: "Cable",
    difficulty: "Beginner",
    description: "Develops mid-back thickness, posture, and scapular retraction using a close-grip V-handle.",
    sets: 3,
    reps: "10-12",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/GZbfZ033f74",
    animationType: "seated-row",
    muscles: JSON.stringify(["Rhomboids", "Middle Trapezius", "Lats", "Biceps"]),
    instructions: JSON.stringify([
      "Sit with knees slightly bent and feet placed on the foot platforms.",
      "Reach forward to grab the V-handle, keeping spine upright and chest puffed.",
      "Pull handle towards your belly button while driving elbows back.",
      "Pinch shoulder blades together tightly for 1 second at full contraction.",
      "Return the weight smoothly under control."
    ]),
    tips: JSON.stringify([
      "Keep torso stationary and do not rock back and forth.",
      "Keep shoulders depressed away from your ears."
    ]),
    mistakes: JSON.stringify([
      "Using torso momentum to pull the weight.",
      "Rounding upper back during the eccentric phase."
    ])
  },
  {
    id: "dumbbell-row",
    name: "Single-Arm Dumbbell Row",
    category: "Back",
    muscleGroup: "Lats & Upper Back",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    description: "Unilateral pulling movement that fixes muscular imbalances and enhances full lat contraction.",
    sets: 3,
    reps: "10-12",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/pYcpY20QaE8",
    animationType: "dumbbell-row",
    muscles: JSON.stringify(["Lats", "Rhomboids", "Biceps", "Core"]),
    instructions: JSON.stringify([
      "Place one knee and hand on a flat bench for support.",
      "Hold dumbbell in opposite hand, arm hanging straight down.",
      "Pull dumbbell up towards your hip crease, keeping elbow tucked.",
      "Lower dumbbell slowly to feel a deep stretch in the lat."
    ]),
    tips: JSON.stringify([
      "Pull towards hip, not towards shoulder.",
      "Avoid twisting your torso open at the top."
    ]),
    mistakes: JSON.stringify([
      "Rotating torso to yank the weight.",
      "Letting the shoulder drop completely out of socket."
    ])
  },
  {
    id: "pull-ups",
    name: "Overhand Pull-Ups",
    category: "Back",
    muscleGroup: "Lats & Biceps",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    description: "The quintessential test of upper body relative strength and back vertical pulling power.",
    sets: 3,
    reps: "6-10",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
    animationType: "pull-up",
    muscles: JSON.stringify(["Lats", "Biceps", "Upper Back", "Grip"]),
    instructions: JSON.stringify([
      "Grip the pull-up bar with overhand grip slightly wider than shoulders.",
      "Hang at full arm extension with scapulae engaged.",
      "Pull yourself upward by driving elbows down until chin clears the bar.",
      "Lower under control back to a full dead hang."
    ]),
    tips: JSON.stringify([
      "Engage your core to avoid swinging or kicking legs.",
      "Focus on chest to bar rather than merely reaching with your chin."
    ]),
    mistakes: JSON.stringify([
      "Kipping or flailing legs for momentum.",
      "Cutting the range of motion short at top or bottom."
    ])
  },

  // SHOULDERS
  {
    id: "overhead-press",
    name: "Barbell Overhead Press",
    category: "Shoulders",
    muscleGroup: "Deltoids",
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: "Strict vertical barbell press that builds wide cannonball shoulders and core rigidity.",
    sets: 4,
    reps: "6-8",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
    animationType: "overhead-press",
    muscles: JSON.stringify(["Anterior Deltoid", "Lateral Deltoid", "Triceps", "Upper Traps"]),
    instructions: JSON.stringify([
      "Rest the barbell across your clavicles with an overhand grip outside shoulders.",
      "Brace core, squeeze glutes, and tilt head slightly back to clear bar path.",
      "Press barbell straight overhead to full lockout.",
      "Bring head forward through the 'window' of your arms at lockout.",
      "Lower the bar under control back to your upper chest."
    ]),
    tips: JSON.stringify([
      "Keep forearms vertical directly under the bar.",
      "Keep glutes squeezed tight to prevent lower back hyperextension."
    ]),
    mistakes: JSON.stringify([
      "Leaning back excessively into an improvised incline press.",
      "Using knee dip to launch weight (that is a push press, not strict press)."
    ])
  },
  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    muscleGroup: "Lateral Deltoids",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: "The primary isolation exercise for creating boulder shoulders and upper body width.",
    sets: 4,
    reps: "12-15",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo",
    animationType: "lateral-raise",
    muscles: JSON.stringify(["Lateral Deltoid", "Trapezius"]),
    instructions: JSON.stringify([
      "Stand holding dumbbells at your sides with palms facing inward.",
      "Maintain a soft bend in elbows and a very slight forward torso hinge.",
      "Raise arms out to sides in scapular plane until parallel to floor.",
      "Pause for half a second at peak, then lower smoothly."
    ]),
    tips: JSON.stringify([
      "Lead with your elbows rather than wrists.",
      "Imagine pouring water out of pitchers at the top."
    ]),
    mistakes: JSON.stringify([
      "Using swinging body English to heave heavy weights up.",
      "Raising arms way above shoulder height, pinching rotator cuff."
    ])
  },
  {
    id: "face-pull",
    name: "Rope Cable Face Pull",
    category: "Shoulders",
    muscleGroup: "Rear Deltoids & Rotator Cuff",
    equipment: "Cable",
    difficulty: "Beginner",
    description: "Essential postural and shoulder longevity exercise targeting the posterior deltoid and external rotators.",
    sets: 3,
    reps: "15",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk",
    animationType: "face-pull",
    muscles: JSON.stringify(["Rear Delts", "Infraspinatus", "Teres Minor", "Rhomboids"]),
    instructions: JSON.stringify([
      "Set cable pulley at upper-chest height with rope attachment.",
      "Grip rope ends with thumbs pointing back towards you.",
      "Step back and pull rope directly towards your eyes/forehead.",
      "Flare elbows out wide and externally rotate wrists at end of pull."
    ]),
    tips: JSON.stringify([
      "Separate the rope handles widely as you pull.",
      "Focus on mind-muscle contraction rather than high weight."
    ]),
    mistakes: JSON.stringify([
      "Pulling downwards to chest like a row.",
      "Jerking torso backwards."
    ])
  },
  {
    id: "arnold-press",
    name: "Arnold Dumbbell Press",
    category: "Shoulders",
    muscleGroup: "Complete Deltoids",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    description: "Rotational dumbbell press that activates anterior and lateral deltoid fibers through complete arc.",
    sets: 3,
    reps: "10-12",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/3ml7BH7mNwQ",
    animationType: "arnold-press",
    muscles: JSON.stringify(["Anterior Deltoids", "Lateral Deltoids", "Triceps"]),
    instructions: JSON.stringify([
      "Sit on bench with dumbbells held at chin level, palms facing your chest.",
      "As you press overhead, rotate your wrists so palms face forward at top.",
      "Reverse rotation on way down, returning to chin-level start position."
    ]),
    tips: JSON.stringify([
      "Perform the rotation smoothly during the upward press motion.",
      "Control the descent completely."
    ]),
    mistakes: JSON.stringify([
      "Rotating too early before pressing upward.",
      "Arching lower back off the backrest."
    ])
  },

  // LEGS
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    category: "Legs",
    muscleGroup: "Quadriceps & Glutes",
    equipment: "Barbell",
    difficulty: "Advanced",
    description: "The fundamental compound lift for lower-body hypertrophy, explosive athletic power, and bone density.",
    sets: 4,
    reps: "6-8",
    restSeconds: 120,
    thumbnailUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/bEv6CCg2BC8",
    animationType: "squat",
    muscles: JSON.stringify(["Quadriceps", "Gluteus Maximus", "Adductors", "Core"]),
    instructions: JSON.stringify([
      "Position bar across upper trapezius muscle with shoulder-width grip.",
      "Step back with feet shoulder-width apart, toes angled slightly out.",
      "Hinge hips back and bend knees, tracking knees in line with toes.",
      "Descend until hip crease is below top of knees (parallel or below).",
      "Drive through mid-foot to stand back up powerfully."
    ]),
    tips: JSON.stringify([
      "Keep chest tall and maintain rigid abdominal pressure.",
      "Push knees outward to prevent valgus collapse."
    ]),
    mistakes: JSON.stringify([
      "Knees caving inward during ascent.",
      "Rising on toes and letting heels leave floor."
    ])
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift (RDL)",
    category: "Legs",
    muscleGroup: "Hamstrings & Glutes",
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: "Pure hip-hinge exercise producing deep hamstring stretch and glute hypertrophy.",
    sets: 3,
    reps: "8-10",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/JCXUYuzwNrM",
    animationType: "rdl",
    muscles: JSON.stringify(["Hamstrings", "Gluteus Maximus", "Erector Spinae"]),
    instructions: JSON.stringify([
      "Hold barbell at hips with overhand grip and soft bend in knees.",
      "Push hips backward as if touching a wall behind you.",
      "Lower bar down close along your shins until hamstrings feel fully stretched.",
      "Contract glutes and hamstrings to return to standing position."
    ]),
    tips: JSON.stringify([
      "Keep barbell in contact with legs the entire time.",
      "Do not squat; the knees remain at the same slight bend throughout."
    ]),
    mistakes: JSON.stringify([
      "Rounding lumbar spine when lowering bar.",
      "Bending knees excessively into a squat."
    ])
  },
  {
    id: "leg-press",
    name: "45-Degree Leg Press",
    category: "Legs",
    muscleGroup: "Quadriceps",
    equipment: "Machine",
    difficulty: "Beginner",
    description: "Heavy quad and glute loading without spinal compressive fatigue.",
    sets: 4,
    reps: "10-12",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1584466977772-e5992b8b311a?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/IZxyjW7MPJQ",
    animationType: "leg-press",
    muscles: JSON.stringify(["Quadriceps", "Glutes", "Hamstrings"]),
    instructions: JSON.stringify([
      "Sit in machine with back firmly against pad and feet hip-width on sled.",
      "Disengage safety levers and slowly lower sled until knees reach 90 degrees.",
      "Drive sled upward through entire foot without locking knees violently."
    ]),
    tips: JSON.stringify([
      "Never lock out knees completely at top.",
      "Keep lower back flat against back pad; do not let butt lift."
    ]),
    mistakes: JSON.stringify([
      "Letting pelvis tuck under and lower back round at bottom of stroke.",
      "Hyperextending knees at full extension."
    ])
  },
  {
    id: "walking-lunges",
    name: "Dumbbell Walking Lunges",
    category: "Legs",
    muscleGroup: "Quads & Glutes",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    description: "Dynamic unilateral leg movement that torches quadriceps, glutes, and builds unilateral coordination.",
    sets: 3,
    reps: "12 per leg",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/L8fvypPrzzs",
    animationType: "lunge",
    muscles: JSON.stringify(["Quadriceps", "Glutes", "Calves", "Core"]),
    instructions: JSON.stringify([
      "Hold a pair of dumbbells at sides with tall upright torso.",
      "Take an exaggerated step forward and sink down until back knee kisses floor.",
      "Drive through lead heel to rise and step smoothly into the next lunge."
    ]),
    tips: JSON.stringify([
      "Keep torso upright and brace core.",
      "Front shin should remain nearly vertical at bottom of stride."
    ]),
    mistakes: JSON.stringify([
      "Taking strides that are too short, causing front knee to shoot past toes excessively.",
      "Collapsing torso forward onto lead thigh."
    ])
  },
  {
    id: "standing-calf-raise",
    name: "Standing Calf Raise",
    category: "Legs",
    muscleGroup: "Gastrocnemius & Soleus",
    equipment: "Machine",
    difficulty: "Beginner",
    description: "Targets calf muscle heads through full ankle plantar flexion and deep dorsiflexion stretch.",
    sets: 4,
    reps: "15-20",
    restSeconds: 45,
    thumbnailUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/-M4-G8p8fmc",
    animationType: "calf-raise",
    muscles: JSON.stringify(["Gastrocnemius", "Soleus"]),
    instructions: JSON.stringify([
      "Stand with balls of feet on platform and shoulder pads adjusted securely.",
      "Lower heels down as deep as possible to feel full calf stretch.",
      "Press through balls of big toes to rise to highest possible calf contraction.",
      "Hold peak contraction for 1 full second before descending."
    ]),
    tips: JSON.stringify([
      "Do not bounce at the bottom.",
      "Pause at bottom stretch for 1 second to eliminate Achilles tendon reflex."
    ]),
    mistakes: JSON.stringify([
      "Rapid bouncing without muscular control.",
      "Bending knees to assist the lift."
    ])
  },

  // BICEPS
  {
    id: "barbell-curl",
    name: "Standing Barbell Bicep Curl",
    category: "Biceps",
    muscleGroup: "Biceps Brachii",
    equipment: "Barbell",
    difficulty: "Beginner",
    description: "The classic mass builder for biceps peak and arm thickness.",
    sets: 3,
    reps: "10-12",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/ykJmrZ5v0Oo",
    animationType: "bicep-curl",
    muscles: JSON.stringify(["Biceps Brachii", "Brachialis", "Forearms"]),
    instructions: JSON.stringify([
      "Hold barbell with underhand shoulder-width grip, arms extended at thighs.",
      "Pin elbows against sides of ribcage.",
      "Curl bar upward in arc toward shoulders, squeezing biceps hard at peak.",
      "Lower bar slowly under complete resistance back to full stretch."
    ]),
    tips: JSON.stringify([
      "Keep upper arms stationary; do not let elbows drift forward.",
      "Do not lean back or swing hips."
    ]),
    mistakes: JSON.stringify([
      "Swinging lower back to heave the barbell up.",
      "Dropping weight quickly on eccentric phase."
    ])
  },
  {
    id: "incline-dumbbell-curl",
    name: "Incline Dumbbell Curl",
    category: "Biceps",
    muscleGroup: "Long Head of Biceps",
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    description: "Maximizes long head stretch of the biceps by placing shoulders into passive hyperextension.",
    sets: 3,
    reps: "10-12",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/soxrZlIl35U",
    animationType: "incline-curl",
    muscles: JSON.stringify(["Biceps Long Head", "Brachialis"]),
    instructions: JSON.stringify([
      "Sit back on bench set at 45-60 degree incline.",
      "Let dumbbells hang straight down behind torso.",
      "Curl dumbbells upward while supinating wrists so palms face shoulders at top.",
      "Lower under control feeling extreme stretch in long head."
    ]),
    tips: JSON.stringify([
      "Keep shoulders pinned to bench backrest.",
      "Do not let elbows migrate forward during curl."
    ]),
    mistakes: JSON.stringify([
      "Using bench angle that is too steep or lifting head off pad.",
      "Curling with internally rotated shoulders."
    ])
  },
  {
    id: "hammer-curl",
    name: "Dumbbell Hammer Curl",
    category: "Biceps",
    muscleGroup: "Brachialis & Brachioradialis",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: "Neutral-grip curl that adds thick arm width and forearm mass by heavily loading the brachialis.",
    sets: 3,
    reps: "10-12",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/zC3nLlEvin4",
    animationType: "hammer-curl",
    muscles: JSON.stringify(["Brachialis", "Brachioradialis", "Biceps"]),
    instructions: JSON.stringify([
      "Stand tall holding dumbbells with palms facing each other (neutral grip).",
      "Curl weights upward while keeping palms facing inward throughout.",
      "Squeeze peak forearm and outer arm contraction.",
      "Lower smoothly to starting position."
    ]),
    tips: JSON.stringify([
      "Can be performed alternating or both arms together.",
      "Maintain neutral wrist alignment without bending backwards."
    ]),
    mistakes: JSON.stringify([
      "Swinging elbows backwards and forwards.",
      "Using momentum to swing weights up."
    ])
  },

  // TRICEPS
  {
    id: "tricep-pushdown",
    name: "Rope Tricep Cable Pushdown",
    category: "Triceps",
    muscleGroup: "Lateral & Medial Head of Triceps",
    equipment: "Cable",
    difficulty: "Beginner",
    description: "Constant cable tension targeting triceps with end-range abduction flare for lateral head peak.",
    sets: 4,
    reps: "12-15",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU",
    animationType: "tricep-pushdown",
    muscles: JSON.stringify(["Lateral Triceps", "Medial Triceps", "Long Head"]),
    instructions: JSON.stringify([
      "Attach rope to high pulley. Stand with slight forward torso lean.",
      "Lock elbows at sides of ribs with forearms parallel to ground.",
      "Push rope down forcefully until arms lock out completely.",
      "Spread rope ends apart at bottom for peak contraction.",
      "Return slowly to 90-degree elbow bend."
    ]),
    tips: JSON.stringify([
      "Upper arms should remain glued in place throughout.",
      "Do not let shoulders roll forward as you push."
    ]),
    mistakes: JSON.stringify([
      "Letting elbows flare forward and back, turning pushdown into a chest press.",
      "Not achieving complete elbow lockout at bottom."
    ])
  },
  {
    id: "skull-crushers",
    name: "Lying EZ-Bar Skull Crushers",
    category: "Triceps",
    muscleGroup: "Long Head of Triceps",
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: "Isolates long head of triceps from deep stretch position behind the crown of the head.",
    sets: 3,
    reps: "10-12",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/d_KZxkY_0cM",
    animationType: "skull-crusher",
    muscles: JSON.stringify(["Triceps Long Head", "Triceps Lateral Head"]),
    instructions: JSON.stringify([
      "Lie on flat bench holding EZ-bar with narrow overhand grip.",
      "Angle arms back roughly 15 degrees from vertical towards your head.",
      "Bending only at elbows, lower bar down towards hairline or crown of head.",
      "Extend forearms back to start position while keeping upper arms fixed."
    ]),
    tips: JSON.stringify([
      "Angling arms back keeps continuous tension on triceps at top.",
      "Use EZ bar to reduce wrist and elbow joint strain."
    ]),
    mistakes: JSON.stringify([
      "Flaring elbows wide open.",
      "Moving upper arms during the movement."
    ])
  },
  {
    id: "overhead-dumbbell-extension",
    name: "Overhead Dumbbell Tricep Extension",
    category: "Triceps",
    muscleGroup: "Triceps Long Head",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    description: "Places long head of triceps in fully stretched position overhead for maximum hypertrophy.",
    sets: 3,
    reps: "10-12",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/Q0P_w6uG5jE",
    animationType: "overhead-extension",
    muscles: JSON.stringify(["Triceps Long Head"]),
    instructions: JSON.stringify([
      "Sit on short-backed bench holding one heavy dumbbell vertically overhead with both hands cup-gripped under top plate.",
      "Lower dumbbell smoothly behind your head until forearms hit biceps.",
      "Drive dumbbell straight back up overhead until arms extend completely."
    ]),
    tips: JSON.stringify([
      "Keep elbows pointing forward as much as anatomy allows.",
      "Keep core braced and spine neutral."
    ]),
    mistakes: JSON.stringify([
      "Allowing elbows to flare excessively wide.",
      "Arching lower back into hyperextension."
    ])
  },

  // CORE
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: "Core",
    muscleGroup: "Lower Rectus Abdominis",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    description: "Premier core movement that pulls pelvis up into posterior tilt to scorch lower abdominals.",
    sets: 3,
    reps: "12-15",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/Pr1ieGZ5atk",
    animationType: "hanging-leg-raise",
    muscles: JSON.stringify(["Lower Abdominals", "Hip Flexors", "Obliques", "Grip"]),
    instructions: JSON.stringify([
      "Hang from pull-up bar with overhand grip and dead hang shoulder engagement.",
      "Brace core and raise legs straight in front until parallel with floor or higher.",
      "Tilt pelvis up towards ribcage to ensure abdominal contraction, not just hip flexors.",
      "Lower legs slowly without swinging body."
    ]),
    tips: JSON.stringify([
      "Think about rolling your pelvis up toward your chest.",
      "Bend knees if straight leg raise causes lower back strain or swinging."
    ]),
    mistakes: JSON.stringify([
      "Swinging body wildly to kick legs up.",
      "Only moving at hips without curling pelvis upward."
    ])
  },
  {
    id: "plank",
    name: "Forearm Plank",
    category: "Core",
    muscleGroup: "Transverse Abdominis & Deep Core",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    description: "Isometric core stability exercise that reinforces spinal rigidity and posture.",
    sets: 3,
    reps: "45-60 sec",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
    animationType: "plank",
    muscles: JSON.stringify(["Transverse Abdominis", "Rectus Abdominis", "Glutes", "Shoulders"]),
    instructions: JSON.stringify([
      "Rest on forearms with elbows placed directly below shoulders.",
      "Extend legs behind with balls of feet on floor.",
      "Form a rigid straight line from heels to head.",
      "Actively pull elbows towards toes and squeeze glutes to maximize tension."
    ]),
    tips: JSON.stringify([
      "Breathe steadily from diaphragm without holding breath.",
      "Do not let shoulder blades collapse inward; push floor away."
    ]),
    mistakes: JSON.stringify([
      "Hips sagging down toward floor.",
      "Piking butt up into the air."
    ])
  },
  {
    id: "cable-woodchopper",
    name: "Cable Woodchopper",
    category: "Core",
    muscleGroup: "Obliques & Rotational Core",
    equipment: "Cable",
    difficulty: "Intermediate",
    description: "Rotational powerhouse exercise training athletic torso power and functional oblique stability.",
    sets: 3,
    reps: "12 per side",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/pAplQXk3dkU",
    animationType: "woodchopper",
    muscles: JSON.stringify(["External Obliques", "Internal Obliques", "Transverse Abdominis"]),
    instructions: JSON.stringify([
      "Set cable pulley at high position. Stand sideways to machine holding handle with both hands.",
      "Pull handle diagonally down across body toward opposite hip while rotating torso.",
      "Pivot back foot as you rotate down.",
      "Slowly control the handle back up along the diagonal path."
    ]),
    tips: JSON.stringify([
      "Keep arms mostly straight; power originates from abdominal rotation.",
      "Brace core firmly through the full arc."
    ]),
    mistakes: JSON.stringify([
      "Pulling strictly with arms without rotating torso.",
      "Losing control on the return eccentric phase."
    ])
  },
  {
    id: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    category: "Core",
    muscleGroup: "Anti-Extension Core",
    equipment: "Bodyweight",
    difficulty: "Advanced",
    description: "Extreme anti-extension core stimulus that challenges anterior abdominal wall to maximum capacity.",
    sets: 3,
    reps: "8-12",
    restSeconds: 75,
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/rqiTPdK1cWg",
    animationType: "ab-rollout",
    muscles: JSON.stringify(["Rectus Abdominis", "Lats", "Serratus Anterior", "Hip Flexors"]),
    instructions: JSON.stringify([
      "Kneel on mat with hands gripping the ab wheel handles directly under shoulders.",
      "Brace abs into slight posterior pelvic tilt.",
      "Roll wheel forward smoothly as far as you can without hyperextending lower back.",
      "Contract abdominals to pull wheel back under your chest."
    ]),
    tips: JSON.stringify([
      "Never let your lower spine dip into a swayback curve.",
      "Squeeze glutes throughout the full roll."
    ]),
    mistakes: JSON.stringify([
      "Rolling out too far and sagging lumbar spine.",
      "Pulling back with hips first instead of curling core."
    ])
  },
  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    category: "Legs",
    muscleGroup: "Quadriceps & Gluteus Medius",
    equipment: "Dumbbell",
    difficulty: "Advanced",
    description: "Brutal unilateral leg builder that develops exceptional single-leg balance and glute-quad hypertrophy.",
    sets: 3,
    reps: "10 per leg",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/2C-uNgKwPLE",
    animationType: "bulgarian-split-squat",
    muscles: JSON.stringify(["Quadriceps", "Glutes", "Hamstrings", "Core"]),
    instructions: JSON.stringify([
      "Stand 2-3 feet in front of a flat bench. Place top of one foot flat on bench behind you.",
      "Hold dumbbells at sides with tall chest.",
      "Lower rear knee towards floor until front thigh is parallel to ground.",
      "Drive up through front heel to return to top position."
    ]),
    tips: JSON.stringify([
      "Keep torso angled slightly forward to engage glutes.",
      "Most weight should remain over front foot, not rear foot."
    ]),
    mistakes: JSON.stringify([
      "Placing front foot too close to bench, causing front heel to elevate.",
      "Allowing front knee to cave inward."
    ])
  },
  {
    id: "reverse-cable-fly",
    name: "Rear Delt Cable Fly",
    category: "Shoulders",
    muscleGroup: "Posterior Deltoids",
    equipment: "Cable",
    difficulty: "Intermediate",
    description: "Cross-cable isolation for rear shoulder cap definition and scapular balance.",
    sets: 3,
    reps: "12-15",
    restSeconds: 60,
    thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/edwtSEmB3x4",
    animationType: "reverse-cable-fly",
    muscles: JSON.stringify(["Rear Delts", "Infraspinatus", "Rhomboids"]),
    instructions: JSON.stringify([
      "Set dual cables at head height without attachments.",
      "Reach across to grip right cable with left hand and left cable with right hand.",
      "Pull arms back and outward in horizontal plane until hands are in line with shoulders.",
      "Squeeze rear deltoids forcefully, then control return."
    ]),
    tips: JSON.stringify([
      "Keep elbows slightly bent and static.",
      "Do not shrug upper traps."
    ]),
    mistakes: JSON.stringify([
      "Using excessive weight and bending elbows into a row.",
      "Swinging torso."
    ])
  },
  {
    id: "close-grip-bench-press",
    name: "Close-Grip Barbell Bench Press",
    category: "Triceps",
    muscleGroup: "Triceps Brachii",
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: "Heavy compound triceps overload exercise that allows moving maximum poundage.",
    sets: 3,
    reps: "8-10",
    restSeconds: 90,
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://www.youtube.com/embed/nEF0bv2FW94",
    animationType: "close-grip-bench",
    muscles: JSON.stringify(["Triceps", "Chest", "Front Deltoids"]),
    instructions: JSON.stringify([
      "Lie on bench and grip bar shoulder-width apart (wrists directly above shoulders).",
      "Unrack bar and tuck elbows close to ribs at 30 degrees.",
      "Lower bar to lower chest / upper abs.",
      "Press explosively back up, locking out with triceps."
    ]),
    tips: JSON.stringify([
      "Grip should not be excessively narrow; shoulder-width is optimal to save wrists.",
      "Keep elbows tucked tightly to ribs."
    ]),
    mistakes: JSON.stringify([
      "Placing hands 4 inches apart (wrecks wrists and limits strength).",
      "Flaring elbows outward."
    ])
  }
];


const weeklyPlans = [
  {
    id: "monday",
    dayOfWeek: "Monday",
    shortDay: "MON",
    title: "Push Day",
    focus: "Chest • Shoulders • Triceps",
    description: "Build upper-body pushing strength and muscular density with compound pressing and isolation finishes.",
    duration: "45 min",
    targetCalories: 320,
    type: "Workout",
    exercises: [
      { exerciseId: "bench-press", orderIndex: 0, sets: 4, reps: "8-10", restSeconds: 90 },
      { exerciseId: "incline-dumbbell-press", orderIndex: 1, sets: 3, reps: "10-12", restSeconds: 75 },
      { exerciseId: "cable-fly", orderIndex: 2, sets: 3, reps: "12-15", restSeconds: 60 },
      { exerciseId: "overhead-press", orderIndex: 3, sets: 3, reps: "8-10", restSeconds: 90 },
      { exerciseId: "lateral-raise", orderIndex: 4, sets: 4, reps: "12-15", restSeconds: 60 },
      { exerciseId: "tricep-pushdown", orderIndex: 5, sets: 4, reps: "12-15", restSeconds: 60 }
    ]
  },
  {
    id: "tuesday",
    dayOfWeek: "Tuesday",
    shortDay: "TUE",
    title: "Pull Day",
    focus: "Back • Biceps • Rear Delts",
    description: "Train back thickness, lat width, and arm peak with vertical and horizontal pulling movements.",
    duration: "45 min",
    targetCalories: 310,
    type: "Workout",
    exercises: [
      { exerciseId: "lat-pulldown", orderIndex: 0, sets: 4, reps: "10-12", restSeconds: 75 },
      { exerciseId: "seated-row", orderIndex: 1, sets: 3, reps: "10-12", restSeconds: 75 },
      { exerciseId: "dumbbell-row", orderIndex: 2, sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseId: "face-pull", orderIndex: 3, sets: 3, reps: "15", restSeconds: 60 },
      { exerciseId: "barbell-curl", orderIndex: 4, sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseId: "hammer-curl", orderIndex: 5, sets: 3, reps: "10-12", restSeconds: 60 }
    ]
  },
  {
    id: "wednesday",
    dayOfWeek: "Wednesday",
    shortDay: "WED",
    title: "Leg Day",
    focus: "Quads • Hamstrings • Calves",
    description: "Heavy lower body strength session targeting quadriceps, posterior chain, and calves.",
    duration: "50 min",
    targetCalories: 380,
    type: "Workout",
    exercises: [
      { exerciseId: "barbell-squat", orderIndex: 0, sets: 4, reps: "6-8", restSeconds: 120 },
      { exerciseId: "romanian-deadlift", orderIndex: 1, sets: 3, reps: "8-10", restSeconds: 90 },
      { exerciseId: "leg-press", orderIndex: 2, sets: 4, reps: "10-12", restSeconds: 90 },
      { exerciseId: "walking-lunges", orderIndex: 3, sets: 3, reps: "12 per leg", restSeconds: 75 },
      { exerciseId: "standing-calf-raise", orderIndex: 4, sets: 4, reps: "15-20", restSeconds: 45 }
    ]
  },
  {
    id: "thursday",
    dayOfWeek: "Thursday",
    shortDay: "THU",
    title: "Shoulders & Core",
    focus: "Deltoids • Abs • Rotational Strength",
    description: "Sculpt shoulder 3D caps and reinforce 360-degree core rigidity and rotational stability.",
    duration: "40 min",
    targetCalories: 280,
    type: "Workout",
    exercises: [
      { exerciseId: "overhead-press", orderIndex: 0, sets: 4, reps: "6-8", restSeconds: 90 },
      { exerciseId: "arnold-press", orderIndex: 1, sets: 3, reps: "10-12", restSeconds: 75 },
      { exerciseId: "lateral-raise", orderIndex: 2, sets: 4, reps: "12-15", restSeconds: 60 },
      { exerciseId: "hanging-leg-raise", orderIndex: 3, sets: 3, reps: "12-15", restSeconds: 60 },
      { exerciseId: "plank", orderIndex: 4, sets: 3, reps: "45-60 sec", restSeconds: 60 },
      { exerciseId: "cable-woodchopper", orderIndex: 5, sets: 3, reps: "12 per side", restSeconds: 60 }
    ]
  },
  {
    id: "friday",
    dayOfWeek: "Friday",
    shortDay: "FRI",
    title: "Chest & Back Super Split",
    focus: "Antagonist Hypertrophy",
    description: "High-density antagonist upper body workout alternating chest presses and heavy back rows.",
    duration: "45 min",
    targetCalories: 340,
    type: "Workout",
    exercises: [
      { exerciseId: "bench-press", orderIndex: 0, sets: 4, reps: "8-10", restSeconds: 90 },
      { exerciseId: "barbell-deadlift", orderIndex: 1, sets: 3, reps: "5-6", restSeconds: 120 },
      { exerciseId: "incline-dumbbell-press", orderIndex: 2, sets: 3, reps: "10-12", restSeconds: 75 },
      { exerciseId: "lat-pulldown", orderIndex: 3, sets: 3, reps: "10-12", restSeconds: 75 },
      { exerciseId: "dips-chest", orderIndex: 4, sets: 3, reps: "8-12", restSeconds: 90 },
      { exerciseId: "pull-ups", orderIndex: 5, sets: 3, reps: "6-10", restSeconds: 90 }
    ]
  },
  {
    id: "saturday",
    dayOfWeek: "Saturday",
    shortDay: "SAT",
    title: "Arms & Core",
    focus: "Biceps • Triceps • Deep Core",
    description: "Dedicated arm blasting protocol with superset curls and triceps extensions, paired with ab rollouts.",
    duration: "40 min",
    targetCalories: 290,
    type: "Workout",
    exercises: [
      { exerciseId: "barbell-curl", orderIndex: 0, sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseId: "skull-crushers", orderIndex: 1, sets: 3, reps: "10-12", restSeconds: 75 },
      { exerciseId: "incline-dumbbell-curl", orderIndex: 2, sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseId: "overhead-dumbbell-extension", orderIndex: 3, sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseId: "hammer-curl", orderIndex: 4, sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseId: "ab-wheel-rollout", orderIndex: 5, sets: 3, reps: "8-12", restSeconds: 75 }
    ]
  },
  {
    id: "sunday",
    dayOfWeek: "Sunday",
    shortDay: "SUN",
    title: "Active Recovery & Mobility",
    focus: "Cardio • Stretching • Recovery",
    description: "Rest day to allow muscle fiber supercompensation, hydration replenishment, and light walking/running.",
    duration: "30 min",
    targetCalories: 150,
    type: "Rest",
    exercises: []
  }
];

async function main() {
  console.log("🌱 Starting FITTRACK database seed...");

  // 1. Seed Exercises
  console.log(`📦 Seeding ${exercisesData.length} exercises...`);
  for (const ex of exercisesData) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: ex,
      create: ex
    });
  }

  // 2. Seed Workout Plans
  console.log("📅 Seeding weekly workout plans...");
  for (const plan of weeklyPlans) {
    const { exercises, ...planData } = plan;
    await prisma.workoutPlan.upsert({
      where: { id: planData.id },
      update: planData,
      create: planData
    });

    // Delete existing plan exercises to avoid duplicate relations
    await prisma.workoutPlanExercise.deleteMany({
      where: { workoutPlanId: planData.id }
    });

    for (const ex of exercises) {
      await prisma.workoutPlanExercise.create({
        data: {
          workoutPlanId: planData.id,
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex,
          targetSets: ex.sets,
          targetReps: ex.reps,
          restSeconds: ex.restSeconds
        }
      });
    }
  }

  // 3. Seed Demo User & Profile
  console.log("👤 Seeding demo user (sourav@fittrack.com)...");
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "sourav@fittrack.com" },
    update: {
      name: "Sourav Pandey",
      passwordHash
    },
    create: {
      email: "sourav@fittrack.com",
      name: "Sourav Pandey",
      passwordHash
    }
  });

  await prisma.profile.upsert({
    where: { userId: demoUser.id },
    update: {
      height: 178,
      weight: 74.5,
      fitnessGoal: "Build muscle",
      runningGoal: "10K in under 50 min",
      dailyCalorieTarget: 600,
      bio: "Dedicated athlete tracking gym performance & running endurance with FitTrack."
    },
    create: {
      userId: demoUser.id,
      height: 178,
      weight: 74.5,
      fitnessGoal: "Build muscle",
      runningGoal: "10K in under 50 min",
      dailyCalorieTarget: 600,
      bio: "Dedicated athlete tracking gym performance & running endurance with FitTrack."
    }
  });

  await prisma.userSettings.upsert({
    where: { userId: demoUser.id },
    update: {
      theme: "light",
      units: "metric",
      notifications: true
    },
    create: {
      userId: demoUser.id,
      theme: "light",
      units: "metric",
      notifications: true
    }
  });

  // Seed sample completed workout sessions so dashboard & progress have rich data
  const existingSessions = await prisma.workoutSession.count({ where: { userId: demoUser.id } });
  if (existingSessions === 0) {
    console.log("🏋️ Seeding initial demo workout sessions...");
    const now = new Date();
    
    // Session 1: Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(17, 30, 0, 0);

    const session1 = await prisma.workoutSession.create({
      data: {
        userId: demoUser.id,
        workoutPlanId: "monday",
        title: "Push Day — Chest & Shoulders",
        startedAt: yesterday,
        completedAt: new Date(yesterday.getTime() + 48 * 60 * 1000),
        durationSeconds: 48 * 60,
        caloriesBurned: 340,
        exercisesCompletedCount: 5,
        notes: "Solid bench press session. Felt strong on 80kg top set."
      }
    });

    await prisma.workoutSet.createMany({
      data: [
        { workoutSessionId: session1.id, exerciseId: "bench-press", setNumber: 1, weightKg: 60, reps: 10, completed: true },
        { workoutSessionId: session1.id, exerciseId: "bench-press", setNumber: 2, weightKg: 70, reps: 8, completed: true },
        { workoutSessionId: session1.id, exerciseId: "bench-press", setNumber: 3, weightKg: 80, reps: 6, completed: true },
        { workoutSessionId: session1.id, exerciseId: "incline-dumbbell-press", setNumber: 1, weightKg: 24, reps: 10, completed: true },
        { workoutSessionId: session1.id, exerciseId: "incline-dumbbell-press", setNumber: 2, weightKg: 26, reps: 8, completed: true },
        { workoutSessionId: session1.id, exerciseId: "lateral-raise", setNumber: 1, weightKg: 10, reps: 15, completed: true },
        { workoutSessionId: session1.id, exerciseId: "tricep-pushdown", setNumber: 1, weightKg: 25, reps: 12, completed: true }
      ]
    });

    // Session 2: 3 days ago
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    threeDaysAgo.setHours(18, 0, 0, 0);

    const session2 = await prisma.workoutSession.create({
      data: {
        userId: demoUser.id,
        workoutPlanId: "wednesday",
        title: "Leg Day Heavy Squats",
        startedAt: threeDaysAgo,
        completedAt: new Date(threeDaysAgo.getTime() + 52 * 60 * 1000),
        durationSeconds: 52 * 60,
        caloriesBurned: 395,
        exercisesCompletedCount: 4,
        notes: "Great quad pump and solid RDL hamstring stretch."
      }
    });

    await prisma.workoutSet.createMany({
      data: [
        { workoutSessionId: session2.id, exerciseId: "barbell-squat", setNumber: 1, weightKg: 80, reps: 8, completed: true },
        { workoutSessionId: session2.id, exerciseId: "barbell-squat", setNumber: 2, weightKg: 95, reps: 6, completed: true },
        { workoutSessionId: session2.id, exerciseId: "romanian-deadlift", setNumber: 1, weightKg: 70, reps: 10, completed: true },
        { workoutSessionId: session2.id, exerciseId: "leg-press", setNumber: 1, weightKg: 160, reps: 12, completed: true }
      ]
    });

    // Seed Sample Completed Run with GPS Route Coordinates
    console.log("🏃 Seeding demo run with real GPS coordinates...");
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    twoDaysAgo.setHours(6, 45, 0, 0);

    const sampleRun = await prisma.run.create({
      data: {
        userId: demoUser.id,
        startedAt: twoDaysAgo,
        completedAt: new Date(twoDaysAgo.getTime() + 22 * 60 * 1000 + 41 * 1000),
        durationSeconds: 1361, // 22m 41s
        distanceKm: 3.42,
        avgPace: "6:38",
        caloriesBurned: 222,
        notes: "Morning jog around the park. Crisp morning air, consistent pace throughout."
      }
    });

    // Realistic GPS route around park coordinates
    const baseLat = 28.6139;
    const baseLon = 77.2090;
    const routePointsData = [
      { lat: baseLat, lon: baseLon, speed: 2.4 },
      { lat: baseLat + 0.0012, lon: baseLon + 0.0008, speed: 2.6 },
      { lat: baseLat + 0.0025, lon: baseLon + 0.0019, speed: 2.5 },
      { lat: baseLat + 0.0038, lon: baseLon + 0.0031, speed: 2.7 },
      { lat: baseLat + 0.0042, lon: baseLon + 0.0045, speed: 2.6 },
      { lat: baseLat + 0.0036, lon: baseLon + 0.0062, speed: 2.4 },
      { lat: baseLat + 0.0022, lon: baseLon + 0.0070, speed: 2.5 },
      { lat: baseLat + 0.0008, lon: baseLon + 0.0065, speed: 2.6 },
      { lat: baseLat - 0.0004, lon: baseLon + 0.0051, speed: 2.5 },
      { lat: baseLat - 0.0008, lon: baseLon + 0.0032, speed: 2.6 },
      { lat: baseLat - 0.0003, lon: baseLon + 0.0014, speed: 2.7 },
      { lat: baseLat, lon: baseLon, speed: 2.5 }
    ];

    await prisma.runRoutePoint.createMany({
      data: routePointsData.map((pt, idx) => ({
        runId: sampleRun.id,
        latitude: pt.lat,
        longitude: pt.lon,
        accuracy: 8.5,
        speed: pt.speed,
        pointIndex: idx,
        timestamp: new Date(twoDaysAgo.getTime() + idx * 110 * 1000)
      }))
    });

    // Seed Achievements
    await prisma.achievement.createMany({
      data: [
        {
          userId: demoUser.id,
          type: "FIRST_WORKOUT",
          title: "First Step Taken",
          description: "Logged your first gym workout session in FitTrack.",
          icon: "dumbbell"
        },
        {
          userId: demoUser.id,
          type: "FIRST_RUN",
          title: "Road Warrior",
          description: "Completed your first GPS-tracked outdoor run.",
          icon: "footprints"
        },
        {
          userId: demoUser.id,
          type: "STREAK_3",
          title: "Building Habit",
          description: "Maintained a 3-day active workout streak.",
          icon: "flame"
        }
      ]
    });
  }

  console.log("✅ FITTRACK database seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
