import React from "react";
import coverReference from "../../assets/pdfimages/cover-reference.png";

/** Exact blue sampled from cover-reference.png behind the date text */
const COVER_BLUE = "#057BC2";

/**
 * Cover = official artwork (white underline under Network is pixel-identical).
 * Baked-in JUNE / 2026 are masked and replaced with the selected month/year.
 */
const CoverPage = ({ monthYear }) => {
  // monthYear is like "July 2026"
  const parts = monthYear.trim().split(/\s+/);
  const monthLabel = (parts[0] || "").toUpperCase();
  const yearLabel = (parts[1] || "").toUpperCase();

  return (
    <section
      className="report-page cover-page"
      style={{
        position: "relative",
        width: "100%",
        marginBottom: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        borderRadius: 4,
        overflow: "hidden",
        padding: 0,
        background: COVER_BLUE,
        lineHeight: 0,
      }}
    >
      <img
        src={coverReference}
        alt="i-Factory Network Report Cover"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />

      {/*
        Mask baked-in stacked date (JUNE + 2026) from cover artwork.
        Measured from cover-reference.png (584×815):
          JUNE  → y 36.3%–38.2%
          2026  → y 39.4%–41.2%
          x     → ~6.7%–17%
      */}
      <div
        style={{
          position: "absolute",
          left: "5.5%",
          top: "35.8%",
          width: "22%",
          height: "6.2%",
          backgroundColor: COVER_BLUE,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.15em",
          lineHeight: 1.15,
          paddingLeft: "1.2%",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(12px, 2.05vw, 18px)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontFamily: "'Segoe UI', Montserrat, Arial, Helvetica, sans-serif",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {monthLabel}
        </span>
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "clamp(12px, 2.05vw, 18px)",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontFamily: "'Segoe UI', Montserrat, Arial, Helvetica, sans-serif",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {yearLabel}
        </span>
      </div>
    </section>
  );
};

export default CoverPage;
