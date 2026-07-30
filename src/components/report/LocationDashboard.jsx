import React from "react";
import { BRAND } from "../../constants/reportConstants";

export const Gauge = ({ value, max = 100, baseline = 49 }) => {
  const pct = Math.min(value / max, 1);
  const r = 40;
  const cx = 56;
  const cy = 56;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - pct);
  const color = value >= baseline ? "#2E7D32" : "#E65100";

  return (
    <svg width="112" height="68" viewBox="0 0 112 80">
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={offset}
      />
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={color}>
        {value.toFixed(2)}
      </text>
    </svg>
  );
};

export const Donut = ({ segments, size = 80 }) => {
  const r = 28;
  const cx = size / 2;
  const cy = size / 2;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="#E0E0E0" />
      </svg>
    );
  }

  let cumAngle = -Math.PI / 2;
  const paths = segments.map((seg, i) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return (
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={seg.color}
      />
    );
  });

  return (
    <svg width={size} height={size}>
      {paths}
      <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
    </svg>
  );
};

export const HBarChart = ({ data, color, title }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ fontSize: 17, fontWeight: 700, color: BRAND.blueDark, marginBottom: 16 }}>
        {title}
      </h3>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 10, gap: 12 }}>
          <span style={{ width: 52, fontSize: 12, color: "#616161", textAlign: "right" }}>
            {d.label}
          </span>
          <div style={{ flex: 1, background: "#F5F5F5", borderRadius: 4, height: 22 }}>
            <div
              style={{
                width: `${(d.value / max) * 100}%`,
                background: color,
                height: "100%",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 6,
              }}
            >
              <span style={{ fontSize: 11, color: "white", fontWeight: 700 }}>{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LocationDashboard = ({ loc, data, monthYear }) => {
  const trainings = data.trainings ?? [];
  const visitors = data.visitors ?? [];
  const assessments = data.assessments ?? [];
  const events = data.events ?? [];
  const collaborations = data.collaborations ?? [];

  const discoveryOrgs = new Set(visitors.map((v) => v.company).filter(Boolean)).size;
  const trainingOrgs = new Set(trainings.map((t) => t.organization_name).filter(Boolean)).size;
  const assessmentOrgs = new Set(assessments.map((a) => a.organization_name).filter(Boolean)).size;

  const performanceScore =
    data.performanceScore ??
    Math.min(
      100,
      Math.round(
        trainings.length * 2 +
          visitors.length * 0.5 +
          assessments.length * 3 +
          events.length * 2 +
          collaborations.length * 2,
      ),
    );

  const annualSegments = [
    { value: trainings.length, color: BRAND.blue, label: "Trainings" },
    { value: visitors.length, color: BRAND.accent, label: "Visitors" },
    { value: assessments.length, color: BRAND.green, label: "Assessments" },
  ];

  const statRows = [
    { label: "In Discovery", orgs: discoveryOrgs, benes: visitors.length, color: BRAND.blue },
    { label: "Training", orgs: trainingOrgs, benes: trainings.length, color: BRAND.green },
    { label: "Assessments", orgs: assessmentOrgs, benes: assessments.length, color: "#E65100" },
  ];

  return (
    <div>
      <h2
        style={{
          margin: "0 0 6px",
          fontSize: 28,
          fontWeight: 800,
          color: BRAND.blue,
        }}
      >
        i-Factory Network, {loc}
      </h2>
      <div
        style={{
          border: `3px solid ${BRAND.blue}`,
          borderRadius: 14,
          overflow: "hidden",
          marginTop: 20,
        }}
      >
        <div
          style={{
            background: BRAND.blueDark,
            color: "white",
            padding: "14px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800 }}>
            iFactory Network {loc} - Performance Analysis
          </div>
          <div style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>
            • Month - {monthYear}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 180px",
            gap: 16,
            padding: 20,
            background: "#FAFAFA",
          }}
        >
          <div>
            <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#616161", marginBottom: 6 }}>
              <span style={{ width: 80 }}>Organizations</span>
              <span>Beneficiaries</span>
            </div>
            {statRows.map((row) => (
              <div key={row.label} style={{ display: "flex", marginBottom: 6 }}>
                <div
                  style={{
                    background: BRAND.blue,
                    color: "white",
                    fontSize: 9,
                    fontWeight: 700,
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    padding: "4px 3px",
                    borderRadius: "4px 0 0 4px",
                    width: 22,
                    textAlign: "center",
                  }}
                >
                  {row.label}
                </div>
                <div style={{ display: "flex", flex: 1, gap: 2 }}>
                  {[row.orgs, row.benes].map((val, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        background: "white",
                        textAlign: "center",
                        padding: "8px 4px",
                        fontWeight: 800,
                        fontSize: 20,
                        color: row.color,
                      }}
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 10,
                background: "white",
                borderRadius: 8,
                padding: 8,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#616161" }}>Performance Score</div>
              <Gauge value={performanceScore} />
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.blueDark, marginBottom: 8 }}>
              Annual Data Analysis
            </div>
            <Donut segments={annualSegments} size={110} />
            <div style={{ marginTop: 10, fontSize: 11, color: "#616161" }}>
              {annualSegments.map((s) => (
                <span key={s.label} style={{ marginRight: 12 }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: s.color,
                      marginRight: 4,
                    }}
                  />
                  {s.label}: {s.value}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: BRAND.blueDark, marginBottom: 8 }}>
              Outreach Activities
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Events", value: events.length },
                { label: "Collaboration", value: collaborations.length },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    background: BRAND.blueLight,
                    borderRadius: 8,
                    padding: "8px 6px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color: BRAND.blue }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: "#616161" }}>{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.blueDark, marginBottom: 6 }}>
              Digital Maturity Assessment
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#616161", marginBottom: 4 }}>
              List of Companies
            </div>
            <div style={{ maxHeight: 140, overflowY: "auto", fontSize: 10 }}>
              {(data.dmaCompanies || []).map((c, i) => (
                <div key={i} style={{ padding: "3px 6px", background: i % 2 ? "white" : "#F5F5F5" }}>
                  {c}
                </div>
              ))}
              {(!data.dmaCompanies || data.dmaCompanies.length === 0) && (
                <div style={{ color: "#BDBDBD", padding: 4 }}>No assessments this month</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDashboard;
