import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Dumbbell,
  Flame,
  Target,
  TrendingUp,
} from "lucide-react";
import "./Progress.css";

type WorkoutRecord = {
  id: string;
  date: string;
  workoutName: string;
  workoutType: string;
  duration: number;
  exercises: number;
  completedSets: number;
  calories: number;
};

function Progress() {
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    const savedWorkouts = JSON.parse(
      localStorage.getItem("fittrack_workouts") || "[]"
    );

    setWorkouts(savedWorkouts);
  }, []);

  const totalCalories = useMemo(() => {
    return workouts.reduce((total, workout) => total + workout.calories, 0);
  }, [workouts]);

  const totalExercises = useMemo(() => {
    return workouts.reduce((total, workout) => total + workout.exercises, 0);
  }, [workouts]);

  const totalMinutes = useMemo(() => {
    return Math.floor(
      workouts.reduce((total, workout) => total + workout.duration, 0) / 60
    );
  }, [workouts]);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const currentStreak = useMemo(() => {
    if (workouts.length === 0) return 0;

    const dates = workouts
      .map((workout) => new Date(workout.date).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index);

    dates.sort(
      (a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    );

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]);
      const previous = new Date(dates[i + 1]);

      const difference =
        (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24);

      if (difference <= 1.1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [workouts]);

  const weeklyWorkouts = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);

      date.setDate(today.getDate() - (6 - index));

      const dateString = date.toDateString();

      const count = workouts.filter(
        (workout) =>
          new Date(workout.date).toDateString() === dateString
      ).length;

      return {
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count,
      };
    });
  }, [workouts]);

  return (
    <div className="progress-page">
      {/* HEADER */}
      <div className="page-header progress-header">
        <div>
          <p className="eyebrow">YOUR PERFORMANCE</p>
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle">
            Track your workouts and see how your consistency is improving.
          </p>
        </div>

        <div className="progress-header-icon">
          <TrendingUp size={25} />
        </div>
      </div>

      {/* STATS */}
      <section className="progress-stats">
        <div className="progress-stat-card">
          <div className="progress-stat-icon">
            <Dumbbell size={21} />
          </div>

          <div>
            <span>Total Workouts</span>
            <strong>{workouts.length}</strong>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon">
            <Flame size={21} />
          </div>

          <div>
            <span>Calories Burned</span>
            <strong>{totalCalories.toLocaleString()}</strong>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Workout Time</span>
            <strong>
              {totalHours > 0 ? `${totalHours}h ` : ""}
              {remainingMinutes}m
            </strong>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon">
            <Target size={21} />
          </div>

          <div>
            <span>Current Streak</span>
            <strong>
              {currentStreak} {currentStreak === 1 ? "day" : "days"}
            </strong>
          </div>
        </div>
      </section>

      {/* WEEKLY ACTIVITY */}
      <section className="progress-panel">
        <div className="progress-panel-header">
          <div>
            <p className="eyebrow">ACTIVITY</p>
            <h2>Weekly Workout Activity</h2>
          </div>

          <CalendarDays size={21} />
        </div>

        <div className="weekly-chart">
          {weeklyWorkouts.map((day) => (
            <div className="chart-day" key={day.day}>
              <div className="chart-bar-area">
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(day.count * 55, 8)}px`,
                  }}
                >
                  {day.count > 0 && <span>{day.count}</span>}
                </div>
              </div>

              <strong>{day.day}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT WORKOUTS */}
      <section className="progress-panel">
        <div className="progress-panel-header">
          <div>
            <p className="eyebrow">HISTORY</p>
            <h2>Recent Workouts</h2>
          </div>

          <span className="history-count">
            {workouts.length} sessions
          </span>
        </div>

        {workouts.length === 0 ? (
          <div className="empty-progress">
            <Dumbbell size={34} />

            <h3>No workouts yet</h3>

            <p>
              Complete your first workout and your training history
              will appear here.
            </p>
          </div>
        ) : (
          <div className="workout-history">
            {[...workouts]
              .reverse()
              .slice(0, 10)
              .map((workout) => (
                <div className="history-row" key={workout.id}>
                  <div className="history-main">
                    <div className="history-icon">
                      <Dumbbell size={19} />
                    </div>

                    <div>
                      <strong>{workout.workoutName}</strong>

                      <span>
                        {new Date(workout.date).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="history-details">
                    <span>
                      <Clock3 size={15} />
                      {Math.floor(workout.duration / 60)} min
                    </span>

                    <span>
                      <Dumbbell size={15} />
                      {workout.exercises} exercises
                    </span>

                    <span>
                      <Flame size={15} />
                      {workout.calories} kcal
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* SUMMARY */}
      <section className="progress-summary">
        <div>
          <p className="eyebrow">TRAINING SUMMARY</p>
          <h2>Keep building your consistency.</h2>
          <p>
            You've completed {workouts.length} workout
            {workouts.length === 1 ? "" : "s"} and trained
            {totalExercises > 0
              ? ` across ${totalExercises} exercise sessions`
              : " 0 times"}.
          </p>
        </div>

        <div className="summary-number">
          <strong>{workouts.length}</strong>
          <span>workouts</span>
        </div>
      </section>
    </div>
  );
}

export default Progress;