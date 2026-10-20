import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Search,
  Target,
  TimerReset,
  X,
} from "lucide-react";

import { exercises } from "../../data/exercises";
import { workoutPlan } from "../../data/workoutPlan";

import "./Gym.css";

function Gym() {
  const todayIndex = new Date().getDay();
const [selectedDay, setSelectedDay] = useState(
  workoutPlan[todayIndex === 0 ? 6 : todayIndex - 1]
);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // ==============================
  // WORKOUT MODE STATE
  // ==============================

  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutIndex, setWorkoutIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [workoutPaused, setWorkoutPaused] = useState(false);

  const [completedSets, setCompletedSets] = useState<
    Record<string, number>
  >({});

  const [workoutFinished, setWorkoutFinished] = useState(false);

  const categories = [
    "All",
    "Chest",
    "Back",
    "Shoulders",
    "Arms",
    "Legs",
    "Core",
  ];

  // ==============================
  // TODAY'S EXERCISES
  // ==============================

  const todayExercises = useMemo(() => {
    return selectedDay.exercises
      .map((id) => exercises.find((exercise) => exercise.id === id))
      .filter(Boolean);
  }, [selectedDay]);

  const filteredExercises = useMemo(() => {
    return todayExercises.filter((exercise) => {
      if (!exercise) return false;

      const matchesSearch = exercise.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        exercise.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [todayExercises, search, activeCategory]);

  const selectedExercise = exercises.find(
    (exercise) => exercise.id === selectedExerciseId
  );

  // ==============================
  // CURRENT WORKOUT EXERCISE
  // ==============================

  const workoutExercise = todayExercises[workoutIndex];

  // ==============================
  // TIMER
  // ==============================

  useEffect(() => {
    if (
      !workoutActive ||
      workoutPaused ||
      workoutFinished ||
      isResting
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    workoutActive,
    workoutPaused,
    workoutFinished,
    isResting,
  ]);

  // ==============================
  // REST TIMER
  // ==============================

  useEffect(() => {
    if (!isResting || restSeconds <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setRestSeconds((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setIsResting(false);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isResting, restSeconds]);

  // ==============================
  // HELPERS
  // ==============================

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const getRestSeconds = (rest: string) => {
    const match = rest.match(/\d+/);

    if (!match) {
      return 60;
    }

    return Number(match[0]);
  };

  // ==============================
  // START WORKOUT
  // ==============================

  const startWorkout = () => {
    if (selectedDay.type === "Rest" || todayExercises.length === 0) {
      return;
    }

    setWorkoutIndex(0);
    setCurrentSet(1);
    setRestSeconds(0);
    setIsResting(false);
    setElapsedSeconds(0);
    setWorkoutPaused(false);
    setWorkoutFinished(false);
    setCompletedSets({});
    setWorkoutActive(true);
  };

  // ==============================
  // CLOSE WORKOUT
  // ==============================

  const closeWorkout = () => {
    setWorkoutActive(false);
    setWorkoutPaused(false);
    setIsResting(false);
    setRestSeconds(0);
  };

  // ==============================
  // COMPLETE SET
  // ==============================

  const completeSet = () => {
    if (!workoutExercise || isResting) {
      return;
    }

    const exerciseId = workoutExercise.id;

    setCompletedSets((previous) => ({
      ...previous,
      [exerciseId]: (previous[exerciseId] || 0) + 1,
    }));

    // More sets remaining
    if (currentSet < workoutExercise.sets) {
      setCurrentSet((previous) => previous + 1);

      const rest = getRestSeconds(workoutExercise.rest);

      setRestSeconds(rest);
      setIsResting(true);

      return;
    }

    // Last set of current exercise
    if (workoutIndex < todayExercises.length - 1) {
      setWorkoutIndex((previous) => previous + 1);
      setCurrentSet(1);

      return;
    }

    // Last set of final exercise
    setWorkoutFinished(true);
  };

  // ==============================
  // NEXT EXERCISE
  // ==============================

  const nextExercise = () => {
    if (workoutIndex >= todayExercises.length - 1) {
      setWorkoutFinished(true);
      return;
    }

    setWorkoutIndex((previous) => previous + 1);
    setCurrentSet(1);
    setIsResting(false);
    setRestSeconds(0);
  };

  // ==============================
  // PREVIOUS EXERCISE
  // ==============================

  const previousExercise = () => {
    if (workoutIndex <= 0) {
      return;
    }

    setWorkoutIndex((previous) => previous - 1);
    setCurrentSet(1);
    setIsResting(false);
    setRestSeconds(0);
  };

  // ==============================
  // RESET WORKOUT
  // ==============================

  const resetWorkout = () => {
    startWorkout();
  };
  const saveCompletedWorkout = () => {
  const existingWorkouts = JSON.parse(
    localStorage.getItem("fittrack_workouts") || "[]"
  );

  const totalCompletedSets = Object.values(completedSets).reduce(
    (total, sets) => total + sets,
    0
  );

  const workoutRecord = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    workoutName: selectedDay.title,
    workoutType: selectedDay.type,
    duration: elapsedSeconds,
    exercises: selectedDay.exercises.length,
    completedSets: totalCompletedSets,
    calories: selectedDay.calories,
  };

  localStorage.setItem(
    "fittrack_workouts",
    JSON.stringify([...existingWorkouts, workoutRecord])
  );
};

  return (
    <div className="gym-page">

      {/* ============================== */}
      {/* HEADER */}
      {/* ============================== */}

      <header className="gym-header">
        <div>
          <span className="section-label">FITTRACK GYM</span>

          <h1>Your Training Plan</h1>

          <p>
            Build strength. Move better. Stay consistent.
          </p>
        </div>

        <div className="gym-header-badge">
          <Flame size={18} />

          <span>7 day streak</span>
        </div>
      </header>

      {/* ============================== */}
      {/* WEEK SELECTOR */}
      {/* ============================== */}

      <section className="week-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              WEEKLY SPLIT
            </span>

            <h2>Choose your training day</h2>
          </div>

          <CalendarDays size={22} />

        </div>

        <div className="week-selector">

          {workoutPlan.map((day) => (

            <button
              key={day.id}
              className={`day-card ${
                selectedDay.id === day.id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedDay(day);
                setSearch("");
                setActiveCategory("All");
              }}
            >

              <span className="day-name">
                {day.shortDay}
              </span>

              <span className="day-title">
                {day.type === "Rest"
                  ? "Rest"
                  : day.title.replace(" Day", "")}
              </span>

              {selectedDay.id === day.id && (
                <span className="day-active-dot" />
              )}

            </button>

          ))}

        </div>

      </section>

      {/* ============================== */}
      {/* TODAY'S WORKOUT */}
      {/* ============================== */}

      <section className="workout-hero">

        <div className="workout-hero-content">

          <span className="hero-kicker">
            {selectedDay.type === "Rest"
              ? "RECOVERY"
              : "TODAY'S WORKOUT"}
          </span>

          <h2>{selectedDay.title}</h2>

          <p className="hero-focus">
            {selectedDay.focus}
          </p>

          <p className="hero-description">
            {selectedDay.description}
          </p>

          <div className="hero-stats">

            <div className="hero-stat">
              <Clock3 size={19} />

              <div>
                <strong>
                  {selectedDay.duration}
                </strong>

                <span>Duration</span>
              </div>
            </div>

            <div className="hero-stat">
              <Dumbbell size={19} />

              <div>
                <strong>
                  {selectedDay.exercises.length}
                </strong>

                <span>Exercises</span>
              </div>
            </div>

            <div className="hero-stat">
              <Flame size={19} />

              <div>
                <strong>
                  {selectedDay.calories}
                </strong>

                <span>Calories</span>
              </div>
            </div>

          </div>

          {selectedDay.type !== "Rest" && (

            <button
              className="start-workout-btn"
              onClick={startWorkout}
            >

              <Play
                size={18}
                fill="currentColor"
              />

              Start Workout

              <ArrowRight size={18} />

            </button>

          )}

        </div>

        <div className="hero-visual">

          <div className="hero-circle hero-circle-one" />

          <div className="hero-circle hero-circle-two" />

          <div className="hero-figure">
            <Dumbbell
              size={74}
              strokeWidth={1.3}
            />
          </div>

          <div className="hero-floating-card">

            <Target size={18} />

            <div>

              <strong>
                {selectedDay.type === "Rest"
                  ? "Recovery"
                  : "Focus"}
              </strong>

              <span>
                {selectedDay.focus.split(" • ")[0]}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ============================== */}
      {/* EXERCISE LIBRARY */}
      {/* ============================== */}

      {selectedDay.type !== "Rest" && (

        <section className="exercise-section">

          <div className="section-heading exercise-heading">

            <div>

              <span className="section-label">
                EXERCISE LIBRARY
              </span>

              <h2>Today's Exercises</h2>

            </div>

            <span className="exercise-count">
              {filteredExercises.length} exercises
            </span>

          </div>

          {/* SEARCH */}

          <div className="gym-controls">

            <div className="gym-search">

              <Search size={19} />

              <input
                type="text"
                placeholder="Search today's exercises..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (

                <button
                  onClick={() => setSearch("")}
                >
                  <X size={17} />
                </button>

              )}

            </div>

            <div className="category-filters">

              {categories.map((category) => (

                <button
                  key={category}
                  className={
                    activeCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                >
                  {category}
                </button>

              ))}

            </div>

          </div>

          {/* EXERCISE CARDS */}

          <div className="exercise-grid">

            {filteredExercises.map((exercise) => {

              if (!exercise) {
                return null;
              }

              return (

                <article
                  className="exercise-card"
                  key={exercise.id}
                >

                  <div className="exercise-media">

                    <video
                      src={exercise.animation}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />

                    <div className="video-overlay">

                      <span>

                        <Play
                          size={14}
                          fill="currentColor"
                        />

                        DEMO

                      </span>

                    </div>

                    <div className="difficulty-badge">
                      {exercise.difficulty}
                    </div>

                  </div>

                  <div className="exercise-card-body">

                    <div className="exercise-topline">

                      <span>
                        {exercise.category}
                      </span>

                      <span>
                        {exercise.equipment}
                      </span>

                    </div>

                    <h3>
                      {exercise.name}
                    </h3>

                    <div className="muscle-tags">

                      {exercise.muscles
                        .slice(0, 3)
                        .map((muscle) => (

                          <span key={muscle}>
                            {muscle}
                          </span>

                        ))}

                    </div>

                    <div className="exercise-details">

                      <div>
                        <strong>
                          {exercise.sets}
                        </strong>

                        <span>Sets</span>
                      </div>

                      <div>
                        <strong>
                          {exercise.reps}
                        </strong>

                        <span>Reps</span>
                      </div>

                      <div>
                        <strong>
                          {exercise.rest}
                        </strong>

                        <span>Rest</span>
                      </div>

                    </div>

                    <button
                      className="view-form-btn"
                      onClick={() =>
                        setSelectedExerciseId(
                          exercise.id
                        )
                      }
                    >

                      View Correct Form

                      <ArrowRight size={17} />

                    </button>

                  </div>

                </article>

              );

            })}

          </div>

          {filteredExercises.length === 0 && (

            <div className="empty-exercises">

              <Search size={34} />

              <h3>No exercises found</h3>

              <p>
                Try another search or choose a
                different category.
              </p>

            </div>

          )}

        </section>

      )}

      {/* ============================== */}
      {/* REST DAY */}
      {/* ============================== */}

      {selectedDay.type === "Rest" && (

        <section className="rest-card">

          <div className="rest-icon">
            <span>🧘</span>
          </div>

          <div>

            <span className="section-label">
              RECOVERY DAY
            </span>

            <h2>
              Your body needs recovery too.
            </h2>

            <p>
              Take today to rest, hydrate, sleep
              well and prepare for your next
              training session.
            </p>

          </div>

        </section>

      )}

      {/* ============================== */}
      {/* EXERCISE DETAIL MODAL */}
      {/* ============================== */}

      {selectedExercise && (

        <div
          className="exercise-modal-backdrop"
          onClick={() =>
            setSelectedExerciseId(null)
          }
        >

          <div
            className="exercise-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedExerciseId(null)
              }
            >
              <X size={22} />
            </button>

            <div className="modal-video">

              <video
                src={selectedExercise.animation}
                autoPlay
                loop
                muted
                playsInline
                controls
              />

            </div>

            <div className="modal-content">

              <div className="modal-title-row">

                <div>

                  <span className="section-label">
                    {selectedExercise.category}
                  </span>

                  <h2>
                    {selectedExercise.name}
                  </h2>

                </div>

                <span className="modal-difficulty">
                  {selectedExercise.difficulty}
                </span>

              </div>

              <div className="modal-meta">

                <span>
                  <Dumbbell size={16} />
                  {selectedExercise.equipment}
                </span>

                <span>
                  <Target size={16} />
                  {selectedExercise.muscles.join(
                    " • "
                  )}
                </span>

              </div>

              <div className="modal-columns">

                <div>

                  <h3>How to perform</h3>

                  <ol className="instruction-list">

                    {selectedExercise.instructions.map(
                      (instruction, index) => (

                        <li key={instruction}>

                          <span>
                            {index + 1}
                          </span>

                          <p>
                            {instruction}
                          </p>

                        </li>

                      )
                    )}

                  </ol>

                </div>

                <div>

                  <div className="form-box">

                    <h3>
                      ✓ Form Tips
                    </h3>

                    <ul>

                      {selectedExercise.tips.map(
                        (tip) => (
                          <li key={tip}>
                            {tip}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                  <div className="mistake-box">

                    <h3>
                      ⚠ Common Mistakes
                    </h3>

                    <ul>

                      {selectedExercise.mistakes.map(
                        (mistake) => (
                          <li key={mistake}>
                            {mistake}
                          </li>
                        )
                      )}

                    </ul>

                  </div>

                </div>

              </div>

              <div className="modal-bottom">

                <div>

                  <strong>
                    {selectedExercise.sets} ×{" "}
                    {selectedExercise.reps}
                  </strong>

                  <span>
                    Rest {selectedExercise.rest}
                    between working sets
                  </span>

                </div>

                <button
                  className="modal-start-btn"
                  onClick={() =>
                    setSelectedExerciseId(null)
                  }
                >

                  <Play
                    size={17}
                    fill="currentColor"
                  />

                  Got It

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ================================================== */}
      {/* WORKOUT MODE */}
      {/* ================================================== */}

      {workoutActive && workoutExercise && (

        <div className="workout-mode-backdrop">

          <div className="workout-mode">

            {/* WORKOUT HEADER */}

            <div className="workout-mode-header">

              <button
                className="workout-back-btn"
                onClick={closeWorkout}
              >
                <ArrowLeft size={20} />

                Exit Workout
              </button>

              <div className="workout-mode-title">

                <span>NOW TRAINING</span>

                <strong>
                  {selectedDay.title}
                </strong>

              </div>

              <div className="workout-time">

                <Clock3 size={17} />

                {formatTime(elapsedSeconds)}

              </div>

            </div>

            {/* PROGRESS */}

            <div className="workout-progress-area">

              <div className="workout-progress-info">

                <span>
                  Exercise {workoutIndex + 1} of{" "}
                  {todayExercises.length}
                </span>

                <span>
                  {Math.round(
                    ((workoutIndex + 1) /
                      todayExercises.length) *
                      100
                  )}
                  %
                </span>

              </div>

              <div className="workout-progress">

                <div
                  className="workout-progress-fill"
                  style={{
                    width: `${
                      ((workoutIndex + 1) /
                        todayExercises.length) *
                      100
                    }%`,
                  }}
                />

              </div>

            </div>

            {/* MAIN WORKOUT CONTENT */}

            {!workoutFinished ? (

              <div className="workout-main">

                {/* VIDEO */}

                <div className="workout-video-panel">

                  <video
                    key={workoutExercise.id}
                    src={workoutExercise.animation}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  <div className="workout-video-label">

                    <Play
                      size={14}
                      fill="currentColor"
                    />

                    EXERCISE DEMO

                  </div>

                </div>

                {/* INFO */}

                <div className="workout-info-panel">

                  <span className="workout-category">
                    {workoutExercise.category}
                  </span>

                  <h1>
                    {workoutExercise.name}
                  </h1>

                  <p className="workout-equipment">
                    {workoutExercise.equipment}
                  </p>

                  {/* SET INDICATOR */}

                  <div className="set-progress">

                    {Array.from(
                      {
                        length:
                          workoutExercise.sets,
                      },
                      (_, index) => {

                        const setNumber =
                          index + 1;

                        const completed =
                          setNumber <
                          currentSet ||
                          completedSets[
                            workoutExercise.id
                          ] >= setNumber;

                        const current =
                          setNumber === currentSet;

                        return (

                          <div
                            key={setNumber}
                            className={`set-dot ${
                              completed
                                ? "completed"
                                : ""
                            } ${
                              current
                                ? "current"
                                : ""
                            }`}
                          >

                            {completed ? (
                              <Check size={16} />
                            ) : (
                              setNumber
                            )}

                          </div>

                        );

                      }
                    )}

                  </div>

                  <div className="current-set-label">
                    SET {currentSet} OF{" "}
                    {workoutExercise.sets}
                  </div>

                  {/* REPS */}

                  <div className="rep-display">

                    <span>REPS</span>

                    <strong>
                      {workoutExercise.reps}
                    </strong>

                  </div>

                  {/* REST TIMER */}

                  {isResting ? (

                    <div className="rest-timer-box">

                      <TimerReset size={22} />

                      <span>
                        REST
                      </span>

                      <strong>
                        {formatTime(restSeconds)}
                      </strong>

                      <small>
                        Recover before your
                        next set
                      </small>

                    </div>

                  ) : (

                    <button
                      className="complete-set-btn"
                      onClick={completeSet}
                    >

                      <CheckCircle2
                        size={21}
                      />

                      Complete Set

                    </button>

                  )}

                  {/* CONTROLS */}

                  <div className="workout-navigation">

                    <button
                      onClick={previousExercise}
                      disabled={workoutIndex === 0}
                    >

                      <ArrowLeft size={18} />

                      Previous

                    </button>

                    <button
                      onClick={() =>
                        setWorkoutPaused(
                          (previous) =>
                            !previous
                        )
                      }
                    >

                      {workoutPaused ? (
                        <>
                          <Play size={17} />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause size={17} />
                          Pause
                        </>
                      )}

                    </button>

                    <button
                      onClick={nextExercise}
                      disabled={
                        workoutIndex ===
                        todayExercises.length - 1
                      }
                    >

                      Next

                      <ArrowRight size={18} />

                    </button>

                  </div>

                </div>

              </div>

            ) : (

              /* ============================== */
              /* WORKOUT COMPLETE */
              /* ============================== */

              <div className="workout-complete">

                <div className="completion-icon">

                  <Check size={48} />

                </div>

                <span>
                  WORKOUT COMPLETE
                </span>

                <h1>
                  Great work! 🔥
                </h1>

                <p>
                  You completed your{" "}
                  {selectedDay.title} session.
                </p>

                <div className="completion-stats">

                  <div>
                    <Clock3 size={20} />

                    <strong>
                      {formatTime(
                        elapsedSeconds
                      )}
                    </strong>

                    <span>Duration</span>
                  </div>

                  <div>
                    <Dumbbell size={20} />

                    <strong>
                      {todayExercises.length}
                    </strong>

                    <span>Exercises</span>
                  </div>

                  <div>
                    <Flame size={20} />

                    <strong>
                      {selectedDay.calories}
                    </strong>

                    <span>Calories</span>
                  </div>

                </div>

                <div className="completion-actions">

                  <button
                    className="secondary-workout-btn"
                    onClick={resetWorkout}
                  >

                    <RotateCcw size={18} />

                    Do Again

                  </button>

                  <button
                    className="finish-workout-btn"
                    onClick={() => {
  saveCompletedWorkout();
  setWorkoutActive(false);
}}
                  >

                    Finish Workout

                    <ArrowRight size={18} />

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Gym;