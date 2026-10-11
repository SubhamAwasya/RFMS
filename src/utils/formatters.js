/**
 * Formatting helpers for telemetry and display values
 */

export function formatBattery(level) {
  const num = Number(level) || 0;
  let category = "high";
  if (num < 20) category = "critical";
  else if (num < 40) category = "low";
  else if (num < 70) category = "medium";
  return {
    value: `${num}%`,
    raw: num,
    category,
  };
}

export function formatSpeed(speed) {
  return `${Number(speed || 0).toFixed(1)} m/s`;
}

export function formatDistance(meters) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${meters} m`;
}
