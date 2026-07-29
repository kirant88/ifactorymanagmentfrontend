import React from "react";

const PAGE_BLUE = "#1E5FA8";

/** Format as 01, 02, ... 10 */
export const formatPageNo = (n) => String(n).padStart(2, "0");

/**
 * PDF-style footer: blue bar, white underline, "Page No.XX"
 * Used on all numbered pages (not cover / contents).
 */
const PageFooter = ({ pageNumber }) => {
  if (pageNumber == null || pageNumber === "") return null;

  const label =
    typeof pageNumber === "number" ? formatPageNo(pageNumber) : pageNumber;

  return (
    <div
      className="report-page-footer"
      style={{
        background: PAGE_BLUE,
        padding: "16px 36px 12px",
        marginTop: "auto",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: 2,
          background: "#FFFFFF",
          width: "100%",
          marginBottom: 10,
        }}
      />
      <div
        style={{
          textAlign: "right",
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "'Segoe UI', Arial, Helvetica, sans-serif",
          letterSpacing: 0.3,
        }}
      >
        Page No.{label}
      </div>
    </div>
  );
};

export default PageFooter;
