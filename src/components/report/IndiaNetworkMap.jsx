import React from "react";
import { INDIA_STATE_PATHS } from "./indiaStatePaths";

const LOCATIONS = [
  {
    id: "kashmir",
    label: "KASHMIR",
    x: 86.4,
    y: 29.0,
    color: "#2E7D32",
    side: "left",
    labelX: 4,
    labelY: 24,
  },
  {
    id: "ludhiana",
    label: "LUDHIANA",
    x: 98.7,
    y: 72.6,
    color: "#2E7D32",
    side: "left",
    labelX: 4,
    labelY: 74,
  },
  {
    id: "pantnagar",
    label: "PANTNAGAR",
    x: 141.7,
    y: 99.3,
    color: "#C62828",
    side: "right",
    labelX: 410,
    labelY: 72,
  },
  {
    id: "roorkee",
    label: "ROORKEE",
    x: 122.7,
    y: 87.0,
    color: "#C62828",
    side: "right",
    labelX: 410,
    labelY: 102,
  },
  {
    id: "delhi",
    label: "DELHI",
    x: 114.6,
    y: 104.9,
    color: "#2E7D32",
    side: "right",
    labelX: 410,
    labelY: 132,
  },
  {
    id: "indore",
    label: "INDORE",
    x: 98.8,
    y: 187.5,
    color: "#2E7D32",
    side: "left",
    labelX: 4,
    labelY: 192,
  },
  {
    id: "ahmedabad",
    label: "AHMEDABAD",
    x: 60.1,
    y: 183.3,
    color: "#2E7D32",
    side: "left",
    labelX: 4,
    labelY: 232,
  },
  {
    id: "pune",
    label: "PUNE",
    x: 75.2,
    y: 246.5,
    color: "#2E7D32",
    side: "left",
    labelX: 4,
    labelY: 278,
  },
  {
    id: "jamshedpur",
    label: "JAMSHEDPUR",
    x: 220.3,
    y: 186.4,
    color: "#2E7D32",
    side: "right",
    labelX: 410,
    labelY: 200,
  },
  {
    id: "vizag",
    label: "VISAKHAPATNAM",
    x: 186.4,
    y: 258.3,
    color: "#2E7D32",
    side: "right",
    labelX: 410,
    labelY: 282,
  },
  {
    id: "trichy",
    label: "TRICHY",
    x: 132.3,
    y: 355.2,
    color: "#2E7D32",
    side: "right",
    labelX: 410,
    labelY: 362,
  },
];

const DotChevron = ({ x, y, flip = false }) => {
  const rows = [[0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3], [0, 1, 2], [0, 1], [0]];
  const dots = [];
  rows.forEach((cols, ri) => {
    cols.forEach((c) => {
      const dx = flip ? -c * 7 : c * 7;
      dots.push(
        <circle
          key={`${ri}-${c}`}
          cx={x + dx}
          cy={y + ri * 6}
          r={2.2}
          fill="#9EC5E8"
          opacity={0.75 - c * 0.08}
        />,
      );
    });
  });
  return <g>{dots}</g>;
};

const MapPin = ({ x, y, color }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx={0} cy={0} r={7} fill={color} />
    <circle cx={0} cy={0} r={3.2} fill="#FFFFFF" />
    <path d="M0 6 L-3.5 14 L0 12 L3.5 14 Z" fill={color} />
  </g>
);

/**
 * SVG India map with i-Factory location pins & callout labels.
 * No reference PNG — pure vector matching the PDF network page.
 */
const IndiaNetworkMap = () => {
  const vbW = 420;
  const vbH = 430;
  const mapOffsetX = 28;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width="100%"
      height="100%"
      style={{ maxHeight: 500, display: "block" }}
      role="img"
      aria-label="i-Factory Network locations across India"
    >
      <DotChevron x={14} y={36} />
      <DotChevron x={402} y={290} flip />

      <g transform={`translate(${mapOffsetX}, 4)`}>
        {INDIA_STATE_PATHS.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill={s.fill}
            stroke="#FFFFFF"
            strokeWidth={0.9}
            strokeLinejoin="round"
          />
        ))}

        {LOCATIONS.map((loc) => {
          const pinX = loc.x;
          const pinY = loc.y;
          const labelEndX =
            loc.side === "left" ? loc.labelX + 78 : loc.labelX - mapOffsetX - 4;
          const ctrlX =
            loc.side === "left" ? pinX - 36 : pinX + 40;
          const ctrlY = (pinY + loc.labelY) / 2;

          return (
            <g key={loc.id}>
              <path
                d={`M${pinX} ${pinY} Q${ctrlX} ${ctrlY} ${labelEndX} ${loc.labelY}`}
                fill="none"
                stroke="#78909C"
                strokeWidth={1}
                strokeDasharray="2.5 2.5"
                strokeLinecap="round"
              />
              <polygon
                points={
                  loc.side === "left"
                    ? `${labelEndX},${loc.labelY} ${labelEndX + 5},${loc.labelY - 3.2} ${labelEndX + 5},${loc.labelY + 3.2}`
                    : `${labelEndX},${loc.labelY} ${labelEndX - 5},${loc.labelY - 3.2} ${labelEndX - 5},${loc.labelY + 3.2}`
                }
                fill="#78909C"
              />
              <MapPin x={pinX} y={pinY} color={loc.color} />
              <text
                x={loc.side === "left" ? loc.labelX : loc.labelX - mapOffsetX}
                y={loc.labelY + 4}
                textAnchor={loc.side === "left" ? "start" : "end"}
                fontSize={10.5}
                fontWeight={700}
                fontFamily="'Segoe UI', Montserrat, Arial, sans-serif"
                fill="#212121"
                letterSpacing="0.5"
              >
                {loc.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default IndiaNetworkMap;
