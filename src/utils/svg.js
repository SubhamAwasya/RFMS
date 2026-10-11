/**
 * SVG geometry and transformation utilities for spatial canvases
 */

export function getSvgCoordinates(
  svg,
  clientX,
  clientY,
  bounds = { minX: 10, maxX: 990, minY: 10, maxY: 640 }
) {
  if (!svg) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const svgPt = pt.matrixTransform(ctm.inverse());
  if (!bounds) {
    return {
      x: Math.round(svgPt.x),
      y: Math.round(svgPt.y),
    };
  }
  return {
    x: Math.round(Math.max(bounds.minX, Math.min(bounds.maxX, svgPt.x))),
    y: Math.round(Math.max(bounds.minY, Math.min(bounds.maxY, svgPt.y))),
  };
}

export function calculatePolylineDistance(points, scaleMetersPerUnit = 0.25) {
  if (!points || points.length < 2) return 0;
  let dist = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    dist += Math.sqrt(dx * dx + dy * dy);
  }
  return Math.round(dist * scaleMetersPerUnit);
}

export function calculateTransitMinutes(distanceMeters, speedMps = 1.2) {
  if (distanceMeters <= 0) return 1;
  const seconds = Math.round(distanceMeters / speedMps);
  return Math.max(1, Math.ceil(seconds / 60));
}
