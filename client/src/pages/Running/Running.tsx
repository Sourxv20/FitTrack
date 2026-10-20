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
  Zap,
  Plus,
  Minus,
  Layers,
  Globe
} from "lucide-react";
import { runService } from "../../services/workoutService";
import { Run, RoutePoint } from "../../types";
import { formatDuration, formatPace } from "../../utils/formatters";
import { calculateHaversineDistance } from "../../utils/haversine";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../../components/Modal";
import { YoYoTest } from "./YoYoTest";

interface LocationPreset {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  description: string;
}

const RUNNING_PRESETS: LocationPreset[] = [
  {
    id: "delhi",
    name: "India Gate Loop",
    city: "New Delhi, India",
    lat: 28.6129,
    lng: 77.2295,
    description: "Kartavya Path boulevard perimeter"
  },
  {
    id: "mumbai",
    name: "Marine Drive",
    city: "Mumbai, India",
    lat: 18.9431,
    lng: 72.8231,
    description: "Queen's Necklace seaside promenade"
  },
  {
    id: "nyc",
    name: "Central Park Loop",
    city: "New York, USA",
    lat: 40.785091,
    lng: -73.968285,
    description: "Jacqueline Kennedy Reservoir loop"
  },
  {
    id: "london",
    name: "Hyde Park Circuit",
    city: "London, UK",
    lat: 51.507268,
    lng: -0.16573,
    description: "Serpentine waterside route"
  },
  {
    id: "sf",
    name: "Golden Gate Shoreline",
    city: "San Francisco, USA",
    lat: 37.8085,
    lng: -122.4744,
    description: "Crissy Field bay trail"
  }
];

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

  // Leaflet map refs & theme
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const currentMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapTheme, setMapTheme] = useState<"dark" | "street">("dark");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("auto");

  // Simulation references (stable anchor & step counter)
  const simOriginRef = useRef<{ lat: number; lng: number } | null>(null);
  const simStepRef = useRef<number>(0);

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

  // Draw / Update pulsing user location marker & accuracy circle (Athletic Coral)
  const updateUserMarker = (lat: number, lng: number, accuracy?: number) => {
    if (!mapInstanceRef.current) return;

    const userPinIcon = L.divIcon({
      className: "custom-pin-user",
      html: `
        <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:30px;height:30px;border-radius:50%;background:rgba(255,107,74,0.35);animation:markerPulse 2s cubic-bezier(0.4,0,0.6,1) infinite;"></div>
          <div style="width:16px;height:16px;border-radius:50%;background:#FF6B4A;border:3px solid #ffffff;box-shadow:0 0 12px rgba(255,107,74,0.9);position:relative;z-index:2;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (!currentMarkerRef.current) {
      currentMarkerRef.current = L.marker([lat, lng], { icon: userPinIcon })
        .bindTooltip("You are here", { permanent: false, direction: "top", offset: [0, -16] })
        .addTo(mapInstanceRef.current);
    } else {
      currentMarkerRef.current.setLatLng([lat, lng]);
    }

    if (accuracy && accuracy < 5000) {
      if (!accuracyCircleRef.current) {
        accuracyCircleRef.current = L.circle([lat, lng], {
          radius: accuracy,
          color: "#FF6B4A",
          fillColor: "#FF6B4A",
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
      setSelectedPresetId("auto");
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
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (fallbackErr) => {
          setIsLocating(false);
          console.warn("Fallback geolocation failed:", fallbackErr.message);
          if (fallbackErr.code === 1) {
            setGpsStatus("Location permission denied. Pick a preset or allow GPS.");
          } else {
            setGpsStatus("GPS Signal Unavailable. Using preset running circuit.");
          }
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 4000,
      maximumAge: 30000
    });
  };

  // Acquire user position on initial component mount
  useEffect(() => {
    requestCurrentLocation(true);
  }, []);

  // Leaflet Map Initialization with CartoDB Dark Matter / Street tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      const initialLat = currentCoords?.lat || 28.6129;
      const initialLng = currentCoords?.lng || 77.2295;

      try {
        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: currentCoords ? 16 : 15,
          zoomControl: false
        });

        const tileUrl =
          mapTheme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

        const tileLayer = L.tileLayer(tileUrl, {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
          maxZoom: 19,
          subdomains: "abcd"
        }).addTo(map);

        tileLayerRef.current = tileLayer;

        // Create polyline for route
        const polyline = L.polyline([], {
          color: "#FF6B4A",
          weight: 5,
          opacity: 0.95,
          smoothFactor: 1
        }).addTo(map);

        polylineRef.current = polyline;
        mapInstanceRef.current = map;

        updateUserMarker(initialLat, initialLng, gpsAccuracy || undefined);

        // Multiple invalidation passes to prevent gray tile box
        const invalidate = () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize({ pan: false });
          }
        };
        setTimeout(invalidate, 80);
        setTimeout(invalidate, 250);
        setTimeout(invalidate, 600);
        setTimeout(invalidate, 1200);
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

  // Sync Map Theme (Dark / Street)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl =
      mapTheme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const newLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
      subdomains: "abcd"
    }).addTo(mapInstanceRef.current);

    newLayer.bringToBack();
    tileLayerRef.current = newLayer;
  }, [mapTheme]);

  // Zoom and Theme Actions
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleToggleTheme = () => {
    setMapTheme((prev) => (prev === "dark" ? "street" : "dark"));
  };

  const handleSelectPreset = (presetId: string) => {
    if (presetId === "auto") {
      setSelectedPresetId("auto");
      requestCurrentLocation(true);
      return;
    }
    const preset = RUNNING_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setCurrentCoords({ lat: preset.lat, lng: preset.lng });
    setGpsStatus(`📍 Location: ${preset.name} (${preset.city})`);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([preset.lat, preset.lng], 16, { duration: 1.2 });
      updateUserMarker(preset.lat, preset.lng);
    }
    showToast(`Centered on ${preset.name} (${preset.city})`, "info");
  };

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

  // Live GPS Simulation Engine (Smooth parametric park loop around origin)
  useEffect(() => {
    if (!isRunning || isPaused || !isSimulating) return;

    const simTimer = setInterval(() => {
      if (!simOriginRef.current) return;
      simStepRef.current += 1;
      const step = simStepRef.current;

      // Realistic 1.2 km running loop geometry (smooth parametric curve)
      const t = step * 0.08;
      const latOffset = Math.sin(t) * 0.0024 + Math.sin(t * 2) * 0.0007;
      const lngOffset = Math.cos(t) * 0.0032 + Math.sin(t * 3) * 0.0005;

      const nextLat = simOriginRef.current.lat + latOffset;
      const nextLng = simOriginRef.current.lng + lngOffset;

      const newPoint: RoutePoint = {
        latitude: nextLat,
        longitude: nextLng,
        accuracy: 3,
        speed: 3.6, // ~13 km/h pace
        timestamp: Date.now(),
        pointIndex: step
      };

      setRoutePoints((prev) => [...prev, newPoint]);
      setDistanceKm((prev) => Math.round((prev + 0.011) * 100) / 100);
      setCurrentCoords({ lat: nextLat, lng: nextLng });
      setGpsAccuracy(3);
      setGpsStatus("⚡ Simulation Active • Drawing Live Route (4:32 /km)");

      if (mapInstanceRef.current) {
        mapInstanceRef.current.panTo([nextLat, nextLng], { animate: true });
        updateUserMarker(nextLat, nextLng, 3);

        if (polylineRef.current) {
          polylineRef.current.addLatLng([nextLat, nextLng]);
        }
      }
    }, 1000);

    return () => clearInterval(simTimer);
  }, [isRunning, isPaused, isSimulating]);

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
    const originLat = currentCoords?.lat || 28.6129;
    const originLng = currentCoords?.lng || 77.2295;
    simOriginRef.current = { lat: originLat, lng: originLng };
    simStepRef.current = 0;

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

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([originLat, originLng], 16, { animate: true });

      const startIcon = L.divIcon({
        className: "custom-pin-start",
        html: `<div style="background:#10B981;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(16,185,129,0.9)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      startMarkerRef.current = L.marker([originLat, originLng], { icon: startIcon })
        .bindTooltip("Start Point", { permanent: false, direction: "bottom" })
        .addTo(mapInstanceRef.current);

      updateUserMarker(originLat, originLng, 3);
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
        const centerLat = pts.length > 0 ? pts[0].latitude : 28.6129;
        const centerLon = pts.length > 0 ? pts[0].longitude : 77.2295;

        try {
          const map = L.map(detailMapRef.current, {
            center: [centerLat, centerLon],
            zoom: 15,
            zoomControl: false
          });

          L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
            maxZoom: 19,
            subdomains: "abcd"
          }).addTo(map);

          if (pts.length > 0) {
            const latLngs = pts.map((p) => [p.latitude, p.longitude] as [number, number]);
            const polyline = L.polyline(latLngs, {
              color: "#FF6B4A",
              weight: 5,
              opacity: 0.95
            }).addTo(map);

            // Start marker
            const startIcon = L.divIcon({
              className: "custom-pin-start",
              html: `<div style="background:#10B981;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(16,185,129,0.9)"></div>`,
              iconSize: [14, 14],
              iconAnchor: [7, 7]
            });
            L.marker(latLngs[0], { icon: startIcon }).addTo(map);

            // Finish marker
            if (latLngs.length > 1) {
              const endIcon = L.divIcon({
                className: "custom-pin-end",
                html: `<div style="background:#FF6B4A;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(255,107,74,0.9)"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
              });
              L.marker(latLngs[latLngs.length - 1], { icon: endIcon }).addTo(map);
            }

            map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
          }

          detailMapInstanceRef.current = map;
          setTimeout(() => map.invalidateSize({ pan: false }), 150);
          setTimeout(() => map.invalidateSize({ pan: false }), 400);
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
                  className="absolute inset-0 bg-[#FF6B4A] rounded-xl shadow-md shadow-[#FF6B4A]/25"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-white/10 text-xs font-bold text-[#FF6B4A] transition-all shadow-sm cursor-pointer disabled:opacity-50"
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
        <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 mb-8 shadow-2xl bg-[#080D1A]">
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[380px] sm:min-h-[460px] z-0"
            style={{ width: "100%", height: "100%", minHeight: "380px" }}
          />

          {/* Top Left: Location Status & Coordinates Pill */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-white shadow-lg flex items-center gap-1.5">
              <MapPin size={13} className="text-[#FF6B4A]" />
              <span>
                {currentCoords ? `${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}` : "Positioning..."}
              </span>
              {gpsAccuracy && (
                <span className="text-slate-400 font-normal">
                  (±{Math.round(gpsAccuracy)}m)
                </span>
              )}
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isSimulating ? "SIMULATION TRACK" : gpsStatus.includes("Locked") ? "GPS ACTIVE" : "MAP READY"}</span>
            </div>
          </div>

          {/* Top Right: Preset Location Selector & Theme Switcher */}
          <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
            {/* Running Preset Selector */}
            <div className="relative">
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white shadow-lg focus:outline-none focus:border-[#FF6B4A] cursor-pointer appearance-none pr-7"
                title="Select a famous running circuit"
              >
                <option value="auto">📍 Device GPS / Auto</option>
                {RUNNING_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    🏃 {p.name} ({p.city})
                  </option>
                ))}
              </select>
              <Globe size={12} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Map Tile Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white shadow-lg hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Toggle Map Style (Dark / Street)"
            >
              <Layers size={13} className="text-cyan-400" />
              <span className="hidden sm:inline">{mapTheme === "dark" ? "Dark Map" : "Street Map"}</span>
            </button>
          </div>

          {/* Bottom Right Floating Map Zoom & Recenter Controls */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5">
            <button
              onClick={handleZoomIn}
              className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="Zoom In"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="Zoom Out"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={handleRecenter}
              className="p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-[#FF6B4A] shadow-lg hover:bg-slate-800 active:scale-95 transition-all cursor-pointer flex items-center justify-center mt-1"
              title="Center on my location"
            >
              <Navigation size={16} className={isLocating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Running Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {!isRunning ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartRun}
                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FF6B4A] hover:bg-[#FA5A36] active:scale-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-[#FF6B4A]/25 transition-all cursor-pointer"
              >
                <Play size={18} className="fill-white text-white" />
                <span>START GPS RUN</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleStartSimulation}
                className="flex items-center justify-center gap-2.5 px-7 py-4 bg-[#0B1528] hover:bg-[#132342] border border-cyan-500/30 hover:border-cyan-400 active:scale-95 text-cyan-400 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-950/40 transition-all cursor-pointer"
              >
                <Zap size={18} className="fill-cyan-400 text-cyan-400" />
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