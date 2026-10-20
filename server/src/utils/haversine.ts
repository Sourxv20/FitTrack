/**
 * Precise Haversine distance calculation between two latitude/longitude points in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km

  const toRad = (angle: number) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export interface RouteCoord {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: Date | string | number | null;
}

/**
 * Calculates total route distance with accuracy filtering and unrealistic jump detection.
 */
export function calculateFilteredRouteDistance(points: RouteCoord[]): number {
  if (!points || points.length < 2) return 0;

  let totalDistance = 0;
  let lastValidPoint: RouteCoord | null = null;

  for (const point of points) {
    // Filter out points with terrible accuracy (> 35 meters)
    if (point.accuracy && point.accuracy > 35) {
      continue;
    }

    if (!lastValidPoint) {
      lastValidPoint = point;
      continue;
    }

    const dist = calculateHaversineDistance(
      lastValidPoint.latitude,
      lastValidPoint.longitude,
      point.latitude,
      point.longitude
    );

    // If timestamp is available, filter out impossible speeds (> 35 km/h)
    if (point.timestamp && lastValidPoint.timestamp) {
      const t1 = new Date(lastValidPoint.timestamp).getTime();
      const t2 = new Date(point.timestamp).getTime();
      const deltaHours = (t2 - t1) / (1000 * 3600);

      if (deltaHours > 0) {
        const speedKmH = dist / deltaHours;
        if (speedKmH > 35) {
          // Unrealistic GPS teleport jump; ignore this point
          continue;
        }
      }
    }

    // Accumulate distance (ignore microscopic jitter < 1 meter)
    if (dist >= 0.001) {
      totalDistance += dist;
      lastValidPoint = point;
    }
  }

  return Math.round(totalDistance * 100) / 100;
}
