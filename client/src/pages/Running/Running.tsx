import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import confetti from "canvas-confetti";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  MapPin,
  Clock,
  Flame,
  Gauge,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Trash2,
  ChevronRight,
  Footprints,
  Zap
} from "lucide-react";
import { runService } from "../../services/workoutService";
import { Run, RoutePoint } from "../../types";
import { formatDuration, formatPace } from "../../utils/formatters";
import { calculateHaversineDistance } from "../../utils/haversine";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal";
import { YoYoTest } from "./YoYoTest";

export const Running: React.FC = () => {
  // Activity Mode Selector: "gps" | "yoyo"
  const [activityMode, setActivityMode] = useState<"gps" | "yoyo">("gps");

  // Run State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);

  // GPS Status
  const [gpsStatus, setGpsStatus] = useState<string>("Initializing GPS...");
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Modals & History
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [savedRuns, setSavedRuns] = useState<Run[]>([]);
  const [selectedRunDetail, setSelectedRunDetail] = useState<Run | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);

  // Detail Map Ref
  const detailMapRef = useRef<HTMLDivElement>(null);
  const detailMapInstanceRef = useRef<L.Map | null>(null);

  // Previous GPS reference point for distance calculation
  const lastLocationRef = useRef<GeolocationPosition | null>(null);

  const { showToast } = useToast();
  const { user } = useAuth();

  // Load Run History
  useEffect(() => {
    const loadRuns = async () => {
      try {
        const res = await runService.getRuns();
        setSavedRuns(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load run history:", err);
        setSavedRuns([]);
      }
    };
    loadRuns();
  }, []);

  // Invalidate map size on mode switch back to GPS
  useEffect(() => {
    if (activityMode === "gps" && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [activityMode]);

  // Timer Tick
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isPaused]);

  // Draw / Update pulsing user location marker & accuracy circle
  const updateUserMarker = (lat: number, lng: number, accuracy?: number) => {
    if (!mapInstanceRef.current) return;

    const userPinIcon = L.divIcon({
      className: "custom-pin-user",
      html: `
        <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:26px;height:26px;border-radius:50%;background:rgba(37,99,235,0.35);animation:markerPulse 2s cubic-bezier(0.4,0,0.6,1) infinite;"></div>
          <div style="width:14px;height:14px;border-radius:50%;background:#2563EB;border:3px solid #ffffff;box-shadow:0 0 10px rgba(37,99,235,0.9);position:relative;z-index:2;"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    if (!currentMarkerRef.current) {
      currentMarkerRef.current = L.marker([lat, lng], { icon: userPinIcon })
        .bindTooltip("You are here", { permanent: false, direction: "top", offset: [0, -14] })
        .addTo(mapInstanceRef.current);
    } else {
      currentMarkerRef.current.setLatLng([lat, lng]);
    }

    if (accuracy && accuracy < 5000) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle([lat, lng], {
          radius: accuracy,
          color: "#2563EB",
          fillColor: "#3B82F6",
          fillOpacity: 0.12,
          weight: 1.5
        }).addTo(mapInstanceRef.current);
      } else {
        accuracyCircleRef.current.setLatLng([lat, lng]);
        accuracyCircleRef.current.setRadius(accuracy);
      }
    }
  };

  // Request user's current GPS location immediately
  const requestCurrentLocation = (panMap = true) => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS not supported on device");
      return;
    }

    setIsLocating(true);
    setGpsStatus("Acquiring GPS location...");

    const handleSuccess = (pos: GeolocationPosition) => {
      setIsLocating(false);
      const { latitude, longitude, accuracy } = pos.coords;
      setCurrentCoords({ lat: latitude, lng: longitude });
      setGpsAccuracy(accuracy);
      setGpsStatus(
        accuracy <= 30
          ? `GPS Locked • High Accuracy (±${Math.round(accuracy)}m)`
          : `GPS Connected • Accuracy ±${Math.round(accuracy)}m`
      );

      if (mapInstanceRef.current) {
        if (panMap) {
          mapInstanceRef.current.setView([latitude, longitude], 16, { animate: true });
        }
        updateUserMarker(latitude, longitude, accuracy);
      }
    };

    const handleError = (err: GeolocationPositionError) => {
      console.warn("High-accuracy location failed, falling back to low-accuracy:", err.message);
      // Fallback: enableHighAccuracy = false (uses IP / WiFi BSSID, fast and reliable for laptops)
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (fallbackErr) => {
          setIsLocating(false);
          console.warn("Fallback geolocation failed:", fallbackErr.message);
          if (fallbackErr.code === 1) {
            setGpsStatus("Location permission denied. Please allow GPS.");
            showToast("Please allow location access to show your current location on the map.", "warning");
          } else {
            setGpsStatus("GPS Signal Unavailable");
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 30000
    });
  };

  // Acquire user position on initial component mount
  useEffect(() => {
    requestCurrentLocation(true);
  }, []);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Default to Delhi or user's coords if already acquired
      const initialLat = currentCoords?.lat || 28.6139;
      const initialLng = currentCoords?.lng || 77.209;

      try {
        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: currentCoords ? 16 : 14,
          zoomControl: false
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Create polyline for route
        const polyline = L.polyline([], {
          color: "#FF6B4A",
          weight: 5,
          opacity: 0.9,
          smoothFactor: 1
        }).addTo(map);

        polylineRef.current = polyline;
        mapInstanceRef.current = map;

        if (currentCoords) {
          updateUserMarker(currentCoords.lat, currentCoords.lng, gpsAccuracy || undefined);
          map.setView([currentCoords.lat, currentCoords.lng], 16);
        }
      } catch (err) {
        console.warn("Leaflet map init note:", err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, []);

  // Invalidate map size and redraw when returning to GPS Run or container resizes
  const refreshMapSize = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize({ pan: false });
      if (currentCoords) {
        mapInstanceRef.current.setView(
          [currentCoords.lat, currentCoords.lng],
          mapInstanceRef.current.getZoom() || 16,
          { animate: false }
        );
        updateUserMarker(currentCoords.lat, currentCoords.lng, gpsAccuracy || undefined);
      }
      if (polylineRef.current) {
        polylineRef.current.redraw();
      }
    }
  };

  // Re-synchronize map when switching back to GPS Run
  useEffect(() => {
    if (activityMode === "gps") {
      refreshMapSize();
      const t1 = setTimeout(refreshMapSize, 60);
      const t2 = setTimeout(refreshMapSize, 200);
      const t3 = setTimeout(refreshMapSize, 450);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [activityMode]);

  // ResizeObserver: detects when map container transitions from display: none or resizes
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize({ pan: false });
          }
        }
      }
    });

    observer.observe(mapContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Real GPS Geolocation Watcher
  useEffect(() => {
    if (!isRunning) {
      if (currentCoords) {
        setGpsStatus("GPS Ready • Current Location Locked");
      } else {
        setGpsStatus("GPS not started");
      }
      lastLocationRef.current = null;
      return;
    }

    if (isPaused) {
      setGpsStatus("RUN PAUSED");
      // Reset reference point on pause so movement while paused is NOT accumulated!
      lastLocationRef.current = null;
      return;
    }

    if (isSimulating) return;

    if (!navigator.geolocation) {
      setGpsStatus("GPS is not supported on this browser.");
      showToast("GPS is not supported by your browser.", "error");
      return;
    }

    setGpsStatus("Acquiring high-accuracy GPS signal...");

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, speed } = pos.coords;
        setGpsAccuracy(accuracy);
        setGpsStatus(accuracy <= 25 ? "GPS Connected • High Accuracy" : "GPS Connected • Moderate Signal");
        setCurrentCoords({ lat: latitude, lng: longitude });

        // Reject readings with poor accuracy (> 35 meters)
        if (accuracy > 35) {
          return;
        }

        // Add to route points
        const newPoint: RoutePoint = {
          latitude,
          longitude,
          accuracy,
          speed,
          timestamp: pos.timestamp,
          pointIndex: routePoints.length
        };

        // Distance accumulation via Haversine
        if (lastLocationRef.current) {
          const oldLat = lastLocationRef.current.coords.latitude;
          const oldLon = lastLocationRef.current.coords.longitude;

          const dist = calculateHaversineDistance(oldLat, oldLon, latitude, longitude);

          // Speed anomaly guard: ignore instantaneous jumps > 35 km/h
          const timeDeltaHours = (pos.timestamp - lastLocationRef.current.timestamp) / (1000 * 3600);
          if (timeDeltaHours > 0) {
            const speedKmH = dist / timeDeltaHours;
            if (speedKmH > 35) {
              // Ignore GPS teleport
              return;
            }
          }

          if (dist >= 0.002) {
            // Valid movement (>= 2 meters)
            setDistanceKm((prev) => Math.round((prev + dist) * 100) / 100);
            setRoutePoints((prev) => [...prev, newPoint]);
            lastLocationRef.current = pos;
          }
        } else {
          // First point of this segment
          lastLocationRef.current = pos;
          setRoutePoints((prev) => [...prev, newPoint]);
        }

        // Update Map Markers & Polyline
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([latitude, longitude], { animate: true });

          // Start marker
          if (!startMarkerRef.current) {
            const startIcon = L.divIcon({
              className: "custom-pin-start",
              html: `<div style="background:#22C55E;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            });
            startMarkerRef.current = L.marker([latitude, longitude], { icon: startIcon })
              .bindTooltip("Start Point", { permanent: false, direction: "bottom" })
              .addTo(mapInstanceRef.current);
          }

          // Update user marker and accuracy circle
          updateUserMarker(latitude, longitude, accuracy);

          // Extend polyline
          if (polylineRef.current) {
            polylineRef.current.addLatLng([latitude, longitude]);
          }
        }
      },
      (err) => {
        console.warn("Geolocation watch error:", err.message);
        if (err.code === 1) {
          setGpsStatus("Location permission denied. Please allow GPS permissions.");
          showToast("Please allow location permissions to track your run.", "error");
        } else {
          setGpsStatus("Searching for GPS satellites...");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isRunning, isPaused, isSimulating]);

  // Live GPS Simulation Engine (Animates route drawing & runner movement on desktop)
  useEffect(() => {
    if (!isRunning || isPaused || !isSimulating) return;

    const baseLat = currentCoords?.lat || 28.6139;
    const baseLng = currentCoords?.lng || 77.209;

    let step = routePoints.length;

    const simTimer = setInterval(() => {
      step += 1;
      const angle = step * 0.14;
      const radiusLat = 0.0028 + Math.sin(step * 0.05) * 0.0008;
      const radiusLng = 0.0036 + Math.cos(step * 0.05) * 0.0008;
      const nextLat = baseLat + Math.sin(angle) * radiusLat;
      const nextLng = baseLng + Math.cos(angle) * radiusLng;

      const newPoint: RoutePoint = {
        latitude: nextLat,
        longitude: nextLng,
        accuracy: 3,
        speed: 3.8, // ~13.7 km/h
        timestamp: Date.now(),
        pointIndex: step
      };

      setRoutePoints((prev) => [...prev, newPoint]);
      setDistanceKm((prev) => Math.round((prev + 0.012) * 100) / 100);
      setCurrentCoords({ lat: nextLat, lng: nextLng });
      setGpsAccuracy(3);
      setGpsStatus("⚡ Simulation Active • Drawing Live Route (4:18 /km)");

      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([nextLat, nextLng], { animate: true });

        // Start marker
        if (!startMarkerRef.current) {
          const startIcon = L.divIcon({
            className: "custom-pin-start",
            html: `<div style="background:#22C55E;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });
          startMarkerRef.current = L.marker([nextLat, nextLng], { icon: startIcon })
            .bindTooltip("Start Point", { permanent: false, direction: "bottom" })
            .addTo(mapInstanceRef.current);
        }

        updateUserMarker(nextLat, nextLng, 3);

        if (polylineRef.current) {
          polylineRef.current.addLatLng([nextLat, nextLng]);
        }
      }
    }, 1000);

    return () => clearInterval(simTimer);
  }, [isRunning, isPaused, isSimulating, currentCoords, routePoints.length]);

  // Start Real Run
  const handleStartRun = () => {
    setIsSimulating(false);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setRoutePoints([]);
    lastLocationRef.current = null;
    showToast("GPS tracking started. Have a strong run!", "success");
  };

  // Start Simulated Run (Desktop Demonstration Mode)
  const handleStartSimulation = () => {
    setIsSimulating(true);
    setIsRunning(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setRoutePoints([]);
    lastLocationRef.current = null;
    if (polylineRef.current) polylineRef.current.setLatLngs([]);
    if (startMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    setGpsStatus("⚡ Simulation Active • Drawing Live Route");
    showToast("GPS Run Simulation started! Watch the route polyline and marker animate live.", "success");
  };

  // Pause / Resume
  const handleTogglePause = () => {
    if (isPaused) {
      // Resuming
      setIsPaused(false);
      lastLocationRef.current = null; // Resets reference coordinate so transit during pause is NOT counted
      showToast("Run resumed.", "info");
    } else {
      // Pausing
      setIsPaused(true);
      showToast("Run paused.", "info");
    }
  };

  // Reset Run
  const handleResetRun = () => {
    setIsSimulating(false);
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setRoutePoints([]);
    lastLocationRef.current = null;
    if (polylineRef.current) polylineRef.current.setLatLngs([]);
    if (startMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    // Note: We retain currentMarkerRef and accuracyCircleRef so the user's live position remains visible!
    if (currentCoords) {
      setGpsStatus("GPS Ready • Current Location Locked");
    } else {
      setGpsStatus("GPS not started");
    }
  };

  // Finish Run flow
  const handleFinishPrompt = () => {
    setShowFinishConfirm(true);
  };

  const handleConfirmFinish = () => {
    setShowFinishConfirm(false);
    setIsRunning(false);
    setIsPaused(false);
    setShowSummaryModal(true);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  // Save Run to Database
  const handleSaveRun = async () => {
    setSaving(true);
    try {
      const userWeight = user?.profile?.weight || 72;
      const calories = Math.round(distanceKm * userWeight * 1.036);
      const pace = formatPace(elapsedSeconds, distanceKm);

      await runService.saveRun({
        durationSeconds: elapsedSeconds,
        distanceKm,
        avgPace: pace,
        caloriesBurned: calories,
        notes: "Completed outdoor GPS run.",
        routePoints
      });

      showToast("Run successfully saved to your history!", "success");
      setShowSummaryModal(false);

      // Refresh runs list
      const res = await runService.getRuns();
      setSavedRuns(Array.isArray(res) ? res : []);
    } catch (err: any) {
      showToast(err.message || "Failed to save run.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Center map on user location and refresh GPS fix
  const handleRecenter = () => {
    refreshMapSize();
    if (mapInstanceRef.current && currentCoords) {
      mapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], 16, { animate: true });
      showToast("Centered on current location.", "info");
    }
    requestCurrentLocation(true);
  };

  // Inspect past run detail map
  const openRunDetail = (run: Run) => {
    setSelectedRunDetail(run);
  };

  useEffect(() => {
    if (selectedRunDetail && detailMapRef.current) {
      if (detailMapInstanceRef.current) {
        detailMapInstanceRef.current.remove();
        detailMapInstanceRef.current = null;
      }
      if (detailMapRef.current && (detailMapRef.current as any)._leaflet_id) {
        delete (detailMapRef.current as any)._leaflet_id;
      }

      runService.getRunById(selectedRunDetail.id).then((fullRun) => {
        if (!detailMapRef.current) return;
        if (detailMapInstanceRef.current) {
          detailMapInstanceRef.current.remove();
          detailMapInstanceRef.current = null;
        }
        if (detailMapRef.current && (detailMapRef.current as any)._leaflet_id) {
          delete (detailMapRef.current as any)._leaflet_id;
        }

        const pts = fullRun.routePoints || [];
        const centerLat = pts.length > 0 ? pts[0].latitude : 28.6139;
        const centerLon = pts.length > 0 ? pts[0].longitude : 77.209;

        try {
          const map = L.map(detailMapRef.current, {
            center: [centerLat, centerLon],
            zoom: 15
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          if (pts.length > 0) {
            const latLngs = pts.map((p) => [p.latitude, p.longitude] as [number, number]);
            const polyline = L.polyline(latLngs, { color: "#FF6B4A", weight: 5 }).addTo(map);
            map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
          }

          detailMapInstanceRef.current = map;
        } catch (err) {
          console.warn("Detail map init note:", err);
        }
      });
    }

    return () => {
      if (detailMapInstanceRef.current) {
        detailMapInstanceRef.current.remove();
        detailMapInstanceRef.current = null;
      }
      if (detailMapRef.current) {
        delete (detailMapRef.current as any)._leaflet_id;
      }
    };
  }, [selectedRunDetail]);

  const currentPace = formatPace(elapsedSeconds, distanceKm);
  const userWeight = user?.profile?.weight || 72;
  const currentCalories = Math.round(distanceKm * userWeight * 1.036);

  return (
    <div className="space-y-6">
      {/* Page Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            RUNNING & ENDURANCE SYSTEM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-['Plus_Jakarta_Sans'] mt-0.5">
            {activityMode === "gps" ? "Real GPS Running Tracker" : "Yo-Yo Intermittent Recovery Test"}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {activityMode === "gps"
              ? "Real-time GPS coordinates, Haversine distance, and live Leaflet route mapping."
              : "Standardized 20m shuttle recovery assessment (Yo-Yo IR1) with synchronized audio cues & recovery intervals."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Activity Mode Selector Tabs (GPS Run vs. Yo-Yo Test) */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => {
                setActivityMode("gps");
                setTimeout(refreshMapSize, 50);
              }}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activityMode === "gps"
                  ? "text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {activityMode === "gps" && (
                <motion.div
                  layoutId="runningActivityTabGlider"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-500/25"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Footprints size={15} />
                <span>GPS Run</span>
              </span>
            </button>

            <button
              onClick={() => setActivityMode("yoyo")}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activityMode === "yoyo"
                  ? "text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {activityMode === "yoyo" && (
                <motion.div
                  layoutId="runningActivityTabGlider"
                  className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md shadow-emerald-500/25"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Zap size={15} />
                <span>Yo-Yo Test</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-[10px] font-black uppercase text-emerald-300">
                  IR1
                </span>
              </span>
            </button>
          </div>

          {/* GPS Status & Locate Button (only shown in GPS mode) */}
          {activityMode === "gps" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  refreshMapSize();
                  requestCurrentLocation(true);
                }}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-600 dark:text-blue-400 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                title="Update current GPS location"
              >
                <Navigation size={13} className={isLocating ? "animate-spin" : ""} />
                <span>{isLocating ? "Locating..." : "Locate Me"}</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isRunning && !isPaused
                      ? "bg-emerald-500 animate-ping"
                      : currentCoords
                      ? "bg-emerald-500"
                      : isPaused
                      ? "bg-amber-500"
                      : "bg-slate-400"
                  }`}
                />
                <span className="hidden sm:inline">{gpsStatus}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Yo-Yo IR1 Section */}
      {activityMode === "yoyo" && <YoYoTest />}

      {/* GPS Running Section (hidden when in Yo-Yo mode to preserve Leaflet map state) */}
      <div className={activityMode === "gps" ? "space-y-6" : "hidden"}>
        {/* Main Running Dashboard Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Large Timer Display */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
            ELAPSED TIME
          </span>
          <div className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono font-['Plus_Jakarta_Sans']">
            {formatDuration(elapsedSeconds, true)}
          </div>
          {isSimulating && isRunning && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span>LIVE GPS SIMULATION ACTIVE • DRAWING REAL-TIME ROUTE</span>
            </div>
          )}
          {isPaused && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider animate-pulse">
              RUN PAUSED
            </span>
          )}
        </div>

        {/* 3 Core Running Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Distance */}
          <motion.div whileHover={{ y: -3 }} className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-all hover:border-blue-500/30">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Distance
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
              {distanceKm.toFixed(2)}
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Kilometers</span>
          </motion.div>

          {/* Pace */}
          <motion.div whileHover={{ y: -3 }} className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-all hover:border-slate-400/30">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pace
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              {currentPace.replace(" /km", "")}
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ km</span>
          </motion.div>

          {/* Calories */}
          <motion.div whileHover={{ y: -3 }} className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center transition-all hover:border-amber-500/30">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Estimated Burn
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 font-mono">
              {currentCalories}
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Calories</span>
          </motion.div>
        </div>

        {/* Live Leaflet Map Container */}
        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-8 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Current location coordinate pill */}
          {currentCoords && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 shadow-md flex items-center gap-1.5">
              <MapPin size={13} className="text-blue-600 dark:text-blue-400" />
              <span>
                {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
              </span>
              {gpsAccuracy && (
                <span className="text-slate-400 font-normal">
                  (±{Math.round(gpsAccuracy)}m)
                </span>
              )}
            </div>
          )}

          {/* Map Floating Recenter Button */}
          <button
            onClick={handleRecenter}
            className="absolute bottom-4 right-4 z-10 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
            title="Center on my current location"
          >
            <Navigation size={18} className={isLocating ? "animate-spin text-blue-600" : ""} />
          </button>
        </div>

        {/* Running Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!isRunning ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartRun}
                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#CCFF00] hover:bg-[#B5E600] active:scale-95 text-black font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-[#CCFF00]/25 transition-all cursor-pointer"
              >
                <Play size={18} className="fill-black text-black" />
                <span>START GPS RUN</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartSimulation}
                className="flex items-center justify-center gap-2.5 px-7 py-4 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-black font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-400/25 transition-all cursor-pointer"
              >
                <Zap size={18} className="fill-black text-black" />
                <span>⚡ SIMULATE RUN (DEMO)</span>
              </motion.button>
            </div>
          ) : (
            <>
              {/* Pause / Resume */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleTogglePause}
                className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                  isPaused
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
              >
                {isPaused ? <Play size={18} className="fill-white" /> : <Pause size={18} />}
                <span>{isPaused ? "RESUME RUN" : "PAUSE RUN"}</span>
              </motion.button>

              {/* Finish Run */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleFinishPrompt}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Square size={16} className="fill-white" />
                <span>FINISH RUN</span>
              </motion.button>

              {/* Reset */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetRun}
                className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                title="Reset run"
              >
                <RotateCcw size={18} />
              </motion.button>
            </>
          )}
        </div>

        {/* Location Privacy Note */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Location is accessed solely for GPS distance and path rendering during your run.</span>
        </div>
      </div>

      {/* Run History Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Completed Runs ({savedRuns.length})
        </h3>

        {savedRuns.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <Footprints size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No runs recorded yet</p>
            <p className="text-xs mt-1">Start your first outdoor run and your activity route will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRuns.map((run) => (
              <div
                key={run.id}
                onClick={() => openRunDetail(run)}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Outdoor Run
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {new Date(run.startedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {run.distanceKm.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-slate-500">km</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold block text-slate-400">Time</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {formatDuration(run.durationSeconds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold block text-slate-400">Pace</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {run.avgPace}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold block text-slate-400">Burn</span>
                    <span className="font-semibold text-amber-500 font-mono">
                      {run.caloriesBurned} kcal
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>View Map Route</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Finish Run Confirmation Modal */}
      <Modal
        isOpen={showFinishConfirm}
        onClose={() => setShowFinishConfirm(false)}
        title="Finish this run?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you ready to complete your run and view your distance & route summary?
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowFinishConfirm(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Continue Run
            </button>
            <button
              onClick={handleConfirmFinish}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Finish Run
            </button>
          </div>
        </div>
      </Modal>

      {/* Run Summary Celebration Modal */}
      <Modal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        title="RUN COMPLETE 🎉"
        maxWidth="max-w-lg"
      >
        <div className="space-y-6 text-center">
          <div>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
              {distanceKm.toFixed(2)} km
            </div>
            <p className="text-xs text-slate-400 mt-1">Outstanding run endurance.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-left">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
              <p className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {formatDuration(elapsedSeconds)}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Pace</span>
              <p className="text-base font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {currentPace}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Calories</span>
              <p className="text-base font-bold text-amber-500 font-mono mt-0.5">
                {currentCalories} kcal
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Recorded <strong>{routePoints.length}</strong> GPS route points along your journey.
          </p>

          <button
            onClick={handleSaveRun}
            disabled={saving}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Save Run to History</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Past Run Detail Modal with Interactive Route Map */}
      <Modal
        isOpen={!!selectedRunDetail}
        onClose={() => setSelectedRunDetail(null)}
        title={selectedRunDetail ? `${selectedRunDetail.distanceKm} km Run Details` : ""}
        maxWidth="max-w-2xl"
      >
        {selectedRunDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Distance</span>
                <p className="text-sm font-bold text-blue-600 font-mono">{selectedRunDetail.distanceKm} km</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{formatDuration(selectedRunDetail.durationSeconds)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pace</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">{selectedRunDetail.avgPace}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Burn</span>
                <p className="text-sm font-bold text-amber-500 font-mono">{selectedRunDetail.caloriesBurned} kcal</p>
              </div>
            </div>

            {/* Interactive Past Map Route */}
            <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <div ref={detailMapRef} className="w-full h-full" />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">
                Logged on {new Date(selectedRunDetail.startedAt).toLocaleString()}
              </span>
              <button
                onClick={async () => {
                  if (confirm("Delete this run record?")) {
                    await runService.deleteRun(selectedRunDetail.id);
                    showToast("Run deleted.", "info");
                    setSelectedRunDetail(null);
                    const res = await runService.getRuns();
                    setSavedRuns(Array.isArray(res) ? res : []);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                <Trash2 size={14} /> Delete Run
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};