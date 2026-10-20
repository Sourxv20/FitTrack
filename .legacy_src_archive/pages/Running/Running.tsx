import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  MapPin,
  Clock,
  Flame,
  Gauge,
} from "lucide-react";
import "./Running.css";

interface Run {
  id: number;
  date: string;
  duration: number;
  distance: number;
  calories: number;
  pace: string;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function Running() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [seconds, setSeconds] = useState(0);
const [distance, setDistance] = useState(0);

const [currentLocation, setCurrentLocation] =
  useState<GeolocationPosition | null>(null);

const [gpsStatus, setGpsStatus] = useState("GPS not started");
const previousLocation = useRef<GeolocationPosition | null>(null);

  const [runs, setRuns] = useState<Run[]>(() => {
    const savedRuns = localStorage.getItem("fittrack_runs");

    return savedRuns ? JSON.parse(savedRuns) : [];
  });

  // GPS tracking
useEffect(() => {
  if (!isRunning || isPaused) return;

  if (!navigator.geolocation) {
    setGpsStatus("GPS is not supported");
    return;
  }

  setGpsStatus("Finding your location...");

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      setCurrentLocation(position);
      setGpsStatus("GPS connected");

      const accuracy = position.coords.accuracy;

      // Ignore very inaccurate GPS readings
      if (accuracy > 50) {
        return;
      }

      if (previousLocation.current) {
        const oldLat = previousLocation.current.coords.latitude;
        const oldLon = previousLocation.current.coords.longitude;

        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;

        const R = 6371;

        const dLat = ((newLat - oldLat) * Math.PI) / 180;
        const dLon = ((newLon - oldLon) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((oldLat * Math.PI) / 180) *
            Math.cos((newLat * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;

        const c =
          2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const movedDistance = R * c;

        // Ignore unrealistic GPS jumps
        if (movedDistance > 0 && movedDistance < 0.1) {
          setDistance((previous) =>
            Number((previous + movedDistance).toFixed(3))
          );
        }
      }

      previousLocation.current = position;
    },
    (error) => {
      console.error("GPS error:", error);

      if (error.code === error.PERMISSION_DENIED) {
        setGpsStatus("Location permission denied");
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        setGpsStatus("Location unavailable");
      } else if (error.code === error.TIMEOUT) {
        setGpsStatus("GPS timeout");
      } else {
        setGpsStatus("Unable to get location");
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}, [isRunning, isPaused]);

  /// Running timer
useEffect(() => {
  if (!isRunning || isPaused) return;

  const interval = setInterval(() => {
    setSeconds((previous) => previous + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning, isPaused]);

  // Format time
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // Calculate pace
  const calculatePace = () => {
  if (distance < 0.01 || seconds <= 0) {
    return "--:--";
  }

  const paceSeconds = seconds / distance;

  // Prevent unrealistic display values
  if (paceSeconds > 3600) {
    return "--:--";
  }

  const minutes = Math.floor(paceSeconds / 60);
  const secs = Math.floor(paceSeconds % 60);

  return `${minutes}:${String(secs).padStart(2, "0")}`;
};

  // Start run
  const startRun = () => {
  setSeconds(0);
  setDistance(0);
  previousLocation.current = null;

  setIsRunning(true);
  setIsPaused(false);
};

  // Pause / resume
  const togglePause = () => {
  setIsPaused((previous) => {
    const nextPaused = !previous;

    // Reset the GPS reference when pausing/resuming
    // so movement during the pause is not counted.
    previousLocation.current = null;

    return nextPaused;
  });
};

  // Finish run
  const finishRun = () => {
    if (seconds === 0) return;

    const calories = Math.round(distance * 65);

    const newRun: Run = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      duration: seconds,
      distance: Number(distance.toFixed(2)),
      calories,
      pace: calculatePace(),
    };

    const updatedRuns = [newRun, ...runs];

    setRuns(updatedRuns);

    localStorage.setItem(
      "fittrack_runs",
      JSON.stringify(updatedRuns)
    );

    setIsRunning(false);
    setIsPaused(false);
  };

  // Reset
  const resetRun = () => {
  setIsRunning(false);
  setIsPaused(false);
  setSeconds(0);
  setDistance(0);
  setCurrentLocation(null);
  setGpsStatus("GPS not started");
  previousLocation.current = null;
};
  const calories = Math.round(distance * 65);

  return (
    <div className="running-page">
      {/* Header */}
      <div className="page-header">
        <p className="eyebrow">Run Tracking</p>

        <h1 className="page-title">Running</h1>

        <p className="page-subtitle">
          Track your distance, pace and running performance.
        </p>
      </div>

      {/* Main Running Card */}
      <div className="running-card">
        <div className="running-card-top">
          <div>
            <p className="running-label">
              {isRunning
                ? isPaused
                  ? "RUN PAUSED"
                  : "RUN IN PROGRESS"
                : "READY TO RUN"}
            </p>

            <h2>
              {isRunning
                ? isPaused
                  ? "Take a breather"
                  : "Keep going!"
                : "Ready for your run?"}
            </h2>

            <p>
              {isRunning
                ? "Focus on your pace and keep moving."
                : "Start your run and track your performance."}
            </p>
          </div>

          <div>
  <div className="running-icon">
    <MapPin size={30} />
  </div>

  <div className="gps-status">
    <span
      className={
        gpsStatus === "GPS connected"
          ? "gps-dot connected"
          : "gps-dot"
      }
    ></span>

    {gpsStatus}
  </div>
</div>
        </div>

        {/* Timer */}
        <div className="run-timer">
          {formatTime(seconds)}
        </div>

        {/* Stats */}
        <div className="running-stats">
          <div className="run-stat">
            <MapPin size={22} />

            <span>Distance</span>

            <strong>{distance.toFixed(2)} km</strong>
          </div>

          <div className="run-stat">
            <Gauge size={22} />

            <span>Average Pace</span>

            <strong>{calculatePace()} /km</strong>
          </div>

          <div className="run-stat">
            <Flame size={22} />

            <span>Calories</span>

            <strong>{calories} kcal</strong>
          </div>
        </div>

        {/* Controls */}
        <div className="running-controls">
          {!isRunning ? (
            <button className="run-button start" onClick={startRun}>
              <Play size={20} fill="currentColor" />
              Start Run
            </button>
          ) : (
            <>
              <button
                className="run-button pause"
                onClick={togglePause}
              >
                {isPaused ? (
                  <>
                    <Play size={20} fill="currentColor" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause size={20} />
                    Pause
                  </>
                )}
              </button>

              <button
                className="run-button finish"
                onClick={finishRun}
              >
                <Square size={19} fill="currentColor" />
                Finish Run
              </button>
            </>
          )}

          {seconds > 0 && !isRunning && (
            <button className="reset-button" onClick={resetRun}>
              <RotateCcw size={18} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="running-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Today's Run</p>
            <h2>Running Stats</h2>
          </div>
        </div>

        <div className="quick-stats">
          <div className="quick-stat-card">
            <Clock size={24} />
            <span>Duration</span>
            <strong>{formatTime(seconds)}</strong>
          </div>

          <div className="quick-stat-card">
            <MapPin size={24} />
            <span>Distance</span>
            <strong>{distance.toFixed(2)} km</strong>
          </div>

          <div className="quick-stat-card">
            <Gauge size={24} />
            <span>Pace</span>
            <strong>{calculatePace()} /km</strong>
          </div>

          <div className="quick-stat-card">
            <Flame size={24} />
            <span>Calories</span>
            <strong>{calories} kcal</strong>
          </div>
        </div>
      </div>

      {/* Running History */}
      <div className="running-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your Activity</p>
            <h2>Recent Runs</h2>
          </div>
        </div>

        {runs.length === 0 ? (
          <div className="empty-runs">
            <MapPin size={36} />

            <h3>No runs yet</h3>

            <p>
              Start your first run and your activity will appear here.
            </p>
          </div>
        ) : (
          <div className="run-history">
            {runs.slice(0, 5).map((run) => (
              <div className="run-history-item" key={run.id}>
                <div className="history-icon">
                  <MapPin size={21} />
                </div>

                <div className="history-main">
                  <strong>{run.distance.toFixed(2)} km Run</strong>
                  <span>{run.date}</span>
                </div>

                <div className="history-stat">
                  <span>Time</span>
                  <strong>{formatTime(run.duration)}</strong>
                </div>

                <div className="history-stat">
                  <span>Pace</span>
                  <strong>{run.pace} /km</strong>
                </div>

                <div className="history-stat">
                  <span>Calories</span>
                  <strong>{run.calories} kcal</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Running;