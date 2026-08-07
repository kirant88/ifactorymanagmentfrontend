import React from "react";
import { sortLocationsByPreferred } from "../../constants/reportConstants";

const TOC_BLUE = "#2F80C4";
const TOC_BLUE_LIGHT = "#8EC4E8";

/** Dot chevron pattern matching the PDF contents page */
const DotChevron = ({ color = TOC_BLUE_LIGHT, flip = false, size = 1 }) => {
  const rows = [
    [0],
    [0, 1],
    [0, 1, 2],
    [0, 1, 2, 3],
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3],
    [0, 1, 2],
    [0, 1],
    [0],
  ];

  const dot = 5 * size;
  const gap = 7 * size;

  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexDirection: "column",
        gap: gap * 0.55,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      {rows.map((cols, ri) => (
        <div key={ri} style={{ display: "flex", gap: gap * 0.55 }}>
          {cols.map((c) => (
            <span
              key={c}
              style={{
                width: dot,
                height: dot,
                borderRadius: "50%",
                background: color,
                display: "block",
                opacity: 0.85 - c * 0.08,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const ChevronIcon = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
    <path d="M1 1 L7 7 L1 13" stroke={TOC_BLUE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 1 L14 7 L8 13" stroke={TOC_BLUE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Contents page matching pdfimage2.png layout (CSS only, no image).
 */
const ContentsPage = ({ locations = [] }) => {
  const orderedLocations = sortLocationsByPreferred(locations);

  const items = [
    { primary: "About i-Factory Network &", secondary: "Offerings" },
    { primary: "Key Achievements" },
    ...orderedLocations.map((loc) => {
      const isPune = /pune/i.test(loc);
      return {
        primary: isPune ? "i-Factory Lab" : "i-Factory Network",
        secondary: loc,
      };
    }),
    { primary: "Program Summary" },
    { primary: "Contact Us" },
  ];

  return (
    <section
      className="report-page contents-page"
      style={{
        display: "flex",
        minHeight: 900,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
        background: "#FFFFFF",
        position: "relative",
      }}
    >
      {/* Left blue sidebar */}
      <div
        style={{
          width: "25%",
          minWidth: 150,
          background: TOC_BLUE,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: 28, left: 20 }}>
          <DotChevron color="rgba(255,255,255,0.55)" size={0.85} />
        </div>

        <div
          style={{
            color: "#FFFFFF",
            fontSize: "80px",
            fontWeight: 900,
            letterSpacing: "0.12em",
            fontFamily: "'Segoe UI', Montserrat, Arial, Helvetica, sans-serif",
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          CONTENTS
        </div>
      </div>

      {/* Thin blue separator (partial height like PDF) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "28%",
          top: "2%",
          height: "70%",
          width: 3,
          background: TOC_BLUE_LIGHT,
          zIndex: 1,
        }}
      />

      {/* Right list */}
      <div
        style={{
          flex: 1,
          padding: "10px 70px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 25,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span style={{ marginTop: 4, flexShrink: 0 }}>
              <ChevronIcon />
            </span>
            <div
              style={{
                fontFamily: "'Segoe UI', Montserrat, Arial, Helvetica, sans-serif",
                color: "#1A1A1A",
                lineHeight: 1.25,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: item.secondary ? 500 : 600,
                }}
              >
                {item.primary}
              </div>
              {item.secondary && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 2,
                  }}
                >
                  {item.secondary}
                </div>
              )}
            </div>
          </div>
        ))}

        <div style={{ position: "absolute", right: 28, bottom: 28 }}>
          <DotChevron color={TOC_BLUE_LIGHT} flip size={0.9} />
        </div>
      </div>
    </section>
  );
};

export default ContentsPage;
