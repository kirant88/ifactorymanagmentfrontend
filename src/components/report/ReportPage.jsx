import React from "react";
import { BRAND, HEADER_LOGO } from "../../constants/reportConstants";
import PageFooter from "./PageFooter";

export const ChevronAccent = ({ size = 28 }) => (
  <svg width={size * 2.2} height={size} viewBox="0 0 80 28" aria-hidden="true">
    <path d="M4 14 L18 4 L18 24 Z" fill={BRAND.blue} opacity="1" />
    <path d="M28 14 L42 4 L42 24 Z" fill={BRAND.blue} opacity="0.65" />
    <path d="M52 14 L66 4 L66 24 Z" fill="none" stroke={BRAND.blue} strokeWidth="2.5" />
  </svg>
);

export const ReportPageHeader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
      paddingBottom: 12,
      borderBottom: "1px solid #D0D7DE",
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
        fontSize: 15,
        fontWeight: 700,
        color: BRAND.purple,
        borderBottom: `2px solid ${BRAND.purple}`,
        paddingBottom: 2,
      }}
    >
      C4i4 Lab
    </span>
  </div>
);

export const SectionTitle = ({ children, style = {} }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
      ...style,
    }}
  >
    <h2
      style={{
        margin: 0,
        fontSize: 26,
        fontWeight: 800,
        color: BRAND.blue,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </h2>
    <ChevronAccent />
  </div>
);

const ReportPage = ({
  children,
  className = "",
  pageNumber,
  showHeader = true,
  showFooter = true,
}) => (
  <section
    className={`report-page ${className}`}
    style={{
      background: "white",
      marginBottom: 24,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      borderRadius: 4,
      minHeight: 900,
      position: "relative",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      padding: 0,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        flex: 1,
        padding: showHeader ? "28px 40px 24px" : "36px 48px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      {showHeader && <ReportPageHeader />}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
    {showFooter && pageNumber != null && <PageFooter pageNumber={pageNumber} />}
  </section>
);

export default ReportPage;
