import React from "react";

export default function MapCanvasDefs() {
  return (
    <defs>
      {/* Grid Patterns for Light and Dark */}
      <pattern
        id="cadGridLight"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="#e2e4e9"
          strokeWidth="1"
          strokeOpacity="0.85"
        />
      </pattern>
      <pattern
        id="cadGridDark"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="#22242a"
          strokeWidth="1"
          strokeOpacity="0.75"
        />
      </pattern>

      {/* Hazard Stripes for Restricted No-Go Zones */}
      <pattern
        id="hazardStripesRed"
        width="16"
        height="16"
        patternTransform="rotate(45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="16"
          stroke="#ef4444"
          strokeWidth="6"
          strokeOpacity="0.4"
        />
      </pattern>

      {/* Caution Stripes for Slow Zones */}
      <pattern
        id="hazardStripesAmber"
        width="16"
        height="16"
        patternTransform="rotate(45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="16"
          stroke="#f59e0b"
          strokeWidth="6"
          strokeOpacity="0.35"
        />
      </pattern>
    </defs>
  );
}
