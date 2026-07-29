import React from "react";
import { NETWORK_DESCRIPTION, HEADER_LOGO } from "../../constants/reportConstants";
import PageFooter, { formatPageNo } from "./PageFooter";
import IndiaNetworkMap from "./IndiaNetworkMap";

const CARD_BG = "#E8F2FA";
const TEXT_BLUE = "#2B6A9A";
const PURPLE = "#6A1B9A";
const HEADER_LINE = "#1E5FA8";

/**
 * i-Factory Network page — matches PDF layout with SVG India map
 * (no reference PNG import for the map).
 */
const NetworkPage = ({ pageNumber = 1 }) => {
  return (
    <section
      className="report-page network-page"
      style={{
        background: "#FFFFFF",
        marginBottom: 24,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        borderRadius: 4,
        overflow: "hidden",
        padding: 0,
        minHeight: 900,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 36px 12px",
          borderBottom: `1.5px solid ${HEADER_LINE}`,
          flexShrink: 0,
        }}
      >
        <img
          src={HEADER_LOGO}
          alt="i-Factory Network"
          style={{ height: 44, objectFit: "contain" }}
        />
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: PURPLE,
            fontFamily: "'Segoe UI', Montserrat, Arial, sans-serif",
          }}
        >
          C4i4 Lab
        </span>
      </div>

      {/* Intro card — title + description */}
      <div style={{ padding: "20px 36px 4px", flexShrink: 0 }}>
        <div
          style={{
            background: CARD_BG,
            borderRadius: 12,
            padding: "20px 28px 22px",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: 28,
              fontWeight: 800,
              color: "#1A1A1A",
              fontFamily: "'Segoe UI', Montserrat, Arial, sans-serif",
              textAlign: "left",
            }}
          >
            i-Factory Network
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.7,
              color: TEXT_BLUE,
              fontFamily: "'Segoe UI', Montserrat, Arial, sans-serif",
              textAlign: "left",
            }}
          >
            {NETWORK_DESCRIPTION}
          </p>
        </div>
      </div>

      {/* SVG India map with location notations */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 12px 8px",
          minHeight: 0,
          position: "relative",
        }}
      >
        <IndiaNetworkMap />
      </div>

      <PageFooter
        pageNumber={
          typeof pageNumber === "number" ? formatPageNo(pageNumber) : pageNumber
        }
      />
    </section>
  );
};

export default NetworkPage;
